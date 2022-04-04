interface ICGFormLib {
    'taskInfo': ICGFormTaskInfo;
    setTask(taskId: number, formId: number): boolean;
    clearTask(taskId: number): boolean;
    refreshTaskPosition(): void;
    getAvailArea(): ICGFormAvailArea;
    refreshMaxPosition(): void;
    getTaskId(formId: number): number;
    min(formId: number): boolean;
    get(formId: number): ICGFormItem | null;
    send(formId: number, obj: Record<string, any>): void;
    getList(taskId: number): Record<string, ICGFormItem>;
    changeFocus(formId?: number): void;
    getMaxZIndexFormID(out?: {
        'taskIds'?: number[];
        'formIds'?: number[];
    }): number | null;
    getRectByBorder(border: TCGBorder): {
        'width': number;
        'height': number;
        'left': number;
        'top': number;
    };
    showCircular(x: number, y: number): void;
    moveRectangle(border: TCGBorder): void;
    showRectangle(x: number, y: number, border: TCGBorder): void;
    hideRectangle(): void;
    notify(opt: {
        'title': string;
        'content': string;
        'icon'?: string;
        'timeout'?: number;
        'type'?: 'primary' | 'info' | 'warning' | 'danger' | 'progress';
        'progress'?: boolean;
    }): number;
    notifyProgress(notifyId: number, per: number): void;
    hideNotify(notifyId: number): void;
    'simpletaskRoot': IVue;
    appendToPop(el: HTMLElement): void;
    removeFromPop(el: HTMLElement): void;
    showPop(el: HTMLElement, pop: HTMLElement | undefined, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt?: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; }): void;
    hidePop(pop?: HTMLElement | undefined | null): void;
    doFocusAndPopEvent(e: MouseEvent | TouchEvent): void;
    remove(formId: number): boolean;
    create(taskId: number, opt: ICGFormCreateOptions): Promise<number | ICGForm>;
}

/** --- 窗体对象 --- */
interface ICGForm {
    'id': number;
    'vapp': IVueApp;
    'vroot': IVForm;
    'win': Electron.BrowserWindow | null;
    'events': Record<string, (...any: any) => void | Promise<void>>;
}

/** --- 窗体创建选项 --- */
interface ICGFormCreateOptions {
    'file'?: string;

    'path'?: string; // --- 相当于 base dir，有 file 以 file 为准，没有则以 path 为准，用于定义当前 form 中文件所在的基准路径 ---
    'code'?: Record<string, any>;
    'layout'?: string;
    'style'?: string;

    'topMost'?: boolean;
}

/** --- Dialog 选项 --- */
interface ICGFormDialog {
    'title'?: string;
    'content': string;
    'buttons'?: string[];
    'select'?: (e: Event, button: string) => void;
}

/** --- Form Item 的简略情况，通常在 list 当中 --- */
interface ICGFormItem {
    'taskId': number;
    'title': string;
    'icon': string;
    'stateMax': boolean;
    'stateMin': boolean;
    'show': boolean;
    'focus': boolean;
}

/** --- Task 任务条的相关信息 --- */
interface ICGFormTaskInfo {
    'taskId': number;
    'formId': number;
    'length': number;
}

/** --- 屏幕可用区域 --- */
interface ICGFormAvailArea {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
}

interface IVForm extends IVue {
    /** --- 当前任务 id --- */
    'taskId': number;
    /** --- 当前窗体 id --- */
    'formId': number;
    /** --- 控件名 --- */
    'controlName': 'root';
    /** --- 当前窗体是否有焦点 --- */
    'cgFocus': boolean;
    /** --- 当前窗体的路径 --- */
    'cgPath': string;
    /** --- 前导 --- */
    'cgPrep': string;
    /** --- 是否 form 自定义的 zindex --- */
    'cgCustomZIndex': boolean;
    /** --- 是否在顶层 --- */
    'cgTopMost': boolean;
    /** --- 当前的 locale name --- */
    'cgLocale': string;
    /** --- 获取语言内容 --- */
    'l': (key: string) => string;
    cgCreateForm(paramOpt?: string | ICGFormCreateOptions & { 'mask'?: boolean; }): Promise<number>;
    cgClose(): void;
    cgMax(): void;
    cgMin(): void;
    cgBindFormDrag(e: MouseEvent | TouchEvent): void;
    cgBindFormResize(e: MouseEvent | TouchEvent, border: TCGBorder): void;
    cgSetSystemEventListener(name: 'screenResize', func: () => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'configChanged', func: (n: TCGCoreConfigName, v: string | boolean | null) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'error', func: (taskId: number, formId: number, error: Error, info: string) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formCreated' | 'formRemoved', func: (taskId: number, formId: number, title: string, icon: string) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formTitleChanged' | 'formIconChanged', func: (taskId: number, formId: number, text: string) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formStateMinChanged' | 'formStateMaxChanged' | 'formShowChanged', func: (taskId: number, formId: number, state: boolean) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'formFocused' | 'formBlurred' | 'formFlash', func: (taskId: number, formId: number) => void | Promise<void>): void;
    cgSetSystemEventListener(name: 'taskStarted' | 'taskEnded', func: (taskId: number) => void | Promise<void>): void;
    cgRemoveSystemEventListener(name: TCGGlobalEvent): void;
    cgDialog(opt: string | ICGFormDialog): Promise<string>;
    cgConfirm(content: string, cancel?: boolean): Promise<boolean | number>;
    cgGetFile(path: string): Promise<Blob | string | null>;
    cgGetObjectUrl(file: string): string | null;
    cgGetDataUrl(file: string): Promise<string | null>;
    cgLoadTheme(path: string): Promise<boolean>;
    cgRemoveTheme(path: string): Promise<void>;
    cgSetTheme(path: string): Promise<void>;
    cgClearTheme(): Promise<void>;
    cgSetGlobalTheme(path: string | Blob): Promise<void>;
    cgClearGlobalTheme(): Promise<void>;
    cgSetTopMost(top: boolean): void;
    cgFlash(): void;
    cgShow(): void;
    cgHide(): void;
    cgLoadLocale(name: string, path: string): Promise<boolean>;
    cgSetLocale(name: string, path: string): Promise<boolean>;
    cgClearLocale(): void;
    cgLoadLocaleData(name: string, data: Record<string, any>, pre?: string): void;
    cgSetLocaleName(name: string): void;
    cgClearLocaleName(): void;
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
