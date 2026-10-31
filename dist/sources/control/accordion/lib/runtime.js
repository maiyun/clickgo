import * as runtime from '../abox/runtime';
/**
 * --- 创建实例唯一的标题和面板标识 ---
 * @returns 唯一标识
 */
export function createId() {
    return runtime.createId();
}
/**
 * --- 去重并按模式限制展开项，保留未渲染的标识 ---
 * @param value 外部或内部展开项
 * @param multiple 是否允许多项
 * @returns 按输入顺序整理的展开项
 */
export function normalize(value, multiple) {
    return runtime.normalize(value, multiple);
}
/**
 * --- 处理用户切换及可取消事件 ---
 * @param parent 所属面板
 * @param item 直属子项
 * @returns 处理完成，取消或状态改变时不提交
 */
export function toggle(parent, item) {
    runtime.toggle(parent, item);
}
/**
 * --- 按直属子项的 DOM 顺序移动焦点 ---
 * @param parent 所属面板
 * @param item 当前子项
 * @param key 方向或边界按键
 * @returns 处理完成
 */
export function move(parent, item, key) {
    runtime.move(parent, item, key);
}
