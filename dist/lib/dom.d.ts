export declare function setGlobalCursor(type?: string): void;
export declare function createToStyleList(taskId: number): void;
export declare function removeFromStyleList(taskId: number): void;
export declare function pushStyle(taskId: number, style: string, type?: 'global' | 'theme' | 'control' | 'form', formId?: number | string): void;
export declare function removeStyle(taskId: number, type?: 'global' | 'theme' | 'control' | 'form', formId?: number | string): void;
export declare function getStyleCount(taskId: number, type: 'theme' | 'control' | 'form'): number;
export declare function getSize(el: HTMLElement): ICGDomSize;
export declare function watchSize(el: HTMLElement, cb: (size: ICGDomSize) => void, immediate?: boolean): ICGDomWatchDom;
export declare function watchDom(el: HTMLElement, cb: (mutations: MutationRecord[], observer?: MutationObserver) => void, mode?: 'child' | 'childsub' | 'style' | 'default' | MutationObserverInit, immediate?: boolean): MutationObserver;
export declare function bindDown(oe: MouseEvent | TouchEvent, opt: {
    'down'?: (e: MouseEvent | TouchEvent) => void;
    'start'?: (e: MouseEvent | TouchEvent) => void | boolean;
    'move'?: (e: MouseEvent | TouchEvent) => void | boolean;
    'up'?: (e: MouseEvent | TouchEvent) => void;
    'end'?: (e: MouseEvent | TouchEvent) => void;
}): void;
export declare function bindLong(e: MouseEvent | TouchEvent, long: (e: MouseEvent | TouchEvent) => void): void;
export declare let is: {
    move: boolean;
};
export declare function bindMove(e: MouseEvent | TouchEvent, opt: {
    'areaObject'?: HTMLElement | IVue;
    'left'?: number;
    'top'?: number;
    'right'?: number;
    'bottom'?: number;
    'offsetLeft'?: number;
    'offsetTop'?: number;
    'offsetRight'?: number;
    'offsetBottom'?: number;
    'objectLeft'?: number;
    'objectTop'?: number;
    'objectWidth'?: number;
    'objectHeight'?: number;
    'object'?: HTMLElement | IVue;
    'showRect'?: boolean;
    'start'?: (x: number, y: number) => void | boolean;
    'move'?: (ox: number, oy: number, x: number, y: number, border: TCGBorder) => void;
    'up'?: () => void;
    'end'?: (moveTimes: Array<{
        'time': number;
        'ox': number;
        'oy': number;
    }>) => void;
    'borderIn'?: (x: number, y: number, border: TCGBorder) => void;
    'borderOut'?: () => void;
}): {
    'left': number;
    'top': number;
    'right': number;
    'bottom': number;
};
export declare function bindResize(e: MouseEvent | TouchEvent, opt: {
    'objectLeft'?: number;
    'objectTop'?: number;
    'objectWidth'?: number;
    'objectHeight'?: number;
    'object'?: HTMLElement | IVue;
    'minWidth'?: number;
    'minHeight'?: number;
    'maxWidth'?: number;
    'maxHeight'?: number;
    'border': TCGBorder;
    'start'?: (x: number, y: number) => void | boolean;
    'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TCGBorder) => void;
    'end'?: () => void;
}): void;
export declare function findParentByClass(el: HTMLElement, cn: string | string[]): HTMLElement | null;
export declare function siblings(el: HTMLElement, cn: string): HTMLElement | null;
