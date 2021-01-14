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
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let watch: {
    data: {
        handler: (this: IVueControl) => void;
        deep: boolean;
    };
};
export declare let methods: {
    select: (this: IVueControl, value?: string | number | undefined) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
