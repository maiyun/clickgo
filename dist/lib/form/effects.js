import * as lCore from '../core';
import { createEffectsRuntime } from '../../abox/form.js';
import { elements } from './system';
const runtime = createEffectsRuntime({
    'getElements': () => elements,
    'getAvailArea': () => lCore.getAvailArea(),
});
/**
 * --- 根据 border 方向 获取理论窗体大小 ---
 * @param border 显示的位置代号
 * @param area 布局区域，默认避开任务栏
 * @returns 对应区域内的窗体矩形
 */
export function getRectByBorder(border, area = lCore.getAvailArea()) {
    return runtime.getRectByBorder(border, area);
}
/**
 * --- 显示从小到大的圆圈动画特效对象 ---
 * @param x X 坐标
 * @param y Y 坐标
 */
export function showCircular(x, y) {
    runtime.showCircular(x, y);
}
/**
 * --- 移动矩形到新位置 ---
 * @param border 显示的位置代号
 * @returns 无返回值
 */
export function moveRectangle(border) {
    runtime.moveRectangle(border);
}
/**
 * --- 显示从小到大的矩形动画特效对象 ---
 * @param x 起始位置
 * @param y 起始位置
 * @param border 最大时位置代号
 */
export function showRectangle(x, y, border) {
    runtime.showRectangle(x, y, border);
}
/**
 * --- 结束时请隐藏矩形 ---
 */
export function hideRectangle() {
    runtime.hideRectangle();
}
