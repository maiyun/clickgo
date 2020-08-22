interface ILoader {
    /** --- 是否已加载完成 --- */
    isReady: boolean;
    /** --- 注册的 ready 事件 --- */
    readys: Array<() => void | Promise<void>>;
    /** --- 当前 js 运行的作用域网址路径（非 JS 的文件路径），末尾不以 / 结尾 --- */
    dir: string;
    /** --- 全局配置项 --- */
    config: ILoaderConfig;
    /** --- 网络上已加载的模块列表 --- */
    loaded: {
        [path: string]: ILoaderModule;
    };
    /**
     * --- 初始化函数 ---
     */
    run: () => void;
    /**
     * --- 注册页面装载成功回调 ---
     * @param callback 回调函数
     */
    ready: (callback: () => void | Promise<void>) => void;
    /**
     * --- 设置 config ---
     * @param config 配置项
     */
    setConfig: (config: ILoaderConfig) => void;
    /**
     * --- 设置加载文件的尾随后缀 ---
     * @param after 尾随后缀，如 ?abc
     */
    setAfter: (after: string) => void;
    /**
     * --- 设置模块地址映射 ---
     * @param list 模型映射列表
     */
    setPaths: (paths: ILoaderPaths) => void;
    /**
     * --- 添加一个模块映射 ---
     * @param name 模块名
     * @param path 映射地址
     */
    addPath: (name: string, path: string) => void;
    /**
     * --- 返回已经加载的网络模块地址列表 ---
     */
    getLoadedPaths: () => string[];
    /**
     * --- 用户调用通过网络加载一个模块，这是用户在 js 中主动调用的加载模块的函数 ---
     * @param path 路径或模型映射名，如 ./abc，echarts，../xx/xx
     * @param callback 成功回调
     * @param opt 选项
     */
    require: (paths: string | string[], callback?: (...input: any[]) => void, error?: (path: string) => void) => Promise<any[] | null>;
    /**
     * --- 通过运行时文件加载模型 ---
     * @param path 路径或模型映射名，如 ./abc，echarts，../xx/xx
     * @param files 基准路径或文件序列，用以加载子模型
     */
    requireMemory: (paths: string | string[], files: Record<string, Blob | string>) => Promise<any[] | null>;
    /**
     * --- 简单 fetch 获取网络数据 ---
     * @param url 网络地址
     */
    fetchGet: (url: string, init?: RequestInit) => Promise<string | null>;
    /**
     * --- 加载 script 标签 ---
     * @param el 在此标签中增加
     * @param path 增加的 js 文件地址
     */
    loadScript: (el: HTMLElement, path: string) => Promise<boolean>;
    /**
     * --- 获取并执行 module，仅会执行一次，以后只返回执行结果 ---
     * @param path 模块地址
     * @param dir 基路径
     */
    getModule: (path: string, dir: string, filesLoaded: {
        [path: string]: ILoaderModule;
    }) => any;
    /**
     * --- 通过网络、内存加载 module 但不自动执行，已经加载过的不会重新加载 ---
     * @param path 模块地址、模块名或 code
     * @param dir 当前目录地址
     * @param files 内存中的文件列表
     * @param filesLoaded files 中的代替 _loaded 的作用
     */
    loadModule: (path: string, dir: string, files: Record<string, Blob | string>, filesLoaded: {
        [path: string]: ILoaderModule;
    }) => Promise<ILoaderModule | null>;
    /**
     * --- 相对路径、异常路径、模型名转换为最终实体 path ---
     * @param path 原 path
     * @param dirname 相对 __dirname
     */
    moduleName2Path: (path: string, dirname: string) => string;
    /**
     * --- 将 blob 对象转换为 text ---
     * @param blob 对象
     */
    blob2Text: (blob: Blob) => Promise<string>;
}

interface ILoaderConfig {
    'after'?: string;
    'paths'?: ILoaderPaths;
}

interface ILoaderPaths {
    [key: string]: string;
}

interface ILoaderModule {
    'first': boolean;
    'func': string;
    'object': any;
}

declare let loader: ILoader;
