export declare let props: {
    height: {
        default: undefined;
    };
    same: {
        default: boolean;
    };
    data: {
        default: never[];
    };
    value: {
        default: number;
    };
};
export declare let data: {
    widthData: undefined;
    leftData: number;
    topData: number;
    zIndexData: number;
    open: boolean;
};
export declare let methods: {
    onHide: (this: IVue) => void;
    select: (this: IVue, index: number) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
