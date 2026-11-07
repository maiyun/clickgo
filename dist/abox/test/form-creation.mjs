import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<div id="forms"></div><div id="pops"></div>');
const { document } = dom.window;
async function load(path, modules) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const scope = { exports: {}, require: name => modules[name], document, window: dom.window, console: { error() {} }, Blob, setTimeout };
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    } }).outputText, scope);
    return scope.exports;
}
const viewModule = await load('../form/view.ts', {});
let reads = 0;
const tool = {
    stylePrepend: style => ({ prep: 'scope', style }),
    styleUrl2DataUrl: async (_path, style, read) => { await read('asset'); return style; },
    purify: x => x, layoutAddTagClassAndReTagName: x => x, layoutClassPrepend: x => x,
    eventsAttrWrap: x => x, teleportGlue: x => x, random: () => 'unique', RANDOM_LUN: '',
    getClassPrototype: () => ({ method: {}, access: {} }), clone: x => x,
    urlResolve: (path, file) => `${path.replace(/\/$/, '')}/${file}`,
    nextFrame: async () => {},
};
const runtime = viewModule.createViewRuntime({ lTool: tool, lDom: {}, lControl: {}, notify() {}, componentClass: class {} });
const cachedTask = { id: 'one', app: { package: { getContent: async () => {
    if (++reads === 1) { throw new Error('temporary'); } return 'ok';
} } } };
await assert.rejects(runtime.prepareView(cachedTask, '/a', '<x/>', 'css'), /temporary/);
await runtime.prepareView(cachedTask, '/a', '<x/>', 'css');
await runtime.prepareView(cachedTask, '/a', '<x/>', 'css');
assert.equal(reads, 2, 'failed work retries; successful work is shared');
const secondTask = { ...cachedTask, id: 'two' };
await runtime.prepareView(secondTask, '/a', '<x/>', 'css');
assert.equal(reads, 3, 'cache is isolated by task');

class LocalComponent {
    filename = '/component.js';
    components = {};
    emits = { done: null };
    packageFiles = { source: 'local' };
    props = { value: 'default' };
    slots = { default: true };
    access = { link: 'value' };
    content = 'kept';
}
const localRuntime = viewModule.createViewRuntime({ lTool: tool, lDom: { pushStyle() {} },
    lControl: { buildComponents: () => ({}) }, notify() {}, componentClass: LocalComponent });
const localTask = { id: 'local', app: { package: { getContent: async path => path.endsWith('.xml') ? '<div/>' : '' } } };
const built = await localRuntime.buildLocalComponents(localTask, 'form', 1, { 'local-component': LocalComponent });
const component = built['cg-local-component'];
const data = component.data();
assert.equal(data.content, 'kept');
for (const name of ['components', 'emits', 'packageFiles', 'props', 'slots', 'access']) {
    assert.equal(Object.hasOwn(data, name), false, `${name} must stay outside component data`);
}
assert.equal(component.props.value.default, 'default');
assert.equal(component.emits.done, null);


const elements = { list: document.querySelector('#forms'), popList: document.querySelector('#pops') };
let contents = [];
const task = { id: 't', forms: {}, app: { package: { getContent: async path => { contents.push(path); return '<cg-panel></cg-panel>'; } } } };
let currentTask = task;
let removedStyles = [];
let componentsCleared = 0;
let failComponents = false;
let mountMode = 'throw';
class AbstractForm { components = {}; access = {}; filename = '/form.js'; }
class AbstractPanel { components = {}; access = {}; filename = '/panel.js'; }
const core = { trigger: async () => {} };
const cleanup = { clearOwner() {} };
const form = await load('../../lib/form/create.ts', {
    '../../clickgo': { modules: { vue: { createApp: options => ({ config: {}, component() {}, mount() { if (mountMode === 'throw') { throw new Error('mount failed'); } options.mounted.call({ $nextTick: async () => {} }); }, unmount() {} }) } }, isNative: () => false },
    '../core': core, '../command': cleanup, '../task': { getOrigin: () => currentTask }, '../tool': tool,
    '../dom': { findParentByData: el => el.closest('[data-form-id]'), pushStyle() {}, removeStyle: (...args) => removedStyles.push(args),
        clearWatchStyle() {}, clearWatchProperty() {}, clearWatchPosition() {} },
    '../control': { buildComponents: () => ({}), clearComponents: () => componentsCleared++ },
    '../fs': {}, '../native': { clear() {} }, './abstract-form': { AbstractForm }, './abstract-panel': { AbstractPanel },
    './state': { state: { index: 0 }, info: {} }, './system': { elements, refreshLocaleDirection() {} },
    './window': { changeFocus() {} }, './notification': { notify() {} }, './dialog': {}, './popup': { cleanupPop() {} },
    './view': { prepareView: async (_t, _p, layout, style) => ({ layout, style, prep: '' }),
        buildLocalComponents: async () => { if (failComponents) { throw new Error('component failed'); } return {}; } },
});
await assert.rejects(form.create('t', AbstractForm, {}, { layout: '<cg-form></cg-form>', style: 'css' }), /mount failed/);
assert.equal(elements.list.children.length, 0);
assert.equal(elements.popList.children.length, 0);
assert.equal(componentsCleared, 1);
assert.equal(removedStyles.length, 1);
failComponents = true;
await assert.rejects(form.create('t', AbstractForm, {}, { layout: '<cg-form></cg-form>' }), /component failed/);
assert.equal(componentsCleared, 2, 'component-build failure clears form resources');
failComponents = false;
const wrap = document.createElement('div'); wrap.dataset.formId = 'f'; wrap.dataset.taskId = 't';
const host = document.createElement('div'); host.dataset.cgControl = 'panel'; wrap.append(host); elements.list.append(wrap);
task.forms.f = { vroot: { findex: 0 }, closed: false };
await assert.rejects(form.createPanel({ element: host, taskId: 't' }, 'child', { path: '/base' }), /mount failed/);
assert.deepEqual(contents.slice(-2), ['/base/child.xml', '/base/child.css']);
assert.equal(host.children.length, 0, 'failed panel mount removes container');
assert.equal(removedStyles.at(-1)[3], 'unique', 'panel cleanup is scoped to panel');
mountMode = 'missing-root';
await assert.rejects(form.createPanel({ element: host, taskId: 't' }, 'child', { path: '/base' }));
assert.equal(host.children.length, 0, 'asynchronous mounted failure rejects and cleans up');
let release;
task.app.package.getContent = () => new Promise(resolve => { release = resolve; });
const pending = form.createPanel({ element: host, taskId: 't' }, 'late', { path: '/base', style: 'css' });
host.remove();
release('<cg-panel></cg-panel>');
await assert.rejects(pending, /host removed/);
assert.equal(host.children.length, 0, 'removed panel host is not mounted after asynchronous preparation');
host.replaceWith(host);
wrap.append(host);
task.ending = true;
await assert.rejects(form.create('t', AbstractForm, {}, { layout: '<cg-form></cg-form>' }), /form.create: -1/);
await assert.rejects(form.createPanel({ element: host, taskId: 't' }, 'late', { path: '/base' }), /form.createPanel: -1/);
task.ending = false;
const endingPanel = form.createPanel({ element: host, taskId: 't' }, 'late', { path: '/base', style: 'css' });
task.ending = true;
release('<cg-panel></cg-panel>');
await assert.rejects(endingPanel, /task removed/);
assert.equal(host.children.length, 0, 'ending task cannot mount a panel after preparation');
task.ending = false;
const endingForm = form.create('t', '/late', {}, { style: 'css' });
task.ending = true;
release('<cg-form></cg-form>');
await assert.rejects(endingForm, /task removed/);
assert.equal(elements.popList.children.length, 0, 'ending task cannot create a form after preparation');
console.log('Form creation regression passed');
