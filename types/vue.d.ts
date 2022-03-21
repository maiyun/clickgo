declare let Vue: {
    createApp(opt: any): IVueApp;
    ref<T extends number | string>(obj: T): { 'value': T; };
    reactive<T>(obj: T): T;
    watch(v: any, cb: (n: any, o: any) => void | Promise<void>, opt: Record<string, string | boolean>): void;
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

interface IVForm extends IVue {
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
    /** --- 当前的 local name --- */
    'cgLocal': string;
    /** --- 获取语言内容 --- */
    'l': (key: string) => string;
    cgCreateForm(paramOpt?: string | ICGFormCreateOptions & { 'mask'?: boolean; }): Promise<number>;
    cgClose(): void;
    cgMax(): void;
    cgMin(): void;
    cgBindFormDrag(e: MouseEvent | TouchEvent): void;
    cgBindFormResize(e: MouseEvent | TouchEvent, border: TCGBorder): void;
    cgSetSystemEventListener(name: 'screenResize', func: () => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'configChanged', func: (n: TCGCoreConfigName, v: string | boolean | null) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'error', func: (taskId: number, formId: number, error: Error, info: string) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formCreated' | 'formRemoved', func: (taskId: number, formId: number, title: string, icon: string) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formTitleChanged' | 'formIconChanged', func: (taskId: number, formId: number, text: string) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formStateMinChanged' | 'formStateMaxChanged' | 'formShowChanged', func: (taskId: number, formId: number, state: boolean) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formFocused' | 'formBlurred' | 'formFlash', func: (taskId: number, formId: number) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'taskStarted' | 'taskEnded', func: (taskId: number) => void | Promise<void>): void;
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
    cgClearLocalName(): void;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
    /**
     * --- 创建 timer ---
     * @param fun 执行的函数
     * @param delay 间隔时间
     * @param opt 选项
     */
    cgCreateTimer(fun: () => void | Promise<void>, delay: number, opt?: {
        'immediate'?: boolean;
        'scope'?: 'form' | 'task';
        'count'?: number;
    }): number;
    /**
     * --- 移除 timer ---
     * @param timer 要移除的 timer number ---
     */
    cgRemoveTimer(timer: number): void;
    /**
     * --- sleep 一段时间再执行 ---
     * @param fun 执行的函数
     * @param delay 间隔时间
     */
    cgSleep(fun: () => void | Promise<void>, delay: number): number;
    /**
     * --- 创建 frame listener ---
     * @param fun 执行的函数
     * @param opt 选项
     */
    cgAddFrameListener(fun: () => void | Promise<void>, opt?: { 'scope'?: 'form' | 'task'; 'count'?: number; }): number;
    /**
     * --- 移除 frame listene ---
     * @param ft timer ---
     */
    cgRemoveFrameListener(ft: number): void;
    /**
     * --- 检测事件是否可被执行 ---
     * @param e 事件
     */
    cgAllowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean;
}

interface IVControl extends IVue {
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
    /** --- 当前 task 的 local 值 --- */
    'cgLocal': string;
    /** --- 获取语言内容 --- */
    'l': (key: string, data?: Record<string, Record<string, string>>) => string;
    /** --- 根据 control name 来寻找上级 --- */
    'cgParentByName': (controlName: string) => IVControl;
    /**
     * --- 关闭窗体 ---
     */
    cgClose(): void;
    /**
     * --- 改变窗体大小---
     * @param e mouse 或者 touch
     * @param border border 方向
     */
    cgBindFormResize(e: MouseEvent | TouchEvent, border: TCGBorder): void;
    /**
     * --- 控件默认的 up 事件绑定 ---
     * @param e 鼠标或触摸事件对象
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
     * --- 创建 timer ---
     * @param fun 执行的函数
     * @param delay 间隔时间
     * @param opt 选项
     */
    cgCreateTimer(fun: () => void | Promise<void>, delay: number, opt?: {
        'immediate'?: boolean;
        'scope'?: 'form' | 'task';
        'count'?: number;
    }): number;
    /**
     * --- 移除 timer ---
     * @param timer 要移除的 timer number ---
     */
    cgRemoveTimer(timer: number): void;
    /**
     * --- sleep 一段时间再执行 ---
     * @param fun 执行的函数
     * @param delay 间隔时间
     */
    cgSleep(fun: () => void | Promise<void>, delay: number): number;
    /**
     * --- 创建 frame listener ---
     * @param fun 执行的函数
     * @param opt 选项
     */
    cgAddFrameListener(fun: () => void | Promise<void>, opt?: { 'scope'?: 'form' | 'task'; 'count'?: number; }): number;
    /**
     * --- 移除 frame listene ---
     * @param ft timer ---
     */
    cgRemoveFrameListener(ft: number): void;
    /**
     * --- 检测事件是否可被执行 ---
     * @param e 事件
     */
    cgAllowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean;

}
