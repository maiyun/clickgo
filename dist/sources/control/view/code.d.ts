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
    flex: {
        default: string;
    };
    direction: {
        default: string;
    };
    scrolOffset: {
        default: number;
    };
};
export declare let data: {
    length: number;
    innerTop: number;
    innerLeft: number;
};
export declare let methods: {
    wheel: (this: IVue, e: WheelEvent) => void;
    down: (this: IVue, e: MouseEvent | TouchEvent) => void;
};
export declare let mounted: (this: IVue) => void;
