import * as lCommand from '../command';
import * as lTask from '../task';
/** --- Native 请求的取消状态，只保留当前尚未结束的调用 --- */
const pending = new Map();
/**
 * --- 接收 Native MCP 请求，按目标 taskId 直接读取或执行公开命令 ---
 * @param request 主进程发来的操作
 * @returns 共享命令结果或发现列表
 */
export async function invoke(request) {
    if (request.method === 'cancel') {
        pending.get(request.id)?.abort();
        return lCommand.success(null);
    }
    if (request.method === 'listTasks') {
        return { 'ok': true, 'data': lCommand.listTasks() };
    }
    const taskId = request.taskId;
    const task = taskId ? lTask.getOrigin(taskId) : null;
    if (!taskId || !task || task.ending) {
        return lCommand.failure('unavailable', 'The selected app is no longer available');
    }
    if (request.method === 'list') {
        return { 'ok': true, 'data': lCommand.list(taskId).filter(info => info.exposed) };
    }
    if (request.method !== 'execute' || !request.id || pending.has(request.id) || !request.name) {
        return lCommand.failure('invalid-input', 'Invalid Native command request');
    }
    const controller = new AbortController();
    pending.set(request.id, controller);
    // --- 业务回调可能尚未结束；保持取消状态，直到共享执行器完成并释放占用 ---
    try {
        return await lCommand.executeAgent(taskId, request.name, request.args ?? {}, { 'signal': controller.signal });
    }
    finally {
        pending.delete(request.id);
    }
}
