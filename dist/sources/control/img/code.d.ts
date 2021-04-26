export declare let props: {
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
    src: {
        default: string;
    };
    mode: {
        default: string;
    };
};
export declare let data: {
    iconData: string;
};
export declare let computed: {
    backgroundSize: (this: IVueControl) => string | undefined;
};
export declare let watch: {
    src: {
        handler: (this: IVueControl) => Promise<void>;
        immediate: boolean;
    };
};
