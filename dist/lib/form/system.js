import * as clickgo from '../../clickgo';
import * as lCore from '../core';
import * as lTask from '../task';
import * as lTool from '../tool';
import * as lDom from '../dom';
import { createSystemRuntime } from '../../abox/form.js';
import { state, info } from './state';
import { changeFocus, getMaxZIndexID } from './window';
import { refreshNotifyPosition } from './notification';
/** --- 系统任务栏的 Vue 根实例 --- */
export let simpleSystemTaskRoot;
/** --- 启动器的 Vue 根实例 --- */
export let launcherRoot;
const system = createSystemRuntime({
    clickgo, lCore, lTask, lTool, lDom, state, info, changeFocus, getMaxZIndexID,
    'refreshNotifyPosition': () => { refreshNotifyPosition(); },
    'setSimpleSystemTaskRoot': (root) => { simpleSystemTaskRoot = root; },
    'setLauncherRoot': (root) => { launcherRoot = root; }
});
/** --- 系统宿主 DOM 节点 --- */
export const elements = system.elements;
/**
 * --- 刷新系统根节点及任务窗体的语言方向 ---
 * @param taskId 仅刷新指定任务，省略时刷新全部任务
 * @returns 无返回值
 */
export function refreshLocaleDirection(taskId) {
    system.refreshLocaleDirection(taskId);
}
/**
 * --- 显示系统级询问框 ---
 * @param current 系统级 ID
 * @param html 询问框内容
 * @returns 用户选择；ID 不匹配或已有询问框时返回 false
 */
export function superConfirm(current, html) {
    return system.superConfirm(current, html);
}
/**
 * --- 显示系统级虚拟键盘 ---
 * @returns 无返回值
 */
export function showKeyboard() {
    system.showKeyboard();
}
/**
 * --- 隐藏系统级虚拟键盘 ---
 * @returns 无返回值
 */
export function hideKeyboard() {
    system.hideKeyboard();
}
/**
 * --- 查询 Launcher 当前显示状态，供首次挂载时同步 ---
 * @returns 是否显示
 */
export function getLauncherShow() {
    return system.getLauncherShow();
}
/**
 * --- 显示 launcher 界面；状态变化时通知所有应用与窗体 ---
 * @returns 无返回值
 */
export function showLauncher() {
    system.showLauncher();
}
/**
 * --- 隐藏 launcher 界面；重复关闭不重复通知或安排清理 ---
 * @returns 无返回值
 */
export function hideLauncher() {
    system.hideLauncher();
}
/**
 * --- 初始化系统宿主，多次调用仅执行一次 ---
 * @returns 无返回值
 */
export function init() {
    system.init();
}
