export declare let data: {
    tab: string;
    slist: ({
        type: number;
        name: string;
        path: string;
        src: string;
        menu?: undefined;
        disabled?: undefined;
    } | {
        type: number;
        name: string;
        path: string;
        src: string;
        menu: boolean;
        disabled?: undefined;
    } | {
        type: number;
        name: string;
        path: string;
        src: string;
        disabled: boolean;
        menu?: undefined;
    } | {
        type: number;
        name?: undefined;
        path?: undefined;
        src?: undefined;
        menu?: undefined;
        disabled?: undefined;
    })[];
    select: number;
    select2: string;
    label2: string;
    disabled: boolean;
    must: boolean;
    multi: boolean;
};
export declare let computed: {
    listData: (this: IVueForm) => any[];
    listData2: (this: IVueForm) => number[];
};
export declare let methods: {
    showType: (this: IVueForm) => void;
    selectButton: (this: IVueForm) => void;
};
