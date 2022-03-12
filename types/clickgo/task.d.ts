interface ICGTaskLib {
    'list': Record<number, ICGTask>;
    'lastId': number;

    get(tid: number): ICGTaskItem | null;
    getList(): Record<string, ICGTaskItem>;
    run(url: string | Blob, opt?: { 'runtime'?: Record<string, Blob | string>; 'icon'?: string; 'progress'?: boolean; }): Promise<number>;
    end(taskId: number): boolean;
    loadLocalData(taskId: number, name: string, data: Record<string, any>, pre?: string): void;
    createTimer(taskId: number, formId: number, fun: () => void | Promise<void>, delay: number, opt?: {
        'immediate'?: boolean;
        'scope'?: 'form' | 'task';
        'count'?: number;
    }): number;
    removeTimer(taskId: number, timer: number): void;
}

/** --- 单条任务对象 --- */
interface ICGTask {
    'id': number;
    'appPkg': ICGAppPkg;
    'customTheme': boolean;
    'local': {
        'name': string;
        'data': Record<string, Record<string, string>>;
    };
    'icon': string;
    'path': string;
    'permission': Record<string, any>;

    'controlPkgs': Record<string, ICGControlPkg>;
    'themePkgs': Record<string, ICGThemePkg>;

    'forms': Record<number, ICGForm>;
    'files': Record<string, Blob | string>;
    'objectURLs': Record<string, string>;
    'initControls': Record<string, { 'layout': string; 'prep': string; }>;
    'timers': Record<number, number>;
}

/** --- Task Item 的简略情况，通常在 list 当中 --- */
interface ICGTaskItem {
    'name': string;
    'customTheme': boolean;
    'localName': string;
    'formCount': number;
    'icon': string;
    'path': string;
}
