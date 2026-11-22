import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<div id="forms"></div><div id="pop"></div>');
const document = dom.window.document;
const elements = { list: document.querySelector('#forms'), popList: document.querySelector('#pop') };
const modules = {};
const { state, info } = load('state');
const { bottomLastZIndex, lastZIndex, topLastZIndex } = info;
state.sysId = 'sys';
const runtime = { dialogFormIds: [] };
const task = { id: 'task', forms: {} };
const otherTask = { id: 'other-task', forms: {} };
const otherRuntime = { dialogFormIds: [] };
const noop = () => {};
const cleaned = [];
const focusEvents = [];
const coreApi = { trigger: async (name, ...args) => { if (name === 'formFocused') focusEvents.push(args); } };
const taskApi = { getOrigin: id => id === 'task' ? task : id === 'other-task' ? otherTask : undefined,
    getRuntime: (_sys, id) => id === 'task' ? runtime : id === 'other-task' ? otherRuntime : undefined,
    setFocus: noop, checkPermission: async () => [true], systemTaskInfo: {}, end: async () => {} };
const common = { '../core': coreApi, '../task': taskApi,
    '../command': { clearOwner: noop }, '../control': { clearComponents: noop },
    '../native': { clear: noop }, '../dom': { is: {}, removeStyle: noop, clearWatchStyle: noop,
        clearWatchProperty: noop, clearWatchPosition: noop }, './system': { elements },
    './popup': { cleanupPop: element => cleaned.push(element) }, './dialog': {}, './base': { AbstractCommon: class {
        get refs() { return this.$refs; }
        get element() { return this.$el; }
        nextTick() { return this._nextTick ? this._nextTick() : Promise.resolve(); }
    } } };
function load(name) {
    if (modules[name]) return modules[name];
    const exports = modules[name] = {};
    const source = readFileSync(new URL(`../../lib/form/${name}.ts`, import.meta.url), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(code, { exports, require: key => {
        if (key === './window' || key === './remove' || key === './state') return load(key.slice(2));
        assert.ok(common[key], `Unexpected dependency ${key}`);
        return common[key];
    }, setTimeout, clearTimeout });
    return exports;
}
const { AbstractForm, setTopMostLayer } = load('abstract-form');
const { changeFocus, changeFocusMaxZIndex, restoreFocusAfterTaskEnd } = load('window');
const popupSource = readFileSync(new URL('../form/popup.ts', import.meta.url), 'utf8');
const popupExports = {};
vm.runInNewContext(ts.transpileModule(popupSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: popupExports, window: dom.window });
popupExports.createPopupRuntime({ changeFocus });
const outside = document.body.appendChild(document.createElement('button'));
const pressOutside = () => outside.dispatchEvent(new dom.window.MouseEvent('pointerdown', { bubbles: true }));
// Apply the production computed properties so tests exercise focus changes made by their setters.
const createSource = readFileSync(new URL('../../lib/form/create.ts', import.meta.url), 'utf8');
const createTree = ts.createSourceFile('create.ts', createSource, ts.ScriptTarget.ES2022, true);
const layers = {};
function readLayers(node) {
    if (ts.isBinaryExpression(node) && ts.isPropertyAccessExpression(node.left)
        && node.left.expression.getText(createTree) === 'computed'
        && ['topMost', 'bottomMost'].includes(node.left.name.text)) {
        const property = ts.transpileModule(`const layer = ${node.right.getText(createTree)};`,
            { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
        layers[node.left.name.text] = vm.runInNewContext(property + 'layer', { info, changeFocus, setTopMostLayer });
    }
    ts.forEachChild(node, readLayers);
}
readLayers(createTree);
assert.deepEqual(Object.keys(layers).sort(), ['bottomMost', 'topMost']);
function create(id, top = false, taskId = 'task') {
    const wrap = document.createElement('div');
    wrap.className = 'cg-form-wrap';
    wrap.dataset.taskId = taskId; wrap.dataset.formId = id;
    const inner = document.createElement('div'); inner.style.zIndex = '1000000'; wrap.append(inner);
    elements.list.append(wrap);
    const control = { $data: { isShow: false, zIndex: 1000000 }, left: 0, top: 0,
        leftData: 0, topData: 0, setPropData(name, value) { this[`${name}Data`] = value; },
        getArea: () => ({ left: 0, top: 0, width: 800, height: 600 }), stateMinData: false };
    Object.defineProperty(control.$data, 'zIndex', {
        get: () => Number(inner.style.zIndex),
        set: value => { inner.style.zIndex = String(value); },
    });
    const form = new AbstractForm();
    Object.defineProperties(form, { taskId: { value: taskId }, formId: { value: id },
        ...layers });
    form._topMost = top; form.$refs = { form: control }; form.$el = inner;
    taskApi.getOrigin(taskId).forms[id] = { id, vroot: form, vapp: { _container: wrap, unmount: noop }, closed: false };
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
assert.ok(child.$refs.form.$data.hideZIndex > dialog.$refs.form.$data.zIndex,
    'the outgoing nested modal stays above its refocused owner during fade-out');
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
const ordinary = create('ordinary');
await ordinary.show();
ordinary.hide();
assert.equal(state.focusId, 'owner');
assert.ok(ordinary.$refs.form.$data.hideZIndex > owner.$refs.form.$data.zIndex);
assert.ok(ordinary.$refs.form.$data.hideZIndex < info.topLastZIndex);
await ordinary.show();
assert.equal(state.focusId, 'ordinary');
ordinary.close();
assert.equal(state.focusId, 'owner');
assert.ok(ordinary.$refs.form.$data.hideZIndex > owner.$refs.form.$data.zIndex);
await tick();
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
// Isolated stacking scenarios use the same z-index values rendered by the form control.
function resetForms() {
    elements.list.replaceChildren();
    elements.popList.replaceChildren();
    for (const id of Object.keys(task.forms)) delete task.forms[id];
    for (const id of Object.keys(otherTask.forms)) delete otherTask.forms[id];
    runtime.dialogFormIds.length = 0;
    otherRuntime.dialogFormIds.length = 0;
    state.focusId = null;
    Object.assign(info, { bottomLastZIndex, lastZIndex, topLastZIndex });
}
async function showForm(id, top = false, taskId = 'task') {
    const form = create(id, top, taskId);
    await form.show();
    return form;
}
async function showModal(id, top = false, taskId = 'task') {
    const form = create(id, top, taskId);
    const result = form.showDialog();
    await tick();
    return { form, result };
}
function suspendLayout(form) {
    form.refs.form.left = -1;
    let resume;
    form._nextTick = () => new Promise(resolve => { resume = resolve; });
    return () => resume();
}
for (const modal of [false, true]) {
    for (const action of ['hide', 'close']) {
        resetForms();
        const receiver = await showForm('receiver');
        const leaving = create('leaving');
        const result = modal ? leaving.showDialog() : leaving.show();
        if (!modal) await result;
        await tick();
        const previousZ = leaving.$refs.form.$data.zIndex;
        const receiverZ = receiver.$refs.form.$data.zIndex;
        leaving[action]();
        assert.equal(state.focusId, 'receiver', `${modal ? 'modal' : 'ordinary'} ${action} restores focus`);
        assert.equal(leaving.$refs.form.$data.hideZIndex, previousZ, `${action} preserves the outgoing z-index`);
        assert.equal(receiver.$refs.form.$data.zIndex, receiverZ, `${action} does not raise the uncovered receiver`);
        if (modal) {
            leaving.$el.dispatchEvent(new dom.window.MouseEvent('pointerdown', { bubbles: true }));
            assert.equal(state.focusId, receiver.formId, 'clicking the outgoing form during its fade preserves restored focus');
            await within(result);
        }
        if (action === 'close') await tick();
    }
}
for (const action of ['hide', 'close']) {
    resetForms();
    await showForm('main');
    const { form: login, result } = await showModal('login');
    assert.equal(state.focusId, 'login');
    pressOutside();
    pressOutside();
    assert.equal(state.focusId, null);
    login.dialogResult = '1';
    login[action]();
    assert.equal(await within(result), '1');
    assert.equal(state.focusId, 'main', `modal ${action} restores focus after an outside press`);
    assert.ok(task.forms.main.vapp._container.hasAttribute('data-form-focus'));
}
for (const pendingLayout of [false, true]) {
    for (const outsidePress of [false, true]) {
        resetForms();
        const receiver = await showForm('receiver');
        const modal = create('modal');
        const releaseLayout = pendingLayout ? suspendLayout(modal) : null;
        const result = modal.showDialog();
        const selected = outsidePress ? null : await showForm('selected', false, 'other-task');
        if (outsidePress) pressOutside();
        releaseLayout?.();
        await tick();
        assert.equal(modal.topMost, true);
        assert.equal(state.focusId, selected?.formId ?? null,
            'finishing modal display preserves the newer focus choice');
        modal.hide();
        await within(result);
        assert.equal(state.focusId, selected?.formId ?? receiver.formId);
    }
}
for (const action of ['hide', 'close']) {
    resetForms();
    await showForm('owner');
    const initiallyPinned = action === 'hide';
    const { form: modal, result } = await showModal('background-modal', initiallyPinned);
    if (initiallyPinned) modal.topMost = false;
    const foreground = await showForm('foreground', false, 'other-task');
    modal[action]();
    await within(result);
    if (initiallyPinned) assert.equal(modal.topMost, true);
    assert.equal(state.focusId, foreground.formId, `background modal ${action} preserves another task’s focus`);
}
resetForms();
const lastVisible = await showForm('last-visible');
lastVisible.$refs.form.stateMinData = true;
await changeFocusMaxZIndex();
assert.equal(state.focusId, null, 'minimizing the last window clears its focus');
resetForms();
const alternate = await showForm('alternate', false, 'other-task');
await showForm('masked');
const { form: minimized, result: minResult } = await showModal('minimized');
minimized.$refs.form.stateMinData = true;
await changeFocusMaxZIndex();
assert.equal(state.focusId, alternate.formId, 'auto focus skips a window masked by a minimized modal');
await showForm('other-pinned', true, 'other-task');
await changeFocus(alternate.formId);
const { form: activeModal, result: activeResult } = await showModal('active-modal');
activeModal.close();
await within(activeResult);
assert.equal(state.focusId, alternate.formId, 'closing a nested modal leaves its minimized parent minimized');
minimized.hide();
await within(minResult);
resetForms();
await showForm('background-owner');
const { form: backgroundModal, result: backgroundModalResult } = await showModal('background-modal');
await showForm('foreground-owner', false, 'other-task');
const { form: foregroundModal, result: foregroundModalResult } = await showModal('foreground-modal', false, 'other-task');
pressOutside();
assert.equal(state.focusId, null);
backgroundModal.close();
await within(backgroundModalResult);
assert.equal(state.focusId, null, 'a background modal did not own the cleared focus');
foregroundModal.close();
await within(foregroundModalResult);
assert.equal(state.focusId, 'foreground-owner', 'only the modal that lost focus restores its owner');
resetForms();
const fallback = await showForm('fallback');
await showForm('ending-owner', false, 'other-task');
const { form: retainedModal, result: retainedResult } = await showModal('retained-modal');
otherTask.ending = true;
retainedModal.hide();
await within(retainedResult);
assert.equal(state.focusId, fallback.formId, 'focus restoration skips an owner whose task is ending');
delete otherTask.ending;
resetForms();
const otherWindow = await showForm('other-window', false, 'other-task');
const exitingParent = create('exiting-parent');
const exitingParentResult = exitingParent.showDialog();
const exitingChild = create('exiting-child');
const exitingChildResult = exitingChild.showDialog();
task.ending = true;
exitingChild.hide();
await within(exitingChildResult);
assert.equal(state.focusId, otherWindow.formId, 'a nested modal cannot return focus to a parent in an exiting task');
exitingParent.hide();
await within(exitingParentResult);
delete task.ending;
resetForms();
await showForm('parent');
await showForm('other');
await changeFocus('parent');
const { form: parentDialog, result: parentResult } = await showModal('parent-dialog', true);
// A modal parent may sit below another window on the same top layer.
const interloper = await showForm('interloper', true, 'other-task');
const { form: nestedDialog, result: nestedResult } = await showModal('nested-dialog', true);
const outgoingZ = nestedDialog.$refs.form.$data.zIndex;
assert.ok(interloper.$refs.form.$data.zIndex > parentDialog.$refs.form.$data.zIndex);
assert.ok(interloper.$refs.form.$data.zIndex < outgoingZ);
nestedDialog.hide();
await within(nestedResult);
assert.equal(state.focusId, 'parent-dialog');
assert.equal(nestedDialog.$refs.form.$data.hideZIndex, outgoingZ);
assert.ok(parentDialog.$refs.form.$data.zIndex > interloper.$refs.form.$data.zIndex, 'a covered modal parent is raised above its same-layer peer');
assert.ok(parentDialog.$refs.form.$data.zIndex < outgoingZ, 'the restored parent remains below the outgoing dialog');
parentDialog.hide();
await within(parentResult);
const newcomer = await showForm('newcomer', true);
assert.ok(newcomer.$refs.form.$data.zIndex > outgoingZ, 'a newly opened window can cover the outgoing dialog');

for (const layer of ['topMost', 'bottomMost']) {
    resetForms();
    const receiver = await showForm('receiver');
    const leaving = create('leaving');
    leaving[layer] = true;
    await leaving.show();
    const receiverZ = receiver.$refs.form.$data.zIndex;
    const leavingZ = leaving.$refs.form.$data.zIndex;
    leaving.hide();
    assert.equal(leaving.$refs.form.$data.hideZIndex, leavingZ, `${layer} outgoing z-index stays unchanged`);
    assert.equal(receiver.$refs.form.$data.zIndex, receiverZ, `${layer} focus does not raise an uncovered receiver`);
    assert.equal(state.focusId, 'receiver');
}
resetForms();
const active = await showForm('active');
const inactive = await showForm('inactive');
await changeFocus('active');
const inactiveZ = inactive.$refs.form.$data.zIndex;
const activeZ = active.$refs.form.$data.zIndex;
inactive.hide();
assert.equal(state.focusId, 'active', 'hiding a background form keeps focus');
assert.equal(inactive.$refs.form.$data.hideZIndex, inactiveZ, 'background fade retains its z-index');
assert.equal(active.$refs.form.$data.zIndex, activeZ, 'background hide does not reorder the active form');
const backgroundClose = await showForm('background-close');
await changeFocus('active');
const backgroundCloseZ = backgroundClose.$refs.form.$data.zIndex;
const activeBeforeClose = active.$refs.form.$data.zIndex;
backgroundClose.close();
assert.equal(state.focusId, 'active', 'closing a background form keeps focus');
assert.equal(backgroundClose.$refs.form.$data.hideZIndex, backgroundCloseZ);
assert.equal(active.$refs.form.$data.zIndex, activeBeforeClose);
await tick();
await inactive.show();
const priorFadeZ = inactive.$refs.form.$data.zIndex;
inactive.hide();
await inactive.show();
assert.equal(state.focusId, 'inactive', 'quickly reopened form regains focus');
assert.ok(inactive.$refs.form.$data.zIndex > priorFadeZ, 'quickly reopened form gets a fresh visible z-index');
assert.equal(inactive.$refs.form.$data.isShow, true);
resetForms();
// Automatic positioning uses the rendered size and follows later size changes
// only until an axis is explicitly positioned or moved by the user.
const centered = create('centered');
const centerControl = centered.$refs.form;
centerControl.left = centerControl.top = -1;
let width = 200, height = 0, finishTick;
Object.defineProperties(centered.$el, {
    offsetWidth: { get: () => width }, offsetHeight: { get: () => height },
});
centered._nextTick = () => new Promise(resolve => { finishTick = resolve; });
const firstCenter = centered.show();
assert.equal(centerControl.topData, 0, 'position is not measured before the pending render');
height = 100;
finishTick();
await firstCenter;
assert.equal(centerControl.leftData, 300);
assert.equal(centerControl.topData, 250, 'first show uses the rendered height after nextTick');
centered.hide();
centered._nextTick = () => Promise.resolve();
width = 300; height = 200;
await centered.show();
assert.equal(centerControl.leftData, 250, 'automatic horizontal position follows changed width');
assert.equal(centerControl.topData, 200, 'automatic vertical position follows changed height');
centered.hide();
centerControl.leftData = 123;
centerControl.top = 75;
centerControl.topData = 75;
width = 400; height = 300;
await centered.show();
assert.equal(centerControl.leftData, 123, 'a manually moved axis keeps its position');
assert.equal(centerControl.topData, 75, 'an explicitly positioned axis keeps its position');
centered.hide();
resetForms();
const positioned = create('positioned');
positioned.$refs.form.left = positioned.$refs.form.leftData = 40;
positioned.$refs.form.top = -1;
Object.defineProperty(positioned.$el, 'offsetHeight', { value: 100 });
await positioned.show();
assert.equal(positioned.$refs.form.leftData, 40, 'first show preserves an explicit position');
assert.equal(positioned.$refs.form.topData, 250, 'the other axis can still be centered');
positioned.hide();
resetForms();
const canceledShow = create('canceled-show');
canceledShow.refs.form.top = -1;
const releaseCanceledLayout = suspendLayout(canceledShow);
const showing = canceledShow.show();
canceledShow.hide();
releaseCanceledLayout();
await showing;
assert.equal(canceledShow.$refs.form.$data.isShow, false, 'hide during nextTick must not revive the window');
assert.notEqual(state.focusId, 'canceled-show', 'a canceled show must not take focus');
for (const outsidePress of [false, true]) {
    resetForms();
    await showForm('ordinary-owner');
    const slow = create('slow-ordinary');
    const releaseLayout = suspendLayout(slow);
    const shown = slow.show();
    const selected = outsidePress ? null : await showForm('selected');
    if (outsidePress) pressOutside();
    releaseLayout();
    await shown;
    assert.equal(slow.refs.form.$data.isShow, true);
    assert.equal(state.focusId, selected?.formId ?? null, 'ordinary show respects selection during layout');
    if (selected) assert.ok(slow.refs.form.$data.zIndex < selected.refs.form.$data.zIndex);
}
for (const custom of [false, true]) {
    for (const selectOther of [false, true]) {
        resetForms();
        const owner = await showForm('owner');
        const modal = create('slow-dialog');
        let releaseShow;
        if (custom) {
            modal.show = async () => {
                await new Promise(resolve => { releaseShow = resolve; });
                modal.refs.form.$data.isShow = true;
            };
        }
        else {
            releaseShow = suspendLayout(modal);
        }
        const start = focusEvents.length;
        const result = modal.showDialog();
        await Promise.resolve();
        assert.equal(state.focusId, owner.formId, 'starting a slow show leaves focus on the visible owner');
        assert.equal(focusEvents.length, start, 'a hidden modal does not announce focus on opening');
        const selected = selectOther ? await showForm('selected', true, 'other-task') : null;
        releaseShow();
        await tick();
        assert.equal(modal.topMost, true, 'modal display also promotes a successful custom show');
        assert.equal(state.focusId, selected?.formId ?? modal.formId);
        if (selected) assert.ok(modal.refs.form.$data.zIndex < selected.refs.form.$data.zIndex,
            'finishing layout preserves the newer pinned window above the modal');
        modal.hide();
        await within(result);
        assert.equal(state.focusId, selected?.formId ?? owner.formId);
    }
}
for (const action of ['hide', 'close']) {
    resetForms();
    const owner = await showForm('owner');
    const modal = create('callback-dialog');
    const control = modal.refs.form;
    control.stateMinData = true;
    // Restoring a minimized Form synchronously emits min to the application.
    control.minMethod = () => { modal[action](); control.stateMinData = false; };
    await within(modal.showDialog());
    assert.equal(control.$data.isShow, false, 'completion of the restore callback cannot revive the dialog');
    assert.equal(state.focusId, owner.formId);
    assert.deepEqual([...runtime.dialogFormIds], []);
}
for (const modal of [false, true]) {
    for (const latestFirst of [false, true]) {
        resetForms();
        await showForm('owner');
        const first = create('first');
        const latest = create('latest', false, 'other-task');
        const releaseFirst = suspendLayout(first);
        const releaseLatest = suspendLayout(latest);
        const results = [first, latest].map(form => modal ? form.showDialog() : form.show());
        for (const release of latestFirst ? [releaseLatest, releaseFirst] : [releaseFirst, releaseLatest]) {
            release();
            await tick();
        }
        assert.equal(state.focusId, latest.formId, 'parallel shows honor the last request in either completion order');
        assert.ok(latest.refs.form.$data.zIndex > first.refs.form.$data.zIndex);
        first.hide();
        latest.hide();
        await within(Promise.all(results));
    }
}
resetForms();
const repeatedShow = create('repeated-show');
repeatedShow.refs.form.left = -1;
await Promise.all([repeatedShow.show(), repeatedShow.show()]);
assert.equal(state.focusId, repeatedShow.formId, 'concurrent ordinary shows of one Form focus the visible instance');
resetForms();
const readyOwner = await showForm('ready-owner');
const pendingModal = create('pending-modal');
const releasePendingLayout = suspendLayout(pendingModal);
const pendingModalResult = pendingModal.showDialog();
pressOutside();
await changeFocus(readyOwner.formId);
assert.equal(state.focusId, pendingModal.formId, 'the modal stack redirects focus before the first render');
assert.equal(pendingModal.$refs.form.$data.isShow, false);
pendingModal.hide();
assert.equal(state.focusId, readyOwner.formId, 'hiding a focused modal returns focus even before the first render');
releasePendingLayout();
await within(pendingModalResult);
assert.equal(pendingModal.$refs.form.$data.isShow, false);
clearTimeout(pendingModal.$refs.form.flashTimer);
resetForms();
// Run the real task.end while a modal show is suspended.
const taskSource = readFileSync(new URL('../../lib/task.ts', import.meta.url), 'utf8');
const taskTree = ts.createSourceFile('task.ts', taskSource, ts.ScriptTarget.ES2022, true);
const endSource = taskTree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'end').getText(taskTree);
const taskList = { task };
task.threads = {}; task.timers = {}; task.app = { package: { clear: noop } };
const endingScope = { exports: {}, list: taskList, runtime: { task: runtime }, sysId: 'sys',
    lCommand: { clear: noop }, clickgo: { isNative: () => false },
    restoreFocusAfterTaskEnd, lForm: { elements, activePanels: {}, notify: noop },
    lCore: coreApi, lDom: { removeFromStyleList: noop, clearWatchStyle: noop, clearWatchProperty: noop,
        clearWatchPosition: noop, clearWatchSize: noop, clearWatch: noop },
    lNative: { clear: noop }, lControl: { clearComponents: noop }, cleanupPop: noop,
    trays: {}, frameMaps: {}, clearSystem: async () => {}, clearTimeout, cancelAnimationFrame: noop };
vm.runInNewContext(ts.transpileModule(endSource, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
} }).outputText, endingScope);
const { end } = endingScope.exports;
function resetEndingTask() {
    resetForms();
    taskList.task = task;
    task.ending = false;
    task.threads = {};
}
function suspendThreadEnd() {
    let resume;
    task.threads.pending = { end: () => new Promise(resolve => { resume = resolve; }) };
    return () => resume();
}
const survivingOwner = await showForm('surviving-owner', false, 'other-task');
const { form: survivingModal, result: survivingModalResult } = await showModal('surviving-modal', false, 'other-task');
pressOutside();
const finishThread = suspendThreadEnd();
const pending = create('pending');
let finishShow;
pending.show = () => new Promise(resolve => { finishShow = resolve; });
const pendingResult = pending.showDialog();
const ending = end('task');
const late = create('late');
assert.equal(await within(late.showDialog()), '', 'new modal is rejected while the task is ending');
assert.equal(task.forms.late.dialog, undefined);
pending.dialogResult = 'exit';
finishThread();
await within(ending);
assert.equal(state.focusId, null, 'ending a background task does not restore another task’s cleared focus');
assert.equal(await within(pendingResult), 'exit', 'task exit settles a pending show');
finishShow();
await tick();
assert.equal(pending.topMost, false, 'settled show does not change an unmounted form');
survivingModal.close();
await within(survivingModalResult);
assert.equal(state.focusId, survivingOwner.formId, 'background task cleanup preserves the modal’s return target');

for (const blur of [false, true]) {
    resetEndingTask();
    const remaining = await showForm('remaining', false, 'other-task');
    const { result: exitResult } = await showModal('exiting');
    if (blur) pressOutside();
    await within(end('task'));
    await within(exitResult);
    assert.equal(state.focusId, remaining.formId, 'ending the owning task hands focus to a surviving window');
}
task.ending = false;
for (const ownerState of ['visible', 'hidden', 'minimized']) {
    resetForms();
    const fallback = await showForm('pinned-fallback', true, 'other-task');
    const owner = await showForm('owner');
    const leaving = await showModal('leaving', false, 'other-task');
    const replacement = await showModal('owner-modal');
    replacement.form.topMost = false;
    if (ownerState === 'hidden') owner.hide();
    if (ownerState === 'minimized') owner.$refs.form.stateMinData = true;
    await changeFocus(leaving.form.formId);
    leaving.form.hide();
    await within(leaving.result);
    assert.equal(state.focusId, ownerState === 'visible' ? replacement.form.formId : fallback.formId,
        `a ${ownerState} original owner determines whether its new modal receives focus`);
    replacement.form.hide();
    await within(replacement.result);
}
for (const outsidePress of [false, true]) {
    resetEndingTask();
    const releaseThread = suspendThreadEnd();
    await showForm('pinned-alternative', true, 'other-task');
    const selected = await showForm('selected', false, 'other-task');
    const exiting = await showModal('exiting');
    const ending = end('task');
    await changeFocus(selected.formId);
    if (outsidePress) pressOutside();
    releaseThread();
    await within(ending);
    await within(exiting.result);
    assert.equal(state.focusId, outsidePress ? null : selected.formId,
        'task cleanup preserves the user’s focus choice while its thread was ending');
}
for (const outsidePress of [false, true]) {
    resetEndingTask();
    const releaseThread = suspendThreadEnd();
    await showForm('surviving-owner', false, 'other-task');
    const leaving = await showForm('leaving');
    const opening = create('opening', false, 'other-task');
    const releaseLayout = suspendLayout(opening);
    const result = opening.showDialog();
    await changeFocus(leaving.formId);
    const ending = end('task');
    if (outsidePress) {
        await changeFocus(opening.formId);
        pressOutside();
    }
    releaseThread();
    await within(ending);
    assert.equal(opening.$refs.form.$data.isShow, false);
    releaseLayout();
    await tick();
    assert.equal(opening.$refs.form.$data.isShow, true);
    assert.equal(state.focusId, outsidePress ? null : opening.formId,
        'an opening modal can receive focus after task exit while an explicit outside press is preserved');
    opening.hide();
    await within(result);
}
dom.window.close();
console.log('Form dialog lifecycle: repeated, reopened, nested, hide and close passed.');
