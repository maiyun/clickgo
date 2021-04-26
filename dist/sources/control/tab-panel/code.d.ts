export declare let props: {
    direction: {
        default: string;
    };
    label: {
        default: string;
    };
    value: {
        default: undefined;
    };
};
export declare let computed: {
    show: (this: IVueControl) => boolean;
};
export declare let watch: {
    show: (this: IVueControl) => void;
};
