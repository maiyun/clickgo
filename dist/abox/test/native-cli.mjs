import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, chmod, symlink, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { version } from '../../test/native/lib/version.js';
import { start } from '../../test/native/lib/mcp.js';
import { directory, list } from '../../test/native/lib/instance.js';

const root = await mkdtemp(join(tmpdir(), 'clickgo-native-cli-'));
const scopedEntry = join(root, 'software-cli.mjs');
// --- 临时测试进程调用内部适配器，不提供可分发的 Node 命令入口 ---
await writeFile(scopedEntry, `import { run } from '${pathToFileURL(resolve('dist/test/native/lib/cli.js')).href}';
await run(process.argv.slice(3), { applicationId: process.argv[2], command: 'TestSoftware' });`);
const host = { id: 'default', name: 'TestSoftware', applicationId: 'software-installation' };
process.env.CLICKGO_NATIVE_RUNTIME_DIR = join(root, 'run');
const clients = [];
const services = [];
let value = 0;
let cancelled = 0;
let begun = 0;
let mutations = 0;
const fileBytes = Buffer.from(Uint8Array.from({ length: 4 * 1024 * 1024 + 3 }, (_, index) => index * 31 % 256));
const exportedFile = { fileId: '12345678-1234-4234-8234-123456789abc', fileName: 'native-export.bin',
    mimeType: 'application/octet-stream', byteLength: fileBytes.length,
    uri: 'clickgo-file:///task/task/12345678-1234-4234-8234-123456789abc',
    createdAt: Date.now(), expiresAt: Date.now() + 600000, readCommand: 'clickgo.file.read', readChunkSize: 393216 };
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
    if (request.name === 'document.export') {
        return { ok: true, data: { generated: true }, files: [exportedFile] };
    }
    if (request.name === 'clickgo.file.read') {
        if (request.args.fileId !== exportedFile.fileId) return { ok: false, error: { code: 'file-unavailable', message: 'Unknown file' } };
        const offset = request.args.offset ?? 0;
        const end = Math.min(fileBytes.length, offset + request.args.length);
        return { ok: true, data: { file: exportedFile, offset, nextOffset: end < fileBytes.length ? end : null,
            encoding: 'base64', data: fileBytes.subarray(offset, end).toString('base64') } };
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
function cli(args, input, applicationId = host.applicationId) {
    const child = spawn(process.execPath, [scopedEntry, applicationId, ...args], { env: process.env });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', value => { stdout += value; });
    child.stderr.on('data', value => { stderr += value; });
    child.stdin.end(input);
    const done = new Promise(resolve => child.on('close', code => resolve({ code, stdout, stderr })));
    return { child, done };
}
async function run(args, input, applicationId) {
    const result = await cli(args, input, applicationId).done;
    return { ...result, data: result.stdout ? JSON.parse(result.stdout) : undefined };
}
async function waitFor(predicate) {
    for (let tries = 0; tries < 300; ++tries) {
        if (predicate()) return;
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.fail('Expected cancellation/execution event did not arrive');
}
async function connect(mode, applicationId = host.applicationId) {
    const transport = new StdioClientTransport({ command: process.execPath,
        args: [scopedEntry, applicationId, 'mcp'],
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
    const service = await start(invoke, { id: 'software' }, host);
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
        const exported = await session.client.callTool({ name: 'clickgo_execute_command', arguments: {
            taskId: 'task', name: 'document.export',
        } });
        const fileLink = exported.content.find(item => item.type === 'resource_link');
        assert.equal(fileLink.uri, exportedFile.uri);
        const resource = await session.client.readResource({ uri: fileLink.uri });
        assert.deepEqual(Buffer.from(resource.contents[0].blob, 'base64'), fileBytes,
            'stdio resource reads reach the original HTTP App export');
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
    const second = await start(invoke, { id: 'software' }, host);
    services.push(second);
    assert.equal((await run(['execute', '--host', 'software', '--app', 'task', '--name', 'counter.add', '--args', '{"amount":1}'])).data.error.code, 'ambiguous-host');
    assert.equal(mutations, before);
    assert.equal((await run(['apps', '--host', record.instance])).data.ok, true);
    await second.close();
    await service.close();
    assert.equal((await active.callTool({ name: 'clickgo_list_apps', arguments: {} })).structuredContent.error.code, 'unavailable');
    const restarted = await start(invoke, { id: 'software' }, host);
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
    // --- 软件自身默认只发现同一安装，业务自定义 MCP ID 不影响归属 ---
    const own = await start(invoke, { id: 'custom-software' }, { id: 'default', name: 'Own', applicationId: 'owned' });
    let otherCalls = 0;
    const other = await start(async () => {
        ++otherCalls;
        return { ok: true, data: [] };
    }, { id: 'custom-software' }, { id: 'default', name: 'Other', applicationId: 'other' });
    assert.notEqual(own, false);
    assert.notEqual(other, false);
    services.push(own, other);
    const scoped = await run(['instances'], undefined, 'owned');
    assert.equal(scoped.data.data.length, 1);
    assert.equal(scoped.data.data[0].name, 'Own');
    assert.ok(!scoped.stdout.includes(own.info.token));
    assert.equal((await run(['apps'], undefined, 'owned')).data.data[0].id, 'task');
    const otherRecord = (await list()).find(instance => instance.applicationId === 'other');
    assert.equal((await run(['apps', '--host', otherRecord.instance], undefined, 'owned')).data.error.code, 'unavailable');
    const scopedStdio = await connect('auto', 'owned');
    assert.equal((await scopedStdio.client.callTool({ name: 'clickgo_list_apps', arguments: {} })).structuredContent.data[0].id, 'task');
    const duplicate = await start(invoke, { id: 'custom-software' }, { id: 'default', name: 'Own second', applicationId: 'owned' });
    assert.notEqual(duplicate, false);
    services.push(duplicate);
    assert.equal((await run(['apps'], undefined, 'owned')).data.error.code, 'ambiguous-host');
    assert.equal((await run(['apps', '--host', scoped.data.data[0].instance], undefined, 'owned')).data.ok, true);
    assert.equal(otherCalls, 0);
    assert.match((await cli(['--help'], undefined, 'owned').done).stdout, /TestSoftware --mcp/);
    await duplicate.close();
    await own.close();
    await other.close();
    assert.deepEqual(await list(), []);
    if (process.platform !== 'win32') {
        await chmod(directory(), 0o755);
        assert.equal(await start(invoke, {id:'unsafe'}), false);
        await chmod(directory(), 0o700);
    }
    console.log('CLI JSON, stdin, token privacy, discovery guards, software scope, ambiguity, cancellation, restart and cleanup passed.');
}
finally {
    await Promise.all(clients.map(client => client.close()));
    await Promise.all(services.filter(Boolean).map(service => service.close()));
    await rm(root, { recursive: true, force: true });
}
