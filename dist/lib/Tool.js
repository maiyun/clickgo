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
exports.layoutClassPrepend = exports.layoutInsertAttr = exports.styleUrl2DataUrl = exports.pathResolve = exports.stylePrepend = exports.controlBlob2Pkg = exports.isAppPkg = exports.isControlPkg = exports.parsePath = exports.trim = exports.purify = exports.removeStyle = exports.pushStyle = exports.removeTaskStyleElement = exports.createTaskStyleElement = exports.sleep = exports.clone = exports.blob2Text = exports.blob2ArrayBuffer = exports.blob2DataUrl = void 0;
let styleListElement = document.createElement('div');
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
.cg-form-list, .cg-form-list input, .cg-form-list textarea, .cg-pop-list, .cg-pop-list input, .cg-pop-list textarea {font-family: Roboto,-apple-system,BlinkMacSystemFont,"Helvetica Neue","Segoe UI","Oxygen","Ubuntu","Cantarell","Open Sans",sans-serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased;}

.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #76b9ed; border-radius: 50%; filter: drop-shadow(0 0 7px #76b9ed); pointer-events: none; opacity: 0;}
.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border: solid 1px rgba(118, 185, 237, .7); box-shadow: 0 0 10px rgba(0, 0, 0, .3); background: rgba(118, 185, 237, .1); pointer-events: none; opacity: 0;}
</style>`);
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
function createTaskStyleElement(taskId) {
    styleListElement.insertAdjacentHTML('beforeend', `<div id='cg-style-task${taskId}'><div class='cg-style-controls'></div><div class='cg-style-themes'></div><style class='cg-style-global'></style><div class='cg-style-forms'></div></div>`);
}
exports.createTaskStyleElement = createTaskStyleElement;
function removeTaskStyleElement(taskId) {
    var _a;
    (_a = document.getElementById('cg-style-task' + taskId)) === null || _a === void 0 ? void 0 : _a.remove();
}
exports.removeTaskStyleElement = removeTaskStyleElement;
function pushStyle(style, taskId, type = 'global', formId = 0) {
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
exports.pushStyle = pushStyle;
function removeStyle(taskId, formId = 0) {
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
exports.removeStyle = removeStyle;
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
exports.purify = purify;
function trim(text) {
    return text.replace(/^\s+|\s+$/, '');
}
exports.trim = trim;
function parsePath(path) {
    if (path.slice(0, 2) === '//') {
        path = clickgo.rootPath.slice(0, clickgo.rootPath.indexOf('//')) + path;
    }
    else if (path[0] === '/') {
        path = clickgo.rootPath.replace(/^(http.+?\/\/.+?)\/.*$/, function (t, t1) {
            return t1 + path;
        });
    }
    else if (!/^(.+?):\/\//.test(path)) {
        if (path.slice(0, 8) === 'clickgo/') {
            path = clickgo.cgRootPath + path.slice(8);
        }
        else {
            path = clickgo.rootPath + path;
        }
    }
    return path;
}
exports.parsePath = parsePath;
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
function controlBlob2Pkg(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        let dataView = new DataView(yield blob2ArrayBuffer(blob));
        if (dataView.getUint8(0) !== 192 || dataView.getUint8(1) !== 1) {
            return false;
        }
        let controlPkg = {};
        let cursor = 2;
        while (cursor < blob.size) {
            let nameSize = new Uint8Array(yield blob2ArrayBuffer(blob.slice(cursor, ++cursor)));
            let name = yield blob2Text(blob.slice(cursor, cursor += nameSize[0]));
            let bodySize = new Uint32Array(yield blob2ArrayBuffer(blob.slice(cursor, cursor += 4)));
            let bodyBlob = blob.slice(cursor, cursor += bodySize[0]);
            let files = {};
            let config;
            let bodyCursor = 0;
            while (bodyCursor < bodyBlob.size) {
                let pathSize = new Uint8Array(yield blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor)));
                let path = yield blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += pathSize[0]));
                let mimeSize = new Uint8Array(yield blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor)));
                let mime = yield blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += mimeSize[0]));
                let contentSize = new Uint32Array(yield blob2ArrayBuffer(bodyBlob.slice(bodyCursor, bodyCursor += 4)));
                let contentBolb = bodyBlob.slice(bodyCursor, bodyCursor += contentSize[0], mime);
                if (path === '/config.json') {
                    config = JSON.parse(yield blob2Text(contentBolb));
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
    });
}
exports.controlBlob2Pkg = controlBlob2Pkg;
function stylePrepend(style, rand = '') {
    if (rand === '') {
        rand = 'cg-scope' + Math.round(Math.random() * 1000000000000000) + '_';
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, t1, t2) {
        return t1.replace(/\.([a-zA-Z0-9-_]+)/g, function (t, t1) {
            if (t1.slice(0, 3) === 'cg-') {
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
        if (keyframeList.indexOf(t2) === -1) {
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
function pathResolve(dir, path) {
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
exports.pathResolve = pathResolve;
function styleUrl2DataUrl(dir, style, files) {
    return __awaiter(this, void 0, void 0, function* () {
        let reg = /url\(["']{0,1}(.+?)["']{0,1}\)/ig;
        let match = null;
        let rtn = style;
        while ((match = reg.exec(style))) {
            let path = pathResolve(dir, match[1]);
            if (!files[path]) {
                continue;
            }
            rtn = rtn.replace(match[0], `url('${yield blob2DataUrl(files[path])}')`);
        }
        return rtn;
    });
}
exports.styleUrl2DataUrl = styleUrl2DataUrl;
function layoutInsertAttr(layout, insert, opt = {}) {
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function (t, t1) {
        if (opt.ignore && opt.ignore.indexOf(t1) !== -1) {
            return t;
        }
        if (opt.include && opt.include.indexOf(t1) === -1) {
            return t;
        }
        return t.replace(/<[\w-]+/, function (t) {
            return t + ' ' + insert;
        });
    });
}
exports.layoutInsertAttr = layoutInsertAttr;
function layoutClassPrependObject(os) {
    os = trim(os.slice(1, -1));
    return '{' + os.replace(/(.+?):(.+?)(,|$)/g, function (t, t1, t2, t3) {
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
exports.layoutClassPrepend = layoutClassPrepend;
