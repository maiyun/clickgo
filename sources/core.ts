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
formListElement.addEventListener("touchmove", function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
    // --- 为啥要在这加，因为有些设备性能不行，在 touchstart 之时添加的 touchmove 不能立马响应，导致网页还是跟着动，所以增加此函数 ---
}, {
    "passive": false
});

/** --- pop list 的 div --- */
let popListElement: HTMLDivElement = document.createElement("div");
popListElement.style.zoom = ClickGo.zoom.toString();
popListElement.classList.add("cg-pop-list");
document.getElementsByTagName("body")[0].appendChild(popListElement);
popListElement.addEventListener("touchmove", function(e): void {
    // --- 防止拖动时整个网页跟着动 ---
    e.preventDefault();
}, {
    "passive": false
});

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
    if (element.classList.contains("cg-pop-open")) {
        // --- 被夸嚓打开的父组件，也不做处理 ---
        return;
    }
    element = element.parentNode as HTMLElement | null;
    while (element) {
        if (!element.classList) {
            break;
        }
        if (element.classList.contains("cg-form-list")) {
            // --- 窗体内部点击，不触发丢失焦点，但触发隐藏 pop ---
            hidePop();
            return;
        }
        if (element.classList.contains("cg-pop-list") || element.classList.contains("cg-pop-open")) {
            // --- 弹出层点击，不触发丢失焦点，也不触发隐藏 pop，是否隐藏请自行处理 ---
            return;
        }
        element = element.parentNode as HTMLElement | null;
    }
    // --- 普罗大众的状态，要隐藏 menu，并且丢失窗体焦点 ---
    hidePop();
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
export function showCircular(x: number, y: number): void {
    circularElement.style.transition = "none";
    circularElement.style.width = "6px";
    circularElement.style.height = "6px";
    circularElement.style.left = x - 3 + "px";
    circularElement.style.top = y - 3 + "px";
    circularElement.style.opacity = "1";
    requestAnimationFrame(function() {
        circularElement.style.transition = "all .3s ease-out";
        circularElement.style.width = "60px";
        circularElement.style.height = "60px";
        circularElement.style.left = x - 30 + "px";
        circularElement.style.top = y - 30 + "px";
        circularElement.style.opacity = "0";
    });
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
export function showRectangle(x: number, y: number, pos: TBorderDir): void {
    rectangleElement.style.transition = "none";
    rectangleElement.style.width = "20px";
    rectangleElement.style.height = "20px";
    rectangleElement.style.left = x - 10 + "px";
    rectangleElement.style.top = y - 10 + "px";
    rectangleElement.style.opacity = "1";
    rectangleElement.setAttribute("data-ready", "0");
    rectangleElement.setAttribute("data-dir", "");
    requestAnimationFrame(function() {
        rectangleElement.style.transition = "all .2s ease-out";
        rectangleElement.setAttribute("data-ready", "1");
        moveRectangle(pos);
    });
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
 * --- 将 pop 显示出来 ---
 * @param el 要显示的 pop
 * @param x 要显示的 left，或 htmlelement 对象
 * @param y 要显示的 top，或 element 方向，0 为垂直，1 为水平
 */
export function showPop(pop: IVue, x: number | HTMLElement, y: number = 0): void {
    if (pop.$parent.$data._controlName !== "menu-pop-item") {
        ClickGo._pop = pop;
    }
    pop.$parent.popOpen = true;
    pop.open = true;
    let left: number, top: number;
    if (x instanceof HTMLElement) {
        let bcr = x.getBoundingClientRect();
        if (y === 0) {
            left = bcr.left;
            top = bcr.top + bcr.height;
        } else {
            left = bcr.left + bcr.width - 2;
            top = bcr.top - 2;
        }
        setTimeout(function() {
            if (pop.$el.offsetWidth + left > ClickGo.getWidth()) {
                if (y === 0) {
                    pop.$el.style.left = ClickGo.getWidth() - pop.$el.offsetWidth + "px";
                } else {
                    pop.$el.style.left = bcr.left - pop.$el.offsetWidth + 2 + "px";
                }
            }
            pop.$el.style.visibility = "";
        });
    } else {
        left = x;
        top = y;
        setTimeout(function() {
            if (pop.$el.offsetWidth + left > ClickGo.getWidth()) {
                pop.$el.style.left = x - pop.$el.offsetWidth + "px";
            }
            pop.$el.style.visibility = "";
        });
    }
    pop.$el.style.left = left + "px";
    pop.$el.style.top = top + "px";
    pop.$el.style.visibility = "hidden";
    pop.$el.style.zIndex = (++ClickGo.popZIndex).toString();
}

/**
 * --- 隐藏正在显示中的 pop，或指定 pop ---
 */
export function hidePop(pop: IVue | null = null): void {
    if (!pop) {
        pop = ClickGo._pop;
        if (!pop) {
            return;
        }
        ClickGo._pop = null;
    }
    pop.$parent.popOpen = false;
    pop.open = false;
    pop.onHide && pop.onHide();
}

/**
 * --- 查找指定 el 的同级 className ---
 * @param e 基准
 * @param cn 同级 classname
 */
export function siblings(e: HTMLElement, cn: string): HTMLElement | null {
    if (!e.parentNode) {
        return null;
    }
    for (let i = 0; i < e.parentNode.children.length; ++i) {
        let el = e.parentNode.children.item(i) as HTMLElement;
        if (el === e) {
            continue;
        }
        if (el.classList.contains(cn)) {
            return el;
        }
    }
    return null;
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
        case "formBlurred":
        case "formFlash": {
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
                let resp: Response = await fetch(realPath + file.slice(1) + "?" + Math.random());
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
 * @param path app 路径
 * @param opt runtime 运行时要注入的文件列表（cg 文件默认被注入） ---
 */
export async function runApp(path: string | IAppPkg, opt?: {
    "runtime"?: IFileList;
}): Promise<number> {
    opt = opt ?? {};
    opt.runtime = opt.runtime ?? {};

    let appPkg: IAppPkg | null;
    if (typeof path === "string") {
        if (!(appPkg = await fetchApp(path))) {
            return -1;
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
    Tool.createTaskStyle(taskId);
    let task: ITask = ClickGo.taskList[taskId];
    // --- 创建 form ---
    let form = await createForm({
        "file": appPkg.config.mainLayout,
        "taskId": task.taskId
    });
    if (typeof form === "number") {
        delete(ClickGo.taskList[taskId]);
        Tool.removeTaskStyle(taskId);
        return form;
    }
    // --- 设置 global style（如果 form 创建失败，就不设置 global style 了） ---
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
export async function createForm(opt: ICreateFormOptions): Promise<number | IForm> {
    /** --- 当前的 APP PKG --- */
    let appPkg: IAppPkg = ClickGo.taskList[opt.taskId].appPkg;
    // ---  申请 formId ---
    let formId = ++ClickGo.formId;
    /** --- 要 push 的本 form 的样式内容 --- */
    let controlsStyle: string = "";
    // --- 获取要定义的控件列表 ---
    let components: any = {};
    for (let controlPath of appPkg.config.controls) {
        let controlBlob = appPkg.files[controlPath + ".cgc"];
        if (!controlBlob) {
            return -101;
        }
        let controlPkg = await Tool.controlBlob2Pkg(controlBlob);
        if (!controlPkg) {
            return -102;
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
            let mounted: (() => void) | undefined = undefined;
            let beforeDestroy: (() => void) | undefined = undefined;
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
                    mounted = expo.mounted;
                    beforeDestroy = expo.beforeDestroy;
                    destroyed = expo.destroyed;
                }
            }
            // --- 控件样式表 ---
            let rand = "";
            let styleBlob = item.files[item.config.style + ".css"];
            if (styleBlob) {
                let r = Tool.stylePrepend(await Tool.blob2Text(styleBlob));
                rand = r.rand;
                controlsStyle += await Tool.styleUrl2DataUrl(item.config.style, r.style, item.files);
            }
            // --- 要创建的 control 的 layout ---
            let layoutBlob = item.files[item.config.layout + ".html"];
            if (!layoutBlob) {
                return -103;
            }
            // --- 给控件的 layout 的 class 增加前置 ---
            let randList = [
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
            data._scope = rand;
            data._controlName = name;
            // --- 预设 methods ---
            methods.stopPropagation = function(this: IVue, e: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent && ClickGo.hasTouch) {
                    return;
                }
                e.stopPropagation();
                Tool.changeFormFocus(this.formId);
                lostFocusEvent(e);
            },
            methods._down = function(this: IVue, e: MouseEvent | TouchEvent) {
                if (e instanceof MouseEvent && ClickGo.hasTouch) {
                    return;
                }
                // --- 触发自定义 down 事件 ---
                this.$emit("down", e);
            };
            methods._tap = function(this: IVue, e: MouseEvent | TouchEvent) {
                e.stopPropagation();
                if (this.$el.className.indexOf("cg-disabled") !== -1) {
                    return;
                }
                this.$emit("tap", e);
            };
            methods._dblclick = function(this: IVue, e: MouseEvent) {
                e.stopPropagation();
                if (this.$el.className.indexOf("cg-disabled") !== -1) {
                    return;
                }
                this.$emit("dblclick", e);
            };
            // --- 获取文件 blob 对象 ---
            methods.getBlob = function(this: IVue, file: string): Blob | null {
                return ClickGo.taskList[this.taskId].appPkg.files[file] ?? null;
            };
            methods.getDataUrl = async function(this: IVue, file: string): Promise<string | null> {
                let f = ClickGo.taskList[this.taskId].appPkg.files[file];
                return f ? await Tool.blob2DataUrl(f) : null;
            };
            // --- layout 中 :class 的转义 ---
            methods._classPrepend = function(this: IVue, cla: any): string {
                if (typeof cla !== "string") {
                    return cla;
                }
                if (cla.slice(0, 3) === "cg-") {
                    return cla;
                }
                return `cg-theme-global-${this.$data._controlName}_${cla} cg-theme-task${this.taskId}-${this.$data._controlName}_${cla} ${this.$data._scope}${cla}`;
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
                "mounted": function(this: IVue): void {
                    this.$nextTick(function(this: IVue) {
                        mounted?.call(this);
                    });
                },
                "beforeDestroy": beforeDestroy,
                "destroyed": destroyed,

                "components": {}
            };
        }
    }
    // --- 处理控件中包含的子组件 ---
    for (let name in components) {
        let reg = /<cg-(.+?)[ >]/g;
        let match: RegExpExecArray | null;
        while ((match = reg.exec(components[name].template))) {
            if (!components["cg-" + match[1]]) {
                continue;
            }
            components[name].components["cg-" + match[1]] = components["cg-" + match[1]];
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
        return -104;
    }
    // --- 准备相关变量 ---
    let data: Record<string, any> = {};
    let methods: any = {};
    let computed = {};
    let watch = {};
    let mounted: (() => void) | undefined = undefined;
    let beforeDestroy: (() => void) | undefined = undefined;
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
            mounted = expo.mounted;
            beforeDestroy = expo.beforeDestroy;
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
    layout = Tool.layoutInsertAttr(layout, ":focus=\"focus\"");
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
    data._scope = rand;
    data.focus = false;
    data._customZIndex = false;
    if (opt.topMost) {
        data._topMost = true;
    } else {
        data._topMost = false;
    }
    // --- 初始化系统方法 ---
    methods.createForm = async function(this: IVue, paramOpt: string | { "code"?: string; "layout": string; "style"?: string; }, cfOpt: { "mask"?: boolean; } = {}): Promise<void> {
        let inOpt: ICreateFormOptions = {
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
        if (cfOpt.mask) {
            this.$children[0].maskFor = true;
        }
        if (this.$data._topMost) {
            inOpt.topMost = true;
        }
        let form = await createForm(inOpt);
        if (typeof form === "number") {
            this.$children[0].maskFor = undefined;
        } else {
            if (this.$children[0].maskFor) {
                this.$children[0].maskFor = form.formId;
                form.vue.$children[0].maskFrom = this.formId;
            }
        }
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
    // --- 设置窗体置顶/取消置顶 ---
    methods.setTopMost = function(this: IVue, top: boolean): void {
        this.$data._customZIndex = false;
        if (top) {
            // --- 要置顶 ---
            this.$data._topMost = true;
            if (!this.focus) {
                Tool.changeFormFocus(this.formId, this);
            } else {
                this.$children[0].setPropData("zIndex", ++ClickGo.topZIndex);
            }
        } else {
            // --- 取消置顶 ---
            this.$data._topMost = false;
            this.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
        }
    };
    // --- 让窗体闪烁 ---
    methods.flash = function(this: IVue): void {
        if (!this.focus) {
            Tool.changeFormFocus(this.formId);
        }
        if (this.$children[0].flashTimer) {
            clearTimeout(this.$children[0].flashTimer);
            this.$children[0].flashTimer = undefined;
        }
        this.$children[0].flashTimer = setTimeout(() => {
            this.$children[0].flashTimer = undefined;
        }, 1000);
        // --- 触发 formFlash 事件 ---
        trigger("formFlash", opt.taskId, formId);
    };
    // --- layout 中 :class 的转义 ---
    methods._classPrepend = function(this: IVue, cla: any): string {
        if (typeof cla !== "string") {
            return cla;
        }
        if (cla.slice(0, 3) === "cg-") {
            return cla;
        }
        return `cg-task${this.taskId}_${cla} ${this.$data._scope}${cla}`;
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
                            this.$destroy();
                            Tool.removeStyle(this.taskId, this.formId);
                            formListElement.removeChild(this.$el);
                        }
                        resolve(false);
                    }
                });
            },
            "beforeDestroy": beforeDestroy,
            "destroyed": destroyed
        });
    });
    if (!$vm) {
        return -106;
    }
    // --- 全局事件来遍历执行的响应 ---
    $vm.eventList = {};
    // --- 部署本窗体控件 css ---
    if (controlsStyle !== "") {
        // --- 将这些窗体的控件样式追加到网页 ---
        Tool.pushStyle(controlsStyle, opt.taskId, "controls", formId);
    }
    if (style) {
        // --- 窗体的 style ---
        Tool.pushStyle(style, opt.taskId, "forms", formId);
    }
    // --- 将窗体居中 ---
    if (!$vm.$children[0].stateMaxData) {
        if ($vm.$children[0].left === -1) {
            $vm.$children[0].setPropData("left", (ClickGo.getWidth() - $vm.$el.offsetWidth) / 2);
        }
        if ($vm.$children[0].top === -1) {
            $vm.$children[0].setPropData("top", (ClickGo.getHeight() - $vm.$el.offsetHeight) / 2);
        }
    }
    if ($vm.$children[0].zIndex !== -1) {
        $vm.$data._customZIndex = true;
    }
    // --- 执行 mounted ---
    if (mounted) {
        try {
            mounted.call($vm);
        } catch (err) {
            formListElement.removeChild($vm.$el);
            Tool.removeStyle($vm.taskId, $vm.formId);
            if (ClickGo.errorHandler) {
                ClickGo.errorHandler($vm.taskId, $vm.formId, err, "Create form mounted error.");
            } else {
                console.log(err);
            }
            return -105;
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
    if (!ClickGo.taskList[opt.taskId]) {
        $vm.$destroy();
        Tool.removeStyle(opt.taskId, formId);
        formListElement.removeChild($vm.$el);
        return -107;
    }
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
    if (ClickGo.taskList[taskId].formList[formId]) {
        title = ClickGo.taskList[taskId].formList[formId].vue.$children[0].title;
        ClickGo.taskList[taskId].formList[formId].vue.$destroy();
        if (ClickGo.taskList[taskId].formList[formId].vue.$children[0].maskFrom !== undefined) {
            let fid = ClickGo.taskList[taskId].formList[formId].vue.$children[0].maskFrom;
            ClickGo.taskList[taskId].formList[fid].vue.$children[0].maskFor = undefined;
        }
        delete(ClickGo.taskList[taskId].formList[formId]);
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
 * --- 根据 el 获取 watch 中的 el 的 size ---
 * @param el 要获取的 el
 */
export function getWatchSize(el: HTMLElement): IDomSize {
    for (let item of ClickGo._watchSize) {
        if (item.el !== el) {
            continue;
        }
        return item.size;
    }
    return {
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0,
        "width": 0,
        "height": 0,
        "padding": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0,
        },
        "border": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0,
        },
        "clientWidth": 0,
        "clientHeight": 0
    };
}

/**
 * --- 添加监视 Element 对象大小
 * @param el 要监视的大小
 * @param cb 回调函数
 */
export function watchSize(el: HTMLElement, cb: (size: IDomSize) => void): IDomSize {
    let size = Tool.getDomSize(el);
    ClickGo._watchSize.push({
        "el": el,
        "size": size,
        "cb": cb
    });
    return size;
}

/**
 * --- 添加 DOM 内容变化监视 ---
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式
 */
export function watchElement(el: HTMLElement, cb: MutationCallback, mode: "child" | "childsub" | "style" | "default" | MutationObserverInit = "default"): MutationObserver {
    let moi: MutationObserverInit;
    switch (mode) {
        case "child": {
            moi = {
                "childList": true
            };
            break;
        }
        case "childsub": {
            moi = {
                "childList": true,
                "subtree": true
            };
            break;
        }
        case "style": {
            moi = {
                "attributeFilter": ["style", "class"],
                "attributes": true
            };
            break;
        }
        case "default": {
            moi = {
                "attributeFilter": ["style", "class"],
                "attributes": true,
                "characterData": true,
                "childList": true,
                "subtree": true
            };
            break;
        }
        default: {
            moi = mode;
        }
    }
    let mo = new MutationObserver(cb);
    mo.observe(el, moi);
    /*
    {
        "attributeFilter": ["style", "class"],
        "attributes": true,
        "characterData": true,
        "childList": true,
        "subtree": true
    }
    */
    return mo;
}

/**
 * --- 绑定按下以及弹起事件 ---
 * @param e MouseEvent | TouchEvent
 * @param opt 回调选项
 */
export function bindDown(oe: MouseEvent | TouchEvent, opt: { "down"?: (e: MouseEvent | TouchEvent) => void; "start"?: (e: MouseEvent | TouchEvent) => void | boolean; "move"?: (e: MouseEvent | TouchEvent) => void | boolean; "up"?: (e: MouseEvent | TouchEvent) => void; "end"?: (e: MouseEvent | TouchEvent) => void; }): void {
    if (oe instanceof MouseEvent && ClickGo.hasTouch) {
        return;
    }
    /** --- 上一次的坐标 --- */
    let ox: number, oy: number;
    if (oe instanceof MouseEvent) {
        ox = oe.clientX;
        oy = oe.clientY;
    } else {
        ox = oe.touches[0].clientX;
        oy = oe.touches[0].clientY;
    }

    /** --- 是否是第一次执行 move --- */
    let isStart: boolean = false;

    let end: (e: MouseEvent | TouchEvent) => void;
    let move = function(e: MouseEvent | TouchEvent): void {
        // --- 防止拖动时整个网页跟着动 ---
        e.preventDefault();
        let x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        let y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        if (x === ox && y === oy) {
            return;
        }

        if (!isStart) {
            isStart = true;
            if (opt.start && (opt.start(e) === false)) {
                if (e instanceof MouseEvent) {
                    window.removeEventListener("mousemove", move);
                    window.removeEventListener("mouseup", end);
                } else {
                    (oe.target as HTMLElement).removeEventListener("touchmove", move);
                    (oe.target as HTMLElement).removeEventListener("touchend", end);
                }
                return;
            }
        }
        if (opt.move && (opt.move(e) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", end);
            } else {
                (oe.target as HTMLElement).removeEventListener("touchmove", move);
                (oe.target as HTMLElement).removeEventListener("touchend", end);
            }
            return;
        }
    };
    end = function(e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent) {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", end);
        } else {
            (oe.target as HTMLElement).removeEventListener("touchmove", move);
            (oe.target as HTMLElement).removeEventListener("touchend", end);
        }
        opt.up && opt.up(e);
        if (isStart) {
            opt.end && opt.end(e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
    } else {
        (oe.target as HTMLElement).addEventListener("touchmove", move, {passive: false});
        (oe.target as HTMLElement).addEventListener("touchend", end);
    }
    opt.down && opt.down(oe);
}

/**
 * --- 绑定拖动事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 回调选项
 */
export function bindMove(e: MouseEvent | TouchEvent, opt: { "left"?: number; "top"?: number; "right"?: number; "bottom"?: number; "offsetLeft"?: number; "offsetTop"?: number; "offsetRight"?: number; "offsetBottom"?: number; "objectLeft"?: number; "objectTop"?: number; "objectWidth"?: number; "objectHeight"?: number; "object"?: HTMLElement | IVue; "offsetObject"?: HTMLElement | IVue; "showRect"?: boolean; "start"?: (x: number, y: number) => void | boolean; "move"?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void; "up"?: () => void; "end"?: (moveTimes: Array<Record<number, [number, number]>>) => void; "borderIn"?: (x: number, y: number, border: TBorderDir) => void; "borderOut"?: () => void; }): { "left": number; "top": number; "right": number; "bottom": number; } {
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
        if (!(opt.offsetObject instanceof HTMLElement)) {
            opt.offsetObject = opt.offsetObject.$el;
        }
        let rect = opt.offsetObject.getBoundingClientRect();
        let sd = getComputedStyle(opt.offsetObject);
        left = rect.left + opt.offsetObject.clientLeft + parseFloat(sd.paddingLeft);
        top = rect.top + opt.offsetObject.clientTop + parseFloat(sd.paddingTop);
        right = rect.left + rect.width - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
        bottom = rect.top + rect.height - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
    } else {
        left = opt.left ?? ClickGo.getLeft();
        top = opt.top ?? ClickGo.getTop();
        right = opt.right ?? ClickGo.getWidth();
        bottom = opt.bottom ?? ClickGo.getHeight();
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

    // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
    let objectLeft: number, objectTop: number, objectWidth: number, objectHeight: number;
    let offsetLeft = 0;
    let offsetTop = 0;
    let offsetRight = 0;
    let offsetBottom = 0;

    /** --- 每次拖动时的时间以及偏移 --- */
    let moveTime: Array<{ "time": number; "ox": number; "oy": number; }> = [];

    ClickGo.bindDown(e, {
        start: () => {
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    setGlobalCursor();
                    return false;
                }
            }
            // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
            if (opt.object) {
                if (!(opt.object instanceof HTMLElement)) {
                    opt.object = opt.object.$el;
                }
                let rect = opt.object.getBoundingClientRect();
                objectLeft = rect.left;
                objectTop = rect.top;
                objectWidth = rect.width;
                objectHeight = rect.height;
            } else {
                objectLeft = opt.objectLeft ?? 0;
                objectTop = opt.objectTop ?? 0;
                objectWidth = opt.objectWidth ?? 0;
                objectHeight = opt.objectHeight ?? 0;
            }

            // --- 限定边界的偏移，如果限定了拖动对象，则需要根据偏移来判断边界，毕竟拖动点不可能每次都刚好是边界 ---
            if (objectWidth > 0) {
                offsetLeft = tx - objectLeft;
            }
            if (objectHeight > 0) {
                offsetTop = ty - objectTop;
            }
            offsetRight = objectWidth - offsetLeft;
            offsetBottom = objectHeight - offsetTop;
        },
        move: (e: MouseEvent | TouchEvent) => {
            /** --- 本次 x 坐标 --- */
            let x: number, y: number;
            x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
            y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
            if (x === tx && y === ty) {
                return;
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

            let ox = x - tx;
            let oy = y - ty;
            moveTime.push({
                "time": Date.now(),
                "ox": ox,
                "oy": oy
            });

            opt.move && opt.move(ox, oy, x, y, border);
            tx = x;
            ty = y;
        },
        up: () => {
            setGlobalCursor();
            opt.up && opt.up();
        },
        end: () => {
            opt.end && opt.end(moveTime);
        }
    });

    if (opt.showRect) {
        showRectangle(tx, ty, {
            "left": left,
            "top": top,
            "width": right - left,
            "height": bottom - top
        });
        setTimeout(() => {
            hideRectangle();
        }, 500);
    }

    return {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom
    };
}

/**
 * --- 绑定拖动改变大小事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 选项
 * @param moveCb 拖动时的回调
 * @param endCb 结束时的回调
 */
export function bindResize(e: MouseEvent | TouchEvent, opt: { "left": number; "top": number; "width": number; "height": number; "minWidth"?: number; "minHeight"?: number; "offsetObject"?: HTMLElement; "dir": TBorderDir; "start"?: (x: number, y: number) => void | boolean; "move"?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void; "end"?: () => void; }): void {
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
        "move": function(ox, oy, x, y, border) {
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
