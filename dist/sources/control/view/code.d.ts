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
    scrollOffset: {
        default: number;
    };
};
export declare let data: {
    scrollOffsetData: number;
    scrollOffsetEmit: number;
    client: number;
    contentLength: number;
    tran: number;
    timer: undefined;
};
export declare let watch: {
    direction: (this: IVue) => void;
    scrollOffset: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
    length: {
        handler: (this: IVue) => void;
    };
};
export declare let computed: {
    maxScroll: (this: IVue) => number;
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
    length: (this: IVue) => number;
};
export declare let methods: {
    wheel: (this: IVue, e: WheelEvent) => void;
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    refreshView: (this: IVue) => void;
    goScroll: (this: IVue, scrollOffset: number | string) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let unmounted: (this: IVue) => void;
