export declare function blob2DataUrl(blob: Blob): Promise<string>;
export declare function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blob2Text(blob: Blob): Promise<string>;
export declare function clone(obj: Record<string, any> | any[]): any[] | any;
export declare function sleep(ms?: number): Promise<void>;
export declare function purify(text: string): string;
export declare function isControlPkg(o: string | any): o is ICGControlPkg;
export declare function isAppPkg(o: string | any): o is ICGAppPkg;
export declare function parseUrl(url: string): ICGUrl;
export declare function urlResolve(from: string, to: string): string;
export declare function styleUrl2ObjectOrDataUrl(path: string, style: string, obj: ICGTask | ICGControl | ICGThemePkg, mode?: 'object' | 'data'): Promise<string>;
export declare function layoutInsertAttr(layout: string, insert: string, opt?: {
    'ignore'?: RegExp[];
    'include'?: RegExp[];
}): string;
export declare function layoutClassPrepend(layout: string, rand?: string[]): {
    'rand': string[];
    'layout': string;
};
export declare function stylePrepend(style: string, rand?: string): {
    'style': string;
    'rand': string;
};
export declare function getMimeByPath(path: string): {
    'mime': string;
    'ext': string;
};
export declare function createObjectURL(object: Blob): string;
export declare function revokeObjectURL(url: string): void;
export declare function getObjectURLList(): string[];
export declare function rand(min: number, max: number): number;
