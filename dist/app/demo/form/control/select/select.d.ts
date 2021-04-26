export declare let data: {
    area: string;
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
    disabled: boolean;
    slist2: (string | {
        value: string;
        label: string;
        disabled?: undefined;
        children?: undefined;
    } | {
        value: string;
        label: string;
        disabled: boolean;
        children?: undefined;
    } | {
        value: string;
        children: {
            label: string;
        }[];
        label?: undefined;
        disabled?: undefined;
    } | {
        label: string;
        children: string[];
        value?: undefined;
        disabled?: undefined;
    })[];
    select2: string;
    editable: boolean;
};
export declare let watch: {
    select: (this: IVueForm, n: number, o: number) => Promise<void>;
};
