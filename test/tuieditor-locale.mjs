import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { setImmediate } from 'node:timers/promises';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../dist/sources/control/tuieditor/code.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: false },
}).outputText;
const dom = new JSDOM('<!doctype html><html><body></body></html>');
const { document } = dom.window;
const requests = [];
const editors = [];
function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    return { promise, resolve, reject };
}
class AbstractControl {
    get locale() { return this.testLocale; }
    propBoolean(name) { return this.props[name] === true; }
    watch(name, callback, options) {
        this.watches.set(name, callback);
        if (options?.immediate) callback();
    }
    emit() {}
}
class Editor {
    constructor(options) {
        this.options = options;
        this.i18n = { get: key => key };
        options.el.appendChild(document.createElement('div'));
        editors.push(this);
    }
    insertToolbarItem() {}
}
let main;
const clickgo = {
    modules: {},
    getCdn: () => 'https://cdn.example',
    getDirname: () => 'https://app.example/clickgo',
    core: { getModule: () => main },
    control: { AbstractControl },
    tool: {
        loadScript(url) {
            const pending = deferred();
            requests.push({ url, ...pending });
            return pending.promise;
        },
    },
    dom: { createElement: name => document.createElement(name), watchStyle() {} },
};
// Build the actual shared module once, then evaluate controls independently as different tasks do.
const coreSource = await readFile(new URL('../dist/lib/core.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('core.ts', coreSource, ts.ScriptTarget.ES2022, true);
const names = new Set(['getModule', 'loadModule']);
const selected = tree.statements.filter(node =>
    (ts.isVariableStatement(node) && node.declarationList.declarations.some(item => item.name.getText(tree) === 'modules')) ||
    (ts.isFunctionDeclaration(node) && node.body && names.has(node.name?.text)));
const core = {};
vm.runInNewContext(ts.transpileModule(selected.map(node => node.getText(tree)).join('\n'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: false },
}).outputText, {
    exports: core, window: { toastui: { Editor } }, clickgo,
    lTool: { ...clickgo.tool, loadAssets: async () => true, loadStyle() {}, urlResolve: (base, path) => new URL(path, base).href },
});
const shared = await core.getModule('@toast-ui/editor');
main = Promise.resolve(shared);
function loadControl() {
    const exports = {};
    vm.runInNewContext(compiled, { exports, require: () => clickgo });
    return exports.default;
}
let Control = loadControl();
function create(locale) {
    const control = new Control();
    control.testLocale = locale;
    control.watches = new Map();
    control.element = document.createElement('div');
    const content = document.createElement('div');
    const pop = document.createElement('div');
    control.element.append(content, pop);
    control.refs = { content, pop };
    document.body.appendChild(control.element);
    return control;
}
await create('en').onMounted();
await create('ar').onMounted();
assert.equal(requests.length, 0, 'English and unsupported languages need no locale scripts');
assert.equal(editors.at(-1).options.language, 'en');
assert.equal(editors.at(-1).options.el.dir, 'rtl');

const base = deferred();
main = base.promise;
const first = create('sc');
Control = loadControl();
const second = create('sc');
const a = first.onMounted();
const b = second.onMounted();
assert.equal(requests.length, 0, 'locale registration waits for the main library');
base.resolve(shared);
await setImmediate();
assert.equal(requests.length, 1, 'independent task control modules share one pending language request');
assert.ok(requests[0].url.endsWith('/i18n/zh-cn.min.js'));
assert.equal(editors.length, 2, 'instances wait until their locale is registered');
requests[0].resolve(true);
await Promise.all([a, b]);
assert.equal(first.access.tuieditor.options.language, 'zh-CN');
assert.equal(second.access.tuieditor.options.language, 'zh-CN');
assert.notEqual(first.access.tuieditor, second.access.tuieditor);
await create('sc').onMounted();
assert.equal(requests.length, 1, 'ready locale scripts are reused across task control modules');

Control = loadControl();
await create('sc').onMounted();
assert.equal(requests.length, 1, 'a later task reuses the same completed language request');

first.testLocale = 'ja';
first.watches.get('locale')();
assert.equal(requests.length, 1, 'changing task locale does not reload an existing editor');
assert.equal(first.access.tuieditor.options.language, 'zh-CN');
main = Promise.resolve(shared);
const japanese = create('ja');
const c = japanese.onMounted();
await setImmediate();
assert.ok(requests.at(-1).url.endsWith('/i18n/ja-jp.min.js'));
requests.at(-1).resolve(true);
await c;
assert.equal(japanese.access.tuieditor.options.language, 'ja-JP', 'new editors use the current task language');

const french = create('fr');
const d = french.onMounted();
await setImmediate();
requests.at(-1).resolve(false);
await d;
assert.equal(french.access.tuieditor.options.language, 'en', 'locale failure falls back without disabling editing');
const beforeRetry = requests.length;
const retry = create('fr').onMounted();
await setImmediate();
assert.equal(requests.length, beforeRetry + 1, 'failed locale requests can be retried');
requests.at(-1).resolve(true);
await retry;
assert.equal(editors.at(-1).options.language, 'fr-FR');

const rejected = shared.loadLanguage('de-DE');
const rejectedWaiter = shared.loadLanguage('de-de');
requests.at(-1).reject(new Error('external loader rejected'));
assert.equal(await rejected, false);
assert.equal(await rejectedWaiter, false, 'external loader errors release all waiters');
const rejectedRetry = shared.loadLanguage('de-DE');
requests.at(-1).resolve(true);
assert.equal(await rejectedRetry, true, 'external errors do not poison the shared cache');

const removed = create('tc');
const e = removed.onMounted();
await setImmediate();
assert.ok(requests.at(-1).url.endsWith('/i18n/zh-tw.min.js'));
removed.element.remove();
const count = editors.length;
requests.at(-1).resolve(true);
await e;
assert.equal(editors.length, count, 'removed hosts do not receive late editor instances');

Control = loadControl();
main = Promise.resolve(null);
const missing = create('sc');
const beforeMissing = requests.length;
await missing.onMounted();
assert.equal(missing.notInit, true);
assert.equal(missing.isLoading, false);
assert.equal(requests.length, beforeMissing, 'a missing main library triggers no locale request');
console.log('Toast UI cross-task locale requests, reuse, fallback, retries and initialization language passed.');
