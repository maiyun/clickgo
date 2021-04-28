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
    flex: {
        default: string;
    };
    type: {
        default: string;
    };
    plain: {
        default: boolean;
    };
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
    isDisabled: (this: IVueControl) => boolean;
    isPlain: (this: IVueControl) => boolean;
};
export declare let methods: {
    keydown: (this: IVueControl, e: KeyboardEvent) => void;
};
