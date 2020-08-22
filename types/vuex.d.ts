declare namespace Vuex {
    export class Store {
        public constructor(opt: any);
        public commit(...arg: any[]): any;
        public state: any;
    }
}
