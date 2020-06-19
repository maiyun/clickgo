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
    direction: {
        default: string;
    };
    flex: {
        default: string;
    };
    gutter: {
        default: undefined;
    };
    "align-h": {
        default: undefined;
    };
    "align-v": {
        default: undefined;
    };
};
export declare let data: {
    _direction: undefined;
};
export declare let watch: {
    direction: (this: IVue) => void;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let mounted: (this: IVue) => void;
