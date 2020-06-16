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
    _needDown: boolean;
    scrollOffsetData: number;
    length: number;
    client: number;
    timer: boolean;
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
};
export declare let methods: {
    wheel: (this: IVue, e: WheelEvent) => void;
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
    refreshView: (this: IVue) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
