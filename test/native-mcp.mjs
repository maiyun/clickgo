import assert from 'node:assert/strict';
import { request as httpRequest } from 'node:http';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import { version } from '../dist/test/native/lib/version.js';
import { start } from '../dist/test/native/lib/mcp.js';

let value = 0;
let calls = 0;
let signal;
let started;
let begin;

/**
 * --- 协议层使用可观察的目标调用，业务执行器另由 ClickGo 回归与桌面验证覆盖 ---
 * @param request 已校验的工具请求
 * @param cancellation 协议取消信号
 * @returns 固定测试 App 的结果
 */
async function invoke(request, cancellation) {
    ++calls;
    if (request.method === 'listTasks') {
        return { 'ok': true, 'data': [{ 'id': 'app', 'name': 'Counter app' }] };
    }
    if (request.taskId !== 'app') {
        return { 'ok': false, 'error': { 'code': 'unavailable', 'message': 'App has ended' } };
    }
    if (request.method === 'list') {
        return { 'ok': true, 'data': [{ 'name': 'counter.add', 'inputSchema': {
            'type': 'object', 'properties': { 'amount': { 'type': 'integer', 'minimum': 1 } },
            'required': ['amount'],
        } }] };
    }
    if (request.name === 'slow') {
        signal = cancellation;
        begin();
        return new Promise(resolve => cancellation.addEventListener('abort', () => resolve({
            'ok': false, 'error': { 'code': 'cancelled', 'message': 'Cancelled' },
        }), { 'once': true }));
    }
    if (request.name !== 'counter.add') {
        return { 'ok': false, 'error': { 'code': 'not-found', 'message': 'Command not found' } };
    }
    if (!Number.isInteger(request.args?.['amount']) || request.args['amount'] < 1) {
        return { 'ok': false, 'error': { 'code': 'invalid-input', 'message': 'Amount must be positive' } };
    }
    value += request.args['amount'];
    return { 'ok': true, 'data': { 'value': value } };
}

const service = await start(invoke);
assert.notEqual(service, false);
const headers = { 'Authorization': `Bearer ${service.info.token}` };
const clients = [];
try {
    // --- 未认证、跨来源与错误 Host 不得到达目标调用。 ---
    assert.equal(await start(async () => ({}), { 'port': -1 }), false);
    assert.equal(await start(async () => ({}), { 'token': 'short' }), false);
    assert.equal((await fetch(service.info.url)).status, 401);
    assert.equal((await fetch(service.info.url, {
        'headers': { ...headers, 'Origin': 'https://untrusted.example' },
    })).status, 403);
    const badHost = await new Promise(resolve => {
        httpRequest(service.info.url, { 'headers': { ...headers, 'Host': 'untrusted.example' } }, response => {
            response.resume();
            resolve(response.statusCode);
        }).end();
    });
    assert.equal(badHost, 403);
    assert.equal((await fetch(service.info.url.replace('/mcp', '/other'), { 'headers': headers })).status, 404);
    assert.equal(calls, 0);

    // --- 旧协议客户端与当前协议客户端均可发现工具并调用。 ---
    for (const mode of ['legacy', 'auto']) {
        const client = new Client({ 'name': 'native-mcp-test', 'version': '1.0.0' }, {
            'versionNegotiation': { 'mode': mode },
        });
        clients.push(client);
        await client.connect(new StreamableHTTPClientTransport(new URL(service.info.url), {
            'requestInit': { 'headers': headers },
        }));
        assert.deepEqual(client.getServerVersion(), { name: 'clickgo-native', version });
        assert.match(client.getInstructions(), /one or more running ClickGo App instances/);
        assert.match(client.getInstructions(), /Copy that id unchanged into the taskId/);
        const tools = await client.listTools();
        assert.match(tools.tools[0].description, /data: \[\{id, name\}\]/);
        assert.match(tools.tools[0].outputSchema.properties.data.items.properties.id.description, /taskId/);
        assert.match(tools.tools[1].inputSchema.properties.taskId.description, /copy the id field/);
        assert.match(tools.tools[2].inputSchema.properties.name.description, /clickgo_list_commands/);
        assert.match(tools.tools[2].inputSchema.properties.args.description, /inputSchema/);
        assert.deepEqual(tools.tools.map(tool => tool.name), [
            'clickgo_list_apps', 'clickgo_list_commands', 'clickgo_execute_command',
        ]);
        assert.equal(tools.tools[2].inputSchema['properties']['args']['type'], 'object');
        const apps = await client.callTool({ 'name': 'clickgo_list_apps', 'arguments': {} });
        assert.deepEqual(apps.structuredContent, { 'ok': true, 'data': [{ 'id': 'app', 'name': 'Counter app' }] });
        const commands = await client.callTool({
            'name': 'clickgo_list_commands', 'arguments': { 'taskId': 'app' },
        });
        assert.equal(commands.structuredContent['data'][0]['name'], 'counter.add');
        const result = await client.callTool({ 'name': 'clickgo_execute_command', 'arguments': {
            'taskId': 'app', 'name': 'counter.add', 'args': { 'amount': 2 },
        } });
        assert.equal(result.isError, false);
        assert.equal(result.structuredContent['data']['value'], mode === 'legacy' ? 2 : 4);
        const privateCall = await client.callTool({ 'name': 'clickgo_execute_command', 'arguments': {
            'taskId': 'app', 'name': 'private', 'args': {},
        } });
        assert.equal(privateCall.isError, true);
        assert.equal(privateCall.structuredContent['error']['code'], 'not-found');
        const missing = await client.callTool({
            'name': 'clickgo_list_commands', 'arguments': { 'taskId': 'gone' },
        });
        assert.equal(missing.isError, true);
        const invalid = await client.callTool({ 'name': 'clickgo_execute_command', 'arguments': {
            'taskId': 'app', 'name': 'counter.add', 'args': { 'amount': -1 },
        } });
        assert.equal(invalid.structuredContent['error']['code'], 'invalid-input');
        assert.equal(value, mode === 'legacy' ? 2 : 4);
        const before = calls;
        const badSchema = await client.callTool({
            'name': 'clickgo_list_commands', 'arguments': { 'taskId': 1 },
        }).catch(error => error);
        assert.ok(badSchema.isError || badSchema instanceof Error);
        assert.equal(calls, before, 'SDK rejects invalid tool input before forwarding to the App');

        if (mode === 'auto') {
            assert.ok(client.getDiscoverResult(), 'The client negotiated the current MCP protocol');
            started = new Promise(resolve => { begin = resolve; });
            const controller = new AbortController();
            const slow = client.callTool({
                'name': 'clickgo_execute_command', 'arguments': { 'taskId': 'app', 'name': 'slow' },
            }, { 'signal': controller.signal }).catch(error => error);
            await started;
            controller.abort();
            assert.ok(await slow instanceof Error);
            await new Promise(resolve => {
                if (signal.aborted) {
                    resolve();
                    return;
                }
                const timer = setTimeout(resolve, 5000);
                signal.addEventListener('abort', () => {
                    clearTimeout(timer);
                    resolve();
                }, { 'once': true });
            });
            assert.equal(signal.aborted, true, 'Client cancellation reaches the forwarding callback');
        }
        console.log(`${mode}: discover, tools, calls, schemas and structured failures passed.`);
    }
    // --- 停止服务同时取消尚在执行的交换。 ---
    started = new Promise(resolve => { begin = resolve; });
    const inFlight = clients.at(-1).callTool({
        'name': 'clickgo_execute_command', 'arguments': { 'taskId': 'app', 'name': 'slow' },
    }).catch(error => error);
    await started;
    await service.close();
    await inFlight;
    assert.equal(signal.aborted, true, 'Stopping the server cancels in-flight command calls');
}
finally {
    await Promise.all(clients.map(client => client.close()));
    await service.close();
    await service.close();
}
assert.equal(await fetch(service.info.url).then(() => false, () => true), true, 'Server port is released');
console.log('Native MCP authentication, Host/Origin guards, cancellation and shutdown checks passed.');
