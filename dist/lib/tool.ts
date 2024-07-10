/**
 * Copyright 2024 Han Guoshuai <zohegs@gmail.com>
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
import * as types from '../../types';

interface IClassPrototype {
    'method': Record<string, any>;
    'access': Record<string, {
        'get'?: any;
        'set'?: any;
    }>;
}

/**
 * --- 获取 class 的所有 method 和 get/set ---
 * @param obj 实例化 class 对象
 * @param over 不传入此参数
 * @param level 不传入此参数
 */
export function getClassPrototype(obj: object, over: string[] = [], level: number = 0): IClassPrototype {
    if (level === 0) {
        return getClassPrototype(Object.getPrototypeOf(obj), over, level + 1);
    }
    const rtn: IClassPrototype = {
        'method': {},
        'access': {}
    };
    const names = Object.getOwnPropertyNames(obj);
    if (names.includes('toString')) {
        return rtn;
    }
    for (const item of names) {
        if (item === 'constructor') {
            continue;
        }
        if (over.includes(item)) {
            continue;
        }
        const des = Object.getOwnPropertyDescriptor(obj, item);
        if (!des) {
            continue;
        }
        over.push(item);
        if (des.value) {
            // --- method ---
            rtn.method[item] = des.value;
        }
        else if (des.get ?? des.set) {
            if (!rtn.access[item]) {
                rtn.access[item] = {};
            }
            if (des.get) {
                rtn.access[item].get = (des as any).get;
            }
            if (des.set) {
                rtn.access[item].set = (des as any).set;
            }
        }
    }
    // --- 往上级检查 ---
    const rtn2 = getClassPrototype(Object.getPrototypeOf(obj), over, level + 1);
    Object.assign(rtn.method, rtn2.method);
    Object.assign(rtn.access, rtn2.access);
    return rtn;
}

/**
 * --- 将 blob 对象转换为 ArrayBuffer ---
 * @param blob 对象
 */
export function blob2ArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
    return new Promise(function(resove) {
        const fr = new FileReader();
        fr.addEventListener('load', function() {
            resove(fr.result as ArrayBuffer);
        });
        fr.readAsArrayBuffer(blob);
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
            if (obj[i] instanceof Date) {
                newObj[i] = new Date(obj[i].getTime());
            }
            else if (obj[i] instanceof FormData) {
                const fd = new FormData();
                for (const item of obj[i]) {
                    fd.append(item[0], item[1]);
                }
                newObj[i] = fd;
            }
            else if (obj[i] === null) {
                newObj[i] = null;
            }
            else if (typeof obj[i] === 'object') {
                newObj[i] = clone(obj[i]);
            }
            else {
                newObj[i] = obj[i];
            }
        }
    }
    else {
        for (const key in obj) {
            if (obj[key] instanceof Date) {
                newObj[key] = new Date(obj[key].getTime());
            }
            else if (obj[key] instanceof FormData) {
                const fd = new FormData();
                for (const item of obj[key]) {
                    fd.append(item[0], item[1]);
                }
                newObj[key] = fd;
            }
            else if (obj[key] === null) {
                newObj[key] = null;
            }
            else if (typeof obj[key] === 'object') {
                newObj[key] = clone(obj[key]);
            }
            else {
                newObj[key] = obj[key];
            }
        }
    }
    return newObj;
}

/**
 * --- 等待毫秒 ---
 * @param ms 等待的毫秒，默认 0，最大 3 秒
 */
export function sleep(ms: number = 0): Promise<boolean> {
    return new Promise(function(resolve) {
        if (ms > 1000 * 3) {
            resolve(false);
            return;
        }
        window.setTimeout(function() {
            resolve(true);
        }, ms);
    });
}

/**
 * --- 等待浏览器帧 ---
 */
export function nextFrame(): Promise<void> {
    return new Promise(function(resolve) {
        requestAnimationFrame(() => {
            resolve();
        });
    });
}

/**
 * --- 等待浏览器帧 ---
 * @param count 等待帧数最高 10 帧
 */
export async function sleepFrame(count: number): Promise<void> {
    if (count > 10) {
        count = 10;
    }
    for (let i = 0; i < count; ++i) {
        await nextFrame();
    }
}

/**
 * --- 去除 html 的空白符、换行以及注释 ---
 * @param text 要纯净的字符串
 */
export function purify(text: string): string {
    text = '>' + text + '<';
    const scripts: string[] = [];
    let num: number = -1;
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/<script[\s\S]+?<\/script>/g, function(t: string): string {
        scripts.push(t);
        return '[SCRIPT]';
    }).replace(/>([\s\S]*?)</g, function(t: string, t1: string): string {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    }).replace(/\[SCRIPT\]/g, function(): string {
        ++num;
        return scripts[num];
    });
    return text.slice(1, -1);
}

/**
 * --- 传入正则进行匹配 str 是否有一项满足 ---
 * @param str 要检测的字符串
 * @param regs 正则列表
 */
export function match(str: string, regs: RegExp[]): boolean {
    for (const reg of regs) {
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}

/**
 * --- 将 style 中的 url 转换成 base64 data url ---
 * @param path 路径基准或以文件的路径为基准，以 / 结尾
 * @param style 样式表
 * @param files 在此文件列表中查找
 */
export async function styleUrl2DataUrl(
    path: string,
    style: string,
    files: Record<string, Blob | string>
): Promise<string> {
    const reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
    let match: RegExpExecArray | null = null;
    while ((match = reg.exec(style))) {
        let realPath = urlResolve(path, match[1]);
        if (realPath.startsWith('/package/')) {
            // --- 处理 form 里面的路径 ---
            realPath = realPath.slice(8);
        }
        if (!files[realPath]) {
            continue;
        }
        if (typeof files[realPath] !== 'string') {
            style = style.replace(match[0], `url('${await blob2DataUrl(files[realPath] as Blob)}')`);
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
    const list: string[] = [];
    layout = layout.replace(/(\S+)=(".+?"|'.+?')/g, function(t, t1): string {
        // --- t1 不是标签名，而是 attr 名，例如 class="xxx"、style="xxx" ---
        if (t1 === 'class') {
            return t;
        }
        list.push(t);
        return '"CG-PLACEHOLDER"';
    });
    // --- 开始添加 class tag ---
    layout = layout.replace(/<(\/{0,1})([\w-]+)([\s\S]*?>)/g, function(t, t1, t2: string, t3: string): string {
        // --- t1 是 /，t2 是 tagname，t3 是标签其他内容 ---
        if (['template', 'slot', 'teleport'].includes(t2)) {
            return t;
        }
        else {
            // --- 需要给 class 添加 cg-xxx ---
            if (t1 === '/') {
                if (t2 === 'block') {
                    return '</div' + t3;
                }
                else {
                    return retagname ? ('</cg-' + t2 + t3) : t;
                }
            }
            if (t3.toLowerCase().includes(' class')) {
                // --- 有 class，前置增加 ---
                t3 = t3.replace(/ class=(["']{0,1})/i, ' class=$1tag-' + t2 + ' ');
            }
            else {
                // --- 无 class 的 attr，增加 attr ---
                t3 = ` class="tag-${t2}"` + t3;
            }
            if (t2 === 'block') {
                return '<div' + t3;
            }
            else {
                return retagname ? ('<cg-' + t2 + t3) : ('<' + t2 + t3);
            }
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
            for (const item of opt.ignore) {
                if (item.test(t1)) {
                    return t;
                }
            }
        }
        if (opt.include) {
            let found = false;
            for (const item of opt.include) {
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
    /*
    return '{' + object.replace(/(.+?):(.+?)(,|$)/g, function(t, t1: string, t2: string, t3: string) {
        // --- t1 是 'xxx', t2 是 xxx，t3 是结尾或者 , 分隔符 ---
        t1 = t1.trim();
        if (t1.startsWith('[')) {
            t1 = '[classPrepend(' + t1.slice(1, -1) + ')]';
        }
        else {
            let sp = '';
            if (t1.startsWith('\'') || t1.startsWith('"')) {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            t1 = `[classPrepend(${sp}${t1}${sp})]`;
        }
        return t1 + ':' + t2 + t3;
    }) + '}';
    //*/
    return '{' + object.replace(/([ a-zA-Z0-9'"`[\]\-_]+)(\s*:)/g, function(t, t1: string, t2: string) {
        // --- t1 是 'xxx', t2 是 xxx，t3 是结尾或者 , 分隔符 ---
        t1 = t1.trim();
        if (t1.startsWith('[')) {
            t1 = '[classPrepend(' + t1.slice(1, -1) + ')]';
        }
        else {
            let sp = '';
            if (t1.startsWith('\'') || t1.startsWith('"') || t1.startsWith('`')) {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            t1 = `[classPrepend(${sp}${t1}${sp})]`;
        }
        return t1 + t2;
    }) + '}';
}
/**
 * --- 给 class 增加 scope 的随机前缀，给 id 新增前缀 ---
 * @param layout layout
 * @param preps 前置标识符列表，特殊字符串 scope 会被替换为随机前缀
 */
export function layoutClassPrepend(layout: string, preps: string[]): string {
    return layout.replace(/ class=["'](.+?)["']/gi, function(t, t1: string) {
        // --- t1 为 xxx yyy zzz 这样的 ----
        t1 = t1.trim();
        const classList = t1.split(' ');
        const resultList: string[] = [];
        for (const item of classList) {
            for (const prep of preps) {
                resultList.push(prep + item);
            }
        }
        return ` class="${resultList.join(' ')}"`;
    //}).replace(/ :class=(["']).+?>/gi, function(t, sp) {
    }).replace(/ :class=(["']).+?["']((\s+[a-zA-Z0-9-_:@]+(=|\s*>))|(\s*)>)/gi, function(t, sp) {
        return t.replace(new RegExp(` :class=${sp}(.+?)${sp}((\\s+[a-zA-Z0-9-_:@]+(=|\\s*>))|(\\s*)>)`, 'gi'), function(t, t1: string, t2: string) {
            // --- t1 为 [] 或 {} ---
            t1 = t1.trim();
            if (t1.startsWith('[')) {
                // --- ['xxx', yyy && 'yyy'] ---
                t1 = t1.slice(1, -1);
                /** --- 'xxx', yyy && 'yyy' 的数组 --- */
                const t1a = t1.split(',');
                for (let i = 0; i < t1a.length; ++i) {
                    t1a[i] = t1a[i].trim();
                    if (t1a[i].startsWith('{')) {
                        t1a[i] = layoutClassPrependObject(t1a[i]);
                    }
                    else {
                        t1a[i] = 'classPrepend(' + t1a[i] + ')';
                    }
                }
                t1 = '[' + t1a.join(',') + ']';
            }
            else {
                t1 = layoutClassPrependObject(t1);
            }
            return ` :class="${t1}"${t2}`;
        });
    }).replace(/ id=(["'])/gi, ' id=$1' + preps[0]);
}

/**
 * --- 对 layout 的 @events 事件进行包裹 ---
 * @param layout 要包裹的 layout
 */
export function eventsAttrWrap(layout: string): string {
    const events = ['click', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keypress', 'keyup', 'contextmenu'];
    const reg = new RegExp(`@(${events.join('|')})="(.+?)"`, 'g');
    return layout.replace(reg, function(t, t1, t2): string {
        if (/^[\w]+$/.test(t2)) {
            return `@${t1}="allowEvent($event) && ${t2}($event)"`;
        }
        return `@${t1}=";if(allowEvent($event)){${t2}}"`;
    });
}

/**
 * --- 对 layout 的 teleport 做转义处理为 vue 识别的内容 ---
 * @param layout 要处理的窗体或控件的 layout
 * @param formId 要加入的 formId
 */
export function teleportGlue(layout: string, formId: number | string): string {
    if (typeof formId !== 'string') {
        formId = formId.toString();
    }
    const fid = formId;
    return layout.replace(/<teleport([\s\S]+?)to="(.+?)"([\s\S]+?<[\w-]+)/g, (v, v1, v2, v3): string => {
        if (v2 !== 'system') {
            return v;
        }
        // --- 给 teleport 的第一个子元素增加 cg-pop、cg-pop-none 的 data ---
        return '<teleport' + v1 + 'to="#cg-pop-list > [data-form-id=\'' + fid + '\']"' + v3 + ' data-cg-pop data-cg-pop-none';
    });
}

/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param style 样式内容
 * @param prep 给 class、font 等增加前置
 */
export function stylePrepend(style: string, prep: string = ''): { 'style': string; 'prep': string; } {
    if (prep === '') {
        prep = 'cg-scope' + Math.round(Math.random() * 1000000000000000).toString() + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function(t, t1: string, t2: string) {
        // --- xxx { xxx; } ---
        // --- 将 element 模式的 css 变为 class 模式，如 div 变为 .tag-div ---
        // --- 这里面遇到了一个 bug， @keyframe 也被转换了，这是不对的，因此在下面修复 ---
        t1 = t1.replace(/(^|[ >,\r\n])([a-zA-Z-_][a-zA-Z0-9-_]*)/g,
            function(t: string, t1: string, t2: string) {
                if (t2 === 'global') {
                    return '[CGTMP-GLOBAL]';
                }
                return t1 + '.tag-' + t2;
            }
        );
        t1 = t1.replace(/keyframes \.tag-([a-zA-Z0-9-_]+)/g, function(t: string, t1: string) {
            return 'keyframes ' + t1;
        });
        // --- 给 style 的 class 前添加 scope ---
        t1 = t1.replace(/([.#])([a-zA-Z0-9-_]+)/g, function(t: string, t1: string, t2: string) {
            /*
            if (t2.startsWith('cg-')) {
                return t;
            }
            */
            return t1 + prep + t2;
        }) + '{' + t2 + '}';
        return t1;
    });
    // --- 自定义 font 名添加 scope ---
    const fontList: string[] = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi,
        function(t, t1: string, t2: string, t3: string) {
            fontList.push(t2);
            return t1 + prep + t2 + t3;
        }
    );
    // --- 对自定义 font 进行更名 ---
    for (const font of fontList) {
        const reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function(t, t1: string, t2: string) {
            return t1 + prep + t2;
        });
    }
    // --- keyframes ---
    const keyframeList: string[] = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi,
        function(t, t1: string, t2: string, t3: string) {
            if (!keyframeList.includes(t2)) {
                keyframeList.push(t2);
            }
            return t1 + prep + t2 + t3;
        }
    );
    // --- 对自定义 keyframe 进行更名 ---
    for (const keyframe of keyframeList) {
        let reg = new RegExp(`(animation[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function(t, t1: string, t2: string, t3: string) {
            return t1 + prep + t2 + t3;
        });
        reg = new RegExp(`(animation-name[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function(t, t1: string, t2: string, t3: string) {
            return t1 + prep + t2 + t3;
        });
        // --- 为什么分两个呢？一个加 (-name)? 也行，但是后面的 tx 不好合并 ---
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
    const lio = path.lastIndexOf('.');
    const ext: string = (lio === -1 ? path : path.slice(lio + 1)).toLowerCase();
    const exts: Record<string, string> = {
        'eot': 'application/vnd.ms-fontobject',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'svg': 'image/svg+xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    };
    const mime: string = exts[ext] ?? 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
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

export const RANDOM_N = '0123456789';
export const RANDOM_U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const RANDOM_L = 'abcdefghijklmnopqrstuvwxyz';

export const RANDOM_UN = RANDOM_U + RANDOM_N;
export const RANDOM_LN = RANDOM_L + RANDOM_N;
export const RANDOM_LU = RANDOM_L + RANDOM_U;
export const RANDOM_LUN = RANDOM_L + RANDOM_U + RANDOM_N;
export const RANDOM_V = 'ACEFGHJKLMNPRSTWXY34567';
export const RANDOM_LUNS = RANDOM_LUN + '()`~!@#$%^&*-+=_|{}[]:;\'<>,.?/]"';
export function random(length: number = 8, source: string = RANDOM_LN, block: string = ''): string {
    // --- 剔除 block 字符 ---
    let len = block.length;
    if (len > 0) {
        for (let i = 0; i < len; ++i) {
            source = source.replace(block[i], '');
        }
    }
    len = source.length;
    if (len === 0) {
        return '';
    }
    let temp = '';
    for (let i = 0; i < length; ++i) {
        temp += source[rand(0, len - 1)];
    }
    return temp;
}

/**
 * --- 根据参数获取最终的布尔值 ---
 * @param param 参数
 */
export function getBoolean(param: boolean | string | number | undefined): boolean {
    const t = typeof param;
    if (t === 'boolean') {
        return param as boolean;
    }
    if (t === 'string') {
        return param === 'false' ? false : true;
    }
    return param ? true : false;
}

/**
 * --- 根据参数获取最终的数字型 ---
 * @param param 参数
 */
export function getNumber(param: string | number): number {
    if (typeof param === 'number') {
        return param;
    }
    return parseFloat(param);
}

/**
 * --- 根据参数获取最终的数组型，可传入类似 [1,2,3] 或 1,2,3 ---
 * @param param 参数
 */
export function getArray(param: string | any[]): any[] {
    if (typeof param !== 'string') {
        return param;
    }
    param = param.trim();
    let rtn: any[] = [];
    if (param.startsWith('[')) {
        try {
            rtn = JSON.parse(param);
        }
        catch {
            return [];
        }
    }
    else {
        param = param.replace(/ /g, '');
        rtn = param.split(',');
    }
    return rtn;
}

/**
 * --- 转义 HTML ---
 * @param html HTML 字符
 */
export function escapeHTML(html: string): string {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * --- rgb 字符串转 hsl 数组 ---
 * @param rgb rgb(x, x, x) 或直接 x,x,x
 */
export function rgb2hsl(rgb: string): number[] {
    if (rgb.includes('(')) {
        const match = /[0-9., ]+/.exec(rgb);
        if (!match) {
            return [0, 0, 0];
        }
        rgb = match[0];
    }
    const arr = rgb.split(',');
    const [r, g, b] = arr.map(v => parseInt(v) / 255);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0 ;
    const l = (max + min) / 2;
    const s2 = 1 - Math.abs(max + min - 1);
    const s = s2 ? (diff / s2) : 0;

    switch (min) {
        case max:
            h = 0 ;
            break;
        case r:
            h = (60 * ((b - g) / diff)) + 180;
            break;
        case g:
            h = (60 * ((r - b) / diff)) + 300;
            break;
        case b:
            h = (60 * ((g - r) / diff)) + 60;
            break;
    }
    return [h, s, l];
}

/**
 * --- 发起一个网络请求 ---
 * @param url 网址
 * @param opt 选项
 */
export function request(url: string, opt: types.IRequestOptions): Promise<null | any> {
    return new Promise(function(resove) {
        const xhr = new XMLHttpRequest();
        if (opt.credentials === false) {
            xhr.withCredentials = false;
        }
        xhr.upload.onloadstart = function(e: ProgressEvent): void {
            const r = opt.uploadStart?.(e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        };
        xhr.upload.onprogress = function(e: ProgressEvent): void {
            const r = opt.uploadProgress?.(e.loaded, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        };
        xhr.upload.onloadend = function(): void {
            const r = opt.uploadEnd?.();
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        };
        xhr.onloadstart = function(e: ProgressEvent): void {
            const r = opt.start?.(e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        };
        xhr.onprogress = function(e: ProgressEvent): void {
            const r = opt.progress?.(e.loaded, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        };
        xhr.onloadend = function(): void {
            const r = opt.end?.();
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        };
        xhr.onload = function(): void {
            let res = this.response;
            if (this.getResponseHeader('content-type')?.includes('json')) {
                try {
                    res = JSON.parse(res);
                }
                catch {
                    res = this.response;
                }
            }
            const r = opt.load?.(res);
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
            resove(res);
        };
        xhr.onerror = function(): void {
            const r = opt.error?.();
            if (r && (r instanceof Promise)) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
            resove(null);
        };
        if (opt.responseType) {
            xhr.responseType = opt.responseType;
        }
        if (opt.timeout) {
            xhr.timeout = opt.timeout;
        }
        if (opt.headers) {
            for (const k in opt.headers) {
                xhr.setRequestHeader(k, (opt.headers as any)[k]);
            }
        }
        xhr.open(opt.method ?? 'GET', url, true);
        xhr.send(opt.body);
    });
}

export function fetch(url: string, init?: RequestInit): Promise<string | Blob | null> {
    return loader.fetch(url, init);
}

export function get(url: string, opt?: {
    'credentials'?: 'include' | 'same-origin' | 'omit';
    'headers'?: HeadersInit;
}): Promise<Response | null> {
    return loader.get(url, opt);
}

export function post(url: string, data: Record<string, any> | FormData, opt?: {
    'credentials'?: 'include' | 'same-origin' | 'omit';
    'headers'?: HeadersInit;
}): Promise<Response | null> {
    return loader.post(url, data, opt);
}

/** --- 发送 get 响应为 json 的网络数据，无需 try，失败返回 null */
export async function getResponseJson(url: string, opt?: {
    'credentials'?: 'include' | 'same-origin' | 'omit';
    'headers'?: HeadersInit;
}): Promise<any | null> {
    return loader.getResponseJson(url, opt);
}

/** --- 发送响应为 json 的网络数据，无需 try，失败返回 null --- */
export async function postResponseJson(url: string, data: Record<string, any> | FormData, opt?: {
    'credentials'?: 'include' | 'same-origin' | 'omit';
    'headers'?: HeadersInit;
}): Promise<any | null> {
    return loader.postResponseJson(url, data, opt);
}

export function parseUrl(url: string): ILoaderUrl {
    return loader.parseUrl(url);
}

export function urlResolve(from: string, to: string): string {
    return loader.urlResolve(from, to);
}

export function urlAtom(url: string): string {
    return loader.urlAtom(url);
}

export function blob2Text(blob: Blob): Promise<string> {
    return loader.blob2Text(blob);
}

export function blob2DataUrl(blob: Blob): Promise<string> {
    return loader.blob2DataUrl(blob);
}

export function execCommand(ac: string): void {
    if (!['copy', 'cut'].includes(ac)) {
        return;
    }
    // eslint-disable-next-line deprecation/deprecation
    document.execCommand(ac);
}

/**
 * ---- 对比老值和新值，看看新值中哪些移除了，哪些新增了 ---
 * @param before 老值
 * @param after 新值
 */
export function compar(before: Array<string | number>, after: Array<string | number>): {
    'remove': Record<string, number>;
    'add': Record<string, number>;
    'length': {
        'remove': number;
        'add': number;
    };
} {
    const rtn: {
        'remove': Record<string, number>;
        'add': Record<string, number>;
        'length': {
            'remove': number;
            'add': number;
        };
    } = {
        'remove': {},
        'add': {},
        'length': {
            'remove': 0,
            'add': 0
        }
    };
    for (let i = 0; i < before.length; ++i) {
        const item = before[i];
        if (after.includes(item)) {
            continue;
        }
        rtn.remove[item] = i;
        ++rtn.length.remove;
    }
    for (let i = 0; i < after.length; ++i) {
        const item = after[i];
        if (before.includes(item)) {
            continue;
        }
        rtn.add[item] = i;
        ++rtn.length.add;
    }
    return rtn;
}

/** --- 将秒数格式化为 0:0:0 的字符串 --- */
export function formatSecond(second: number): string {
    const h = Math.floor(second / 3600);
    second = second - h * 3600;
    const m = Math.floor(second / 60);
    const s = Math.floor(second - m * 60);
    return (h ? h.toString().padStart(2, '0') + ':' : '') + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}

/**
 * --- 将对象转换为 query string ---
 * @param query 要转换的对象
 */
export function queryStringify(query: Record<string, any>): string {
    return Object.entries(query).map(([k, v]) => {
        if (Array.isArray(v)) {
            return v.map((i) => `${encodeURIComponent(k)}=${encodeURIComponent(`${i}`)}`).join('&');
        }
        return `${encodeURIComponent(k)}=${encodeURIComponent(`${v}`)}`;
    }).join('&');
}

/**
 * --- 将 query string 转换为对象 ---
 * @param query 要转换的字符串
 */
export function queryParse(query: string): Record<string, string | string[]> {
    const ret: Record<string, string | string[]> = {};
    const arrayKeys: Record<string, boolean> = {};
    for (const i of query.split('&')) {
        if (!i.length) {
            continue;
        }

        const pos = i.indexOf('=');

        const key = decodeURIComponent(pos === -1 ? i : i.slice(0, pos));
        const value = pos === -1 ? '' : decodeURIComponent(i.slice(pos + 1));

        if (arrayKeys[key]) {
            (ret[key] as string[]).push(value);
        }
        else if (undefined === ret[key]) {
            ret[key] = value;
        }
        else {
            ret[key] = [ret[key] as string, value];
            arrayKeys[key] = true;
        }
    }
    return ret;
}
