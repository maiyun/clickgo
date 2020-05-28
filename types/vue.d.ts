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
    $refs: any;
    $data: any;
    $props: any;
    $slots: any;
    $parent: any;
    $children: IVue[];
    $watch: any;

    $emit(event: string, ...args: any[]): IVue;
    $nextTick(callback: (this: this) => void): this;
    $nextTick(): Promise<void>;
    $mount(c: string): any;

    [key: string]: any;
}

