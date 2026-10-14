import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { createNativeEventDispatcher } from '../native-events.js';
const normalize = value => JSON.parse(JSON.stringify(value));
const delivered = [];
const errors = [];
const handler = name => ({
    onError: (_tid, _fid, error) => errors.push(error.message),
    onNativeLaunch: event => { delivered.push([name, 'launch', normalize(event)]); event.args.length = 0; },
    onNativeOpenFiles: (paths, info) => { delivered.push([name, 'files', [...paths], normalize(info)]); paths.length = 0; info.source = 'changed'; },
});
const tasks = {
    root: { class: handler('app'), ending: false, forms: {
        main: { closed: false, vroot: handler('form') }, closed: { closed: true, vroot: handler('closed') },
    } },
    denied: { class: handler('denied'), ending: false, forms: { main: { closed: false, vroot: handler('denied-form') } } },
    ending: { class: handler('ending'), ending: true, forms: {} },
};
const source = await readFile(new URL('../../lib/core.ts', import.meta.url), 'utf8');
const tree = ts.createSourceFile('core.ts', source, ts.ScriptTarget.ES2022, true);
const node = tree.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'trigger');
const scope = { exports: {}, sysId: 'system', boot: handler('boot'),
    lTask: { getOriginList: async () => tasks,
        getRuntime: (_system, id) => ({ permissions: id === 'denied' ? [] : ['root'] }) } };
vm.runInNewContext(ts.transpileModule(node.getText(tree), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, scope);
const trigger = scope.exports.trigger;
const launch = { requestId: 1, source: 'startup', args: ['--mode', 'edit', '/tmp/file.txt'], cwd: '/tmp' };
await trigger('nativeLaunch', 'wrong', launch);
assert.equal(delivered.length, 0, 'App cannot forge a Native system event');
await trigger('nativeLaunch', 'system', launch);
assert.deepEqual(delivered.map(item => item[0]), ['boot','app','form']);
assert.ok(delivered.every(item => item[2].args.length === 3), 'each receiver has independent arguments');
assert.equal(launch.args.length, 3);
delivered.length = 0;
const files = { paths: ['/tmp/file.txt'], info: { requestId: 1, source: 'drop' } };
await trigger('nativeOpenFiles', 'system', files);
assert.deepEqual(delivered.map(item => item[0]), ['boot','app','form']);
assert.ok(delivered.every(item => item[2].length === 1 && item[3].source === 'drop'));
assert.equal(files.info.source, 'drop');
delivered.length = 0;
tasks.root.class.onNativeOpenFiles = () => { throw new Error('receiver failure'); };
await trigger('nativeOpenFiles', 'system', files);
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(delivered.map(item => item[0]), ['boot','form']);
assert.ok(errors.some(error => error.includes('receiver failure')));

let ready = false, reads = 0;
const packets = [{ type: 'launch', event: launch }, { type: 'openFiles', ...files }];
let finishRead;
const read = () => { ++reads; return reads === 1 ? new Promise(resolve => { finishRead = resolve; }) : Promise.resolve([]); };
const packetIds = [];
const resume = createNativeEventDispatcher({ ready: () => ready, read,
    dispatch: async packet => { packetIds.push(packet.type); }, error: error => { throw error; } });
resume(); assert.equal(reads, 0, 'events stay in the host queue before Boot.main completes');
ready = true; resume(); resume(); resume(); assert.equal(reads, 1, 'concurrent notifications share one pull');
finishRead(packets);
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(packetIds, ['launch','openFiles']); assert.equal(reads, 2);
let lateResume, lateReads = 0;
const late = [];
lateResume = createNativeEventDispatcher({ ready: () => true,
    read: async () => {
        ++lateReads;
        if (lateReads === 1) { lateResume(); return []; }
        return lateReads === 2 ? [packets[1]] : [];
    }, dispatch: async event => { late.push(event.type); }, error: error => { throw error; } });
lateResume(); await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(late, ['openFiles'], 'a notification concurrent with an empty response is not lost');
let failures = 0;
const failing = createNativeEventDispatcher({ ready: () => true,
    read: async () => { throw new Error('disconnected'); }, dispatch: async () => {}, error: () => { ++failures; } });
failing(); await new Promise(resolve => setImmediate(resolve)); assert.equal(failures, 1);
let oldHostReads = 0;
const oldHost = createNativeEventDispatcher({ ready: () => true,
    read: async () => { ++oldHostReads; return null; }, dispatch: async () => {}, error: error => { throw error; } });
oldHost(); await new Promise(resolve => setImmediate(resolve)); assert.equal(oldHostReads, 1);
console.log('Native global events: trusted origin, root permissions, independent receivers, startup readiness, ordering and concurrent wakeups passed.');
