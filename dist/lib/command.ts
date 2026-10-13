import * as lCore from './core';
import * as lTask from './task';
import * as lTool from './tool';
import * as lData from './command/data';
import * as lWebMcp from './command/webmcp';
import * as lGuide from './command/guide';
import * as lNative from './native';

export { showPalette } from './command/palette';

/** --- 命令输入与输出可跨浏览器、Native 和协议传输的 JSON 值 --- */
export type TJson = lTool.TJson;

/** --- JSON Schema 2020-12 的命令校验子集；不支持的关键字在注册时拒绝 --- */
export interface ISchema {
    '$schema'?: string;
    '$ref'?: string;
    '$defs'?: Record<string, ISchema | boolean>;
    'title'?: string;
    'description'?: string;
    'default'?: TJson;
    'examples'?: TJson[];
    'type'?: 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null';
    'properties'?: Record<string, ISchema | boolean>;
    'required'?: string[];
    'additionalProperties'?: ISchema | boolean;
    'items'?: ISchema | boolean;
    'minItems'?: number;
    'maxItems'?: number;
    'uniqueItems'?: boolean;
    'minLength'?: number;
    'maxLength'?: number;
    'pattern'?: string;
    'minimum'?: number;
    'maximum'?: number;
    'exclusiveMinimum'?: number;
    'exclusiveMaximum'?: number;
    'enum'?: TJson[];
    'const'?: TJson;
    'allOf'?: Array<ISchema | boolean>;
    'anyOf'?: Array<ISchema | boolean>;
    'oneOf'?: Array<ISchema | boolean>;
    'not'?: ISchema | boolean;
}

/** --- 所有入口共用的结果；错误码用于程序判断，message 用于说明 --- */
export type TResult<T extends TJson = TJson> = { 'ok': true; 'data': T; } |
    { 'ok': false; 'error': { 'code': string; 'message': string; }; };

/** --- 执行来源仅用于展示与记录，不是授权凭证 --- */
export interface IContext {
    'taskId': string;
    'formId': string;
    'panelId': string;
    'source': 'user' | 'agent';
    'signal': AbortSignal;
}

/** --- 与 MCP 工具描述对齐的公开命令元数据 --- */
export interface IMetadata {
    'name': string;
    'title'?: string;
    'description': string;
    'inputSchema': ISchema & { 'type': 'object'; };
    'outputSchema'?: ISchema;
    /** --- 行为说明，不代替校验或授权 --- */
    'annotations'?: {
        'readOnlyHint'?: boolean;
        'destructiveHint'?: boolean;
        'idempotentHint'?: boolean;
        'openWorldHint'?: boolean;
        /** --- WebMCP 的重要或不可逆现实效果说明 --- */
        'consequentialHint'?: boolean;
        'untrustedContentHint'?: boolean;
    };
}

/** --- 应用声明一次，界面、浏览器代理和 Native 适配器共享执行函数 --- */
export interface IDefinition<T extends Record<string, TJson> = Record<string, TJson>> extends IMetadata {
    /** --- 明确允许代理发现并调用；默认只允许应用内部调用 --- */
    'exposed'?: boolean;
    /** --- 默认拒绝同一命令并发；业务确认可并行时才开启 --- */
    'concurrent'?: boolean;
    /** --- 必须已经取得的框架权限；执行入口不弹授权窗 --- */
    'permissions'?: string[];
    /** --- true 为可用，false 或原因文本为不可用；每次执行重新检查 --- */
    'enabled'?: () => boolean | string;
    'execute': (args: T, context: IContext) => TResult | Promise<TResult>;
}

/** --- 不包含函数或内部对象的独立快照 --- */
export interface IInfo extends IMetadata {
    'taskId': string;
    'formId': string;
    'panelId': string;
    'exposed': boolean;
    'enabled': boolean;
    'disabledReason': string;
    'running': number;
}

/** --- 绑定一个应用实例，只能调用该实例明确公开的命令 --- */
export interface IBridge {
    'taskId': string;
    'list': () => IInfo[];
    'execute': (name: string, args?: Record<string, TJson>, options?: { 'signal'?: AbortSignal; }) => Promise<TResult>;
}

/** --- 框架向网页发布的统一入口；按任务选择应用，只访问明确公开的命令 --- */
export interface IPageBridge {
    'getAgentInfo': (taskId?: string) => Promise<IAgentInfo | null | false>;
    'getAgentGuide': (taskId?: string) => Promise<string | null | false>;
    'listTasks': () => Array<{ 'id': string; 'name': string; }>;
    'list': (taskId: string) => IInfo[];
    'execute': (taskId: string, name: string, args?: Record<string, TJson>,
        options?: { 'signal'?: AbortSignal; }) => Promise<TResult>;
}

/** --- 统一接入说明的生成选项；默认不读取或包含 HTTP 凭据 --- */
export interface IAgentOptions {
    /** --- 仅供应用主动导出 HTTP 连接设置，仍要求当前 App 已有 root 权限 --- */
    'includeMcpCredentials'?: boolean;
}

/** --- 页面级 WebMCP 接入状态；ready 表示浏览器接口可用，不表示某个 App 的工具已发布 --- */
export type TWebMcpStatus = 'unsupported' | 'ready';

/** --- 工具发布诊断状态，不参与页面级接入事件 --- */
export type TWebMcpRegistrationStatus = 'idle' | 'registering' | 'ready' | 'failed';

/** --- 可展示或导出的接入信息；命令列表始终从对应入口实时查询 --- */
export interface IAgentInfo {
    'schemaVersion': 1;
    'apps': ReturnType<typeof listTasks>;
    'targetTaskId': string | null;
    'browser': { 'url': string | null; 'api': string; };
    'webMcp': {
        'supported': boolean;
        /** --- 全页面共用的浏览器接入状态，不受目标 App 或工具数量影响 --- */
        'status': TWebMcpStatus;
        /** --- 所选 App 的发布诊断；多个 App 时优先报告失败及进行中的注册，不支持时为 null --- */
        'registrationStatus': TWebMcpRegistrationStatus | null;
        /** --- 已完成工具发布的 App，不表示这些 App 分别建立了浏览器连接 --- */
        'publishedTaskIds': string[];
    };
    'native': lNative.ICommandEntry | null;
    /** --- 只有显式导出且通过 root 检查时才包含 HTTP 凭据 --- */
    'http': lNative.IMcpInfo | null;
}

interface IEntry {
    'id': number;
    'metadata': IMetadata;
    'formId': string;
    'panelId': string;
    'exposed': boolean;
    'concurrent': boolean;
    'permissions': string[];
    'enabled'?: IDefinition['enabled'];
    'execute': IDefinition['execute'];
    'controllers': Set<AbortController>;
}

/** --- 框架级注册表，按任务隔离，并在 Form/任务销毁时释放 --- */
const registries = new Map<string, Map<string, IEntry>>();

/** --- 新注册的命令使用不同标识，旧 WebMCP 引用不能调用替换后的命令 --- */
let entryId = 0;

/** --- 最近检测到的页面级状态；首次初始化及实际变化时通知所有接收者 --- */
let webMcpStatus: TWebMcpStatus | undefined;

/** --- 各 App 的工具发布及撤销由框架内部维护，与页面级接入状态分开 --- */
const webPublisher = lWebMcp.create<IEntry>({
    'getCommands': (taskId) => [...registries.get(taskId)?.values() ?? []].filter(entry => entry.exposed),
    'isCurrent': (taskId, entry) => registries.get(taskId)?.get(entry.metadata.name) === entry,
    'execute': (taskId, entry, args, options) => executeAgent(taskId, entry.metadata.name, args, options),
});

/**
 * --- 初始化页面级 WebMCP 接入状态，由框架在执行 Boot.main 前自动调用 ---
 * @returns 无返回值
 */
export function init(): void {
    getWebMcpContext();
}

/**
 * --- 构造成功结果 ---
 * @param data 可跨入口传输的 JSON 数据
 * @returns 成功结果
 */
export function success<T extends TJson>(data: T): TResult<T> {
    return { 'ok': true, 'data': data };
}

/**
 * --- 构造业务失败结果，不抛异常 ---
 * @param code 稳定的业务错误码
 * @param message 可公开的错误说明
 * @returns 失败结果
 */
export function failure(code: string, message: string): TResult<never> {
    return { 'ok': false, 'error': { 'code': code, 'message': message } };
}

/**
 * --- 取得命令所属任务和 Form ---
 * @param current 当前应用对象或任务 ID
 * @returns 所属实例
 */
function owner(current: lCore.TCurrent): { 'taskId': string; 'formId': string; 'panelId': string; } {
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
function disabledReason(taskId: string, entry: IEntry, ignoreRunning = false): string {
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
export function register<T extends Record<string, TJson>>(
    current: lCore.TCurrent, definition: IDefinition<T>
): boolean {
    const { taskId, formId, panelId } = owner(current);
    const task = lTask.getOrigin(taskId);
    const form = task?.forms[formId];
    if (!task || task.ending || formId && (!form || form.closed) ||
        panelId && !form?.vapp._container.querySelector(`[data-panel-id="${panelId}"]`)) {
        return false;
    }
    const metadata = lData.readMetadata(definition);
    const registry = registries.get(taskId);
    if (metadata === false || registry?.has(metadata.name)) {
        return false;
    }
    const entry: IEntry = {
        /** --- 注册标识,区分同名命令的不同注册实例，避免旧 WebMCP 引用调用新命令 --- */
        'id': ++entryId,
        /** --- 元数据快照,调用方后续修改说明或 schema 不影响已注册命令 --- */
        'metadata': metadata,
        /** --- 所属 Form,卸载时清理其命令；空字符串表示 App 级命令 --- */
        'formId': formId,
        /** --- 所属 Panel,卸载时清理其命令；空字符串表示未绑定 Panel --- */
        'panelId': panelId,
        /** --- 代理公开标记,明确开启后才允许网页代理、WebMCP 和 Native MCP 发现并调用 --- */
        'exposed': definition.exposed === true,
        /** --- 并发开关,默认拒绝同一命令在上一次执行结束前再次执行 --- */
        'concurrent': definition.concurrent === true,
        /** --- 权限要求,复制保存执行前必须已有的权限列表，不主动弹窗授权 --- */
        'permissions': [...definition.permissions ?? []],
        /** --- 可用性检查,列出或执行命令时重新判断当前业务条件 --- */
        'enabled': definition.enabled,
        /** --- 业务执行函数,界面与代理入口共用同一逻辑 --- */
        'execute': definition.execute as IDefinition['execute'],
        /** --- 执行控制器,记录正在运行的调用，用于并发判断及卸载时协作取消 --- */
        'controllers': new Set(),
    };
    const target = registry ?? new Map<string, IEntry>();
    target.set(metadata.name, entry);
    registries.set(taskId, target);
    // --- 公开命令自动接入浏览器；业务只声明命令，不负责启用协议适配器 ---
    if (entry.exposed) {
        publishWebMcp(taskId);
    }
    return true;
}

/**
 * --- 取消尚在执行的命令并解除注册；取消是协作式，不回滚已产生的业务效果 ---
 * @param current 所属任务/Form/Panel
 * @param name 命令名称
 * @returns 是否找到并移除命令
 */
export function unregister(current: lCore.TCurrent, name: string): boolean {
    const { taskId, formId, panelId } = owner(current);
    const registry = registries.get(taskId);
    const entry = registry?.get(name);
    if (!entry || formId && entry.formId !== formId || panelId && entry.panelId !== panelId) {
        return false;
    }
    registry!.delete(name);
    for (const controller of entry.controllers) {
        controller.abort();
    }
    if (!registry!.size) {
        registries.delete(taskId);
    }
    if (entry.exposed) {
        webPublisher.refresh(taskId);
    }
    return true;
}

/**
 * --- 清理所属 Panel、Form 或整个任务的命令 ---
 * @param current 所属任务/Form/Panel
 * @returns 无返回值
 */
export function clear(current: lCore.TCurrent): void {
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
export function clearOwner(taskId: string, formId = '', panelId = ''): void {
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
export function list(current: lCore.TCurrent): IInfo[] {
    const { taskId } = owner(current);
    const infos: IInfo[] = [];
    for (const entry of registries.get(taskId)?.values() ?? []) {
        let reason: string;
        try {
            reason = disabledReason(taskId, entry);
        }
        catch {
            reason = 'Availability check failed';
        }
        infos.push({
            ...lData.copy(entry.metadata), 'taskId': taskId, 'formId': entry.formId, 'exposed': entry.exposed,
            'panelId': entry.panelId,
            'enabled': !reason, 'disabledReason': reason, 'running': entry.controllers.size,
        });
    }
    return infos;
}

/**
 * --- 获取仍可调用的 App 标识与名称，供网页及 Native 代理发现目标 ---
 * @returns 未开始退出的 App 列表
 */
export function listTasks(): Array<{ 'id': string; 'name': string; }> {
    return lTask.getList().filter(info => {
        const task = lTask.getOrigin(info.id);
        return task && !task.ending;
    }).map(info => ({ 'id': info.id, 'name': info.name }));
}

/**
 * --- 获取当前环境的统一接入信息，不另行维护命令清单或启用服务 ---
 * @param current 限定目标 App；省略时由代理发现并选择 App
 * @param options 是否主动导出 HTTP 连接凭据，默认不包含
 * @returns 独立信息；目标已退出为 null，无权限导出凭据为 false
 */
export async function getAgentInfo(current?: lCore.TCurrent,
    options: IAgentOptions = {}): Promise<IAgentInfo | null | false> {
    const taskId = current === undefined ? null : owner(current).taskId;
    if (taskId !== null && !listTasks().some(app => app.id === taskId)) {
        return null;
    }
    let http: lNative.IMcpInfo | null = null;
    if (options.includeMcpCredentials) {
        if (current === undefined) {
            return false;
        }
        const info = await lNative.getMcpInfo(current);
        if (info === false) {
            return false;
        }
        http = info;
    }
    const native = await lNative.getCommandEntry();
    // --- Native 查询期间 App 可能退出；接入快照以查询完成时的实例为准 ---
    const apps = listTasks().filter(app => taskId === null || app.id === taskId);
    if (taskId !== null && !apps.length) {
        return null;
    }
    // --- 可复制的网页地址不带用户名、查询参数或 hash，避免默认分享登录信息 ---
    const location = document.location;
    const url = location?.protocol === 'http:' || location?.protocol === 'https:' ?
        `${location.origin}${location.pathname}` : null;
    const supported = getWebMcpContext() !== null;
    const publication = supported ? webPublisher.describe(apps.map(app => app.id)) : null;
    return {
        'schemaVersion': 1, 'apps': apps, 'targetTaskId': taskId,
        'browser': { 'url': url, 'api': "window['clickgo']['command']" },
        'webMcp': {
            'supported': supported, 'status': supported ? 'ready' : 'unsupported',
            'registrationStatus': publication?.registrationStatus ?? null,
            'publishedTaskIds': publication?.publishedTaskIds ?? [],
        },
        'native': native, 'http': http,
    };
}

/**
 * --- 生成简短英文接入说明，不嵌入临时 App ID；代理通过接口实时发现 ---
 * @param current 校验当前 App 生命周期与凭据导出权限；省略时生成页面通用说明
 * @param options 是否主动导出 HTTP 连接凭据，默认不包含
 * @returns Markdown 说明；目标已退出为 null，无权限导出凭据为 false
 */
export async function getAgentGuide(current?: lCore.TCurrent,
    options: IAgentOptions = {}): Promise<string | null | false> {
    const info = await getAgentInfo(current, options);
    if (info === null || info === false) {
        return info;
    }
    return lGuide.format(info);
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
async function run(taskId: string, name: string, args: Record<string, TJson>, signal: AbortSignal | undefined,
    source: IContext['source'], exposedOnly: boolean): Promise<TResult> {
    const entry = registries.get(taskId)?.get(name);
    if (!entry || exposedOnly && !entry.exposed) {
        return failure('not-found', 'Command was not found');
    }
    if (signal?.aborted) {
        return failure('cancelled', 'Command was cancelled');
    }
    // --- 同步占用执行状态，不能等权限或业务 Promise 完成后才防重复 ---
    const controller = new AbortController();
    const abort = (): void => {
        controller.abort();
    };
    try {
        const input = lData.readInput(args, entry.metadata.inputSchema);
        if (!input.ok) {
            return input;
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
        const result: unknown = await entry.execute(input.data, {
            'taskId': taskId, 'formId': entry.formId, 'panelId': entry.panelId,
            'source': source, 'signal': controller.signal,
        });
        if (controller.signal.aborted) {
            return failure('cancelled', 'Command was cancelled');
        }
        return lData.readResult(result, entry.metadata.outputSchema);
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
export function execute(current: lCore.TCurrent, name: string, args: Record<string, TJson> = {},
    options: { 'signal'?: AbortSignal; } = {}): Promise<TResult> {
    return run(owner(current).taskId, name, args, options.signal, 'user', false);
}

/**
 * --- 代理直接按 taskId 执行公开命令，与界面共用校验和业务执行器 ---
 * @param taskId 目标 App
 * @param name 命令名称
 * @param args 参数，默认空对象
 * @param options 取消信号
 * @returns 结构化结果；未公开或不存在的命令返回 not-found
 */
export function executeAgent(taskId: string, name: string, args: Record<string, TJson> = {},
    options: { 'signal'?: AbortSignal; } = {}): Promise<TResult> {
    return run(taskId, name, args, options.signal, 'agent', true);
}

/**
 * --- 创建绑定单个 App 的可复用代理接口，调用方无需反复传入 taskId ---
 * @param current 所属应用
 * @returns 不可修改的桥接接口
 */
export function createBridge(current: lCore.TCurrent): IBridge {
    const { taskId } = owner(current);
    return Object.freeze({
        'taskId': taskId,
        'list': () => list(taskId).filter(info => info.exposed),
        'execute': (name: string, args: Record<string, TJson> = {}, options: { 'signal'?: AbortSignal; } = {}) =>
            executeAgent(taskId, name, args, options),
    });
}

/**
 * --- 网页入口直接读取框架的任务及命令状态，无需应用或宿主重复发布与清理 ---
 * @returns 不可修改的网页命令接口
 */
export function createPageBridge(): IPageBridge {
    return Object.freeze({
        // --- 网页发现接口只生成不含凭据的说明，不转发应用的凭据导出选项 ---
        'getAgentInfo': (taskId?: string) => getAgentInfo(taskId),
        'getAgentGuide': (taskId?: string) => getAgentGuide(taskId),
        'listTasks': listTasks,
        'list': (taskId: string) => {
            const task = lTask.getOrigin(taskId);
            return task && !task.ending ? list(taskId).filter(info => info.exposed) : [];
        },
        'execute': executeAgent,
    });
}

/**
 * --- 检测页面的浏览器接口；WebMCP 没有按 App 建立连接的握手过程 ---
 * @returns 可用的页面接口，不支持时为 null
 */
function getWebMcpContext(): lWebMcp.IContext | null {
    const context = (document as unknown as { 'modelContext'?: lWebMcp.IContext; }).modelContext;
    const status = typeof context?.registerTool === 'function' ? 'ready' : 'unsupported';
    if (webMcpStatus !== status) {
        webMcpStatus = status;
        lCore.trigger('webMcpStatusChanged', status).catch(() => {});
    }
    return status === 'ready' ? context ?? null : null;
}

/**
 * --- 检测浏览器能力并排队发布当前 App 的公开命令 ---
 * @param taskId 所属应用
 * @returns 发布状态；浏览器不支持或 App 已退出时返回 null
 */
function publishWebMcp(taskId: string): lWebMcp.IPublication<IEntry> | null {
    const task = lTask.getOrigin(taskId);
    const context = getWebMcpContext();
    if (!task || task.ending || context === null) {
        return null;
    }
    return webPublisher.publish(taskId, context);
}

/**
 * --- 显式重同步或重试当前 App 的工具发布；页面接入由框架自动管理 ---
 * @param current 所属应用
 * @returns 是否同步成功；浏览器不支持、App 已退出或注册失败时返回 false
 */
export async function connectWebMcp(current: lCore.TCurrent): Promise<boolean> {
    const publication = publishWebMcp(owner(current).taskId);
    return publication?.pending ?? false;
}

/**
 * --- 撤销当前 App 的 WebMCP 工具；不改变页面级接入状态，下次公开命令注册时自动发布 ---
 * @param current 所属应用
 * @returns 无返回值
 */
export function disconnectWebMcp(current: lCore.TCurrent): void {
    const { taskId } = owner(current);
    webPublisher.disconnect(taskId);
}
