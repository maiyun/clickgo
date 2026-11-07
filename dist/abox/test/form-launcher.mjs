// Run: node dist/abox/test/form-launcher.mjs
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
const pointer = await import('../../../node_modules/@litert/pointer/dist/index.esm.js');
const source = await readFile(process.argv[2] ?? new URL('../form/system.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const hiddenEvents = [];
const runs = [];
let root;
const scope = {
    exports: {}, document, window,
    requestAnimationFrame(callback) { callback(); },
    setTimeout() { return 0; }, clearTimeout() {},
};
vm.runInNewContext(compiled, scope);
const dependencies = {
    clickgo: { modules: { pointer, vue } },
    info: { locale: { en: { search: 'Search', cancel: 'Cancel', ok: 'OK' } } },
    lCore: { config: { locale: 'en', 'launcher.list': [
        { name: 'App', path: '/app', icon: '' },
        { name: 'Folder', list: [{ name: 'Child', path: '/child', icon: '' }] },
    ] }, async trigger(event, value) { if (event === 'launcherShowChanged' && !value) hiddenEvents.push(value); } },
    lTask: { async run(...args) { runs.push(args); } },
    lTool: { lang: { getTag: x => x, getDirection: () => 'ltr' } },
    lDom: { is: {} }, state: { sysId: 'system' },
    changeFocus: async () => {}, getMaxZIndexID: async () => null,
    refreshNotifyPosition() {}, setSimpleSystemTaskRoot() {}, setLauncherRoot(value) { root = value; },
};
const system = scope.exports.createSystemRuntime(dependencies);
document.querySelector('#cg-launcher').remove();
system.init();
const list = document.querySelector('.cg-launcher-list');
const search = document.querySelector('.cg-launcher-search');

function event(target, type, x, y, button = 0) {
    const e = new window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button, view: window });
    Object.defineProperties(e, { pointerId: { value: 1 }, pointerType: { value: 'mouse' } });
    target.dispatchEvent(e);
}
async function click(target, { start = [100, 200], end = start, cancel = false, button = 0 } = {}) {
    system.showLauncher();
    event(target, 'pointerdown', ...start, button);
    event(target, cancel ? 'pointercancel' : 'pointerup', ...end, button);
    if (!cancel) { event(target, 'click', ...end, button); }
    await vue.nextTick();
}
await click(list);
assert.equal(hiddenEvents.length, 1, 'stationary list blank click closes');
await click(list, { end: [101, 201] });
assert.equal(hiddenEvents.length, 2, 'minor pointer movement still counts as a click');
await click(list, { start: [100.4, 200.4], end: [100, 200] });
assert.equal(hiddenEvents.length, 3, 'fractional pointer coordinates do not reject a click');
await click(list, { end: [120, 180] });
await click(list, { cancel: true });
await click(list, { button: 2 });
assert.equal(hiddenEvents.length, 3, 'diagonal drag, cancellation and right click do not close');
await click(search);
await click(document.querySelector('.cg-launcher-space'));
assert.equal(hiddenEvents.length, 5, 'search padding and item spacers close');
await click(document.querySelector('input'));
assert.equal(hiddenEvents.length, 5, 'search input stays interactive');
await click(document.querySelector('.cg-launcher-icon'), { end: [101, 201] });
assert.equal(hiddenEvents.length, 6);
assert.deepEqual(runs.map(args => args[1]), ['/app'], 'app runs once without a bubbled blank click');
const folder = document.querySelector('.cg-launcher-folder > div');
for (const target of folder.querySelectorAll('.cg-launcher-icon, .cg-launcher-inner, .cg-launcher-item, .cg-launcher-space')) {
    await click(target);
    assert.equal(root.folderName, 'Folder', 'every collapsed preview target opens its folder');
    assert.equal(hiddenEvents.length, 6, 'collapsed previews do not dismiss the launcher');
    assert.deepEqual(runs.map(args => args[1]), ['/app'], 'collapsed previews never start a child app');
    await click(search);
}
await click(folder, { end: [101, 201] });
assert.equal(root.folderName, 'Folder');
await click(search);
assert.equal(root.folderName, '', 'blank click closes the folder before the launcher');
assert.equal(hiddenEvents.length, 6);
await click(folder);
await click(folder.querySelector('.cg-launcher-icon'), { end: [101, 201] });
assert.equal(hiddenEvents.length, 7);
assert.deepEqual(runs.map(args => args[1]), ['/app', '/child'], 'folder child runs once');
assert.deepEqual(errors, [], 'event handlers do not throw');

// Invalid and concurrent requests must settle without changing an active confirmation.
const content = document.getElementById('cg-confirm-content');
const cancel = document.getElementById('cg-confirm-cancel');
const ok = document.getElementById('cg-confirm-ok');
assert.equal(await Promise.race([
    system.superConfirm('invalid', 'unauthorized'),
    new Promise((_, reject) => setTimeout(() => reject(new Error('invalid system ID did not settle')), 100)),
]), false);
assert.equal(system.elements.confirm.style.display, 'none');
const firstConfirm = system.superConfirm('system', 'first request');
assert.equal(content.innerHTML, 'first request');
assert.equal(await system.superConfirm('system', 'second request'), false);
assert.equal(content.innerHTML, 'first request', 'concurrent request cannot replace active content');
ok.click();
assert.equal(await firstConfirm, true, 'first request retains its own handler');
assert.equal(system.elements.confirm.style.display, 'none');
const nextConfirm = system.superConfirm('system', 'next request');
assert.equal(content.innerHTML, 'next request', 'completed handler permits another request');
cancel.click();
assert.equal(await nextConfirm, false);
assert.equal(system.elements.confirm.style.display, 'none');

dom.window.close();
console.log('Launcher blank areas, pointer tolerance, drag/cancel, input, folders and single app launch passed.');

// --- 验证实际运行时的显示状态、异步时序和键盘回调。 ---
const notifications = [];
const frames = [];
const timers = new Map();
let timerId = 0;
const delayedScope = {
    exports: {}, document, window: { innerWidth: 800, innerHeight: 600,
        setTimeout: callback => { timers.set(++timerId, callback); return timerId; } },
    requestAnimationFrame: callback => frames.push(callback),
    setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id),
};
vm.runInNewContext(compiled, delayedScope);
let launcher;
const display = delayedScope.exports.createSystemRuntime({ ...dependencies,
    lCore: { ...dependencies.lCore, trigger: async (...args) => notifications.push(args) },
    lDom: { is: { keyboard: false } },
    setLauncherRoot(value) { launcher = value; },
});
// The running Vue launcher is shared only as a dependency for close cleanup.
display.init();
launcher.folderName = 'Folder';
launcher.name = 'search';
launcher.closeFolder = function() { this.folderName = ''; };
assert.equal(display.getLauncherShow(), false);
display.hideLauncher();
display.showLauncher();
display.showLauncher();
assert.equal(display.getLauncherShow(), true);
assert.equal(display.elements.launcher.style.display, 'flex');
display.hideLauncher();
frames.splice(0).forEach(callback => callback());
assert.equal(display.elements.launcher.classList.contains('cg-show'), false);
display.hideLauncher();
assert.equal(timers.size, 1);
display.showLauncher();
assert.equal(timers.size, 0);
frames.splice(0).forEach(callback => callback());
assert.equal(display.elements.launcher.classList.contains('cg-show'), true);
assert.equal(launcher.name, 'search');
display.hideLauncher();
[...timers.values()].forEach(callback => callback());
timers.clear();
assert.equal(display.elements.launcher.style.display, 'none');
assert.equal(launcher.folderName, '');
assert.equal(launcher.name, '');
assert.deepEqual(notifications, [
    ['launcherShowChanged', true], ['launcherShowChanged', false],
    ['launcherShowChanged', true], ['launcherShowChanged', false],
]);
display.showKeyboard();
display.hideKeyboard();
frames.splice(0).forEach(callback => callback());
assert.equal(display.elements.keyboard.style.opacity, '0', 'stale first frame cannot show hidden keyboard');
display.showKeyboard();
assert.equal(timers.size, 0, 'reopening cancels hide timer');
frames.splice(0).forEach(callback => callback());
frames.splice(0).forEach(callback => callback());
assert.equal(display.elements.keyboard.style.opacity, '1');
assert.equal(display.elements.keyboard.style.display, 'flex');
display.hideKeyboard();
display.showKeyboard();
[...timers.values()].forEach(callback => callback());
assert.equal(display.elements.keyboard.style.display, 'flex', 'old hide cannot close reopened keyboard');

// A second pending keyboard frame must also be invalidated by hide.
frames.splice(0).forEach(callback => callback());
display.hideKeyboard();
display.showKeyboard();
frames.shift()();
display.hideKeyboard();
frames.splice(0).forEach(callback => callback());
assert.equal(display.elements.keyboard.style.opacity, '0', 'stale second frame cannot reveal the keyboard');

// Closing and immediately reopening the same folder invalidates both old callbacks.
const folderFrames = [];
const folderTimers = [];
const configs = [];
const folderScope = { exports: {}, document, window,
    requestAnimationFrame: callback => folderFrames.push(callback),
    setTimeout: callback => { folderTimers.push(callback); return folderTimers.length; }, clearTimeout() {} };
vm.runInNewContext(compiled, folderScope);
const folderSystem = folderScope.exports.createSystemRuntime({ ...dependencies,
    clickgo: { modules: { pointer: { click: (e, callback) => callback(), move() {} },
        vue: { createApp(config) { configs.push(config); return { mount() {} }; } } } },
});
folderSystem.init();
const methods = configs[1].methods;
const container = document.createElement('div');
const folderElement = document.createElement('div');
container.append(folderElement);
document.body.append(container);
const folderRoot = { folderName: '', closeFolder: methods.closeFolder };
const folderEvent = { currentTarget: container, target: folderElement, stopPropagation() {} };
methods.openFolder.call(folderRoot, folderEvent, { name: 'First' });
methods.closeFolder.call(folderRoot);
methods.openFolder.call(folderRoot, folderEvent, { name: 'Second' });
folderTimers.splice(0).forEach(callback => callback());
folderFrames.splice(0).forEach(callback => callback());
assert.equal(folderElement.style.position, 'fixed', 'old close cleanup must not reset reopened folder');
assert.equal(folderElement.classList.contains('cg-show'), true, 'reopened folder retains its animation');
methods.closeFolder.call(folderRoot);
folderFrames.splice(0).forEach(callback => callback());
assert.equal(folderElement.classList.contains('cg-show'), false, 'old opening frame cannot reopen a closed folder');

// --- 非 root 应用、自定义任务栏与宿主均接收通知，异步应用不阻塞窗体。 ---
const coreSource = await readFile(new URL('../../lib/core.ts', import.meta.url), 'utf8');
const coreTree = ts.createSourceFile('core.ts', coreSource, ts.ScriptTarget.ES2022, true);
const triggerSource = coreTree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'trigger').getText(coreTree);
const delivered = [];
const routeScope = {
    exports: {}, sysId: 'system',
    boot: { onLauncherShowChanged: state => delivered.push(['boot', state]) },
    lTask: { getOriginList: async () => ({
        ordinary: { class: { onLauncherShowChanged: state => { delivered.push(['app', state]); return new Promise(() => {}); } },
            forms: { bar: { vroot: { onLauncherShowChanged: state => delivered.push(['form', state]) } } } },
    }) },
};
vm.runInNewContext(ts.transpileModule(triggerSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, routeScope);
await routeScope.exports.trigger('launcherShowChanged', true);
await routeScope.exports.trigger('launcherShowChanged', false);
assert.deepEqual(delivered, [
    ['boot', true], ['app', true], ['form', true],
    ['boot', false], ['app', false], ['form', false],
]);
console.log('Launcher state query, broadcast, duplicate calls and close/reopen animation ordering passed.');
