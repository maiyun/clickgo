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
    direction: {
        default: string;
    };
    value: {
        default: number;
    };
};
export declare let data: {
    tabs: never[];
    selectedIndex: number;
    _direction: undefined;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let watch: {
    tabs: (this: IVue) => void;
    value: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
    selectedIndex: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let mounted: (this: IVue) => void;
