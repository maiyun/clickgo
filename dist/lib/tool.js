"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RANDOM_LUNS = exports.RANDOM_V = exports.RANDOM_LUN = exports.RANDOM_LU = exports.RANDOM_LN = exports.RANDOM_UN = exports.RANDOM_L = exports.RANDOM_U = exports.RANDOM_N = void 0;
exports.compressor = compressor;
exports.getClassPrototype = getClassPrototype;
exports.blob2ArrayBuffer = blob2ArrayBuffer;
exports.sizeFormat = sizeFormat;
exports.weightFormat = weightFormat;
exports.clone = clone;
exports.sleep = sleep;
exports.nextFrame = nextFrame;
exports.sleepFrame = sleepFrame;
exports.purify = purify;
exports.match = match;
exports.styleUrl2DataUrl = styleUrl2DataUrl;
exports.layoutAddTagClassAndReTagName = layoutAddTagClassAndReTagName;
exports.layoutInsertAttr = layoutInsertAttr;
exports.layoutClassPrepend = layoutClassPrepend;
exports.eventsAttrWrap = eventsAttrWrap;
exports.teleportGlue = teleportGlue;
exports.stylePrepend = stylePrepend;
exports.getMimeByPath = getMimeByPath;
exports.rand = rand;
exports.random = random;
exports.getBoolean = getBoolean;
exports.getNumber = getNumber;
exports.getArray = getArray;
exports.escapeHTML = escapeHTML;
exports.formatColor = formatColor;
exports.rgb2hex = rgb2hex;
exports.hex2rgb = hex2rgb;
exports.rgb2hsl = rgb2hsl;
exports.hsl2rgb = hsl2rgb;
exports.request = request;
exports.fetch = fetch;
exports.get = get;
exports.post = post;
exports.getResponseJson = getResponseJson;
exports.postResponseJson = postResponseJson;
exports.parseUrl = parseUrl;
exports.urlResolve = urlResolve;
exports.urlAtom = urlAtom;
exports.blob2Text = blob2Text;
exports.blob2DataUrl = blob2DataUrl;
exports.execCommand = execCommand;
exports.compar = compar;
exports.formatSecond = formatSecond;
exports.formatTime = formatTime;
exports.isMs = isMs;
exports.queryStringify = queryStringify;
exports.queryParse = queryParse;
const core = __importStar(require("./core"));
let compressorjs = null;
function compressor(file_1) {
    return __awaiter(this, arguments, void 0, function* (file, options = {}) {
        if (!compressorjs) {
            try {
                compressorjs = yield core.getModule('compressorjs');
            }
            catch (_a) {
                return false;
            }
        }
        return new Promise((resolve) => {
            new compressorjs(file, {
                'quality': options.quality,
                'maxWidth': options.maxWidth,
                'maxHeight': options.maxHeight,
                success: (result) => {
                    resolve(result);
                },
                error: () => {
                    resolve(false);
                }
            });
        });
    });
}
function getClassPrototype(obj, over = [], level = 0) {
    var _a;
    if (level === 0) {
        return getClassPrototype(Object.getPrototypeOf(obj), over, level + 1);
    }
    const rtn = {
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
            rtn.method[item] = des.value;
        }
        else if ((_a = des.get) !== null && _a !== void 0 ? _a : des.set) {
            if (!rtn.access[item]) {
                rtn.access[item] = {};
            }
            if (des.get) {
                rtn.access[item].get = des.get;
            }
            if (des.set) {
                rtn.access[item].set = des.set;
            }
        }
    }
    const rtn2 = getClassPrototype(Object.getPrototypeOf(obj), over, level + 1);
    Object.assign(rtn.method, rtn2.method);
    Object.assign(rtn.access, rtn2.access);
    return rtn;
}
function blob2ArrayBuffer(blob) {
    return new Promise(function (resove) {
        const fr = new FileReader();
        fr.addEventListener('load', function () {
            resove(fr.result);
        });
        fr.readAsArrayBuffer(blob);
    });
}
function sizeFormat(size, spliter = ' ') {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i = 0;
    for (; i < 6 && size >= 1024.0; ++i) {
        size /= 1024.0;
    }
    return (Math.round(size * 100) / 100).toString() + spliter + units[i];
}
function weightFormat(weight, spliter = ' ') {
    const units = ['mg', 'g', 'kg'];
    let i = 0;
    for (; i < 3 && weight >= 1000; ++i) {
        weight /= 1000;
    }
    return (Math.round(weight * 100) / 100).toString() + spliter + units[i];
}
function clone(obj) {
    let newObj = {};
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
function sleep(ms = 0) {
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
function nextFrame() {
    return new Promise(function (resolve) {
        requestAnimationFrame(() => {
            resolve();
        });
    });
}
function sleepFrame(count) {
    return __awaiter(this, void 0, void 0, function* () {
        if (count > 10) {
            count = 10;
        }
        for (let i = 0; i < count; ++i) {
            yield nextFrame();
        }
    });
}
function purify(text) {
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
function match(str, regs) {
    for (const reg of regs) {
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}
function styleUrl2DataUrl(path, style, files) {
    return __awaiter(this, void 0, void 0, function* () {
        const reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
        let match = null;
        while ((match = reg.exec(style))) {
            let realPath = urlResolve(path, match[1]);
            if (realPath.startsWith('/package/')) {
                realPath = realPath.slice(8);
            }
            if (!files[realPath]) {
                continue;
            }
            if (typeof files[realPath] !== 'string') {
                style = style.replace(match[0], `url('${yield blob2DataUrl(files[realPath])}')`);
            }
        }
        return style;
    });
}
function layoutAddTagClassAndReTagName(layout, retagname) {
    const list = [];
    layout = layout.replace(/(\S+)=(".+?"|'.+?')/g, function (t, t1) {
        if (t1 === 'class') {
            return t;
        }
        list.push(t);
        return '"CG-PLACEHOLDER"';
    });
    layout = layout.replace(/<(\/{0,1})([\w-]+)([\s\S]*?>)/g, function (t, t1, t2, t3) {
        if (['template', 'slot', 'teleport'].includes(t2)) {
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
            if (t3.toLowerCase().includes(' class')) {
                t3 = t3.replace(/ class=(["']{0,1})/i, ' class=$1tag-' + t2 + ' ');
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
function layoutInsertAttr(layout, insert, opt = {}) {
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
    return '{' + object.replace(/([ a-zA-Z0-9'"`[\]\-_]+)(\s*:)/g, function (t, t1, t2) {
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
function layoutClassPrepend(layout, preps) {
    return layout.replace(/ class=["'](.+?)["']/gi, function (t, t1) {
        t1 = t1.trim();
        const classList = t1.split(' ');
        const resultList = [];
        for (const item of classList) {
            for (const prep of preps) {
                resultList.push(prep + item);
            }
        }
        return ` class="${resultList.join(' ')}"`;
    }).replace(/ :class=(["']).+?["']((\s+[a-zA-Z0-9-_:@]+(=|\s*>))|(\s*)>)/gi, function (t, sp) {
        return t.replace(new RegExp(` :class=${sp}(.+?)${sp}((\\s+[a-zA-Z0-9-_:@]+(=|\\s*>))|(\\s*)>)`, 'gi'), function (t, t1, t2) {
            t1 = t1.trim();
            if (t1.startsWith('[')) {
                t1 = t1.slice(1, -1);
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
function eventsAttrWrap(layout) {
    const events = ['click', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mouseup', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keypress', 'keyup', 'contextmenu'];
    const reg = new RegExp(`@(${events.join('|')})="(.+?)"`, 'g');
    return layout.replace(reg, function (t, t1, t2) {
        if (/^[\w]+$/.test(t2)) {
            return `@${t1}="allowEvent($event) && ${t2}($event)"`;
        }
        return `@${t1}=";if(allowEvent($event)){${t2}}"`;
    });
}
function teleportGlue(layout, formId) {
    if (typeof formId !== 'string') {
        formId = formId.toString();
    }
    const fid = formId;
    return layout.replace(/<teleport([\s\S]+?)to="(.+?)"([\s\S]+?<[\w-]+)/g, (v, v1, v2, v3) => {
        if (v2 !== 'system') {
            return v;
        }
        return '<teleport' + v1 + 'to="#cg-pop-list > [data-form-id=\'' + fid + '\']"' + v3 + ' data-cg-pop data-cg-pop-none';
    });
}
function stylePrepend(style, prep = '') {
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
function getMimeByPath(path) {
    var _a;
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
    const mime = (_a = exts[ext]) !== null && _a !== void 0 ? _a : 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
}
function rand(min, max) {
    if (min > max) {
        [min, max] = [max, min];
    }
    return min + Math.round(Math.random() * (max - min));
}
exports.RANDOM_N = '0123456789';
exports.RANDOM_U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
exports.RANDOM_L = 'abcdefghijklmnopqrstuvwxyz';
exports.RANDOM_UN = exports.RANDOM_U + exports.RANDOM_N;
exports.RANDOM_LN = exports.RANDOM_L + exports.RANDOM_N;
exports.RANDOM_LU = exports.RANDOM_L + exports.RANDOM_U;
exports.RANDOM_LUN = exports.RANDOM_L + exports.RANDOM_U + exports.RANDOM_N;
exports.RANDOM_V = 'ACEFGHJKLMNPRSTWXY34567';
exports.RANDOM_LUNS = exports.RANDOM_LUN + '()`~!@#$%^&*-+=_|{}[]:;\'<>,.?/]"';
function random(length = 8, source = exports.RANDOM_LN, block = '') {
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
function getBoolean(param) {
    const t = typeof param;
    if (t === 'boolean') {
        return param;
    }
    if (t === 'string') {
        return param === 'false' ? false : true;
    }
    return param ? true : false;
}
function getNumber(param) {
    if (typeof param === 'number') {
        return param;
    }
    return parseFloat(param);
}
function getArray(param) {
    if (typeof param !== 'string') {
        return param;
    }
    param = param.trim();
    let rtn = [];
    if (param.startsWith('[')) {
        try {
            rtn = JSON.parse(param);
        }
        catch (_a) {
            return [];
        }
    }
    else {
        param = param.replace(/ /g, '');
        rtn = param.split(',');
    }
    return rtn;
}
function escapeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function formatColor(color) {
    const matc = /[0-9.%, ]+/.exec(color);
    if (!matc) {
        return [];
    }
    const arr = matc[0].split(',');
    return arr.map((v) => {
        return parseFloat(v);
    });
}
function rgb2hex(r, g, b, a = 1) {
    var _a;
    if (g === undefined || b === undefined) {
        if (typeof r !== 'string') {
            return '';
        }
        const rgb = formatColor(r);
        r = Math.round(rgb[0]);
        g = Math.round(rgb[1]);
        b = Math.round(rgb[2]);
        a = (_a = rgb[3]) !== null && _a !== void 0 ? _a : 1;
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
function hex2rgb(hex) {
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
function rgb2hsl(r, g, b, a = 1, decimal = false) {
    var _a;
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
        a = (_a = rgb[3]) !== null && _a !== void 0 ? _a : 1;
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
function hsl2rgb(h, s, l, a = 1, decimal = false) {
    var _a;
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
        a = (_a = hsl[3]) !== null && _a !== void 0 ? _a : 1;
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
function request(url, opt) {
    return new Promise(function (resove) {
        var _a;
        const xhr = new XMLHttpRequest();
        if (opt.credentials === false) {
            xhr.withCredentials = false;
        }
        xhr.upload.onloadstart = function (e) {
            var _a;
            const r = (_a = opt.uploadStart) === null || _a === void 0 ? void 0 : _a.call(opt, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function (e1) {
                    console.log(e1);
                });
            }
        };
        xhr.upload.onprogress = function (e) {
            var _a;
            const r = (_a = opt.uploadProgress) === null || _a === void 0 ? void 0 : _a.call(opt, e.loaded, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function (e1) {
                    console.log(e1);
                });
            }
        };
        xhr.upload.onloadend = function () {
            var _a;
            const r = (_a = opt.uploadEnd) === null || _a === void 0 ? void 0 : _a.call(opt);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
        };
        xhr.onloadstart = function (e) {
            var _a;
            const r = (_a = opt.start) === null || _a === void 0 ? void 0 : _a.call(opt, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function (e1) {
                    console.log(e1);
                });
            }
        };
        xhr.onprogress = function (e) {
            var _a;
            const r = (_a = opt.progress) === null || _a === void 0 ? void 0 : _a.call(opt, e.loaded, e.total);
            if (r && (r instanceof Promise)) {
                r.catch(function (e1) {
                    console.log(e1);
                });
            }
        };
        xhr.onloadend = function () {
            var _a;
            const r = (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
        };
        xhr.onload = function () {
            var _a, _b;
            let res = this.response;
            if ((_a = this.getResponseHeader('content-type')) === null || _a === void 0 ? void 0 : _a.includes('json')) {
                try {
                    res = JSON.parse(res);
                }
                catch (_c) {
                    res = this.response;
                }
            }
            const r = (_b = opt.load) === null || _b === void 0 ? void 0 : _b.call(opt, res);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
            resove(res);
        };
        xhr.onerror = function () {
            var _a;
            const r = (_a = opt.error) === null || _a === void 0 ? void 0 : _a.call(opt);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
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
        if (opt.headers && !Array.isArray(opt.headers)) {
            for (const k in opt.headers) {
                xhr.setRequestHeader(k, opt.headers[k]);
            }
        }
        xhr.open((_a = opt.method) !== null && _a !== void 0 ? _a : 'GET', url, true);
        xhr.send(opt.body);
    });
}
function fetch(url, init) {
    return loader.fetch(url, init);
}
function get(url, opt) {
    return loader.get(url, opt);
}
function post(url, data, opt) {
    return loader.post(url, data, opt);
}
function getResponseJson(url, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        return loader.getResponseJson(url, opt);
    });
}
function postResponseJson(url, data, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        return loader.postResponseJson(url, data, opt);
    });
}
function parseUrl(url) {
    return loader.parseUrl(url);
}
function urlResolve(from, to) {
    return loader.urlResolve(from, to);
}
function urlAtom(url) {
    return loader.urlAtom(url);
}
function blob2Text(blob) {
    return loader.blob2Text(blob);
}
function blob2DataUrl(blob) {
    return loader.blob2DataUrl(blob);
}
function execCommand(ac) {
    if (!['copy', 'cut'].includes(ac)) {
        return;
    }
    document.execCommand(ac);
}
function compar(before, after) {
    const rtn = {
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
function formatSecond(second) {
    const h = Math.floor(second / 3600);
    second = second - h * 3600;
    const m = Math.floor(second / 60);
    const s = Math.floor(second - m * 60);
    return (h ? h.toString().padStart(2, '0') + ':' : '') + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
}
function formatTime(ts, tz) {
    const rtn = {
        'date': '',
        'time': '',
        'zone': ''
    };
    if (typeof ts === 'number') {
        ts = new Date(ts);
    }
    const ntz = tz !== null && tz !== void 0 ? tz : -(ts.getTimezoneOffset() / 60);
    ts.setTime(ts.getTime() + ntz * 60 * 60000);
    rtn.date = ts.getUTCFullYear().toString() + '-' + (ts.getUTCMonth() + 1).toString().padStart(2, '0') + '-' + ts.getUTCDate().toString().padStart(2, '0');
    rtn.time = ts.getUTCHours().toString().padStart(2, '0') + ':' + ts.getUTCMinutes().toString().padStart(2, '0') + ':' + ts.getUTCSeconds().toString().padStart(2, '0');
    rtn.zone = 'UTC' + (ntz >= 0 ? '+' : '') + ntz.toString();
    return rtn;
}
function isMs(time) {
    return time > 1000000000000 ? true : false;
}
function queryStringify(query) {
    return Object.entries(query).map(([k, v]) => {
        if (Array.isArray(v)) {
            return v.map((i) => `${encodeURIComponent(k)}=${encodeURIComponent(`${i}`)}`).join('&');
        }
        return `${encodeURIComponent(k)}=${encodeURIComponent(`${v}`)}`;
    }).join('&');
}
function queryParse(query) {
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
