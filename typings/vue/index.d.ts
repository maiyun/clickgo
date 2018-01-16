declare class Vue {
    constructor(opt: any);
    static component(name: string, opt: any): any;
    static extend(opt: any): any;
    $el: HTMLElement;
    $refs: any;
    $data: any;
    $props: any;
    $slots: any;
    $parent: any;
    $children: any[];
    $emit(e: string, v?: any): any;
    $nextTick(c: any): any;
    $mount(c: string): any;
}

declare namespace Vuex {
    class Store {
        constructor(opt: any);
        commit(...arg: any[]): any;
        state: any;
    }
}
