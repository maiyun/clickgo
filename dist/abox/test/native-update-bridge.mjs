import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SourceTextModule, SyntheticModule } from 'node:vm';
const synthetic = values => new SyntheticModule(Object.keys(values), function() {
    for (const [key, value] of Object.entries(values)) this.setExport(key, value);
});
let native = true, alive = true, permission = true;
let checkPermission = async () => [permission];
let result = { status: 'disabled', reason: 'development', currentVersion: '1.0.0' };
const calls = [];
const previousWindow = globalThis.window;
globalThis.window = { clickgoNative: { invoke: async (...args) => { calls.push(args); return result; } } };
try {
    const main = new SourceTextModule(await readFile(new URL('../../lib/native.js', import.meta.url), 'utf8'));
    const update = new SourceTextModule(await readFile(new URL('../../lib/native/update.js', import.meta.url), 'utf8'));
    const clickgo = synthetic({ isNative: () => native });
    const core = synthetic({});
    const task = synthetic({ getOrigin: () => alive ? {} : null, checkPermission: (...args) => checkPermission(...args) });
    const tool = synthetic({ random: () => 'session-token', RANDOM_LUNS: '' });
    const empty = synthetic({});
    const dispatcher = new SourceTextModule(await readFile(new URL('../native-events.js', import.meta.url), 'utf8'));
    const linker = name => {
        if (name === '../abox/native-events') return dispatcher;
        if (name === './native/update') return update;
        if (name === '../native') return main;
        if (name.endsWith('/clickgo')) return clickgo;
        if (name.endsWith('/core')) return core;
        if (name === './task') return task;
        if (name === './tool') return tool;
        return empty;
    };
    await main.link(linker); await main.evaluate();
    const api = main.namespace;
    const form = { taskId: 'task', formId: 'form' };
    native = false; assert.equal(await api.checkUpdates(form), null); assert.equal(calls.length, 0);
    native = true; permission = false; assert.equal(await api.checkUpdates(form), false); assert.equal(calls.length, 0);
    permission = true; alive = false; assert.equal(await api.installUpdate(form), false); assert.equal(calls.length, 0);
    alive = true;
    for (const [name, action] of [['checkUpdates','check'],['downloadUpdate','download'],['installUpdate','install'],['getUpdateState','state']]) {
        assert.equal((await api[name](form)).reason, 'development');
        assert.deepEqual(calls.at(-1), ['cg-update', 'session-token', action]);
    }
    result = undefined; assert.equal(await api.getUpdateState(form), null, 'older Native hosts report unsupported');
    checkPermission = async () => { alive = false; return [true]; };
    const count = calls.length; assert.equal(await api.downloadUpdate(form), false); assert.equal(calls.length, count);
    alive = true; checkPermission = async () => [true];
    let delivered = 0;
    api.onUpdateState(form, () => { ++delivered; });
    window.clickgoNativeWeb.invoke('update-state', { status: 'downloading' });
    assert.equal(delivered, 1);
    api.clear('task', 'form');
    window.clickgoNativeWeb.invoke('update-state', { status: 'downloaded' });
    assert.equal(delivered, 1, 'Form teardown removes update subscription');
    api.onUpdateState('task', () => { ++delivered; }); api.clear('task');
    window.clickgoNativeWeb.invoke('update-state', { status: 'error' });
    assert.equal(delivered, 1, 'Task teardown removes update subscription');
    console.log('Update bridge permissions, expired tasks, older hosts and subscription cleanup passed.');
}
finally { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; }
