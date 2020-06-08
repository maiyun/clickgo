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
    type: {
        default: undefined;
    };
    label: {
        default: undefined;
    };
    value: {
        default: undefined;
    };
};
export declare let data: {
    popOpen: boolean;
    showArrow: boolean;
    thePopHasSubCount: number;
    thePopHasTypeCount: number;
};
export declare let watch: {
    type: (this: IVue) => void;
};
export declare let methods: {
    mousein: (this: IVue, event: MouseEvent) => void;
    click: (this: IVue, event: MouseEvent) => void;
};
export declare let mounted: (this: IVue) => void;
export declare let destroyed: (this: IVue) => void;
