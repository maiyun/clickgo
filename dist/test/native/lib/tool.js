import * as lAboxTool from '../abox/tool.js';
/**
 * --- 等待指定时间 ---
 * @param ms 间隔毫秒
 * @returns 无返回值
 */
export function sleep(ms) {
    return lAboxTool.sleep(ms);
}
/**
 * --- 将 ClickGo 路径转换为系统路径 ---
 * @param path Windows 为 /盘符/ 路径；其他系统沿用原值
 * @returns 系统文件路径
 */
export function formatPath(path) {
    return lAboxTool.formatPath(path);
}
/**
 * --- 将系统路径转换为 ClickGo 路径 ---
 * @param path Windows 盘符路径；其他系统沿用原值
 * @returns ClickGo 文件路径，Windows 盘符转为小写
 */
export function parsePath(path) {
    return lAboxTool.parsePath(path);
}
