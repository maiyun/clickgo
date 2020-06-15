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
    timer: boolean;
};
export declare let methods: {
    wheel: (this: IVue, e: WheelEvent) => void;
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
};
export declare let destroyed: (this: IVue) => void;
