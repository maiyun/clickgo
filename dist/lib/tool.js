"use strict";
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
exports.execCommand = exports.blob2DataUrl = exports.blob2Text = exports.urlResolve = exports.parseUrl = exports.request = exports.replace = exports.includes = exports.escapeHTML = exports.getBoolean = exports.rand = exports.getObjectURLList = exports.revokeObjectURL = exports.createObjectURL = exports.getMimeByPath = exports.stylePrepend = exports.layoutClassPrepend = exports.layoutInsertAttr = exports.layoutAddTagClassAndReTagName = exports.styleUrl2ObjectOrDataUrl = exports.purify = exports.sleep = exports.clone = exports.blob2ArrayBuffer = exports.file2ObjectUrl = void 0;
function file2ObjectUrl(file, obj) {
    let ourl = obj.objectURLs[file];
    if (!ourl) {
        if (!obj.files[file]) {
            return null;
        }
        if (typeof obj.files[file] === 'string') {
            return null;
        }
        ourl = createObjectURL(obj.files[file]);
        obj.objectURLs[file] = ourl;
    }
    return ourl;
}
exports.file2ObjectUrl = file2ObjectUrl;
function blob2ArrayBuffer(blob) {
    return new Promise(function (resove) {
        let fr = new FileReader();
        fr.addEventListener('load', function () {
            resove(fr.result);
        });
        fr.readAsArrayBuffer(blob);
    });
}
exports.blob2ArrayBuffer = blob2ArrayBuffer;
function clone(obj) {
    let newObj = {};
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
exports.clone = clone;
function sleep(ms = 0) {
    if (ms > 600000) {
        ms = 600000;
    }
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
exports.sleep = sleep;
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
exports.purify = purify;
function styleUrl2ObjectOrDataUrl(path, style, obj, mode = 'object') {
    return __awaiter(this, void 0, void 0, function* () {
        let reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
        let match = null;
        while ((match = reg.exec(style))) {
            let realPath = urlResolve(path, match[1]);
            if (!obj.files[realPath]) {
                continue;
            }
            if (mode === 'data') {
                if (typeof obj.files[realPath] !== 'string') {
                    style = style.replace(match[0], `url('${yield blob2DataUrl(obj.files[realPath])}')`);
                }
            }
            else {
                style = style.replace(match[0], `url('${file2ObjectUrl(realPath, obj)}')`);
            }
        }
        return style;
    });
}
exports.styleUrl2ObjectOrDataUrl = styleUrl2ObjectOrDataUrl;
function layoutAddTagClassAndReTagName(layout, retagname) {
    let list = [];
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
                return retagname ? ('<' + t1 + 'cg-' + t2 + t3) : t;
            }
            if (t3.toLowerCase().includes(' class')) {
                t3 = t3.replace(/ class=(["']{0,1})/i, ' class=$1tag-' + t2 + ' ');
            }
            else {
                t2 = t2 + ` class="tag-${t2}"`;
            }
            return retagname ? ('<cg-' + t2 + t3) : ('<' + t2 + t3);
        }
    });
    let i = -1;
    return layout.replace(/"CG-PLACEHOLDER"/g, function () {
        return list[++i];
    });
}
exports.layoutAddTagClassAndReTagName = layoutAddTagClassAndReTagName;
function layoutInsertAttr(layout, insert, opt = {}) {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function (t, t1) {
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
        return t.replace(/<[\w-]+/, function (t) {
            return t + ' ' + insert;
        });
    });
}
exports.layoutInsertAttr = layoutInsertAttr;
function layoutClassPrependObject(object) {
    object = object.slice(1, -1).trim();
    return '{' + object.replace(/(.+?):(.+?)(,|$)/g, function (t, t1, t2, t3) {
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
function layoutClassPrepend(layout, preps) {
    return layout.replace(/ class=["'](.+?)["']/gi, function (t, t1) {
        t1 = t1.trim();
        let classList = t1.split(' ');
        let resultList = [];
        for (let item of classList) {
            for (let prep of preps) {
                resultList.push(prep + item);
            }
        }
        return ` class='${resultList.join(' ')}'`;
    }).replace(/ :class=(["']).+?>/gi, function (t, sp) {
        return t.replace(new RegExp(` :class=${sp}(.+?)${sp}`, 'gi'), function (t, t1) {
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
    });
}
exports.layoutClassPrepend = layoutClassPrepend;
function stylePrepend(style, prep = '') {
    if (prep === '') {
        prep = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, t1, t2) {
        t1 = t1.replace(/(^|[ >,\r\n])([a-zA-Z-_])([a-zA-Z0-9-_]*)/g, function (t, t1, t2, t3) {
            return t1 + '.tag-' + t2 + t3;
        });
        t1 = t1.replace(/keyframes \.tag-([a-zA-Z0-9-_]+)/g, function (t, t1) {
            return 'keyframes ' + t1;
        });
        return t1.replace(/([.#])([a-zA-Z0-9-_]+)/g, function (t, t1, t2) {
            if (t2.startsWith('cg-')) {
                return t;
            }
            return t1 + prep + t2;
        }) + '{' + t2 + '}';
    });
    let fontList = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function (t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + prep + t2 + t3;
    });
    for (let font of fontList) {
        let reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + prep + t2;
        });
    }
    let keyframeList = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function (t, t1, t2, t3) {
        if (!keyframeList.includes(t2)) {
            keyframeList.push(t2);
        }
        return t1 + prep + t2 + t3;
    });
    for (let keyframe of keyframeList) {
        let reg = new RegExp(`(animation[ :\\r\\n]+)(${keyframe})([ ;}\\r\\n])`, 'gi');
        style = style.replace(reg, function (t, t1, t2, t3) {
            return t1 + prep + t2 + t3;
        });
    }
    return {
        'prep': prep,
        'style': style
    };
}
exports.stylePrepend = stylePrepend;
function getMimeByPath(path) {
    var _a;
    let lio = path.lastIndexOf('.');
    let ext = (lio === -1 ? path : path.slice(lio + 1)).toLowerCase();
    let exts = {
        'eot': 'application/vnd.ms-fontobject',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'svg': 'image/svg+xml',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'png': 'image/png'
    };
    let mime = (_a = exts[ext]) !== null && _a !== void 0 ? _a : 'application/octet-stream';
    return {
        'mime': mime,
        'ext': ext
    };
}
exports.getMimeByPath = getMimeByPath;
let objectURLList = [];
function createObjectURL(object) {
    let url = URL.createObjectURL(object);
    objectURLList.push(url);
    return url;
}
exports.createObjectURL = createObjectURL;
function revokeObjectURL(url) {
    URL.revokeObjectURL(url);
}
exports.revokeObjectURL = revokeObjectURL;
function getObjectURLList() {
    return objectURLList;
}
exports.getObjectURLList = getObjectURLList;
function rand(min, max) {
    if (min > max) {
        [min, max] = [max, min];
    }
    return min + Math.round(Math.random() * (max - min));
}
exports.rand = rand;
function getBoolean(param) {
    let t = typeof param;
    if (t === 'boolean') {
        return param;
    }
    else if (t === 'string') {
        return param === 'false' ? false : true;
    }
    else {
        return param ? true : false;
    }
}
exports.getBoolean = getBoolean;
function escapeHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
exports.escapeHTML = escapeHTML;
function includes(str, search) {
    for (let item of search) {
        if (!str.includes(item)) {
            return false;
        }
    }
    return true;
}
exports.includes = includes;
function replace(text, search, replace) {
    let result = text.replace(search, replace);
    while (result !== text) {
        text = result;
        result = text.replace(search, replace);
    }
    return result;
}
exports.replace = replace;
function request(url, opt) {
    return new Promise(function (resove) {
        var _a;
        let xhr = new XMLHttpRequest();
        xhr.upload.onloadstart = function (e) {
            var _a;
            (_a = opt.uploadStart) === null || _a === void 0 ? void 0 : _a.call(opt, e.total);
        };
        xhr.upload.onprogress = function (e) {
            var _a;
            (_a = opt.uploadProgress) === null || _a === void 0 ? void 0 : _a.call(opt, e.loaded, e.total);
        };
        xhr.upload.onloadend = function () {
            var _a;
            (_a = opt.uploadEnd) === null || _a === void 0 ? void 0 : _a.call(opt);
        };
        xhr.onloadstart = function (e) {
            var _a;
            (_a = opt.start) === null || _a === void 0 ? void 0 : _a.call(opt, e.total);
        };
        xhr.onprogress = function (e) {
            var _a;
            (_a = opt.progress) === null || _a === void 0 ? void 0 : _a.call(opt, e.loaded, e.total);
        };
        xhr.onloadend = function () {
            var _a;
            (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt);
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
            (_b = opt.load) === null || _b === void 0 ? void 0 : _b.call(opt, res);
            resove(res);
        };
        xhr.onerror = function () {
            var _a;
            (_a = opt.error) === null || _a === void 0 ? void 0 : _a.call(opt);
            resove(null);
        };
        if (opt.responseType) {
            xhr.responseType = opt.responseType;
        }
        if (opt.timeout) {
            xhr.timeout = opt.timeout;
        }
        xhr.open((_a = opt.method) !== null && _a !== void 0 ? _a : 'GET', url, true);
        xhr.send(opt.body);
    });
}
exports.request = request;
function parseUrl(url) {
    return loader.parseUrl(url);
}
exports.parseUrl = parseUrl;
function urlResolve(from, to) {
    return loader.urlResolve(from, to);
}
exports.urlResolve = urlResolve;
function blob2Text(blob) {
    return loader.blob2Text(blob);
}
exports.blob2Text = blob2Text;
function blob2DataUrl(blob) {
    return loader.blob2DataUrl(blob);
}
exports.blob2DataUrl = blob2DataUrl;
function execCommand(ac) {
    if (!['copy', 'cut'].includes(ac)) {
        return;
    }
    document.execCommand(ac);
}
exports.execCommand = execCommand;
