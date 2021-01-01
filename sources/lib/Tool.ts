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
 * --- 传输 url 并解析为 IUrl 对象 ---
 * @param url url 字符串
 */
export function parseUrl(url: string): ICGUrl {
    // --- test: https://ab-3dc:aak9()$@github.com:80/nodejs/node/blob/master/lib/url.js?mail=abc@def.com#223 ---
    let u: ICGUrl = {
        'auth': null,
        'hash': null,
        'host': null,
        'hostname': null,
        'pass': null,
        'path': null,
        'pathname': '/',
        'protocol': null,
        'port': null,
        'query': null,
        'user': null
    };
    // --- http:, https: ---
    let protocol = /^(.+?)\/\//.exec(url);
    if (protocol) {
        u.protocol = protocol[1].toLowerCase();
        url = url.slice(protocol[0].length);
    }
    // --- 获取 path 开头的 / 的位置 ---
    let hostSp = url.indexOf('/');
    let left = url;
    if (hostSp !== -1) {
        left = url.slice(0, hostSp);
        url = url.slice(hostSp);
    }
    // --- auth: abc:def, abc ---
    if (left) {
        let leftArray = left.split('@');
        let host = left;
        if (leftArray[1]) {
            let auth = leftArray[0].split(':');
            u.user = auth[0];
            if (auth[1]) {
                u.pass = auth[1];
            }
            u.auth = u.user + (u.pass ? ':' + u.pass : '');
            host = leftArray[1];
        }
        // --- host: www.host.com, host.com ---
        let hostArray = host.split(':');
        u.hostname = hostArray[0].toLowerCase();
        if (hostArray[1]) {
            u.port = hostArray[1];
        }
        u.host = u.hostname + (u.port ? ':' + u.port : '');
    }
    // --- 是否有后面 ---
    if (hostSp === -1) {
        return u;
    }
    // --- path and query ---
    let paqArray = url.split('?');
    u.pathname = paqArray[0];
    if (paqArray[1]) {
        // --- query and hash ---
        let qahArray = paqArray[1].split('#');
        u.query = qahArray[0];
        if (qahArray[1]) {
            u.hash = qahArray[1];
        }
    }
    u.path = u.pathname + (u.query ? '?' + u.query : '');
    return u;
}

/**
 * --- 将相对路径根据基准路径进行转换 ---
 * @param from 基准路径
 * @param to 相对路径
 */
export function urlResolve(from: string, to: string): string {
    from = from.replace(/\\/g, '/');
    to = to.replace(/\\/g, '/');
    // --- to 为空，直接返回 form ---
    if (to === '') {
        return from;
    }
    // --- 获取 from 的 scheme, host, path ---
    let f = parseUrl(from);
    // --- 以 // 开头的，加上 from 的 protocol 返回 ---
    if (to.startsWith('//')) {
        return f.protocol ? f.protocol + to : to;
    }
    if (f.protocol) {
        // --- 获取小写的 protocol ---
        from = f.protocol + from.slice(f.protocol.length);
    }
    // --- 获取 to 的 scheme, host, path ---
    let t = parseUrl(to);
    // --- 已经是绝对路径，直接返回 ---
    if (t.protocol) {
        // --- 获取小写的 protocol ---
        return t.protocol + to.slice(t.protocol.length);
    }
    // --- # 或 ? 替换后返回 ---
    if (to.startsWith('#') || to.startsWith('?')) {
        let sp = from.indexOf(to[0]);
        if (sp !== -1) {
            return from.slice(0, sp) + to;
        }
        else {
            return from + to;
        }
    }
    // --- 处理后面的尾随路径 ---
    let abs = (f.auth ? f.auth + '@' : '') + (f.host ? f.host : '');
    if (to.startsWith('/')) {
        // -- abs 类似是 /xx/xx ---
        abs += to;
    }
    else {
        // --- to 是 xx/xx 这样的 ---
        // --- 移除基准 path 不是路径的部分，如 /ab/c 变成了 /ab，/ab 变成了 空 ---
        let path = f.pathname.replace(/\/[^/]*$/g, '');
        // --- abs 是 /xx/xx 了，因为如果 path 是空，则跟上了 /，如果 path 不为空，也是 / 开头 ---
        abs += path + '/' + to;
    }
    // --- 删掉 ./ ---
    abs = abs.replace(/\/\.\//g, '/');
    // --- 删掉 ../ ---
    while (true) {
        let count = 0;
        // --- 用循环法把 /xx/../ 变成 / 进行返回上级目录 ---
        abs = abs.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, function() {
            ++count;
            return '/';
        });
        if (count === 0) {
            break;
        }
    }
    // --- 剩下的 ../ 就是无效的直接替换为空 ---
    abs = abs.replace(/\.\.\//g, '');
    // --- 返回最终结果 ---
    if (f.protocol && !f.host) {
        // --- 类似 c:/ ---
        return f.protocol + abs;
    }
    else {
        // --- 类似 http:// ---
        return (f.protocol ? f.protocol + '//' : '') + abs;
    }
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
    let rtn = style;
    while ((match = reg.exec(style))) {
        let realPath = urlResolve(path, match[1]);
        if (!obj.files[realPath]) {
            continue;
        }
        if (mode === 'data') {
            rtn = rtn.replace(match[0], `url('${await blob2DataUrl(obj.files[realPath])}')`);
        }
        else {
            let ourl = obj.objectURLs[realPath];
            if (!ourl) {
                ourl = createObjectURL(obj.files[realPath]);
                obj.objectURLs[realPath] = ourl;
            }
            rtn = rtn.replace(match[0], `url('${ourl}')`);
        }
    }
    return rtn;
}

/**
 * --- 给标签追加 attr（非真实 DOM 操作，仅仅是对字符串进行处理） ---
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
 * @param os :class 中的字符串
 */
function layoutClassPrependObject(os: string): string {
    os = os.slice(1, -1).trim();
    return '{' + os.replace(/(.+?):(.+?)(,|$)/g, function(t, t1, t2, t3) {
        // --- t1 是 class 的头头 ---
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
 * --- 给 class 前部增加唯一标识符 ---
 * @param layout 框架
 * @param rand 唯一标识符列表
 */
export function layoutClassPrepend(layout: string, rand: string[] = []): { 'rand': string[]; 'layout': string; } {
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
                t1 = t1.trim();
                if (t1.startsWith('[')) {
                    t1 = t1.slice(1, -1);
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
        })
    };
}

/**
 * --- 给 class 前部增加唯一标识符 ---
 * @param style 样式内容
 * @param rand 唯一标识符可空
 */
export function stylePrepend(style: string, rand: string = ''): { 'style': string; 'rand': string; } {
    if (rand === '') {
        rand = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    // --- 给 style 的 class 前添加 scope ---
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function(t, t1, t2) {
        return t1.replace(/\.([a-zA-Z0-9-_]+)/g, function(t: string, t1: string) {
            if (t1.startsWith('cg-')) {
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
        if (!keyframeList.includes(t2)) {
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
