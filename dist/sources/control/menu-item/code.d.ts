export declare let props: {
    disabled: {
        default: boolean;
    };
    alt: {
        default: undefined;
    };
};
export declare let data: {
    popOpen: boolean;
    selfPop: undefined;
    popOptions: {
        left: string;
        top: string;
        zIndex: string;
    };
};
export declare let methods: {
    enter: (this: IVueControl, e: MouseEvent) => void;
    click: (this: IVueControl, event: MouseEvent) => void;
    showPop: (this: IVueControl) => void;
    hidePop: (this: IVueControl) => void;
};
export declare let unmounted: (this: IVueControl) => void;
