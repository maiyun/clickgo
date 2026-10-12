import type { IAgentInfo } from '../command';

/**
 * --- 入口配置作为 JSON 数据展示，避免反引号结束 Markdown 代码块 ---
 * @param value 接入配置
 * @returns 带代码块的 JSON
 */
function json(value: unknown): string {
    return `\`\`\`json\n${JSON.stringify(value, null, 2).replaceAll('`', '\\u0060')}\n\`\`\``;
}

/**
 * --- 只介绍接入入口，实时 App ID 和命令参数由代理通过接口发现 ---
 * @param info 当前环境的接入信息
 * @returns 可复制的简短英文 Markdown，不嵌入运行实例快照
 */
export function format(info: IAgentInfo): string {
    let webMcp = 'WebMCP tools register automatically when supported.';
    if (info.webMcp.status === 'unsupported') {
        webMcp = 'WebMCP is not supported by this browser.';
    }
    else if (info.webMcp.registrationStatus === 'failed') {
        webMcp = 'WebMCP tool registration failed; use the JavaScript API.';
    }
    const lines = [
        `Browser: use \`${info.browser.api}\` on this page. ${webMcp}`,
        'Call `listTasks()`, choose an App id, inspect `list(taskId)`, then `await execute(taskId, name, args)` using its command descriptions and inputSchema. Discover App IDs again after restart.',
    ];
    if (info.browser.url !== null && info.native === null) {
        lines.unshift(`Page: ${JSON.stringify(info.browser.url)}`);
    }
    const native = info.native;
    if (native !== null) {
        lines.push('', 'Local MCP (stdio):', json({ 'command': native.command, 'args': [...native.args, '--mcp'] }),
            'Discover tools with `tools/list`; use them to list Apps, inspect commands and execute.',
            'CLI: use the same executable and initial arguments, replacing `--mcp` with `--cli --help`.',
            native.startup === 'auto' ? 'CLI/stdio automatically open the software when needed.' :
            'Open the software with MCP and local discovery enabled before using CLI/stdio.');
        if (native.startup === 'auto' && (!native.mcp.enabled || !native.mcp.discovery)) {
            lines.push('MCP and local discovery must be enabled by the software for automatic startup to work.');
        }
    }
    // --- 只有主动导出连接设置时附带临时 HTTP 凭据，普通介绍只指明获取位置 ---
    if (info.http !== null) {
        lines.push('', 'HTTP MCP (temporary authorized connection):',
            json({ 'url': info.http.url, 'headers': { 'Authorization': `Bearer ${info.http.token}` } }),
            'Keep this credential private and obtain fresh settings after restart. Discover tools with `tools/list`.');
    }
    else if (native !== null) {
        lines.push('HTTP MCP: obtain the current URL and Authorization header from the software\'s connection settings.');
    }
    return lines.join('\n');
}
