import * as lAboxCommand from '../../abox/command.js';
import type { IMetadata, ISchema, TJson, TResult, TWebMcpRegistrationStatus } from '../command';

/** --- 浏览器发布所需的命令身份与元数据，不持有业务执行函数 --- */
export interface ICommand {
    /** --- 每次注册使用不同标识，旧工具不能转向同名的新命令 --- */
    'id': number;
    'metadata': IMetadata;
}

/** --- 浏览器提供的工具注册能力；撤销信号只作用于本次工具发布 --- */
export interface IContext {
    'registerTool': (tool: {
        'name': string;
        'description': string;
        'inputSchema': ISchema;
        'execute': (args: Record<string, TJson>, options?: { 'signal'?: AbortSignal; }) => Promise<string>;
        'annotations'?: { 'readOnlyHint'?: boolean; 'consequentialHint'?: boolean; 'untrustedContentHint'?: boolean; };
    }, options: { 'signal': AbortSignal; }) => void | Promise<void>;
}

/** --- 灰箱提供的命令选择、注册身份判断和统一执行入口 --- */
export interface IRuntime<T extends ICommand> {
    /** --- 当前允许代理发现的命令，由调用方按 exposed 筛选 --- */
    'getCommands': (taskId: string) => T[];
    /** --- 当前注册表仍持有同一个命令实例；不能只比较名称 --- */
    'isCurrent': (taskId: string, command: T) => boolean;
    /** --- 使用灰箱 executeAgent，重新检查权限、可用性、并发和取消 --- */
    'execute': (taskId: string, command: T, args: Record<string, TJson>,
        options?: { 'signal'?: AbortSignal; }) => Promise<TResult>;
}

/** --- 单个 App 的发布记录，与页面接入状态分开 --- */
export interface IPublication<T extends ICommand> {
    'context': IContext;
    'tools': Map<T, AbortController>;
    /** --- 最新一次串行同步的结果；撤销或注册失败为 false --- */
    'pending': Promise<boolean>;
    'status': TWebMcpRegistrationStatus;
}

/** --- 所选 App 的发布诊断；不触发注册，不读取其他 App --- */
export interface IDiagnostics {
    /** --- 失败优先于进行中，其余按已发布或空闲报告 --- */
    'registrationStatus': TWebMcpRegistrationStatus;
    'publishedTaskIds': string[];
}

/** --- 按 App 隔离并串行同步工具，撤销后拒绝迟到注册及旧工具调用 --- */
export interface IPublisher<T extends ICommand> {
    /**
     * --- 发布或重同步；浏览器接口改变时先撤销旧发布 ---
     * @param taskId 灰箱已确认仍存活的 App
     * @param context 当前浏览器注册能力
     * @returns 发布记录，pending 表示本轮同步是否成功
     */
    'publish': (taskId: string, context: IContext) => IPublication<T>;
    /**
     * --- 按注册表最新内容排队同步，失败工具可重试 ---
     * @param taskId 所属 App
     * @returns 无返回值；未发布过的 App 不处理
     */
    'refresh': (taskId: string) => void;
    /**
     * --- 撤销 App 工具及待完成发布，不改变页面级接入状态 ---
     * @param taskId 所属 App
     * @returns 无返回值
     */
    'disconnect': (taskId: string) => void;
    /**
     * --- 汇总所选 App 的工具发布状态 ---
     * @param taskIds 所选 App 标识
     * @returns 发布诊断
     */
    'describe': (taskIds: string[]) => IDiagnostics;
}

/**
 * --- 创建浏览器发布器，内部组织同步队列、撤销信号和迟到结果处理 ---
 * @param runtime 灰箱提供的公开命令选择、身份校验和执行能力
 * @returns 独立发布器；不持有页面状态或决定业务授权
 */
export function create<T extends ICommand>(runtime: IRuntime<T>): IPublisher<T> {
    return lAboxCommand.createWebPublisher(runtime);
}
