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
import * as Tool from "./lib/Tool";

/** --- form list 的 div --- */
let formListElement: HTMLDivElement = document.createElement("div");
if (window.devicePixelRatio < 2) {
    ClickGo.zoom = 1 / window.devicePixelRatio;
    ClickGo.rzoom = 1 / ClickGo.zoom;
    formListElement.style.zoom = ClickGo.zoom.toString();
}
formListElement.classList.add("cg-form-list");
document.getElementsByTagName("body")[0].appendChild(formListElement);

/** --- pop list 的 div --- */
let popListElement: HTMLDivElement = document.createElement("div");
popListElement.classList.add("cg-pop-list");
document.getElementsByTagName("body")[0].appendChild(popListElement);

// --- 绑定 resize 事件 ---
window.addEventListener("resize", async function() {
    // --- 将所有已经最大化的窗体的大小重置 ---
    for (let i = 0; i < formListElement.children.length; ++i) {
        let el = formListElement.children.item(i) as HTMLElement;
        if (el.className.indexOf("cg-state-max") === -1) {
            continue;
        }
        let taskId = parseInt(el.getAttribute("data-task-id") as string);
        let formId = parseInt(el.getAttribute("data-form-id") as string);
        if (!ClickGo.taskList[taskId]) {
            continue;
        }
        let $vm = ClickGo.taskList[taskId].formList[formId].vue;
        $vm.$children[0].setPropData("width", ClickGo.getWidth() * ClickGo.rzoom);
        $vm.$children[0].setPropData("height", ClickGo.getHeight() * ClickGo.rzoom);
    }
    // --- 触发 screenResize 事件 ---
    trigger("screenResize");
});

// --- 绑定使焦点丢失的事件 ---
let lostFocusEvent = function(e: MouseEvent | TouchEvent): void {
    let target = e.target;
    if (!target) {
        return;
    }
    let element: HTMLElement | null = target as HTMLElement;
    while (element) {
        element = element.parentElement;
        if (!element) {
            break;
        }
        let cla = element.getAttribute("class");
        if (!cla) {
            continue;
        }
        if (cla.indexOf("cg-form-list") !== -1 || cla.indexOf("cg-pop-list") !== -1) {
            return;
        }
    }
    Tool.changeFormFocus();
};
if ("ontouchstart" in document.documentElement) {
    window.addEventListener("touchstart", lostFocusEvent);
} else {
    window.addEventListener("mousedown", lostFocusEvent);
}

// --- 从鼠标指针处从小到大缩放然后淡化的圆圈动画特效对象 ---
let circularElement: HTMLDivElement = document.createElement("div");
circularElement.style.zoom = ClickGo.zoom.toString();
circularElement.classList.add("cg-circular");
document.getElementsByTagName("body")[0].appendChild(circularElement);
/**
 * --- 显示从小到大的圆圈动画特效对象 ---
 * @param x X 坐标
 * @param y Y 坐标
 */
export async function showCircular(x: number, y: number): Promise<void> {
    circularElement.style.transition = "none";
    circularElement.style.width = "6px";
    circularElement.style.height = "6px";
    circularElement.style.left = x - 3 + "px";
    circularElement.style.top = y - 3 + "px";
    circularElement.style.opacity = "1";
    await new Promise(function(resove) {
        setTimeout(function() {
            resove();
        }, 10);
    });
    circularElement.style.transition = "all .3s ease-out";
    circularElement.style.width = "60px";
    circularElement.style.height = "60px";
    circularElement.style.left = x - 30 + "px";
    circularElement.style.top = y - 30 + "px";
    circularElement.style.opacity = "0";
}

// --- 从鼠标指针处开始从小到大缩放并铺满屏幕（或半个屏幕）的对象 ---
let rectangleElement: HTMLDivElement = document.createElement("div");
rectangleElement.style.zoom = ClickGo.zoom.toString();
rectangleElement.setAttribute("data-pos", "");
rectangleElement.classList.add("cg-rectangle");
document.getElementsByTagName("body")[0].appendChild(rectangleElement);
/**
 * --- 显示从小到大的矩形动画特效对象 ---
 * @param x 起始位置
 * @param y 起始位置
 * @param pos 最大时位置代号
 */
export async function showRectangle(x: number, y: number, pos: TBorderDir): Promise<void> {
    rectangleElement.style.transition = "none";
    rectangleElement.style.width = "20px";
    rectangleElement.style.height = "20px";
    rectangleElement.style.left = x - 10 + "px";
    rectangleElement.style.top = y - 10 + "px";
    rectangleElement.style.opacity = "1";
    rectangleElement.setAttribute("data-ready", "0");
    rectangleElement.setAttribute("data-dir", "");
    await new Promise(function(resove) {
        setTimeout(function() {
            resove();
        }, 10);
    });
    rectangleElement.style.transition = "all .2s ease-out";
    rectangleElement.setAttribute("data-ready", "1");
    moveRectangle(pos);
}

/**
 * --- 移动矩形到新位置 ---
 * @param dir 显示的位置代号
 */
export function moveRectangle(dir: TBorderDir): void {
    let dataReady = rectangleElement.getAttribute("data-ready") ?? "0";
    if (dataReady === "0") {
        return;
    }
    let dataDir = rectangleElement.getAttribute("data-dir") ?? "";
    let setDataDir = typeof dir === "string" ? dir : "o-" + dir.left + "-" + (dir.top ?? "n") + "-" + dir.width + "-" + (dir.height ?? "n");
    if (dataDir === setDataDir) {
        return;
    }
    rectangleElement.setAttribute("data-dir", setDataDir);
    let pos = getPositionByBorderDir(dir);
    let width = pos.width - 20;
    let height = pos.height - 20;
    let left = pos.left + 10;
    let top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width + "px";
        rectangleElement.style.height = height + "px";
        rectangleElement.style.left = left + "px";
        rectangleElement.style.top = top + "px";
    }
}

/**
 * --- 结束时请隐藏矩形 ---
 */
export function hideRectangle(): void {
    rectangleElement.style.opacity = "0";
}

/**
 * --- 根据 border dir 获取理论窗体大小 ---
 * @param dir 显示的位置代号
 */
export function getPositionByBorderDir(dir: TBorderDir): { "width": number; "height": number; "left": number; "top": number; } {
    let width!: number, height!: number, left!: number, top!: number;
    if (typeof dir === "string") {
        switch (dir) {
            case "lt": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
            case "t": {
                width = ClickGo.getWidth();
                height = ClickGo.getHeight();
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
            case "tr": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop();
                break;
            }
            case "r": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight();
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop();
                break;
            }
            case "rb": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "b": {
                width = ClickGo.getWidth();
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "bl": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "l": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight();
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
        }
    } else {
        width = dir.width;
        height = dir.height ?? ClickGo.getHeight();
        left = dir.left;
        top = dir.top ?? ClickGo.getTop();
    }
    return {
        "width": width,
        "height": height,
        "left": left,
        "top": top
    };
}

/**
 * --- 将标签追加到 pop 层 ---
 * @param el 要追加的标签
 */
export function appendToPop(el: HTMLElement): void {
    popListElement.appendChild(el);
}

/**
 * --- 将标签从 pop 层移除 ---
 * @param el 要移除的标签
 */
export function removeFromPop(el: HTMLElement): void {
    popListElement.removeChild(el);
}

/**
 * --- 将 cgt 主题设置到全局，之前的主题失效 ---
 * @param file cgt 文件的 blob
 */
export async function setTheme(file: Blob): Promise<void> {
    await Tool.setGlobalTheme(file);
}

/**
 * --- 清除全局主题 ---
 */
export function clearTheme(): void {
    Tool.clearGlobalTheme();
}

/** --- clickgo 已经加载的文件列表 --- */
let clickgoFiles: IFileList = {};

/**
 * --- 触发系统级事件 ---
 */
export function trigger(name: TSystemEvent, taskId: number = 0, formId: number = 0, opt: { "title"?: string; "state"?: boolean; "icon"?: string; } = {}): void {
    switch (name) {
        case "screenResize": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"]();
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]();
                    }
                }
            }
            break;
        }
        case "formCreated":
        case "formRemoved": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.title, opt.icon);
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.title, opt.icon);
                    }
                }
            }
            break;
        }
        case "formTitleChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.title);
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.title);
                    }
                }
            }
            break;
        }
        case "formIconChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.icon);
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.icon);
                    }
                }
            }
            break;
        }
        case "formStateMinChanged":
        case "formStateMaxChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.state);
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.state);
                    }
                }
            }
            break;
        }
        case "formFocused":
        case "formBlurred": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId);
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId);
                    }
                }
            }
            break;
        }
        case "taskStarted":
        case "taskEnded": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId);
            }
            for (let tTaskId in ClickGo.taskList) {
                for (let tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId);
                    }
                }
            }
            break;
        }
    }
}

/**
 * --- 从 cg 目录加载控件（若是已经加载的控件不会再次加载，若不是 cg 控件则直接成功） ---
 * @param path cg 路径，cgc 文件或以 / 结尾的目录 ---
 */
export async function fetchClickGoFile(path: string): Promise<null | Blob> {
    if (path.slice(0, 9) !== "/clickgo/") {
        return null;
    }
    path = path.slice(8);
    // --- 判断是否加载过 ---
    if (clickgoFiles[path]) {
        return clickgoFiles[path];
    }
    // --- 加载 clickgo 文件 ---
    try {
        clickgoFiles[path] = await (await fetch(ClickGo.cgRootPath + path.slice(1) + "?" + Math.random())).blob();
        return clickgoFiles[path];
    } catch {
        return null;
    }
}

/**
 * --- 从网络加载应用（不能加载 capp 文件） ---
 * @param path 相对、绝对或 cg 路径，以 / 结尾的目录 ---
 */
export async function fetchApp(path: string): Promise<null | IAppPkg> {
    if (path.slice(-1) !== "/") {
        return null;
    }
    let realPath = Tool.parsePath(path);
    // --- 加载 json 文件，并创建 control 信息对象 ---
    let config: IAppConfig;
    // --- 已加载的 files ---
    let files: IFileList = {};
    try {
        config = await (await fetch(realPath + "config.json?" + Math.random())).json();
        // --- 将预加载文件进行加载 ---
        for (let file of config.files) {
            if (file.slice(0, 9) === "/clickgo/") {
                let blob = await fetchClickGoFile(file);
                if (!blob) {
                    return null;
                }
                files[file] = blob;
            } else {
                let resp: Response = await fetch(realPath + file + "?" + Math.random());
                files[file] = await resp.blob();
            }
        }
    } catch {
        return null;
    }
    return {
        "type": "app",
        "config": config,
        "files": files
    };
}

/**
 * --- 运行一个应用 ---
 * @param runtime 运行时要注入的文件列表（cg 文件默认被注入） ---
 */
export async function runApp(path: string | IAppPkg, opt?: {
    "runtime"?: IFileList;
    "onEnd"?: () => void;
}): Promise<false | number> {
    opt = opt ?? {};
    opt.runtime = opt.runtime ?? {};

    let appPkg: IAppPkg | null;
    if (typeof path === "string") {
        if (!(appPkg = await fetchApp(path))) {
            return false;
        }
    } else {
        appPkg = path;
    }
    // --- app 的内置文件以及运行时文件 ---
    let files: IFileList = {};
    for (let fpath in appPkg.files) {
        files[fpath] = appPkg.files[fpath];
    }
    for (let fpath in opt.runtime) {
        files["/runtime" + fpath] = opt.runtime[fpath];
    }
    appPkg.files = files;
    // --- 创建任务对象 ---
    let taskId = ++ClickGo.taskId;
    ClickGo.taskList[taskId] = {
        "taskId": taskId,
        "appPkg": appPkg,
        "formList": {}
    };
    let task: ITask = ClickGo.taskList[taskId];
    // --- 创建 form ---
    let form = await createForm({
        "file": appPkg.config.mainLayout,
        "taskId": task.taskId
    });
    if (!form) {
        delete(ClickGo.taskList[taskId]);
        return false;
    }
    // --- 创建全局 style（如果 form 创建失败，就不用创建全局 style 了） ---
    if (appPkg.config.styleGlobal && appPkg.files[appPkg.config.styleGlobal + ".css"]) {
        let style = await Tool.blob2Text(appPkg.files[appPkg.config.styleGlobal + ".css"]);
        let r = Tool.stylePrepend(style, "cg-task" + task.taskId + "_");
        Tool.pushStyle(await Tool.styleUrl2DataUrl(appPkg.config.styleGlobal, r.style, files), task.taskId);
    }
    // --- 是否要加载特立独行的 theme ---
    if (appPkg.config.theme) {
        for (let theme of appPkg.config.theme) {
            let blob = appPkg.files[theme + ".cgt"];
            if (!blob) {
                continue;
            }
            await Tool.loadTaskTheme(blob, task.taskId);
        }
    }
    return task.taskId;
}

/**
 * --- 直接创建一个窗体 ---
 * @param opt 创建窗体的配置对象
 */
export async function createForm(opt: ICreateFormOptions): Promise<false | IForm> {
    /** --- 当前的 APP PKG --- */
    let appPkg: IAppPkg = ClickGo.taskList[opt.taskId].appPkg;
    // ---  申请 formId ---
    let formId = ++ClickGo.formId;
    /** --- 要 push 的本 form 的样式内容 --- */
    let formStyle: string = "";
    // --- 获取要定义的控件列表 ---
    let components: any = {};
    for (let controlPath of appPkg.config.controls) {
        let controlBlob = appPkg.files[controlPath + ".cgc"];
        if (!controlBlob) {
            return false;
        }
        let controlPkg = await Tool.controlBlob2Pkg(controlBlob);
        if (!controlPkg) {
            return false;
        }
        // --- 遍历控件包中的每一个控件 ---
        for (let name in controlPkg) {
            let item: IControl = controlPkg[name];
            // --- 准备相关变量 ---
            let props = {};
            let data: any = {};
            let methods: any = {};
            let computed = {};
            let watch = {};
            let mounted: (() => void) | null = null;
            let destroyed: (() => void) | undefined = undefined;
            // --- 检测是否有 js ---
            if (item.files[item.config.code + ".js"]) {
                let [expo] = await loader.requireMemory(item.config.code, item.files, {
                    "after": "?" + Math.random()
                }) ?? [];
                if (expo) {
                    props = expo.props || {};
                    data = expo.data || {};
                    methods = expo.methods || {};
                    computed = expo.computed || {};
                    watch = expo.watch || {};
                    mounted = expo.mounted || null;
                    destroyed = expo.destroyed;
                }
            }
            // --- 控件样式表 ---
            let rand = "";
            let styleBlob = item.files[item.config.style + ".css"];
            if (styleBlob) {
                let r = Tool.stylePrepend(await Tool.blob2Text(styleBlob));
                rand = r.rand;
                formStyle += await Tool.styleUrl2DataUrl(item.config.style, r.style, item.files);
            }
            // --- 要创建的 control 的 layout ---
            let layoutBlob = item.files[item.config.layout + ".html"];
            if (!layoutBlob) {
                return false;
            }
            // --- 给 layout 的 class 增加前置 ---
            let randList = [
                "cg-task" + opt.taskId + "_",
                "cg-theme-global-" + name + "_",
                "cg-theme-task" + opt.taskId + "-" + name + "_"
            ];
            if (rand !== "") {
                randList.push(rand);
            }
            let r = Tool.layoutClassPrepend(await Tool.blob2Text(layoutBlob), randList);
            let layout = Tool.purify(r.layout);
            // --- 组成 data ---
            data.taskId = opt.taskId;
            data.formId = formId;
            data.scope = data.scope || rand;
            // --- 预设 methods ---
            methods.down = function(this: IVue, e: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent && ClickGo.hasTouch) {
                    // --- 不能直接粗暴的 preventDefault，会导致无法获得焦点，也被禁止了 ---
                    e.preventDefault();
                    return;
                }
                e.stopPropagation();
                Tool.changeFormFocus(formId);
                this.$emit("down", event);
            };
            methods.tap = function(this: IVue, e: MouseEvent | TouchEvent) {
                e.stopPropagation();
                if (this.$el.className.indexOf("cg-disabled") !== -1) {
                    return;
                }
                this.$emit("tap");
            };
            // --- 获取文件 blob 对象 ---
            methods.getBlob = function(this: IVue, file: string): Blob | null {
                return ClickGo.taskList[this.taskId].appPkg.files[file] ?? null;
            };
            methods.getDataUrl = async function(this: IVue, file: string): Promise<string | null> {
                let f = ClickGo.taskList[this.taskId].appPkg.files[file];
                return f ? await Tool.blob2DataUrl(f) : null;
            };
            // --- 获取 form 控件的 vue 对象 ---
            methods.getFormObject = function(this: IVue): IVue {
                let par = this.$parent;
                while (par) {
                    if (par.controlName === "form") {
                        return par;
                    } else {
                        par = par.$parent;
                    }
                }
                return this;
            };
            // --- 组成 component ---
            components["cg-" + name] = {
                "template": layout,
                "props": props,
                "data": function() {
                    return Tool.clone(data);
                },
                "methods": methods,
                "computed": computed,
                "watch": watch,
                "mounted": function() {
                    this.$nextTick(function(this: IVue) {
                        if (mounted) {
                            mounted.call(this);
                        }
                    });
                },
                "destroyed": destroyed
            };
        }
    }
    // --- 获取 style、layout ---
    let style = opt.style;
    let layout = opt.layout;
    if (opt.file) {
        let layoutBlob = appPkg.files[opt.file + ".xml"];
        if (layoutBlob) {
            layout = await Tool.blob2Text(layoutBlob);
        }
        let styleBlob = appPkg.files[opt.file + ".css"];
        if (styleBlob) {
            style = await Tool.blob2Text(styleBlob);
        }
    }
    if (!layout) {
        return false;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let methods: any = {};
    let computed = {};
    let watch = {};
    let mounted: (() => void) | null = null;
    let destroyed: (() => void) | undefined = undefined;
    // --- 检测是否有 js ---
    if (appPkg.files[opt.file + ".js"]) {
        let [expo] = await loader.requireMemory(opt.file ?? "", appPkg.files, {
            "after": "?" + Math.random()
        }) ?? [];
        if (expo) {
            data = expo.data || {};
            methods = expo.methods || {};
            computed = expo.computed || {};
            watch = expo.watch || {};
            mounted = expo.mounted || null;
            destroyed = expo.destroyed;
        }
    }
    // --- 应用样式表 ---
    let rand = "";
    if (style) {
        let r = Tool.stylePrepend(style);
        rand = r.rand;
        style = await Tool.styleUrl2DataUrl("/", r.style, appPkg.files);
    }
    // --- 要创建的 form 的 layout ---
    layout = Tool.purify(layout.replace(/<(\/{0,1})(.+?)>/g, function(t, t1, t2): string {
        if (t2 === "template") {
            return t;
        } else {
            return "<" + t1 + "cg-" + t2 + ">";
        }
    }));
    // --- 给 layout 的 class 增加前置 ---
    let randList = ["cg-task" + opt.taskId + "_"];
    if (rand !== "") {
        randList.push(rand);
    }
    let r = Tool.layoutClassPrepend(layout, randList);
    formListElement.insertAdjacentHTML("beforeend", r.layout);
    // --- 获取刚才的 form 对象 ---
    let el: HTMLElement = formListElement.children.item(formListElement.children.length - 1) as HTMLElement;
    el.classList.add("cg-form-wrap");
    el.setAttribute("data-form-id", formId.toString());
    el.setAttribute("data-task-id", opt.taskId.toString());
    // --- 创建窗体对象 ---
    // --- 初始化系统初始 data ---
    data.taskId = opt.taskId;
    data.formId = formId;
    data.scope = data.scope || rand;
    data.focus = false;
    data.customZIndex = false;
    // --- 初始化系统方法 ---
    methods.createForm = async function(this: IVue, paramOpt: string | { "code"?: string; "layout": string; "style"?: string; }): Promise<void> {
        let inOpt: any = {
            "taskId": opt.taskId
        };
        if (typeof paramOpt === "string") {
            inOpt.file = paramOpt;
        } else {
            if (paramOpt.code) {
                inOpt.code = paramOpt.code;
            }
            if (paramOpt.layout) {
                inOpt.layout = paramOpt.layout;
            }
            if (paramOpt.style) {
                inOpt.style = paramOpt.style;
            }
        }
        await createForm(inOpt);
    };
    methods.closeForm = function(this: IVue): void {
        removeForm(this.formId);
    };
    methods.bindFormDrag = function(this: IVue, e: MouseEvent | TouchEvent): void {
        this.$children[0].moveMethod(e);
    };
    methods.setSystemEventListener = function(this: IVue, name: TSystemEvent, func: any): void {
        this.eventList[name] = func;
    };
    methods.removeSystemEventListener = function(this: IVue, name: TSystemEvent): void {
        delete(this.eventList[name]);
    };
    // --- 获取文件 blob 对象 ---
    methods.getBlob = function(this: IVue, file: string): Blob | null {
        return ClickGo.taskList[this.taskId].appPkg.files[file] ?? null;
    };
    methods.getDataUrl = async function(this: IVue, file: string): Promise<string | null> {
        let f = ClickGo.taskList[this.taskId].appPkg.files[file];
        return f ? await Tool.blob2DataUrl(f) : null;
    };
    // --- 加载主题 ---
    methods.loadTheme = async function(this: IVue, path: string | Blob): Promise<void> {
        await Tool.loadTaskTheme(path, this.taskId);
    };
    // --- 清除主题 ---
    methods.clearTheme = function(this: IVue): void {
        Tool.clearTaskTheme(this.taskId);
    };
    // --- 加载全新主题（老主题会被清除） ---
    methods.setTheme = async function(this: IVue, path: string | Blob): Promise<void> {
        Tool.clearTaskTheme(this.taskId);
        await Tool.loadTaskTheme(path, this.taskId);
    };
    let $vm: IVue | false = await new Promise(function(resolve) {
        new Vue({
            "el": el,
            "data": data,
            "methods": methods,
            "computed": computed,
            "watch": watch,
            "components": components,

            "mounted": function() {
                this.$nextTick(function(this: IVue) {
                    if (this.$el.getAttribute !== undefined) {
                        resolve(this);
                    } else {
                        if (this.$el.parentNode) {
                            formListElement.removeChild(this.$el);
                        }
                        resolve(false);
                    }
                });
            },
            "destroyed": destroyed
        });
    });
    if (!$vm) {
        return false;
    }
    // --- 全局事件来遍历执行的响应 ---
    $vm.eventList = {};
    // --- 部署 css ---
    if (formStyle !== "") {
        // --- 将这些窗体的样式追加到网页 ---
        Tool.pushStyle(formStyle, opt.taskId, formId);
    }
    if (style) {
        // --- 窗体的 style ---
        Tool.pushStyle(style, opt.taskId, formId);
    }
    // --- 将窗体居中 ---]
    if (!$vm.$children[0].stateMaxData) {
        if ($vm.$children[0].left === -1) {
            $vm.$children[0].setPropData("left", (ClickGo.getWidth() - $vm.$el.offsetWidth) / 2);
        }
        if ($vm.$children[0].top === -1) {
            $vm.$children[0].setPropData("top", (ClickGo.getHeight() - $vm.$el.offsetHeight) / 2);
        }
    }
    if ($vm.$children[0].zIndex !== -1) {
        $vm.customZIndex = true;
    }
    // --- 执行 mounted ---
    if (mounted) {
        try {
            mounted.call($vm);
        } catch(err) {
            formListElement.removeChild($vm.$el);
            Tool.removeStyle($vm.taskId, $vm.formId);
            if (ClickGo.errorHandler) {
                ClickGo.errorHandler($vm.taskId, $vm.formId, err, "Create form mounted error.");
            } else {
                console.log(err);
            }
            return false;
        }
    }
    // --- 绑定获取焦点事件 ---
    Tool.changeFormFocus(formId, $vm);
    let getFocusEvent = function(): void {
        Tool.changeFormFocus(formId);
    };
    if ("ontouchstart" in document.documentElement) {
        $vm.$el.addEventListener("touchstart", getFocusEvent);
    } else {
        $vm.$el.addEventListener("mousedown", getFocusEvent);
    }
    // --- 将 form 挂载到 task 当中 ---
    let form: IForm = {
        "formId": formId,
        "vue": $vm
    };
    // --- 挂载 form ---
    ClickGo.taskList[opt.taskId].formList[formId] = form;
    // --- 触发 formCreated 事件 ---
    trigger("formCreated", opt.taskId, formId, {"title": $vm.$children[0].title, "icon": $vm.$children[0].iconData});
    return form;
}

/**
 * --- 移除一个 form ---
 * @param formId 要移除的 form id
 */
export function removeForm(formId: number): boolean {
    // --- 获取要移除的窗体 element ---
    let formElement = formListElement.querySelector(`[data-form-id="${formId}"]`);
    if (!formElement) {
        return false;
    }
    // --- 获取 task id ---
    let taskIdAttr = formElement.getAttribute("data-task-id");
    if (!taskIdAttr) {
        return false;
    }
    let taskId: number = parseInt(taskIdAttr);
    // --- 移除 formList 中的相关 form 对象 ---
    if (Object.keys(ClickGo.taskList[taskId].formList).length === 1) {
        // --- 就一个窗体，那肯定就是自己，直接结束 task ---
        return endTask(taskId);
    }
    // --- 多个窗体 ---
    let title = "";
    for (let oFormId in ClickGo.taskList[taskId].formList) {
        if (parseInt(oFormId) !== formId) {
            continue;
        }
        title = ClickGo.taskList[taskId].formList[oFormId].vue.$children[0].title;
        ClickGo.taskList[taskId].formList[oFormId].vue.$destroy();
        delete(ClickGo.taskList[taskId].formList[oFormId]);
        break;
    }
    // --- 移除 form 的 style ---
    Tool.removeStyle(taskId, formId);
    // --- 移除 element ---
    formListElement.removeChild(formElement);
    // --- 触发 formRemoved 事件 ---
    trigger("formRemoved", taskId, formId, {"title": title});
    return true;
}

/**
 * --- 完全结束任务 ---
 * @param taskId 任务 id
 */
export function endTask(taskId: number): boolean {
    if (!ClickGo.taskList[taskId]) {
        return true;
    }
    // --- 移除窗体 list ---
    for (let i = 0; i < formListElement.children.length; ++i) {
        let el = formListElement.children.item(i) as HTMLElement;
        let dataTaskId = parseInt(el.getAttribute("data-task-id") ?? "0");
        if (dataTaskId !== taskId) {
            continue;
        }
        let formId = parseInt(el.getAttribute("data-form-id") ?? "0");
        if (ClickGo.taskList[taskId].formList[formId]) {
            ClickGo.taskList[taskId].formList[formId].vue.$destroy();
            let title = ClickGo.taskList[taskId].formList[formId].vue.$children[0].title;
            // --- 触发 formRemoved 事件 ---
            ClickGo.trigger("formRemoved", taskId, formId, {"title": title});
        }
        formListElement.removeChild(el);
        --i;
    }
    // --- 移除 style ---
    Tool.removeStyle(taskId);
    // --- 移除 task ---
    delete(ClickGo.taskList[taskId]);
    // --- 触发 taskEnded 事件 ---
    trigger("taskEnded", taskId);
    return true;
}

/**
 * --- 绑定拖动事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param moveCb 拖动时的回调
 * @param endCb 结束时的回调
 */
export function bindMove(e: MouseEvent | TouchEvent, opt: { "left"?: number; "top"?: number; "right"?: number; "bottom"?: number; "offsetLeft"?: number; "offsetTop"?: number; "offsetRight"?: number; "offsetBottom"?: number; "objectLeft"?: number; "objectTop"?: number; "objectWidth"?: number; "objectHeight"?: number; "object"?: HTMLElement; "offsetObject"?: HTMLElement; "start"?: (x: number, y: number) => void | Promise<void> | boolean | Promise<boolean>; "move"?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void; "end"?: () => void; "up"?: () => void; "borderIn"?: (x: number, y: number, border: TBorderDir) => void; "borderOut"?: () => void; }): void {
    setGlobalCursor(getComputedStyle(e.target as Element).cursor);
    /** --- 上一次的坐标 --- */
    let tx: number, ty: number;
    if (e instanceof MouseEvent) {
        tx = e.clientX * ClickGo.rzoom;
        ty = e.clientY * ClickGo.rzoom;
    } else {
        tx = e.touches[0].clientX * ClickGo.rzoom;
        ty = e.touches[0].clientY * ClickGo.rzoom;
    }

    // --- 限定拖动区域 ---
    let left: number, top: number, right: number, bottom: number;
    if (opt.offsetObject) {
        left = opt.offsetObject.offsetLeft + opt.offsetObject.clientLeft;
        top = opt.offsetObject.offsetTop + opt.offsetObject.clientTop;
        right = opt.offsetObject.offsetLeft + opt.offsetObject.offsetWidth;
        bottom = opt.offsetObject.offsetTop + opt.offsetObject.offsetHeight;
    } else {
        left = ClickGo.getLeft();
        top = ClickGo.getTop();
        right = ClickGo.getWidth();
        bottom = ClickGo.getHeight();
    }
    // --- 用户定义的拖动区域不能大于限定的拖动区域 ---
    if (opt.left && opt.left > left) {
        left = opt.left;
    }
    if (opt.top && opt.top > top) {
        top = opt.top;
    }
    if (opt.right && opt.right < right) {
        right = opt.right;
    }
    if (opt.bottom && opt.bottom < bottom) {
        bottom = opt.bottom;
    }
    // --- 限定拖动区域额外补偿（拖动对象和实际对象有一定偏差，超出时使用） ---
    if (opt.offsetLeft) {
        left += opt.offsetLeft;
    }
    if (opt.offsetTop) {
        top += opt.offsetTop;
    }
    if (opt.offsetRight) {
        right += opt.offsetRight;
    }
    if (opt.offsetBottom) {
        bottom += opt.offsetBottom;
    }

    /** --- 判断是否已经到达了边界 --- */
    let isBorder: boolean = false;
    /** --- 是否是第一次执行 move --- */
    let isStart: boolean = false;

    // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
    let objectLeft: number, objectTop: number, objectWidth: number, objectHeight: number;
    // --- 限定边界的偏移，如果限定了拖动对象，则需要根据偏移来判断边界，毕竟拖动点不可能刚好是边界 ---
    let offsetLeft = 0;
    let offsetTop = 0;
    let offsetRight = 0;
    let offsetBottom = 0;

    // --- 事件 ---
    let end: (e: MouseEvent | TouchEvent) => void;
    let move = async function(e: MouseEvent | TouchEvent): Promise<void> {
        /** --- 本次 x 坐标 --- */
        let x: number, y: number;
        x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
        y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
        if (x === tx && y === ty) {
            return;
        }

        if (!isStart) {
            isStart = true;
            // --- 执行 start ---
            if (opt.start) {
                let rtn = await opt.start(tx, ty);
                if (rtn === false) {
                    setGlobalCursor();
                    if (e instanceof MouseEvent) {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", end);
                    } else {
                        window.removeEventListener("touchmove", move);
                        window.removeEventListener("touchend", end);
                    }
                    return;
                }
            }
            // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
            if (opt.object) {
                objectLeft = opt.object.offsetLeft;
                objectTop = opt.object.offsetTop;
                objectWidth = opt.object.offsetWidth;
                objectHeight = opt.object.offsetHeight;
            } else {
                objectLeft = opt.objectLeft ?? 0;
                objectTop = opt.objectTop ?? 0;
                objectWidth = opt.objectWidth ?? 0;
                objectHeight = opt.objectHeight ?? 0;
            }

            // --- 限定边界的偏移，如果限定了拖动对象，则需要根据偏移来判断边界，毕竟拖动点不可能刚好是边界 ---
            if (objectWidth > 0) {
                offsetLeft = tx - objectLeft;
            }
            if (objectHeight > 0) {
                offsetTop = ty - objectTop;
            }
            offsetRight = objectWidth - offsetLeft;
            offsetBottom = objectHeight - offsetTop;
        }

        /** --- 当前是否在边界线上 --- */
        let inBorderTop: boolean = false, inBorderRight: boolean = false, inBorderBottom: boolean = false, inBorderLeft: boolean = false;

        let xol = x - offsetLeft;
        let xor = x + offsetRight;
        if (xol <= left) {
            if (xol < left && x < tx) {
                // --- 当前 x 超越了 left 界限，还在向左移动 ---
                if (tx - offsetLeft > left) {
                    // --- 如果刚刚还没超过，则设定为界限值 ---
                    x = left + offsetLeft;
                } else {
                    // --- 如果刚刚就已经超过了，则恢复成刚刚 ---
                    x = tx;
                }
            }
            inBorderLeft = true;
        } else if (offsetRight > 0) {
            if (xor >= right) {
                if (xor > right && x > tx) {
                    if (tx + offsetRight < right) {
                        x = right - offsetRight;
                    } else {
                        x = tx;
                    }
                }
                inBorderRight = true;
            }
        } else if (offsetRight === 0) {
            let rs1 = right - 1;
            if (x >= rs1) {
                if (x > rs1 && x > tx) {
                    if (tx < rs1) {
                        x = rs1;
                    } else {
                        x = tx;
                    }
                }
                inBorderRight = true;
            }
        }
        let yot = y - offsetTop;
        let yob = y + offsetBottom;
        if (yot <= top) {
            if (yot < top && y < ty) {
                if (ty - offsetTop > top) {
                    y = top + offsetTop;
                } else {
                    y = ty;
                }
            }
            inBorderTop = true;
        } else if (offsetBottom > 0) {
            if (yob >= bottom) {
                if (yob > bottom && y > ty) {
                    if (ty + offsetBottom < bottom) {
                        y = bottom - offsetBottom;
                    } else {
                        y = ty;
                    }
                }
                inBorderBottom = true;
            }
        } else if (offsetBottom === 0) {
            let bs1 = bottom - 1;
            if (y >= bs1) {
                if (y > bs1 && y > ty) {
                    if (ty < bs1) {
                        y = bs1;
                    } else {
                        y = ty;
                    }
                }
                inBorderBottom = true;
            }
        }

        // --- 检测是否执行 borderIn 事件（是否正在边界上） ---
        let border: TBorderDir = "";
        if (inBorderTop || inBorderRight || inBorderBottom || inBorderLeft) {
            if (inBorderTop) {
                if (x - left <= 20) {
                    border = "lt";
                } else if (right - x <= 20) {
                    border = "tr";
                } else {
                    border = "t";
                }
            } else if (inBorderRight) {
                if (y - top <= 20) {
                    border = "tr";
                } else if (bottom - y <= 20) {
                    border = "rb";
                } else {
                    border = "r";
                }
            } else if (inBorderBottom) {
                if (right - x <= 20) {
                    border = "rb";
                } else if (x - left <= 20) {
                    border = "bl";
                } else {
                    border = "b";
                }
            } else if (inBorderLeft) {
                if (y - top <= 20) {
                    border = "lt";
                } else if (bottom - y <= 20) {
                    border = "bl";
                } else {
                    border = "l";
                }
            }

            if (!isBorder) {
                isBorder = true;
                opt.borderIn && opt.borderIn(x, y, border);
            }
        } else {
            // --- 不在边界 ---
            if (isBorder) {
                isBorder = false;
                opt.borderOut && opt.borderOut();
            }
        }

        opt.move && opt.move(x - tx, y - ty, x, y, border);
        tx = x;
        ty = y;
    };

    if (e instanceof MouseEvent) {
        end = function(e: MouseEvent | TouchEvent): void {
            setGlobalCursor();
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", end);
            opt.up && opt.up();
            if (isStart) {
                opt.end && opt.end();
            }
        };
        // --- 绑定事件 ---
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
    } else {
        end = function(e: MouseEvent | TouchEvent): void {
            setGlobalCursor();
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", end);
            opt.up && opt.up();
            if (isStart) {
                opt.end && opt.end();
            }
        };
        // --- 绑定事件 ---
        window.addEventListener("touchmove", move);
        window.addEventListener("touchend", end);
    }
}

/**
 * --- 绑定拖动改变大小事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 选项
 * @param moveCb 拖动时的回调
 * @param endCb 结束时的回调
 */
export function bindResize(e: MouseEvent | TouchEvent, opt: { "left": number; "top": number; "width": number; "height": number; "minWidth"?: number; "minHeight"?: number; "offsetObject"?: HTMLElement; "dir": TBorderDir; "start"?: (x: number, y: number) => void | Promise<void> | boolean | Promise<boolean>; "move"?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void; "end"?: () => void; }): void {
    opt.minWidth = opt.minWidth ?? 0;
    opt.minHeight = opt.minHeight ?? 0;
    /** --- 当前鼠标位置 x --- */
    let x: number = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
    /** --- 当前鼠标位置 y --- */
    let y: number = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
    // --- 获取偏差补偿 ---
    let offsetLeft!: number, offsetTop!: number, offsetRight!: number, offsetBottom!: number;
    /** --- 上下左右界限 --- */
    let left!: number, top!: number, right!: number, bottom!: number;
    if (opt.dir === "tr" || opt.dir === "r" || opt.dir === "rb") {
        left = opt.left + opt.minWidth;
        offsetLeft = x - (opt.left + opt.width);
        offsetRight = offsetLeft;
    } else if (opt.dir === "bl" || opt.dir === "l" || opt.dir === "lt") {
        right = opt.left + opt.width - opt.minWidth;
        offsetLeft = x - opt.left;
        offsetRight = offsetLeft;
    }
    if (opt.dir === "rb" || opt.dir === "b" || opt.dir === "bl") {
        top = opt.top + opt.minHeight;
        offsetTop = y - (opt.top + opt.height);
        offsetBottom = offsetTop;
    } else if (opt.dir === "lt" || opt.dir === "t" || opt.dir === "tr") {
        bottom = opt.top + opt.height - opt.minHeight;
        offsetTop = y - opt.top;
        offsetBottom = offsetTop;
    }
    bindMove(e, {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom,
        "offsetLeft": offsetLeft,
        "offsetTop": offsetTop,
        "offsetRight": offsetRight,
        "offsetBottom": offsetBottom,
        "start": opt.start,
        "move": async function(ox, oy, x, y, border): Promise<void> {
            if (opt.dir === "tr" || opt.dir === "r" || opt.dir === "rb") {
                opt.width += ox;
            } else if (opt.dir === "bl" || opt.dir === "l" || opt.dir === "lt") {
                opt.width -= ox;
                opt.left += ox;
            }
            if (opt.dir === "rb" || opt.dir === "b" || opt.dir === "bl") {
                opt.height += oy;
            } else if (opt.dir === "lt" || opt.dir === "t" || opt.dir === "tr") {
                opt.height -= oy;
                opt.top += oy;
            }
            opt.move && opt.move(opt.left, opt.top, opt.width, opt.height, x, y, border);
        },
        "end": opt.end
    });
}

/** --- 全局 cursor 设置的 style 标签 */
let globalCursorStyle: HTMLStyleElement;
/**
 * --- 设置全局鼠标样式 ---
 * @param type 样式或留空，留空代表取消
 */
export function setGlobalCursor(type?: string): void {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById("cg-global-cursor") as HTMLStyleElement;
    }
    if (type) {
        globalCursorStyle.innerHTML = "* {cursor: " + type + " !important;}";
    } else {
        globalCursorStyle.innerHTML = "";
    }
}
