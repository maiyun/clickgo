import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

async function load(path, modules = {}) {
    const source = await readFile(new URL(path, import.meta.url), 'utf8');
    const code = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    vm.runInNewContext(code, { exports, require: name => modules[name] ?? {}, console, Error, setTimeout, clearTimeout, window: { addEventListener() {} } });
    return exports;
}

class Target {
    listeners = new Map();
    addEventListener(name, callback) {
        const callbacks = this.listeners.get(name) ?? [];
        callbacks.push(callback);
        this.listeners.set(name, callbacks);
    }
    emit(name) {
        for (const callback of this.listeners.get(name) ?? []) callback();
    }
}

const { watchActive } = await load('../active.ts');
function fixture(visibilityState, focused) {
    const win = new Target();
    const doc = new Target();
    doc.visibilityState = visibilityState;
    doc.hasFocus = () => focused;
    const changes = [];
    watchActive(win, doc, active => changes.push(active));
    return { win, doc, changes, focus: value => { focused = value; } };
}

for (const [visibility, focus] of [['visible', true], ['visible', false], ['hidden', true], ['hidden', false]]) {
    const f = fixture(visibility, focus);
    assert.deepEqual(f.changes, [], 'initial state must not notify');
    f.win.emit('focus');
    f.win.emit('blur');
    f.doc.emit('visibilitychange');
    assert.deepEqual(f.changes, [], 'unchanged state must not notify');
}
const state = fixture('visible', true);
state.focus(false);
state.win.emit('blur');
state.win.emit('blur');
state.doc.visibilityState = 'hidden';
state.doc.emit('visibilitychange');
state.focus(true);
state.win.emit('focus');
assert.deepEqual(state.changes, [false], 'focus while hidden must stay inactive');
state.doc.visibilityState = 'visible';
state.doc.emit('visibilitychange');
state.doc.emit('visibilitychange');
state.doc.visibilityState = 'hidden';
state.doc.emit('visibilitychange');
state.doc.visibilityState = 'visible';
state.doc.emit('visibilitychange');
assert.deepEqual(state.changes, [false, true, false, true]);
const hidden = fixture('hidden', false);
hidden.doc.visibilityState = 'visible';
hidden.doc.emit('visibilitychange');
assert.deepEqual(hidden.changes, []);
hidden.focus(true);
hidden.win.emit('focus');
assert.deepEqual(hidden.changes, [true]);

const calls = [];
function receiver(id) {
    return {
        onActiveChanged(active) {
            calls.push([id, active]);
        },
    };
}
const boot = { ...receiver('boot'), setSysId() {} };
const tasks = {
    first: { class: receiver('app1'), forms: {
        one: { vroot: receiver('form1') },
        two: { vroot: receiver('form2') },
    } },
    second: { class: receiver('app2'), forms: { three: { vroot: receiver('form3') } } },
};
const core = await load('../../lib/core.ts', {
    './task': { getOriginList: async () => tasks, getRuntime: () => ({ permissions: [] }) },
});
core.initSysId('system');
core.setBoot(boot);
await core.trigger('activeChanged', false);
assert.deepEqual(calls, [
    ['boot', false], ['app1', false], ['form1', false], ['form2', false],
    ['app2', false], ['form3', false],
]);
calls.length = 0;
await core.trigger('activeChanged', true);
assert.equal(calls.length, 6);
assert.ok(calls.every(([, active]) => active === true));
console.log('active state and broadcast regression passed');
