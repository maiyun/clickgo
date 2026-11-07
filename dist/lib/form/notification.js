import * as lCore from '../core';
import * as lTool from '../tool';
import { createNotificationRuntime } from '../../abox/form.js';
import { elements } from './system';
const runtime = createNotificationRuntime({ 'getElements': () => elements, lCore, lTool });
/**
 * --- 从下方弹出 alert ---
 * @param content 内容
 * @param type 样式，可留空
 * @returns alert id
 */
export function alert(content, type) {
    return runtime.alert(content, type);
}
/**
 * --- 按当前可用区域和实际高度重新排列通知 ---
 * @returns 无返回值
 */
export function refreshNotifyPosition() {
    runtime.refreshNotifyPosition();
}
/**
 * --- 弹出右下角信息框 ---
 * @param opt timeout 默认 5 秒，最大 10 分钟
 * @returns notify id，一定大于 0
 */
export function notify(opt) {
    return runtime.notify(opt);
}
/**
 * --- 修改 notify 的进度条进度 ---
 * @param notifyId notify id
 * @param per 进度，0 - 100 或 0% - 100% (0 - 1)
 * @returns 无返回值
 */
export function notifyProgress(notifyId, per) {
    runtime.notifyProgress(notifyId, per);
}
/**
 * --- 修改 notify 的提示信息 ---
 * @param notifyId notify id
 * @param opt 参数，timeout 只能缩短通知存续时间
 * @returns 无返回值
 */
export function notifyContent(notifyId, opt) {
    runtime.notifyContent(notifyId, opt);
}
/**
 * --- 隐藏 notify ---
 * @param notifyId 要隐藏的 notify id
 * @returns 无返回值
 */
export function hideNotify(notifyId) {
    runtime.hideNotify(notifyId);
}
