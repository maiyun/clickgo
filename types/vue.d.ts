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
    /** --- 当前环境是否有 touch 事件 --- */
    'cgHasTouch': boolean;
    cgCreateForm(paramOpt?: string | ICGFormCreateOptions & { 'mask'?: boolean; }): Promise<void>;
    cgCloseForm(): void;
    cgBindFormDrag(e: MouseEvent | TouchEvent): void;
    cgSetSystemEventListener(name: TCGGlobalEvent, func: any): void;
    cgRemoveSystemEventListener(name: TCGGlobalEvent): void;
    cgDialog(opt: string | ICGFormDialog): Promise<string>;
    cgGetBlob(path: string): Promise<Blob | null>;
    cgGetObjectUrl(file: string): string | null;
    cgGetDataUrl(file: string): Promise<string | null>;
    cgLoadTheme(path: string): Promise<void>;
    cgRemoveTheme(path: string): Promise<void>;
    cgSetTheme(path: string): Promise<void>;
    cgClearTheme(): Promise<void>;
    cgSetGlobalTheme(path: string | Blob): Promise<void>;
    cgClearGlobalTheme(): Promise<void>;
    cgSetTopMost(top: boolean): void;
    cgFlash(): void;
    cgShow(): void;
    cgHide(): void;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
}

interface IVueControl extends IVue {
    '$parent': IVueControl | null;

    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /** --- 控件名 --- */
    'controlName': string;
    /** --- 当前窗体是否有焦点 --- */
    'cgFocus': boolean;
    /** --- 当前环境是否有 touch 事件 --- */
    'cgHasTouch': boolean;
    /** --- 当前是否是 hover 状态（move 模式下一定返回 false） --- */
    'cgHover': boolean;
    /** --- 当前是否是真实 hover 状态 --- */
    'cgRealHover': boolean;
    /** --- 当前是否是 active 状态 --- */
    'cgActive': boolean;
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
     * --- 根据路径获取当前应用的文件 blob 对象 ---
     * @param file 文件路径
     */
    cgGetBlob(this: IVue, path: string): Promise<Blob | null>;
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
     * 根据 control name 查询上级序列 ---
     * @param controlName 控件名称
     */
    cgFindParent(controlName: string): IVueControl | null;
}
