declare let Vue: {
    createApp(opt: any): IVueApp;
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
    '$slots': Record<string, IVueVNode[]>;
    '$watch': (o: any, cb: (n: any, o: any) => void) => void;

    [key: string]: any;
}

interface IVueVNode {
    'children': IVueVNode[];
    'componentInstance': IVue;
    'componentOptions': {
        'tag': string;
        [name: string]: any;
    };
    'context': IVue;

    [key: string]: any;
}

interface IVueForm extends IVue {
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(this: IVueControl, cla: any): string;
}

interface IVueControl extends IVue {
    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /**
     * --- 阻止当前事件冒泡 ---
     * @param e 鼠标或触摸事件对象
     */
    cgStopPropagation(this: IVue, e: MouseEvent | TouchEvent): void;
    /**
     * --- 控件默认的 down 事件绑定 ---
     * @param e 鼠标或触摸事件对象
     */
    cgDown(this: IVue, e?: MouseEvent | TouchEvent): void;
    /**
     * --- 控件默认的 tap 事件绑定 ---
     * @param e 鼠标、触摸或键盘事件对象
     */
    cgTap(this: IVue, e: MouseEvent | TouchEvent | KeyboardEvent): void;
    /**
     * --- 控件默认的 dblclick 事件绑定 ---
     * @param e 鼠标事件对象
     */
    cgDblclick(this: IVue, e: MouseEvent): void;
    /**
     * --- 根据路径获取当前应用的文件 blob 对象 ---
     * @param file 文件路径
     */
    cgGetBlob(this: IVue, file: string): Blob | null;
    /**
     * --- 根据路径获取当前应用的文件 dataurl 字符串 ---
     * @param file  文件路径
     */
    cgGetDataUrl(this: IVueControl, file: string): Promise<string | null>;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(this: IVueControl, cla: any): string;
}
