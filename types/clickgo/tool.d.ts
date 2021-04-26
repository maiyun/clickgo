interface ICGToolLib {
    blob2DataUrl(blob: Blob): Promise<string>;
    file2ObjectUrl(file: string, obj: ICGTask | ICGControl | ICGThemePkg): string | null;
    blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
    blob2Text(blob: Blob): Promise<string>;
    clone(obj: Record<string, any> | any[]): any[] | any;
    sleep(ms?: number): Promise<void>;
    requestAnimationFrame(): Promise<void>;
    purify(text: string): string;
    isControlPkg(o: string | any): o is ICGControlPkg;
    isAppPkg(o: string | any): o is ICGAppPkg;
    parseUrl(url: string): ICGUrl;
    urlResolve(from: string, to: string): string;
    styleUrl2ObjectOrDataUrl(path: string, style: string, obj: ICGTask | ICGControl | ICGThemePkg, mode?: 'object' | 'data'): Promise<string>;
    layoutInsertAttr(layout: string, insert: string, opt?: { 'ignore'?: RegExp[]; 'include'?: RegExp[]; }): string;
    layoutClassPrepend(layout: string, preps?: string[]): { 'preps': string[]; 'layout': string; };
    stylePrepend(style: string, prep?: string): { 'style': string; 'prep': string; };
    getMimeByPath(path: string): { 'mime': string; 'ext': string; };
    createObjectURL(object: Blob): string;
    revokeObjectURL(url: string): void;
    getObjectURLList(): string[];
    rand(min: number, max: number): number;
    getBoolean(param: boolean | string | number): boolean;
}

interface ICGUrl {
    auth: string | null;
    hash: string | null;
    host: string | null;
    hostname: string | null;
    pass: string | null;
    path: string | null;
    pathname: string;
    protocol: string | null;
    port: string | null;
    query: string | null;
    user: string | null;
}
