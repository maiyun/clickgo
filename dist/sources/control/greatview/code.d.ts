export declare let props: {
    width: {
        default: undefined;
    };
    height: {
        default: undefined;
    };
    left: {
        default: undefined;
    };
    top: {
        default: undefined;
    };
    zIndex: {
        default: undefined;
    };
    flex: {
        default: undefined;
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
        default: undefined;
    };
    scrollTop: {
        default: undefined;
    };
    content: {
        default: undefined;
    };
    same: {
        default: boolean;
    };
    data: {
        default: never[];
    };
};
export declare let data: {
    compPos: {
        start: number;
        end: number;
    };
    showPos: {
        start: number;
        end: number;
    };
    dataHeight: never[];
    lineHeight: number;
    scrollLeftEmit: number;
    scrollTopEmit: number;
    lengthWidth: number;
    lengthHeight: number;
    client: number;
    clientWidth: number;
    clientHeight: number;
    refreshCount: number;
    lengthInit: boolean;
    cgNest: boolean;
};
export declare let watch: {
    data: {
        handler: (this: IVueControl) => void;
        deep: boolean;
    };
    direction: (this: IVueControl) => void;
    scrollLeft: (this: IVueControl) => void;
    scrollTop: (this: IVueControl) => void;
};
export declare let computed: {
    dataComp: (this: IVueControl) => any[];
    sameComp: (this: IVueControl) => boolean;
    paddingComp: (this: IVueControl) => any;
};
export declare let methods: {
    refreshView: (this: IVueControl) => Promise<void>;
    reShow: (this: IVueControl) => void;
    updateScrollOffset: (this: IVueControl, val: number, pos: 'left' | 'top') => void;
    onResize: (this: IVueControl, val: number) => void;
    onResizen: (this: IVueControl, val: number) => void;
    onChange: (this: IVueControl, val: number) => void;
};
export declare let mounted: (this: IVueControl) => void;
