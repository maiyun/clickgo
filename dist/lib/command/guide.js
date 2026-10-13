import * as lAboxCommand from '../../abox/command.js';
/**
 * --- 只介绍接入入口，实时 App ID 和命令参数由代理通过接口发现 ---
 * @param info 当前环境的接入信息
 * @returns 可复制的简短英文 Markdown，不嵌入运行实例快照
 */
export function format(info) {
    return lAboxCommand.format(info);
}
