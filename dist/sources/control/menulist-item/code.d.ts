export declare let props: {
    disabled: {
        default: boolean;
    };
    padding: {
        default: undefined;
    };
    alt: {
        default: undefined;
    };
    type: {
        default: undefined;
    };
    label: {
        default: undefined;
    };
    modelValue: {
        default: undefined;
    };
};
export declare let data: {
    popOpen: boolean;
    selfPop: undefined;
    direction: string;
    menulist: undefined;
    popOptions: {
        left: string;
        top: string;
        zIndex: string;
    };
};
export declare let watch: {
    type: {
        handler: (this: IVueControl) => void;
        immediate: boolean;
    };
};
export declare let methods: {
    click: (this: IVueControl, e: MouseEvent) => void;
    enter: (this: IVueControl, e: MouseEvent) => void;
    down: (this: IVueControl, e: TouchEvent) => void;
    showPop: (this: IVueControl) => void;
    hidePop: (this: IVueControl) => void;
};
export declare let mounted: (this: IVueControl) => void;
export declare let unmounted: (this: IVueControl) => void;
