/**
 * --- ClickGo ---
 */

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
    'position': IClickGoPosition;
    /** --- 获取 ClickGo 响应区域计算后的值 --- */
    getPosition(): IClickGoPositionResult;

    /** --- 是否已加载完成 --- */
    'isReady': boolean;
    /** --- ClickGo 准备就绪后执行的 --- */
    'readys': Array<() => void | Promise<void>>;
    /**
     * --- 注册页面装载成功回调 ---
     * @param callback 回调函数
     */
    ready(callback: () => void | Promise<void>): void;

    'core': ICoreLib;
    'element': IElementLib;
    'form': IFormLib;
    'theme': IThemeLib;
    'tool': IToolLib;
}

/** --- ClickGo 响应区域 --- */
interface IClickGoPosition {
    'left': null | number;
    'top': null | number;
    'width': null | number;
    'height': null | number;
    'offsetWidth': null | number;
    'offsetHeight': null | number;
}
interface IClickGoPositionResult {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
    'offsetWidth': number;
    'offsetHeight': number;
}

/**
 * --- Core ---
 */

interface ICoreLib {
    'clickgoFiles': Record<string, Blob>;
    'clickgoControlPkgs': Record<string, IControlPkg>;
    'tasks': Record<number, ITask>;
    'lastTaskId': number;
    'globalEvents': IGlobalEvents;
    trigger(name: TGlobalEvent, taskId?: number, formId?: number, opt?: {
        'title'?: string;
        'state'?: boolean;
        'icon'?: string;
    }): void;
    fetchClickGoFile(path: string): Promise<null | Blob>;
    fetchClickGoControlPkg(path: string): Promise<null | IControlPkg>;
    fetchApp(path: string): Promise<null | IAppPkg>;
    runApp(path: string | IAppPkg, opt?: {
        'runtime'?: Record<string, Blob>;
    }): Promise<number>;
    endTask(taskId: number): boolean;
    setGlobalCursor(type?: string): void;
}

/** --- 全局事件 --- */
interface IGlobalEvents {
    /** --- 配置捕获 Vue 错误 --- */
    errorHandler: null | ((taskId: number, formId: number, error: any, info: string) => void);
    /** --- 当屏幕大小改变时触发的事件 --- */
    screenResizeHandler: null | (() => void | Promise<void>);
    /** --- 窗体被创建后触发 --- */
    formCreatedHandler: null | ((taskId: number, formId: number, title: string, icon: string) => void | Promise<void>);
    /** --- 窗体被移除后触发 --- */
    formRemovedHandler: null | ((taskId: number, formId: number, title: string, icno: string) => void | Promise<void>);
    /** --- 窗体标题被改变后触发 --- */
    formTitleChangedHandler: null | ((taskId: number, formId: number, title: string) => void | Promise<void>);
    /** --- 窗体图标被改变后触发 --- */
    formIconChangedHandler: null | ((taskId: number, formId: number, icon: string) => void | Promise<void>);
    /** --- 窗体最小化状态改变后触发 --- */
    formStateMinChangedHandler: null | ((taskId: number, formId: number, state: boolean) => void | Promise<void>);
    /** --- 窗体最大化状态改变后触发 --- */
    formStateMaxChangedHandler: null | ((taskId: number, formId: number, state: boolean) => void | Promise<void>);
    /** --- 窗体获得焦点后触发 --- */
    formFocusedHandler: null | ((taskId: number, formId: number) => void | Promise<void>);
    /** --- 窗体丢失焦点后触发 --- */
    formBlurredHandler: null | ((taskId: number, formId: number) => void | Promise<void>);
    /** --- 窗体闪烁时触发 --- */
    formFlashHandler: null | ((taskId: number, formId: number) => void | Promise<void>);
    /** --- 任务开始后触发 --- */
    taskStartedHandler: null | ((taskId: number) => void | Promise<void>);
    /** --- 任务结束后触发 --- */
    taskEndedHandler: null | ((taskId: number) => void | Promise<void>);
}

/** --- 全局事件类型 --- */
type TGlobalEvent = 'screenResize' | 'formCreated' | 'formRemoved' | 'formTitleChanged' | 'formIconChanged' | 'formStateMinChanged' | 'formStateMaxChanged' | 'formFocused' | 'formBlurred' | 'formFlash' | 'taskStarted' | 'taskEnded';

/** --- 控件文件包 --- */
interface IControlPkg {
    [name: string]: IControl;
}

/** --- 控件对象 --- */
interface IControl {
    'type': 'control';
    /** --- 控件对象配置文件 --- */
    'config': IControlConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob>;
}

/** --- 控件文件包的 config --- */
interface IControlConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 不带扩展名，系统会在末尾添加 .js --- */
    'code': string;
    /** --- 不带扩展名，系统会在末尾添加 .html --- */
    'layout': string;
    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style': string;

    /** --- 将要加载的文件 --- */
    'files': string[];
}

/** --- 应用文件包 --- */
interface IAppPkg {
    'type': 'app';
    /** --- 应用对象配置文件 --- */
    'config': IAppConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob>;
}

/** --- 应用文件包 config --- */
interface IAppConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 将要加载的控件 --- */
    'controls': string[];
    /** --- 将自动加载的主题 --- */
    'themes'?: string[];
    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style'?: string;
    /** --- 不带扩展名，系统会在末尾添加 .xml --- */
    'main': string;

    /** --- 将要加载的文件列表 --- */
    'files': string[];
}

/** --- 单条任务对象 --- */
interface ITask {
    'id': number;
    'appPkg': IAppPkg;
    'customTheme': boolean;

    'controlPkgs': Record<string, IControlPkg>;
    'themes': Record<string, ITheme>;
    'forms': Record<number, IForm>;
}

/**
 * --- Element ---
 */

interface IElementLib {
    getSize(el: HTMLElement): IElementSize;
    watchSize(el: HTMLElement, cb: (size: IElementSize) => void, immediate?: boolean): IElementSize;
    watchElement(el: HTMLElement, cb: () => void, mode?: 'child' | 'childsub' | 'style' | 'default' | MutationObserverInit, immediate?: boolean): MutationObserver;
    bindDown(oe: MouseEvent | TouchEvent, opt: {
        'down'?: (e: MouseEvent | TouchEvent) => void;
        'start'?: (e: MouseEvent | TouchEvent) => void | boolean;
        'move'?: (e: MouseEvent | TouchEvent) => void | boolean;
        'up'?: (e: MouseEvent | TouchEvent) => void;
        'end'?: (e: MouseEvent | TouchEvent) => void;
    }): void;
    bindMove(e: MouseEvent | TouchEvent, opt: {
        'left'?: number;
        'top'?: number;
        'right'?: number;
        'bottom'?: number;
        'offsetLeft'?: number;
        'offsetTop'?: number;
        'offsetRight'?: number;
        'offsetBottom'?: number;
        'objectLeft'?: number;
        'objectTop'?: number;
        'objectWidth'?: number;
        'objectHeight'?: number;
        'object'?: HTMLElement | IVue;
        'offsetObject'?: HTMLElement | IVue;
        'showRect'?: boolean;
        'start'?: (x: number, y: number) => void | boolean;
        'move'?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void;
        'up'?: () => void;
        'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>) => void;
        'borderIn'?: (x: number, y: number, border: TBorderDir) => void;
        'borderOut'?: () => void;
    }): {
        'left': number;
        'top': number;
        'right': number;
        'bottom': number;
    };
    bindResize(e: MouseEvent | TouchEvent, opt: {
        'left': number;
        'top': number;
        'width': number;
        'height': number;
        'minWidth'?: number;
        'minHeight'?: number;
        'offsetObject'?: HTMLElement;
        'dir': TBorderDir;
        'start'?: (x: number, y: number) => void | boolean;
        'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void;
        'end'?: () => void;
    }): void;
    findParentByClass(el: HTMLElement, cn: string | string[]): HTMLElement | null;
    siblings(e: HTMLElement, cn: string): HTMLElement | null;
}

/** --- 方向类型，从左上开始 --- */
type TBorderDir = 'lt' | 't' | 'tr' | 'r' | 'rb' | 'b' | 'bl' | 'l' | '' | { 'left': number; 'top'?: number; 'width': number; 'height'?: number; };

/** --- Element 的大小 --- */
interface IElementSize {
    'top': number;
    'right': number;
    'bottom': number;
    'left': number;
    'width': number;
    'height': number;
    'padding': {
        'top': number;
        'right': number;
        'bottom': number;
        'left': number;
    };
    'border': {
        'top': number;
        'right': number;
        'bottom': number;
        'left': number;
    };
    'clientHeight': number;
    'clientWidth': number;
    'innerWidth': number;
    'innerHeight': number;
    'scrollWidth': number;
    'scrollHeight': number;
}

/**
 * --- Form ---
 */

interface IFormLib {
    'currentPop': null | IVue;
    'lastFormId': number;
    'lastZIndex': number;
    'lastTopZIndex': number;
    'lastPopZIndex': number;
    changeFocus(formId?: number, vm?: IVue): void;
    getRectByDir(dir: TBorderDir): {
        'width': number;
        'height': number;
        'left': number;
        'top': number;
    };
    showCircular(x: number, y: number): void;
    moveRectangle(dir: TBorderDir): void;
    showRectangle(x: number, y: number, pos: TBorderDir): void;
    hideRectangle(): void;
    appendToPop(el: HTMLElement): void;
    removeFromPop(el: HTMLElement): void;
    showPop(pop: IVueControl, x: number | 'h' | 'v', y?: number): {
        'left': string;
        'top': string;
        'zIndex': string;
    };
    hidePop(pop?: IVue | null): void;
    doFocusAndPopEvent(e: MouseEvent | TouchEvent): void;
    remove(formId: number): boolean;
    create(opt: ICreateFormOptions): Promise<number | IForm>;
}

/** --- 窗体对象 --- */
interface IForm {
    'id': number;
    'vapp': IVueApp;
    'vroot': IVue;
    'win': Electron.BrowserWindow | null;
    'events': Record<string, (...any: any) => void | Promise<void>>;
}

/** --- 窗体创建选项 --- */
interface ICreateFormOptions {
    'dir'?: string;
    'file'?: string;

    'code'?: Record<string, any>;
    'layout'?: string;
    'style'?: string;

    'topMost'?: boolean;
    'taskId'?: number;
}

/**
 * --- Theme ---
 */

interface IThemeLib {
    'global': ITheme | null;
    'clickgoThemes': Record<string, ITheme>;
    readBlob(blob: Blob): Promise<false | ITheme>;
    fetchClickGo(path: string): Promise<null | ITheme>;
    load(path: string | ITheme, taskId: number, custom?: boolean): Promise<boolean>;
    remove(path: string, taskId: number): Promise<void>;
    clear(taskId: number, custom?: boolean): Promise<void>;
    setGlobal(file: string | ITheme): Promise<void>;
    clearGlobal(): Promise<void>;
}

/** --- 主题对象 --- */
interface ITheme {
    'type': 'theme';
    /** --- 主题对象配置文件 --- */
    'config': IThemeConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob>;
}

/** --- 主题文件包的 config --- */
interface IThemeConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style': string;

    /** --- 将要加载的文件 --- */
    'files': string[];
}

/**
 * --- Tool ---
 */

interface IToolLib {
    blob2DataUrl(blob: Blob): Promise<string>;
    blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
    blob2Text(blob: Blob): Promise<string>;
    clone(obj: Record<string, any> | any[]): any[] | any;
    sleep(ms?: number): Promise<void>;
    createTaskStyleElement(taskId: number): void;
    removeTaskStyleElement(taskId: number): void;
    pushStyle(style: string, taskId: number, type?: 'controls' | 'global' | 'forms', formId?: number): void;
    removeStyle(taskId: number, formId?: number): void;
    purify(text: string): string;
    trim(text: string): string;
    parsePath(path: string): string;
    isControlPkg(o: string | any): o is IControlPkg;
    isAppPkg(o: string | any): o is IAppPkg;
    controlBlob2Pkg(blob: Blob): Promise<false | IControlPkg>;
    stylePrepend(style: string, rand?: string): {
        'rand': string;
        'style': string;
    };
    pathResolve(dir: string, path: string): string;
    styleUrl2DataUrl(dir: string, style: string, files: Record<string, Blob>): Promise<string>;
    layoutInsertAttr(layout: string, insert: string, opt?: { 'ignore'?: RegExp[]; 'include'?: RegExp[]; }): string;
    layoutClassPrepend(layout: string, rand?: string[]): {
        'rand': string[];
        'layout': string;
    };
}

// declare let clickgo: IClickGo;
