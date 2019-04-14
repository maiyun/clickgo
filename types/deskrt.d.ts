declare namespace deskrt {
    const version: string;
    let c: any;
    function loadResource(paths: string[]): Promise<{}>;
    function removeResource(paths: string[]): void;
    function loadScript(paths: string[]): Promise<void>;
    function setTheme(theme: string, mask?: boolean): Promise<void>;
    function setLocale(loc: string): Promise<void>;
    function setAsideWidth(width: string): void;
    function arrayUnique(arr: any[]): any[];
    function html2escape(html: string): string;
    function highlight(dom: HTMLElement, code: string): void;
    function purify(text: string): string;
    function sleep(timeout: number): Promise<void>;
    function clone(obj: any): any;
    function showMask(top?: boolean): void;
    function hideMask(): void;
    function showTextMask(text: string): void;
    function hideTextMask(): void;
    function alert(text: string): Promise<boolean>;
    function confirm(text: string): Promise<boolean>;
    let goCallback: (vm?: any) => any;
    function go(path: string, callback?: (vm?: any) => any): void;
    function goBack(): void;
    function get(url: string): Promise<any>;
    function post(url: string, data: any): Promise<any>;
}

declare module "deskrt" {
    export = deskrt;
}