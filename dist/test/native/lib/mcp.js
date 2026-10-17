import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import { createMcpHandler, fromJsonSchema, McpServer } from '@modelcontextprotocol/server';
import * as lInstance from './instance.js';
import { version } from './version.js';
import { localhostHostValidation, localhostOriginValidation, toNodeHandler } from '@modelcontextprotocol/node';
import * as aMcp from '../abox/mcp.js';
/**
 * --- 将已校验的框架文件描述转成标准资源链接，同时保留原有结构化结果 ---
 * @param result 页面统一执行器的 JSON 结果
 * @param taskId 本次调用所属 App，链接不得指向其他 App
 * @returns MCP 文本、结构化数据及文件资源链接
 */
const fileResult = aMcp.resultContent;
/**
 * --- 让 MCP 客户端读取 App 已交付的文件 ---
 * @param server 要添加文件读取功能的 HTTP 或 stdio MCP 服务
 * @param invoke App 命令调用函数；按 taskId 执行 clickgo.file.read，并传递取消信号
 * @returns 无返回值；读取失败时客户端收到 MCP 资源错误
 * @example
 * 客户端请求 resources/read({ uri: 'clickgo-file:///task/<taskId>/<fileId>' })，
 * 框架通过 invoke 分段读取该 App 的文件，再合并返回。
 */
const registerFileResources = aMcp.registerFiles;
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
    const record = options.discovery === false ? null :
        await lInstance.publish(info, options.id ?? host.id, host.name, host.applicationId);
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
        'instructions': `This server controls App instances inside the running desktop software; taskId is an App instance ID, not an AI task ID.
Use clickgo_list_apps to choose the intended App; ask if ambiguous. Copy that id unchanged into the taskId parameter.
Use clickgo_list_commands to discover enabled commands and their inputSchema, then clickgo_execute_command with matching args.
Export commands may return files and resource_link content. Read the provided resource URI to retrieve the exact application-generated file; do not regenerate it because a browser download event was missed.
Rediscover IDs after restart or a stale ID error. Never invent IDs or automatically retry commands that change data.`,
    });
    registerFileResources(server, invoke);
    /**
     * --- 将共享命令结果转换为 MCP 工具结果，保留结构化错误 ---
     * @param request 目标操作
     * @param signal 客户端取消信号
     * @returns MCP 结果
     */
    const call = async (request, signal) => {
        const result = await invoke(request, signal);
        return fileResult(result, request.taskId);
    };
    server.registerTool('clickgo_list_apps', {
        'title': 'List running applications inside this software',
        'description': `List running App instances in this software as {ok, data: [{id, name}]}. Use the chosen id as taskId for command tools. Ask if the target is ambiguous; rediscover IDs after restart.`,
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
        'description': `List the selected App's exposed commands, inputSchema and availability. Inspect enabled and disabledReason before calling clickgo_execute_command.`,
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
        'description': `Execute an enabled, exposed command from clickgo_list_commands in the same App. Follow its inputSchema; do not automatically retry commands that change data.`,
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
