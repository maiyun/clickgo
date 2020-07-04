/** --- style list 的 div --- */
let styleListElement: HTMLDivElement = document.createElement("div");
styleListElement.style.display = "none";
document.getElementsByTagName("body")[0].appendChild(styleListElement);
styleListElement.insertAdjacentHTML("beforeend", "<style id=\"cg-global-cursor\"></style>");
styleListElement.insertAdjacentHTML("beforeend", "<style id=\"cg-global-theme\"></style>");
styleListElement.insertAdjacentHTML("beforeend", `<style class="cg-global">
.cg-form-list {position: fixed; left: 0; top: 0; z-index: 20020000; width: 0; height: 0; cursor: default;}
.cg-pop-list {position: fixed; left: 0; top: 0; z-index: 20020001; width: 0; height: 0; cursor: default;}
.cg-form-list img, .cg-pop-list img {vertical-align: bottom;}
.cg-form-list ::selection {
    background-color: rgba(0, 120, 215, .3);
}

.cg-form-list *, .cg-pop-list * {box-sizing: border-box !important; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
.cg-form-list, .cg-form-list input, .cg-form-list textarea, .cg-pop-list, .cg-pop-list input, .cg-pop-list textarea {font-family: 'Microsoft YaHei',Arial,Helvetica,Sans-Serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased; font-weight: 400;}

.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #76b9ed; border-radius: 50%; filter: drop-shadow(0 0 7px #76b9ed); pointer-events: none; opacity: 0;}
.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border: solid 1px rgba(118, 185, 237, .7); box-shadow: 0 0 10px rgba(0, 0, 0, .3); background: rgba(118, 185, 237, .1); pointer-events: none; opacity: 0;}
</style>`);

/**
 * --- 获取实时的 DOM SIZE ---
 * @param el 要获取的 dom
 */
export function getDomSize(el: HTMLElement): IDomSize {
    let rect = el.getBoundingClientRect();
    let cs = getComputedStyle(el);
    let border = {
        "top": parseFloat(cs.borderTopWidth),
        "right": parseFloat(cs.borderRightWidth),
        "bottom": parseFloat(cs.borderBottomWidth),
        "left": parseFloat(cs.borderLeftWidth)
    };
    let padding = {
        "top": parseFloat(cs.paddingTop),
        "right": parseFloat(cs.paddingRight),
        "bottom": parseFloat(cs.paddingBottom),
        "left": parseFloat(cs.paddingLeft)
    };
    return {
        "top": rect.top,
        "right": rect.right,
        "bottom": rect.bottom,
        "left": rect.left,
        "width": rect.width,
        "height": rect.height,
        "padding": padding,
        "border": border,
        "clientWidth": rect.width - border.left - border.right - padding.left - padding.right,
        "clientHeight": rect.height - border.top - border.bottom - padding.top - padding.bottom
    };
}

/**
 * --- 根据刷新频率检测 dom 大小是否改变 ---
 */
function requestAnimationFrameCb(): void {
    // --- 被添加的监听的 el 对象触发其 resize 回调 ---
    for (let i = 0; i < ClickGo._watchSize.length; ++i) {
        let item = ClickGo._watchSize[i];
        let rect = item.el.getBoundingClientRect();
        let cs = getComputedStyle(item.el);
        if (rect.width === 0 && rect.height === 0) {
            if (cs.display === "") {
                // --- 元素已被移除 ---
                ClickGo._watchSize.splice(i, 1);
                --i;
            }
            continue;
        }
        let border = {
            "top": parseFloat(cs.borderTopWidth),
            "right": parseFloat(cs.borderRightWidth),
            "bottom": parseFloat(cs.borderBottomWidth),
            "left": parseFloat(cs.borderLeftWidth)
        };
        let padding = {
            "top": parseFloat(cs.paddingTop),
            "right": parseFloat(cs.paddingRight),
            "bottom": parseFloat(cs.paddingBottom),
            "left": parseFloat(cs.paddingLeft)
        };
        let trect: IDomSize = {
            "top": rect.top,
            "right": rect.right,
            "bottom": rect.bottom,
            "left": rect.left,
            "width": rect.width,
            "height": rect.height,
            "padding": padding,
            "border": border,
            "clientWidth": rect.width - border.left - border.right - padding.left - padding.right,
            "clientHeight": rect.height - border.top - border.bottom - padding.top - padding.bottom
        };
        if (trect.width !== item.size.width || trect.height !== item.size.height || trect.clientWidth !== item.size.clientWidth || trect.clientHeight !== item.size.clientHeight) {
            item.cb(trect);
        }
        item.size = trect;
    }
    // --- 等待下一个 ---
    requestAnimationFrame(requestAnimationFrameCb);
}
requestAnimationFrame(requestAnimationFrameCb);

/**
 * --- cgt 文件 blob 转 ITheme 对象 ---
 * @param blob blob 对象
 */
async function themeBlob2Theme(blob: Blob): Promise<false | ITheme> {
    // --- 判断是否是 cgt 文件 ---
    let begin = blob.slice(0, 2);
    let beginUint = new Uint8Array(await blob2ArrayBuffer(begin));
    if (beginUint[0] !== 192 || beginUint[1] !== 2) {
        // --- 不是 cgt 文件 ---
        return false;
    }
    // --- 开始读取文件 ---
    let files: IFileList = {};
    /** --- 配置文件 --- */
    let config!: IThemeConfig;
    /** --- 当前游标 --- */
    let cursor: number = 2;
    while (cursor < blob.size) {
        let pathSize = new Uint8Array(await blob2ArrayBuffer(blob.slice(cursor, ++cursor)));
        let path = await blob2Text(blob.slice(cursor, cursor += pathSize[0]));

        let contentSize = new Uint32Array(await blob2ArrayBuffer(blob.slice(cursor, cursor += 4)));
        let contentBolb = blob.slice(cursor, cursor += contentSize[0]);

        if (path === "/config.json") {
            config = JSON.parse(await blob2Text(contentBolb));
        } else {
            files[path] = contentBolb;
        }
    }
    if (!config) {
        return false;
    }

    return {
        "type": "theme",
        "config": config,
        "files": files
    };
}

let globalThemeStyle: HTMLStyleElement = document.getElementById("cg-global-theme") as HTMLStyleElement;
/**
 * --- 将 theme 设为全局主题 ---
 * @param style 要写入的样式
 */
export async function setGlobalTheme(file: Blob): Promise<void> {
    let theme = await themeBlob2Theme(file);
    if (!theme) {
        return;
    }
    let styleBlob = theme.files[theme.config.style + ".css"];
    if (!styleBlob) {
        return;
    }
    let style = await blob2Text(styleBlob);
    style = stylePrepend(style, "cg-theme-gloabl-").style;
    style = await styleUrl2DataUrl(theme.config.style, style, theme.files);
    globalThemeStyle.innerHTML = style;
}

/**
 * --- 清除全局主题 ---
 */
export function clearGlobalTheme(): void {
    globalThemeStyle.innerHTML = "";
}

/**
 * --- 创建任务时连同一起创建的 style 标签 ---
 * @param taskId 任务 id
 */
export function createTaskStyle(taskId: number): void {
    styleListElement.insertAdjacentHTML("beforeend", `<div id="cg-style-task${taskId}"><div class="cg-style-controls"></div><div class="cg-style-themes"></div><style class="cg-style-global"></style><div class="cg-style-forms"></div></div>`);
}

/**
 * --- 任务结束时需要移除 task 的所有 style ---
 * @param taskId 任务 id
 */
export function removeTaskStyle(taskId: number): void {
    document.getElementById("cg-style-task" + taskId)?.remove();
}

/**
 * --- 单任务加载 theme ---
 * @param style theme 样式
 * @param taskId 任务 ID
 */
export async function loadTaskTheme(file: string | Blob, taskId: number): Promise<void> {
    if (!ClickGo.taskList[taskId]) {
        return;
    }
    if (typeof file === "string") {
        let blob = ClickGo.taskList[taskId].appPkg.files[file];
        if (!blob) {
            return;
        }
        file = blob;
    }
    let theme = await themeBlob2Theme(file);
    if (!theme) {
        return;
    }
    let styleBlob = theme.files[theme.config.style + ".css"];
    if (!styleBlob) {
        return;
    }
    let style = await blob2Text(styleBlob);
    style = stylePrepend(style, `cg-theme-task${taskId}-`).style;
    style = await styleUrl2DataUrl(theme.config.style, style, theme.files);
    document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`)?.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
}

/**
 * --- 清除一个 task 中所有加载的 theme
 * @param taskId task id
 */
export function clearTaskTheme(taskId: number): void {
    let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`);
    if (!el) {
        return;
    }
    el.innerHTML = "";
}

/**
 * --- 将 style 内容写入 dom ---
 * @param style 样式内容
 * @param taskId 当前任务 ID
 * @param type 插入的类型
 * @param formId 当前窗体 ID（可空）
 */
export function pushStyle(style: string, taskId: number, type: "controls" | "global" | "forms" = "global", formId: number = 0): void {
    let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type}`);
    if (!el) {
        return;
    }
    if (type === "global") {
        el.innerHTML = style;
    } else {
        el.insertAdjacentHTML("beforeend", `<style class="cg-style-form${formId}">${style}</style>`);
    }
}

/**
 * --- 移除 style 样式 dom ---
 * @param taskId 要移除的任务 ID
 * @param formId 要移除的窗体 ID（空的话当前任务样式都会被移除）
 */
export function removeStyle(taskId: number, formId: number = 0): void {
    let styleTask = document.getElementById("cg-style-task" + taskId);
    if (!styleTask) {
        return;
    }
    if (formId === 0) {
        styleTask.remove();
    } else {
        let elist = styleTask.querySelectorAll(".cg-style-form" + formId);
        for (let i = 0; i < elist.length; ++i) {
            elist.item(i).remove();
        }
    }
}

/**
 * --- 去除 html 的空白符、换行 ---
 * @param text 要纯净的字符串
 */
export function purify(text: string): string {
    text = ">" + text + "<";
    text = text.replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
        return ">" + t1.replace(/\t|\r\n| {2}/g, "").replace(/\n|\r/g, "") + "<";
    });
    return text.slice(1, -1);
}

/**
 * --- trim ---
 * @param text 要 trim 的文本
 */
export function trim(text: string): string {
    return text.replace(/^\s+|\s+$/, "");
}

/**
 * --- 将相对或绝对路径转换为绝对路径 ---
 * @param path 相对/绝对路径
 * @param base cg 基路径
 */
export function parsePath(path: string): string {
    if (path.slice(0, 2) === "//") {
        // --- //xxx/xxx
        path = ClickGo.rootPath.slice(0, ClickGo.rootPath.indexOf("//")) + path;
    } else if (path[0] === "/") {
        // --- /xxx ---
        path = ClickGo.rootPath.replace(/^(http.+?\/\/.+?)\/.*$/, function(t, t1) {
            return t1 + path;
        });
    } else if (!/^(.+?):\/\//.test(path)) {
        // --- xxx/xxx ---
        if (path.slice(0, 8) === "clickgo/") {
            // --- clickgo/xxx ---
            path = ClickGo.cgRootPath + path.slice(8);
        } else {
            path = ClickGo.rootPath + path;
        }
    }
    return path;
}

/**
 * --- 判断是否是 ControlPkg 对象 ---
 * @param o 要判断的对象
 */
export function isControlPkg(o: string | object): o is IControlPkg {
    if (typeof o !== "object") {
        return false;
    }
    for (let k in o) {
        return (o as any)[k].type === "control" ? true : false;
    }
    return false;
}

/**
 * --- 判断是否是 AppPkg 对象 ---
 * @param o 要判断的对象
 */
export function isAppPkg(o: string | object): o is IAppPkg {
    if (typeof o !== "object") {
        return false;
    }
    for (let k in o) {
        return (o as any)[k].type === "control" ? true : false;
    }
    return false;
}

/**
 * --- 将 cgc 文件转换为 pkg 对象 ---
 * @param blob 文件 blob
 */
export async function controlBlob2Pkg(blob: Blob): Promise<false | IControlPkg> {
    // --- 判断是否是 cgc 文件 ---
    let begin = blob.slice(0, 2);
    let beginUint = new Uint8Array(await blob2ArrayBuffer(begin));
    if (beginUint[0] !== 192 || beginUint[1] !== 1) {
        // --- 不是 cgc 文件 ---
        return false;
    }
    // --- 创建空白 pkg 对象 ---
    let controlPkg: IControlPkg = {};
    /** --- 当前游标 --- */
    let cursor: number = 2;
    while (cursor < blob.size) {
        let nameSize = new Uint8Array(await blob2ArrayBuffer(blob.slice(cursor, ++cursor)));
        let name = await blob2Text(blob.slice(cursor, cursor += nameSize[0]));

        let bodySize = new Uint32Array(await blob2ArrayBuffer(blob.slice(cursor, cursor += 4)));
        let bodyBlob = blob.slice(cursor, cursor += bodySize[0]);

        // --- 开始读取文件 ---
        let files: IFileList = {};
        /** --- 配置文件 --- */
        let config!: IControlConfig;
        /** --- 当前 body 游标 --- */
        let bodyCursor: number = 0;
        while (bodyCursor < bodyBlob.size) {
            let pathSize = new Uint8Array(await blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor)));
            let path = await blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += pathSize[0]));

            let mimeSize = new Uint8Array(await blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor)));
            let mime = await blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += mimeSize[0]));

            let contentSize = new Uint32Array(await blob2ArrayBuffer(bodyBlob.slice(bodyCursor, bodyCursor += 4)));
            let contentBolb = bodyBlob.slice(bodyCursor, bodyCursor += contentSize[0], mime);

            if (path === "/config.json") {
                config = JSON.parse(await blob2Text(contentBolb));
            } else {
                files[path] = contentBolb;
            }
        }
        if (!config) {
            return false;
        }

        controlPkg[name] = {
            "type": "control",
            "config": config,
            "files": files
        };
    }
    return controlPkg;
}

/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param style 样式内容
 * @param rand 唯一标识符可空
 */
export function stylePrepend(style: string, rand: string = ""): {
    "rand": string;
    "style": string;
} {
    if (rand === "") {
        rand = "cg-scope" + Math.round(Math.random() * 1000000000000000) + "_";
    }
    // --- 给 style 的 class 前添加 scope ---
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function(t, t1, t2) {
        return t1.replace(/\.([a-zA-Z0-9-_]+)/g, function(t: string, t1: string) {
            if (t1.slice(0, 3) === "cg-") {
                return t;
            }
            return "." + rand + t1;
        }) + "{" + t2 + "}";
    });
    // --- 自定义 font 名添加 scope ---
    let fontList: string[] = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*['"]{0,1})(.+?)(['"]{0,1}\s*[;\r\n }])/gi, function(t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + rand + t2 + t3;
    });
    // --- 对自定义 font 进行更名 ---
    for (let font of fontList) {
        let reg = new RegExp(`(font.+?[: '"])(${font})`, "gi");
        style = style.replace(reg, function(t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    // --- keyframes ---
    let keyframeList: string[] = [];
    style = style.replace(/([-@]keyframes *['"]{0,1})([\w-]+)(['"]{0,1}\s*?\{)/gi, function(t, t1, t2, t3) {
        if (keyframeList.indexOf(t2) === -1) {
            keyframeList.push(t2);
        }
        return t1 + rand + t2 + t3;
    });
    // --- 对自定义 keyframe 进行更名 ---
    for (let keyframe of keyframeList) {
        let reg = new RegExp(`(animation.+?)(${keyframe})`, "gi");
        style = style.replace(reg, function(t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    return {
        "rand": rand,
        "style": style
    };
}

/**
 * --- 将 style 中的 url 转换成 base64 data url ---
 * @param dirname 文件基准路径，或文件路径
 * @param style 样式表
 * @param files 文件熟
 */
export async function styleUrl2DataUrl(dirname: string, style: string, files: IFileList): Promise<string> {
    if (dirname.slice(-1) !== "/") {
        dirname = dirname.slice(0, dirname.lastIndexOf("/") + 1);
    }
    let reg = /url\(['"]{0,1}(.+?)['"]{0,1}\)/ig;
    let match: RegExpExecArray | null = null;
    let rtn = style;
    while ((match = reg.exec(style))) {
        let path = match[1];
        if (path[0] !== "/") {
            path = dirname + path;
        }
        path = path.replace(/\/\.\//g, "/");
        while (/\/(?!\.\.)[^/]+\/\.\.\//.test(path)) {
            path = path.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, "/");
        }
        if (!files[path]) {
            continue;
        }
        rtn = rtn.replace(match[0], `url('${await blob2DataUrl(files[path])}')`);
    }
    return rtn;
}

/**
 * --- 将系统默认的 attr 追加到标签 ---
 * @param layout 被追加
 * @param insert 要追加
 * @param opt 选项
 */
export function layoutInsertAttr(layout: string, insert: string, opt: { "ignore"?: string[]; "include"?: string[]; } = {}): string {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function(t, t1): string {
        if (opt.ignore && opt.ignore.indexOf(t1) !== -1) {
            return t;
        }
        if (opt.include && opt.include.indexOf(t1) === -1) {
            return t;
        }
        return t.replace(/<[\w-]+/, function(t) {
            return t + " " + insert;
        });
    });
}

/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param layout 框架
 * @param rand 唯一标识符列表
 */
export function layoutClassPrepend(layout: string, rand: string[] = []): {
    "rand": string[];
    "layout": string;
} {
    if (rand.length === 0) {
        rand.push("cg-scope" + Math.round(Math.random() * 1000000000000000) + "_");
    }
    return {
        "rand": rand,
        "layout": layout.replace(/ class=["'](.+?)["']/gi, function(t, t1: string) {
            let clist = t1.split(" ");
            let rtn: string[] = [];
            for (let item of clist) {
                for (let r of rand) {
                    rtn.push(r + item);
                }
            }
            return ` class="${rtn.join(" ")}"`;
        }).replace(/ :class=(['"]).+?>/gi, function(t, sp) {
            return t.replace(new RegExp(` :class=${sp}(.+?)${sp}`, "gi"), function(t, t1: string) {
                t1 = trim(t1);
                if (t1[0] === "[") {
                    t1 = t1.slice(1, -1);
                    let t1a = t1.split(",");
                    for (let i = 0; i < t1a.length; ++i) {
                        t1a[i] = trim(t1a[i]);
                        if (t1a[i][0] === "{") {
                            t1a[i] = layoutClassPrependObject(t1a[i]);
                        } else {
                            t1a[i] = "_classPrepend(" + t1a[i] + ")";
                        }
                    }
                    t1 = "[" + t1a.join(",") + "]";
                } else {
                    t1 = layoutClassPrependObject(t1);
                }
                return ` :class="${t1}"`;
            });
        })
    };
}
function layoutClassPrependObject(os: string): string {
    os = trim(os.slice(1, -1));
    return "{" + os.replace(/(.+?):(.+?)(,|$)/g, function(t, t1, t2, t3) {
        // --- t1 是 class 的头头 ---
        t1 = trim(t1);
        if (t1[0] === "[") {
            t1 = "[_classPrepend(" + t1.slice(1, -1) + ")]";
        } else {
            let sp = "";
            if (t1[0] === "'" || t1[0] === "\"") {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            t1 = `[_classPrepend(${sp}${t1}${sp})]`;
        }
        return t1 + ":" + t2 + t3;
    }) + "}";
}

/**
 * --- 改变 form 的焦点 class ---
 * @param formId 变更后的 form id
 */
export function changeFormFocus(formId: number = 0, vm?: IVue): void {
    let focusElement = document.querySelector(".cg-form-list > .cg-focus");
    if (focusElement) {
        let dataFormId = focusElement.getAttribute("data-form-id");
        if (dataFormId) {
            let dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            } else {
                let taskId = parseInt(focusElement.getAttribute("data-task-id") ?? "0");
                let task = ClickGo.taskList[taskId];
                task.formList[dataFormIdNumber].vue.focus = false;
                // --- 触发 formBlurred 事件 ---
                ClickGo.trigger("formBlurred", taskId, dataFormIdNumber);
            }
        } else {
            return;
        }
    }
    if (formId !== 0) {
        let el = document.querySelector(".cg-form-list > [data-form-id='" + formId + "']");
        if (el) {
            let taskId: number;
            if (vm) {
                if (!vm.$data._customZIndex) {
                    if (vm.$data._topMost) {
                        vm.$children[0].setPropData("zIndex", ++ClickGo.topZIndex);
                    } else {
                        vm.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
                    }
                }
                vm.focus = true;
                taskId = vm.taskId;
            } else {
                taskId = parseInt(el.getAttribute("data-task-id") ?? "0");
                let task = ClickGo.taskList[taskId];
                if (!task.formList[formId].vue.$data._customZIndex) {
                    if (task.formList[formId].vue.$data._topMost) {
                        task.formList[formId].vue.$children[0].setPropData("zIndex", ++ClickGo.topZIndex);
                    } else {
                        task.formList[formId].vue.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
                    }
                }
                task.formList[formId].vue.focus = true;
            }
            // --- 触发 formFocused 事件 ---
            ClickGo.trigger("formFocused", taskId, formId);
        }
    }
}

/**
 * --- 将 blob 对象转换为 base64 url ---
 * @param blob 对象
 */
export function blob2DataUrl(blob: Blob): Promise<string> {
    return new Promise(function(resove) {
        let fr = new FileReader();
        fr.addEventListener("load", function(e) {
            if (e.target) {
                resove(e.target.result as string);
            } else {
                resove("");
            }
        });
        fr.readAsDataURL(blob);
    });
}

/**
 * --- 将 blob 对象转换为 ArrayBuffer ---
 * @param blob 对象
 */
export function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise(function(resove) {
        let fr = new FileReader();
        fr.addEventListener("load", function() {
            resove(fr.result as ArrayBuffer);
        });
        fr.readAsArrayBuffer(blob);
    });
}

/**
 * --- 将 blob 对象转换为 text ---
 * @param blob 对象
 */
export function blob2Text(blob: Blob): Promise<string> {
    return new Promise(function(resove) {
        let fr = new FileReader();
        fr.addEventListener("load", function(e) {
            if (e.target) {
                resove(e.target.result as string);
            } else {
                resove("");
            }
        });
        fr.readAsText(blob);
    });
}

/**
 * --- 完整的克隆一份数组/对象 ---
 * @param obj 要克隆的对象
 */
export function clone(obj: Record<string, any> | any[]): object {
    let newObj: any = {};
    if (obj instanceof Array) {
        newObj = [];
        for (let i = 0; i < obj.length; ++i) {
            newObj[i] = typeof obj[i] === "object" ? clone(obj[i]) : obj[i];
        }
    } else {
        for (let key in obj) {
            newObj[key] = typeof obj[key] === "object" ? clone(obj[key]) : obj[key];
        }
    }
    return newObj;
}

