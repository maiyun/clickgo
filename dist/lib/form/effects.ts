import * as lCore from '../core';
import type * as lDom from '../dom';
import { createEffectsRuntime } from '../../abox/form.js';
import { elements } from './system';

/** --- 拖动提示动画使用的宿主元素与当前可用区域 --- */
export interface IEffectsDependencies {
    /** --- 调用时获取元素，避免在模块加载阶段读取尚未初始化的宿主 --- */
    'getElements': () => Pick<typeof elements, 'circular' | 'rectangle'>;
    /** --- 获取当前避开任务栏的布局区域 --- */
    'getAvailArea': () => lCore.IAvailArea;
}

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
export function getRectByBorder(
    border: lDom.TDomBorderCustom, area: lCore.IAvailArea = lCore.getAvailArea()
): { 'width': number; 'height': number; 'left': number; 'top': number; } {
    return runtime.getRectByBorder(border, area);
}

/**
 * --- 显示从小到大的圆圈动画特效对象 ---
 * @param x X 坐标
 * @param y Y 坐标
 */
export function showCircular(x: number, y: number): void {
    runtime.showCircular(x, y);
}

/**
 * --- 移动矩形到新位置 ---
 * @param border 显示的位置代号
 * @returns 无返回值
 */
export function moveRectangle(border: lDom.TDomBorderCustom): void {
    runtime.moveRectangle(border);
}

/**
 * --- 显示从小到大的矩形动画特效对象 ---
 * @param x 起始位置
 * @param y 起始位置
 * @param border 最大时位置代号
 */
export function showRectangle(x: number, y: number, border: lDom.TDomBorderCustom): void {
    runtime.showRectangle(x, y, border);
}

/**
 * --- 结束时请隐藏矩形 ---
 */
export function hideRectangle(): void {
    runtime.hideRectangle();
}
