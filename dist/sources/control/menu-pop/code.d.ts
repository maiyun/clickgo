export declare let props: {
    width: {
        default: undefined;
    };
    height: {
        default: undefined;
    };
    left: {
        default: number;
    };
    top: {
        default: number;
    };
};
export declare let data: {
    leftData: number;
    topData: number;
    qq: number;
};
export declare let watch: {
    left: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
    top: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let methods: {
    setPropData: (this: IVue, name: string, val: number, mode?: string) => void;
};
