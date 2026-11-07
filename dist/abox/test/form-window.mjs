import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const { window } = new JSDOM('<div id="forms"></div>');
const document = window.document;
const elements = { list: document.getElementById('forms') };
const state = { sysId: 'system', index: 0, focusId: null };
const info = { bottomLastZIndex: 999, lastZIndex: 999999, topLastZIndex: 99999999 };
const tasks = {};
const runtimes = {};
const events = [];
let focusTask;
let asynchronousFocusReads = 0;
let refreshed = 0;
function addForm(taskId, id, flags = {}) {
    const task = tasks[taskId] ??= { id: taskId, forms: {} };
    runtimes[taskId] ??= { dialogFormIds: [] };
    const wrap = document.createElement('div');
    wrap.className = 'cg-form-wrap';
    wrap.dataset.taskId = taskId;
    wrap.dataset.formId = id;
    wrap.append(document.createElement('div'));
    elements.list.append(wrap);
    const control = { stateMinData: false, zIndex: 0, flashTimer: undefined,
        minMethod() { this.stateMinData = !this.stateMinData; }, refreshMaxPosition() { ++refreshed; } };
    control.$data = control;
    const form = { id, closed: false, vapp: { _container: wrap },
        vroot: { _formFocus: false, _topMost: false, _bottomMost: false, ...flags, $refs: { form: control } } };
    task.forms[id] = form;
    return form;
}
const dependencies = {
    '../core': { trigger: async (...event) => { events.push(event); } },
    '../task': { getOrigin: id => tasks[id], getRuntime: (_sys, id) => runtimes[id],
        getFocus: async () => { ++asynchronousFocusReads; return focusTask; },
        setFocus: id => { focusTask = id; }, checkPermission: async () => [true], systemTaskInfo: {} },
    '../dom': {}, './remove': { remove: () => true }, './system': { elements }, './state': { state, info }
};
const exports = {};
const source = await readFile(new URL('../../lib/form/window.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
vm.runInNewContext(compiled, { exports, require: name => {
    assert.ok(dependencies[name], `Unexpected dependency ${name}`); return dependencies[name];
}, setTimeout: () => 1, clearTimeout() {} });
const a = addForm('one', 'a');
const b = addForm('one', 'b');
const c = addForm('two', 'c');
await exports.changeFocus('a');
await Promise.all([exports.changeFocus('b'), exports.changeFocus('c')]);
assert.equal(state.focusId, 'c');
assert.equal(focusTask, 'two');
assert.deepEqual([a, b, c].map(form => form.vroot._formFocus), [false, false, true]);
assert.equal(elements.list.querySelectorAll('[data-form-focus]').length, 1);
assert.equal(asynchronousFocusReads, 0, 'switching focus must not yield between reading and updating its owner');
const eventCount = events.length;
await exports.changeFocus('c');
assert.equal(events.length, eventCount, 'already focused form does not emit duplicate events');

const modal = addForm('one', 'modal', { _topMost: true });
runtimes.one.dialogFormIds.push('modal');
modal.vroot.$refs.form.stateMinData = true;
await exports.changeFocus('a');
assert.equal(state.focusId, 'modal');
assert.equal(modal.vroot.$refs.form.stateMinData, false);
assert.ok(modal.vroot.$refs.form.zIndex >= 100000000);
assert.equal(a.vroot._formFocus, false);
assert.equal(c.vroot._formFocus, false);
assert.ok(events.some(event => event[0] === 'formFlash' && event[2] === 'modal'));

modal.vapp._container.remove();
delete tasks.one.forms.modal;
runtimes.one.dialogFormIds.length = 0;
await exports.changeFocus('c');
assert.equal(state.focusId, 'c', 'a destroyed previous owner cannot prevent focusing a live form');
b.closed = true;
await exports.changeFocus('b');
assert.equal(state.focusId, null, 'closing forms cannot regain focus');
assert.equal(elements.list.querySelectorAll('[data-form-focus]').length, 0);

const mounting = document.createElement('div');
mounting.dataset.taskId = 'one'; mounting.dataset.formId = 'mounting';
elements.list.append(mounting);
a.vapp._container.firstElementChild.dataset.cgMax = '';
b.vapp._container.firstElementChild.dataset.cgMax = '';
exports.refreshMaxPosition();
assert.equal(refreshed, 1, 'resize skips incomplete and closing windows');
console.log('Form focus: consecutive requests, task ownership, modal redirection, destroyed/closing windows and resize lifecycle passed.');
