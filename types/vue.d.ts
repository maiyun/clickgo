declare let Vue: {
    createApp(opt: any): IVueApp;
    ref<T extends number | string>(obj: T): { 'value': T; };
    reactive<T>(obj: T): T;
};

type IVueOptionMergeFunction = (to: unknown, from: unknown, instance: IVue) => any;

interface IVueConfig {
    errorHandler?(err: unknown, instance: IVue | null, info: string): void;
    'globalProperties': Record<string, any>;
    isCustomElement(tag: string): boolean;
    isNativeTag?(tag: string): boolean;
    'optionMergeStrategies': Record<string, IVueOptionMergeFunction>;
    'performance': boolean;
    warnHandler?(msg: string, instance: IVue | null, trace: string): void;
}

interface IVueApp {
    component(name: string): any | undefined;
    component(name: string, config: any): this;
    'config': IVueConfig;
    directive(name: string): any | undefined;
    directive(name: string, config: any): this;
    mixin(mixin: any): this;
    mount(rootContainer: HTMLElement | string): IVue;
    provide<T>(key: string, value: T): this;
    unmount(): void;
    use(plugin: Plugin, ...options: any[]): this;
    'version': string;

    '_container': HTMLElement;
}

interface IVue {
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

interface IVueVNode {
    'children': {
        'default': undefined | (() => IVueVNode[]);
        [key: string]: undefined | (() => IVueVNode[]);
    } & IVueVNode[];
    'props': Record<string, any>;
    'type': symbol | Record<string, any>;

    [key: string]: any;
}

interface IVueForm extends IVue {
    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /** --- 当前窗体是否有焦点 --- */
    'cgFocus': boolean;
    /** --- 当前窗体的路径 --- */
    'cgPath': string;
    /** --- 当前的 local name --- */
    'cgLocal': string;
    l(key: string): string;
    cgCreateForm(paramOpt?: string | ICGFormCreateOptions & { 'mask'?: boolean; }): Promise<void>;
    cgCloseForm(): void;
    cgBindFormDrag(e: MouseEvent | TouchEvent): void;
    cgSetSystemEventListener(name: TCGGlobalEvent, func: (...any: any) => void | Promise<void>): void;
    cgRemoveSystemEventListener(name: TCGGlobalEvent): void;
    cgDialog(opt: string | ICGFormDialog): Promise<string>;
    cgConfirm(content: string, cancel?: boolean): Promise<boolean | number>;
    cgGetFile(path: string): Promise<Blob | string | null>;
    cgGetObjectUrl(file: string): string | null;
    cgGetDataUrl(file: string): Promise<string | null>;
    cgLoadTheme(path: string): Promise<boolean>;
    cgRemoveTheme(path: string): Promise<void>;
    cgSetTheme(path: string): Promise<void>;
    cgClearTheme(): Promise<void>;
    cgSetGlobalTheme(path: string | Blob): Promise<void>;
    cgClearGlobalTheme(): Promise<void>;
    cgSetTopMost(top: boolean): void;
    cgFlash(): void;
    cgShow(): void;
    cgHide(): void;
    cgLoadLocal(name: string, path: string): Promise<boolean>;
    cgSetLocal(name: string, path: string): Promise<boolean>;
    cgClearLocal(): void;
    cgLoadLocalData(name: string, data: Record<string, any>, pre?: string): void;
    cgSetLocalName(name: string): void;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
}

interface IVueControl extends IVue {
    '$parent': IVueControl | null;

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
    /** --- 是否是安全控件 --- */
    'cgSafe': boolean;
    /** --- 是否是嵌套组件 --- */
    'cgNest': boolean;
    /** --- 自己是不是就是 pop 层 --- */
    'cgSelfIsPopLayer': boolean;
    /** --- 自己下面的正在显示的含有 pop 层的 control --- */
    'cgChildPopItemShowing': IVueControl | undefined;
    /** --- 自己的 pop 层的对象 --- */
    'cgSelfPop': IVueControl | undefined;
    /** --- 当前的 selfPop 是否显示 --- */
    'cgSelfPopOpen': boolean;
    /** --- pop 最终的显示位置 --- */
    'cgPopPosition': {
        'left': string;
        'top': string;
        'zIndex': string;
        [key: string]: string;
    };
    /** --- 当前是否是真实 hover 状态 --- */
    'cgRealHover': boolean;
    /** --- 当前是否是 active 状态 --- */
    'cgActive': boolean;
    /** --- 当前是否是 hover 状态（move 模式下一定返回 false） --- */
    'cgHover': boolean;
    /** --- 组件宽度 --- */
    'cgWidthPx': string | undefined;
    /** ---组件高度 --- */
    'cgHeightPx': string | undefined;
    /** --- 当前 task 的 local 值 --- */
    'cgLocal': string;
    /** --- 上级最近的一层的 pop layer 组件 --- */
    'cgParentPopLayer': IVueControl;
    /** --- 获取语言内容 --- */
    l(key: string, data?: Record<string, Record<string, string>>): string;
    /**
     * --- 判断当前的 mosedown、click 事件是否是 touch 触发的，如果当前就是 touch 则直接返回 false ---
     * @param e 鼠标或触摸事件对象
     */
    cgIsMouseAlsoTouchEvent(e: MouseEvent | TouchEvent): boolean;
    /**
     * --- 控件默认的 down 事件绑定 ---
     * @param e 鼠标或触摸事件对象
     */
    cgDown(e: MouseEvent | TouchEvent): void;
    /**
     * --- 控件默认的 up 事件绑定 ---
     * @param e 鼠标或触摸事件对象
     */
    cgUp(e: MouseEvent | TouchEvent): void;
    /**
     * --- 控件默认的 cancel（up） 事件绑定 ---
     * @param e 触摸事件对象
     */
    cgCancel(e: TouchEvent): void;
    /**
     * --- 鼠标移入事件绑定，有 touch 事件的则不会触发 emit ---
     * @param e 鼠标事件对象
     */
    cgEnter(e: MouseEvent): void;
    /**
     * --- 鼠标移出事件绑定，有 touch 事件的则不会触发 emit ---
     * @param e 鼠标事件对象
     */
    cgLeave(e: MouseEvent): void;
    /**
     * --- 控件默认的 tap 事件绑定 ---
     * @param e 鼠标、触摸或键盘事件对象
     */
    cgTap(e: MouseEvent | TouchEvent | KeyboardEvent): void;
    /**
     * --- 控件默认的 dblclick 事件绑定 ---
     * @param e 鼠标事件对象
     */
    cgDblclick(e: MouseEvent): void;
    /**
     * --- 获取文件 blob 或 string 对象 ---
     * @param file 文件路径
     */
    cgGetFile(this: IVue, path: string): Promise<Blob | string | null>;
    /**
     * --- 根据文件路径获取 object url，不支持 /clickgo/ 路径 ---
     * @param file 当前 task 文件路径
     */
    cgGetObjectUrl(file: string): string | null;
    /**
     * --- 根据路径获取当前应用的文件 dataurl 字符串 ---
     * @param file  文件路径
     */
    cgGetDataUrl(file: string): Promise<string | null>;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
    /**
     * --- 获取 slot 的 list ---
     * @param name slot name
     */
    cgSlots(name?: string): IVueVNode[];
    /**
     * --- 获取正常非 nest 上级 ---
     */
    cgParent(): IVueControl | null;
    /**
     * --- 根据 control name 查询上级序列 ---
     * @param controlName 控件名称
     */
    cgFindParent(controlName: string): IVueControl | null;
    /**
     * --- 显示 pop ---
     * @param direction 要显示方向（以 $el 为准的 h 水平和 v 垂直）或坐标
     * @param size 显示的 pop 定义自定义宽度，可省略
     */
    cgShowPop(direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt?: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; }): void;
    /**
     * --- 隐藏 pop ---
     */
    cgHidePop(): void;
}
