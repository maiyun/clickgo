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
    scrollOffsetPx: number;
    barLengthPx: number;
    timer: undefined;
    tran: boolean;
};
export declare let watch: {
    length: {
        handler: (this: IVueControl) => void;
    };
    client: {
        handler: (this: IVueControl) => void;
    };
    scrollOffset: {
        handler: (this: IVueControl) => void;
    };
};
export declare let computed: {
    realSize: (this: IVueControl) => number;
    size: (this: IVueControl) => number;
    sizeOut: (this: IVueControl) => number;
    barOutSize: (this: IVueControl) => number;
    maxScroll: (this: IVueControl) => number;
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let methods: {
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    bardown: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    longDown: (this: IVueControl, e: MouseEvent | TouchEvent, type: 'start' | 'end') => void;
    resizePxOfScrollOffsetData: (this: IVueControl, scrollOffsetData: number) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
