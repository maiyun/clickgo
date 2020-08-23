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
        default: undefined;
    };
    area: {
        default: string;
    };
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
};
export declare let data: {
    popOpen: boolean;
};
export declare let methods: {
    showPop: (this: IVueControl, event: MouseEvent | KeyboardEvent, area: 'all' | 'arrow') => void;
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    keydown: (this: IVue, e: KeyboardEvent) => void;
};
