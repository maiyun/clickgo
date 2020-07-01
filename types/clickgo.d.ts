/** --- 主题对象 --- */
interface ITheme {
    "type": "theme";
    /** --- 主题对象配置文件 --- */
    "config": IThemeConfig;
    /** --- 所有已加载的文件内容 --- */
    "files": IFileList;
}

/** --- 主题文件包的 config --- */
interface IThemeConfig {
    "name": string;
    "ver": number;
    "version": string;
    "author": string;

    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    "style": string;

    /** --- 将要加载的文件 --- */
    "files": string[];
}

/** --- 控件文件包 --- */
interface IControlPkg {
    [name: string]: IControl;
}

/** --- 控件对象 --- */
interface IControl {
    "type": "control";
    /** --- 控件对象配置文件 --- */
    "config": IControlConfig;
    /** --- 所有已加载的文件内容 --- */
    "files": IFileList;
}

/** --- 控件文件包的 config --- */
interface IControlConfig {
    "name": string;
    "ver": number;
    "version": string;
    "author": string;

    /** --- 不带扩展名，系统会在末尾添加 .js --- */
    "code": string;
    /** --- 不带扩展名，系统会在末尾添加 .html --- */
    "layout": string;
    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    "style": string;

    /** --- 将要加载的文件 --- */
    "files": string[];
}

/** --- 应用文件包 --- */
interface IAppPkg {
    "type": "app";
    /** --- 应用对象配置文件 --- */
    "config": IAppConfig;
    /** --- 所有已加载的文件内容 --- */
    "files": IFileList;
}

/** --- 应用文件包 config --- */
interface IAppConfig {
    "name": string;
    "ver": number;
    "version": string;
    "author": string;

    /** --- 将要加载的控件 --- */
    "controls": string[];
    /** --- 将自动加载的主题 --- */
    "theme"?: string[];
    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    "styleGlobal"?: string;
    /** --- 不带扩展名，系统会在末尾添加 .xml --- */
    "mainLayout": string;

    /** --- 将要加载的文件列表 --- */
    "files": string[];
}

/** --- 已加载文件列表 --- */
interface IFileList {
    [path: string]: Blob;
}

/** --- 窗体对象 --- */
interface IForm {
    "formId": number;
    "vue": IVue;
}

/** --- 单条任务对象 --- */
interface ITask {
    "taskId": number;
    "appPkg": IAppPkg;
    "formList": Record<number, IForm>;
}

/** --- 窗体创建选项 --- */
interface ICreateFormOptions {
    "file"?: string;
    "code"?: string;
    "layout"?: string;
    "style"?: string;

    "topMost"?: boolean;
    "taskId": number;
}

/** --- 系统事件类型 --- */
type TSystemEvent = "screenResize" | "formCreated" | "formRemoved" | "formIconChanged" | "formTitleChanged" | "formStateMinChanged" | "formStateMaxChanged" | "formFocused" | "formBlurred" | "formFlash" | "taskStarted" | "taskEnded";

/** --- 方向类型，从左上开始 --- */
type TBorderDir = "lt" | "t" | "tr" | "r" | "rb" | "b" | "bl" | "l" | "" | { "left": number; "top"?: number; "width": number; "height"?: number; };

/** --- DOM 的大小 --- */
interface IDomSize {
    "top": number;
    "right": number;
    "bottom": number;
    "left": number;
    "width": number;
    "height": number;
    "padding": {
        "top": number;
        "right": number;
        "bottom": number;
        "left": number;
    };
    "border": {
        "top": number;
        "right": number;
        "bottom": number;
        "left": number;
    };
    "clientHeight": number;
    "clientWidth": number;
}

