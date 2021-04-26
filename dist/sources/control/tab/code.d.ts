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
    tabPosition: {
        default: string;
    };
    modelValue: {
        default: string;
    };
};
export declare let data: {
    arrow: boolean;
    timer: undefined;
    oldTabs: undefined;
    selected: string;
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
    tabs: (this: IVueControl) => any[];
    values: (this: IVueControl) => string[];
};
export declare let watch: {
    modelValue: {
        handler: (this: IVueControl) => void;
        immediate: boolean;
    };
    tabs: {
        handler: (this: IVueControl) => Promise<void>;
        deep: string;
    };
    tabPosition: {
        handler: (this: IVueControl) => Promise<void>;
    };
};
export declare let methods: {
    wheel: (this: IVueControl, e: WheelEvent) => void;
    longDown: (this: IVueControl, e: MouseEvent | TouchEvent, type: 'start' | 'end') => void;
    onResize: (this: IVueControl, size: ICGDomSize) => void;
    reSelected: (this: IVueControl) => void;
};
export declare let mounted: (this: IVueControl) => void;
