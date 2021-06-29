interface ILoader {
    /** --- 是否已加载完成 --- */
    isReady: boolean;
    /** --- 注册的 ready 事件 --- */
    readys: Array<() => void | Promise<void>>;
    /** --- 当前 js 加载的基路径，一般为当前 JS 的路径 --- */
    scriptPath: string;
    /**
     * --- 初始化函数 ---
     */
    init(): void;
    /**
     * --- 注册页面装载成功回调 ---
     * @param callback 回调函数
     */
    ready(callback: () => void | Promise<void>): void;
    /**
     * --- 通过运行时文件加载模型 ---
     * @param paths 路径或模型映射名，如 ./abc，echarts，../xx/xx
     * @param files 文件 blob 列表
     * @param opt executed: 已执行（require）的文件, map: 模型映射表, dir: 当前路径基准, style: css 文件被加载的页面唯一 name
     */
    require(paths: string | string[], files: Record<string, Blob | string>, opt?: {
        'executed'?: Record<string, any>;
        'map'?: Record<string, string>;
        'dir'?: string;
        'style'?: string;
    }): any[];
    /**
     * --- 简单 fetch 获取网络数据 ---
     * @param url 网址
     * @param init 配置项
     */
    fetch(url: string, init?: RequestInit): Promise<string | Blob | null>;
    /**
     * --- 获取文件序列 ---
     * @param urls 网址列表，已加载的文件不会被再次返回
     * @param opt 配置项
     */
    fetchFiles(urls: string[], opt?: {
        'init'?: RequestInit;
        'load'?: (url: string) => void;
        'loaded'?: (url: string, state: number) => void;
        'dir'?: string;
        'files'?: Record<string, Blob | string>;
    }): Promise<Record<string, Blob | string>>;
    /**
     * --- 嗅探文件序列 ---
     * @param urls 网址或网址列表
     * @param opt 配置项
     */
    sniffFiles(urls: string | string[], opt?: {
        'init'?: RequestInit;
        'load'?: (url: string) => void;
        'loaded'?: (url: string, state: number) => void;
        'dir'?: string;
        'files'?: Record<string, Blob | string>;
        'map'?: Record<string, string>;
    }): Promise<Record<string, Blob | string>>;
    /**
     * --- 加载 script 标签 ---
     * @param el 在此标签中增加
     * @param url 增加的 js 文件地址
     */
    loadScript(el: HTMLElement, url: string): Promise<boolean>;
    /**
     * --- 加载多个 script 标签 ---
     * @param el 在此标签中增加
     * @param urls 增加的 js 文件地址列表
     * @param opt loaded 回调函数
     */
    loadScripts(el: HTMLElement, urls: string[], opt?: {
        'loaded'?: (url: string, state: number) => void;
    }): Promise<void>;
    /**
     * --- 代码中异步加载文件 ---
     * @param url 路径或模型映射名，如 ./abc，echarts，../xx/xx
     * @param files 文件 blob 列表
     * @param executed 已执行（require）的文件
     * @param dir 当前路径（dirname）
     * @param map 模型映射表
     */
    import(url: string, files: Record<string, Blob | string>, opt?: {
        'executed'?: Record<string, any>;
        'map'?: Record<string, string>;
        'dir'?: string;
        'style'?: string;
    }): Promise<any>;
    /**
     * --- 将模型名转换为具体路径 ---
     * @param path 模型名或路径
     * @param dir 基准路径（__dirname）
     * @param map 模型名映射表
     */
    moduleNameResolve(path: string, dir?: string, map?: Record<string, string>): string;
    /**
     * --- 传输 url 并解析为 IUrl 对象 ---
     * @param url url 字符串
     */
    parseUrl(url: string): ILoaderUrl;
    /**
     * --- 将相对路径根据基准路径进行转换 ---
     * @param from 基准路径
     * @param to 相对路径
     */
    urlResolve(from: string, to: string): string;
    /**
     * --- 判断一个代码字符串中，某个字符是否是被转义的 ---
     * @param index 字符的位置
     * @param code 整段代码字符串
     */
    isEscapeChar(index: number, code: string): boolean;
    /**
     * --- 去除代码当中的注释 ---
     * @param code 代码字符串
     */
    removeComment(code: string): string;
    /**
     * --- 将 blob 对象转换为 text ---
     * @param blob 对象
     */
    blob2Text(blob: Blob): Promise<string>;
    /**
     * --- 将 blob 对象转换为 base64 url ---
     * @param blob 对象
     */
    blob2DataUrl(blob: Blob): Promise<string>;
    /**
     * --- 在数组中找有没有相应的匹配值 ---
     * @param arr 数组
     * @param reg 正则
     */
    arrayTest(arr: string[], reg: RegExp): string | null;
}

interface ILoaderUrl {
    auth: string | null;
    hash: string | null;
    host: string | null;
    hostname: string | null;
    pass: string | null;
    path: string | null;
    pathname: string;
    protocol: string | null;
    port: string | null;
    query: string | null;
    user: string | null;
}

declare let loader: ILoader;
