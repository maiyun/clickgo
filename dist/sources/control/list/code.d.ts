export declare let props: {
    width: {
        default: undefined;
    };
    height: {
        default: undefined;
    };
    left: {
        default: undefined;
    };
    top: {
        default: undefined;
    };
    zIndex: {
        default: undefined;
    };
    flex: {
        default: undefined;
    };
    padding: {
        default: undefined;
    };
    adaptation: {
        dafault: undefined;
    };
    disabled: {
        default: undefined;
    };
    must: {
        default: boolean;
    };
    multi: {
        default: boolean;
    };
    data: {
        default: never[];
    };
    modelValue: {
        default: string;
    };
};
export declare let data: {
    cgNest: boolean;
};
export declare let computed: {
    dataComp: (this: IVueControl) => any[];
    value: (this: IVueControl) => number | number[];
};
export declare let methods: {
    updateModelValue: (this: IVueControl, value: number | number[]) => void;
};
