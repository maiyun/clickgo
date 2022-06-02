export let control: typeof import('../dist/lib/control');
export let core: typeof import('../dist/lib/core');
export let dom: typeof import('../dist/lib/dom');
export let form: typeof import('../dist/lib/form');
export let fs: typeof import('../dist/lib/fs');
export let native: typeof import('../dist/lib/native');
export let task: typeof import('../dist/lib/task');
export let theme: typeof import('../dist/lib/theme');
export let tool: typeof import('../dist/lib/tool');
export let zip: typeof import('../dist/lib/zip');

export function getVersion(): string;
export function getNative(): boolean;
export function setSafe(val: boolean): void;
export function getSafe(): boolean;
export function setCdn(val: string): void;
export function getCdn(): string;

export function init(cdn?: string): Promise<void>;

// --- core 核心 ---

/** --- 屏幕可用区域 --- */
export interface IAvailArea {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
}

/** --- 全局事件 --- */
export interface IGlobalEvents {
    /** --- 配置捕获 Vue 错误 --- */
    errorHandler: null | ((taskId: number, formId: number, error: Error, info: string) => void | Promise<void>);
    /** --- 当屏幕大小改变时触发的事件 --- */
    screenResizeHandler: null | (() => void | Promise<void>);
    /** --- 系统配置被更改时触发 --- */
    configChangedHandler: null | (
        (n: TConfigName, v: string | boolean | Record<string, any> | null) => void | Promise<void>
    );
    /** --- 窗体被创建后触发 --- */
    formCreatedHandler: null | ((taskId: number, formId: number, title: string, icon: string) => void | Promise<void>);
    /** --- 窗体被移除后触发 --- */
    formRemovedHandler: null | ((taskId: number, formId: number, title: string, icon: string) => void | Promise<void>);
    /** --- 窗体标题被改变后触发 --- */
    formTitleChangedHandler: null | ((taskId: number, formId: number, title: string) => void | Promise<void>);
    /** --- 窗体图标被改变后触发 --- */
    formIconChangedHandler: null | ((taskId: number, formId: number, icon: string) => void | Promise<void>);
    /** --- 窗体最小化状态改变后触发 --- */
    formStateMinChangedHandler: null | ((taskId: number, formId: number, state: boolean) => void | Promise<void>);
    /** --- 窗体最大化状态改变后触发 --- */
    formStateMaxChangedHandler: null | ((taskId: number, formId: number, state: boolean) => void | Promise<void>);
    /** --- 窗体显示状态改变后触发 */
    formShowChangedHandler: null | ((taskId: number, formId: number, state: boolean) => void | Promise<void>);
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

/** --- Core Config 属性列表 --- */
export type TConfigName = 'locale' | 'task.position' | 'task.pin' | 'desktop.icon.storage' | 'desktop.icon.recycler' | 'desktop.wallpaper' | 'desktop.path';

/** --- Config 对象 --- */
export interface IConfig {
    'locale': string;
    ['task.position']: 'left' | 'right' | 'top' | 'bottom';
    ['task.pin']: Record<string, { 'name': string; 'icon': string; }>;
    ['desktop.icon.storage']: boolean;
    ['desktop.icon.recycler']: boolean;
    ['desktop.wallpaper']: string | null;
    ['desktop.path']: string | null;
}

/** --- 全局事件类型 --- */
export type TGlobalEvent = 'error' | 'screenResize' | 'configChanged' | 'formCreated' | 'formRemoved' | 'formTitleChanged' | 'formIconChanged' | 'formStateMinChanged' | 'formStateMaxChanged' | 'formShowChanged' | 'formFocused' | 'formBlurred' | 'formFlash' | 'taskStarted' | 'taskEnded';

export interface ICoreFetchAppOptions {
    'notifyId'?: number;
    'current'?: string;
}

/** --- 应用文件包 --- */
export interface IApp {
    'type': 'app';
    /** --- 应用图标 --- */
    'icon': string;
    /** --- 应用对象配置文件 --- */
    'config': IAppConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
}

/** --- 应用文件包 config --- */
export interface IAppConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 将要加载的控件 --- */
    'controls': string[];
    /** --- 将自动加载的主题 --- */
    'themes'?: string[];
    /** --- 将自动申请的权限 --- */
    'permissions'?: Record<string, any>;
    /** --- 将自动加载的语言包，path: lang --- */
    'locales'?: Record<string, string>;
    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style'?: string;
    /** --- 不带扩展名，系统会在末尾添加 .xml --- */
    'main': string;
    /** --- 图标路径，需包含扩张名 --- */
    'icon': string;

    /** --- 将要加载的文件列表 --- */
    'files': string[];
}

// --- dom ---

/** --- Element 的大小 --- */
export interface IDomSize {
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

/** --- 绑定鼠标事件选项 --- */
export interface IBindDownOptions {
    'down'?: (e: MouseEvent | TouchEvent) => void;
    'start'?: (e: MouseEvent | TouchEvent) => any;
    'move'?: (
        e: MouseEvent | TouchEvent,
        dir: 'top' | 'right' | 'bottom' | 'left'
    ) => any;
    'up'?: (e: MouseEvent | TouchEvent) => void;
    'end'?: (e: MouseEvent | TouchEvent) => void;
}

/** --- 绑定上下左右拉选项 --- */
export interface IBindGestureOptions {
    'el'?: HTMLElement;
    'rect'?: DOMRect;
    'dirs'?: Array<('top' | 'right' | 'bottom' | 'left')>;
    handler: (dir: 'top' | 'right' | 'bottom' | 'left') => void;
}

/** --- 绑定拖动选项 --- */
export interface IBindMoveOptions {
    'areaObject'?: HTMLElement | IVue;
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
    'showRect'?: boolean;
    'start'?: (x: number, y: number) => any;
    'move'?: (ox: number, oy: number, x: number, y: number, border: TBorder, dir: 'top' | 'right' | 'bottom' | 'left', e: MouseEvent | TouchEvent) => void;
    'up'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
    'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
    'borderIn'?: (x: number, y: number, border: TBorder, e: MouseEvent | TouchEvent) => void;
    'borderOut'?: () => void;
}

/** --- 绑定拖动返回值 --- */
export interface IBindMoveResult {
    'left': number;
    'top': number;
    'right': number;
    'bottom': number;
}

/** --- 监视大小中的元素 --- */
export interface IWatchSizeItem {
    'el': HTMLElement;
    'ro': any;
    'taskId'?: number;
}

/** --- 监视变化中的元素 --- */
export interface IWatchItem {
    'el': HTMLElement;
    'mo': MutationObserver;
    'taskId'?: number;
}

/** --- 绑定改变大小选项 --- */
export interface IBindResizeOptions {
    'objectLeft'?: number;
    'objectTop'?: number;
    'objectWidth'?: number;
    'objectHeight'?: number;
    'object'?: HTMLElement | IVue;
    'minWidth'?: number;
    'minHeight'?: number;
    'maxWidth'?: number;
    'maxHeight'?: number;
    'border': TBorder;
    'start'?: (x: number, y: number) => any;
    'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorder) => void;
    'end'?: () => void;
}

// --- 工具包 --- tool ---

export interface IRequestOptions {
    'method'?: 'GET' | 'POST';
    'body'?: FormData;
    'timeout'?: number;
    'responseType'?: XMLHttpRequestResponseType;
    'headers'?: HeadersInit;

    'uploadStart'?: (total: number) => void | Promise<void>;
    'uploadProgress'?: (loaded: number, total: number) => void | Promise<void>;
    'uploadEnd'?: () => void | Promise<void>;
    'start'?: (total: number) => void | Promise<void>;
    'end'?: () => void | Promise<void>;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
    'load'?: (res: any) => void | Promise<void>;
    'error'?: () => void | Promise<void>;
}

// --- 文件系统 --- fs ---

/** --- 文件/文件夹信息对象 --- */
export interface IStats {
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    size: number;
    blksize: number;
    atimeMs: number;
    mtimeMs: number;
    ctimeMs: number;
    birthtimeMs: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
}

/** --- 目录下项目 ---  */
export interface IDirent {
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    name: string;
}

// --- zip ---

export type TZip = import('../dist/lib/zip').Zip;

export interface IZipItem {
    'name': string;
    'date': Date;
    'isFile': boolean;
    'isDirectory': boolean;
    'path': string;
}

export interface IZipStats {
    'date': Date;
    'isFile': boolean;
    'isDirectory': boolean;
}

export interface IZipOutputByType {
    'base64': string;
    'string': string;
    'array': number[];
    'uint8array': Uint8Array;
    'arraybuffer': ArrayBuffer;
    'blob': Blob;
}

export type TZipOutputType = keyof IZipOutputByType;

export interface IZipInputByType {
    'base64': string;
    'string': string;
    'array': number[];
    'uint8array': Uint8Array;
    'arraybuffer': ArrayBuffer;
    'blob': Blob;
}

export type TZipInputType = keyof IZipInputByType;

export type TZipInputFileFormat = IZipInputByType[keyof IZipInputByType];

export interface IZipMetadata {
    percent: number;
    currentFile: string | null;
}

// --- task ---

/** --- 系统任务信息 --- */
export interface ISystemTaskInfo {
    'taskId': number;
    'formId': number;
    'length': number;
}

export interface ITaskRunOptions {
    'icon'?: string;
    'progress'?: boolean;
    'taskId'?: number;
}

export interface ICreateTimerOptions {
    'taskId'?: number;
    'formId'?: number;

    'immediate'?: boolean;
    'scope'?: 'form' | 'task';
    'count'?: number;
}

/** --- 运行中的任务对象 --- */
export interface ITask {
    'id': number;
    'app': IApp;
    'customTheme': boolean;
    'locale': {
        'lang': string;
        'data': Record<string, Record<string, string>>;
    };
    'icon': string;
    /** --- 当前 app 运行路径，末尾包含 / --- */
    'path': string;
    'files': Record<string, Blob | string>;

    /** --- 已申请的权限列表 --- */
    'permissions': Record<string, any>;
    'forms': Record<number, IForm>;
    'objectURLs': string[];
    /** --- 已解析的控件 path 映射控件对象 --- */
    'controls': {
        'loaded': Record<string, TControl | undefined>;
        'layout': Record<string, string>;
        'prep': Record<string, string>;
    };
    /** --- 任务重的 timer 列表 --- */
    'timers': Record<string, number>;
}

/** --- Task 的简略情况，通常在 list 当中 --- */
export interface ITaskInfo {
    'name': string;
    'locale': string;
    'customTheme': boolean;
    'formCount': number;
    'icon': string;
    'path': string;
}

// --- theme ---

/** --- 主题对象 --- */
export interface ITheme {
    'type': 'theme';
    /** --- 主题对象配置文件 --- */
    'config': IThemeConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
}

/** --- 主题文件包的 config --- */
export interface IThemeConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style': string;

    /** --- 将要加载的文件 --- */
    'files': string[];
}

// --- form ---

/** --- 窗体对象 --- */
export interface IForm {
    'id': number;
    'vapp': IVueApp;
    'vroot': IVForm;
    'events': Record<string, (...any: any) => void | Promise<void>>;
}

/** --- 窗体创建选项 --- */
export interface IFormCreateOptions {
    /** --- 当前 taskId，App 模式下无效 --- */
    'taskId'?: number;
    /** --- 当前的 formId，App 模式下无效 --- */
    'formId'?: number;

    'file'?: string;

    /** --- 相当于 base dir，有 file 以 file 的路径为准，没有则以 path 为准，用于定义当前 form 中文件所在的基准路径，以 / 结尾 --- */
    'path'?: string;
    'code'?: Record<string, any>;
    'layout'?: string;
    'style'?: string;

    /** --- 置顶 --- */
    'topMost'?: boolean;
    /** --- 遮罩 --- */
    'mask'?: boolean;
    /** --- 传输的数据 --- */
    'data'?: Record<string, any>;
}

/** --- Dialog 选项 --- */
export interface IFormDialogOptions {
    /** --- 当前的 formId，App 模式下无效 --- */
    'formId'?: number;

    'title'?: string;
    'content': string;
    'buttons'?: string[];
    'select'?: (e: Event, button: string) => void;
}

/** --- Confirm 选项 --- */
export interface IFormConfirmOptions {
    /** --- 当前的 formId，App 模式下无效 --- */
    'formId'?: number;

    'content': string;
    'cancel'?: boolean;
}

export interface IFormSetTopMostOptions {
    /** --- 当前 taskId，App 模式下无效 --- */
    'taskId'?: number;
    /** --- 当前的 formId，App 模式下留空为当前窗体 --- */
    'formId'?: number;
}

/** --- Form 的简略情况，通常在 list 当中 --- */
export interface IFormInfo {
    'taskId': number;
    'title': string;
    'icon': string;
    'stateMax': boolean;
    'stateMin': boolean;
    'show': boolean;
    'focus': boolean;
}

/** --- 移动 drag 到新位置函数的选项 --- */
export interface IMoveDragOptions {
    'top'?: number;
    'left'?: number;
    'width'?: number;
    'height'?: number;
    'icon'?: boolean;
}

export interface INotifyOptions {
    'title': string;
    'content': string;
    'icon'?: string | null;
    'timeout'?: number;
    'type'?: 'primary' | 'info' | 'warning' | 'danger' | 'progress';
    'progress'?: boolean;
}

/** --- 方向类型，从左上开始 --- */
export type TBorder = 'lt' | 't' | 'tr' | 'r' | 'rb' | 'b' | 'bl' | 'l' | '' | { 'left': number; 'top'?: number; 'width': number; 'height'?: number; };

export interface IVForm extends IVue {
    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /** --- 控件名 --- */
    'controlName': 'root';
    /** --- 当前窗体是否有焦点 --- */
    'cgFocus': boolean;
    /** --- 当前窗体的路径 --- */
    'cgPath': string;
    /** --- 前导 --- */
    'cgPrep': string;
    /** --- 是否 form 自定义的 zindex --- */
    'cgCustomZIndex': boolean;
    /** --- 是否在顶层 --- */
    'cgTopMost': boolean;
    /** --- 当前的 locale name --- */
    'cgLocale': string;
    /** --- 获取语言内容 --- */
    'l': (key: string) => string;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
    /**
     * --- 检测事件是否可被执行 ---
     * @param e 事件
     */
    cgAllowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean;
}

// --- 控件 --- control ---

/** --- 控件文件包 --- */
export type TControl = Record<string, IControlItem>;

/** --- 控件对象 --- */
export interface IControlItem {
    'type': 'control';
    /** --- 控件对象配置文件 --- */
    'config': IControlConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
}

/** --- 控件文件包的 config --- */
export interface IControlConfig {
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

export interface IVControl extends IVue {
    '$parent': IVControl | null;

    /** --- 当前窗体是否有焦点 --- */
    'cgFocus': boolean;
    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /** --- 控件名 --- */
    'controlName': string;
    /** --- 窗体基目录 --- */
    'cgPath': string;
    /** --- 控件前导 --- */
    'cgPrep': string;
    /** --- 获取目前现存的子 slots --- */
    'cgSlots': (name?: string) => IVueVNode[];
    /** --- 当前 task 的 locale 值 --- */
    'cgLocale': string;
    /** --- 获取语言内容 --- */
    'l': (key: string, data?: Record<string, Record<string, string>>) => string;
    /** --- 根据 control name 来寻找上级 --- */
    'cgParentByName': (controlName: string) => IVControl | null;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
    /**
     * --- 检测事件是否可被执行 ---
     * @param e 事件
     */
    cgAllowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean;

}

// --- vue ---

export type IVueOptionMergeFunction = (to: unknown, from: unknown, instance: IVue) => any;

export interface IVueConfig {
    errorHandler?(err: unknown, instance: IVue | null, info: string): void;
    'globalProperties': Record<string, any>;
    isCustomElement(tag: string): boolean;
    'optionMergeStrategies': Record<string, IVueOptionMergeFunction>;
    'performance': boolean;
    warnHandler?(msg: string, instance: IVue | null, trace: string): void;
}

export interface IVueApp {
    component(name: string): any | undefined;
    component(name: string, config: any): this;
    'config': IVueConfig;
    directive(name: string): any | undefined;
    directive(name: string, config: any): this;
    mixin(mixin: any): this;
    mount(rootContainer: HTMLElement | string): IVue;
    provide<T>(key: string, value: T): this;
    unmount(): void;
    'version': string;

    ['_container']: HTMLElement;
}

export interface IVue {
    '$attrs': Record<string, string>;
    '$data': Record<string, any>;
    '$el': HTMLElement;
    $emit(name: string, ...arg: any): void;
    $forceUpdate(): void;
    $nextTick(): Promise<void>;
    '$options': Record<string, any>;
    '$parent': IVue | null;
    '$props': Record<string, any>;
    '$refs': Record<string, HTMLElement & IVue>;
    '$root': IVue;
    '$slots': {
        'default': undefined | ((o?: any) => IVueVNode[]);
        [key: string]: undefined | ((o?: any) => IVueVNode[]);
    };
    '$watch': (o: any, cb: (n: any, o: any) => void) => void;

    [key: string]: any;
}

export interface IVueVNode {
    'children': {
        'default': undefined | (() => IVueVNode[]);
        [key: string]: undefined | (() => IVueVNode[]);
    } & IVueVNode[];
    'props': Record<string, any>;
    'type': symbol | Record<string, any>;

    [key: string]: any;
}
