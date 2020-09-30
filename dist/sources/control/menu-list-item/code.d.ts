export declare let props: {
    disabled: {
        default: boolean;
    };
    text: {
        default: string;
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
    subPop: undefined;
    showArrow: boolean;
    popOptions: {
        left: string;
        top: string;
        zIndex: string;
    };
};
export declare let watch: {
    type: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let updated: (this: IVueControl) => void;
export declare let methods: {
    click: (this: IVueControl, event: MouseEvent) => void;
    mousein: (this: IVueControl) => void;
    showPop: (this: IVueControl) => void;
    hidePop: (this: IVueControl) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let unmounted: (this: IVue) => void;
