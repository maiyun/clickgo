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
    scrollOffset: {
        default: number;
    };
};
export declare let data: {
    _direction: undefined;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let watch: {
    scrollOffset: {
        handler: (this: IVue) => void;
    };
};
export declare let methods: {
    scroll: (this: IVue) => void;
    wheel: (this: IVue, e: WheelEvent) => void;
};
export declare let mounted: (this: IVue) => void;
