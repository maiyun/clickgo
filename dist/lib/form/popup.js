import * as lDom from '../dom';
import * as lTool from '../tool';
import { createPopupRuntime } from '../../abox/form.js';
import { elements } from './system';
import { state } from './state';
import { changeFocus } from './window';
const runtime = createPopupRuntime({
    'getElements': () => elements,
    'getSysId': () => state.sysId,
    lDom,
    lTool,
    'changeFocus': (id) => changeFocus(id)
});
/**
 * --- 将标签追加到 pop 层 ---
 * @param el 要追加的标签
 * @returns 无返回值
 */
export function appendToPop(el) {
    runtime.appendToPop(el);
}
/**
 * --- 将标签从 pop 层移除 ---
 * @param el 要移除的标签
 * @returns 无返回值
 */
export function removeFromPop(el) {
    runtime.removeFromPop(el);
}
/**
 * --- 获取 pop 显示出来的坐标并报系统全局记录 ---
 * @param el 响应的元素
 * @param pop 要显示 pop 元素
 * @param direction 要显示方向（以 $el 为准的 h 水平 v 垂直 t 垂直水平居中）或坐标
 * @param opt size 自定义宽高；null 为 true 时为空也显示；autoPosition 随内容尺寸更新位置；autoScroll 随原元素位置更新；flow 默认加入 pop 流，不加入则不会自动隐藏；overflow 控制内容溢出；way 为托管方式
 * @returns 无返回值
 */
export function showPop(el, pop, direction, opt = {}) {
    runtime.showPop(el, pop, direction, opt);
}
/**
 * --- 隐藏正在显示中的所有 pop，或指定 pop/el ---
 * @param pop 要隐藏的浮层或触发元素；省略时隐藏全部
 * @returns 无返回值
 */
export function hidePop(pop) {
    runtime.hidePop(pop);
}
/**
 * --- 检测 pop 是不是刚刚显示的 ---
 * @param el 触发元素或浮层层级
 * @returns 是否在 100 毫秒内显示
 */
export function isJustPop(el) {
    return runtime.isJustPop(el);
}
/**
 * --- 点下 pointerdown 屏幕任意一位置时根据点击处处理隐藏 pop 和焦点丢失事件，鼠标和 touch 只会响应一个 ---
 * @param e 事件对象
 * @returns 处理完成
 */
export async function doFocusAndPopEvent(e) {
    await runtime.doFocusAndPopEvent(e);
}
/**
 * --- 在移除 DOM 前清除其中的浮层及监听 ---
 * @param root 将要移除的元素
 * @returns 无返回值
 */
export function cleanupPop(root) {
    runtime.cleanupPop(root);
}
