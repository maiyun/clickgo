export declare let props: {
    icon: {
        default: string;
    };
    title: {
        default: string;
    };
    min: {
        default: boolean;
    };
    max: {
        default: boolean;
    };
    close: {
        default: boolean;
    };
    stateMax: {
        default: boolean;
    };
    stateMin: {
        default: boolean;
    };
    show: {
        default: undefined;
    };
    width: {
        default: number;
    };
    height: {
        default: number;
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
    minWidth: {
        default: number;
    };
    minHeight: {
        default: number;
    };
    resize: {
        default: boolean;
    };
    move: {
        default: boolean;
    };
    border: {
        default: string;
    };
    background: {
        default: undefined;
    };
    padding: {
        default: undefined;
    };
    direction: {
        default: string;
    };
};
export declare let data: {
    stateMaxData: boolean;
    stateMinData: boolean;
    stateAbs: boolean;
    showData: boolean;
    iconData: undefined;
    widthData: undefined;
    heightData: undefined;
    leftData: number;
    topData: number;
    zIndexData: number;
    historyLocation: {
        width: number;
        height: number;
        left: number;
        top: number;
    };
    maskFor: undefined;
    maskFrom: undefined;
    flashTimer: undefined;
    isInside: boolean;
};
export declare let computed: {
    isMin: (this: IVueControl) => boolean;
    isMax: (this: IVueControl) => boolean;
    isClose: (this: IVueControl) => boolean;
    isStateMax: (this: IVueControl) => boolean;
    isStateMin: (this: IVueControl) => boolean;
    isResize: (this: IVueControl) => boolean;
    isMove: (this: IVueControl) => boolean;
};
export declare let watch: {
    icon: {
        handler: (this: IVueControl) => Promise<void>;
        immediate: boolean;
    };
    title: (this: IVueControl) => void;
    isStateMin: (this: IVueControl) => void;
    isStateMax: (this: IVueControl) => void;
    show: (this: IVueControl) => void;
    showData: (this: IVueControl) => void;
    width: (this: IVueControl) => Promise<void>;
    height: (this: IVueControl) => Promise<void>;
    left: (this: IVueControl) => void;
    top: (this: IVueControl) => void;
    zIndex: (this: IVueControl) => void;
};
export declare let methods: {
    moveMethod: (this: IVueControl, e: MouseEvent | TouchEvent, custom?: boolean) => void;
    minMethod: (this: IVueControl) => boolean;
    maxVMethod: (this: IVueControl, dbl: boolean) => void;
    maxMethod: (this: IVueControl) => boolean;
    closeMethod: (this: IVueControl) => void;
    resizeMethod: (this: IVueControl, e: MouseEvent | TouchEvent, border: TCGBorder) => void;
    maskDown: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    setPropData: (this: IVueControl, name: string, val: number, mode?: string) => void;
};
export declare let mounted: (this: IVueControl) => Promise<void>;
