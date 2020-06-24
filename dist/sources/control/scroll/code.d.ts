export declare let props: {
    disabled: {
        default: boolean;
    };
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
    length: {
        default: number;
    };
    client: {
        default: number;
    };
    scrollOffset: {
        default: number;
    };
};
export declare let data: {
    scrollOffsetData: number;
    barLengthPx: number;
    barLengthSizePx: number;
    timer: undefined;
    tran: boolean;
    _direction: undefined;
};
export declare let watch: {
    length: {
        handler: (this: IVue) => void;
    };
    client: {
        handler: (this: IVue) => void;
    };
    scrollOffset: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    size: (this: IVue) => number;
    scrollOffsetPx: (this: IVue) => number;
    maxScroll: (this: IVue) => number;
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let methods: {
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
    bardown: (this: IVue, e: MouseEvent | TouchEvent) => void;
    longDown: (this: IVue, e: MouseEvent | TouchEvent, type: "start" | "end") => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
