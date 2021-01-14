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
    scrollOffsetEmit: number;
    clientEmit: number;
    lengthEmit: number;
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let watch: {
    scrollOffset: {
        handler: (this: IVueControl) => void;
    };
};
export declare let methods: {
    scroll: (this: IVueControl) => void;
    wheel: (this: IVueControl, e: WheelEvent) => void;
    touchmove: (this: IVueControl, e: TouchEvent) => void;
};
export declare let mounted: (this: IVueControl) => void;
