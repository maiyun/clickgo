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
    scrollOffsetPx: number;
    scrollOffsetData: number;
    timer: undefined;
    tran: boolean;
};
export declare let watch: {
    scrollOffset: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    size: (this: IVue) => string;
    scrollOffsetPer: (this: IVue) => number;
};
export declare let methods: {
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
    bardown: (this: IVue, e: MouseEvent | TouchEvent) => void;
    longDown: (this: IVue, e: MouseEvent | TouchEvent, type: "start" | "end") => void;
};
export declare let destroyed: (this: IVue) => void;
