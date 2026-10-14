/** --- 操作系统文件打开请求来源 --- */
export type TNativeOpenFilesSource = 'startup' | 'second-instance' | 'association' | 'drop';

/** --- 普通 GUI 启动请求；CLI/stdio 由 Native 单独处理，不投递此事件 --- */
export interface INativeLaunchEvent {
    /** --- 本进程内请求 ID；同一次启动的文件事件使用相同 ID --- */
    'requestId': number;
    'source': 'startup' | 'second-instance';
    /** --- 去掉可执行文件和开发入口后的业务参数，保留顺序 --- */
    'args': string[];
    /** --- 原生绝对工作目录，参数中的相对路径以此为基准 --- */
    'cwd': string;
}

/** --- 文件事件上下文；paths 为不含 /storage/ 的 ClickGo 绝对文件路径 --- */
export interface INativeOpenFilesInfo {
    'requestId': number;
    'source': TNativeOpenFilesSource;
}

/** --- Native 主文档桥接数据；框架内部使用 --- */
export type TNativeEvent = {
    'type': 'launch';
    'event': INativeLaunchEvent;
} | {
    'type': 'openFiles';
    'paths': string[];
    'info': INativeOpenFilesInfo;
};

/** --- 系统事件传输适配，生命周期与授权由调用方控制 --- */
export interface INativeEventDispatcherOptions {
    /** --- ClickGo Boot.main 已完成且处于 Native 环境 --- */
    'ready': () => boolean;
    /** --- 读取当前会话未投递请求；旧宿主为 null，失败为 false --- */
    'read': () => Promise<TNativeEvent[] | null | false>;
    /** --- 按事件类型进入框架全局分发 --- */
    'dispatch': (event: TNativeEvent) => Promise<void>;
    /** --- 传输异常报告，不输出业务参数 --- */
    'error': (error: unknown) => void;
}
