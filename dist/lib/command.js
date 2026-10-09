import * as lTask from './task';
import * as lSchema from './command/schema';
export { showPalette } from './command/palette';
/** --- 框架级注册表，按任务隔离，并在 Form/任务销毁时释放 --- */
const registries = new Map();
/** --- 新注册的命令使用不同标识，旧 WebMCP 引用不能调用替换后的命令 --- */
let entryId = 0;
/**
 * --- 构造成功结果 ---
 * @param data 可跨入口传输的 JSON 数据
 * @returns 成功结果
 */
export function success(data) {
    return { 'ok': true, 'data': data };
}
/**
 * --- 构造业务失败结果，不抛异常 ---
 * @param code 稳定的业务错误码
 * @param message 可公开的错误说明
 * @returns 失败结果
 */
export function failure(code, message) {
    return { 'ok': false, 'error': { 'code': code, 'message': message } };
}
/**
 * --- 复制已确认合法的 JSON，不暴露注册表对象 ---
 * @param value JSON 数据
 * @returns 独立的数据
 */
function copy(value) {
    return JSON.parse(JSON.stringify(value));
}
/**
 * --- 取得命令所属任务和 Form ---
 * @param current 当前应用对象或任务 ID
 * @returns 所属实例
 */
function owner(current) {
    if (typeof current === 'string') {
        return { 'taskId': current, 'formId': '', 'panelId': '' };
    }
    return {
        'taskId': current.taskId, 'formId': 'formId' in current ? current.formId : '',
        'panelId': 'panelId' in current ? current.panelId : '',
    };
}
/**
 * --- 检查实例生命周期和实时可用条件 ---
 * @param taskId 所属任务
 * @param entry 命令
 * @param ignoreRunning 校验已取得执行占用的命令时忽略自身占用
 * @returns 不可用原因，可用时返回空文本
 */
function disabledReason(taskId, entry, ignoreRunning = false) {
    const task = lTask.getOrigin(taskId);
    const form = task?.forms[entry.formId];
    if (!task || task.ending || entry.formId && (!form || form.closed)) {
        return 'Owner is no longer available';
    }
    if (entry.panelId && !form?.vapp._container.querySelector(`[data-panel-id="${entry.panelId}"]`)) {
        return 'Owner is no longer available';
    }
    if (!ignoreRunning && !entry.concurrent && entry.controllers.size) {
        return 'Command is running';
    }
    const state = entry.enabled ? entry.enabled() : true;
    if (state === true) {
        return '';
    }
    return typeof state === 'string' && state ? state : 'Command is disabled';
}
/**
 * --- 注册命令；重复名称、不支持的 schema 或已销毁的实例返回 false ---
 * @param current 所属任务/Form/Panel；销毁时自动移除其命令
 * @param definition 元数据、可用条件与唯一业务执行函数
 * @returns 是否注册成功
 */
export function register(current, definition) {
    const { taskId, formId, panelId } = owner(current);
    const task = lTask.getOrigin(taskId);
    const form = task?.forms[formId];
    if (!task || task.ending || formId && (!form || form.closed) ||
        panelId && !form?.vapp._container.querySelector(`[data-panel-id="${panelId}"]`)) {
        return false;
    }
    if (!definition || typeof definition.name !== 'string' || !/^[a-zA-Z0-9_.-]{1,128}$/.test(definition.name) ||
        typeof definition.description !== 'string' || !definition.description.trim() || typeof definition.execute !== 'function') {
        return false;
    }
    if (definition.title !== undefined && typeof definition.title !== 'string' ||
        definition.enabled !== undefined && typeof definition.enabled !== 'function' ||
        definition.exposed !== undefined && typeof definition.exposed !== 'boolean' ||
        definition.concurrent !== undefined && typeof definition.concurrent !== 'boolean') {
        return false;
    }
    if (definition.permissions !== undefined && (!Array.isArray(definition.permissions) ||
        definition.permissions.some(permission => typeof permission !== 'string' || !permission))) {
        return false;
    }
    if (definition.annotations !== undefined && (!lSchema.isJson(definition.annotations) ||
        typeof definition.annotations !== 'object' || !definition.annotations || Array.isArray(definition.annotations) ||
        Object.entries(definition.annotations).some(([key, value]) => typeof value !== 'boolean' ||
            !['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint',
                'consequentialHint', 'untrustedContentHint'].includes(key)))) {
        return false;
    }
    const registry = registries.get(taskId);
    if (registry?.has(definition.name) || definition.inputSchema?.type !== 'object' ||
        lSchema.check(definition.inputSchema) !== null ||
        definition.outputSchema !== undefined && lSchema.check(definition.outputSchema) !== null) {
        return false;
    }
    if (definition.outputSchema !== undefined && (!definition.outputSchema || typeof definition.outputSchema !== 'object')) {
        return false;
    }
    const metadata = {
        'name': definition.name, 'description': definition.description, 'inputSchema': definition.inputSchema,
    };
    if (definition.title !== undefined) {
        metadata.title = definition.title;
    }
    if (definition.outputSchema !== undefined) {
        metadata.outputSchema = definition.outputSchema;
    }
    if (definition.annotations !== undefined) {
        metadata.annotations = definition.annotations;
    }
    if (!lSchema.isJson(metadata)) {
        return false;
    }
    const entry = {
        'id': ++entryId, 'metadata': copy(metadata), 'formId': formId, 'panelId': panelId,
        'exposed': definition.exposed === true,
        'concurrent': definition.concurrent === true, 'permissions': [...definition.permissions ?? []],
        'enabled': definition.enabled, 'execute': definition.execute,
        'controllers': new Set(),
    };
    const target = registry ?? new Map();
    target.set(definition.name, entry);
    registries.set(taskId, target);
    refreshWebMcp(taskId);
    return true;
}
/**
 * --- 取消尚在执行的命令并解除注册；取消是协作式，不回滚已产生的业务效果 ---
 * @param current 所属任务/Form/Panel
 * @param name 命令名称
 * @returns 是否找到并移除命令
 */
export function unregister(current, name) {
    const { taskId, formId, panelId } = owner(current);
    const registry = registries.get(taskId);
    const entry = registry?.get(name);
    if (!entry || formId && entry.formId !== formId || panelId && entry.panelId !== panelId) {
        return false;
    }
    registry.delete(name);
    for (const controller of entry.controllers) {
        controller.abort();
    }
    if (!registry.size) {
        registries.delete(taskId);
    }
    refreshWebMcp(taskId);
    return true;
}
/**
 * --- 清理所属 Panel、Form 或整个任务的命令 ---
 * @param current 所属任务/Form/Panel
 * @returns 无返回值
 */
export function clear(current) {
    const { taskId, formId, panelId } = owner(current);
    clearOwner(taskId, formId, panelId);
}
/**
 * --- 框架生命周期使用的按所属范围清理入口 ---
 * @internal
 * @param taskId 所属任务
 * @param formId 所属 Form，不传时清理任务
 * @param panelId 所属 Panel，不传时清理整个 Form
 * @returns 无返回值
 */
export function clearOwner(taskId, formId = '', panelId = '') {
    const registry = registries.get(taskId);
    for (const [name, entry] of registry ?? []) {
        if ((!formId || entry.formId === formId) && (!panelId || entry.panelId === panelId)) {
            unregister(taskId, name);
        }
    }
    if (!formId) {
        disconnectWebMcp(taskId);
    }
}
/**
 * --- 获取独立元数据和当前状态，不导出业务函数 ---
 * @param current 所属应用
 * @returns 命令列表
 */
export function list(current) {
    const { taskId } = owner(current);
    const infos = [];
    for (const entry of registries.get(taskId)?.values() ?? []) {
        let reason;
        try {
            reason = disabledReason(taskId, entry);
        }
        catch {
            reason = 'Availability check failed';
        }
        infos.push({
            ...copy(entry.metadata), 'taskId': taskId, 'formId': entry.formId, 'exposed': entry.exposed,
            'panelId': entry.panelId,
            'enabled': !reason, 'disabledReason': reason, 'running': entry.controllers.size,
        });
    }
    return infos;
}
/**
 * --- 唯一执行入口；异常边界保护插件回调和运行状态，所有入口使用相同校验 ---
 * @param taskId 目标任务
 * @param name 命令名称
 * @param args 参数
 * @param signal 调用方取消信号
 * @param source 执行来源
 * @param exposedOnly 是否仅允许代理公开命令
 * @returns 结构化结果
 */
async function run(taskId, name, args, signal, source, exposedOnly) {
    const entry = registries.get(taskId)?.get(name);
    if (!entry || exposedOnly && !entry.exposed) {
        return failure('not-found', 'Command was not found');
    }
    if (signal?.aborted) {
        return failure('cancelled', 'Command was cancelled');
    }
    // --- 同步占用执行状态，不能等权限或业务 Promise 完成后才防重复 ---
    const controller = new AbortController();
    const abort = () => {
        controller.abort();
    };
    try {
        if (!lSchema.isJson(args) || !args || typeof args !== 'object' || Array.isArray(args)) {
            return failure('invalid-input', 'Arguments must be a JSON object');
        }
        const input = copy(args);
        const invalid = lSchema.validate(input, entry.metadata.inputSchema);
        if (invalid !== null) {
            return failure('invalid-input', invalid);
        }
        const reason = disabledReason(taskId, entry);
        if (reason) {
            return failure('unavailable', reason);
        }
        entry.controllers.add(controller);
        signal?.addEventListener('abort', abort, { 'once': true });
        for (const permission of entry.permissions) {
            const allowed = (await lTask.checkPermission(taskId, permission))[0];
            if (controller.signal.aborted) {
                return failure('cancelled', 'Command was cancelled');
            }
            if (!allowed) {
                return failure('permission-denied', 'Command permission was denied');
            }
        }
        if (controller.signal.aborted || registries.get(taskId)?.get(name) !== entry) {
            return failure('cancelled', 'Command was cancelled');
        }
        // --- 权限检查让出执行权后，再确认业务条件，不能依赖开始时的快照 ---
        const currentReason = disabledReason(taskId, entry, true);
        if (currentReason) {
            return failure('unavailable', currentReason);
        }
        const result = await entry.execute(input, {
            'taskId': taskId, 'formId': entry.formId, 'panelId': entry.panelId,
            'source': source, 'signal': controller.signal,
        });
        if (controller.signal.aborted) {
            return failure('cancelled', 'Command was cancelled');
        }
        if (!lSchema.isJson(result) || typeof result !== 'object' || !result || Array.isArray(result) ||
            typeof result['ok'] !== 'boolean') {
            return failure('invalid-output', 'Command returned an invalid result');
        }
        if (!result['ok']) {
            const error = result['error'];
            if (!error || typeof error !== 'object' || Array.isArray(error) ||
                typeof error['code'] !== 'string' || !error['code'].trim() || typeof error['message'] !== 'string') {
                return failure('invalid-output', 'Command returned an invalid error');
            }
            return failure(error['code'], error['message']);
        }
        if (!Object.hasOwn(result, 'data')) {
            return failure('invalid-output', 'Command returned no data');
        }
        if (entry.metadata.outputSchema && lSchema.validate(result['data'], entry.metadata.outputSchema) !== null) {
            return failure('invalid-output', 'Command result does not match its output schema');
        }
        return success(copy(result['data']));
    }
    catch {
        // --- 不把插件异常、路径或内部对象直接交给代理 ---
        return failure('execution-failed', 'Command execution failed');
    }
    finally {
        entry.controllers.delete(controller);
        signal?.removeEventListener('abort', abort);
    }
}
/**
 * --- 应用界面直接执行已注册的业务命令 ---
 * @param current 所属任务/Form
 * @param name 命令名称
 * @param args 参数，默认空对象
 * @param options 取消信号
 * @returns 业务结果
 */
export function execute(current, name, args = {}, options = {}) {
    return run(owner(current).taskId, name, args, options.signal, 'user', false);
}
/**
 * --- 建立只公开允许命令的实例接口，供浏览器 JS 和后续 Native/MCP 转发 ---
 * @param current 所属应用
 * @returns 不可修改的桥接接口
 */
export function createBridge(current) {
    const { taskId } = owner(current);
    return Object.freeze({
        'taskId': taskId,
        'list': () => list(taskId).filter(info => info.exposed),
        'execute': (name, args = {}, options = {}) => run(taskId, name, args, options.signal, 'agent', true),
    });
}
/**
 * --- 网页入口直接读取框架的任务及命令状态，无需应用或宿主重复发布与清理 ---
 * @returns 不可修改的网页命令接口
 */
export function createPageBridge() {
    return Object.freeze({
        'listTasks': () => lTask.getList().filter(info => {
            const task = lTask.getOrigin(info.id);
            return task && !task.ending;
        }).map(info => ({ 'id': info.id, 'name': info.name })),
        'list': (taskId) => {
            const task = lTask.getOrigin(taskId);
            return task && !task.ending ? list(taskId).filter(info => info.exposed) : [];
        },
        'execute': (taskId, name, args = {}, options = {}) => run(taskId, name, args, options.signal, 'agent', true),
    });
}
/** --- WebMCP 只是适配器；不支持时不影响普通执行或实例桥接 --- */
const webConnections = new Map();
/**
 * --- 按注册变化串行同步 WebMCP 工具，任务结束后禁止迟到发布 ---
 * @param taskId 所属任务
 * @returns 无返回值
 */
function refreshWebMcp(taskId) {
    const connection = webConnections.get(taskId);
    if (!connection) {
        return;
    }
    connection.pending = connection.pending.then(async () => {
        if (webConnections.get(taskId) !== connection) {
            return false;
        }
        const entries = [...registries.get(taskId)?.values() ?? []].filter(entry => entry.exposed);
        for (const [entry, controller] of connection.tools) {
            if (!entries.includes(entry)) {
                controller.abort();
                connection.tools.delete(entry);
            }
        }
        let registered = true;
        for (const entry of entries) {
            if (webConnections.get(taskId) !== connection) {
                return false;
            }
            if (registries.get(taskId)?.get(entry.metadata.name) !== entry) {
                continue;
            }
            if (connection.tools.has(entry)) {
                continue;
            }
            const controller = new AbortController();
            connection.tools.set(entry, controller);
            try {
                await connection.context.registerTool({
                    'name': `cg_${taskId}_${entry.id}_${entry.metadata.name}`.slice(0, 128),
                    'description': entry.metadata.description,
                    'inputSchema': copy(entry.metadata.inputSchema),
                    'annotations': {
                        'readOnlyHint': entry.metadata.annotations?.readOnlyHint ?? false,
                        'consequentialHint': entry.metadata.annotations?.consequentialHint ??
                            entry.metadata.annotations?.destructiveHint ?? false,
                        'untrustedContentHint': entry.metadata.annotations?.untrustedContentHint ?? false,
                    },
                    'execute': async (args, options) => {
                        if (webConnections.get(taskId) !== connection || controller.signal.aborted ||
                            registries.get(taskId)?.get(entry.metadata.name) !== entry) {
                            return JSON.stringify(failure('not-found', 'Command was not found'));
                        }
                        return JSON.stringify(await createBridge(taskId).execute(entry.metadata.name, args, options));
                    },
                }, { 'signal': controller.signal });
                if (webConnections.get(taskId) !== connection ||
                    registries.get(taskId)?.get(entry.metadata.name) !== entry) {
                    controller.abort();
                    connection.tools.delete(entry);
                    registered = false;
                }
            }
            catch {
                controller.abort();
                connection.tools.delete(entry);
                registered = false;
            }
        }
        return registered;
    });
}
/**
 * --- 按能力检测接入当前 WebMCP API；没有 API 或注册失败时返回 false ---
 * @param current 所属应用
 * @returns 是否同步成功
 */
export async function connectWebMcp(current) {
    const { taskId } = owner(current);
    const context = document.modelContext;
    if (!lTask.getOrigin(taskId) || typeof context?.registerTool !== 'function') {
        return false;
    }
    let connection = webConnections.get(taskId);
    if (connection && connection.context !== context) {
        disconnectWebMcp(taskId);
        connection = undefined;
    }
    if (!connection) {
        connection = { 'context': context, 'tools': new Map(), 'pending': Promise.resolve(true) };
        webConnections.set(taskId, connection);
    }
    refreshWebMcp(taskId);
    return connection.pending;
}
/**
 * --- 解除 WebMCP 适配器；内部命令继续可用 ---
 * @param current 所属应用
 * @returns 无返回值
 */
export function disconnectWebMcp(current) {
    const { taskId } = owner(current);
    const connection = webConnections.get(taskId);
    webConnections.delete(taskId);
    for (const controller of connection?.tools.values() ?? []) {
        controller.abort();
    }
    connection?.tools.clear();
}
