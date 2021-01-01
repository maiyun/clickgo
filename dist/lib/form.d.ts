export declare let popShowing: null | IVueControl;
export declare let lastFormId: number;
export declare let lastZIndex: number;
export declare let lastTopZIndex: number;
export declare let lastPopZIndex: number;
export declare function changeFocus(formId?: number, vm?: IVue): void;
export declare function getRectByBorder(border: TCGBorder): {
    'width': number;
    'height': number;
    'left': number;
    'top': number;
};
export declare function showCircular(x: number, y: number): void;
export declare function moveRectangle(border: TCGBorder): void;
export declare function showRectangle(x: number, y: number, border: TCGBorder): void;
export declare function hideRectangle(): void;
export declare function appendToPop(el: HTMLElement): void;
export declare function removeFromPop(el: HTMLElement): void;
export declare function showPop(pop: IVueControl, x: number | 'h' | 'v', y?: number): {
    'left': string;
    'top': string;
    'zIndex': string;
};
export declare function hidePop(pop?: IVueControl | null): void;
export declare function doFocusAndPopEvent(e: MouseEvent | TouchEvent): void;
export declare function remove(formId: number): boolean;
export declare function create(taskId: number, opt: ICGCreateFormOptions): Promise<number | ICGForm>;
