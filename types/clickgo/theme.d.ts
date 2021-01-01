interface ICGThemeLib {
    'global': ICGThemePkg | null;
    'clickgoThemePkgs': Record<string, ICGThemePkg>;
    read(blob: Blob): Promise<false | ICGThemePkg>;
    revokeObjectURL(pkg: ICGThemePkg): void;
    load(taskId: number, path?: string): Promise<boolean>;
    remove(taskId: number, path: string): Promise<void>;
    clear(taskId: number): Promise<void>;
    setGlobal(file: Blob): Promise<void>;
    clearGlobal(): Promise<void>;
}

/** --- 主题对象 --- */
interface ICGThemePkg {
    'type': 'theme';
    /** --- 主题对象配置文件 --- */
    'config': ICGThemeConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob>;
    /** --- 已映射的 object url --- */
    'objectURLs': Record<string, string>;
}

/** --- 主题文件包的 config --- */
interface ICGThemeConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style': string;

    /** --- 将要加载的文件 --- */
    'files': string[];
}
