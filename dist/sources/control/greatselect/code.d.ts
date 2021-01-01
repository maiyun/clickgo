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
    subPop: undefined;
    popOptions: {
        left: string;
        top: string;
        width: string;
        zIndex: string;
    };
};
export declare let methods: {
    down: (this: IVueControl, e: MouseEvent | TouchEvent) => void;
    keydown: (this: IVueControl, e: KeyboardEvent) => void;
    click: (this: IVueControl, event: MouseEvent, area: 'all' | 'arrow') => void;
    showPop: (this: IVueControl) => void;
    hidePop: (this: IVueControl) => void;
};
