interface ICGDomLib {
    setGlobalCursor(type?: string): void;
    createToStyleList(taskId: number): void;
    removeFromStyleList(taskId: number): void;
    pushStyle(taskId: number, style: string, type?: 'global'): void;
    pushStyle(taskId: number, style: string, type: 'theme' | 'control', name?: string): void;
    pushStyle(taskId: number, style: string, type: 'form', formId: number): void;
    removeStyle(taskId: number, type?: 'global'): void;
    removeStyle(taskId: number, type: 'theme' | 'control', name?: string): void;
    removeStyle(taskId: number, type: 'form', formId: number): void;
    getStyleCount(taskId: number, type: 'theme' | 'control' | 'form'): number;
    getSize(el: HTMLElement): ICGDomSize;
    watchSize(el: HTMLElement, cb: (size: ICGDomSize) => void, immediate?: boolean): ICGDomWatchDom;
    watchDom(el: HTMLElement, cb: (mutations: MutationRecord[], observer?: MutationObserver) => void, mode?: 'child' | 'childsub' | 'style' | 'default' | MutationObserverInit, immediate?: boolean): MutationObserver;
    bindDown(oe: MouseEvent | TouchEvent, opt: {
        'down'?: (e: MouseEvent | TouchEvent) => void;
        'start'?: (e: MouseEvent | TouchEvent) => void | boolean;
        'move'?: (e: MouseEvent | TouchEvent) => void | boolean;
        'up'?: (e: MouseEvent | TouchEvent) => void;
        'end'?: (e: MouseEvent | TouchEvent) => void;
    }): void;
    bindLong(e: MouseEvent | TouchEvent, long: (e: MouseEvent | TouchEvent) => void): void;
    'is': {
        'move': boolean;
    };
    bindMove(e: MouseEvent | TouchEvent, opt: {
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
        'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>) => void;
        'borderIn'?: (x: number, y: number, border: TCGBorder) => void;
        'borderOut'?: () => void;
    }): {
        'left': number;
        'top': number;
        'right': number;
        'bottom': number;
    };
    bindResize(e: MouseEvent | TouchEvent, opt: {
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
    findParentByClass(el: HTMLElement, cn: string | string[]): HTMLElement | null;
    siblings(e: HTMLElement, cn: string): HTMLElement | null;
}

/** --- 方向类型，从左上开始 --- */
type TCGBorder = 'lt' | 't' | 'tr' | 'r' | 'rb' | 'b' | 'bl' | 'l' | '' | { 'left': number; 'top'?: number; 'width': number; 'height'?: number; };

/** --- Element 的大小 --- */
interface ICGDomSize {
    'top': number;
    'right': number;
    'bottom': number;
    'left': number;
    'width': number;
    'height': number;
    'padding': {
        'top': number;
        'right': number;
        'bottom': number;
        'left': number;
    };
    'border': {
        'top': number;
        'right': number;
        'bottom': number;
        'left': number;
    };
    'clientHeight': number;
    'clientWidth': number;
    'innerWidth': number;
    'innerHeight': number;
    'scrollWidth': number;
    'scrollHeight': number;
}

interface ICGDomWatchDom {
    'observer': {
        observe(el: HTMLElement): void;
        disconnect(): void;
    };
    'size': ICGDomSize;
}
