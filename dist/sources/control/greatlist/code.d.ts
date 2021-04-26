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
    adaptation: {
        dafault: boolean;
    };
    same: {
        default: boolean;
    };
    disabled: {
        default: boolean;
    };
    must: {
        default: boolean;
    };
    multi: {
        default: boolean;
    };
    data: {
        default: never[];
    };
    modelValue: {
        default: number;
    };
};
export declare let data: {
    direction: string;
    itemPopShowing: undefined;
    popOpen: boolean;
    selfPop: undefined;
    popOptions: {
        left: string;
        top: string;
        zIndex: string;
    };
    client: number;
    length: number;
    offset: number;
    valueData: number;
    shiftStart: number;
    itemDown: boolean;
    itemClick: boolean;
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let watch: {
    data: {
        handler: (this: IVueControl) => void;
        deep: boolean;
    };
    modelValue: {
        handler: (this: IVueControl) => void;
        deep: boolean;
        immediate: boolean;
    };
    must: {
        handler: (this: IVueControl) => void;
    };
    multi: {
        handler: (this: IVueControl) => void;
    };
};
export declare let methods: {
    select: (this: IVueControl, value?: number | undefined, shift?: boolean, ctrl?: boolean) => boolean;
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    innerDown: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    click: (this: IVueControl) => void;
    contextmenu: (this: IVueControl, e: MouseEvent) => void;
    showPop: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    hidePop: (this: IVueControl) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
