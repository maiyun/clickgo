/**
 * Copyright 2020 Han Guoshuai <zohegs@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// --- 优化手机点击行为 ---
document.addEventListener("touchstart", function() {
    return;
});

/** --- 配置项定义 --- */
interface ICgConfig {
    "left"?: number;
    "top"?: number;
    "offsetWidth"?: number;
    "offsetHeight"?: number;
}

/** --- ClickGo 全局对象 --- */
const ClickGo: {
    /** --- 当前请求页面的基路径 --- */
    "rootPath": string;
    /** --- 当前 JS 文件的基路径 --- */
    "cgRootPath": string;
    /** --- 是否有 touch 环境 --- */
    "hasTouch": boolean;
    /** --- 当前缩放情况 --- */
    "zoom": number;
    /** --- 需要扩大的像素，1 / zoom --- */
    "rzoom": number;
    /** --- 配置捕获 Vue 错误 --- */
    "errorHandler": ((taskId: number, formId: number, error: any, info: string) => void) | null;

    /** --- 当屏幕大小改变时触发的事件 --- */
    "screenResizeHandler": (() => void | Promise<void>) | null;
    /** --- 窗体被创建后触发 --- */
    "formCreatedHandler": ((taskId: number, formId: number, title: string, icon: string) => void | Promise<void>) | null;
    /** --- 窗体被移除后触发 --- */
    "formRemovedHandler": ((taskId: number, formId: number, title: string, icno: string) => void | Promise<void>) | null;
    /** --- 窗体标题被改变后触发 --- */
    "formTitleChangedHandler": ((taskId: number, formId: number, title: string) => void | Promise<void>) | null;
    /** --- 窗体图标被改变后触发 --- */
    "formIconChangedHandler": ((taskId: number, formId: number, icon: string) => void | Promise<void>) | null;
    /** --- 窗体最小化状态改变后触发 --- */
    "formStateMinChangedHandler": ((taskId: number, formId: number, state: boolean) => void | Promise<void>) | null;
    /** --- 窗体最大化状态改变后触发 --- */
    "formStateMaxChangedHandler": ((taskId: number, formId: number, state: boolean) => void | Promise<void>) | null;
    /** --- 窗体获得焦点后触发 --- */
    "formFocusedHandler": ((taskId: number, formId: number) => void | Promise<void>) | null;
    /** --- 窗体丢失焦点后触发 --- */
    "formBlurredHandler": ((taskId: number, formId: number) => void | Promise<void>) | null;
    /** --- 窗体闪烁时触发 --- */
    "formFlashHandler": ((taskId: number, formId: number) => void | Promise<void>) | null;
    /** --- 任务开始后触发 --- */
    "taskStartedHandler": ((taskId: number) => void | Promise<void>) | null;
    /** --- 任务结束后触发 --- */
    "taskEndedHandler": ((taskId: number) => void | Promise<void>) | null;

    /** --- 最后一个 task id --- */
    "taskId": number;
    /** --- 当前运行的程序 --- */
    "taskList": Record<number, ITask>;
    /** --- 最后一个窗体 id --- */
    "formId": number;
    /** --- 最后一个层级 --- */
    "zIndex": number;
    /** --- top 的最后一个层级 --- */
    "topZIndex": number;
    /** --- pop 最后一个层级 --- */
    "popZIndex": number;

    /** --- 要执行的 ready 列表 --- */
    "_readyList": Array<() => void | Promise<void>>;
    /** --- core --- */
    "_core": any;
    /** --- loader 的配置项 --- */
    "_loaderConfig": {
        "after"?: string;
        "paths"?: IPaths;
    };
    /** --- 配置项 --- */
    "_config": ICgConfig;
    /** --- 当前 pop 的 vue 对象 --- */
    "_pop": IVue | null;

    /**
     * --- 显示从小到大的圆圈动画特效对象 ---
     * @param x X 坐标
     * @param y Y 坐标
     */
    showCircular: (x: number, y: number) => void;

    /**
     * --- 显示从小到大的矩形动画特效对象 ---
     * @param x 起始位置
     * @param y 起始位置
     * @param pos 最大时位置代号
     */
    showRectangle: (x: number, y: number, pos: TBorderDir) => void;

    /**
     * --- 移动矩形到新位置 ---
     * @param dir 显示的位置代号
     */
    moveRectangle: (dir: TBorderDir) => void;

    /**
     * --- 结束时请隐藏矩形 ---
     */
    hideRectangle: () => void;

    /**
     * --- 根据 border dir 获取理论窗体大小 ---
     * @param dir 显示的位置代号
     */
    getPositionByBorderDir: (dir: TBorderDir) => { "width": number; "height": number; "left": number; "top": number; };

    /**
     * --- 将标签追加到 pop 层 ---
     * @param el 要追加的标签
     */
    appendToPop: (el: HTMLElement) => void;

    /**
     * --- 将标签从 pop 层移除 ---
     * @param el 要移除的标签
     */
    removeFromPop: (el: HTMLElement) => void;

    /**
     * --- 将 pop 显示出来 ---
     * @param el 要显示的 pop
     * @param left 要显示的 left
     * @param top 要显示的 top
     */
    showPop: (pop: IVue, x: number | HTMLElement, y?: number) => void;

    /**
     * --- 隐藏正在显示中的 pop ---
     */
    hidePop: (pop?: IVue | null) => void;

    /**
     * --- 查找指定 el 的同级 className ---
     * @param e 基准
     * @param cn 同级 classname
     */
    siblings: (e: HTMLElement, cn: string) => HTMLElement | null;

    /**
     * --- 将 cgt 主题设置到全局，之前的主题失效 ---
     * @param file cgt 文件的 blob
     */
    setTheme: (file: Blob) => Promise<void>;

    /**
     * --- 清除全局主题 ---
     */
    clearTheme: () => void;

    /**
     * --- 触发系统级事件 ---
     */
    trigger: (name: TSystemEvent, taskId?: number, formId?: number, opt?: { "title"?: string; "state"?: boolean; "icon"?: string; }) => void;

    /**
     * --- 设置 loader 的配置项 ---
     * @param config 配置项
     */
    loaderConfig: (config: {
        "after"?: string;
        "paths"?: IPaths;
    }) => void;

    /**
     * --- 设置配置项 ---
     * @param config 配置项
     */
    config: (config: ICgConfig) => void;

    /**
     * --- 获取可用左侧起点 ---
     */
    getLeft: () => number;

    /**
     * --- 获取可用顶部起点 ---
     */
    getTop: () => number;

    /**
     * --- 获取可用宽度 ---
     */
    getWidth: () => number;

    /**
     * --- 获取可用高度 ---
     */
    getHeight: () => number;

    /**
     * --- 初始化 rootPath ---
     */
    initRootPath: () => void;

    /**
     * --- 加载完毕执行的回调 ---
     * @param cb 回调函数
     */
    onReady: (cb: () => void | Promise<void>) => void;

    // --- 以下加载于 core ---

    /**
     * --- 从 cg 目录加载控件（若是已经加载的控件不会再次加载，若不是 cg 控件则直接成功） ---
     * @param path cg 路径，cgc 文件或以 / 结尾的目录 ---
     */
    fetchClickGoControl: (path: string) => Promise<boolean>;

    /**
     * --- 从网络加载应用（不能加载 capp 文件） ---
     * @param path 相对、绝对或 cg 路径，以 / 结尾的目录 ---
     */
    fetchApp: (path: string) => Promise<null | IAppPkg>;

    /**
     * --- 运行一个应用 ---
     * @param runtime 运行时要注入的文件列表（cg 文件默认被注入） ---
     */
    runApp: (path: string | IAppPkg, opt?: {
        "runtime"?: IFileList;
    }) => Promise<number>;

    /**
     * --- 直接创建一个窗体 ---
     * @param opt 创建窗体的配置对象
     */
    createForm: (opt: ICreateFormOptions) => Promise<number | IForm>;

    /**
     * --- 移除一个 form ---
     * @param formId 要移除的 form id
     */
    removeForm: (formId: number) => boolean;

    /**
     * --- 完全结束任务 ---
     * @param taskId 任务 id
     */
    endTask: (taskId: number) => boolean;

    /**
     * --- 绑定按下以及弹起事件 ---
     * @param e MouseEvent | TouchEvent
     * @param opt 回调选项
     */
    bindDown: (oe: MouseEvent | TouchEvent, opt: { "down"?: (e: MouseEvent | TouchEvent) => void; "start"?: (e: MouseEvent | TouchEvent) => void | boolean; "move"?: (e: MouseEvent | TouchEvent) => void | boolean; "up"?: (e: MouseEvent | TouchEvent) => void; "end"?: (e: MouseEvent | TouchEvent) => void; }) => void;

    /**
     * --- 绑定拖动事件 ---
     * @param e mousedown 或 touchstart 的 event
     * @param moveCb 拖动时的回调
     * @param endCb 结束时的回调
     */
    bindMove: (e: MouseEvent | TouchEvent, opt: { "left"?: number; "top"?: number; "right"?: number; "bottom"?: number; "offsetLeft"?: number; "offsetTop"?: number; "offsetRight"?: number; "offsetBottom"?: number; "objectLeft"?: number; "objectTop"?: number; "objectWidth"?: number; "objectHeight"?: number; "object"?: HTMLElement | IVue; "offsetObject"?: HTMLElement | IVue; "start"?: (x: number, y: number) => void | boolean; "move"?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void; "up"?: () => void; "end"?: () => void; "borderIn"?: (x: number, y: number, border: TBorderDir) => void; "borderOut"?: () => void; }) => { "left": number; "top": number; "right": number; "bottom": number; };

    /**
     * --- 绑定拖动改变大小事件 ---
     * @param e mousedown 或 touchstart 的 event
     * @param opt 选项
     * @param moveCb 拖动时的回调
     * @param endCb 结束时的回调
     */
    bindResize: (e: MouseEvent | TouchEvent, opt: { "left": number; "top": number; "width": number; "height": number; "minWidth"?: number; "minHeight"?: number; "offsetObject"?: HTMLElement; "dir": TBorderDir; "start"?: (x: number, y: number) => void | boolean; "move"?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void; "end"?: () => void; }) => void;

    /**
     * --- 设置全局鼠标样式 ---
     * @param type 样式或留空，留空代表取消
     */
    setGlobalCursor: (type?: string) => void;

    [name: string]: any;
} = {
    "rootPath": "",
    "cgRootPath": "",
    "hasTouch": "ontouchstart" in document.documentElement ? true : false,
    "zoom": 1,
    "rzoom": 1,
    "errorHandler": null,

    "screenResizeHandler": null,
    "formCreatedHandler": null,
    "formRemovedHandler": null,
    "formTitleChangedHandler": null,
    "formIconChangedHandler": null,
    "formStateMinChangedHandler": null,
    "formStateMaxChangedHandler": null,
    "formFocusedHandler": null,
    "formBlurredHandler": null,
    "formFlashHandler": null,
    "taskStartedHandler": null,
    "taskEndedHandler": null,

    "taskId": 0,
    "taskList": {},
    "formId": 0,
    "zIndex": 999,
    "topZIndex": 9999999,
    "popZIndex": 0,

    "_readyList": [],
    "_core": null,
    "_loaderConfig": {},
    "_config": {},
    "_pop": null,

    showCircular: function(x: number, y: number): void {
        this._core.showCircular(x, y);
    },

    showRectangle: function(x: number, y: number, pos: TBorderDir): void {
        return this._core.showRectangle(x, y, pos);
    },

    moveRectangle: function(dir: TBorderDir): void {
        return this._core.moveRectangle(dir);
    },

    hideRectangle: function(): void {
        return this._core.hideRectangle();
    },

    getPositionByBorderDir: function(dir: TBorderDir): { "width": number; "height": number; "left": number; "top": number; } {
        return this._core.getPositionByBorderDir(dir);
    },

    appendToPop: function(el: HTMLElement): void {
        this._core.appendToPop(el);
    },

    removeFromPop: function(el: HTMLElement): void {
        this._core.removeFromPop(el);
    },

    showPop: function(pop: IVue, x: number | HTMLElement, y: number = 0): void {
        this._core.showPop(pop, x, y);
    },

    hidePop: function(pop: IVue | null = null): void {
        this._core.hidePop(pop);
    },

    siblings: function(e: HTMLElement, cn: string): HTMLElement | null {
        return this._core.siblings(e, cn);
    },

    setTheme: async function(file: Blob): Promise<void> {
        await this._core.setTheme(file);
    },

    clearTheme: function(): void {
        this._core.clearTheme();
    },

    trigger: async function(name: TSystemEvent, taskId?: number, formId?: number, opt: { "title"?: string; "state"?: boolean; "icon"?: string; } = {}): Promise<void> {
        return await this._core.trigger(name, taskId, formId, opt);
    },

    loaderConfig: function(config: {
        "after"?: string;
        "paths"?: IPaths;
    }): void {
        this._loaderConfig = config;
    },

    config: function(config: ICgConfig): void {
        if (config.left) {
            this._config.left = config.left;
        }
        if (config.top) {
            this._config.top = config.top;
        }
        if (config.offsetWidth) {
            this._config.offsetWidth = config.offsetWidth;
        }
        if (config.offsetHeight) {
            this._config.offsetHeight = config.offsetHeight;
        }
    },

    getLeft: function(): number {
        return this._config.left ?? 0;
    },

    getTop: function(): number {
        return this._config.top ?? 0;
    },

    getWidth: function(): number {
        return window.innerWidth * ClickGo.rzoom + (this._config.offsetWidth ?? 0);
    },

    getHeight: function(): number {
        return window.innerHeight * ClickGo.rzoom + (this._config.offsetHeight ?? 0);
    },

    initRootPath: function() {
        let temp = document.querySelectorAll("head > script");
        let scriptEle = temp[temp.length - 1] as HTMLScriptElement;
        this.rootPath = window.location.href.slice(0, window.location.href.lastIndexOf("/") + 1);
        this.cgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf("/") + 1);
    },

    onReady: function(cb: () => void): void {
        this._readyList.push(cb);
    },

    // --- 以下加载于 core ---

    fetchClickGoControl: async function(path: string): Promise<boolean> {
        return await this._core.fetchClickGoControl(path);
    },

    fetchApp: async function(path: string): Promise<null | IAppPkg> {
        return await this._core.fetchApp(path);
    },

    runApp: async function(path: string | IAppPkg, opt?: {
        "runtime"?: IFileList;
        "onEnd"?: () => void;
    }): Promise<number> {
        return await this._core.runApp(path, opt);
    },

    createForm: async function(opt: ICreateFormOptions): Promise<number | IForm> {
        return await this._core.createForm(opt);
    },

    removeForm: function(formId: number): boolean {
        return this._core.removeForm(formId);
    },

    endTask: function(taskId: number): boolean {
        return this._core.endTask(taskId);
    },

    bindDown: function(oe: MouseEvent | TouchEvent, opt: { "down"?: (e: MouseEvent | TouchEvent) => void; "start"?: (e: MouseEvent | TouchEvent) => void | boolean; "move"?: (e: MouseEvent | TouchEvent) => void | boolean; "up"?: (e: MouseEvent | TouchEvent) => void; "end"?: (e: MouseEvent | TouchEvent) => void; }): void {
        return this._core.bindDown(oe, opt);
    },

    bindMove: function(e: MouseEvent | TouchEvent, opt: { "left"?: number; "top"?: number; "right"?: number; "bottom"?: number; "offsetLeft"?: number; "offsetTop"?: number; "offsetRight"?: number; "offsetBottom"?: number; "objectLeft"?: number; "objectTop"?: number; "objectWidth"?: number; "objectHeight"?: number; "object"?: HTMLElement | IVue; "offsetObject"?: HTMLElement | IVue; "start"?: (x: number, y: number) => void | Promise<void> | boolean | Promise<boolean>; "move"?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void; "end"?: () => void; "up"?: () => void; "borderIn"?: (x: number, y: number, border: TBorderDir) => void; "borderOut"?: () => void; }): { "left": number; "top": number; "right": number; "bottom": number; } {
        return this._core.bindMove(e, opt);
    },

    bindResize: function(e: MouseEvent | TouchEvent, opt: { "left": number; "top": number; "width": number; "height": number; "minWidth"?: number; "minHeight"?: number; "offsetObject"?: HTMLElement; "dir": TBorderDir; "start"?: (x: number, y: number) => void | Promise<void> | boolean | Promise<boolean>; "move"?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void; "end"?: () => void; }): void {
        return this._core.bindResize(e, opt);
    },

    setGlobalCursor: function(type?: string): void {
        return this._core.setGlobalCursor(type);
    }
};
ClickGo.initRootPath();

loader.ready(async function() {
    // --- 配置 loader ---
    loader.config(ClickGo._loaderConfig);
    // --- 加载库 ---
    let paths: string[] = [
        "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js"
    ];
    for (let path of paths) {
        if (!await loader.loadScript(document.getElementsByTagName("head")[0], path)) {
            alert("Librarys load failed.");
            return;
        }
    }
    // --- 配置 Vue 捕获错误 ---
    Vue.config.errorHandler = function(err: any, vm: IVue, info: string) {
        if (ClickGo.errorHandler) {
            ClickGo.errorHandler(vm.taskId, vm.formId, err, info);
        } else {
            throw err;
        }
    };
    // --- 加载 core 文件 ---
    let [core] = await loader.require(ClickGo.cgRootPath + "core") ?? [];
    if (!core) {
        alert("Core load failed.");
        return;
    }
    ClickGo._core = core;
    // --- 执行加载完毕的回调函数 ---
    for (let func of ClickGo._readyList) {
        await func();
    }
});

