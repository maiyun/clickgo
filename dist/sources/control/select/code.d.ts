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
export declare let watch: {
    modelValue: {
        handler: (this: IVueControl) => void;
        immediate: boolean;
    };
    isEditable: {
        handler: (this: IVueControl, editable: boolean) => void;
        immediate: boolean;
    };
};
export declare let data: {
    cgNest: boolean;
    value: string;
    label: string;
    inputValue: string;
    doInput: boolean;
};
export declare let computed: {
    isDisabled: (this: IVueControl) => boolean;
    isEditable: (this: IVueControl) => boolean;
};
export declare let methods: {
    updateModelValue: (this: IVueControl, value: string) => void;
    input: (this: IVueControl) => void;
};
