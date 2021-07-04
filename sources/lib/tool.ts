/**
 * Copyright 2021 Han Guoshuai <zohegs@gmail.com>
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
 * --- 将 obj 中的一个文件路径转换成 object url，已经转换的直接返回 ---
 * @param file 要转换的文件绝对路径（不能用 clickgo 路径）
 * @param obj 包含 files 属性的对象
 */
export function file2ObjectUrl(file: string, obj: ICGTask | ICGControl | ICGThemePkg): string | null {
    let ourl = obj.objectURLs[file];
    if (!ourl) {
        if (!obj.files[file]) {
            return null;
        }
        if (typeof obj.files[file] === 'string') {
            return null;
        }
        ourl = createObjectURL(obj.files[file] as Blob);
        obj.objectURLs[file] = ourl;
    }
    return ourl;
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
 * --- 去除 html 的空白符、换行以及注释 ---
 * @param text 要纯净的字符串
 */
export function purify(text: string): string {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function(t: string, t1: string) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}

/**
 * --- 判断是否是 ControlPkg 对象 ---
 * @param o 要判断的对象
 */
export function isControlPkg(o: string | any): o is ICGControlPkg {
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
export function isAppPkg(o: string | any): o is ICGAppPkg {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}

/**
 * --- 将 style 中的 url 转换成 object 或 base64 data url(不存在会自动创建 object url) ---
 * @param path 路径基准或以文件的路径为基准
 * @param style 样式表
 * @param obj 包含 files 属性的对象
 * @param mode object/data
 */
export async function styleUrl2ObjectOrDataUrl(path: string, style: string, obj: ICGTask | ICGControl | ICGThemePkg, mode: 'object' | 'data' = 'object'): Promise<string> {
    let reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
    let match: RegExpExecArray | null = null;
    while ((match = reg.exec(style))) {
        let realPath = loader.urlResolve(path, match[1]);
        if (!obj.files[realPath]) {
            continue;
        }
        if (mode === 'data') {
            if (typeof obj.files[realPath] !== 'string') {
                style = style.replace(match[0], `url('${await blob2DataUrl(obj.files[realPath] as Blob)}')`);
            }
        }
        else {
            style = style.replace(match[0], `url('${file2ObjectUrl(realPath, obj)}')`);
        }
    }
    return style;
}

/**
 * --- 给标签增加 tag-tagname 的 class，同时给标签增加 cg- 前导（仅字符串，不是操作真实 dom） ---
 * @param layout layout
 * @param retagname 是否更改 tagname 为 cg-tagname
 */
export function layoutAddTagClassAndReTagName(layout: string, retagname: boolean): string {
    // --- "" '' 引号中的内容先替换为 placeholder 排除掉干扰 ---
    let list: string[] = [];
    layout = layout.replace(/(\S+)=(".+?"|'.+?')/g, function(t, t1): string {
        // --- t1 不是标签名，而是 attr 名，例如 class="xxx"、style="xxx" ---
        if (t1 === 'class') {
            return t;
        }
        list.push(t);
        return '"CG-PLACEHOLDER"';
    });
    // --- 开始添加 class tag ---
    layout = layout.replace(/<(\/{0,1})([\w-]+)([\s\S]*?>)/g, function(t, t1, t2, t3): string {
        // --- t1 是 /，t2 是 tagname，t3 是标签其他内容 ---
        if (['template', 'slot', 'teleport'].includes(t2)) {
            return t;
        }
        else {
            // --- 需要给 class 添加 cg-xxx ---
            if (t1 === '/') {
                return retagname ? ('<' + t1 + 'cg-' + t2 + t3) : t;
            }
            if (t3.toLowerCase().includes(' class')) {
                // --- 有 class，前置增加 ---
                t3 = t3.replace(/ class=(["']{0,1})/i, ' class=$1tag-' + t2 + ' ');
            }
            else {
                // --- 无 class 的 attr，增加 attr ---
                t2 = t2 + ` class="tag-${t2}"`;
            }
            return retagname ? ('<cg-' + t2 + t3) : ('<' + t2 + t3);
        }
    });
    // --- 恢复 placeholder ---
    let i = -1;
    return layout.replace(/"CG-PLACEHOLDER"/g, function() {
        return list[++i];
    });
}

/**
 * --- 给标签追加 attr，即使 attr 存在也会追加上一个新的（非真实 DOM 操作，仅仅是对字符串进行处理） ---
 * @param layout 被追加
 * @param insert 要追加
 * @param opt 选项, ignore 忽略的标签，include 包含的标签
 */
export function layoutInsertAttr(layout: string, insert: string, opt: { 'ignore'?: RegExp[]; 'include'?: RegExp[]; } = {}): string {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function(t, t1): string {
        if (opt.ignore) {
            for (let item of opt.ignore) {
                if (item.test(t1)) {
                    return t;
                }
            }
        }
        if (opt.include) {
            let found = false;
            for (let item of opt.include) {
                if (item.test(t1)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return t;
            }
        }
        return t.replace(/<[\w-]+/, function(t) {
            return t + ' ' + insert;
        });
    });
}

/**
 * --- 对 :class 的对象增加实时 css 的前缀 ---
 * @param object :class 中的 {'xxx': xxx, [yyy]: yyy} 字符串
 */
function layoutClassPrependObject(object: string): string {
    object = object.slice(1, -1).trim();
    return '{' + object.replace(/(.+?):(.+?)(,|$)/g, function(t, t1, t2, t3) {
        // --- t1 是 'xxx', t2 是 xxx，t3 是结尾或者 , 分隔符 ---
        t1 = t1.trim();
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
 * --- 给 class 增加 scope 的随机前缀 ---
 * @param layout layout
 * @param preps 前置标识符列表，特殊字符串 scope 会被替换为随机前缀
 */
export function layoutClassPrepend(layout: string, preps: string[]): string {
    return layout.replace(/ class=["'](.+?)["']/gi, function(t, t1: string) {
        // --- t1 为 xxx yyy zzz 这样的 ----
        t1 = t1.trim();
        let classList = t1.split(' ');
        let resultList: string[] = [];
        for (let item of classList) {
            for (let prep of preps) {
                resultList.push(prep + item);
            }
        }
        return ` class='${resultList.join(' ')}'`;
    }).replace(/ :class=(["']).+?>/gi, function(t, sp) {
        return t.replace(new RegExp(` :class=${sp}(.+?)${sp}`, 'gi'), function(t, t1: string) {
            // --- t1 为 [] 或 {} ---
            t1 = t1.trim();
            if (t1.startsWith('[')) {
                // --- ['xxx', yyy && 'yyy'] ---
                t1 = t1.slice(1, -1);
                /** --- 'xxx', yyy && 'yyy' 的数组 --- */
                let t1a = t1.split(',');
                for (let i = 0; i < t1a.length; ++i) {
                    t1a[i] = t1a[i].trim();
                    if (t1a[i].startsWith('{')) {
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
    });
}

/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param style 样式内容
 * @param prep 给 class、font 等增加前置
 */
export function stylePrepend(style: string, prep: string = ''): { 'style': string; 'prep': string; } {
    if (prep === '') {
        prep = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function(t, t1, t2) {
        // --- xxx { xxx; } ---
        // --- 将 element 模式的 css 变为 class 模式，如 div 变为 .tag-div ---
        // --- 这里面遇到了一个 bug， @keyframe 也被转换了，这是不对的 ---
        t1 = t1.replace(/(^|[ >,\r\n])([a-zA-Z-_])([a-zA-Z0-9-_]*)/g, function(t: string, t1: string, t2: string, t3: string) {
            return t1 + '.tag-' + t2 + t3;
        });
        t1 = t1.replace(/keyframes \.tag-([a-zA-Z0-9-_]+)/g, function(t: string, t1: string) {
            return 'keyframes ' + t1;
        });
        // --- 给 style 的 class 前添加 scope ---
        return t1.replace(/([.#])([a-zA-Z0-9-_]+)/g, function(t: string, t1: string, t2: string) {
            if (t2.startsWith('cg-')) {
                return t;
            }
            return t1 + prep + t2;
        }) + '{' + t2 + '}';
    });
    // --- 自定义 font 名添加 scope ---
    let fontList: string[] = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function(t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + prep + t2 + t3;
    });
    // --- 对自定义 font 进行更名 ---
    for (let font of fontList) {
        let reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function(t, t1, t2) {
            return t1 + prep + t2;
        });
    }
    // --- keyframes ---
    let keyframeList: string[] = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function(t, t1, t2, t3) {
        if (!keyframeList.includes(t2)) {
            keyframeList.push(t2);
        }
        return t1 + prep + t2 + t3;
    });
    // --- 对自定义 keyframe 进行更名 ---
    for (let keyframe of keyframeList) {
        let reg = new RegExp(`(animation[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function(t, t1, t2, t3) {
            return t1 + prep + t2 + t3;
        });
    }
    return {
        'prep': prep,
        'style': style
    };
}

/**
 * --- 根据后缀、文件名或路径获取 mime 类型（简单版，完整版请使用 @litert/mime.js） ---
 * @param path 后缀、文件名或路径
 */
export function getMimeByPath(path: string): { 'mime': string; 'ext': string; } {
    let lio = path.lastIndexOf('.');
    let ext: string = (lio === -1 ? path : path.slice(lio + 1)).toLowerCase();
    let exts: Record<string, string> = {
        'eot': 'application/vnd.ms-fontobject',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'svg': 'image/svg+xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    };
    let mime: string = exts[ext] ?? 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
}

/** --- 已创建的 object url 列表 --- */
let objectURLList: string[] = [];

/**
 * --- 通过 blob 创建 object url ---
 * @param object blob 对象
 */
export function createObjectURL(object: Blob): string {
    let url = URL.createObjectURL(object);
    objectURLList.push(url);
    return url;
}

/**
 * --- 移除已创建的 object url ---
 * @param url 已创建的 url
 */
export function revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * --- 获取已创建的 object url 列表 ---
 */
export function getObjectURLList(): string[] {
    return objectURLList;
}

/**
 * --- 生成范围内的随机数 ---
 * @param min 最新范围
 * @param max 最大范围
 */
export function rand(min: number, max: number): number {
    if (min > max) {
        [min, max] = [max, min];
    }
    return min + Math.round(Math.random() * (max - min));
}

/**
 * --- 根据参数获取最终的布尔值 ---
 * @param param 参数
 */
export function getBoolean(param: boolean | string | number): boolean {
    let t = typeof param;
    if (t === 'boolean') {
        return param as boolean;
    }
    else if (t === 'string') {
        return param === 'false' ? false : true;
    }
    else {
        return param ? true : false;
    }
}

/**
 * --- 转义 HTML ---
 * @param html HTML 字符
 */
export function escapeHTML(html: string): string {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
