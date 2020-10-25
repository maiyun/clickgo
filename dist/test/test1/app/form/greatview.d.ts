export declare let data: {
    lineCount: number;
    soLeft: number;
    soTop: number;
    l: number;
    c: number;
    soLeft2: number;
    soTop2: number;
    l2: number;
    c2: number;
    soLeft3: number;
    soTop3: number;
    l3: number;
    c3: number;
    lineCountD: number;
    soLeftD: number;
    soTopD: number;
    lD: number;
    cD: number;
    soLeft2D: number;
    soTop2D: number;
    l2D: number;
    c2D: number;
    soLeft3D: number;
    soTop3D: number;
    l3D: number;
    c3D: number;
    soLeft4: number;
    soTop4: number;
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
            sub1: {
                label: string;
            };
            sub2: {
                label: string;
            };
        };
        label?: undefined;
        disabled?: undefined;
    } | {
        label: string;
        children: string[];
        value?: undefined;
        disabled?: undefined;
    })[];
    select2: string;
    select3: string;
    style: boolean;
    tabs: never[];
    tabsi: number;
    tabPosition: string;
};
export declare let watch: {
    select: (this: IVueControl, n: number, o: number) => void;
    slist: {
        handler: (this: IVueControl) => void;
        deep: boolean;
    };
};
