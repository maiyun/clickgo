import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../../lib/task.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source + '\nexport const testState = { list };', {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
let script;
const workers = [];
class Worker {
    constructor() { workers.push(this); }
    postMessage(message) { this.posted ??= []; this.posted.push(message); }
    terminate() { this.terminated = true; }
}
const exports = {};
vm.runInNewContext(compiled, { exports, require: () => ({}), Blob, Worker,
    URL: { createObjectURL: blob => { script = blob; return 'blob:test'; }, revokeObjectURL() {} },
    setTimeout, clearTimeout });
const api = exports;
api.testState.list.owner = { id: 'owner', threads: {} };
api.testState.list.other = { id: 'other', threads: {} };
const Thread = class extends api.AbstractThread {
    main(data) { this.send({ received: data }); }
};
const thread = api.runThread('owner', Thread, { value: 42 });
assert.equal(api.runThread('owner', Thread), thread);
assert.equal(workers.length, 1);
const workerCode = await script.text();
const messages = [];
const self = { postMessage: data => messages.push(data) };
vm.runInNewContext(workerCode.replace('const AbstractThread = class AbstractThread', 'const AbstractThread = class Minified'), { self });
await self.onmessage({ data: { cmd: 'cg-init', data: { value: 42 } } });
assert.equal(messages[0].received.value, 42);
const other = api.runThread('other', Thread);
assert.notEqual(other, thread);
const end = thread.end();
workers[0].onmessage({ data: { cmd: 'cg-terminate' } });
await end;
assert.equal(workers[0].terminated, true);
assert.notEqual(api.runThread('owner', Thread), thread);
console.log('task thread regression passed');

// Compile a real protected application and execute its extracted thread in a worker context.
const { mkdtemp, writeFile, rm } = await import('node:fs/promises');
const { tmpdir } = await import('node:os');
const { join } = await import('node:path');
const { createRequire } = await import('node:module');
const require = createRequire(import.meta.url);
const compilerSource = await readFile(new URL('../../compiler/compiler.ts', import.meta.url), 'utf8');
const compilerCode = ts.transpileModule(compilerSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;
const threadsSource = await readFile(new URL('../../compiler/abox/threads.ts', import.meta.url), 'utf8');
const threadsExports = {};
vm.runInNewContext(ts.transpileModule(threadsSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: threadsExports, require });
const compilerExports = {};
const tool = await import('../../lib/tool.js');
vm.runInNewContext(compilerCode, { exports: compilerExports, require: name => name === '../lib/tool.js' ? tool : name === './abox/threads.js' ? threadsExports : require(name),
    process, Buffer, TextEncoder, Uint8Array, crypto: globalThis.crypto, console });
const directory = await mkdtemp(join(tmpdir(), 'clickgo-thread-'));
try {
    await writeFile(join(directory, 'config.json'), JSON.stringify({ name: 'Thread test', id: 'thread-test' }));
    await writeFile(join(directory, 'app.js'), `import * as clickgo from 'clickgo';
export default class extends clickgo.task.AbstractThread {
    main(data) { this.send({ custom: 'main', data }); }
    onMessage(e) { this.send({ custom: 'message', data: e.data }); }
    onEnded() { this.send({ custom: 'ended' }); }
}
console.log('other app code remains protected');`);
    assert.equal(await compilerExports.application(directory, undefined, join(directory, 'result')), true);
    const appCode = await readFile(join(directory, 'app.pack.js'), 'utf8');
    assert.ok(!appCode.includes('other app code remains protected'), 'other application code is obfuscated');
    const appContext = { clickgo: { modules: { clickgo: { task: { AbstractThread: api.AbstractThread } } } }, console: { log() {} } };
    vm.runInNewContext(appCode, appContext);
    const PackedThread = appContext.emodule.default ?? appContext.emodule;
    api.runThread('owner', PackedThread, { value: 7 });
    const packedWorker = await script.text();
    const packedMessages = [];
    const packedSelf = { postMessage: data => packedMessages.push(data) };
    vm.runInNewContext(packedWorker, { self: packedSelf });
    await packedSelf.onmessage({ data: { cmd: 'cg-init', data: { value: 7 } } });
    await packedSelf.onmessage({ data: { cmd: 'hello', value: 8 } });
    await packedSelf.onmessage({ data: { cmd: 'cg-terminate' } });
    assert.deepEqual(packedMessages.map(item => item.custom ?? item.cmd), ['main', 'message', 'ended', 'cg-terminate']);
    assert.equal(packedMessages[0].data.value, 7);
    assert.equal(packedMessages[1].data.value, 8);
}
finally {
    await rm(directory, { recursive: true, force: true });
}
console.log('packed task thread regression passed');
