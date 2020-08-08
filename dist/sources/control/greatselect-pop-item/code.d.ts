export declare let props: {
    disabled: {
        default: boolean;
    };
    value: {
        default: string;
    };
};
export declare let data: {
    popOpen: boolean;
    hasMenuPop: boolean;
};
export declare let methods: {
    click: (this: IVue, event: MouseEvent) => void;
    controlClick: (this: IVue, e: MouseEvent) => void;
};
export declare let updated: (this: IVue) => void;
