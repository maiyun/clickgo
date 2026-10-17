import * as lTask from '../task';
import * as lTool from '../tool';
import * as lAboxCommand from '../../abox/command.js';
/** --- 文件读取命令由框架保留，网页、WebMCP 和 Native 使用相同入口 --- */
export const READ_COMMAND = 'clickgo.file.read';
/** --- 默认及最大分段大小，单位为原始字节 --- */
export const DEFAULT_CHUNK_BYTES = 49152;
export const MAX_CHUNK_BYTES = 393216;
/** --- 文件缓存接入框架计时器和 Blob 编码机制，限制和行为由下列公开契约说明 --- */
const store = lAboxCommand.createFileStore({
    'task': lTask, 'tool': lTool, 'readCommand': READ_COMMAND,
    'defaultChunkBytes': DEFAULT_CHUNK_BYTES, 'maxChunkBytes': MAX_CHUNK_BYTES,
});
// --- hbox start ---
/**
 * --- 建立尚未对代理公开的文件快照，由命令成功结果决定是否交付 ---
 * @param owner 已通过命令生命周期检查的所属范围
 * @param blob 应用已生成的文件内容，最多 64 MiB；同一 App 最多保留 8 份、合计 128 MiB
 * @param options 文件名及 MIME
 * @returns 十分钟有效的独立元数据；参数、容量或计时器不可用时返回 false
 */
export function create(owner, blob, options) {
    return store.create(owner, blob, options);
}
/**
 * --- 按内部快照校验所有文件，再一次性标记命令交付，拒绝伪造或跨 App 句柄 ---
 * @param taskId 当前命令所属 App
 * @param requested 业务结果声明的文件
 * @param exposed 当前命令是否允许代理调用
 * @returns 可信的独立元数据；任一文件已失效或不属于本 App 时返回 false
 */
export function commit(taskId, requested, exposed) {
    return store.commit(taskId, requested, exposed);
}
/**
 * --- 只读取已由公开命令交付的文件；异步读取后再次核对取消、到期及销毁 ---
 * @param taskId 所属 App
 * @param fileId 文件标识
 * @param options 分段范围及取消信号
 * @returns 不可变文件的 Base64 字节段；不可用或范围错误返回 false
 */
export async function read(taskId, fileId, options = {}) {
    return store.read(taskId, fileId, options);
}
/**
 * --- 释放一个文件及其到期计时器 ---
 * @param taskId 所属 App
 * @param fileId 文件标识
 * @returns 无返回值
 */
export function remove(taskId, fileId) {
    store.remove(taskId, fileId);
}
/**
 * --- 应用主动释放自己所属范围的旧文件，不影响其他 Form 或 Panel ---
 * @param owner 调用者所属范围，App 级对象可管理整个 App
 * @param fileId 要释放的缓存句柄，不是文件路径
 * @returns 是否找到并释放文件，已释放或范围不符为 false
 */
export function release(owner, fileId) {
    return store.release(owner, fileId);
}
/**
 * --- 随命令所属范围销毁文件，Panel 不影响同 Form 的其他文件 ---
 * @param owner 要清理的任务、Form 或 Panel
 * @returns 无返回值
 */
export function clear(owner) {
    store.clear(owner);
}
// --- hbox end ---
