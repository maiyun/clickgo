declare namespace Vuex {
    class Store {
        constructor(opt: any);
        commit(...arg: any[]): any;
        state: any;
    }
}