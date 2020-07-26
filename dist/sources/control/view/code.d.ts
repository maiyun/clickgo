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
    length: number;
    client: number;
    tran: number;
    timer: undefined;
    _direction: undefined;
};
export declare let watch: {
    direction: (this: IVue) => void;
    scrollOffset: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    maxScroll: (this: IVue) => number;
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let methods: {
    wheel: (this: IVue, e: WheelEvent) => void;
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
    refreshView: (this: IVue) => void;
    goScroll: (this: IVue, scrollOffset: number | string) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
