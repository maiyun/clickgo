export declare let props: {
    disabled: {
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
    modelValue: {
        default: string;
    };
    editable: {
        default: boolean;
    };
    data: {
        default: never[];
    };
};
export declare let data: {
    valueData: number;
    valueIndex: number;
};
export declare let watch: {
    data: {
        handler: (this: IVue) => void;
    };
    modelValue: {
        handler: (this: IVue) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    editableComp: (this: IVue) => boolean;
    dataComp: (this: IVue) => any;
};
export declare let methods: {
    input: (this: IVue, index: number) => void;
    tinput: (this: IVue) => void;
};
