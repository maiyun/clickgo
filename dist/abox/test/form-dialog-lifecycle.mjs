import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<div id="forms"></div><div id="pop"></div>');
const document = dom.window.document;
const elements = { list: document.querySelector('#forms'), popList: document.querySelector('#pop') };
const state = { sysId: 'sys', focusId: null };
const info = { bottomLastZIndex: 999, lastZIndex: 999999, topLastZIndex: 99999999 };
const runtime = { dialogFormIds: [] };
const task = { forms: {} };
const noop = () => {};
const cleaned = [];
const focusEvents = [];
const coreApi = { trigger: async (name, ...args) => { if (name === 'formFocused') focusEvents.push(args); } };
const taskApi = { getOrigin: id => id === 'task' ? task : undefined,
    getRuntime: (_sys, id) => id === 'task' ? runtime : undefined,
    setFocus: noop, checkPermission: async () => [true], systemTaskInfo: {}, end: async () => {} };
const common = { '../core': coreApi, '../task': taskApi,
    '../command': { clearOwner: noop }, '../control': { clearComponents: noop },
    '../native': { clear: noop }, '../dom': { is: {}, removeStyle: noop, clearWatchStyle: noop,
        clearWatchProperty: noop, clearWatchPosition: noop }, './state': { state, info }, './system': { elements },
    './popup': { cleanupPop: element => cleaned.push(element) }, './dialog': {}, './base': { AbstractCommon: class {
        get refs() { return this.$refs; }
        get element() { return this.$el; }
    } } };
const modules = {};
function load(name) {
    if (modules[name]) return modules[name];
    const exports = modules[name] = {};
    const source = readFileSync(new URL(`../../lib/form/${name}.ts`, import.meta.url), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(code, { exports, require: key => {
        if (key === './window' || key === './remove') return load(key.slice(2));
        assert.ok(common[key], `Unexpected dependency ${key}`);
        return common[key];
    }, setTimeout, clearTimeout });
    return exports;
}
const { AbstractForm } = load('abstract-form');
const { changeFocus } = load('window');
function create(id, top = false) {
    const wrap = document.createElement('div');
    wrap.dataset.taskId = 'task'; wrap.dataset.formId = id;
    const inner = document.createElement('div'); inner.style.zIndex = '1000000'; wrap.append(inner);
    elements.list.append(wrap);
    const control = { $data: { isShow: false, zIndex: 1000000 }, left: 0, top: 0,
        getArea: () => ({ left: 0, top: 0, width: 800, height: 600 }), stateMinData: false };
    const form = new AbstractForm();
    Object.defineProperties(form, { taskId: { value: 'task' }, formId: { value: id },
        topMost: { get() { return this._topMost; }, set(value) {
            this._topMost = value;
            if (value) {
                this._bottomMost = false;
                if (!this._formFocus) changeFocus(this.formId).catch(() => {});
                else this.$refs.form.$data.zIndex = ++info.topLastZIndex;
            }
            else this.$refs.form.$data.zIndex = ++info.lastZIndex;
        } },
        bottomMost: { get() { return this._bottomMost; }, set(value) {
            this._bottomMost = value;
            if (value) this._topMost = false;
            this.$refs.form.$data.zIndex = value ? ++info.bottomLastZIndex : ++info.lastZIndex;
        } } });
    form._topMost = top; form.$refs = { form: control }; form.$el = inner;
    task.forms[id] = { id, vroot: form, vapp: { _container: wrap, unmount: noop }, closed: false };
    return form;
}
const tick = () => new Promise(resolve => setTimeout(resolve, 10));
const within = async promise => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('dialog result did not settle')), 200))]);
const owner = create('owner');
await owner.show();
const dialog = create('dialog');
const first = dialog.showDialog();
const duplicate = dialog.showDialog();
await tick();
assert.deepEqual([...runtime.dialogFormIds], ['dialog'], 'repeated showDialog must not duplicate the modal');
assert.equal(state.focusId, 'dialog');
assert.equal(dialog.topMost, true);
assert.equal(owner.isMask, true);
dialog.dialogResult = 'OK';
const dialogPop = document.createElement('div');
dialogPop.dataset.formId = 'dialog';
elements.popList.append(dialogPop);
dialog.hide();
assert.ok(cleaned.includes(dialogPop), 'hide cleans the form popup container');
assert.deepEqual(await within(Promise.all([first, duplicate])), ['OK', 'OK']);
assert.equal(dialog.$refs.form.$data.isShow, false);
assert.ok(task.forms.dialog, 'hide retains the form');
assert.deepEqual([...runtime.dialogFormIds], []);
assert.equal(owner.isMask, false);
assert.equal(state.focusId, 'owner', 'hiding restores the previously focused form');
const reopened = dialog.showDialog();
await tick();
assert.equal(state.focusId, 'dialog', 'reopening must focus the dialog');
assert.equal(dialog.topMost, true);
dialog.hide();
assert.equal(await within(reopened), '', 'cancel result is returned on reopening');
const outer = dialog.showDialog();
await tick();
const child = create('child');
child.bottomMost = true;
const nested = child.showDialog();
await tick();
assert.deepEqual([...runtime.dialogFormIds], ['dialog', 'child']);
assert.equal(dialog.isMask, true);
assert.equal(state.focusId, 'child');
child.dialogResult = 'child'; child.hide();
assert.equal(await within(nested), 'child');
assert.deepEqual([...runtime.dialogFormIds], ['dialog']);
assert.equal(dialog.isMask, false);
assert.equal(state.focusId, 'dialog', 'closing a nested dialog restores focus to the parent');
assert.equal(child.topMost, false);
assert.equal(child.bottomMost, true, 'original bottomMost state survives a dialog cycle');
dialog.dialogResult = 'outer'; dialog.hide();
assert.equal(await within(outer), 'outer');
assert.equal(dialog.topMost, false, 'temporary topMost state is restored');
const immediate = dialog.showDialog();
dialog.dialogResult = 'immediate';
dialog.hide();
const afterImmediate = dialog.showDialog();
assert.equal(await within(immediate), 'immediate');
await tick();
assert.equal(dialog.topMost, true, 'the new session remains active after an immediate reopen');
dialog.hide();
assert.equal(await within(afterImmediate), '');
const pinned = create('pinned', true);
const pinnedResult = pinned.showDialog();
await tick();
pinned.hide();
assert.equal(await within(pinnedResult), '');
assert.equal(pinned.topMost, true, 'original topMost state survives a dialog cycle');
const failing = create('failing');
const normalShow = failing.show;
let failShow;
failing.show = () => new Promise((_, reject) => { failShow = reject; });
const failed = failing.showDialog();
const alsoFailed = failing.showDialog();
failing.dialogResult = 'unfinished';
failShow(new Error('display failed'));
assert.deepEqual(await within(Promise.all([failed, alsoFailed])), ['', '']);
assert.deepEqual([...runtime.dialogFormIds], []);
assert.equal(owner.isMask, false);
const interrupted = failing.showDialog();
failing.dialogResult = 'early';
failing.hide();
assert.equal(await within(interrupted), 'early', 'hide completes even while show is pending');
failing.show = normalShow;
const retry = failing.showDialog();
failShow(new Error('previous display failed late'));
await tick();
assert.equal(failing.topMost, true);
failing.dialogResult = 'retry';
failing.hide();
assert.equal(await within(retry), 'retry');
const background = create('background');
await background.show();
background.hide();
await changeFocus('owner');
pinned.$el.style.zIndex = '2000000';
background.close();
await tick();
assert.equal(state.focusId, 'owner', 'closing a hidden background form keeps the current focus');
const beforeDuplicateFocus = focusEvents.length;
await changeFocus('owner');
assert.equal(focusEvents.length, beforeDuplicateFocus, 'focusing the already focused form does not emit again');
const minimizedOwner = create('minimized-owner');
await minimizedOwner.show();
const modalForMinimizedOwner = create('modal-for-minimized-owner');
const minimizedResult = modalForMinimizedOwner.showDialog();
await tick();
minimizedOwner.$refs.form.stateMinData = true;
minimizedOwner.$el.dataset.cgMin = '';
modalForMinimizedOwner.hide();
await within(minimizedResult);
assert.notEqual(state.focusId, 'minimized-owner', 'restoring focus does not reopen a minimized owner');
assert.equal(minimizedOwner.$refs.form.stateMinData, true);
const throwing = create('throwing');
const throwingResult = throwing.showDialog();
await tick();
throwing.dialogResult = 'before-error';
task.forms.throwing.vapp.unmount = () => { throw new Error('unmount failed'); };
throwing.close();
assert.equal(await within(throwingResult), 'before-error', 'unmount failure still settles the modal');
assert.equal(task.forms.throwing, undefined, 'unmount failure still removes the form');
assert.ok(!runtime.dialogFormIds.includes('throwing'), 'unmount failure releases the modal mask');
const closing = dialog.showDialog();
await tick();
dialog.dialogResult = 'closed';
task.forms.dialog.vapp.unmount = () => { dialog.dialogResult = 'unmounted'; };
dialog.close();
assert.equal(await within(closing), 'unmounted', 'close returns the value set by the unmount hook');
assert.equal(task.forms.dialog, undefined, 'close still destroys the form');
assert.deepEqual([...runtime.dialogFormIds], []);
await changeFocus('owner');
assert.equal(state.focusId, 'owner');
// Run the real task.end while a modal show is suspended.
const taskSource = readFileSync(new URL('../../lib/task.ts', import.meta.url), 'utf8');
const taskTree = ts.createSourceFile('task.ts', taskSource, ts.ScriptTarget.ES2022, true);
const endSource = taskTree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'end').getText(taskTree);
const taskList = { task };
task.id = 'task'; task.threads = {}; task.timers = {}; task.app = { package: { clear: noop } };
const endingScope = { exports: {}, list: taskList, runtime: { task: runtime }, sysId: 'sys',
    lCommand: { clear: noop }, clickgo: { isNative: () => false },
    lForm: { getMaxZIndexID: async () => null, changeFocus, elements, activePanels: {}, notify: noop },
    lCore: coreApi, lDom: { removeFromStyleList: noop, clearWatchStyle: noop, clearWatchProperty: noop,
        clearWatchPosition: noop, clearWatchSize: noop, clearWatch: noop },
    lNative: { clear: noop }, lControl: { clearComponents: noop }, cleanupPop: noop,
    trays: {}, frameMaps: {}, clearSystem: async () => {}, clearTimeout, cancelAnimationFrame: noop };
vm.runInNewContext(ts.transpileModule(endSource, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
} }).outputText, endingScope);
let finishThread;
task.threads.pending = { end: () => new Promise(resolve => { finishThread = resolve; }) };
const pending = create('pending');
let finishShow;
pending.show = () => new Promise(resolve => { finishShow = resolve; });
const pendingResult = pending.showDialog();
const ending = endingScope.exports.end('task');
const late = create('late');
assert.equal(await within(late.showDialog()), '', 'new modal is rejected while the task is ending');
assert.equal(task.forms.late.dialog, undefined);
pending.dialogResult = 'exit';
finishThread();
await within(ending);
assert.equal(await within(pendingResult), 'exit', 'task exit settles a pending show');
finishShow();
await tick();
assert.equal(pending.topMost, false, 'settled show does not change an unmounted form');
dom.window.close();
console.log('Form dialog lifecycle: repeated, reopened, nested, hide and close passed.');
