/// <reference types="node" />
export declare function setGlobalTheme(file: Buffer): void;
export declare function loadTaskTheme(style: string, taskId: number): void;
export declare function clearTaskTheme(taskId: number): void;
export declare function pushStyle(style: string, taskId: number, formId?: number): void;
export declare function removeStyle(taskId: number, formId?: number): void;
export declare function purify(text: string): string;
export declare function parsePath(path: string): string;
export declare function isControlPkg(o: string | object): o is IControlPkg;
export declare function isAppPkg(o: string | object): o is IAppPkg;
export declare function controlBlob2Pkg(blob: Blob): Promise<false | IControlPkg>;
export declare function stylePrepend(style: string, rand?: string): {
    "rand": string;
    "style": string;
};
export declare function styleUrl2DataUrl(dirname: string, style: string, files: IFileList): Promise<string>;
export declare function layoutClassPrepend(layout: string, rand?: string[]): {
    "rand": string[];
    "layout": string;
};
export declare function changeFormFocus(formId?: number, vm?: IVue): void;
export declare function blob2DataUrl(blob: Blob): Promise<string>;
export declare function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
export declare function blob2Text(blob: Blob): Promise<string>;
