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
    padding: {
        default: undefined;
    };
    adaptation: {
        dafault: boolean;
    };
    scrollLeft: {
        default: number;
    };
    scrollTop: {
        default: number;
    };
};
export declare let data: {
    scrollLeftData: number;
    scrollTopData: number;
    scrollLeftEmit: number;
    scrollTopEmit: number;
    clientWidth: number;
    clientHeight: number;
    clientInit: boolean;
    lengthWidth: number;
    lengthHeight: number;
    lengthInit: boolean;
    timer: boolean;
};
export declare let watch: {
    direction: (this: IVueControl) => void;
    scrollLeft: {
        handler: (this: IVueControl) => void;
        immediate: boolean;
    };
    scrollTop: {
        handler: (this: IVueControl) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    maxScrollLeft: (this: IVueControl) => number;
    maxScrollTop: (this: IVueControl) => number;
    maxLengthWidth: (this: IVueControl) => number;
    maxLengthHeight: (this: IVueControl) => number;
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let methods: {
    wheel: (this: IVueControl, e: WheelEvent) => void;
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    refreshView: (this: IVueControl) => void;
    goScroll: (this: IVueControl, scroll: number | string, pos: 'left' | 'top') => void;
    stopAnimation: (this: IVueControl) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
