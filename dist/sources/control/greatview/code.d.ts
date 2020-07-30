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
    scrollOffset: {
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
    innerPos: {
        start: number;
        end: number;
    };
    showPos: {
        start: number;
        end: number;
    };
    dataHeight: never[];
    lineHeight: number;
    scrollOffsetData: number;
    client: number;
    length: number;
    refreshCount: number;
    lengthInit: boolean;
    initFirst: boolean;
};
export declare let watch: {
    data: {
        handler: (this: IVue) => void;
    };
    direction: (this: IVue) => void;
};
export declare let computed: {
    dataComp: (this: IVue) => any[];
    sameComp: (this: IVue) => boolean;
    paddingComp: (this: IVue) => any;
};
export declare let methods: {
    refreshView: (this: IVue) => Promise<void>;
    reShow: (this: IVue) => void;
    updateScrollOffset: (this: IVue, val: number) => void;
};
export declare let mounted: (this: IVue) => void;
