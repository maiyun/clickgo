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
};
export declare let data: {
    popOpen: boolean;
    subPop: undefined;
    popOptions: {
        left: string;
        top: string;
        zIndex: string;
    };
};
export declare let methods: {
    mousein: (this: IVue) => void;
    click: (this: IVueControl, event: MouseEvent) => void;
    showPop: (this: IVueControl) => void;
    hidePop: (this: IVueControl) => void;
};
export declare let unmounted: (this: IVueControl) => void;
