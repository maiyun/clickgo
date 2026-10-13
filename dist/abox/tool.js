let compressorjs = null;
export function isJson(value, seen, depth = 0) {
    if (depth > 64) {
        return false;
    }
    if (value === null || typeof value === 'string' || typeof value === 'boolean') {
        return true;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value);
    }
    if (typeof value !== 'object' || seen?.has(value)) {
        return false;
    }
    const keys = Reflect.ownKeys(value);
    for (const key of keys) {
        if (typeof key === 'symbol') {
            return false;
        }
    }
    const array = Array.isArray(value);
    if (!array && Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    if (!array && prototype && Object.getPrototypeOf(prototype) !== null) {
        return false;
    }
    const length = array ? value.length : keys.length;
    if (array && keys.length !== length + 1) {
        return false;
    }
    seen ??= new Set();
    seen.add(value);
    for (let index = 0; index < length; ++index) {
        const property = Object.getOwnPropertyDescriptor(value, array ? index : keys[index]);
        if (!property?.enumerable || !Object.hasOwn(property, 'value') ||
            !isJson(property.value, seen, depth + 1)) {
            seen.delete(value);
            return false;
        }
    }
    seen.delete(value);
    return true;
}
export function runIife(code) {
    const func = new Function(code + '\nreturn emodule;');
    return func();
}
export async function compressor(file, options = {}) {
    if (!compressorjs) {
        try {
            const cdn = window.clickgo.config?.cdn ?? 'https://cdn.jsdelivr.net';
            await loadScript(cdn + '/npm/compressorjs@1.2.1/dist/compressor.min.js');
            if (!window.Compressor) {
                throw Error('Compressor load failed.');
            }
            compressorjs = window.Compressor;
        }
        catch {
            return false;
        }
    }
    return new Promise(resolve => {
        if (!compressorjs) {
            resolve(false);
            return;
        }
        new compressorjs(file, {
            'quality': options.quality,
            'maxWidth': options.maxWidth,
            'maxHeight': options.maxHeight,
            success: (result) => {
                if ((file instanceof File) && !(result instanceof File)) {
                    resolve(new File([result], file.name, {
                        'lastModified': file.lastModified,
                        'type': file.type,
                    }));
                    return;
                }
                resolve(result);
            },
            error: () => {
                resolve(false);
            },
        });
    });
}
export function getClassPrototype(obj, over = [], level = 0) {
    if (level === 0) {
        obj = Object.getPrototypeOf(obj);
    }
    const rtn = {
        'method': {},
        'access': {},
    };
    const visited = new Set(over);
    let own = true;
    while (true) {
        const names = Object.getOwnPropertyNames(obj);
        if (names.includes('toString')) {
            return rtn;
        }
        for (const item of names) {
            if (item === 'constructor' || visited.has(item)) {
                continue;
            }
            const des = Object.getOwnPropertyDescriptor(obj, item);
            if (!des) {
                continue;
            }
            visited.add(item);
            over.push(item);
            if (des.value) {
                if (own || item !== '__proto__') {
                    rtn.method[item] = des.value;
                }
            }
            else if ((des.get ?? des.set) && !rtn.access[item]) {
                rtn.access[item] = {
                    'get': des.get ?? (() => { }),
                    'set': des.set ?? (() => { }),
                };
            }
        }
        obj = Object.getPrototypeOf(obj);
        own = false;
    }
}
export function blob2ArrayBuffer(blob) {
    return new Promise(function (resove) {
        const fr = new FileReader();
        fr.addEventListener('load', function () {
            resove(fr.result);
        });
        fr.readAsArrayBuffer(blob);
    });
}
export function sizeFormat(size, spliter = ' ') {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = 0;
    while (i < units.length - 1 && size >= 1024.0) {
        size /= 1024.0;
        i++;
    }
    return (Math.round(size * 100) / 100).toString() + spliter + units[i];
}
export function weightFormat(weight, spliter = ' ') {
    const units = ['mg', 'g', 'kg'];
    let i = 0;
    for (; i < 3 && weight >= 1000; ++i) {
        weight /= 1000;
    }
    return (Math.round(weight * 100) / 100).toString() + spliter + units[i];
}
function cloneValue(value, cache) {
    if ((value === null) || (typeof value !== 'object')) {
        return value;
    }
    const cached = cache.get(value);
    if (cached !== undefined) {
        return cached;
    }
    if (value instanceof Date) {
        const date = new Date(value.getTime());
        cache.set(value, date);
        return date;
    }
    if (value instanceof FormData) {
        const formData = new FormData();
        cache.set(value, formData);
        for (const item of value) {
            formData.append(item[0], item[1]);
        }
        return formData;
    }
    if (value instanceof Map) {
        const map = new Map();
        cache.set(value, map);
        for (const item of value) {
            map.set(cloneValue(item[0], cache), cloneValue(item[1], cache));
        }
        return map;
    }
    if (value instanceof Set) {
        const set = new Set();
        cache.set(value, set);
        for (const item of value) {
            set.add(cloneValue(item, cache));
        }
        return set;
    }
    if (Array.isArray(value)) {
        const array = [];
        cache.set(value, array);
        for (let i = 0; i < value.length; ++i) {
            array[i] = cloneValue(value[i], cache);
        }
        return array;
    }
    const object = {};
    cache.set(value, object);
    for (const key in value) {
        object[key] = cloneValue(value[key], cache);
    }
    return object;
}
export function clone(obj) {
    return cloneValue(obj, new WeakMap());
}
export function sleep(ms = 0) {
    return new Promise(function (resolve) {
        if (ms > 30000) {
            resolve(false);
            return;
        }
        window.setTimeout(function () {
            resolve(true);
        }, ms);
    });
}
export function nextFrame() {
    return new Promise(function (resolve) {
        requestAnimationFrame(() => {
            resolve();
        });
    });
}
export async function sleepFrame(count) {
    if (count > 10) {
        count = 10;
    }
    for (let i = 0; i < count; ++i) {
        await nextFrame();
    }
}
export function purify(text) {
    text = '>' + text + '<';
    const scripts = [];
    let num = -1;
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/<script[\s\S]+?<\/script>/g, function (t) {
        scripts.push(t);
        return '[SCRIPT]';
    }).replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    }).replace(/\[SCRIPT\]/g, function () {
        ++num;
        return scripts[num];
    });
    return text.slice(1, -1);
}
export function match(str, regs) {
    for (const reg of regs) {
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}
export async function styleUrl2DataUrl(path, style, files) {
    const reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
    let match = null;
    while ((match = reg.exec(style))) {
        let realPath = urlResolve(path, match[1]);
        if (realPath.startsWith('/package/')) {
            realPath = realPath.slice(8);
        }
        const file = typeof files === 'function' ? await files(realPath) : files[realPath];
        if (!file) {
            continue;
        }
        if (typeof file !== 'string') {
            style = style.replace(match[0], `url('${await blob2DataUrl(file)}')`);
        }
    }
    return style;
}
export function layoutAddTagClassAndReTagName(layout, retagname) {
    const list = [];
    layout = layout.replace(/([^\s<>]+)=(".+?"|'.+?')/g, function (t, t1) {
        if (t1 === 'class') {
            return t;
        }
        list.push(t);
        return '"CG-PLACEHOLDER"';
    });
    layout = layout.replace(/<(\/{0,1})([\w-]+)([\s\S]*?>)/g, function (t, t1, t2, t3) {
        if (['template', 'slot', 'teleport', 'canvas'].includes(t2)) {
            return t;
        }
        else {
            if (t1 === '/') {
                if (t2 === 'block') {
                    return '</div' + t3;
                }
                else {
                    return retagname ? ('</cg-' + t2 + t3) : t;
                }
            }
            if (/\sclass\s*=/.test(t3.toLowerCase())) {
                t3 = t3.replace(/\sclass\s*=(["']{0,1})/i, function (t, t1) {
                    return `${t.slice(0, t.indexOf('class'))}class=${t1}tag-${t2} `;
                });
            }
            else {
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
    let i = -1;
    return layout.replace(/"CG-PLACEHOLDER"/g, function () {
        return list[++i];
    });
}
export function layoutInsertAttr(layout, insert, opt = {}) {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function (t, t1) {
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
        return t.replace(/<[\w-]+/, function (t) {
            return t + ' ' + insert;
        });
    });
}
function layoutClassPrependObject(object) {
    object = object.slice(1, -1).trim();
    return `{${object.replace(/([ a-zA-Z0-9'"`[\]\-_]+)(\s*:)/g, (t, t1, t2) => {
        t1 = t1.trim();
        if (t1.startsWith('[')) {
            t1 = `[classPrepend(${t1.slice(1, -1)})]`;
        }
        else {
            let sp = '';
            if (t1.startsWith('\'') || t1.startsWith('"') || t1.startsWith('`')) {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            else {
                sp = '\'';
            }
            t1 = `[classPrepend(${sp}${t1}${sp})]`;
        }
        return `${t1}${t2}`;
    })}}`;
}
export function layoutClassPrepend(layout, preps) {
    const rtn = layout.replace(/(\s)class=["'](.*?)["']/gi, function (t, t0, t1) {
        t1 = t1.trim();
        const classList = t1.split(/\s+/);
        const resultList = [];
        for (const item of classList) {
            if (!item) {
                continue;
            }
            for (const prep of preps) {
                if (item.startsWith('fa-')) {
                    resultList.push(`${item}`);
                }
                else {
                    resultList.push(`${prep}${item}`);
                }
            }
        }
        return `${t0}class="${resultList.join(' ')}"`;
    }).replace(/\s:class=(["']).*?["']((\s+[a-zA-Z0-9-_:@]+(=|\s*>))|(\s*)>)/gi, function (t, sp) {
        return t.replace(new RegExp(`:class=${sp}([^${sp}]+?)${sp}`, 'gi'), function (t, t1) {
            t1 = t1.trim();
            if (t1.startsWith('[')) {
                const t1a = parseArrayString(t1);
                for (let i = 0; i < t1a.length; ++i) {
                    t1a[i] = t1a[i].trim();
                    if (t1a[i].startsWith('{')) {
                        t1a[i] = layoutClassPrependObject(t1a[i]);
                    }
                    else {
                        t1a[i] = `classPrepend(${t1a[i]})`;
                    }
                }
                t1 = `[${t1a.join(',')}]`;
            }
            else if (t1.startsWith('{')) {
                t1 = layoutClassPrependObject(t1);
            }
            else {
                t1 = `classPrepend(${t1})`;
            }
            return `:class="${t1}"`;
        });
    }).replace(/(\s)id=(["'])/gi, `$1id=$2${preps[0]}`);
    return rtn;
}
export function eventsAttrWrap(layout) {
    const events = ['click', 'dblclick', 'pointerdown', 'pointerenter', 'pointerleave', 'pointerup', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keypress', 'keyup', 'contextmenu'];
    const reg = new RegExp(`@(${events.join('|')})="(.+?)"`, 'g');
    return layout.replace(reg, function (t, t1, t2) {
        if (/^[\w]+$/.test(t2)) {
            return `@${t1}="allowEvent($event) && ${t2}($event)"`;
        }
        return `@${t1}=";if(allowEvent($event)){${t2}}"`;
    });
}
export function teleportGlue(layout, formId) {
    return layout.replace(/<teleport([\s\S]+?)to="(.+?)"([\s\S]+?<[\w-]+)/g, (v, v1, v2, v3) => {
        if (v2 !== 'system') {
            return v;
        }
        return '<teleport' + v1 + 'to="#cg-pop-list > [data-form-id=\'' + formId + '\']"' + v3 + ' data-cg-pop data-cg-pop-none';
    });
}
export function stylePrepend(style, prep = '') {
    if (prep === '') {
        prep = 'cg-scope' + Math.round(Math.random() * 1000000000000000).toString() + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, t1, t2) {
        t1 = t1.replace(/(^|[ >,}\r\n])([a-zA-Z-_][a-zA-Z0-9-_]*)/g, function (t, t1, t2) {
            if (t2 === 'global') {
                return '[CGTMP-GLOBAL]';
            }
            return t1 + '.tag-' + t2;
        });
        t1 = t1.replace(/keyframes \.tag-([a-zA-Z0-9-_]+)/g, function (t, t1) {
            return 'keyframes ' + t1;
        });
        t1 = t1.replace(/([.#])([a-zA-Z0-9-_]+)/g, function (t, t1, t2) {
            return t1 + prep + t2;
        }) + '{' + t2 + '}';
        return t1;
    });
    const fontList = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function (t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + prep + t2 + t3;
    });
    for (const font of fontList) {
        const reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + prep + t2;
        });
    }
    const keyframeList = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function (t, t1, t2, t3) {
        if (!keyframeList.includes(t2)) {
            keyframeList.push(t2);
        }
        return t1 + prep + t2 + t3;
    });
    for (const keyframe of keyframeList) {
        let reg = new RegExp(`(animation[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function (t, t1, t2, t3) {
            return t1 + prep + t2 + t3;
        });
        reg = new RegExp(`(animation-name[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function (t, t1, t2, t3) {
            return t1 + prep + t2 + t3;
        });
    }
    return {
        'prep': prep,
        'style': style
    };
}
export function getMimeByPath(path) {
    const lio = path.lastIndexOf('.');
    const ext = (lio === -1 ? path : path.slice(lio + 1)).toLowerCase();
    const exts = {
        'eot': 'application/vnd.ms-fontobject',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'svg': 'image/svg+xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    };
    const mime = exts[ext] ?? 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
}
export function rand(min, max, prec = 0) {
    if (prec < 0) {
        prec = 0;
    }
    if (prec === 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const p = Math.pow(10, prec);
    return Math.round((Math.random() * (max - min) + min) * p) / p;
}
export function random(length = 8, source, block = '') {
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
export function getBoolean(param) {
    const t = typeof param;
    if (t === 'boolean') {
        return param;
    }
    if (t === 'string') {
        return param === 'false' ? false : true;
    }
    return param ? true : false;
}
export function getNumber(param) {
    if (typeof param === 'number') {
        return param;
    }
    return parseFloat(param);
}
export function getArray(param) {
    if (typeof param !== 'string') {
        return param;
    }
    param = param.trim();
    let rtn = [];
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
export function escapeHTML(html) {
    return html.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&#34;')
        .replace(/'/g, '&#39;');
}
export function unescapeHTML(html) {
    return html.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#34;/g, '"')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&apos;/g, '\'');
}
export function formatColor(color) {
    const matc = /[0-9.%, ]+/.exec(color);
    if (!matc) {
        return [];
    }
    const arr = matc[0].split(',');
    return arr.map((v) => {
        return parseFloat(v);
    });
}
export function rgb2hex(r, g, b, a = 1) {
    if (g === undefined || b === undefined) {
        if (typeof r !== 'string') {
            return '';
        }
        const rgb = formatColor(r);
        r = Math.round(rgb[0]);
        g = Math.round(rgb[1]);
        b = Math.round(rgb[2]);
        a = rgb[3] ?? 1;
    }
    else {
        if (typeof r === 'string') {
            r = Math.round(parseFloat(r));
        }
        if (typeof g === 'string') {
            g = Math.round(parseFloat(g));
        }
        if (typeof b === 'string') {
            b = Math.round(parseFloat(b));
        }
        if (typeof a === 'string') {
            a = parseFloat(a);
        }
    }
    return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0') + (a === 1 ? '' : Math.round(a * 255).toString(16).padStart(2, '0'));
}
export function hex2rgb(hex) {
    const rgb = {
        'r': 0,
        'g': 0,
        'b': 0,
        'a': 1,
        'rgb': 'rgb'
    };
    let alpha = false, h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) {
        h = [...h].map(x => x + x).join('');
    }
    else if (h.length === 8) {
        alpha = true;
    }
    const hn = parseInt(h, 16);
    rgb.r = (hn >>> (alpha ? 24 : 16));
    rgb.g = (hn & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8);
    rgb.b = (hn & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0);
    if (alpha) {
        rgb.a = Math.round((hn & 0x000000ff) / 255 * 100) / 1000;
    }
    rgb.rgb = `${alpha ? 'a' : ''}(${rgb.r},${rgb.g},${rgb.b}${alpha ? ',' + rgb.a : ''})`;
    return rgb;
}
export function rgb2hsl(r, g, b, a = 1, decimal = false) {
    const hsl = {
        'h': 0,
        's': 0,
        'l': 0,
        'a': 1,
        'hsl': 'hsl'
    };
    if (g === undefined || b === undefined) {
        if (typeof r !== 'string') {
            return hsl;
        }
        const rgb = formatColor(r);
        r = rgb[0];
        g = rgb[1];
        b = rgb[2];
        a = rgb[3] ?? 1;
    }
    else {
        if (typeof r === 'string') {
            r = parseFloat(r);
        }
        if (typeof g === 'string') {
            g = parseFloat(g);
        }
        if (typeof b === 'string') {
            b = parseFloat(b);
        }
        if (typeof a === 'string') {
            a = parseFloat(a);
        }
    }
    r /= 255;
    g /= 255;
    b /= 255;
    const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta == 0) {
        h = 0;
    }
    else if (cmax == r) {
        h = ((g - b) / delta) % 6;
    }
    else if (cmax == g) {
        h = (b - r) / delta + 2;
    }
    else {
        h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = s * 100;
    l = l * 100;
    hsl.h = h;
    hsl.s = s;
    hsl.l = l;
    hsl.a = a;
    if (!decimal) {
        hsl.h = Math.round(hsl.h);
        hsl.s = Math.round(hsl.s);
        hsl.l = Math.round(hsl.l);
    }
    hsl.hsl += (hsl.a === 1 ? '' : 'a') + `(${hsl.h},${hsl.s}%,${hsl.l}%${hsl.a === 1 ? '' : ',' + hsl.a})`;
    return hsl;
}
export function hsl2rgb(h, s, l, a = 1, decimal = false) {
    const rgb = {
        'r': 0,
        'g': 0,
        'b': 0,
        'a': 1,
        'rgb': 'rgb'
    };
    if (s === undefined || l === undefined) {
        if (typeof h !== 'string') {
            return rgb;
        }
        const hsl = formatColor(h);
        h = hsl[0];
        s = hsl[1];
        l = hsl[2];
        a = hsl[3] ?? 1;
    }
    else {
        if (typeof h === 'string') {
            h = parseFloat(h);
        }
        if (typeof s === 'string') {
            s = parseFloat(s);
        }
        if (typeof l === 'string') {
            l = parseFloat(l);
        }
        if (typeof a === 'string') {
            a = parseFloat(a);
        }
    }
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const aa = s * Math.min(l, 1 - l);
    const f = (n) => l - aa * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    rgb.r = 255 * f(0);
    rgb.g = 255 * f(8);
    rgb.b = 255 * f(4);
    rgb.a = a;
    if (!decimal) {
        rgb.r = Math.round(rgb.r);
        rgb.g = Math.round(rgb.g);
        rgb.b = Math.round(rgb.b);
    }
    rgb.rgb += (rgb.a === 1 ? '' : 'a') + `(${rgb.r},${rgb.g},${rgb.b}${rgb.a === 1 ? '' : ',' + rgb.a})`;
    return rgb;
}
export function request(url, opt) {
    return new Promise(function (resove) {
        const xhr = new XMLHttpRequest();
        if (opt.credentials === false) {
            xhr.withCredentials = false;
        }
        if (opt.uploadStart) {
            xhr.upload.onloadstart = function (e) {
                const r = opt.uploadStart?.(e.total);
                if (r && (r instanceof Promise)) {
                    r.catch(() => { });
                }
            };
        }
        if (opt.uploadProgress) {
            xhr.upload.onprogress = function (e) {
                const r = opt.uploadProgress?.(e.loaded, e.total);
                if (r && (r instanceof Promise)) {
                    r.catch(() => { });
                }
            };
        }
        if (opt.uploadEnd) {
            xhr.upload.onloadend = function () {
                const r = opt.uploadEnd?.();
                if (r && (r instanceof Promise)) {
                    r.catch(() => { });
                }
            };
        }
        xhr.onloadstart = function (e) {
            const r = opt.start?.(e.total);
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
        };
        xhr.onprogress = function (e) {
            const r = opt.progress?.(e.loaded, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
        };
        xhr.onloadend = function () {
            const r = opt.end?.();
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
        };
        xhr.onload = function () {
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
                r.catch(() => { });
            }
            resove(res);
        };
        xhr.onerror = function () {
            const r = opt.error?.();
            if (r && (r instanceof Promise)) {
                r.catch(() => { });
            }
            resove(null);
        };
        if (opt.responseType) {
            xhr.responseType = opt.responseType;
        }
        if (opt.timeout) {
            xhr.timeout = opt.timeout;
        }
        if (opt.headers && !Array.isArray(opt.headers)) {
            for (const k in opt.headers) {
                xhr.setRequestHeader(k, opt.headers[k]);
            }
        }
        xhr.open(opt.method ?? 'GET', url, true);
        xhr.send(opt.body);
    });
}
export async function fetch(url, init) {
    try {
        const res = await window.fetch(url, init);
        if (res.status === 200 || res.status === 304) {
            const ct = res.headers.get('content-type')?.toLowerCase() ?? '';
            const types = ['text/', 'javascript', 'json', 'css', 'xml', 'html'];
            return types.some(item => ct.includes(item)) ? await res.text() : await res.blob();
        }
        return null;
    }
    catch {
        return null;
    }
}
const retryTimes = [300, 1000, 2000];
export async function get(url, init, opt = {}) {
    init ??= {};
    init.method = 'GET';
    const retry = opt.retry ?? 3;
    for (let i = 0; i <= retry; ++i) {
        const res = await fetch(url, init);
        if (res !== null) {
            return res;
        }
        if (i === retry) {
            return null;
        }
        await sleep(retryTimes[i]);
    }
    return null;
}
export async function post(url, data, init) {
    init ??= {};
    init.method = 'POST';
    init.headers ??= {};
    if (!(data instanceof FormData)) {
        if (init.headers instanceof Headers) {
            init.headers.set('content-type', 'application/json');
        }
        else {
            init.headers['content-type'] = 'application/json';
        }
    }
    init.body = data instanceof FormData ? data : JSON.stringify(data);
    const res = await fetch(url, init);
    return res;
}
export async function getResponseJson(url, init) {
    const res = await get(url, init);
    if (!res) {
        return null;
    }
    if (typeof res !== 'string') {
        return null;
    }
    try {
        return JSON.parse(res);
    }
    catch {
        return null;
    }
}
export function postResponseEventStream(url, data, opts = {}) {
    const controller = new AbortController();
    setTimeout(() => {
        (async () => {
            try {
                const res = await window.fetch(url, {
                    'method': 'POST',
                    'headers': { 'content-type': 'application/json' },
                    'body': JSON.stringify(data),
                    'signal': controller.signal,
                });
                const body = res.body;
                if (!body) {
                    await opts.onTimeout?.();
                    return;
                }
                await opts.onStart?.();
                const reader = body.getReader();
                const decoder = new TextDecoder('utf8');
                let buf = '';
                while (true) {
                    try {
                        const { value, done } = await reader.read();
                        if (done) {
                            break;
                        }
                        buf += decoder.decode(value, { 'stream': true, });
                        if (!buf.includes('\n\n')) {
                            continue;
                        }
                        const events = buf.split('\n\n');
                        buf = events.pop() ?? '';
                        for (const ev of events) {
                            const line = JSON.parse(ev.slice(5).trim());
                            if (line.init) {
                                await opts.onInit?.(line.init);
                                continue;
                            }
                            await opts.onData?.(typeof line === 'string' ? line : (line.choices?.[0]?.delta?.content ?? ''));
                        }
                    }
                    catch {
                        break;
                    }
                }
                await opts.onEnd?.();
            }
            catch {
                await opts.onTimeout?.();
                return;
            }
        })().catch(() => { });
    }, 0);
    return controller;
}
export async function postResponseJson(url, data, init) {
    const res = await post(url, data, init);
    if (!res) {
        return null;
    }
    if (typeof res !== 'string') {
        return null;
    }
    try {
        return JSON.parse(res);
    }
    catch {
        return null;
    }
}
export function parseUrl(url) {
    const rtn = {
        'protocol': null,
        'auth': null,
        'user': null,
        'pass': null,
        'host': null,
        'hostname': null,
        'port': null,
        'pathname': '/',
        'path': null,
        'query': null,
        'hash': null
    };
    const hash = url.indexOf('#');
    if (hash > -1) {
        rtn['hash'] = url.slice(hash + 1);
        url = url.slice(0, hash);
    }
    const query = url.indexOf('?');
    if (query > -1) {
        rtn['query'] = url.slice(query + 1);
        url = url.slice(0, query);
    }
    const protocol = url.indexOf(':');
    if (protocol > -1) {
        rtn['protocol'] = url.slice(0, protocol + 1).toLowerCase();
        url = url.slice(protocol + 1);
        if (url.startsWith('//')) {
            url = url.slice(2);
        }
        let path = url.indexOf('/');
        if (path === -1) {
            path = url.indexOf('\\');
        }
        if (path > -1) {
            rtn['pathname'] = url.slice(path);
            url = url.slice(0, path);
        }
        const auth = url.indexOf('@');
        if (auth > -1) {
            const authStr = url.slice(0, auth);
            const authSplit = authStr.indexOf(':');
            if (authSplit > -1) {
                rtn['user'] = authStr.slice(0, authSplit);
                rtn['pass'] = authStr.slice(authSplit + 1);
                rtn['auth'] = rtn['user'] + ':' + rtn['pass'];
            }
            else {
                rtn['user'] = authStr;
                rtn['auth'] = authStr;
            }
            url = url.slice(auth + 1);
        }
        if (url) {
            const port = url.indexOf(':');
            if (port > -1) {
                rtn['hostname'] = url.slice(0, port).toLowerCase();
                rtn['port'] = url.slice(port + 1);
                rtn['host'] = rtn['hostname'] + (rtn['port'] ? ':' + rtn['port'] : '');
            }
            else {
                rtn['hostname'] = url.toLowerCase();
                rtn['host'] = rtn['hostname'];
            }
        }
    }
    else {
        rtn['pathname'] = url;
    }
    rtn['path'] = rtn['pathname'] + (rtn['query'] ? '?' + rtn['query'] : '');
    return rtn;
}
export function urlResolve(from, to) {
    from = from.replace(/\\/g, '/');
    to = to.replace(/\\/g, '/');
    if (to === '') {
        return urlAtom(from);
    }
    const f = parseUrl(from);
    if (to.startsWith('//')) {
        return urlAtom(f.protocol ? f.protocol + to : to);
    }
    if (f.protocol) {
        from = f.protocol + from.slice(f.protocol.length);
    }
    const t = parseUrl(to);
    if (t.protocol) {
        return urlAtom(t.protocol + to.slice(t.protocol.length));
    }
    if (to.startsWith('#') || to.startsWith('?')) {
        const sp = from.indexOf(to[0]);
        if (sp !== -1) {
            return urlAtom(from.slice(0, sp) + to);
        }
        else {
            return urlAtom(from + to);
        }
    }
    let abs = (f.auth ? f.auth + '@' : '') + (f.host ?? '');
    if (to.startsWith('/')) {
        abs += to;
    }
    else {
        const path = f.pathname.replace(/\/[^/]*$/g, '');
        abs += path + '/' + to;
    }
    if (f.protocol && (f.protocol !== 'file:') && !f.host) {
        return urlAtom(f.protocol + abs);
    }
    else {
        return urlAtom((f.protocol ? f.protocol + '//' : '') + abs);
    }
}
export function urlAtom(url) {
    while (url.includes('/./')) {
        url = url.replace(/\/\.\//g, '/');
    }
    while (/\/(?!\.\.)[^/]+\/\.\.\//.test(url)) {
        url = url.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, '/');
    }
    url = url.replace(/\.\.\//g, '');
    return url;
}
export function blob2Text(blob) {
    return new Promise(function (resove) {
        const fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resove(e.target.result);
            }
            else {
                resove('');
            }
        });
        fr.readAsText(blob);
    });
}
const blobDataUrlCache = new WeakMap();
export function blob2DataUrl(blob) {
    const cached = blobDataUrlCache.get(blob);
    if (cached) {
        return cached;
    }
    const converting = new Promise(function (resolve) {
        const fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resolve(e.target.result);
            }
            else {
                resolve('');
            }
        });
        fr.readAsDataURL(blob);
    });
    blobDataUrlCache.set(blob, converting);
    return converting;
}
export function execCommand(ac) {
    if (!['copy', 'cut'].includes(ac)) {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(ac);
}
export function compar(before, after) {
    const rtn = {
        'remove': {},
        'add': {},
        'length': {
            'remove': 0,
            'add': 0
        }
    };
    const indexed = before.length >= 64 && after.length >= 64;
    const afterValues = indexed ? new Set(after) : null;
    const beforeValues = indexed ? new Set(before) : null;
    for (let i = 0; i < before.length; ++i) {
        const item = before[i];
        if (afterValues ? afterValues.has(item) : after.includes(item)) {
            continue;
        }
        rtn.remove[item] = i;
        ++rtn.length.remove;
    }
    for (let i = 0; i < after.length; ++i) {
        const item = after[i];
        if (beforeValues ? beforeValues.has(item) : before.includes(item)) {
            continue;
        }
        rtn.add[item] = i;
        ++rtn.length.add;
    }
    return rtn;
}
export function formatSecond(second) {
    const h = Math.floor(second / 3600);
    second = second - h * 3600;
    const m = Math.floor(second / 60);
    const s = Math.floor(second - m * 60);
    return (h ? h.toString().padStart(2, '0') + ':' : '') + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}
export function formatTime(ts, tz) {
    const rtn = {
        'date': '',
        'time': '',
        'zone': ''
    };
    if (typeof ts === 'number') {
        ts = new Date(ts);
    }
    const ntz = tz ?? -(ts.getTimezoneOffset() / 60);
    ts.setTime(ts.getTime() + ntz * 60 * 60000);
    rtn.date = ts.getUTCFullYear().toString() + '-' + (ts.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + ts.getUTCDate().toString().padStart(2, '0');
    rtn.time = ts.getUTCHours().toString().padStart(2, '0') + ':' + ts.getUTCMinutes().toString().padStart(2, '0') + ':' + ts.getUTCSeconds().toString().padStart(2, '0');
    rtn.zone = 'UTC' + (ntz >= 0 ? '+' : '') + ntz.toString();
    return rtn;
}
export function isMs(time) {
    return time > 1000000000000 ? true : false;
}
export function queryStringify(query, encode = true) {
    if (encode) {
        return Object.entries(query).map(([k, v]) => {
            if (Array.isArray(v)) {
                return v.map((i) => `${encodeURIComponent(k)}=${encodeURIComponent(i)}`).join('&');
            }
            return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
        }).join('&');
    }
    return Object.entries(query).map(([k, v]) => {
        if (Array.isArray(v)) {
            return v.map((i) => `${k}=${i}}`).join('&');
        }
        return `${k}=${v}`;
    }).join('&');
}
export function queryParse(query) {
    const ret = {};
    const arrayKeys = {};
    for (const i of query.split('&')) {
        if (!i.length) {
            continue;
        }
        const pos = i.indexOf('=');
        const key = decodeURIComponent(pos === -1 ? i : i.slice(0, pos));
        const value = pos === -1 ? '' : decodeURIComponent(i.slice(pos + 1));
        if (arrayKeys[key]) {
            ret[key].push(value);
        }
        else if (undefined === ret[key]) {
            ret[key] = value;
        }
        else {
            ret[key] = [ret[key], value];
            arrayKeys[key] = true;
        }
    }
    return ret;
}
export function isEscaped(str, pos) {
    let count = 0;
    for (let i = pos - 1; i >= 0 && str[i] === '\\'; i--) {
        count++;
    }
    return count % 2 !== 0;
}
export function parseArrayString(arrayStr) {
    const content = arrayStr.trim().slice(1, -1);
    const result = [];
    let start = 0;
    let depth = 0;
    let inString = false;
    let quote = '';
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if ((char === '"' || char === "'") && !inString) {
            inString = true;
            quote = char;
        }
        else if (char === quote && inString && !isEscaped(content, i)) {
            inString = false;
            quote = '';
        }
        if (!inString) {
            if (char === '{' || char === '[' || char === '(') {
                depth++;
            }
            else if (char === '}' || char === ']' || char === ')') {
                depth--;
            }
            else if (char === ',' && depth === 0) {
                const item = content.slice(start, i).trim();
                if (item) {
                    result.push(item);
                }
                start = i + 1;
            }
        }
    }
    const item = content.slice(start).trim();
    if (item) {
        result.push(item);
    }
    return result;
}
export function isEscapeChar(code, index) {
    let preChar = code[index - 1];
    let count = 0;
    while (preChar === '\\') {
        preChar = code[index - (++count) - 1];
    }
    return count % 2 === 0 ? false : true;
}
const wordCharacters = new Uint8Array(128);
for (let code = 48; code <= 57; ++code)
    wordCharacters[code] = 1;
for (let code = 65; code <= 90; ++code)
    wordCharacters[code] = 1;
for (let code = 97; code <= 122; ++code)
    wordCharacters[code] = 1;
wordCharacters[95] = 1;
wordCharacters[36] = 2;
function isWordCharacter(char, dollar = true) {
    const kind = wordCharacters[char?.charCodeAt(0) ?? 117];
    return kind === 1 || dollar && kind === 2;
}
export function stateMachine(code, start, process, states) {
    let state = states.NORMAL;
    code = code.replace(/\r\n?/g, '\n');
    const bracket = {
        's': 0,
        'm': 0,
        'l': 0,
    };
    let marker = '';
    let word = '';
    let pre = {
        'state': states.NORMAL,
        'word': '',
        'nonnull': '',
    };
    for (let i = start; i < code.length; ++i) {
        const char = code[i];
        switch (state) {
            case states.COMMENT: {
                if (marker === '*') {
                    if ((char === '*') && (code[i + 1] === '/')) {
                        word += char + code[++i];
                        if ((i >= 0) && !process({
                            'state': state,
                            'start': i - word.length + 1,
                            'end': i,
                            'word': word,
                            'pre': {
                                'state': pre.state,
                                'word': pre.word,
                                'nonnull': pre.nonnull,
                            },
                            'bracket': bracket,
                        })) {
                            return;
                        }
                        pre.state = state;
                        pre.word = word;
                        const wordTrim = word.trim();
                        if (wordTrim) {
                            pre.nonnull = wordTrim;
                        }
                        state = states.NORMAL;
                        word = '';
                        marker = '';
                    }
                    else {
                        word += char;
                    }
                    break;
                }
                if (char === '\n') {
                    --i;
                    if (!process({
                        'state': state,
                        'start': i - word.length + 1,
                        'end': i,
                        'word': word,
                        'pre': {
                            'state': pre.state,
                            'word': pre.word,
                            'nonnull': pre.nonnull,
                        },
                        'bracket': bracket,
                    })) {
                        return;
                    }
                    pre.state = state;
                    pre.word = word;
                    const wordTrim = word.trim();
                    if (wordTrim) {
                        pre.nonnull = wordTrim;
                    }
                    state = states.NORMAL;
                    word = '';
                    marker = '';
                }
                else {
                    word += char;
                }
                break;
            }
            case states.REG: {
                switch (char) {
                    case '[': {
                        if (!isEscapeChar(code, i)) {
                            marker = '[';
                        }
                        word += char;
                        break;
                    }
                    case ']': {
                        if (!isEscapeChar(code, i) && (marker === '[')) {
                            marker = '/';
                        }
                        word += char;
                        break;
                    }
                    case '/': {
                        if (!isEscapeChar(code, i) && (marker === '/')) {
                            marker = 'e';
                        }
                        word += char;
                        break;
                    }
                    default: {
                        if (marker !== 'e') {
                            word += char;
                            break;
                        }
                        if (isWordCharacter(char, false)) {
                            word += char;
                            break;
                        }
                        --i;
                        if (!process({
                            'state': state,
                            'start': i - word.length + 1,
                            'end': i,
                            'word': word,
                            'pre': {
                                'state': pre.state,
                                'word': pre.word,
                                'nonnull': pre.nonnull,
                            },
                            'bracket': bracket,
                        })) {
                            return;
                        }
                        pre.state = state;
                        pre.word = word;
                        const wordTrim = word.trim();
                        if (wordTrim) {
                            pre.nonnull = wordTrim;
                        }
                        state = states.NORMAL;
                        word = '';
                        marker = '';
                    }
                }
                break;
            }
            case states.STRING: {
                word += char;
                if ((char === marker) && !isEscapeChar(code, i)) {
                    if (!process({
                        'state': state,
                        'start': i - word.length + 1,
                        'end': i,
                        'word': word,
                        'pre': {
                            'state': pre.state,
                            'word': pre.word,
                            'nonnull': pre.nonnull,
                        },
                        'bracket': bracket,
                    })) {
                        return;
                    }
                    pre.state = state;
                    pre.word = word;
                    const wordTrim = word.trim();
                    if (wordTrim) {
                        pre.nonnull = wordTrim;
                    }
                    state = states.NORMAL;
                    word = '';
                    marker = '';
                }
                break;
            }
            case states.WORD: {
                if (!isWordCharacter(char)) {
                    --i;
                    if (!process({
                        'state': state,
                        'start': i - word.length + 1,
                        'end': i,
                        'word': word,
                        'pre': {
                            'state': pre.state,
                            'word': pre.word,
                            'nonnull': pre.nonnull,
                        },
                        'bracket': bracket,
                    })) {
                        return;
                    }
                    pre.state = state;
                    pre.word = word;
                    const wordTrim = word.trim();
                    if (wordTrim) {
                        pre.nonnull = wordTrim;
                    }
                    state = states.NORMAL;
                    word = '';
                    marker = '';
                    break;
                }
                word += char;
                break;
            }
            default: {
                switch (char) {
                    case '"':
                    case '\'':
                    case '`': {
                        if ((i - 1 >= 0) && !process({
                            'state': state,
                            'start': i - 1 - word.length + 1,
                            'end': i - 1,
                            'word': word,
                            'pre': {
                                'state': pre.state,
                                'word': pre.word,
                                'nonnull': pre.nonnull,
                            },
                            'bracket': bracket,
                        })) {
                            return;
                        }
                        pre.state = state;
                        pre.word = word;
                        const wordTrim = word.trim();
                        if (wordTrim) {
                            pre.nonnull = wordTrim;
                        }
                        state = states.STRING;
                        word = char;
                        marker = char;
                        break;
                    }
                    case '/': {
                        if (code[i + 1] === '/') {
                            if ((i - 1 >= 0) && !process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.state = state;
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            state = states.COMMENT;
                            word = char + code[++i];
                            marker = char;
                            break;
                        }
                        if (code[i + 1] === '*') {
                            if ((i - 1 >= 0) && !process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.state = state;
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            state = states.COMMENT;
                            word = char + code[++i];
                            marker = code[i];
                            break;
                        }
                        let tmp = '';
                        for (let j = i - 1; j >= 0; --j) {
                            if (!tmp) {
                                if (/\s/.test(code[j])) {
                                    continue;
                                }
                                if (code[j] === ')' || code[j] === ']') {
                                    break;
                                }
                                if (!isWordCharacter(code[j])) {
                                    if ((i - 1 >= 0) && !process({
                                        'state': state,
                                        'start': i - 1 - word.length + 1,
                                        'end': i - 1,
                                        'word': word,
                                        'pre': {
                                            'state': pre.state,
                                            'word': pre.word,
                                            'nonnull': pre.nonnull,
                                        },
                                        'bracket': bracket,
                                    })) {
                                        return;
                                    }
                                    pre.state = state;
                                    pre.word = word;
                                    const wordTrim = word.trim();
                                    if (wordTrim) {
                                        pre.nonnull = wordTrim;
                                    }
                                    state = states.REG;
                                    word = char;
                                    marker = char;
                                    break;
                                }
                                tmp = code[j];
                                continue;
                            }
                            if (isWordCharacter(code[j])) {
                                tmp = code[j] + tmp;
                                continue;
                            }
                            break;
                        }
                        if (tmp) {
                            if (tmp === 'return') {
                                if ((i - 1 >= 0) && !process({
                                    'state': state,
                                    'start': i - 1 - word.length + 1,
                                    'end': i - 1,
                                    'word': word,
                                    'pre': {
                                        'state': pre.state,
                                        'word': pre.word,
                                        'nonnull': pre.nonnull,
                                    },
                                    'bracket': bracket,
                                })) {
                                    return;
                                }
                                pre.state = state;
                                pre.word = word;
                                const wordTrim = word.trim();
                                if (wordTrim) {
                                    pre.nonnull = wordTrim;
                                }
                                state = states.REG;
                                word = char;
                                marker = char;
                            }
                        }
                        if (state !== states.REG) {
                            word += char;
                        }
                        break;
                    }
                    case '(': {
                        if (word.includes('(') || word.includes(')')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        ++bracket.s;
                        break;
                    }
                    case ')': {
                        if (word.includes('(') || word.includes(')')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        --bracket.s;
                        break;
                    }
                    case '[': {
                        if (word.includes('[') || word.includes(']')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        ++bracket.m;
                        break;
                    }
                    case ']': {
                        if (word.includes('[') || word.includes(']')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        --bracket.m;
                        break;
                    }
                    case '{': {
                        if (word.includes('{') || word.includes('}')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        ++bracket.l;
                        break;
                    }
                    case '}': {
                        if (word.includes('{') || word.includes('}')) {
                            if (!process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            word = '';
                            marker = '';
                        }
                        word += char;
                        --bracket.l;
                        break;
                    }
                    default: {
                        if (isWordCharacter(char)) {
                            if ((i - 1 >= 0) && !process({
                                'state': state,
                                'start': i - 1 - word.length + 1,
                                'end': i - 1,
                                'word': word,
                                'pre': {
                                    'state': pre.state,
                                    'word': pre.word,
                                    'nonnull': pre.nonnull,
                                },
                                'bracket': bracket,
                            })) {
                                return;
                            }
                            pre.state = state;
                            pre.word = word;
                            const wordTrim = word.trim();
                            if (wordTrim) {
                                pre.nonnull = wordTrim;
                            }
                            state = states.WORD;
                            word = char;
                            marker = char;
                            break;
                        }
                        word += char;
                    }
                }
            }
        }
    }
    if (word) {
        const i = code.length - 1;
        process({
            'state': state,
            'start': i - word.length + 1,
            'end': i,
            'word': word,
            'pre': {
                'state': pre.state,
                'word': pre.word,
                'nonnull': pre.nonnull,
            },
            'bracket': bracket,
        });
    }
}
let headElement;
function getHeadElement() {
    if (!headElement) {
        const heads = document.querySelectorAll('head');
        headElement = heads[heads.length - 1];
    }
    return headElement;
}
export async function loadScript(url, ordered = false) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.addEventListener('load', function () {
            resolve(true);
        });
        script.addEventListener('error', function () {
            resolve(false);
        });
        script.async = !ordered;
        script.src = url;
        getHeadElement().appendChild(script);
    });
}
export async function loadScripts(urls, opt = {}) {
    await Promise.all(urls.map(async (url) => {
        const res = await loadScript(url, opt.ordered);
        opt.loaded?.(url, res ? 1 : 0);
    }));
}
export async function loadLink(url, pos = 'after') {
    return new Promise((resolve) => {
        const head = getHeadElement();
        const link = document.createElement('link');
        link.addEventListener('load', function () {
            resolve(true);
        });
        link.addEventListener('error', function () {
            resolve(false);
        });
        link.href = url;
        link.rel = 'stylesheet';
        if (pos === 'before') {
            head.insertBefore(link, head.firstChild);
        }
        else {
            head.appendChild(link);
        }
    });
}
export async function loadLinks(urls, opt = {}) {
    await Promise.all(urls.map(async (url) => {
        const res = await loadLink(url);
        opt.loaded?.(url, res ? 1 : 0);
    }));
}
export async function loadAssets(urls, opt = {}) {
    const scripts = [];
    const links = [];
    for (const url of urls) {
        if (url.split(/[?#]/, 1)[0].toLowerCase().endsWith('.css')) {
            links.push(url);
        }
        else {
            scripts.push(url);
        }
    }
    let loaded = true;
    const onLoaded = (url, state) => {
        if (state === 0) {
            loaded = false;
        }
        opt.loaded?.(url, state);
    };
    await Promise.all([
        loadScripts(scripts, { 'ordered': true, 'loaded': onLoaded }),
        loadLinks(links, { 'loaded': onLoaded }),
    ]);
    return loaded;
}
export function loadStyle(style) {
    const sel = document.createElement('style');
    sel.innerHTML = style;
    getHeadElement().appendChild(sel);
}
export function isFalsy(val) {
    return (val === null) || (val === undefined) || (val === '') || (val === false) || (val === 0);
}
export function isTruthy(val) {
    return !isFalsy(val);
}
export function logicalOr(v1, v2) {
    return (isFalsy(v1) ? v2 : v1);
}
