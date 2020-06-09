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
};
export declare let data: {
    iconData: string;
};
export declare let watch: {
    icon: {
        handler: (this: IVue) => Promise<void>;
        immediate: boolean;
    };
};
