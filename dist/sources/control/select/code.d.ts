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
    padding: {
        default: undefined;
    };
    flex: {
        default: string;
    };
    value: {
        default: undefined;
    };
    editable: {
        default: boolean;
    };
    data: {
        default: never[];
    };
};
export declare let data: {
    valueData: string;
    wrapFocus: boolean;
    inputFocus: boolean;
};
export declare let watch: {
    value: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    widthPx: (this: IVue) => string | undefined;
    heightPx: (this: IVue) => string | undefined;
    editableComp: (this: IVue) => boolean;
};
export declare let methods: {
    input: (this: IVue) => void;
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
