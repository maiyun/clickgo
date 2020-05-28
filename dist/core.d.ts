export declare function showCircular(x: number, y: number): Promise<void>;
export declare function showRectangle(x: number, y: number, pos: TBorderDir): Promise<void>;
export declare function moveRectangle(dir: TBorderDir): void;
export declare function hideRectangle(): void;
export declare function getPositionByBorderDir(dir: TBorderDir): {
    "width": number;
    "height": number;
    "left": number;
    "top": number;
};
export declare function trigger(name: TSystemEvent, taskId?: number, formId?: number, opt?: {
    "title"?: string;
    "state"?: boolean;
}): void;
export declare function fetchClickGoControl(path: string): Promise<boolean>;
export declare function fetchApp(path: string): Promise<null | IAppPkg>;
export declare function runApp(path: string | IAppPkg, opt?: {
    "runtime"?: IFileList;
    "onEnd"?: () => void;
}): Promise<false | number>;
export declare function createForm(opt: ICreateFormOptions): Promise<false | IForm>;
export declare function removeForm(formId: number): boolean;
export declare function endTask(taskId: number): boolean;
export declare function bindMove(e: MouseEvent | TouchEvent, opt: {
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
}): void;
export declare function bindResize(e: MouseEvent | TouchEvent, opt: {
    "left": number;
    "top": number;
    "width": number;
    "height": number;
    "minWidth"?: number;
    "minHeight"?: number;
    "offsetObject"?: HTMLElement;
    "dir": TBorderDir;
    "move"?: (left: number, top: number, width: number, height: number) => void;
    "end"?: () => void;
}): void;
export declare function setGlobalCursor(type?: string): void;
