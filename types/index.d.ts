export * as control from '../dist/lib/control';
export * as core from '../dist/lib/core';
export * as dom from '../dist/lib/dom';
export * as form from '../dist/lib/form';
export * as fs from '../dist/lib/fs';
export * as native from '../dist/lib/native';
export * as storage from '../dist/lib/storage';
export * as task from '../dist/lib/task';
export * as theme from '../dist/lib/theme';
export * as tool from '../dist/lib/tool';
export * as zip from '../dist/lib/zip';

export function getVersion(): string;
export function isNative(): boolean;
export function getPlatform(): NodeJS.Platform | 'web';
export function isImmersion(): boolean;
export function hasFrame(): boolean;
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
    'owidth': number;
    'oheight': number;
}

/** --- 全局事件类型 --- */
export type TGlobalEvent = 'error' | 'screenResize' | 'configChanged' | 'formCreated' | 'formRemoved' | 'formTitleChanged' | 'formIconChanged' | 'formStateMinChanged' | 'formStateMaxChanged' | 'formShowChanged' | 'formFocused' | 'formBlurred' | 'formFlash' | 'formShowInSystemTaskChange' | 'formHashChange' | 'taskStarted' | 'taskEnded' | 'launcherFolderNameChanged' | 'hashChanged';

/** --- 现场下载 app 的参数 --- */
export interface ICoreFetchAppOptions {
    'notifyId'?: number;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
    'cache'?: string;
}

/** --- 应用包解包后对象 --- */
export interface IApp {
    'type': 'app';
    /** --- 控件对象配置文件 --- */
    'config': IAppConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
    /** --- 应用图标 --- */
    'icon': string;
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
    'permissions'?: string[];
    /** --- 将自动加载的语言包，path: lang --- */
    'locales'?: Record<string, string>;
    /** --- 全局样式，不带扩展名，系统会在末尾添加 .css --- */
    'style'?: string;
    /** --- 图标路径，需包含扩展名 --- */
    'icon'?: string;

    /** --- 将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略 --- */
    'files'?: string[];
    /** --- import 的目录映射关系 --- */
    'map'?: Record<string, string>;
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
export interface IBindDownOptions<T extends MouseEvent | TouchEvent> {
    'down'?: (e: T) => void;
    'start'?: (e: T) => any;
    'move'?: (
        e: T,
        dir: 'top' | 'right' | 'bottom' | 'left'
    ) => any;
    'up'?: (e: T) => void;
    'end'?: (e: T) => void;
}

/** --- 绑定拖动选项 move 回调的回调参数 --- */
export interface IBindMoveMoveOptions {
    'ox': number;
    'oy': number;
    'x': number;
    'y': number;
    'border': TDomBorder;
    'inBorder': {
        'top': boolean;
        'right': boolean;
        'bottom': boolean;
        'left': boolean;
    };
    'dir': 'top' | 'right' | 'bottom' | 'left';
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
    'cursor'?: string;
    'start'?: (x: number, y: number) => any;
    'move'?: (e: MouseEvent | TouchEvent, opt: IBindMoveMoveOptions) => void;
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
    'handler': () => void | Promise<void>;
    'taskId'?: number;
}

/** --- 监视变化中的元素 --- */
export interface IWatchItem {
    'el': HTMLElement;
    'mo': MutationObserver;
    'taskId'?: number;
}

/** --- 获取当前正在监视中的 property 和 style 的元素信息 --- */
export interface IGetWatchInfoResult {
    'formId': number;
    'default': Record<string, {
        'style': {
            'list': string[];
            'count': number;
        };
        'property': {
            'list': string[];
            'count': number;
        };
    }>;
    'panels': Record<string,
        Record<string, {
            'style': {
                'list': string[];
                'count': number;
            };
            'property': {
                'list': string[];
                'count': number;
            };
        }>
    >;
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
    /** --- 是否已经执行过了关闭窗体方法，此处加判断为了防止重复执行 close 导致的 bug --- */
    'closed': boolean;
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
    'showInSystemTask': boolean;
}

// --------------------------
// --------- fs lib ---------
// --------------------------

export interface IMountHandler {
    /** --- 挂载时间，无需设置 --- */
    'date'?: Date;
    getContent?: (path: string, options?: BufferEncoding | {
        'encoding'?: BufferEncoding;
        'start'?: number;
        'end'?: number;
        'progress'?: (loaded: number, total: number) => void | Promise<void>;
        'cache'?: string;
    }) => Blob | string | null | Promise<Blob | string | null>;
    putContent?: (path: string, data: string | Blob, options?: {
        'encoding'?: BufferEncoding | null;
        'mode'?: string | number;
        'flag'?: string | number;
    }) => boolean | Promise<boolean>;
    readLink?: (path: string, encoding?: BufferEncoding) => string | null | Promise<string | null>;
    symlink?: (filePath: string, linkPath: string, type?: 'dir' | 'file' | 'junction') => boolean | Promise<boolean>;
    unlink?: (path: string) => boolean | Promise<boolean>;
    stats?: (path: string) => IStats | null | Promise<IStats | null>;
    mkdir?: (path: string, mode?: number) => boolean | Promise<boolean>;
    rmdir?: (path: string) => boolean | Promise<boolean>;
    chmod?: (path: string, mod: string | number) => boolean | Promise<boolean>;
    rename?: (oldPath: string, newPath: string) => boolean | Promise<boolean>;
    readDir?: (path: string, encoding?: BufferEncoding) => IDirent[] | Promise<IDirent[]>;
    copyFile?: (src: string, dest: string) => boolean | Promise<boolean>;
}

/** --- 文件/文件夹信息对象 --- */
export interface IStats {
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    'size': number;
    'blksize': number;
    'atimeMs': number;
    'mtimeMs': number;
    'ctimeMs': number;
    'birthtimeMs': number;
    'atime': Date;
    'mtime': Date;
    'ctime': Date;
    'birthtime': Date;
}

/** --- 目录下项目 ---  */
export interface IDirent {
    isFile(): boolean;
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    'name': string;
}

// --------------------------
// -------- task lib --------
// --------------------------

/** --- 运行中的任务对象 --- */
export interface ITask {
    'id': number;
    'app': IApp;
    'class': import('../dist/lib/core').AbstractApp;
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
        'permissions': string[];
    };
    /** --- 窗体对象列表 --- */
    'forms': Record<string, IForm>;
    /** --- 已解析的控件处理后的对象，任务启动时解析，窗体创建时部分复用 --- */
    'controls': Record<string, {
        'layout': string;

        'files': Record<string, Blob | string>;
        'props': Record<string, any>;
        'emits': Record<string, any>;
        'data': Record<string, any>;
        'access': Record<string, any>;
        'methods': Record<string, any>;
        'computed': Record<string, any>;
    }>;
    /** --- 任务中的 timer 列表 --- */
    'timers': Record<string, number>;
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
    /** --- 初始化进度回调 --- */
    'initProgress'?: (state: string) => void | Promise<void>;
    /** --- 显示 notify 窗口 --- */
    'notify'?: boolean;
    /** --- 不禁止某些浏览器对象，App 模式下仅能设置基任务中已经 unblock 的值 --- */
    'unblock'?: string[];
    /** --- 直接赋予此任务相应权限，App 模式下有 "root" 权限的应用才能设置 --- */
    'permissions'?: string[];
    /** --- 给 task 传值 --- */
    'data'?: Record<string, any>;
    /** --- 执行文件的基路径，一般在传入 APP 包时使用，以 .cga 结尾或以 / 结尾的路径 --- */
    'path'?: string;
    /** --- 是否禁用缓存加载，默认禁用 --- */
    'cache'?: string;
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
    'credentials'?: boolean;
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
    'title'?: string;
    'content': string;
    'buttons'?: string[];
    'autoDialogResult'?: boolean;

    'direction'?: 'h' | 'v';
    'gutter'?: number | string;

    /** --- 传值，需要用 data.x 读取 --- */
    'data'?: Record<string, any>;
    /** --- 传值，需要用 methods.x 读取 --- */
    'methods'?: Record<string, () => any>;
    /** --- 样式表 --- */
    'style'?: string;
    /** --- 路径基，以 / 结束或文件路径则以文件的基路径为准，可留空 --- */
    'path'?: string;

    'select'?: (e: Event, button: string) => void;

    /** --- 当前的 taskId，App 模式下无效 --- */
    'taskId'?: number;
}

/** --- Confirm 选项 --- */
export interface IFormConfirmOptions {
    /** --- 当前的 taskId，App 模式下无效 --- */
    'taskId'?: number;

    'title'?: string;
    'content': string;
    'cancel'?: boolean;
}

/** --- Prompt 选项 --- */
export interface IFormPromptOptions {
    /** --- 当前的 taskId，App 模式下无效 --- */
    'taskId'?: number;

    'title'?: string;
    'content': string;
    'text'?: string;
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
    'title'?: string;
    'content'?: string;
    'icon'?: string | null;
    'timeout'?: number;
    'type'?: 'primary' | 'info' | 'warning' | 'danger' | 'progress';
    'progress'?: boolean;
}

// --- Custom Event Control ---

interface ICustomEvent {
    'go': boolean;
    preventDefault: () => void;
}

// --- AbstractPanel ---

export interface IAbstractPanelShowEvent {
    'detail': {
        'data': Record<string, any>;
        /** --- 是否是 nav 模式 --- */
        'nav': boolean;
        /** --- 仅 nav 联动时有效，代表是前进还是回退 --- */
        'action': 'forword' | 'back';
        /** --- 仅 nav 联动时有效，代表上一个的 formHash 的值 --- */
        'previous': string;
        /** --- 仅 nav 联动时有效，代表本次 show 的时候 qs 是否发生了变化 --- */
        'qsChange': boolean;
    }
}

// --- Check Control ---

export interface ICheckChangeEvent extends ICustomEvent {
    'detail': {
        'value': boolean;
        'indeterminate': boolean;
    };
}

export interface ICheckChangedEvent {
    'detail': {
        'value': boolean;
        'indeterminate': boolean;
    };
}

// --- Text Control ---

export interface ITextBeforechangeEvent extends ICustomEvent {
    'detail': {
        'value': string;
        'change'?: string;
    }
}

// --- Form Control ---

export interface IFormCloseEvent extends ICustomEvent {
    'detail': {
        'event': MouseEvent;
    }
}

export interface IFormMaxEvent {
    'detail': {
        'event': MouseEvent | TouchEvent | null;
        'action': 'click' | 'move';
        /** --- 当前是否时最大化状态 --- */
        'max': boolean;
        /** --- 最大化之前的窗体位置 --- */
        'history': {
            'width': number;
            'height': number;
            'left': number;
            'top': number;
        } | null
    }
}

export interface IFormMinEvent {
    'detail': {
        'event': MouseEvent | TouchEvent | null;
        'action': 'click' | 'method';
        /** --- 当前是否时最小化状态 --- */
        'min': boolean;
        /** --- 最小化之前的窗体位置 --- */
        'history': {
            'width': number;
            'height': number;
            'left': number;
            'top': number;
        } | null
    }
}

// --- Greatlist Control ---

export interface IGreatlistChangeEvent extends ICustomEvent {
    'detail': {
        'value': number[];
    };
}

export interface IGreatlistChangedEvent {
    'detail': {
        'value': number[];
    };
}

export interface IGreatlistRemoveEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': number;
    };
}

export interface IGreatlistAddEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': number;
    };
}

export interface IGreatlistItemclickedEvent {
    'detail': {
        'event': MouseEvent | TouchEvent;
        'value': number;
        'arrow': boolean;
    };
}

// --- Greatselect Control ---

export interface IGreatselectChangeEvent extends ICustomEvent {
    'detail': {
        'value': number[];
    };
}

export interface IGreatselectChangedEvent {
    'detail': {
        'value': number[];
    };
}

export interface IGreatselectRemoveEvent extends ICustomEvent {
    'detail': {
        'value': number;
    };
}

export interface IGreatselectAddEvent extends ICustomEvent {
    'detail': {
        'value': number;
    };
}

// --- Iconview Control ---

export interface IIconviewItemclickedEvent {
    'detail': {
        'event': MouseEvent | TouchEvent;
        'value': number;
    };
}

export interface IIconviewOpenEvent {
    'detail': {
        'value': number[];
    };
}

export interface IIconviewDropEvent {
    'detail': {
        'self': boolean;
        'from': Array<{
            'index': number;
            'type': 0 | 1 | -1 | undefined;
            'path': string;
        }>;
        'to': {
            'index': number;
            'type': 0 | 1 | -1 | undefined;
            'path': string;
        };
    };
}

export interface IIconviewSelectEvent {
    'detail': {
        'area': {
            'x': number;
            'y': number;
            'width': number;
            'height': number;
            'shift': boolean;
            'ctrl': boolean;
            'start': number;
            'end': number;
            'empty': boolean;
        };
    };
}

// --- Levelselect Control ---

export interface ILevelselectLevelEvent {
    'detail': {
        'list': Array<{
            'label': string;
            'value': string;
        }>;
        'values': string[];
        'labels': string[];
    };
}

// --- Checklist Control ---

export interface IChecklistRemoveEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

export interface IChecklistAddEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

export interface IChecklistItemclickedEvent {
    'detail': {
        'event': MouseEvent | TouchEvent;
        'value': string;
        'arrow': boolean;
    };
}

// --- List Control ---

export interface IListChangeEvent extends ICustomEvent {
    'detail': {
        'value': string[];
    };
}

export interface IListChangedEvent {
    'detail': {
        'value': string[];
    };
}

export interface IListRemoveEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

export interface IListAddEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

export interface IListItemclickedEvent {
    'detail': {
        'event': MouseEvent | TouchEvent;
        'value': string;
        'arrow': boolean;
    };
}

// --- Nav Item ---

export interface INavItemSelectEvent extends ICustomEvent {
    'detail': {
        'name': string;
        'selected': string;
    };
}

// --- Panel Item ---

export interface IPanelGoEvent extends ICustomEvent {
    'detail': {
        'from': string;
        'to': string;
    };
}

export interface IPanelWentEvent {
    'detail': {
        'result': boolean;
        'from': string;
        'to': string;
    };
}

// --- Radio Control ---

export interface IRadioChangeEvent extends ICustomEvent {
    'detail': {
        /** --- 设定的值 --- */
        'value': string;
        /** --- 选中的值 --- */
        'selected': string;
    };
}

// --- Select Control ---

export interface ISelectAddEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

export interface ISelectRemoveEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
        'mode': 'backspace' | 'tag' | 'list';
    };
}

export interface ISelectAddedEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

export interface ISelectRemovedEvent {
    'detail': {
        'index': number;
        'value': string;
        'mode': 'backspace' | 'tag' | 'list';
    };
}

export interface ISelectChangeEvent extends ICustomEvent {
    'detail': {
        'value': string[];
    };
}

export interface ISelectChangedEvent {
    'detail': {
        'value': string[];
    };
}

export interface ISelectTagclickEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

// --- Switch Control ---

export interface ISwitchChangeEvent extends ICustomEvent {
    'detail': {
        'value': boolean;
    };
}

// --- Tab Control ---

export interface ITabCloseEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'value': string;
    };
}

// --- Table Control ---

export interface ITableSortEvent extends ICustomEvent {
    'detail': {
        'index': number;
        'label': string;
        'sort': 'desc' | 'asc';
    };
}

// --- Tuieditor Control ---

export interface ITuieditorImguploadEvent {
    'detail': {
        'file': Blob;
        'callback': (url: string, opt?: {
            'alt'?: string;
            'width'?: number;
            'height'?: number;
            'align'?: string;
        }) => void | Promise<void>;
    };
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
