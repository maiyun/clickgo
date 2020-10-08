export declare function blob2DataUrl(blob: Blob): Promise<string>;
export declare function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blob2Text(blob: Blob): Promise<string>;
export declare function clone(obj: Record<string, any> | any[]): any[] | any;
export declare function sleep(ms?: number): Promise<void>;
export declare function createTaskStyleElement(taskId: number): void;
export declare function removeTaskStyleElement(taskId: number): void;
export declare function pushStyle(style: string, taskId: number, type?: 'controls' | 'global' | 'forms', formId?: number): void;
export declare function removeStyle(taskId: number, formId?: number): void;
export declare function purify(text: string): string;
export declare function trim(text: string): string;
export declare function parsePath(path: string): string;
export declare function isControlPkg(o: string | any): o is IControlPkg;
export declare function isAppPkg(o: string | any): o is IAppPkg;
export declare function controlBlob2Pkg(blob: Blob): Promise<false | IControlPkg>;
export declare function stylePrepend(style: string, rand?: string): {
    'rand': string;
    'style': string;
};
export declare function pathResolve(dir: string, path: string): string;
export declare function styleUrl2DataUrl(dir: string, style: string, files: Record<string, Blob>): Promise<string>;
export declare function layoutInsertAttr(layout: string, insert: string, opt?: {
    'ignore'?: RegExp[];
    'include'?: RegExp[];
}): string;
export declare function layoutClassPrepend(layout: string, rand?: string[]): {
    'rand': string[];
    'layout': string;
};
