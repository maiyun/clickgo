import type * as lTool from '../tool';
import type * as lFile from './file';
import type * as lNative from '../native';

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
export type TResult<T extends TJson = TJson> = { 'ok': true; 'data': T; 'files'?: lFile.IFileInfo[]; } |
    { 'ok': false; 'error': { 'code': string; 'message': string; }; };

/** --- 执行来源仅用于展示与记录，不是授权凭证 --- */
export interface IContext {
    'taskId': string;
    'formId': string;
    'panelId': string;
    'source': 'user' | 'agent';
    'signal': AbortSignal;
    /**
     * --- 保留已生成文件；用 success(data, [file]) 明确交付，不读取路径或重新生成 ---
     * @param blob 原文件，单份最多 64 MiB；每个 App 最多 8 份、合计 128 MiB
     * @param options 文件名及可选 MIME，默认使用 Blob.type 或 application/octet-stream
     * @returns 十分钟有效的独立句柄，随所属范围销毁；参数/容量无效返回 false
     * 仅在本次执行中有效；失败、取消、无效输出及未交付的文件自动释放，私有命令不公开文件
     */
    'createFile': (blob: Blob, options: lFile.IFileOptions) => lFile.IFileInfo | false;
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
    'apps': Array<{ 'id': string; 'name': string; }>;
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
