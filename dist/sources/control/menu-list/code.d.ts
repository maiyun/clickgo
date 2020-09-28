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
};
export declare let data: {
    hasSubItemsCount: number;
    hasTypeItemsCount: number;
    itemPopShowing: undefined;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
