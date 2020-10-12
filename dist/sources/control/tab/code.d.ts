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
    tabPosition: {
        default: string;
    };
    modelValue: {
        default: string;
    };
};
export declare let data: {
    selected: string;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
    tabs: (this: IVueControl) => any[];
    names: (this: IVue) => string[];
};
export declare let watch: {
    modelValue: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let mounted: (this: IVueControl) => void;
