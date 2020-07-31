declare var Vue: {
    new(opt: any): IVue;

    /** --- 注册或获取全局组件 --- */
    component(name: string, opt?: any): any;
    /** --- 安装 Vue.js 插件 --- */
    use(obj: any): any;
    /** --- 使用基础 Vue 构造器，创建一个“子类”。 --- */
    extend(opt: any): any;

    "config": any;

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
    $destroy(): void;

    _isVue: boolean;

    [key: string]: any;
}

interface IVNode {
    "children": IVNode[];
    "componentInstance": IVue;
    "componentOptions": {
        "tag": string;
        [name: string]: any;
    };
    "context": IVue;

    [key: string]: any;
}

