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
        handler: (this: IVueControl) => Promise<void>;
        deep: boolean;
    };
};
export declare let methods: {
    longDown: (this: IVueControl, e: MouseEvent | TouchEvent, type: 'start' | 'end') => void;
    wheel: (this: IVueControl, e: WheelEvent) => void;
    onResize: (this: IVueControl, size: ICGDomSize) => void;
};
export declare let mounted: (this: IVueControl) => void;
