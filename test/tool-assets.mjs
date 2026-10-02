import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><head></head><body></body>', { url: 'https://example.test/' });
const source = await readFile(new URL('../dist/lib/tool.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('tool.ts', source, ts.ScriptTarget.ES2022, true);
const names = new Set(['getHeadElement', 'loadScript', 'loadScripts', 'loadLink', 'loadLinks', 'loadAssets']);
const nodes = tree.statements.filter(node =>
    (ts.isVariableStatement(node) && node.declarationList.declarations.some(item => item.name.getText(tree) === 'headElement')) ||
    (ts.isFunctionDeclaration(node) && node.body && names.has(node.name?.text)));
const api = {};
vm.runInNewContext(ts.transpileModule(nodes.map(node => node.getText(tree)).join('\n'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: api, document: dom.window.document });
const head = dom.window.document.head;
function finish(el, success = true) { el.dispatchEvent(new dom.window.Event(success ? 'load' : 'error')); }
async function tick() { await new Promise(resolve => setImmediate(resolve)); }

assert.equal(await api.loadAssets([]), true);
assert.equal(head.children.length, 0);
const urls = ['/base.js?file=theme.css', '/theme.CSS?version=1#dark', '/addon.js#theme.css', '/override.css#last'];
const events = [];
let complete = false;
const loading = api.loadAssets(urls, { loaded: (url, state) => events.push([url, state]) }).then(value => { complete = true; return value; });
const scripts = [...head.querySelectorAll('script')];
const links = [...head.querySelectorAll('link')];
assert.equal(scripts.length, 2);
assert.equal(links.length, 2);
assert.equal(head.children.length, 4, 'all JS and CSS requests start before awaiting a resource');
assert.deepEqual(scripts.map(el => el.getAttribute('src')), [urls[0], urls[2]], 'query/hash values do not change the resource type');
assert.deepEqual(links.map(el => el.getAttribute('href')), [urls[1], urls[3]], 'CSS insertion order and original URLs are preserved');
assert.ok(scripts.every(el => el.async === false), 'unified loader uses browser ordered script execution');
finish(scripts[1]); finish(links[1]); finish(links[0]);
await tick();
assert.equal(complete, false, 'the aggregate waits for every file, regardless of completion order');
finish(scripts[0]);
assert.equal(await loading, true);
assert.deepEqual(events.map(([url, state]) => `${url}:${state}`).sort(), urls.map(url => `${url}:1`).sort(), 'each resource reports its own result once');

head.replaceChildren();
const cssFailed = api.loadAssets(['/ok.js', '/missing.css']);
finish(head.querySelector('link'), false);
finish(head.querySelector('script'));
assert.equal(await cssFailed, false, 'CSS errors affect the aggregate result');
head.replaceChildren();
const jsFailed = api.loadAssets(['/missing.js', '/ok.css']);
finish(head.querySelector('script'), false);
finish(head.querySelector('link'));
assert.equal(await jsFailed, false, 'JS errors affect the aggregate result');
head.replaceChildren();
const legacy = api.loadScript('/legacy.js');
assert.equal(head.querySelector('script').async, true, 'existing single-script loading retains async behavior');
finish(head.querySelector('script'));
assert.equal(await legacy, true);
head.replaceChildren();
const batch = api.loadScripts(['/legacy-a.js', '/legacy-b.js']);
assert.ok([...head.querySelectorAll('script')].every(el => el.async === true), 'existing script batches retain async behavior by default');
for (const el of head.querySelectorAll('script')) finish(el);
await batch;
dom.window.close();
console.log('Unified asset loading, URL classification, order, concurrency, callbacks, errors and legacy behavior passed.');
