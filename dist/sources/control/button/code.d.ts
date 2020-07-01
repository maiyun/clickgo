export declare let props: {
    disabled: {
        default: boolean;
    };
    focus: {
        default: boolean;
    };
    width: {
        default: undefined;
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
    flex: {
        default: string;
    };
    padding: {
        default: undefined;
    };
};
export declare let data: {
    _direction: undefined;
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let methods: {
    keydown: (this: IVue, e: KeyboardEvent) => void;
    down: (this: IVue, e: TouchEvent | MouseEvent) => void;
};
export declare let mounted: (this: IVue) => void;
