import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const events = [];
const sizeWatch = new Map();
const pendingIcons = new Map();
const core = {
    config: { 'task.position': 'bottom', 'task.mode': 'bar', 'task.margin': 8 },
    trigger: async (...args) => { events.push(args); },
};
const form = { simpleSystemTaskRoot: { forms: {} }, notify() {}, getList: () => ({}),
    getMaxZIndexID: async () => null, changeFocus: async () => {},
    elements: { list: { querySelectorAll: () => [] } } };
const tick = [];
const clickgo = {
    modules: { vue: { reactive: value => value, watch() {}, nextTick: callback => {
        const promise = Promise.resolve().then(callback); tick.push(promise); return promise;
    } } },
    isNative: () => false,
};
const modules = {
    '../clickgo': clickgo, './core': core, './form': form,
    './tool': { clone: structuredClone, blob2DataUrl: async () => 'data:image/png;base64,icon' },
    './fs': { getContent: async (taskId, path) => {
        if (path === '/slow') return new Promise(resolve => pendingIcons.set(taskId, resolve));
        assert.ok(path.startsWith('/package/') || path.startsWith('/clickgo/'));
        return new Blob(['icon']);
    } },
    './control': { clearComponents() {} },
    './command': { clear() {} },
    './native': { clear() {} },
    './dom': {
        removeFromStyleList() {}, clearWatchSize() {}, clearWatch() {},
        watchSizeMulti: (taskId, el, callback) => { sizeWatch.set(el, { taskId, callback }); },
        unwatchSizeMulti: (taskId, el) => { sizeWatch.delete(el); },
    },
};
const source = await readFile(new URL('../dist/lib/task.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source + '\nexport const testState = { list, runtime };', {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports, require: name => modules[name] ?? {}, Blob, setTimeout, clearTimeout,
    window: { innerWidth: 800, innerHeight: 600 } });
const api = exports;
api.initSysId('sys');
api.init();
const calls = [];
const owner = {
    id: 'owner', class: { onTrayClick: id => calls.push(['app', id]), onTrayMenuClick: (id, cmd) => calls.push(['app-menu', id, cmd]) },
    forms: { main: { vroot: { onTrayClick: id => calls.push(['form', id]), onTrayMenuClick: (id, cmd) => calls.push(['form-menu', id, cmd]) } } },
};
api.testState.list.owner = owner;
api.testState.list.other = { id: 'other', forms: {} };
api.testState.runtime.other = { permissions: [] };
const input = { icon: '/package/res/icon.png', tip: 'Tray', menu: [
    { id: 'show', label: 'Show' }, { id: 'disabled', label: 'Disabled', disabled: true },
    { id: 'split', label: '', separator: true },
] };
const id = await api.createTray('owner', input);
assert.equal(typeof id, 'string');
input.menu[0].label = 'Changed externally';
assert.equal(api.getTrayList('owner')[id].menu[0].label, 'Show');
assert.equal(Object.keys(api.getTrayList('other')).length, 0);
assert.equal(await api.updateTray('other', id, { tip: 'Hijacked' }), false);
assert.equal(api.removeTray('other', id), false);
assert.equal(await api.activateTray('other', id), false);
assert.equal(await api.activateTray('owner', id), false);

function bar(taskId, formId, width, height) {
    const props = {};
    const el = { offsetWidth: width, offsetHeight: height };
    const vroot = { position: 'bottom', $el: el, $refs: { form: { setPropData: (key, value) => { props[key] = value; } } } };
    api.testState.list[taskId] = { id: taskId, forms: { [formId]: { vroot } } };
    return { props, el };
}
const first = bar('bar1', 'f1', 220, 44);
assert.equal(api.setSystem('bar1', 'f1'), true);
await Promise.all(tick);
assert.equal(first.props.width, 800);
assert.equal(first.props.top, 556);
assert.equal(api.systemTaskInfo.length, 44);
assert.equal(Object.keys(api.getTrayList('bar1')).length, 1);
const snapshot = api.getTrayList('bar1'); snapshot[id].menu[0].label = 'Hijacked';
assert.equal(api.getTrayList('owner')[id].menu[0].label, 'Show');
assert.equal(await api.activateTray('bar1', id, 'disabled'), false);
assert.equal(await api.activateTray('bar1', id, 'split'), false);
assert.equal(await api.activateTray('bar1', id, 'stale'), false);
assert.equal(await api.activateTray('bar1', id), true);
assert.equal(await api.activateTray('bar1', id, 'show'), true);
assert.equal(calls.length, 4);
core.config['task.mode'] = 'dock';
api.refreshSystemPosition();
await Promise.all(tick);
assert.deepEqual(first.props, { width: 0, height: 0, left: 290, top: 548 });
assert.equal(api.systemTaskInfo.length, 52);
first.el.offsetWidth = 300;
sizeWatch.get(first.el).callback();
await Promise.all(tick);
assert.equal(first.props.left, 250);
for (const [position, expected] of Object.entries({
    top: [250, 8, 52], left: [8, 278, 308], right: [492, 278, 308], bottom: [250, 548, 52],
})) {
    core.config['task.position'] = position;
    api.refreshSystemPosition(); await Promise.all(tick);
    assert.deepEqual([first.props.left, first.props.top, api.systemTaskInfo.length], expected);
}
// An old pending position update cannot move a replacement bar.
api.refreshSystemPosition();
const second = bar('bar2', 'f2', 100, 40);
api.setSystem('bar2', 'f2'); await Promise.all(tick);
assert.equal(sizeWatch.has(first.el), false);
assert.equal(sizeWatch.has(second.el), true);
assert.equal(second.props.left, 350);
assert.equal(await api.activateTray('bar1', id), false);
assert.equal(await api.activateTray('bar2', id), true);
const old = api.updateTray('owner', id, { icon: '/slow' });
await Promise.resolve();
await api.updateTray('owner', id, { icon: 'data:image/png;base64,new', tip: 'New' });
pendingIcons.get('owner')(new Blob(['old']));
assert.equal(await old, false);
assert.equal(api.getTrayList('owner')[id].icon, 'data:image/png;base64,new');
const deletedUpdate = api.updateTray('owner', id, { icon: '/slow' });
await Promise.resolve(); api.removeTray('owner', id);
pendingIcons.get('owner')(new Blob(['old']));
assert.equal(await deletedUpdate, false);
assert.equal(await api.activateTray('bar2', id), false);
const creation = api.createTray('owner', { icon: '/slow' });
await Promise.resolve(); delete api.testState.list.owner;
pendingIcons.get('owner')(new Blob(['old']));
assert.equal(await creation, false, 'late registration cannot resurrect an ended task');
assert.equal(Object.keys(api.getTrayList('sys')).length, 0);
await api.clearSystem('bar2');
assert.equal(sizeWatch.size, 0);
assert.equal(api.systemTaskInfo.length, 0);
assert.ok(events.some(event => event[0] === 'trayCreated'));
assert.ok(events.some(event => event[0] === 'trayChanged'));
assert.ok(events.some(event => event[0] === 'trayRemoved'));
console.log('Tray ownership, snapshot isolation, app/form delivery, disabled/stale commands, replacement, async races and four-edge Dock geometry passed.');

// Exercise real public event routing, including a taskbar without root permission.
const coreSource = await readFile(new URL('../dist/lib/core.ts', import.meta.url), 'utf8');
const coreExports = {};
vm.runInNewContext(ts.transpileModule(coreSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: coreExports, require: name => name === './task' ? api : (modules[name] ?? {}), window: { addEventListener() {} }, TextEncoder });
coreExports.initSysId('sys');
const delivered = [];
const observer = name => ({ onTrayCreated: (ownerId, trayId) => delivered.push([name, ownerId, trayId]) });
api.testState.list.owner = { class: observer('owner-app'), forms: { ownerForm: { vroot: observer('owner-form') } } };
api.testState.list.other = { class: observer('other'), forms: {} };
api.testState.list.root = { class: observer('root'), forms: {} };
api.testState.list.bar2.class = observer('system-app');
api.testState.list.bar2.forms.f2.vroot.onTrayCreated = observer('system-form').onTrayCreated;
api.testState.runtime.root = { permissions: ['root'] };
api.systemTaskInfo.taskId = 'bar2';
await coreExports.trigger('trayCreated', 'owner', 'tray100');
assert.deepEqual(delivered.map(item => item[0]).sort(), ['owner-app', 'owner-form', 'root', 'system-app', 'system-form'].sort());
assert.ok(delivered.every(item => item[1] === 'owner' && item[2] === 'tray100'));
api.systemTaskInfo.taskId = '';
delivered.length = 0;
await coreExports.trigger('trayCreated', 'owner', 'tray101');
assert.ok(!delivered.some(item => item[0].startsWith('system')));
console.log('Public tray events reach owner App/Form, root and the designated system taskbar; replacement removes event access.');

// Prompt/menus can change while an icon is loading without losing either update.
const mergedId = await api.createTray('owner', { icon: 'data:image/png;base64,initial' });
const pending = api.updateTray('owner', mergedId, { icon: '/slow' });
await Promise.resolve();
await api.updateTray('owner', mergedId, { tip: 'latest tip', menu: [
    { id: 'command', label: 'First', disabled: true, callback: () => {} },
    { id: 'command', label: 'Duplicate' },
] });
pendingIcons.get('owner')(new Blob(['merged']));
assert.equal(await pending, true);
const merged = api.getTrayList('owner')[mergedId];
assert.equal(merged.tip, 'latest tip');
assert.equal(merged.icon, 'data:image/png;base64,icon');
assert.equal(merged.menu.length, 1);
assert.equal('callback' in merged.menu[0], false);
api.removeTray('owner', mergedId);
console.log('Partial updates merge across pending icons and menus retain only public fields with unique command IDs.');

// Real task.end releases trays even when there are no application Forms left.
Object.assign(form, { getMaxZIndexID: async () => null, changeFocus: async () => {},
    elements: { list: { querySelectorAll: () => [] } } });
Object.assign(modules['./dom'], { removeFromStyleList() {}, clearWatchSize() {}, clearWatch() {} });
modules['./control'] = { clearComponents() {} };
modules['./native'] = { clear() {} };
api.testState.list.exiting = { id: 'exiting', class: {}, forms: {}, threads: {}, timers: {}, app: { package: { clear() {} } } };
const exitingId = await api.createTray('exiting', { icon: 'data:image/png;base64,exiting' });
const lateCreate = api.createTray('exiting', { icon: '/slow' });
await Promise.resolve();
await api.end('exiting');
pendingIcons.get('exiting')(new Blob(['late']));
assert.equal(await lateCreate, false);
assert.equal(api.getTrayList('sys')[exitingId], undefined);
assert.equal(api.testState.list.exiting, undefined);
console.log('Actual task termination removes registered trays and rejects in-flight registrations.');

// Escape is handled once by the shared popup service, preserving IME and focus.
const formSource = await readFile(new URL('../dist/lib/form.ts', import.meta.url), 'utf8');
const formAst = ts.createSourceFile('form.ts', formSource, ts.ScriptTarget.ES2022, true);
const popupHandler = formAst.statements.find(statement => ts.isFunctionDeclaration(statement) && statement.name?.text === 'keydownPop');
assert.ok(popupHandler);
const popInfo = { list: [], elList: [] };
let popHidden = 0, focusRestored = 0, popupFocused = 0, childFocused = 0, prevented = 0;
const popupContext = vm.createContext({ popInfo, hidePop: () => {
    ++popHidden;
    popInfo.list.length = 0;
    popInfo.elList.length = 0;
} });
vm.runInContext(ts.transpileModule(popupHandler.getText(formAst), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText, popupContext);
const key = (name, isComposing = false) => ({ key: name, isComposing, preventDefault: () => { ++prevented; } });
popupContext.keydownPop(key('Escape'));
assert.equal(popHidden, 0);
popInfo.list = [
    { focus: () => { ++popupFocused; } },
    { focus: () => { ++popupFocused; } },
];
popInfo.elList = [
    { focus: options => {
        assert.equal(popHidden, 1);
        assert.equal(popInfo.list.length, 0);
        assert.equal(popInfo.elList.length, 0);
        assert.equal(options.preventScroll, true);
        ++focusRestored;
    } },
    { focus: () => { ++childFocused; } },
];
popupContext.keydownPop(key('Escape', true));
popupContext.keydownPop(key('Enter'));
assert.equal(popHidden, 0);
assert.equal(focusRestored, 0);
assert.equal(prevented, 0);
popupContext.keydownPop(key('Escape'));
assert.equal(popHidden, 1);
assert.equal(focusRestored, 1);
assert.equal(popupFocused, 0);
assert.equal(childFocused, 0);
assert.equal(prevented, 1);
popupContext.keydownPop(key('Escape'));
assert.equal(popHidden, 1);
assert.equal(focusRestored, 1);
assert.equal(prevented, 1);
console.log('Shared popup Escape handling ignores IME, closes once and restores the trigger focus.');

// Tray keyboard and lifecycle use the same public popup path as pointer menus.
const trayEvents = [], trayPops = [];
clickgo.control = { AbstractControl: class {
    constructor() { this.slots = {}; this.refs = { pop: {} }; this.element = { dataset: {} }; }
    emit(...args) { trayEvents.push(args); }
    watch(_name, callback) { this.menuWatcher = callback; }
} };
clickgo.form = { hidePop: () => trayPops.push('hide'), showPop: (...args) => trayPops.push(args) };
const traySource = await readFile(new URL('../dist/sources/control/task-tray/code.ts', import.meta.url), 'utf8');
const trayExports = {};
vm.runInNewContext(ts.transpileModule(traySource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: trayExports, require: () => clickgo });
const trayControl = new trayExports.default();
trayControl.keydown({ ...key('Enter'), repeat: true });
assert.equal(trayEvents.length, 0);
trayControl.keydown(key('Enter'));
trayControl.keydown(key(' '));
assert.deepEqual(trayEvents.map(event => event[0]), ['activate', 'activate']);
trayControl.keydown(key('ContextMenu'));
assert.equal(trayPops.filter(Array.isArray).length, 0);
trayControl.props.menu = [{ id: 'show', label: 'Show' }];
trayControl.keydown({ ...key('F10'), shiftKey: true });
assert.equal(trayPops.filter(Array.isArray).length, 1);
trayControl.select({ id: 'disabled', disabled: true });
assert.equal(trayEvents.length, 2);
trayControl.select(trayControl.props.menu[0]);
assert.equal(trayEvents[2][0], 'menu');
assert.equal(trayEvents[2][1].detail.id, 'show');
trayControl.onMounted();
trayControl.element.dataset.cgPopOpen = '';
trayControl.menuWatcher();
trayControl.onBeforeUnmount();
assert.equal(trayPops.slice(-2).join(','), 'hide,hide');
console.log('Tray keyboard activation/context menu, disabled commands, menu events and popup cleanup passed.');

// Date formatting uses the framework's complete language registry and the local calendar day.
const toolExports = {};
vm.runInNewContext(ts.transpileModule(await readFile(new URL('../dist/lib/tool.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: toolExports });
let clockNow = new Date(2026, 9, 1, 23, 59).getTime();
class ClockDate extends Date {
    constructor(value) { super(value === undefined ? clockNow : value); }
    static now() { return clockNow; }
}
let clockTick;
clickgo.task = { createTimer: (_control, callback, _delay, options) => {
    clockTick = callback;
    if (options.immediate) callback();
} };
const clockExports = {};
vm.runInNewContext(ts.transpileModule(await readFile(new URL('../dist/sources/control/task/code.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: clockExports, require: () => clickgo, Date: ClockDate, Intl });
const clockControl = new clockExports.default();
clockControl.onMounted();
assert.equal(clockControl.date, '23:59');
assert.equal(toolExports.lang.codes.length, 16);
for (const code of toolExports.lang.codes) {
    clockControl.localeTag = toolExports.lang.getTag(code);
    const text = clockControl.calendarDate;
    const parts = new Intl.DateTimeFormat(clockControl.localeTag, {
        calendar: 'gregory', month: 'short', day: 'numeric',
    }).formatToParts(new Date(clockNow));
    for (const type of ['month', 'day']) {
        assert.ok(text.includes(parts.find(part => part.type === type).value), `${code} must show the localized ${type}`);
    }
    assert.equal(clockControl.timeFirst, code === 'vi', `${code} must use its localized date/time order`);
}
clockControl.localeTag = 'zh-CN';
assert.equal(clockControl.calendarDate, '10月1日');
clockControl.localeTag = 'en';
assert.equal(clockControl.calendarDate, 'Oct 1');
clockNow = new Date(2026, 9, 2, 0, 0).getTime();
clockTick();
assert.equal(clockControl.date, '00:00');
assert.equal(clockControl.calendarDate, 'Oct 2');
clockControl.localeTag = 'zh-TW';
assert.equal(clockControl.calendarDate, '10月2日');
console.log('Task clock shows localized month/day and date/time order for all 16 languages, switches language, and updates at local midnight.');
