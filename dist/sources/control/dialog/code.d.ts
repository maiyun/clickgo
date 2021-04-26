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
    direction: {
        default: string;
    };
    flex: {
        default: string;
    };
    gutter: {
        default: undefined;
    };
    buttons: {
        default: string[];
    };
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
export declare let methods: {
    click: (this: IVueControl, item: string) => void;
};
