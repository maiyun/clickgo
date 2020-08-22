export declare let global: ITheme | null;
export declare let clickgoThemes: Record<string, ITheme>;
export declare function readBlob(blob: Blob): Promise<false | ITheme>;
export declare function fetchClickGo(path: string): Promise<null | ITheme>;
export declare function load(path: string | ITheme, taskId: number, custom?: boolean): Promise<boolean>;
export declare function remove(path: string, taskId: number): Promise<void>;
export declare function clear(taskId: number, custom?: boolean): Promise<void>;
export declare function loadGlobal(file: string | ITheme): Promise<void>;
export declare function clearGlobal(): Promise<void>;
