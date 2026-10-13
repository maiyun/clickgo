import * as lAboxDesktop from '../abox/layout.js';
import type * as clickgo from 'clickgo';

/** --- 桌面布局使用的尺寸和排列偏好 --- */
export interface ILayoutOptions {
    'width': number;
    'height': number;
    'cellWidth': number;
    'cellHeight': number;
    'gap': number;
    'padding': number;
    'direction': 'column' | 'row';
    'snap': boolean;
    'arrange': boolean;
    'rtl': boolean;
}

/** --- 有限区域的布局结果，more 为溢出入口预留的位置 --- */
export interface ILayoutResult {
    'positions': clickgo.control.TDesktopPositions;
    'visible': string[];
    'overflow': string[];
    'more': clickgo.control.IDesktopPosition | null;
}

/**
 * --- 比较 ID 数组，允许 ID 包含任意字符 ---
 * @param a ID 数组
 * @param b ID 数组
 * @returns 内容和顺序是否相等
 */
export function sameValues(a: string[], b: string[]): boolean {
    return lAboxDesktop.sameValues(a, b);
}

/**
 * --- 复制有效位置，剔除已删除的图标，不改动调用方对象 ---
 * @param ids 当前图标 ID
 * @param positions 调用方位置
 * @returns 独立的位置快照
 */
export function copyPositions(
    ids: string[], positions: clickgo.control.TDesktopPositions
): clickgo.control.TDesktopPositions {
    return lAboxDesktop.copyPositions(ids, positions);
}

/**
 * --- 比较位置内容，避免父组件回写双向绑定时循环通知 ---
 * @param a 位置快照
 * @param b 位置快照
 * @returns 内容是否相等
 */
export function samePositions(a: clickgo.control.TDesktopPositions, b: clickgo.control.TDesktopPositions): boolean {
    return lAboxDesktop.samePositions(a, b);
}

/**
 * --- 按起点与指针位移计算整组目标位置，预览和提交共用吸附与边界限制 ---
 * @param moving 本次拖动的图标 ID
 * @param original 拖动开始时的显示位置
 * @param start 控件内的起始指针坐标
 * @param current 控件内的当前指针坐标
 * @param options 可用尺寸与偏好
 * @returns 移动组的候选位置，不修改原始布局
 */
export function getDragPositions(
    moving: string[], original: clickgo.control.TDesktopPositions,
    start: clickgo.control.IDesktopPosition, current: clickgo.control.IDesktopPosition, options: ILayoutOptions
): clickgo.control.TDesktopPositions {
    return lAboxDesktop.getDragPositions(moving, original, start, current, options);
}

/**
 * --- 保留有效位置，越界或碰撞时寻找空格；满容量时预留一个溢出入口 ---
 * @param ids 当前图标 ID，顺序决定默认排列和碰撞的先后
 * @param positions 当前位置
 * @param options 可用尺寸与偏好
 * @param priority 用户本次主动摆放的图标，优先占据目标位置
 * @returns 不重叠且不超出区域的布局，不修改输入
 */
export function resolveLayout(
    ids: string[], positions: clickgo.control.TDesktopPositions, options: ILayoutOptions, priority: string[] = []
): ILayoutResult {
    return lAboxDesktop.resolveLayout(ids, positions, options, priority);
}
