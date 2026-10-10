import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, chmod, symlink, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { version } from '../dist/test/native/lib/version.js';
import { start } from '../dist/test/native/lib/mcp.js';
import { directory, list } from '../dist/test/native/lib/instance.js';

const entry = resolve('dist/test/native/cli.js');
const root = await mkdtemp(join(tmpdir(), 'clickgo-native-cli-'));
process.env.CLICKGO_NATIVE_RUNTIME_DIR = join(root, 'run');
const clients = [];
const services = [];
let value = 0;
let cancelled = 0;
let begun = 0;
let mutations = 0;
async function invoke(request, signal) {
    if (request.method === 'listTasks') {
        return { ok: true, data: [{ id: 'task', name: 'Counter' }] };
    }
    if (request.taskId !== 'task') {
        return { ok: false, error: { code: 'unavailable', message: 'Unknown App' } };
    }
    if (request.method === 'list') {
        return { ok: true, data: [{ name: 'counter.add', description: 'Increase counter', inputSchema: { type: 'object' } }] };
    }
    if (request.name === 'slow') {
        ++begun;
        return new Promise(resolve => signal.addEventListener('abort', () => {
            ++cancelled;
            resolve({ ok: false, error: { code: 'cancelled', message: 'Cancelled' } });
        }, { once: true }));
    }
    if (request.name !== 'counter.add' || !Number.isInteger(request.args?.amount)) {
        return { ok: false, error: { code: 'invalid-input', message: 'Invalid command or amount' } };
    }
    ++mutations;
    value += request.args.amount;
    return { ok: true, data: { value, special: Object.hasOwn(request.args, '__proto__') } };
}
function cli(args, input) {
    const child = spawn(process.execPath, [entry, ...args], { env: process.env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', value => { stdout += value; });
    child.stderr.on('data', value => { stderr += value; });
    child.stdin.end(input);
    const done = new Promise(resolve => child.on('close', code => resolve({ code, stdout, stderr })));
    return { child, done };
}
async function run(args, input) {
    const result = await cli(args, input).done;
    return { ...result, data: result.stdout ? JSON.parse(result.stdout) : undefined };
}
async function waitFor(predicate) {
    for (let tries = 0; tries < 300; ++tries) {
        if (predicate()) return;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.fail('Expected cancellation/execution event did not arrive');
}
async function connect(mode) {
    const transport = new StdioClientTransport({ command: process.execPath, args: [entry, 'mcp', '--host', 'software'],
        env: { ...process.env }, stderr: 'pipe' });
    let stderr = '';
    transport.stderr.on('data', value => { stderr += value; });
    const client = new Client({ name: 'stdio-test', version: '1' }, { versionNegotiation: { mode } });
    await client.connect(transport);
    assert.deepEqual(client.getServerVersion(), { name: 'clickgo-native', version });
    clients.push(client);
    return { client, transport, stderr: () => stderr };
}
try {
    assert.deepEqual((await run(['instances'])).data, { ok: true, data: [] });
    assert.equal((await run(['apps'])).data.error.code, 'unavailable');
    const service = await start(invoke, { id: 'software' });
    assert.notEqual(service, false);
    services.push(service);
    const names = await readdir(directory());
    assert.equal(names.length, 1);
    const record = JSON.parse(await readFile(join(directory(), names[0]), 'utf8'));
    const instances = await run(['instances', '--json']);
    assert.equal(instances.data.data[0].id, 'software');
    assert.ok(!instances.stdout.includes(service.info.token));
    assert.equal((await run(['apps', '--host', 'software'])).data.data[0].id, 'task');
    assert.equal((await run(['commands', '--app', 'task'])).data.data[0].name, 'counter.add');
    const added = await run(['execute', '--app', 'task', '--name', 'counter.add', '--args', '{"amount":2,"__proto__":{"x":1}}']);
    assert.equal(added.code, 0);
    assert.deepEqual(added.data.data, { value: 2, special: true });
    const input = await run(['execute', '--app', 'task', '--name', 'counter.add', '--args-file', '-'], '{"amount":3}');
    assert.equal(input.data.data.value, 5);
    assert.equal((await run(['execute', '--app', 'task', '--name', 'counter.add', '--args', '[]'])).code, 1);
    assert.equal((await run(['execute', '--app', 'task', '--name', 'private'])).data.error.code, 'invalid-input');
    assert.equal((await run(['mcp', '--name', 'x'])).stdout, '');
    assert.equal((await run(['__proto__'])).code, 1);
    const argsPath = join(root, 'args.json');
    await writeFile(argsPath, JSON.stringify({amount:0}));
    assert.equal((await run(['execute','--app','task','--name','counter.add','--args-file',argsPath])).data.data.value, 5);
    // --- 发现文件不能跨用户、放宽权限、跟随链接，或将 token 发给外部服务器 ---
    if (process.platform !== 'win32') {
        await chmod(join(directory(), names[0]), 0o644);
        assert.deepEqual(await list(), []);
        await chmod(join(directory(), names[0]), 0o600);
    }
    const bad = { ...record, instance: '00000000-0000-0000-0000-000000000000', info: { ...record.info, url: 'http://example.invalid/mcp' } };
    await writeFile(join(directory(), `${bad.instance}.json`), JSON.stringify(bad), { mode: 0o600 });
    await symlink(join(directory(), names[0]), join(directory(), '11111111-1111-1111-1111-111111111111.json'));
    assert.equal((await list()).length, 1);
    for (const mode of ['legacy', 'auto']) {
        const session = await connect(mode);
        assert.match(session.client.getInstructions(), /Copy that id unchanged into the taskId/);
        const tools = await session.client.listTools();
        assert.match(tools.tools[0].outputSchema.properties.data.items.properties.id.description, /taskId/);
        assert.match(tools.tools[1].inputSchema.properties.taskId.description, /copy the id field/);
        assert.deepEqual(tools.tools.map(tool => tool.name), ['clickgo_list_apps', 'clickgo_list_commands', 'clickgo_execute_command']);
        const result = await session.client.callTool({ name: 'clickgo_execute_command', arguments: {
            taskId: 'task', name: 'counter.add', args: { amount: 1 },
        } });
        assert.equal(result.structuredContent.data.value, ++input.data.data.value);
        assert.equal(session.stderr(), '');
        console.log(`${mode}: official client negotiates stdio and reaches the original HTTP command service.`);
    }
    const active = clients.at(-1);
    const controller = new AbortController();
    const pending = active.callTool({ name: 'clickgo_execute_command', arguments: { taskId: 'task', name: 'slow' } },
        { signal: controller.signal }).catch(() => null);
    await waitFor(() => begun > 0);
    controller.abort();
    await pending;
    await waitFor(() => cancelled > 0);
    assert.equal(cancelled, 1);
    const before = mutations;
    const second = await start(invoke, { id: 'software' });
    services.push(second);
    assert.equal((await run(['execute', '--host', 'software', '--app', 'task', '--name', 'counter.add', '--args', '{"amount":1}'])).data.error.code, 'ambiguous-host');
    assert.equal(mutations, before);
    assert.equal((await run(['apps', '--host', record.instance])).data.ok, true);
    await second.close();
    await service.close();
    assert.equal((await active.callTool({ name: 'clickgo_list_apps', arguments: {} })).structuredContent.error.code, 'unavailable');
    const restarted = await start(invoke, { id: 'software' });
    services.push(restarted);
    assert.notEqual(restarted.info.token, service.info.token);
    assert.equal((await active.callTool({ name: 'clickgo_list_apps', arguments: {} })).structuredContent.ok, true);
    // --- CLI 进程中断也传递同一取消信号 ---
    const child = cli(['execute', '--host', 'software', '--app', 'task', '--name', 'slow']);
    await waitFor(() => begun >= 2);
    child.child.kill('SIGINT');
    const stopped = await child.done;
    assert.equal(JSON.parse(stopped.stdout).error.code, 'cancelled');
    assert.equal(cancelled, 2);
    await restarted.close();
    assert.deepEqual(await list(), []);
    const isolated = await start(invoke, {id:'hidden',discovery:false});
    assert.notEqual(isolated, false);
    await isolated.close();
    assert.deepEqual(await list(), []);
    if (process.platform !== 'win32') {
        await chmod(directory(), 0o755);
        assert.equal(await start(invoke, {id:'unsafe'}), false);
        await chmod(directory(), 0o700);
    }
    console.log('CLI JSON, stdin, token privacy, discovery guards, ambiguity, cancellation, restart and cleanup passed.');
}
finally {
    await Promise.all(clients.map(client => client.close()));
    await Promise.all(services.filter(Boolean).map(service => service.close()));
    await rm(root, { recursive: true, force: true });
}
