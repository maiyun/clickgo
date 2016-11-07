type VueExOption = {
    name: string,
    template: string,
    data?: any,
    props?: string[] | Object,
    computed?: Object,
    methods?: any,
    created?: any,
    watch?: any
};

declare class Vue {
    constructor(opt: Object);
    public static component(name: string, opt: VueExOption);
}