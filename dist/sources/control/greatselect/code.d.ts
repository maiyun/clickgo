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
    showPop: (this: IVue, event: MouseEvent, area: "all" | "arrow") => void;
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
};
