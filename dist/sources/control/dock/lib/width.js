import * as width from '../abox/width';
/**
 * --- 测量容器内容区与浏览器视窗交集的宽度 ---
 * @param element Dock 元素
 * @param form 所属 Form 元素，作为祖先遍历的终点
 * @returns 交集宽度，单位为像素
 */
export function measureWidth(element, form) {
    return width.measureWidth(element, form);
}
