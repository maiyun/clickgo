export declare let props: {
    disabled: {
        default: boolean;
    };
    text: {
        default: string;
    };
    alt: {
        default: undefined;
    };
};
export declare let data: {
    popOpen: boolean;
};
export declare let methods: {
    showPop: (this: IVueControl, event: MouseEvent) => void;
    mousein: (this: IVue, event: MouseEvent) => void;
};
