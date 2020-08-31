export declare function getSize(el: HTMLElement): IElementSize;
export declare function watchSize(el: HTMLElement, cb: (size: IElementSize) => void): IElementSize;
export declare function watchElement(el: HTMLElement, cb: MutationCallback, mode?: 'child' | 'childsub' | 'style' | 'default' | MutationObserverInit): MutationObserver;
export declare function bindDown(oe: MouseEvent | TouchEvent, opt: {
    'down'?: (e: MouseEvent | TouchEvent) => void;
    'start'?: (e: MouseEvent | TouchEvent) => void | boolean;
    'move'?: (e: MouseEvent | TouchEvent) => void | boolean;
    'up'?: (e: MouseEvent | TouchEvent) => void;
    'end'?: (e: MouseEvent | TouchEvent) => void;
}): void;
export declare function bindMove(e: MouseEvent | TouchEvent, opt: {
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
    'offsetObject'?: HTMLElement | IVue;
    'showRect'?: boolean;
    'start'?: (x: number, y: number) => void | boolean;
    'move'?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void;
    'up'?: () => void;
    'end'?: (moveTimes: Array<{
        'time': number;
        'ox': number;
        'oy': number;
    }>) => void;
    'borderIn'?: (x: number, y: number, border: TBorderDir) => void;
    'borderOut'?: () => void;
}): {
    'left': number;
    'top': number;
    'right': number;
    'bottom': number;
};
export declare function bindResize(e: MouseEvent | TouchEvent, opt: {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
    'minWidth'?: number;
    'minHeight'?: number;
    'offsetObject'?: HTMLElement;
    'dir': TBorderDir;
    'start'?: (x: number, y: number) => void | boolean;
    'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void;
    'end'?: () => void;
}): void;
