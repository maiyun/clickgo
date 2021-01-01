export declare let clickgoFiles: Record<string, Blob>;
export declare let globalEvents: ICGGlobalEvents;
export declare function trigger(name: TCGGlobalEvent, taskId?: number, formId?: number, opt?: {
    'title'?: string;
    'state'?: boolean;
    'icon'?: string;
}): void;
export declare function fetchClickGoFile(path: string): Promise<null | Blob>;
export declare function readApp(blob: Blob): Promise<false | ICGAppPkg>;
export declare function fetchApp(url: string): Promise<null | ICGAppPkg>;
