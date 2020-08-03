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
    valueData: number;
};
export declare let computed: {
    editableComp: (this: IVue) => boolean;
    dataComp: (this: IVue) => any;
};
export declare let methods: {
    input: (this: IVue, index: number) => void;
};
