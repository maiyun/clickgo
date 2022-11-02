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
export function getPlatform(): NodeJS.Platform | 'web';
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AbstractBoot: typeof import('../dist/index').AbstractBoot;
export function launcher(boot: import('../dist/index').AbstractBoot): void;

// -------------------------
// ------ control lib ------
// -------------------------

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

/** --- 控件对象 --- */
export interface IControl {
    'type': 'control';
    /** --- 控件对象配置文件 --- */
    'config': IControlConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
}

/** --- 控件文件包 --- */
export type TControlPackage = Record<string, IControl>;

// --------------------------
// -------- core lib --------
// --------------------------

/** --- Config 对象 --- */
export interface IConfig {
    'locale': string;
    ['task.position']: 'left' | 'right' | 'top' | 'bottom';
    ['task.pin']: Record<string, { 'name': string; 'icon': string; }>;
    ['desktop.icon.storage']: boolean;
    ['desktop.icon.recycler']: boolean;
    ['desktop.wallpaper']: string | null;
    ['desktop.path']: string | null;
    ['launcher.list']: IConfigLauncherItem[];
}

/** --- Launcher 的 item 对象 --- */
export interface IConfigLauncherItem {
    'id'?: string;
    'name': string;
    'path'?: string;
    'icon'?: string;
    'list'?: Array<{ 'id'?: string; 'name': string; 'path': string; 'icon': string; }>;
}

/** --- 屏幕可用区域 --- */
export interface IAvailArea {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
}

/** --- 全局事件类型 --- */
export type TGlobalEvent = 'error' | 'screenResize' | 'configChanged' | 'formCreated' | 'formRemoved' | 'formTitleChanged' | 'formIconChanged' | 'formStateMinChanged' | 'formStateMaxChanged' | 'formShowChanged' | 'formFocused' | 'formBlurred' | 'formFlash' | 'taskStarted' | 'taskEnded' | 'launcherFolderNameChanged';

/** --- 现场下载 app 的参数 --- */
export interface ICoreFetchAppOptions {
    'notifyId'?: number;
    'current'?: string;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
}

/** --- 应用包解包后对象 --- */
export interface IApp {
    /** --- net 模式将包含 net 属性，否则是 app 解包模式 --- */
    'net'?: {
        'current': string;
        'url': string;
        'notify'?: number;
        'progress'?: (loaded: number, total: number) => void | Promise<void>;
    };
    /** --- 应用图标，net 模式下可能为空 --- */
    'icon': string;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
}

/** --- 应用文件包 config --- */
export interface IAppConfig {
    /** --- 应用名 --- */
    'name': string;
    /** --- 发行版本 --- */
    'ver': number;
    /** --- 发行版本字符串 --- */
    'version': string;
    /** --- 作者 --- */
    'author': string;

    /** --- 将要加载的控件 --- */
    'controls': string[];
    /** --- 将自动加载的主题 --- */
    'themes'?: string[];
    /** --- 将自动申请的权限 --- */
    'permissions'?: Record<string, any>;
    /** --- 将自动加载的语言包，path: lang --- */
    'locales'?: Record<string, string>;
    /** --- 全局样式，不带扩展名，系统会在末尾添加 .css --- */
    'style'?: string;
    /** --- 图标路径，需包含扩展名 --- */
    'icon'?: string;

    /** --- 将要加载的非 js 文件列表，仅 net 模式有用 --- */
    'files'?: string[];
}

// -------------------------
// -------- dom lib --------
// -------------------------

/** --- 方向类型，从左上开始 --- */
export type TDomBorder = 'lt' | 't' | 'tr' | 'r' | 'rb' | 'b' | 'bl' | 'l' | '';

export type TDomBorderCustom = TDomBorder | { 'left': number; 'top'?: number; 'width': number; 'height'?: number; };

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
    'move'?: (ox: number, oy: number, x: number, y: number, border: TDomBorder, dir: 'top' | 'right' | 'bottom' | 'left', e: MouseEvent | TouchEvent) => void;
    'up'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
    'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
    'borderIn'?: (x: number, y: number, border: TDomBorder, e: MouseEvent | TouchEvent) => void;
    'borderOut'?: () => void;
}

/** --- 绑定拖动返回值 --- */
export interface IBindMoveResult {
    'left': number;
    'top': number;
    'right': number;
    'bottom': number;
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
    'border': TDomBorder;
    'start'?: (x: number, y: number) => any;
    'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TDomBorder) => void;
    'end'?: () => void;
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

// --------------------------
// -------- form lib --------
// --------------------------

export type AbstractForm = import('../dist/lib/form').AbstractForm;

/** --- 运行时 task 中的 form 对象 --- */
export interface IForm {
    'id': number;
    'vapp': IVApp;
    'vroot': IVue;
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

/** --- 窗体创建选项 --- */
export interface IFormCreateOptions {
    'code'?: IFormCreateCode;
    'layout': string;
    'style'?: string;

    /** --- 当前窗体的基准路径，不以 / 结尾，仅用作传值，App 内无法填写 --- */
    'path'?: string;
    /** --- 传递到 onMounted 的数据 --- */
    'data'?: Record<string, any>;
    /** --- APP 内无法填写 --- */
    'taskId'?: number;
}

/** --- 窗体的 code 参数 --- */
export interface IFormCreateCode {
    'data'?: Record<string, any>;
    'methods'?: Record<string, any>;
    'computed'?: Record<string, {
        'get'?: any;
        'set'?: any;
    }>;
    'beforeCreate'?: any;
    'created'?: any;
    'beforeMount'?: any;
    'mounted'?: any;
    'beforeUpdate'?: any;
    'updated'?: any;
    'beforeUnmount'?: any;
    'unmounted'?: any;
}

// --------------------------
// --------- fs lib ---------
// --------------------------

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

// --------------------------
// -------- task lib --------
// --------------------------

/** --- 运行中的任务对象 --- */
export interface ITask {
    'id': number;
    'app': IApp;
    'class': import('../dist/lib/core').AbstractApp;
    'config': IAppConfig;
    'customTheme': boolean;
    'locale': {
        'lang': string;
        'data': Record<string, Record<string, string>>;
    };
    /** --- 当前 app 自己的完整路径，如 /x/xx.cga，或 /x/x，末尾不含 / --- */
    'path': string;
    /** --- 当前 app 运行路径，末尾不含 / --- */
    'current': string;

    /** --- 运行时的一些参数 --- */
    'runtime': {
        /** --- 独占窗体序列 --- */
        'dialogFormIds': number[];
        /** --- 已申请的权限列表 --- */
        'permissions': Record<string, any>;
    };
    /** --- 窗体对象列表 --- */
    'forms': Record<string, IForm>;
    /** --- 已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用 --- */
    'controls': Record<string, {
        'layout': string;

        'props': Record<string, any>;
        'data': Record<string, any>;
        'access': Record<string, any>;
        'methods': Record<string, any>;
        'computed': Record<string, any>;
    }>;
    /** --- 任务中的 timer 列表 --- */
    'timers': Record<string, number>;
    /** --- 用于初始化 control 时 invoke 用 --- */
    'invoke'?: Record<string, any>;
}

/** --- 系统任务信息 --- */
export interface ISystemTaskInfo {
    'taskId': number;
    'formId': number;
    'length': number;
}

export interface ITaskRunOptions {
    'icon'?: string;
    /** --- 加载进度回调 --- */
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
    /** --- 显示 notify 窗口 --- */
    'notify'?: boolean;
    /** --- 设置为主应用，整个运行时只能设置一次，因此 App 下不可能被设置 --- */
    'main'?: boolean;
    /** --- native 下窗体与实体窗体大小同步，App 模式下无法设置 --- */
    'sync'?: boolean;
    /** --- 所属任务，App 模式无法设置 --- */
    'taskId'?: number;
    /** --- 不禁止某些浏览器对象，App 模式下无法设置 --- */
    'unblock'?: string[];
}

export interface ICreateTimerOptions {
    'taskId'?: number;
    'formId'?: number;

    'immediate'?: boolean;
    'count'?: number;
}

/** --- Task 的简略情况，通常在 list 当中 --- */
export interface ITaskInfo {
    'name': string;
    'locale': string;
    'customTheme': boolean;
    'formCount': number;
    'icon': string;
    'path': string;
    'current': string;
}

// ---------------------------
// -------- theme lib --------
// ---------------------------

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

// --------------------------
// -------- tool lib --------
// --------------------------

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

// -------------------------
// -------- zip lib --------
// -------------------------

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

// --- form ---

/** --- Dialog 选项 --- */
export interface IFormDialogOptions {
    /** --- 当前的 taskId，App 模式下无效 --- */
    'taskId'?: number;

    'title'?: string;
    'content': string;
    'buttons'?: string[];
    'direction'?: 'h' | 'v';

    'select'?: (e: Event, button: string) => void;
}

/** --- Confirm 选项 --- */
export interface IFormConfirmOptions {
    /** --- 当前的 taskId，App 模式下无效 --- */
    'taskId'?: number;

    'content': string;
    'cancel'?: boolean;
}

export interface IFormSetTopMostOptions {
    /** --- 当前 taskId，App 模式下无效 --- */
    'taskId'?: number;
    /** --- 当前的 formId，App 模式下留空为当前窗体 --- */
    'formId'?: number;
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

// -------------------------
// ---------- vue ----------
// -------------------------

export interface IVueObject {
    createApp(opt: any): IVApp;
    ref<T extends number | string>(obj: T): { 'value': T; };
    reactive<T>(obj: T): T;
    watch(
        v: any,
        cb: (n: any, o: any) => void | Promise<void>,
        opt: Record<string, string | boolean>
    ): void;
    h(tag: string, props?: Record<string, any> | any[], list?: any[]): any;
}

export type IVueOptionMergeFunction = (to: unknown, from: unknown, instance: IVue) => any;

export interface IVueConfig {
    errorHandler?(err: unknown, instance: IVue | null, info: string): void;
    'globalProperties': Record<string, any>;
    isCustomElement(tag: string): boolean;
    'optionMergeStrategies': Record<string, IVueOptionMergeFunction>;
    'performance': boolean;
    warnHandler?(msg: string, instance: IVue | null, trace: string): void;
}

export interface IVApp {
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
        'default': undefined | ((o?: any) => IVNode[]);
        [key: string]: undefined | ((o?: any) => IVNode[]);
    };
    '$watch': (o: any, cb: (n: any, o: any) => void) => void;

    [key: string]: any;
}

export interface IVNode {
    'children': {
        'default': undefined | (() => IVNode[]);
        [key: string]: undefined | (() => IVNode[]);
    } & IVNode[];
    'props': Record<string, any>;
    'type': symbol | Record<string, any>;

    [key: string]: any;
}
