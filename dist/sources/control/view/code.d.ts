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
    lengthWidth: number;
    lengthHeight: number;
    timer: boolean;
};
export declare let watch: {
    direction: (this: IVue) => void;
    scrollLeft: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
    scrollTop: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    maxScrollLeft: (this: IVueControl) => number;
    maxScrollTop: (this: IVueControl) => number;
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let methods: {
    wheel: (this: IVue, e: WheelEvent) => void;
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    refreshView: (this: IVue) => void;
    goScroll: (this: IVueControl, scroll: number | string, pos: 'left' | 'top') => void;
};
export declare let mounted: (this: IVue) => void;
export declare let unmounted: (this: IVue) => void;
