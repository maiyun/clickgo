type VueExOption = {
    template: string,
    props?: string[] | Object,
    computed?: Object
};

declare class Vue {
    constructor(opt: Object);
    public static component(name: string, opt: VueExOption);
}