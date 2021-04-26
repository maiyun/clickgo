export declare let props: {
    disabled: {
        default: boolean;
    };
    direction: {
        default: string;
    };
    padding: {
        default: undefined;
    };
    value: {
        default: string;
    };
};
export declare let data: {
    popOpen: boolean;
    selfPop: undefined;
    greatlist: undefined;
    popOptions: {
        left: string;
        top: string;
        zIndex: string;
    };
};
export declare let computed: {
    isDisabled: (this: IVueControl) => boolean;
};
export declare let methods: {
    click: (this: IVueControl, e: MouseEvent) => void;
    contextmenu: (this: IVueControl, e: MouseEvent) => void;
    down: (this: IVueControl, e: TouchEvent | MouseEvent) => void;
    controlClick: (this: IVueControl, e: MouseEvent) => void;
    controlContextmenu: (this: IVueControl, e: MouseEvent) => void;
    controlDown: (this: IVueControl, e: TouchEvent | MouseEvent) => void;
    showPop: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    hidePop: (this: IVueControl) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
