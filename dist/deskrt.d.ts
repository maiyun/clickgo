declare class DeskRT {
    static version: string;
    static let: any;
    private static _asideWidth;
    static asideWidth: string;
    static init(opt: any): void;
    static go(path: string, callback?: (vm: any) => any): void;
    static goBack(): void;
    static setLocale(loc: string): Promise<void>;
    static loadScript(paths: string[]): Promise<void>;
    static loadLink(paths: string[]): Promise<void>;
    static arrayUnique(arr: any[]): any[];
    static purify(text: string): string;
    private static _purify;
    private static _purifyTxt;
    private static _purifyPre;
    static clone(obj: any): any;
    static trim(text: string): string;
    static html2escape(html: string): string;
    static sleep(timeout: number): Promise<void>;
    static highlight(dom: HTMLElement, code: string): void;
    static get(url: string): Promise<any>;
    static post(url: string, data: any): Promise<any>;
    static showMask(top?: boolean): void;
    static hideMask(): void;
    static showTextMask(text: string): void;
    static hideTextMask(): void;
}
declare class DeskRTTools {
    static pre: string;
    static end: string;
    static i18n: string;
    static locales: string[];
    static localePkg: string[];
    static localeObj: any;
    static frameVue: any;
    static vuex: Vuex.Store;
    static pages: any;
    static outPath: string[];
    static highlightjs: highlightjs;
    static popEle: HTMLDivElement;
    static mainEle: HTMLMainElement;
    static headEle: HTMLHeadElement;
    static onHashChange(): Promise<void>;
    static loadOutScript(path: string): Promise<void>;
    static loadOutLink(path: string): Promise<void>;
    static readLocale(key: string): string;
    static loadLocale(locale: string, pkg?: string, before?: () => any, after?: () => any): Promise<void>;
    static goCallback?: (vm: any) => any;
    static openPage(path: string): Promise<void>;
    static controlsInit(): void;
}
