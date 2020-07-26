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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.blob2Text = exports.blob2ArrayBuffer = exports.blob2DataUrl = exports.changeFormFocus = exports.layoutClassPrepend = exports.layoutInsertAttr = exports.styleUrl2DataUrl = exports.stylePrepend = exports.controlBlob2Pkg = exports.isAppPkg = exports.isControlPkg = exports.parsePath = exports.trim = exports.purify = exports.removeStyle = exports.pushStyle = exports.clearTaskTheme = exports.loadTaskTheme = exports.removeTaskStyle = exports.createTaskStyle = exports.clearGlobalTheme = exports.setGlobalTheme = exports.getDomSize = void 0;
var styleListElement = document.createElement("div");
styleListElement.style.display = "none";
document.getElementsByTagName("body")[0].appendChild(styleListElement);
styleListElement.insertAdjacentHTML("beforeend", "<style id=\"cg-global-cursor\"></style>");
styleListElement.insertAdjacentHTML("beforeend", "<style id=\"cg-global-theme\"></style>");
styleListElement.insertAdjacentHTML("beforeend", "<style class=\"cg-global\">\n.cg-form-list {position: fixed; left: 0; top: 0; z-index: 20020000; width: 0; height: 0; cursor: default;}\n.cg-pop-list {position: fixed; left: 0; top: 0; z-index: 20020001; width: 0; height: 0; cursor: default;}\n.cg-form-list img, .cg-pop-list img {vertical-align: bottom;}\n.cg-form-list ::selection {\n    background-color: rgba(0, 120, 215, .3);\n}\n\n.cg-form-list *, .cg-pop-list * {box-sizing: border-box !important; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}\n.cg-form-list, .cg-form-list input, .cg-form-list textarea, .cg-pop-list, .cg-pop-list input, .cg-pop-list textarea {font-family: 'Microsoft YaHei',Arial,Helvetica,Sans-Serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased; font-weight: 400;}\n\n.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #76b9ed; border-radius: 50%; filter: drop-shadow(0 0 7px #76b9ed); pointer-events: none; opacity: 0;}\n.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border: solid 1px rgba(118, 185, 237, .7); box-shadow: 0 0 10px rgba(0, 0, 0, .3); background: rgba(118, 185, 237, .1); pointer-events: none; opacity: 0;}\n</style>");
function getDomSize(el) {
    var rect = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    var border = {
        "top": parseFloat(cs.borderTopWidth),
        "right": parseFloat(cs.borderRightWidth),
        "bottom": parseFloat(cs.borderBottomWidth),
        "left": parseFloat(cs.borderLeftWidth)
    };
    var padding = {
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
        "clientWidth": rect.width - border.left - border.right,
        "clientHeight": rect.height - border.top - border.bottom,
        "innerWidth": rect.width - border.left - border.right - padding.left - padding.right,
        "innerHeight": rect.height - border.top - border.bottom - padding.top - padding.bottom,
        "scrollWidth": el.scrollWidth,
        "scrollHeight": el.scrollHeight
    };
}
exports.getDomSize = getDomSize;
function requestAnimationFrameCb() {
    for (var i = 0; i < ClickGo._watchSize.length; ++i) {
        var item = ClickGo._watchSize[i];
        var rect = item.el.getBoundingClientRect();
        var cs = getComputedStyle(item.el);
        if (rect.width === 0 && rect.height === 0) {
            if (cs.display === "") {
                ClickGo._watchSize.splice(i, 1);
                --i;
            }
            continue;
        }
        var border = {
            "top": parseFloat(cs.borderTopWidth),
            "right": parseFloat(cs.borderRightWidth),
            "bottom": parseFloat(cs.borderBottomWidth),
            "left": parseFloat(cs.borderLeftWidth)
        };
        var padding = {
            "top": parseFloat(cs.paddingTop),
            "right": parseFloat(cs.paddingRight),
            "bottom": parseFloat(cs.paddingBottom),
            "left": parseFloat(cs.paddingLeft)
        };
        var trect = {
            "top": rect.top,
            "right": rect.right,
            "bottom": rect.bottom,
            "left": rect.left,
            "width": rect.width,
            "height": rect.height,
            "padding": padding,
            "border": border,
            "clientWidth": rect.width - border.left - border.right,
            "clientHeight": rect.height - border.top - border.bottom,
            "innerWidth": rect.width - border.left - border.right - padding.left - padding.right,
            "innerHeight": rect.height - border.top - border.bottom - padding.top - padding.bottom,
            "scrollWidth": item.el.scrollWidth,
            "scrollHeight": item.el.scrollHeight
        };
        if (trect.width !== item.size.width || trect.height !== item.size.height || trect.clientWidth !== item.size.clientWidth || trect.clientHeight !== item.size.clientHeight || trect.innerWidth !== item.size.innerWidth || trect.innerHeight !== item.size.innerHeight) {
            item.cb(trect);
        }
        else if (item.scroll && (item.el.scrollWidth !== item.size.scrollWidth || item.el.scrollHeight !== item.size.scrollHeight)) {
            item.cb(trect);
        }
        item.size = trect;
    }
    requestAnimationFrame(requestAnimationFrameCb);
}
requestAnimationFrame(requestAnimationFrameCb);
function themeBlob2Theme(blob) {
    return __awaiter(this, void 0, void 0, function () {
        var begin, beginUint, _a, files, config, cursor, pathSize, _b, path, contentSize, _c, contentBolb, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    begin = blob.slice(0, 2);
                    _a = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(begin)];
                case 1:
                    beginUint = new (_a.apply(Uint8Array, [void 0, _f.sent()]))();
                    if (beginUint[0] !== 192 || beginUint[1] !== 2) {
                        return [2, false];
                    }
                    files = {};
                    cursor = 2;
                    _f.label = 2;
                case 2:
                    if (!(cursor < blob.size)) return [3, 9];
                    _b = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(blob.slice(cursor, ++cursor))];
                case 3:
                    pathSize = new (_b.apply(Uint8Array, [void 0, _f.sent()]))();
                    return [4, blob2Text(blob.slice(cursor, cursor += pathSize[0]))];
                case 4:
                    path = _f.sent();
                    _c = Uint32Array.bind;
                    return [4, blob2ArrayBuffer(blob.slice(cursor, cursor += 4))];
                case 5:
                    contentSize = new (_c.apply(Uint32Array, [void 0, _f.sent()]))();
                    contentBolb = blob.slice(cursor, cursor += contentSize[0]);
                    if (!(path === "/config.json")) return [3, 7];
                    _e = (_d = JSON).parse;
                    return [4, blob2Text(contentBolb)];
                case 6:
                    config = _e.apply(_d, [_f.sent()]);
                    return [3, 8];
                case 7:
                    files[path] = contentBolb;
                    _f.label = 8;
                case 8: return [3, 2];
                case 9:
                    if (!config) {
                        return [2, false];
                    }
                    return [2, {
                            "type": "theme",
                            "config": config,
                            "files": files
                        }];
            }
        });
    });
}
var globalThemeStyle = document.getElementById("cg-global-theme");
function setGlobalTheme(file) {
    return __awaiter(this, void 0, void 0, function () {
        var theme, styleBlob, style;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, themeBlob2Theme(file)];
                case 1:
                    theme = _a.sent();
                    if (!theme) {
                        return [2];
                    }
                    styleBlob = theme.files[theme.config.style + ".css"];
                    if (!styleBlob) {
                        return [2];
                    }
                    return [4, blob2Text(styleBlob)];
                case 2:
                    style = _a.sent();
                    style = stylePrepend(style, "cg-theme-gloabl-").style;
                    return [4, styleUrl2DataUrl(theme.config.style, style, theme.files)];
                case 3:
                    style = _a.sent();
                    globalThemeStyle.innerHTML = style;
                    return [2];
            }
        });
    });
}
exports.setGlobalTheme = setGlobalTheme;
function clearGlobalTheme() {
    globalThemeStyle.innerHTML = "";
}
exports.clearGlobalTheme = clearGlobalTheme;
function createTaskStyle(taskId) {
    styleListElement.insertAdjacentHTML("beforeend", "<div id=\"cg-style-task" + taskId + "\"><div class=\"cg-style-controls\"></div><div class=\"cg-style-themes\"></div><style class=\"cg-style-global\"></style><div class=\"cg-style-forms\"></div></div>");
}
exports.createTaskStyle = createTaskStyle;
function removeTaskStyle(taskId) {
    var _a;
    (_a = document.getElementById("cg-style-task" + taskId)) === null || _a === void 0 ? void 0 : _a.remove();
}
exports.removeTaskStyle = removeTaskStyle;
function loadTaskTheme(file, taskId) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var blob, theme, styleBlob, style;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!ClickGo.taskList[taskId]) {
                        return [2];
                    }
                    if (typeof file === "string") {
                        blob = ClickGo.taskList[taskId].appPkg.files[file];
                        if (!blob) {
                            return [2];
                        }
                        file = blob;
                    }
                    return [4, themeBlob2Theme(file)];
                case 1:
                    theme = _b.sent();
                    if (!theme) {
                        return [2];
                    }
                    styleBlob = theme.files[theme.config.style + ".css"];
                    if (!styleBlob) {
                        return [2];
                    }
                    return [4, blob2Text(styleBlob)];
                case 2:
                    style = _b.sent();
                    style = stylePrepend(style, "cg-theme-task" + taskId + "-").style;
                    return [4, styleUrl2DataUrl(theme.config.style, style, theme.files)];
                case 3:
                    style = _b.sent();
                    (_a = document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes")) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforeend", "<style>" + style + "</style>");
                    return [2];
            }
        });
    });
}
exports.loadTaskTheme = loadTaskTheme;
function clearTaskTheme(taskId) {
    var el = document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes");
    if (!el) {
        return;
    }
    el.innerHTML = "";
}
exports.clearTaskTheme = clearTaskTheme;
function pushStyle(style, taskId, type, formId) {
    if (type === void 0) { type = "global"; }
    if (formId === void 0) { formId = 0; }
    var el = document.querySelector("#cg-style-task" + taskId + " > .cg-style-" + type);
    if (!el) {
        return;
    }
    if (type === "global") {
        el.innerHTML = style;
    }
    else {
        el.insertAdjacentHTML("beforeend", "<style class=\"cg-style-form" + formId + "\">" + style + "</style>");
    }
}
exports.pushStyle = pushStyle;
function removeStyle(taskId, formId) {
    if (formId === void 0) { formId = 0; }
    var styleTask = document.getElementById("cg-style-task" + taskId);
    if (!styleTask) {
        return;
    }
    if (formId === 0) {
        styleTask.remove();
    }
    else {
        var elist = styleTask.querySelectorAll(".cg-style-form" + formId);
        for (var i = 0; i < elist.length; ++i) {
            elist.item(i).remove();
        }
    }
}
exports.removeStyle = removeStyle;
function purify(text) {
    text = ">" + text + "<";
    text = text.replace(/>([\s\S]*?)</g, function (t, t1) {
        return ">" + t1.replace(/\t|\r\n| {2}/g, "").replace(/\n|\r/g, "") + "<";
    });
    return text.slice(1, -1);
}
exports.purify = purify;
function trim(text) {
    return text.replace(/^\s+|\s+$/, "");
}
exports.trim = trim;
function parsePath(path) {
    if (path.slice(0, 2) === "//") {
        path = ClickGo.rootPath.slice(0, ClickGo.rootPath.indexOf("//")) + path;
    }
    else if (path[0] === "/") {
        path = ClickGo.rootPath.replace(/^(http.+?\/\/.+?)\/.*$/, function (t, t1) {
            return t1 + path;
        });
    }
    else if (!/^(.+?):\/\//.test(path)) {
        if (path.slice(0, 8) === "clickgo/") {
            path = ClickGo.cgRootPath + path.slice(8);
        }
        else {
            path = ClickGo.rootPath + path;
        }
    }
    return path;
}
exports.parsePath = parsePath;
function isControlPkg(o) {
    if (typeof o !== "object") {
        return false;
    }
    for (var k in o) {
        return o[k].type === "control" ? true : false;
    }
    return false;
}
exports.isControlPkg = isControlPkg;
function isAppPkg(o) {
    if (typeof o !== "object") {
        return false;
    }
    for (var k in o) {
        return o[k].type === "control" ? true : false;
    }
    return false;
}
exports.isAppPkg = isAppPkg;
function controlBlob2Pkg(blob) {
    return __awaiter(this, void 0, void 0, function () {
        var begin, beginUint, _a, controlPkg, cursor, nameSize, _b, name_1, bodySize, _c, bodyBlob, files, config, bodyCursor, pathSize, _d, path, mimeSize, _e, mime, contentSize, _f, contentBolb, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    begin = blob.slice(0, 2);
                    _a = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(begin)];
                case 1:
                    beginUint = new (_a.apply(Uint8Array, [void 0, _j.sent()]))();
                    if (beginUint[0] !== 192 || beginUint[1] !== 1) {
                        return [2, false];
                    }
                    controlPkg = {};
                    cursor = 2;
                    _j.label = 2;
                case 2:
                    if (!(cursor < blob.size)) return [3, 16];
                    _b = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(blob.slice(cursor, ++cursor))];
                case 3:
                    nameSize = new (_b.apply(Uint8Array, [void 0, _j.sent()]))();
                    return [4, blob2Text(blob.slice(cursor, cursor += nameSize[0]))];
                case 4:
                    name_1 = _j.sent();
                    _c = Uint32Array.bind;
                    return [4, blob2ArrayBuffer(blob.slice(cursor, cursor += 4))];
                case 5:
                    bodySize = new (_c.apply(Uint32Array, [void 0, _j.sent()]))();
                    bodyBlob = blob.slice(cursor, cursor += bodySize[0]);
                    files = {};
                    config = void 0;
                    bodyCursor = 0;
                    _j.label = 6;
                case 6:
                    if (!(bodyCursor < bodyBlob.size)) return [3, 15];
                    _d = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor))];
                case 7:
                    pathSize = new (_d.apply(Uint8Array, [void 0, _j.sent()]))();
                    return [4, blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += pathSize[0]))];
                case 8:
                    path = _j.sent();
                    _e = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor))];
                case 9:
                    mimeSize = new (_e.apply(Uint8Array, [void 0, _j.sent()]))();
                    return [4, blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += mimeSize[0]))];
                case 10:
                    mime = _j.sent();
                    _f = Uint32Array.bind;
                    return [4, blob2ArrayBuffer(bodyBlob.slice(bodyCursor, bodyCursor += 4))];
                case 11:
                    contentSize = new (_f.apply(Uint32Array, [void 0, _j.sent()]))();
                    contentBolb = bodyBlob.slice(bodyCursor, bodyCursor += contentSize[0], mime);
                    if (!(path === "/config.json")) return [3, 13];
                    _h = (_g = JSON).parse;
                    return [4, blob2Text(contentBolb)];
                case 12:
                    config = _h.apply(_g, [_j.sent()]);
                    return [3, 14];
                case 13:
                    files[path] = contentBolb;
                    _j.label = 14;
                case 14: return [3, 6];
                case 15:
                    if (!config) {
                        return [2, false];
                    }
                    controlPkg[name_1] = {
                        "type": "control",
                        "config": config,
                        "files": files
                    };
                    return [3, 2];
                case 16: return [2, controlPkg];
            }
        });
    });
}
exports.controlBlob2Pkg = controlBlob2Pkg;
function stylePrepend(style, rand) {
    if (rand === void 0) { rand = ""; }
    if (rand === "") {
        rand = "cg-scope" + Math.round(Math.random() * 1000000000000000) + "_";
    }
    style = style.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, t1, t2) {
        return t1.replace(/\.([a-zA-Z0-9-_]+)/g, function (t, t1) {
            if (t1.slice(0, 3) === "cg-") {
                return t;
            }
            return "." + rand + t1;
        }) + "{" + t2 + "}";
    });
    var fontList = [];
    style = style.replace(/(@font-face[\s\S]+?font-family\s*:\s*['"]{0,1})(.+?)(['"]{0,1}\s*[;\r\n }])/gi, function (t, t1, t2, t3) {
        fontList.push(t2);
        return t1 + rand + t2 + t3;
    });
    for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
        var font = fontList_1[_i];
        var reg = new RegExp("(font.+?[: '\"])(" + font + ")", "gi");
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    var keyframeList = [];
    style = style.replace(/([-@]keyframes *['"]{0,1})([\w-]+)(['"]{0,1}\s*?\{)/gi, function (t, t1, t2, t3) {
        if (keyframeList.indexOf(t2) === -1) {
            keyframeList.push(t2);
        }
        return t1 + rand + t2 + t3;
    });
    for (var _a = 0, keyframeList_1 = keyframeList; _a < keyframeList_1.length; _a++) {
        var keyframe = keyframeList_1[_a];
        var reg = new RegExp("(animation.+?)(" + keyframe + ")", "gi");
        style = style.replace(reg, function (t, t1, t2) {
            return t1 + rand + t2;
        });
    }
    return {
        "rand": rand,
        "style": style
    };
}
exports.stylePrepend = stylePrepend;
function styleUrl2DataUrl(dirname, style, files) {
    return __awaiter(this, void 0, void 0, function () {
        var reg, match, rtn, path, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (dirname.slice(-1) !== "/") {
                        dirname = dirname.slice(0, dirname.lastIndexOf("/") + 1);
                    }
                    reg = /url\(['"]{0,1}(.+?)['"]{0,1}\)/ig;
                    match = null;
                    rtn = style;
                    _e.label = 1;
                case 1:
                    if (!(match = reg.exec(style))) return [3, 3];
                    path = match[1];
                    if (path[0] !== "/") {
                        path = dirname + path;
                    }
                    path = path.replace(/\/\.\//g, "/");
                    while (/\/(?!\.\.)[^/]+\/\.\.\//.test(path)) {
                        path = path.replace(/\/(?!\.\.)[^/]+\/\.\.\//g, "/");
                    }
                    if (!files[path]) {
                        return [3, 1];
                    }
                    _b = (_a = rtn).replace;
                    _c = [match[0]];
                    _d = "url('";
                    return [4, blob2DataUrl(files[path])];
                case 2:
                    rtn = _b.apply(_a, _c.concat([_d + (_e.sent()) + "')"]));
                    return [3, 1];
                case 3: return [2, rtn];
            }
        });
    });
}
exports.styleUrl2DataUrl = styleUrl2DataUrl;
function layoutInsertAttr(layout, insert, opt) {
    if (opt === void 0) { opt = {}; }
    return layout.replace(/<([\w-]+)[\s\S]*?>/g, function (t, t1) {
        if (opt.ignore && opt.ignore.indexOf(t1) !== -1) {
            return t;
        }
        if (opt.include && opt.include.indexOf(t1) === -1) {
            return t;
        }
        return t.replace(/<[\w-]+/, function (t) {
            return t + " " + insert;
        });
    });
}
exports.layoutInsertAttr = layoutInsertAttr;
function layoutClassPrepend(layout, rand) {
    if (rand === void 0) { rand = []; }
    if (rand.length === 0) {
        rand.push("cg-scope" + Math.round(Math.random() * 1000000000000000) + "_");
    }
    return {
        "rand": rand,
        "layout": layout.replace(/ class=["'](.+?)["']/gi, function (t, t1) {
            var clist = t1.split(" ");
            var rtn = [];
            for (var _i = 0, clist_1 = clist; _i < clist_1.length; _i++) {
                var item = clist_1[_i];
                for (var _a = 0, rand_1 = rand; _a < rand_1.length; _a++) {
                    var r = rand_1[_a];
                    rtn.push(r + item);
                }
            }
            return " class=\"" + rtn.join(" ") + "\"";
        }).replace(/ :class=(['"]).+?>/gi, function (t, sp) {
            return t.replace(new RegExp(" :class=" + sp + "(.+?)" + sp, "gi"), function (t, t1) {
                t1 = trim(t1);
                if (t1[0] === "[") {
                    t1 = t1.slice(1, -1);
                    var t1a = t1.split(",");
                    for (var i = 0; i < t1a.length; ++i) {
                        t1a[i] = trim(t1a[i]);
                        if (t1a[i][0] === "{") {
                            t1a[i] = layoutClassPrependObject(t1a[i]);
                        }
                        else {
                            t1a[i] = "_classPrepend(" + t1a[i] + ")";
                        }
                    }
                    t1 = "[" + t1a.join(",") + "]";
                }
                else {
                    t1 = layoutClassPrependObject(t1);
                }
                return " :class=\"" + t1 + "\"";
            });
        })
    };
}
exports.layoutClassPrepend = layoutClassPrepend;
function layoutClassPrependObject(os) {
    os = trim(os.slice(1, -1));
    return "{" + os.replace(/(.+?):(.+?)(,|$)/g, function (t, t1, t2, t3) {
        t1 = trim(t1);
        if (t1[0] === "[") {
            t1 = "[_classPrepend(" + t1.slice(1, -1) + ")]";
        }
        else {
            var sp = "";
            if (t1[0] === "'" || t1[0] === "\"") {
                sp = t1[0];
                t1 = t1.slice(1, -1);
            }
            t1 = "[_classPrepend(" + sp + t1 + sp + ")]";
        }
        return t1 + ":" + t2 + t3;
    }) + "}";
}
function changeFormFocus(formId, vm) {
    var _a, _b;
    if (formId === void 0) { formId = 0; }
    var focusElement = document.querySelector(".cg-form-list > .cg-focus");
    if (focusElement) {
        var dataFormId = focusElement.getAttribute("data-form-id");
        if (dataFormId) {
            var dataFormIdNumber = parseInt(dataFormId);
            if (dataFormIdNumber === formId) {
                return;
            }
            else {
                var taskId = parseInt((_a = focusElement.getAttribute("data-task-id")) !== null && _a !== void 0 ? _a : "0");
                var task = ClickGo.taskList[taskId];
                task.formList[dataFormIdNumber].vue.focus = false;
                ClickGo.trigger("formBlurred", taskId, dataFormIdNumber);
            }
        }
        else {
            return;
        }
    }
    if (formId !== 0) {
        var el = document.querySelector(".cg-form-list > [data-form-id='" + formId + "']");
        if (el) {
            var taskId = void 0;
            if (vm) {
                if (!vm.$data._customZIndex) {
                    if (vm.$data._topMost) {
                        vm.$children[0].setPropData("zIndex", ++ClickGo.topZIndex);
                    }
                    else {
                        vm.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
                    }
                }
                vm.focus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt((_b = el.getAttribute("data-task-id")) !== null && _b !== void 0 ? _b : "0");
                var task = ClickGo.taskList[taskId];
                if (!task.formList[formId].vue.$data._customZIndex) {
                    if (task.formList[formId].vue.$data._topMost) {
                        task.formList[formId].vue.$children[0].setPropData("zIndex", ++ClickGo.topZIndex);
                    }
                    else {
                        task.formList[formId].vue.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
                    }
                }
                task.formList[formId].vue.focus = true;
            }
            ClickGo.trigger("formFocused", taskId, formId);
        }
    }
}
exports.changeFormFocus = changeFormFocus;
function blob2DataUrl(blob) {
    return new Promise(function (resove) {
        var fr = new FileReader();
        fr.addEventListener("load", function (e) {
            if (e.target) {
                resove(e.target.result);
            }
            else {
                resove("");
            }
        });
        fr.readAsDataURL(blob);
    });
}
exports.blob2DataUrl = blob2DataUrl;
function blob2ArrayBuffer(blob) {
    return new Promise(function (resove) {
        var fr = new FileReader();
        fr.addEventListener("load", function () {
            resove(fr.result);
        });
        fr.readAsArrayBuffer(blob);
    });
}
exports.blob2ArrayBuffer = blob2ArrayBuffer;
function blob2Text(blob) {
    return new Promise(function (resove) {
        var fr = new FileReader();
        fr.addEventListener("load", function (e) {
            if (e.target) {
                resove(e.target.result);
            }
            else {
                resove("");
            }
        });
        fr.readAsText(blob);
    });
}
exports.blob2Text = blob2Text;
function clone(obj) {
    var newObj = {};
    if (obj instanceof Array) {
        newObj = [];
        for (var i = 0; i < obj.length; ++i) {
            newObj[i] = typeof obj[i] === "object" ? clone(obj[i]) : obj[i];
        }
    }
    else {
        for (var key in obj) {
            newObj[key] = typeof obj[key] === "object" ? clone(obj[key]) : obj[key];
        }
    }
    return newObj;
}
exports.clone = clone;
