declare let Vue: {
    new(opt: any): IVue;

    /** --- 注册或获取全局组件 --- */
    component(name: string, opt?: any): any;
    /** --- 安装 Vue.js 插件 --- */
    use(obj: any): any;
    /** --- 使用基础 Vue 构造器，创建一个“子类”。 --- */
    extend(opt: any): any;

    'config': any;

    [key: string]: any;
};

interface IVue {
    $el: HTMLElement;
    $refs: Record<string, HTMLElement & IVue>;
    $data: any;
    $props: any;
    $slots: {
        [name: string]: IVNode[];
    };
    $parent: IVue;
    $children: IVue[];
    $watch: any;

    $emit(event: string, ...args: any[]): IVue;
    $nextTick(callback: (this: IVue) => void): void;
    $nextTick(): Promise<void>;
    $mount(c: string): any;

    _isVue: boolean;

    [key: string]: any;
}

interface IVNode {
    'children': IVNode[];
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
