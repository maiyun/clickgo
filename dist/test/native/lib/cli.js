import { open } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import * as lClient from './client.js';
import * as lInstance from './instance.js';
import * as lMcp from './mcp.js';
/** --- CLI 结果固定为 JSON；stdio 模式 stdout 专用于 MCP，帮助文本不得混入 --- */
const help = `ClickGo Native command interface

  clickgo-native instances [--json]
  clickgo-native apps [--host <software-id|instance-id>] [--json]
  clickgo-native commands --app <taskId> [--host <id>] [--json]
  clickgo-native execute --app <taskId> --name <command> [--args <json> | --args-file <path|->] [--host <id>] [--json]
  clickgo-native mcp [--host <software-id|instance-id>]

instances discovers Native software; apps discovers ClickGo Apps inside the selected software.
commands returns descriptions, argument schemas and availability. Only exposed commands can be executed.
All command results are JSON. Errors use a nonzero exit code. mcp serves standard MCP over stdio.
Configure mcp with a stable software ID to reconnect after a software restart. Rediscover App taskIds after restarting.
Software must enable startMcp() and local discovery. Multiple matching instances require an explicit instance ID.
`;
/**
 * --- 读取 JSON 参数，不把参数内容插入 shell 或执行为脚本 ---
 * @param text 命令行直接传入的 JSON
 * @param path 参数文件路径，- 表示 stdin
 * @returns 参数对象，格式或文件无效时为 false
 */
async function readArguments(text, path) {
    try {
        if (path === '-') {
            const chunks = [];
            let size = 0;
            for await (const chunk of process.stdin) {
                const buffer = Buffer.from(chunk);
                size += buffer.length;
                if (size > 1024 * 1024) {
                    return false;
                }
                chunks.push(buffer);
            }
            text = Buffer.concat(chunks).toString('utf8');
        }
        else if (path) {
            const file = await open(path, 'r');
            try {
                const stat = await file.stat();
                if (!stat.isFile() || stat.size > 1024 * 1024) {
                    return false;
                }
                text = await file.readFile('utf8');
            }
            finally {
                await file.close();
            }
        }
        if (text && Buffer.byteLength(text) > 1024 * 1024) {
            return false;
        }
        const value = JSON.parse(text ?? '{}');
        return value !== null && typeof value === 'object' && !Array.isArray(value) ? value : false;
    }
    catch {
        return false;
    }
}
/**
 * --- 普通命令输出与 MCP stdout 分开；只显示结果，不显示发现记录中的 token ---
 * @param result 操作结果
 * @returns 无；失败结果设置非零退出状态
 */
function output(result) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (result['ok'] !== true) {
        process.exitCode = 1;
    }
}
/**
 * --- 运行通用 CLI 或 stdio 适配器，业务逻辑仍在目标 App 的共享执行器中 ---
 * @param args 进程参数
 * @returns 无；stdio 模式持续服务直到客户端关闭 stdin 或进程收到退出信号
 */
export async function run(args) {
    let options;
    try {
        options = parseArgs({
            'args': args, 'allowPositionals': true, 'strict': true,
            'options': {
                'host': { 'type': 'string' }, 'app': { 'type': 'string' }, 'name': { 'type': 'string' },
                'args': { 'type': 'string' }, 'args-file': { 'type': 'string' },
                'json': { 'type': 'boolean' }, 'help': { 'type': 'boolean', 'short': 'h' },
            },
        });
    }
    catch {
        // --- 错误的 stdio 启动参数只写 stderr，不污染协议输出 ---
        process.stderr.write('Invalid CLI options. Run clickgo-native --help.\n');
        process.exitCode = 1;
        return;
    }
    const values = options.values;
    const command = options.positionals[0];
    if (values.help || !command) {
        process.stdout.write(help);
        return;
    }
    const allowed = {
        'instances': ['json'], 'apps': ['host', 'json'], 'commands': ['host', 'app', 'json'],
        'execute': ['host', 'app', 'name', 'args', 'args-file', 'json'], 'mcp': ['host'],
    };
    if (!Object.hasOwn(allowed, command) || options.positionals.length !== 1 ||
        Object.keys(values).some(key => !allowed[command].includes(key))) {
        process.stderr.write('Invalid command or options. Run clickgo-native --help.\n');
        process.exitCode = 1;
        return;
    }
    if (command === 'instances') {
        const instances = await lInstance.list();
        output({ 'ok': true, 'data': instances.map(instance => ({
                'id': instance.id, 'instance': instance.instance, 'name': instance.name, 'pid': instance.pid,
            })) });
        return;
    }
    if (command === 'mcp') {
        const server = serveStdio(() => lMcp.createCommandServer((request, signal) => lClient.invoke(values.host, request, signal)), {
            onerror: () => { process.stderr.write('The stdio MCP connection reported a protocol error.\n'); },
        });
        const stop = () => { void server.close().catch(() => { }); };
        process.once('SIGINT', stop);
        process.once('SIGTERM', stop);
        return;
    }
    if (command !== 'apps' && !values.app || command === 'execute' &&
        (!values.name || values.args !== undefined && values['args-file'] !== undefined)) {
        output({ 'ok': false, 'error': { 'code': 'invalid-input', 'message': 'Provide --app and --name for execution, and at most one JSON argument source' } });
        return;
    }
    const controller = new AbortController();
    const cancel = () => {
        controller.abort();
        if (values['args-file'] === '-') {
            process.stdin.destroy();
        }
    };
    process.once('SIGINT', cancel);
    process.once('SIGTERM', cancel);
    try {
        const request = { 'method': 'listTasks' };
        if (command === 'commands') {
            request.method = 'list';
            request.taskId = values.app;
        }
        else if (command === 'execute') {
            const input = await readArguments(values.args, values['args-file']);
            if (input === false) {
                if (controller.signal.aborted) {
                    output({ 'ok': false, 'error': { 'code': 'cancelled', 'message': 'Command was cancelled' } });
                }
                else {
                    output({ 'ok': false, 'error': {
                            'code': 'invalid-input', 'message': 'Command arguments must be a JSON object no larger than 1 MiB',
                        } });
                }
                return;
            }
            request.method = 'execute';
            request.taskId = values.app;
            request.name = values.name;
            request.args = input;
        }
        output(await lClient.invoke(values.host, request, controller.signal));
    }
    finally {
        process.removeListener('SIGINT', cancel);
        process.removeListener('SIGTERM', cancel);
    }
}
