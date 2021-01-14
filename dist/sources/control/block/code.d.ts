export declare let props: {
    width: {
        default: undefined;
    };
    height: {
        default: undefined;
    };
    flex: {
        default: string;
    };
};
export declare let computed: {
    widthPx: (this: IVueControl) => string | undefined;
    heightPx: (this: IVueControl) => string | undefined;
};
