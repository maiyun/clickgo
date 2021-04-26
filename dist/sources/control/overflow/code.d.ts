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
    scrollLeft: {
        default: number;
    };
    scrollTop: {
        default: number;
    };
};
export declare let data: {
    scrollLeftEmit: number;
    scrollTopEmit: number;
    clientWidth: number;
    clientHeight: number;
    lengthWidth: number;
    lengthHeight: number;
    touchPos: {
        x: number;
        y: number;
    };
    canTouch: number;
};
export declare let computed: {
    maxScrollLeft: (this: IVueControl) => number;
    maxScrollTop: (this: IVueControl) => number;
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let watch: {
    scrollLeft: {
        handler: (this: IVueControl) => void;
    };
    scrollTop: {
        handler: (this: IVueControl) => void;
    };
};
export declare let methods: {
    scroll: (this: IVueControl) => void;
    wheel: (this: IVueControl, e: WheelEvent) => void;
    down: (this: IVueControl, e: TouchEvent) => void;
    move: (this: IVueControl, e: TouchEvent) => void;
};
export declare let mounted: (this: IVueControl) => void;
