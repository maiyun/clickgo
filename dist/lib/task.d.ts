export declare let list: Record<number, ICGTask>;
export declare let lastId: number;
export declare function run(url: string | Blob | ICGAppPkg, opt?: {
    'runtime'?: Record<string, Blob>;
}): Promise<number>;
export declare function end(taskId: number): boolean;
