export declare let clickgoFiles: Record<string, Blob>;
export declare let clickgoControlPkgs: Record<string, IControlPkg>;
export declare let tasks: Record<number, ITask>;
export declare let lastTaskId: number;
export declare let globalEvents: IGlobalEvents;
export declare function trigger(name: TGlobalEvent, taskId?: number, formId?: number, opt?: {
    'title'?: string;
    'state'?: boolean;
    'icon'?: string;
}): void;
export declare function fetchClickGoFile(path: string): Promise<null | Blob>;
export declare function fetchClickGoControlPkg(path: string): Promise<null | IControlPkg>;
export declare function fetchApp(path: string): Promise<null | IAppPkg>;
export declare function runApp(path: string | IAppPkg, opt?: {
    'runtime'?: Record<string, Blob>;
}): Promise<number>;
export declare function endTask(taskId: number): boolean;
export declare function setGlobalCursor(type?: string): void;
