interface DeskUIOptions {
    cursor?: boolean;
    urlPrefix?: string;
    jsUrlPrefix?: string;
    navMenuPath?: string;
    mainPath?: string;
}
declare class DeskUI {
    static version: string;
    private static _DPR;
    private static _ZOOM;
    private static _cursor;
    private static _urlPrefix;
    private static _jsUrlPrefix;
    private static _navMenuPath;
    private static _mainPath;
    static isMobile: boolean;
    static init(opt: DeskUIOptions, fun?: () => void): void;
    private static _open(hash);
    static __error(classes: string, msg: string): void;
    private static _reDPR();
}
declare class Http {
    static get(url?: string, success?: (text?: string) => void, error?: (ex?: any) => void): void;
    static post(url?: string, data?: any, success?: (text?: string) => void, error?: (ex?: any) => void): void;
    static ajax(url?: string, data?: any): void;
}
declare class Control {
    __dom: ZeptoCollection;
    static get(id: string, hashId?: string): Control;
    on(event: string, fun: () => void): void;
    protected static getNode(text: string | Element): Element;
    protected static initAttr(node: Element, hashId: string, before?: any): string;
    protected static initClass(node: Element, hashId: string): string;
    protected static renderContainer(node: Element, hashId: string): string;
}
declare class NavMenu extends Control {
    static get(id: string, hashId?: string): NavMenu;
    static render(node: Element | string): string;
    static mobileHide(): void;
    static mobileShow(): void;
    static clearAllSelected(): void;
    static ifIsChildThenShow($item: ZeptoCollection): void;
    static hideVisibleSub(): void;
}
declare class NavMenuItem extends Control {
    static get(id: string, hashId?: string): NavMenuItem;
    static render(node: Element | string, hasSub: boolean, hasChild: boolean): string;
}
declare class NavMenuSub extends Control {
    static get(id: string, hashId?: string): NavMenuSub;
    static render(node: Element | string, path: string): string;
}
declare class NavMenuSubItem extends Control {
    static get(id: string, hashId?: string): NavMenuSubItem;
    static render(node: Element | string): string;
}
declare class NavMenuChild extends Control {
    static get(id: string, hashId?: string): NavMenuChild;
    static render(node: Element | string, htmlRightMenu: string[]): string;
}
declare class NavMenuChildItem extends Control {
    static get(id: string, hashId?: string): NavMenuChildItem;
    static render(node: Element | string, hasSub: boolean): string;
}
declare class Page extends Control {
    static get(id: string, hashId?: string): Page;
    static render(node: Element | string, hash: string, hashId: string): string;
}
declare class FlexRow extends Control {
    static get(id: string, hashId?: string): FlexRow;
    static render(node: Element, hashId: string): string;
}
declare class FlexColumn extends Control {
    static get(id: string, hashId?: string): FlexColumn;
    static render(node: Element, hashId: string): string;
}
declare class FlexWrap extends Control {
    static get(id: string, hashId?: string): FlexWrap;
    static render(node: Element, hashId: string): string;
}
declare class Label extends Control {
    static get(id: string, hashId?: string): Label;
    static render(node: Element, hashId: string): string;
}
declare class Button extends Control {
    static get(id: string, hashId?: string): Button;
    static render(node: Element, hashId: string): string;
}
declare class Tag extends Control {
    static get(id: string, hashId?: string): Tag;
    static render(node: Element, hashId: string): string;
}
declare class Content extends Control {
    static get(id: string, hashId?: string): Content;
    static render(node: Element, hashId: string): string;
}
declare class Style {
    static compiler(text: string, hashId?: string): string;
}
