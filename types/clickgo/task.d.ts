interface ICGTaskLib {
    'list': Record<number, ICGTask>;
    'lastId': number;

    getList(): Record<string, ICGTaskItem>;
    run(url: string | Blob | ICGAppPkg, opt?: { 'runtime'?: Record<string, Blob | string>; }): Promise<number>;
    end(taskId: number): boolean;
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

    'controlPkgs': Record<string, ICGControlPkg>;
    'themePkgs': Record<string, ICGThemePkg>;

    'forms': Record<number, ICGForm>;
    'files': Record<string, Blob | string>;
    'objectURLs': Record<string, string>;
    'initControls': Record<string, { 'layout': string; 'prep': string; }>;
}

/** --- Task Item 的简略情况，通常在 list 当中 --- */
interface ICGTaskItem {
    'customTheme': boolean;
    'localName': string;
    'formCount': number;
}
