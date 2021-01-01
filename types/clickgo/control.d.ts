interface ICGControlLib {
    'clickgoControlPkgs': Record<string, ICGControlPkg>;
    read(blob: Blob): Promise<false | ICGControlPkg>;
    revokeObjectURL(pkg: ICGControlPkg): void;
}

/** --- 控件文件包 --- */
interface ICGControlPkg {
    [name: string]: ICGControl;
}

/** --- 控件对象 --- */
interface ICGControl {
    'type': 'control';
    /** --- 控件对象配置文件 --- */
    'config': ICGControlConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob>;
    /** --- 已映射的 object url --- */
    'objectURLs': Record<string, string>;
}

/** --- 控件文件包的 config --- */
interface ICGControlConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 不带扩展名，系统会在末尾添加 .js --- */
    'code': string;
    /** --- 不带扩展名，系统会在末尾添加 .html --- */
    'layout': string;
    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style': string;

    /** --- 将要加载的文件 --- */
    'files': string[];
}
