import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { list, lockStart, releaseStart } from '../../test/native/lib/instance.js';

const root = await mkdtemp(join(tmpdir(), 'clickgo-native-startup-'));
const gui = join(root, 'test-gui.mjs');
const entry = join(root, 'test-command.mjs');
const log = join(root, 'starts.jsonl');
process.env.CLICKGO_NATIVE_RUNTIME_DIR = join(root, 'run');
const env = { ...process.env, CG_TEST_START_LOG: log };
const clients = [];
await writeFile(entry, `import { run } from '${pathToFileURL(resolve('dist/test/native/lib/cli.js')).href}';
await run(process.argv.slice(3), { applicationId: process.argv[2], command: 'TestSoftware',
startup: process.env.CG_TEST_STARTUP ? JSON.parse(process.env.CG_TEST_STARTUP) : undefined });`);
await writeFile(gui, `import { appendFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import { start } from '${pathToFileURL(resolve('dist/test/native/lib/mcp.js')).href}';
const applicationId = process.argv[2];
await appendFile(process.env.CG_TEST_START_LOG, JSON.stringify({ applicationId, pid: process.pid }) + '\\n');
await setTimeout(Number(process.argv[4]));
const readyAt = Date.now() + Number(process.argv[3]);
const taskId = randomUUID();
let value = 0;
const service = await start(async request => {
  if (request.method === 'listTasks') return { ok: true, data: Date.now() < readyAt ? [] : [{ id: taskId, name: 'Counter' }] };
  if (request.taskId !== taskId) return { ok: false, error: { code: 'unavailable', message: 'Unknown App' } };
  if (request.method === 'list') return { ok: true, data: [{ name: 'counter.add', inputSchema: { type: 'object' } }] };
  if (request.name === 'counter.add') value += request.args.amount;
  return { ok: true, data: value };
}, {}, { id: 'test-software', name: 'TestSoftware', applicationId });
process.on('SIGTERM', () => { void service.close().finally(() => process.exit()); });`);

function startup(applicationId, delay = 250, timeout = 5000, publicationDelay = 0) {
    return { command: process.execPath, args: [gui, applicationId, String(delay), String(publicationDelay)], timeout };
}
function cli(applicationId, args, launch = startup(applicationId)) {
    const child = spawn(process.execPath, [entry, applicationId, ...args], {
        env: { ...env, CG_TEST_STARTUP: launch === null ? '' : JSON.stringify(launch) },
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.stdin.end();
    const done = new Promise(resolve => child.on('close', code => {
        resolve({ code, stdout, stderr, result: args.includes('--help') ? null : JSON.parse(stdout) });
    }));
    return { child, done };
}
async function starts() {
    return (await readFile(log, 'utf8').catch(() => '')).trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
}
async function waitFor(predicate) {
    for (let i = 0; i < 300; ++i) {
        if (await predicate()) return;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.fail('Startup did not reach the expected state');
}
async function checkReleased(applicationId) {
    assert.equal((await readdir(process.env.CLICKGO_NATIVE_RUNTIME_DIR)).includes(`start-${applicationId}.lock`), false);
}
try {
    assert.equal((await cli('stdio-software', ['apps'], null).done).result.error.code, 'unavailable');
    assert.ok((await cli('stdio-software', ['--help']).done).stdout.includes('opens automatically'));
    assert.deepEqual((await cli('stdio-software', ['instances']).done).result.data, []);
    assert.deepEqual(await starts(), []);

    // --- MCP 协商与工具发现没有 GUI 副作用；第一次工具调用才按需启动 ---
    const transport = new StdioClientTransport({ command: process.execPath,
        args: [entry, 'stdio-software', 'mcp'], stderr: 'pipe',
        env: { ...env, CG_TEST_STARTUP: JSON.stringify(startup('stdio-software')) } });
    const client = new Client({ name: 'startup-test', version: '1' });
    clients.push(client);
    await client.connect(transport);
    assert.equal((await client.listTools()).tools.length, 3);
    assert.deepEqual(await starts(), []);
    const apps = await client.callTool({ name: 'clickgo_list_apps', arguments: {} });
    const taskId = apps.structuredContent.data[0].id;
    assert.equal((await starts()).length, 1);
    await checkReleased('stdio-software');
    const result = await cli('stdio-software', ['execute', '--app', taskId, '--name', 'counter.add', '--args', '{"amount":2}']).done;
    assert.deepEqual(result.result, { ok: true, data: 2 });
    await client.close();
    assert.equal((await cli('stdio-software', ['apps']).done).result.data[0].id, taskId);
    assert.equal((await starts()).length, 1, 'closing stdio must leave the GUI available');
    assert.equal((await cli('stdio-software', ['apps', '--host', 'wrong-host']).done).result.error.code, 'unavailable');
    assert.equal((await starts()).length, 1, 'an incorrect selector must not create another instance');

    // --- 服务记录先出现、App 后就绪；两个独立 CLI 仍只启动一个 GUI ---
    const parallel = await Promise.all([cli('parallel-software', ['apps']).done, cli('parallel-software', ['apps']).done]);
    assert.equal(parallel[0].code, 0);
    assert.equal(parallel[1].code, 0);
    assert.equal(parallel[0].result.data[0].id, parallel[1].result.data[0].id);
    assert.equal((await starts()).filter(item => item.applicationId === 'parallel-software').length, 1);
    await checkReleased('parallel-software');

    // --- 启动失败释放锁；超时不关闭仍在启动的 GUI，也不重复启动 ---
    const failure = await cli('missing-software', ['apps'], { command: join(root, 'missing-binary'), args: [] }).done;
    assert.equal(failure.result.error.code, 'startup-failed');
    await checkReleased('missing-software');
    const timeout = await cli('slow-software', ['apps'], startup('slow-software', 250, 400, 1400)).done;
    assert.equal(timeout.result.error.code, 'startup-timeout');
    assert.equal((await list()).some(item => item.applicationId === 'slow-software'), false);
    assert.equal((await cli('slow-software', ['apps']).done).code, 0);
    assert.equal((await starts()).filter(item => item.applicationId === 'slow-software').length, 1);
    await checkReleased('slow-software');

    // --- MCP 记录尚未发布时取消；后续 CLI 与 stdio 等待同一个 GUI ---
    const cancelled = cli('cancelled-software', ['apps'], startup('cancelled-software', 250, 5000, 1200));
    await waitFor(async () => (await starts()).some(item => item.applicationId === 'cancelled-software'));
    cancelled.child.kill('SIGTERM');
    assert.equal((await cancelled.done).result.error.code, 'cancelled');
    assert.equal((await list()).some(item => item.applicationId === 'cancelled-software'), false);
    const cancelledPid = (await starts()).find(item => item.applicationId === 'cancelled-software').pid;
    process.kill(cancelledPid, 0);
    assert.equal(Number(await readFile(join(process.env.CLICKGO_NATIVE_RUNTIME_DIR,
        'start-cancelled-software.lock'), 'utf8')), cancelledPid);
    const resumedTransport = new StdioClientTransport({ command: process.execPath,
        args: [entry, 'cancelled-software', 'mcp'], stderr: 'pipe',
        env: { ...env, CG_TEST_STARTUP: JSON.stringify(startup('cancelled-software')) } });
    const resumedClient = new Client({ name: 'startup-resume-test', version: '1' });
    clients.push(resumedClient);
    await resumedClient.connect(resumedTransport);
    const resumed = await Promise.all([
        cli('cancelled-software', ['apps']).done,
        resumedClient.callTool({ name: 'clickgo_list_apps', arguments: {} }),
    ]);
    assert.equal(resumed[0].code, 0);
    assert.equal(resumed[0].result.data[0].id, resumed[1].structuredContent.data[0].id);
    assert.equal((await starts()).filter(item => item.applicationId === 'cancelled-software').length, 1);
    await checkReleased('cancelled-software');
    await resumedClient.close();

    // --- GUI 在发布记录前退出，下一请求收回启动权并正常重开 ---
    const crashed = cli('crashed-software', ['apps'], startup('crashed-software', 250, 5000, 2000));
    await waitFor(async () => (await starts()).some(item => item.applicationId === 'crashed-software'));
    crashed.child.kill('SIGTERM');
    assert.equal((await crashed.done).result.error.code, 'cancelled');
    const crashedPid = (await starts()).find(item => item.applicationId === 'crashed-software').pid;
    process.kill(crashedPid, 'SIGTERM');
    await waitFor(() => {
        try {
            process.kill(crashedPid, 0);
            return false;
        }
        catch {
            return true;
        }
    });
    assert.equal((await cli('crashed-software', ['apps']).done).code, 0);
    assert.equal((await starts()).filter(item => item.applicationId === 'crashed-software').length, 2);
    await checkReleased('crashed-software');

    // --- 交接后旧请求的最终清理不能撤销 GUI 锁，也不能清理另一进程的锁 ---
    const handedLock = await lockStart('handoff-software');
    assert.notEqual(handedLock, false);
    assert.notEqual(handedLock, null);
    assert.equal(await handedLock.transfer(process.pid), true);
    await handedLock.close();
    assert.equal(await lockStart('handoff-software'), null);
    await releaseStart('handoff-software', process.pid + 1);
    assert.equal(await lockStart('handoff-software'), null);
    await releaseStart('handoff-software', process.pid);
    await checkReleased('handoff-software');

    // --- 异常退出遗留的启动锁不妨碍下一次启动 ---
    const dead = spawn(process.execPath, ['-e', '']);
    await new Promise(resolve => dead.once('close', resolve));
    await writeFile(join(process.env.CLICKGO_NATIVE_RUNTIME_DIR, 'start-recovered-software.lock'), String(dead.pid), { mode: 0o600 });
    assert.equal((await cli('recovered-software', ['apps']).done).code, 0);
    await checkReleased('recovered-software');
    console.log('Native lazy startup, concurrent CLI/stdio, cancellation before discovery, timeout reuse and crash recovery passed.');
}
finally {
    for (const client of clients) await client.close().catch(() => {});
    for (const { pid } of await starts()) {
        try { process.kill(pid, 'SIGTERM'); } catch {}
    }
    await waitFor(async () => (await list()).length === 0);
    await rm(root, { recursive: true, force: true });
}
