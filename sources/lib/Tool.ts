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

/** --- style list 的 div --- */
let styleListElement: HTMLDivElement = document.createElement('div');
styleListElement.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleListElement);
styleListElement.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleListElement.insertAdjacentHTML('beforeend', `<style class='cg-global'>
.cg-form-list, .cg-pop-list {-webkit-user-select: none; user-select: none; position: fixed; left: 0; top: 0; width: 0; height: 0; cursor: default;}
.cg-form-list {z-index: 20020000;}
.cg-pop-list {z-index: 20020001;}
.cg-form-list img, .cg-pop-list img {vertical-align: bottom;}
.cg-form-list ::selection {
    background-color: rgba(0, 120, 215, .3);
}
.cg-form-list, .cg-pop-list {-webkit-user-select: none; user-select: none;}

.cg-form-list *, .cg-pop-list *, .cg-form-list *::after, .cg-pop-list *::after, .cg-form-list *::before, .cg-pop-list *::before {box-sizing: border-box !important; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
.cg-form-list, .cg-form-list input, .cg-form-list textarea, .cg-pop-list, .cg-pop-list input, .cg-pop-list textarea {font-family: Roboto,-apple-system,BlinkMacSystemFont,"Helvetica Neue","Segoe UI","Oxygen","Ubuntu","Cantarell","Open Sans",sans-serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased; font-weight: 300;}

.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #76b9ed; border-radius: 50%; filter: drop-shadow(0 0 7px #76b9ed); pointer-events: none; opacity: 0;}
.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border: solid 1px rgba(118, 185, 237, .7); box-shadow: 0 0 10px rgba(0, 0, 0, .3); background: rgba(118, 185, 237, .1); pointer-events: none; opacity: 0;}
</style>`);

/**
 * --- 将 blob 对象转换为 base64 url ---
 * @param blob 对象
 */
export function blob2DataUrl(blob: Blob): Promise<string> {
    return new Promise(function(resove) {
        let fr = new FileReader();
        fr.addEventListener('load', function(e) {
            if (e.target) {
                resove(e.target.result as string);
            }
            else {
                resove('');
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
        fr.addEventListener('load', function() {
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
        fr.addEventListener('load', function(e) {
            if (e.target) {
                resove(e.target.result as string);
            }
            else {
                resove('');
            }
        });
        fr.readAsText(blob);
    });
}

/**
 * --- 完整的克隆一份数组/对象 ---
 * @param obj 要克隆的对象
 */
export function clone(obj: Record<string, any> | any[]): any[] | any {
    let newObj: any = {};
    if (obj instanceof Array) {
        newObj = [];
        for (let i = 0; i < obj.length; ++i) {
            newObj[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
        }
    }
    else {
        for (let key in obj) {
            newObj[key] = typeof obj[key] === 'object' ? clone(obj[key]) : obj[key];
        }
    }
    return newObj;
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
 * --- 等待毫秒 ---
 * @param ms 等待的毫秒，默认 0
 */
export function sleep(ms: number = 0): Promise<void> {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, ms);
    });
}

/**
 * --- 创建任务时连同一起创建的 style 标签 ---
 * @param taskId 任务 id
 */
export function createTaskStyleElement(taskId: number): void {
    styleListElement.insertAdjacentHTML('beforeend', `<div id='cg-style-task${taskId}'><div class='cg-style-controls'></div><div class='cg-style-themes'></div><style class='cg-style-global'></style><div class='cg-style-forms'></div></div>`);
}

/**
 * --- 任务结束时需要移除 task 的所有 style ---
 * @param taskId 任务 id
 */
export function removeTaskStyleElement(taskId: number): void {
    document.getElementById('cg-style-task' + taskId)?.remove();
}

/**
 * --- 将 style 内容写入 dom ---
 * @param style 样式内容
 * @param taskId 当前任务 ID
 * @param type 插入的类型
 * @param formId 当前窗体 ID（可空）
 */
export function pushStyle(style: string, taskId: number, type: 'controls' | 'global' | 'forms' = 'global', formId: number = 0): void {
    let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type}`);
    if (!el) {
        return;
    }
    if (type === 'global') {
        el.innerHTML = style;
    }
    else {
        el.insertAdjacentHTML('beforeend', `<style class='cg-style-form${formId}'>${style}</style>`);
    }
}

/**
 * --- 移除 style 样式 dom ---
 * @param taskId 要移除的任务 ID
 * @param formId 要移除的窗体 ID（空的话当前任务样式都会被移除）
 */
export function removeStyle(taskId: number, formId: number = 0): void {
    let styleTask = document.getElementById('cg-style-task' + taskId);
    if (!styleTask) {
        return;
    }
    if (formId === 0) {
        styleTask.remove();
    }
    else {
        let elist = styleTask.querySelectorAll('.cg-style-form' + formId);
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
    text = '>' + text + '<';
    text = text.replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}

/**
 * --- trim ---
 * @param text 要 trim 的文本
 */
export function trim(text: string): string {
    return text.replace(/^\s+|\s+$/, '');
}

/**
 * --- 将相对或绝对路径转换为绝对路径 ---
 * @param path 相对/绝对路径
 */
export function parsePath(path: string): string {
    if (path.slice(0, 2) === '//') {
        // --- //xxx/xxx
        path = clickgo.rootPath.slice(0, clickgo.rootPath.indexOf('//')) + path;
    }
    else if (path[0] === '/') {
        // --- /xxx ---
        path = clickgo.rootPath.replace(/^(http.+?\/\/.+?)\/.*$/, function(t, t1) {
            return t1 + path;
        });
    }
    else if (!/^(.+?):\/\//.test(path)) {
        // --- xxx/xxx ---
        if (path.slice(0, 8) === 'clickgo/') {
            // --- clickgo/xxx ---
            path = clickgo.cgRootPath + path.slice(8);
        }
        else {
            path = clickgo.rootPath + path;
        }
    }
    return path;
}

/**
 * --- 判断是否是 ControlPkg 对象 ---
 * @param o 要判断的对象
 */
export function isControlPkg(o: string | any): o is IControlPkg {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}

/**
 * --- 判断是否是 AppPkg 对象 ---
 * @param o 要判断的对象
 */
export function isAppPkg(o: string | any): o is IAppPkg {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}

/**
 * --- 将 cgc 文件转换为 pkg 对象 ---
 * @param blob 文件 blob
 */
export async function controlBlob2Pkg(blob: Blob): Promise<false | IControlPkg> {
    // --- 判断是否是 cgc 文件 ---
    let dataView = new DataView(await blob2ArrayBuffer(blob));
    if (dataView.getUint8(0) !== 192 || dataView.getUint8(1) !== 1) {
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
        let files: Record<string, Blob> = {};
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

            if (path === '/config.json') {
                config = JSON.parse(await blob2Text(contentBolb));
            }
            else {
                files[path] = contentBolb;
            }
        }
        if (!config) {
            return false;
        }

        controlPkg[name] = {
            'type': 'control',
            'config': config,
            'files': files
        };
    }
    return controlPkg;
}

/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param style 样式内容
 * @param rand 唯一标识符可空
 */
export function stylePrepend(style: string, rand: string = ''): {
    'rand': string;
    'style': string;
} {
    if (rand === '') {
        rand = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    // --- 给 style 的 class 前添加 scope ---
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function(t, t1, t2) {
        return t1.replace(/\.([a-zA-Z0-9-_]+)/g, function(t: string, t1: string) {
            if (t1.slice(0, 3) === 'cg-') {
                return t;
            }
            return '.' + rand + t1;
        }) + '{' + t2 + '}';
    });
    // --- 自定义 font 名添加 scope ---
    let fontList: string[] = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function(t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + rand + t2 + t3;
    });
    // --- 对自定义 font 进行更名 ---
    for (let font of fontList) {
        let reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function(t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    // --- keyframes ---
    let keyframeList: string[] = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function(t, t1, t2, t3) {
        if (keyframeList.indexOf(t2) === -1) {
            keyframeList.push(t2);
        }
        return t1 + rand + t2 + t3;
    });
    // --- 对自定义 keyframe 进行更名 ---
    for (let keyframe of keyframeList) {
        let reg = new RegExp(`(animation.+?)(${keyframe})`, 'gi');
        style = style.replace(reg, function(t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    return {
        'rand': rand,
        'style': style
    };
}

/**
 * --- 将相对路径转换为绝对路径 ---
 * @param dir 路径基准或以文件的路径为基准
 * @param path 原路径
 */
export function pathResolve(dir: string, path: string): string {
    if (path[0] === '/') {
        return path;
    }
    if (dir[dir.length - 1] !== '/') {
        let lio = dir.slice(0, -1).lastIndexOf('/');
        if (lio === -1) {
            dir = '/';
        }
        else {
            dir = dir.slice(0, lio + 1);
        }
    }
    path = dir + path;
    path = path.replace(/\/\.\//g, '/');
    while (/\/(?!\.\.)[^/]+\/\.\.\//.test(path)) {
        path = path.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, '/');
    }
    return path.replace(/\.\.\//g, '');
}

/**
 * --- 将 style 中的 url 转换成 base64 data url ---
 * @param dir 路径基准或以文件的路径为基准
 * @param style 样式表
 * @param files 文件熟
 */
export async function styleUrl2DataUrl(dir: string, style: string, files: Record<string, Blob>): Promise<string> {
    let reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
    let match: RegExpExecArray | null = null;
    let rtn = style;
    while ((match = reg.exec(style))) {
        let path = pathResolve(dir, match[1]);
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
export function layoutInsertAttr(layout: string, insert: string, opt: { 'ignore'?: string[]; 'include'?: string[]; } = {}): string {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function(t, t1): string {
        if (opt.ignore && opt.ignore.indexOf(t1) !== -1) {
            return t;
        }
        if (opt.include && opt.include.indexOf(t1) === -1) {
            return t;
        }
        return t.replace(/<[\w-]+/, function(t) {
            return t + ' ' + insert;
        });
    });
}

/**
 * --- 对 :class 的对象增加实时 css 的前缀 ---
 * @param os :class 中的字符串
 */
function layoutClassPrependObject(os: string): string {
    os = trim(os.slice(1, -1));
    return '{' + os.replace(/(.+?):(.+?)(,|$)/g, function(t, t1, t2, t3) {
        // --- t1 是 class 的头头 ---
        t1 = trim(t1);
        if (t1[0] === '[') {
            t1 = '[cgClassPrepend(' + t1.slice(1, -1) + ')]';
        }
        else {
            let sp = '';
            if (t1[0] === '\'' || t1[0] === '"') {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            t1 = `[cgClassPrepend(${sp}${t1}${sp})]`;
        }
        return t1 + ':' + t2 + t3;
    }) + '}';
}
/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param layout 框架
 * @param rand 唯一标识符列表
 */
export function layoutClassPrepend(layout: string, rand: string[] = []): {
    'rand': string[];
    'layout': string;
} {
    if (rand.length === 0) {
        rand.push('cg-scope' + Math.round(Math.random() * 1000000000000000) + '_');
    }
    return {
        'rand': rand,
        'layout': layout.replace(/ class=["'](.+?)["']/gi, function(t, t1: string) {
            let clist = t1.split(' ');
            let rtn: string[] = [];
            for (let item of clist) {
                for (let r of rand) {
                    rtn.push(r + item);
                }
            }
            return ` class='${rtn.join(' ')}'`;
        }).replace(/ :class=(["']).+?>/gi, function(t, sp) {
            return t.replace(new RegExp(` :class=${sp}(.+?)${sp}`, 'gi'), function(t, t1: string) {
                t1 = trim(t1);
                if (t1[0] === '[') {
                    t1 = t1.slice(1, -1);
                    let t1a = t1.split(',');
                    for (let i = 0; i < t1a.length; ++i) {
                        t1a[i] = trim(t1a[i]);
                        if (t1a[i][0] === '{') {
                            t1a[i] = layoutClassPrependObject(t1a[i]);
                        }
                        else {
                            t1a[i] = 'cgClassPrepend(' + t1a[i] + ')';
                        }
                    }
                    t1 = '[' + t1a.join(',') + ']';
                }
                else {
                    t1 = layoutClassPrependObject(t1);
                }
                return ` :class="${t1}"`;
            });
        })
    };
}
