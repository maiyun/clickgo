interface ICGTaskLib {
    'list': Record<number, ICGTask>;
    'lastId': number;

    run(url: string | Blob | ICGAppPkg, opt?: { 'runtime'?: Record<string, Blob>; }): Promise<number>;
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
    'files': Record<string, Blob>;
    'objectURLs': Record<string, string>;
    'initControls': Record<string, { 'layout': string; 'prep': string; }>;
}
