// Run: node test/form-launcher.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const dom = new JSDOM('<!doctype html><html><body><div id="cg-launcher"></div></body></html>');
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'Event', 'CustomEvent']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: dom.window[name] });
}
const errors = [];
window.addEventListener('error', e => errors.push(e.error));
const vue = await import('vue');
const pointer = await import('../node_modules/@litert/pointer/dist/index.esm.js');
const source = await readFile(process.argv[2] ?? new URL('../dist/lib/form.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('form.ts', source, ts.ScriptTarget.ES2022, true);
let config;
function find(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === 'launcherApp') {
        config = node.initializer.arguments[0].getText(tree);
    }
    ts.forEachChild(node, find);
}
find(tree);
assert.ok(config, 'load the actual launcher template and handlers');
let hidden = 0;
const runs = [];
const exports = {};
const scope = {
    exports, document,
    clickgo: { modules: { pointer } },
    info: { locale: { en: { search: 'Search' } } },
    lCore: { config: { locale: 'en', 'launcher.list': [
        { name: 'App', path: '/app', icon: '' },
        { name: 'Folder', list: [{ name: 'Child', path: '/child', icon: '' }] },
    ] } },
    lTask: { async run(...args) { runs.push(args); } },
    sysId: 'system',
    hideLauncher() { ++hidden; },
    requestAnimationFrame(callback) { callback(); },
    setTimeout() { return 0; },
    launcherRoot: null,
};
vm.runInNewContext(ts.transpileModule(`export default ${config};`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, scope);
const app = vue.createApp(exports.default);
const root = app.mount('#cg-launcher');
const list = document.querySelector('.cg-launcher-list');
const search = document.querySelector('.cg-launcher-search');

function event(target, type, x, y, button = 0) {
    const e = new window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button, view: window });
    Object.defineProperties(e, { pointerId: { value: 1 }, pointerType: { value: 'mouse' } });
    target.dispatchEvent(e);
}
async function click(target, { start = [100, 200], end = start, cancel = false, button = 0 } = {}) {
    event(target, 'pointerdown', ...start, button);
    event(target, cancel ? 'pointercancel' : 'pointerup', ...end, button);
    if (!cancel) { event(target, 'click', ...end, button); }
    await vue.nextTick();
}
await click(list);
assert.equal(hidden, 1, 'stationary list blank click closes');
await click(list, { end: [101, 201] });
assert.equal(hidden, 2, 'minor pointer movement still counts as a click');
await click(list, { start: [100.4, 200.4], end: [100, 200] });
assert.equal(hidden, 3, 'fractional pointer coordinates do not reject a click');
await click(list, { end: [120, 180] });
await click(list, { cancel: true });
await click(list, { button: 2 });
assert.equal(hidden, 3, 'diagonal drag, cancellation and right click do not close');
await click(search);
await click(document.querySelector('.cg-launcher-space'));
assert.equal(hidden, 5, 'search padding and item spacers close');
await click(document.querySelector('input'));
assert.equal(hidden, 5, 'search input stays interactive');
await click(document.querySelector('.cg-launcher-icon'), { end: [101, 201] });
assert.equal(hidden, 6);
assert.deepEqual(runs.map(args => args[1]), ['/app'], 'app runs once without a bubbled blank click');
const folder = document.querySelector('.cg-launcher-folder > div');
for (const target of folder.querySelectorAll('.cg-launcher-icon, .cg-launcher-inner, .cg-launcher-item, .cg-launcher-space')) {
    await click(target);
    assert.equal(root.folderName, 'Folder', 'every collapsed preview target opens its folder');
    assert.equal(hidden, 6, 'collapsed previews do not dismiss the launcher');
    assert.deepEqual(runs.map(args => args[1]), ['/app'], 'collapsed previews never start a child app');
    await click(search);
}
await click(folder, { end: [101, 201] });
assert.equal(root.folderName, 'Folder');
await click(search);
assert.equal(root.folderName, '', 'blank click closes the folder before the launcher');
assert.equal(hidden, 6);
await click(folder);
await click(folder.querySelector('.cg-launcher-icon'), { end: [101, 201] });
assert.equal(hidden, 7);
assert.deepEqual(runs.map(args => args[1]), ['/app', '/child'], 'folder child runs once');
assert.deepEqual(errors, [], 'event handlers do not throw');
app.unmount();
dom.window.close();
console.log('Launcher blank areas, pointer tolerance, drag/cancel, input, folders and single app launch passed.');
