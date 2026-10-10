import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { createMcpHandler, fromJsonSchema, McpServer } from '@modelcontextprotocol/server';
import * as lInstance from './instance.js';
import { version } from './version.js';
import { localhostHostValidation, localhostOriginValidation, toNodeHandler } from '@modelcontextprotocol/node';
/**
 * --- 创建标准 MCP 服务，将三种操作转发到原有命令接口 ---
 * @param invoke 经过主窗体与生命周期检查的页面调用
 * @param options 本地连接选项
 * @param host 宿主软件标识及名称，不属于业务 App 的 taskId
 * @returns 服务及连接信息，参数无效、发现记录无法保护或监听失败时为 false
 */
export async function start(invoke, options = {}, host = { 'id': 'clickgo-native', 'name': 'ClickGo Native' }) {
    const port = options.port ?? 0;
    const token = options.token ?? randomBytes(32).toString('base64url');
    if (!Number.isInteger(port) || port < 0 || port > 65535 || !/^[A-Za-z0-9_-]{32,256}$/.test(token)) {
        return false;
    }
    const handler = createMcpHandler(() => createCommandServer(invoke), { 'maxRequestBodySize': 1024 * 1024 });
    const nodeHandler = toNodeHandler(handler, { 'maxRequestBodySize': 1024 * 1024 });
    const validateHost = localhostHostValidation();
    const validateOrigin = localhostOriginValidation();
    const expected = Buffer.from(`Bearer ${token}`);
    const http = createServer((request, response) => {
        if (request.url?.split('?')[0] !== '/mcp') {
            response.writeHead(404).end();
            return;
        }
        if (!validateHost(request, response) || !validateOrigin(request, response)) {
            return;
        }
        const authorization = Buffer.from(request.headers['authorization'] ?? '');
        if (authorization.length !== expected.length || !timingSafeEqual(authorization, expected)) {
            response.writeHead(401, { 'www-authenticate': 'Bearer realm="ClickGo Native"' }).end();
            return;
        }
        nodeHandler(request, response).catch(() => {
            if (!response.headersSent) {
                response.writeHead(500).end();
            }
        });
    });
    const listening = await new Promise(resolve => {
        http.once('error', () => { resolve(false); });
        http.listen(port, '127.0.0.1', () => { resolve(true); });
    });
    if (!listening) {
        await handler.close();
        return false;
    }
    const address = http.address();
    if (!address || typeof address === 'string') {
        http.close();
        await handler.close();
        return false;
    }
    const info = { 'transport': 'streamable-http', 'url': `http://127.0.0.1:${address.port}/mcp`, 'token': token };
    const record = options.discovery === false ? null : await lInstance.publish(info, options.id ?? host.id, host.name);
    if (record === false) {
        const stopped = new Promise(resolve => { http.close(() => { resolve(); }); });
        await handler.close();
        http.closeAllConnections();
        await stopped;
        return false;
    }
    let closing;
    return {
        'info': info,
        close: () => {
            if (closing) {
                return closing;
            }
            // --- 先拒绝新连接并取消在途调用，再等待 HTTP 与 SDK 释放资源 ---
            closing = (async () => {
                await record?.close();
                const stopped = new Promise(resolve => {
                    http.close(() => { resolve(); });
                });
                await handler.close();
                http.closeAllConnections();
                await stopped;
            })();
            return closing;
        },
    };
}
/**
 * --- HTTP 和 stdio 使用相同的工具定义，只替换到共享执行层的调用入口 ---
 * @param invoke 已校验的命令请求及取消信号
 * @returns 声明三种通用命令操作的 MCP 服务
 */
export function createCommandServer(invoke) {
    const server = new McpServer({ 'name': 'clickgo-native', 'version': version }, {
        'instructions': `This server controls the currently running Native desktop software. The software can host one or more running ClickGo App instances. An App here is an application instance inside this software, not an installed program or an AI work item.
Call clickgo_list_apps first. Each returned data item has an id and name. Copy that id unchanged into the taskId parameter of subsequent calls; taskId is the framework name for the running App instance ID. If exactly one App is listed, use its id. If several are listed, choose the App matching the user's request by name; ask the user when the target is ambiguous. An empty list means no App is available. Never invent an ID or execute a command in every App to guess the target.
Call clickgo_list_commands with the selected taskId. Each command has a name, description, inputSchema and enabled state. Read these before calling clickgo_execute_command with that taskId, the command name and args matching its inputSchema. If enabled is false, inspect disabledReason instead of executing it. Command names are scoped to their App; the same name in another App can refer to different state.
Only explicitly exposed commands are available. Do not automatically retry commands that change data. After the software or App restarts, or a stale taskId is rejected, list Apps and commands again; App instance IDs can change.`,
    });
    /**
     * --- 将共享命令结果转换为 MCP 工具结果，保留结构化错误 ---
     * @param request 目标操作
     * @param signal 客户端取消信号
     * @returns MCP 结果
     */
    const call = async (request, signal) => {
        const result = await invoke(request, signal);
        return {
            'content': [{ 'type': 'text', 'text': JSON.stringify(result) }],
            'structuredContent': result,
            'isError': result['ok'] !== true,
        };
    };
    server.registerTool('clickgo_list_apps', {
        'title': 'List running applications inside this software',
        'description': `Start here to discover the running applications inside this Native desktop software. One software may contain one or several App instances. Returns {ok, data: [{id, name}]}; each id is the App instance ID to copy unchanged into the taskId argument of clickgo_list_commands and clickgo_execute_command. With one result use its id; with several choose by the user's intended App, asking if ambiguous. An empty data array means no App is running. Rediscover IDs after an App or software restart.`,
        'inputSchema': fromJsonSchema({ 'type': 'object', 'additionalProperties': false }),
        'outputSchema': fromJsonSchema({
            'type': 'object', 'required': ['ok'],
            'properties': {
                'ok': { 'type': 'boolean' },
                'data': {
                    'type': 'array', 'description': 'Currently running App instances inside this software.',
                    'items': {
                        'type': 'object', 'required': ['id', 'name'],
                        'properties': {
                            'id': { 'type': 'string', 'description': 'Opaque running App instance ID. Copy unchanged into the taskId argument of subsequent tools; rediscover after restart.' },
                            'name': { 'type': 'string', 'description': 'Application name to help select the target requested by the user; names need not be unique.' },
                        },
                    },
                },
                'error': { 'type': 'object', 'description': 'Failure details when ok is false.' },
            },
        }),
        'annotations': { 'readOnlyHint': true, 'idempotentHint': true, 'openWorldHint': false },
    }, async (_args, context) => call({ 'method': 'listTasks' }, context.mcpReq.signal));
    server.registerTool('clickgo_list_commands', {
        'title': 'Discover commands in the selected application',
        'description': `Discover the selected App's exposed commands before executing anything. Get taskId from an id returned by clickgo_list_apps. Returns {ok, data: [commands]} with each command's name, description, inputSchema, enabled and disabledReason. Pass a returned command name to clickgo_execute_command and construct args from its inputSchema. An empty list means this App currently exposes no commands; use enabled commands only.`,
        'inputSchema': fromJsonSchema({
            'type': 'object', 'properties': { 'taskId': {
                    'type': 'string', 'minLength': 1,
                    'description': 'Running App instance ID: copy the id field of the chosen item from clickgo_list_apps. This is not a software ID or an AI task ID.',
                } },
            'required': ['taskId'], 'additionalProperties': false,
        }),
        'annotations': { 'readOnlyHint': true, 'idempotentHint': true, 'openWorldHint': false },
    }, async (args, context) => call({ 'method': 'list', 'taskId': args.taskId }, context.mcpReq.signal));
    server.registerTool('clickgo_execute_command', {
        'title': 'Execute a command in the selected application',
        'description': `Execute an enabled, exposed command in one selected App. Get taskId from clickgo_list_apps, then get name and the args inputSchema from clickgo_list_commands for that same App. Identically named commands in different Apps are separate targets. Returns {ok, data} on success or {ok: false, error: {code, message}} on failure. UI and AI calls share validation, permissions, execution and App state. Do not automatically retry commands that change data.`,
        'inputSchema': fromJsonSchema({
            'type': 'object',
            'properties': {
                'taskId': {
                    'type': 'string', 'minLength': 1,
                    'description': 'Running App instance ID: copy the id field of the chosen item from clickgo_list_apps. This is not a software ID or an AI task ID.',
                },
                'name': {
                    'type': 'string', 'minLength': 1,
                    'description': 'Exact command name returned by clickgo_list_commands for this taskId.',
                },
                'args': {
                    'type': 'object',
                    'description': 'Command arguments matching that command\'s inputSchema from clickgo_list_commands. Use {} for a command with no arguments.',
                },
            },
            'required': ['taskId', 'name'], 'additionalProperties': false,
        }),
        // --- 通用执行工具可产生修改；具体行为说明由目标命令元数据提供 ---
        'annotations': { 'readOnlyHint': false, 'destructiveHint': true, 'openWorldHint': true },
    }, async (args, context) => call({
        'method': 'execute', 'taskId': args.taskId, 'name': args.name, 'args': args.args ?? {},
    }, context.mcpReq.signal));
    return server;
}
