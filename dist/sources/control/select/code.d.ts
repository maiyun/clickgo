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
        handler: (this: IVueControl) => void;
        deep: boolean;
    };
    modelValue: {
        handler: (this: IVueControl) => void;
        immediate: boolean;
    };
};
export declare let computed: {
    editableComp: (this: IVueControl) => boolean;
    dataComp: (this: IVueControl) => any;
};
export declare let methods: {
    updateValue: (this: IVueControl, index: number) => void;
    tinput: (this: IVueControl) => void;
};
