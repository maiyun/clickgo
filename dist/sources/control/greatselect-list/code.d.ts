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
    zIndex: {
        default: number;
    };
    flex: {
        default: string;
    };
    same: {
        default: boolean;
    };
    data: {
        default: never[];
    };
    modelValue: {
        default: number;
    };
};
export declare let data: {
    itemPopShowing: undefined;
    direction: string;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let methods: {
    select: (this: IVue, index: number) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
