interface ICgConfig {
    "left"?: number;
    "top"?: number;
    "offsetWidth"?: number;
    "offsetHeight"?: number;
}
declare const ClickGo: {
    "rootPath": string;
    "cgRootPath": string;
    "hasTouch": boolean;
    "zoom": number;
    "rzoom": number;
    "errorHandler": ((taskId: number, formId: number, error: any, info: string) => void) | null;
    "screenResizeHandler": (() => void | Promise<void>) | null;
    "formCreatedHandler": ((taskId: number, formId: number, title: string, icon: string) => void | Promise<void>) | null;
    "formRemovedHandler": ((taskId: number, formId: number, title: string, icno: string) => void | Promise<void>) | null;
    "formTitleChangedHandler": ((taskId: number, formId: number, title: string) => void | Promise<void>) | null;
    "formIconChangedHandler": ((taskId: number, formId: number, icon: string) => void | Promise<void>) | null;
    "formStateMinChangedHandler": ((taskId: number, formId: number, state: boolean) => void | Promise<void>) | null;
    "formStateMaxChangedHandler": ((taskId: number, formId: number, state: boolean) => void | Promise<void>) | null;
    "formFocusedHandler": ((taskId: number, formId: number) => void | Promise<void>) | null;
    "formBlurredHandler": ((taskId: number, formId: number) => void | Promise<void>) | null;
    "taskStartedHandler": ((taskId: number) => void | Promise<void>) | null;
    "taskEndedHandler": ((taskId: number) => void | Promise<void>) | null;
    "taskId": number;
    "taskList": Record<number, ITask>;
    "formId": number;
    "zIndex": number;
    "_readyList": Array<() => void | Promise<void>>;
    "_core": any;
    "_loaderConfig": {
        "after"?: string;
        "paths"?: IPaths;
    };
    "_config": ICgConfig;
    showCircular: (x: number, y: number) => void;
    showRectangle: (x: number, y: number, pos: TBorderDir) => Promise<void>;
    moveRectangle: (dir: TBorderDir) => void;
    hideRectangle: () => void;
    getPositionByBorderDir: (dir: TBorderDir) => {
        "width": number;
        "height": number;
        "left": number;
        "top": number;
    };
    trigger: (name: TSystemEvent, taskId?: number, formId?: number, opt?: {
        "title"?: string;
        "state"?: boolean;
        "icon"?: string;
    }) => void;
    loaderConfig: (config: {
        "after"?: string;
        "paths"?: IPaths;
    }) => void;
    config: (config: ICgConfig) => void;
    getLeft: () => number;
    getTop: () => number;
    getWidth: () => number;
    getHeight: () => number;
    initRootPath: () => void;
    onReady: (cb: () => void | Promise<void>) => void;
    fetchClickGoControl: (path: string) => Promise<boolean>;
    fetchApp: (path: string) => Promise<null | IAppPkg>;
    runApp: (path: string | IAppPkg, opt?: {
        "runtime"?: IFileList;
    }) => Promise<false | number>;
    createForm: (opt: ICreateFormOptions) => Promise<false | IForm>;
    removeForm: (formId: number) => boolean;
    endTask: (taskId: number) => boolean;
    bindMove: (e: MouseEvent | TouchEvent, opt: {
        "left"?: number;
        "top"?: number;
        "right"?: number;
        "bottom"?: number;
        "offsetLeft"?: number;
        "offsetTop"?: number;
        "offsetRight"?: number;
        "offsetBottom"?: number;
        "objectLeft"?: number;
        "objectTop"?: number;
        "objectWidth"?: number;
        "objectHeight"?: number;
        "object"?: HTMLElement;
        "offsetObject"?: HTMLElement;
        "start"?: (x: number, y: number) => void | Promise<void> | boolean | Promise<boolean>;
        "move"?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void;
        "end"?: () => void;
        "borderIn"?: (x: number, y: number, border: TBorderDir) => void;
        "borderOut"?: () => void;
    }) => void;
    bindResize: (e: MouseEvent | TouchEvent, opt: {
        "left": number;
        "top": number;
        "width": number;
        "height": number;
        "minWidth"?: number;
        "minHeight"?: number;
        "offsetObject"?: HTMLElement;
        "dir": TBorderDir;
        "start"?: (x: number, y: number) => void | Promise<void> | boolean | Promise<boolean>;
        "move"?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void;
        "end"?: () => void;
    }) => void;
    setGlobalCursor: (type?: string) => void;
    [name: string]: any;
};
