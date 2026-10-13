import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { start } from '../../test/native/lib/mcp.js';

// --- 传入真实打包的软件路径；可在后面追加测试环境需要的 Electron 参数 ---
assert.ok(process.argv[2], 'Usage: node dist/abox/test/native-executable.mjs <packaged-executable> [electron-options]');
const executable = await realpath(process.argv[2]);
const electronArgs = process.argv.slice(3);
const root = await mkdtemp(join(tmpdir(), 'clickgo-native-executable-'));
process.env['CLICKGO_NATIVE_RUNTIME_DIR'] = join(root, 'run');
const env = { ...process.env, 'PATH': join(root, 'no-system-node') };
delete env['ELECTRON_RUN_AS_NODE'];
if (process.platform === 'linux') {
    env['DISPLAY'] = '';
    // --- AI 客户端可能是另一个 AppImage，继承的环境不能改变目标软件归属 ---
    env['APPIMAGE'] = join(root, 'other-software.AppImage');
    env['APPDIR'] = join(root, 'other-software');
}
const services = [];
const clients = [];
let value = 0;
let started = 0;
let cancelled = 0;

/**
 * --- 测试软件的命令状态，真实 HTTP/stdio 协议沿同一个取消信号进入 ---
 * @param request 已解析的命令请求
 * @param signal 上游取消信号
 * @returns 命令结果
 */
async function invoke(request, signal) {
    if (request.method === 'listTasks') {
        return { 'ok': true, 'data': [{ 'id': 'counter', 'name': 'Counter' }] };
    }
    if (request.taskId !== 'counter') {
        return { 'ok': false, 'error': { 'code': 'unavailable', 'message': 'Unknown App' } };
    }
    if (request.method === 'list') {
        return { 'ok': true, 'data': [{ 'name': 'counter.add', 'description': 'Increase counter',
            'inputSchema': { 'type': 'object', 'properties': { 'amount': { 'type': 'integer' } } } }] };
    }
    if (request.name === 'slow') {
        ++started;
        return new Promise(resolve => signal.addEventListener('abort', () => {
            ++cancelled;
            resolve({ 'ok': false, 'error': { 'code': 'cancelled', 'message': 'Cancelled' } });
        }, { 'once': true }));
    }
    if (request.name !== 'counter.add' || !Number.isInteger(request.args?.['amount'])) {
        return { 'ok': false, 'error': { 'code': 'invalid-input', 'message': 'Invalid amount' } };
    }
    value += request.args['amount'];
    return { 'ok': true, 'data': { 'value': value } };
}

/**
 * --- 直接执行打包的软件，不经 Node、npm 或 shell 启动 ---
 * @param args 软件命令参数
 * @param keepInput 保持 stdin 打开，用于测试真实 EOF 关闭
 * @returns 子进程与退出结果；超时强制清理并由调用点判断失败
 */
function launch(args, keepInput = false) {
    const child = spawn(executable, [...electronArgs, ...args], { 'env': env });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    child.stdout.on('data', data => { stdout += data; });
    child.stderr.on('data', data => { stderr += data; });
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, 15000);
    const done = new Promise(resolve => child.once('close', code => {
        clearTimeout(timer);
        resolve({ code, stdout, stderr, timedOut });
    }));
    if (!keepInput) {
        child.stdin.end();
    }
    return { child, done };
}

/**
 * --- 等待实际协议事件，失败时由断言结束测试 ---
 * @param predicate 目标状态
 * @returns 无
 */
async function waitFor(predicate) {
    for (let i = 0; i < 500; ++i) {
        if (predicate()) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
    assert.fail('The expected command or cancellation did not arrive');
}

try {
    const help = await launch(['--cli', '--help']).done;
    assert.equal(help.code, 0);
    assert.match(help.stdout, /--mcp/);
    assert.equal(help.stderr, '');
    const absent = await launch(['--cli', 'apps']).done;
    assert.equal(absent.code, 1);
    assert.equal(JSON.parse(absent.stdout).error.code, 'unavailable');
    const eof = await launch(['--mcp']).done;
    assert.equal(eof.code, 0);
    assert.equal(eof.stdout, '');
    // --- 安装归属与自定义业务 ID 分开；同一软件的可执行文件默认能定位当前服务 ---
    const applicationId = createHash('sha256').update(executable).digest('hex').slice(0, 24);
    const host = { 'id': 'default', 'name': 'Executable test', 'applicationId': applicationId };
    const service = await start(invoke, { 'id': 'custom-software' }, host);
    assert.notEqual(service, false);
    services.push(service);
    const instances = await launch(['--cli', 'instances']).done;
    assert.equal(JSON.parse(instances.stdout).data.length, 1);
    assert.ok(!instances.stdout.includes(service.info.token));
    const added = await launch(['--cli', 'execute', '--app', 'counter', '--name', 'counter.add', '--args', '{"amount":2}']).done;
    assert.equal(added.code, 0);
    assert.equal(JSON.parse(added.stdout).data.value, 2);
    for (const mode of ['legacy', 'auto']) {
        const transport = new StdioClientTransport({ 'command': executable,
            'args': [...electronArgs, '--mcp'], 'env': env, 'stderr': 'pipe' });
        let stderr = '';
        transport.stderr.on('data', data => { stderr += data; });
        const client = new Client({ 'name': 'executable-test', 'version': '1' }, { 'versionNegotiation': { mode } });
        clients.push(client);
        await client.connect(transport);
        assert.equal((await client.listTools()).tools.length, 3);
        assert.equal((await client.callTool({ 'name': 'clickgo_list_apps', 'arguments': {} })).structuredContent.data[0].id, 'counter');
        const result = await client.callTool({ 'name': 'clickgo_execute_command', 'arguments': {
            'taskId': 'counter', 'name': 'counter.add', 'args': { 'amount': 1 },
        } });
        assert.equal(result.structuredContent.data.value, mode === 'legacy' ? 3 : 4);
        const controller = new AbortController();
        const pending = client.callTool({ 'name': 'clickgo_execute_command', 'arguments': {
            'taskId': 'counter', 'name': 'slow',
        } }, { 'signal': controller.signal }).catch(() => null);
        const expected = mode === 'legacy' ? 1 : 2;
        await waitFor(() => started === expected);
        controller.abort();
        await pending;
        await waitFor(() => cancelled === expected);
        assert.equal(stderr, '');
        await client.close();
    }
    // --- 请求执行中关闭 stdin，必须撤销下游调用并自然退出，不能依赖客户端补发 kill ---
    const activeEof = launch(['--mcp'], true);
    let initialized = false;
    const lines = createInterface({ 'input': activeEof.child.stdout });
    lines.on('line', line => {
        if (JSON.parse(line).id === 1) {
            initialized = true;
        }
    });
    activeEof.child.stdin.write(`${JSON.stringify({ 'jsonrpc': '2.0', 'id': 1, 'method': 'initialize',
        'params': { 'protocolVersion': '2025-11-25', 'capabilities': {}, 'clientInfo': { 'name': 'eof-test', 'version': '1' } },
    })}\n`);
    await waitFor(() => initialized);
    activeEof.child.stdin.write(`${JSON.stringify({ 'jsonrpc': '2.0', 'method': 'notifications/initialized' })}\n`);
    activeEof.child.stdin.write(`${JSON.stringify({ 'jsonrpc': '2.0', 'id': 2, 'method': 'tools/call',
        'params': { 'name': 'clickgo_execute_command', 'arguments': { 'taskId': 'counter', 'name': 'slow' } },
    })}\n`);
    await waitFor(() => started === 3);
    activeEof.child.stdin.end();
    const closed = await activeEof.done;
    assert.equal(closed.timedOut, false);
    assert.equal(closed.code, 0);
    await waitFor(() => cancelled === 3);
    lines.close();
    if (process.platform !== 'win32') {
        const interrupt = launch(['--cli', 'execute', '--app', 'counter', '--name', 'slow']);
        await waitFor(() => started === 4);
        interrupt.child.kill('SIGINT');
        const result = await interrupt.done;
        assert.equal(result.timedOut, false);
        assert.equal(result.code, 1);
        assert.equal(JSON.parse(result.stdout).error.code, 'cancelled');
        await waitFor(() => cancelled === 4);
    }
    const duplicate = await start(invoke, { 'id': 'custom-software' }, host);
    assert.notEqual(duplicate, false);
    services.push(duplicate);
    const ambiguous = await launch(['--cli', 'apps']).done;
    assert.equal(ambiguous.code, 1);
    assert.equal(JSON.parse(ambiguous.stdout).error.code, 'ambiguous-host');
    await duplicate.close();
    await service.close();
    const stopped = await launch(['--cli', 'apps']).done;
    assert.equal(stopped.code, 1);
    assert.equal(JSON.parse(stopped.stdout).error.code, 'unavailable');
    console.log('Packaged executable: no system Node/display, CLI, stdio legacy/auto, EOF, cancellation and instance discovery passed.');
}
finally {
    await Promise.all(clients.map(client => client.close()));
    await Promise.all(services.map(service => service.close()));
    await rm(root, { 'recursive': true, 'force': true });
}
