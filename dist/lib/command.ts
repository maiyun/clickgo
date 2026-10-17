import * as lCore from './core';
import * as lTask from './task';
import * as lData from './command/data';
import * as lWebMcp from './command/webmcp';
import * as lGuide from './command/guide';
import * as lFile from './command/file';
import * as lNative from './native';
import * as lAboxCommand from '../abox/command.js';
import type { TJson, TResult, IDefinition, IInfo, IAgentOptions, IAgentInfo, IBridge, IPageBridge } from './command/types';

export { showPalette } from './command/palette';
export type { IFileInfo, IFileOptions, IFileChunk } from './command/file';
export type {
    TJson, ISchema, TResult, IContext, IMetadata, IDefinition, IInfo, IBridge, IPageBridge,
    IAgentOptions, TWebMcpStatus, TWebMcpRegistrationStatus, IAgentInfo,
} from './command/types';

/** --- 框架机制接入命令运行时；注册、执行及销毁规则共用同一实例 --- */
const runtime = lAboxCommand.createRuntime({
    'core': lCore, 'task': lTask, 'native': lNative, 'files': lFile,
    'data': lData, 'webMcp': lWebMcp, 'guide': lGuide,
});

/**
 * --- 初始化页面级 WebMCP 接入状态，由框架在执行 Boot.main 前自动调用 ---
 * @returns 无返回值
 */
export function init(): void {
    runtime.init();
}

/**
 * --- 构造成功结果 ---
 * @param data 可跨入口传输的 JSON 数据
 * @param files 本次命令明确交付的框架文件，可省略；不能传入其他 App 的文件
 * @returns 成功结果
 */
export function success<T extends TJson>(data: T, files?: lFile.IFileInfo[]): TResult<T> {
    return runtime.success(data, files);
}

/**
 * --- 构造业务失败结果，不抛异常 ---
 * @param code 稳定的业务错误码
 * @param message 可公开的错误说明
 * @returns 失败结果
 */
export function failure(code: string, message: string): TResult<never> {
    return runtime.failure(code, message);
}

/**
 * --- 主动释放旧导出的缓存，释放后代理不能继续读取；不删除磁盘文件 ---
 * @param current 文件所属的 App/Form/Panel，Form/Panel 只能释放自身范围
 * @param fileId 先前交付的文件标识
 * @returns 是否找到并释放，已释放或不属于当前范围为 false
 */
export function releaseFile(current: lCore.TCurrent, fileId: string): boolean {
    return runtime.releaseFile(current, fileId);
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
    return runtime.register(current, definition);
}

/**
 * --- 取消尚在执行的命令并解除注册；取消是协作式，不回滚已产生的业务效果 ---
 * @param current 所属任务/Form/Panel
 * @param name 命令名称
 * @returns 是否找到并移除命令
 */
export function unregister(current: lCore.TCurrent, name: string): boolean {
    return runtime.unregister(current, name);
}

/**
 * --- 清理所属 Panel、Form 或整个任务的命令 ---
 * @param current 所属任务/Form/Panel
 * @returns 无返回值
 */
export function clear(current: lCore.TCurrent): void {
    runtime.clear(current);
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
    runtime.clearOwner(taskId, formId, panelId);
}

/**
 * --- 获取独立元数据和当前状态，不导出业务函数 ---
 * @param current 所属应用
 * @returns 命令列表
 */
export function list(current: lCore.TCurrent): IInfo[] {
    return runtime.list(current);
}

/**
 * --- 获取仍可调用的 App 标识与名称，供网页及 Native 代理发现目标 ---
 * @returns 未开始退出的 App 列表
 */
export function listTasks(): Array<{ 'id': string; 'name': string; }> {
    return runtime.listTasks();
}

/**
 * --- 获取当前环境的统一接入信息，不另行维护命令清单或启用服务 ---
 * @param current 限定目标 App；省略时由代理发现并选择 App
 * @param options 是否主动导出 HTTP 连接凭据，默认不包含
 * @returns 独立信息；目标已退出为 null，无权限导出凭据为 false
 */
export async function getAgentInfo(current?: lCore.TCurrent,
    options: IAgentOptions = {}): Promise<IAgentInfo | null | false> {
    return runtime.getAgentInfo(current, options);
}

/**
 * --- 生成简短英文接入说明，不嵌入临时 App ID；代理通过接口实时发现 ---
 * @param current 校验当前 App 生命周期与凭据导出权限；省略时生成页面通用说明
 * @param options 是否主动导出 HTTP 连接凭据，默认不包含
 * @returns Markdown 说明；目标已退出为 null，无权限导出凭据为 false
 */
export async function getAgentGuide(current?: lCore.TCurrent,
    options: IAgentOptions = {}): Promise<string | null | false> {
    return runtime.getAgentGuide(current, options);
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
    return runtime.execute(current, name, args, options);
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
    return runtime.executeAgent(taskId, name, args, options);
}

/**
 * --- 创建绑定单个 App 的可复用代理接口，调用方无需反复传入 taskId ---
 * @param current 所属应用
 * @returns 不可修改的桥接接口
 */
export function createBridge(current: lCore.TCurrent): IBridge {
    return runtime.createBridge(current);
}

/**
 * --- 网页入口直接读取框架的任务及命令状态，无需应用或宿主重复发布与清理 ---
 * @returns 不可修改的网页命令接口
 */
export function createPageBridge(): IPageBridge {
    return runtime.createPageBridge();
}

/**
 * --- 手动将当前 App 已公开的命令发布到浏览器 WebMCP ---
 * 公开命令注册或移除时框架自动同步，通常无需调用。
 * 仅在发布失败需重试、主动撤销后需恢复，或浏览器稍后才提供 WebMCP 接口时调用。
 * 同一浏览器接口下保留已发布工具，只补齐缺失项；不重置 App 的命令或业务状态。
 * @param current 所属应用
 * @returns 是否发布成功；浏览器不支持、App 已退出、发布中途撤销或注册失败时返回 false
 */
export async function connectWebMcp(current: lCore.TCurrent): Promise<boolean> {
    return runtime.connectWebMcp(current);
}

/**
 * --- 撤销当前 App 的 WebMCP 工具；不改变页面级接入状态，下次公开命令注册时自动发布 ---
 * @param current 所属应用
 * @returns 无返回值
 */
export function disconnectWebMcp(current: lCore.TCurrent): void {
    runtime.disconnectWebMcp(current);
}
