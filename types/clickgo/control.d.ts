interface ICGControlLib {
    'clickgoControlPkgs': Record<string, TCGControlPkg>;
    read(blob: Blob): Promise<false | TCGControlPkg>;
    revokeObjectURL(pkg: TCGControlPkg): void;
}

/** --- 控件文件包 --- */
type TCGControlPkg = Record<string, ICGControl>;

/** --- 控件对象 --- */
interface ICGControl {
    'type': 'control';
    /** --- 控件对象配置文件 --- */
    'config': ICGControlConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
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

interface IVControl extends IVue {
    '$parent': IVControl | null;

    /** --- 当前窗体是否有焦点 --- */
    'cgFocus': boolean;
    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /** --- 控件名 --- */
    'controlName': string;
    /** --- 窗体基目录 --- */
    'cgPath': string;
    /** --- 控件前导 --- */
    'cgPrep': string;
    /** --- 获取目前现存的子 slots --- */
    'cgSlots': (name?: string) => IVueVNode[];
    /** --- 当前 task 的 locale 值 --- */
    'cgLocale': string;
    /** --- 获取语言内容 --- */
    'l': (key: string, data?: Record<string, Record<string, string>>) => string;
    /** --- 根据 control name 来寻找上级 --- */
    'cgParentByName': (controlName: string) => IVControl;
    /**
     * --- 关闭窗体 ---
     */
    cgClose(): void;
    /**
     * --- 改变窗体大小---
     * @param e mouse 或者 touch
     * @param border border 方向
     */
    cgBindFormResize(e: MouseEvent | TouchEvent, border: TCGBorder): void;
    /**
     * --- 控件默认的 up 事件绑定 ---
     * @param e 鼠标或触摸事件对象
     */
    cgGetFile(this: IVue, path: string): Promise<Blob | string | null>;
    /**
     * --- 根据文件路径获取 object url，不支持 /clickgo/ 路径 ---
     * @param file 当前 task 文件路径
     */
    cgGetObjectUrl(file: string): string | null;
    /**
     * --- 根据路径获取当前应用的文件 dataurl 字符串 ---
     * @param file  文件路径
     */
    cgGetDataUrl(file: string): Promise<string | null>;
    /**
     * --- layout 中 :class 的转义 ---
     * @param cla class 内容对象
     */
    cgClassPrepend(cla: any): string;
    /**
     * --- 创建 timer ---
     * @param fun 执行的函数
     * @param delay 间隔时间
     * @param opt 选项
     */
    cgCreateTimer(fun: () => void | Promise<void>, delay: number, opt?: {
        'immediate'?: boolean;
        'scope'?: 'form' | 'task';
        'count'?: number;
    }): number;
    /**
     * --- 移除 timer ---
     * @param timer 要移除的 timer number ---
     */
    cgRemoveTimer(timer: number): void;
    /**
     * --- sleep 一段时间再执行 ---
     * @param fun 执行的函数
     * @param delay 间隔时间
     */
    cgSleep(fun: () => void | Promise<void>, delay: number): number;
    /**
     * --- 创建 frame listener ---
     * @param fun 执行的函数
     * @param opt 选项
     */
    cgOnFrame(fun: () => void | Promise<void>, opt?: { 'scope'?: 'form' | 'task'; 'count'?: number; }): number;
    /**
     * --- 移除 frame listene ---
     * @param ft timer ---
     */
    cgOffFrame(ft: number): void;
    /**
     * --- 检测事件是否可被执行 ---
     * @param e 事件
     */
    cgAllowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean;

}
