/** --- ClickGo 基 --- */
interface IClickGo {
    /** --- 当前请求页面的基路径 --- */
    'rootPath': string;
    /** --- 当前 JS 文件的基路径 --- */
    'cgRootPath': string;
    /** --- 是否有 touch 环境 --- */
    'hasTouch': boolean;
    /** --- 是否是桌面环境 --- */
    'isNative': boolean;
    /** --- ClickGo 响应位置 --- */
    'position': ICGPosition;
    /** --- 获取 ClickGo 响应区域计算后的值 --- */
    getPosition(): ICGPositionResult;

    /** --- 是否已加载完成 --- */
    'isReady': boolean;
    /** --- ClickGo 准备就绪后执行的 --- */
    'readys': Array<() => void | Promise<void>>;
    /**
     * --- 注册页面装载成功回调 ---
     * @param callback 回调函数
     */
    ready(callback: () => void | Promise<void>): void;

    'control': ICGControlLib;
    'core': ICGCoreLib;
    'dom': ICGDomLib;
    'form': ICGFormLib;
    'task': ICGTaskLib;
    'theme': ICGThemeLib;
    'tool': ICGToolLib;
    'zip': ICGZipLib;
}

/** --- ClickGo 响应区域 --- */
interface ICGPosition {
    'left': null | number;
    'top': null | number;
    'width': null | number;
    'height': null | number;
    'offsetWidth': null | number;
    'offsetHeight': null | number;
}
interface ICGPositionResult {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
    'offsetWidth': number;
    'offsetHeight': number;
}

// declare let clickgo: IClickGo;
