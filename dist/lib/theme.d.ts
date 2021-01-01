export declare let global: ICGThemePkg | null;
export declare let clickgoThemePkgs: Record<string, ICGThemePkg>;
export declare function read(blob: Blob): Promise<false | ICGThemePkg>;
export declare function revokeObjectURL(pkg: ICGThemePkg): void;
export declare function load(taskId: number, path?: string): Promise<boolean>;
export declare function remove(taskId: number, path: string): Promise<void>;
export declare function clear(taskId: number): Promise<void>;
export declare function setGlobal(file: Blob): Promise<void>;
export declare function clearGlobal(): Promise<void>;
