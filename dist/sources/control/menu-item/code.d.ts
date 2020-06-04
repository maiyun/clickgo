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
    controlName: string;
    popOpen: boolean;
};
export declare let methods: {
    showPop: (this: IVue, event: MouseEvent) => void;
    mousein: (this: IVue, event: MouseEvent) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
