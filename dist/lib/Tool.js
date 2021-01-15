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
exports.rand = exports.getObjectURLList = exports.revokeObjectURL = exports.createObjectURL = exports.getMimeByPath = exports.stylePrepend = exports.layoutClassPrepend = exports.layoutInsertAttr = exports.styleUrl2ObjectOrDataUrl = exports.urlResolve = exports.parseUrl = exports.isAppPkg = exports.isControlPkg = exports.purify = exports.requestAnimationFrame = exports.sleep = exports.clone = exports.blob2Text = exports.blob2ArrayBuffer = exports.blob2DataUrl = void 0;
function blob2DataUrl(blob) {
    return new Promise(function (resove) {
        let fr = new FileReader();
        fr.addEventListener('load', function (e) {
            if (e.target) {
                resove(e.target.result);
            }
            else {
                resove('');
            }
        });
        fr.readAsDataURL(blob);
    });
}
exports.blob2DataUrl = blob2DataUrl;
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
function blob2Text(blob) {
    return new Promise(function (resove) {
        let fr = new FileReader();
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
exports.blob2Text = blob2Text;
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
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
exports.sleep = sleep;
function requestAnimationFrame() {
    return new Promise(function (resolve) {
        window.requestAnimationFrame(function () {
            resolve();
        });
    });
}
exports.requestAnimationFrame = requestAnimationFrame;
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
exports.purify = purify;
function isControlPkg(o) {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}
exports.isControlPkg = isControlPkg;
function isAppPkg(o) {
    if (typeof o !== 'object') {
        return false;
    }
    for (let k in o) {
        return o[k].type === 'control' ? true : false;
    }
    return false;
}
exports.isAppPkg = isAppPkg;
function parseUrl(url) {
    let u = {
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
    let protocol = /^(.+?)\/\//.exec(url);
    if (protocol) {
        u.protocol = protocol[1].toLowerCase();
        url = url.slice(protocol[0].length);
    }
    let hostSp = url.indexOf('/');
    let left = url;
    if (hostSp !== -1) {
        left = url.slice(0, hostSp);
        url = url.slice(hostSp);
    }
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
        let hostArray = host.split(':');
        u.hostname = hostArray[0].toLowerCase();
        if (hostArray[1]) {
            u.port = hostArray[1];
        }
        u.host = u.hostname + (u.port ? ':' + u.port : '');
    }
    if (hostSp === -1) {
        return u;
    }
    let paqArray = url.split('?');
    u.pathname = paqArray[0];
    if (paqArray[1]) {
        let qahArray = paqArray[1].split('#');
        u.query = qahArray[0];
        if (qahArray[1]) {
            u.hash = qahArray[1];
        }
    }
    u.path = u.pathname + (u.query ? '?' + u.query : '');
    return u;
}
exports.parseUrl = parseUrl;
function urlResolve(from, to) {
    from = from.replace(/\\/g, '/');
    to = to.replace(/\\/g, '/');
    if (to === '') {
        return from;
    }
    let f = parseUrl(from);
    if (to.startsWith('//')) {
        return f.protocol ? f.protocol + to : to;
    }
    if (f.protocol) {
        from = f.protocol + from.slice(f.protocol.length);
    }
    let t = parseUrl(to);
    if (t.protocol) {
        return t.protocol + to.slice(t.protocol.length);
    }
    if (to.startsWith('#') || to.startsWith('?')) {
        let sp = from.indexOf(to[0]);
        if (sp !== -1) {
            return from.slice(0, sp) + to;
        }
        else {
            return from + to;
        }
    }
    let abs = (f.auth ? f.auth + '@' : '') + (f.host ? f.host : '');
    if (to.startsWith('/')) {
        abs += to;
    }
    else {
        let path = f.pathname.replace(/\/[^/]*$/g, '');
        abs += path + '/' + to;
    }
    abs = abs.replace(/\/\.\//g, '/');
    while (true) {
        let count = 0;
        abs = abs.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, function () {
            ++count;
            return '/';
        });
        if (count === 0) {
            break;
        }
    }
    abs = abs.replace(/\.\.\//g, '');
    if (f.protocol && !f.host) {
        return f.protocol + abs;
    }
    else {
        return (f.protocol ? f.protocol + '//' : '') + abs;
    }
}
exports.urlResolve = urlResolve;
function styleUrl2ObjectOrDataUrl(path, style, obj, mode = 'object') {
    return __awaiter(this, void 0, void 0, function* () {
        let reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
        let match = null;
        let rtn = style;
        while ((match = reg.exec(style))) {
            let realPath = urlResolve(path, match[1]);
            if (!obj.files[realPath]) {
                continue;
            }
            if (mode === 'data') {
                rtn = rtn.replace(match[0], `url('${yield blob2DataUrl(obj.files[realPath])}')`);
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
    });
}
exports.styleUrl2ObjectOrDataUrl = styleUrl2ObjectOrDataUrl;
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
function layoutClassPrependObject(os) {
    os = os.slice(1, -1).trim();
    return '{' + os.replace(/(.+?):(.+?)(,|$)/g, function (t, t1, t2, t3) {
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
function layoutClassPrepend(layout, rand = []) {
    if (rand.length === 0) {
        rand.push('cg-scope' + Math.round(Math.random() * 1000000000000000) + '_');
    }
    return {
        'rand': rand,
        'layout': layout.replace(/ class=["'](.+?)["']/gi, function (t, t1) {
            let clist = t1.split(' ');
            let rtn = [];
            for (let item of clist) {
                for (let r of rand) {
                    rtn.push(r + item);
                }
            }
            return ` class='${rtn.join(' ')}'`;
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
        })
    };
}
exports.layoutClassPrepend = layoutClassPrepend;
function stylePrepend(style, rand = '') {
    if (rand === '') {
        rand = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, t1, t2) {
        return t1.replace(/\.([a-zA-Z0-9-_]+)/g, function (t, t1) {
            if (t1.startsWith('cg-')) {
                return t;
            }
            return '.' + rand + t1;
        }) + '{' + t2 + '}';
    });
    let fontList = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*["']{0,1})(.+?)(["']{0,1}\s*[;\r\n }])/gi, function (t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + rand + t2 + t3;
    });
    for (let font of fontList) {
        let reg = new RegExp(`(font.+?[: "'])(${font})`, 'gi');
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    let keyframeList = [];
    style = style.replace(/([-@]keyframes *["']{0,1})([\w-]+)(["']{0,1}\s*?\{)/gi, function (t, t1, t2, t3) {
        if (!keyframeList.includes(t2)) {
            keyframeList.push(t2);
        }
        return t1 + rand + t2 + t3;
    });
    for (let keyframe of keyframeList) {
        let reg = new RegExp(`(animation.+?)(${keyframe})`, 'gi');
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    return {
        'rand': rand,
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
