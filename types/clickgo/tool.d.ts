interface ICGToolLib {
    file2ObjectUrl(file: string, obj: ICGTask | ICGControl | ICGThemePkg): string | null;
    blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer>;
    clone(obj: Record<string, any> | any[]): any[] | any;
    sleep(ms?: number): Promise<void>;
    purify(text: string): string;
    styleUrl2ObjectOrDataUrl(path: string, style: string, obj: ICGTask | ICGControl | ICGThemePkg, mode?: 'object' | 'data'): Promise<string>;
    layoutAddTagClassAndReTagName(layout: string, retagname: boolean): string;
    layoutInsertAttr(layout: string, insert: string, opt?: { 'ignore'?: RegExp[]; 'include'?: RegExp[]; }): string;
    layoutClassPrepend(layout: string, preps: string[]): string;
    stylePrepend(style: string, prep?: string): { 'style': string; 'prep': string; };
    getMimeByPath(path: string): { 'mime': string; 'ext': string; };
    createObjectURL(object: Blob): string;
    revokeObjectURL(url: string): void;
    getObjectURLList(): string[];
    rand(min: number, max: number): number;
    getBoolean(param: boolean | string | number): boolean;
    escapeHTML(html: string): string;
    includes(str: string, search: string | string[]): boolean;
    replace(text: string, search: string, replace: string): string;
    request(url: string, opt: ICGToolRequestOptions): Promise<null | any>;
    parseUrl(url: string): ILoaderUrl;
    urlResolve(from: string, to: string): string;
    blob2Text(blob: Blob): Promise<string>;
    blob2DataUrl(blob: Blob): Promise<string>;
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

interface ICGToolRequestOptions {
    'method'?: 'GET' | 'POST';
    'body'?: FormData;
    'timeout'?: number;
    'responseType'?: XMLHttpRequestResponseType;

    'uploadStart'?: (total: number) => void | Promise<void>;
    'uploadProgress'?: (loaded: number, total: number) => void | Promise<void>;
    'uploadEnd'?: () => void | Promise<void>;
    'start'?: (total: number) => void | Promise<void>;
    'end'?: () => void | Promise<void>;
    'progress'?: (loaded: number, total: number) => void | Promise<void>;
    'load'?: (res: any) => void | Promise<void>;
    'error'?: () => void | Promise<void>;
}
