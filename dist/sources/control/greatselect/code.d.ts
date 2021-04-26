export declare let props: {
    disabled: {
        default: boolean;
    };
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
    direction: {
        default: string;
    };
    flex: {
        default: string;
    };
    padding: {
        default: string;
    };
    area: {
        default: string;
    };
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
    isDisabled: (this: IVueControl) => boolean;
};
export declare let data: {
    popOpen: boolean;
    selfPop: undefined;
    popOptions: {
        left: string;
        top: string;
        width: string;
        zIndex: string;
    };
};
export declare let methods: {
    keydown: (this: IVueControl, e: KeyboardEvent) => void;
    click: (this: IVueControl, e: MouseEvent, area: 'left' | 'arrow') => void;
    showPop: (this: IVueControl) => void;
    hidePop: (this: IVueControl) => void;
};
