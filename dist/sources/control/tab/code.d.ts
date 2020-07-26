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
    value: {
        default: number;
    };
    name: {
        default: undefined;
    };
};
export declare let data: {
    tabs: never[];
    selectedIndex: number;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let watch: {
    value: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let updated: (this: IVue) => void;
