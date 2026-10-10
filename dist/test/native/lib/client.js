import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';
import * as lInstance from './instance.js';
import { version } from './version.js';
/**
 * --- CLI 与 stdio 根据当前运行记录连接同一个 Native HTTP 服务 ---
 * @param host 稳定软件 ID 或本次启动的实例 ID；省略时只接受唯一实例
 * @param request 三种公开命令操作之一
 * @param signal CLI 中断或上游 MCP 取消信号
 * @returns 共享执行结果；目标不明确、连接失败或取消时为结构化错误
 */
export async function invoke(host, request, signal) {
    if (signal.aborted) {
        return { 'ok': false, 'error': { 'code': 'cancelled', 'message': 'Command was cancelled' } };
    }
    const instances = (await lInstance.list()).filter(instance => !host || instance.id === host || instance.instance === host);
    if (instances.length === 0) {
        return { 'ok': false, 'error': { 'code': 'unavailable', 'message': 'No matching Native instance is running with discovery enabled' } };
    }
    if (instances.length > 1) {
        return { 'ok': false, 'error': { 'code': 'ambiguous-host', 'message': 'Choose one Native instance using --host; run instances to see IDs' } };
    }
    const client = new Client({ 'name': 'clickgo-native-client', 'version': version }, {
        'versionNegotiation': { 'mode': 'auto' },
    });
    // --- 每次从新记录连接，软件重启后不沿用旧端口、token 或 App 的 taskId ---
    try {
        const info = instances[0].info;
        await client.connect(new StreamableHTTPClientTransport(new URL(info.url), {
            'requestInit': { 'headers': { 'Authorization': `Bearer ${info.token}` } },
        }), { 'signal': signal, 'timeout': 10000 });
        let name;
        let args;
        if (request.method === 'listTasks') {
            name = 'clickgo_list_apps';
            args = {};
        }
        else if (request.method === 'list') {
            name = 'clickgo_list_commands';
            args = { 'taskId': request.taskId ?? '' };
        }
        else {
            name = 'clickgo_execute_command';
            args = { 'taskId': request.taskId ?? '', 'name': request.name ?? '', 'args': request.args ?? {} };
        }
        const result = await client.callTool({ 'name': name, 'arguments': args }, { 'signal': signal });
        const content = result.structuredContent;
        if (!content || typeof content !== 'object' || !('ok' in content) || typeof content.ok !== 'boolean') {
            return { 'ok': false, 'error': { 'code': 'invalid-result', 'message': 'Native returned an invalid command result' } };
        }
        return content;
    }
    catch {
        if (signal.aborted) {
            return { 'ok': false, 'error': { 'code': 'cancelled', 'message': 'Command was cancelled' } };
        }
        // --- 不重试修改操作：连接断开并不代表业务尚未执行 ---
        return { 'ok': false, 'error': { 'code': 'connection-failed', 'message': 'The Native connection failed; check that the selected software is running' } };
    }
    finally {
        await client.close().catch(() => { });
    }
}
