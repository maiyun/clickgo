export declare let props: {
    tabs: {
        default: never[];
    };
};
export declare let data: {
    arrow: boolean;
    timer: undefined;
};
export declare let watch: {
    tabs: {
        handler: (this: IVue) => Promise<void>;
        deep: boolean;
    };
};
export declare let methods: {
    longDown: (this: IVue, e: MouseEvent | TouchEvent, type: 'start' | 'end') => void;
    wheel: (this: IVue, e: WheelEvent) => void;
    onResize: (this: IVue, size: IElementSize) => void;
};
export declare let mounted: (this: IVue) => void;
