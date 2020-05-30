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
var styleListElement = document.createElement("div");
styleListElement.style.display = "none";
document.getElementsByTagName("body")[0].appendChild(styleListElement);
styleListElement.insertAdjacentHTML("beforeend", "<style id=\"cg-global-cursor\"></style>");
styleListElement.insertAdjacentHTML("beforeend", "<style id=\"cg-global-theme\"></style>");
styleListElement.insertAdjacentHTML("beforeend", "<style class=\"cg-global\">\n.cg-form-list {position: fixed; left: 0; top: 0; z-index: 20020000; width: 0; height: 0;}\n\n.cg-form-wrap {cursor: default;}\n.cg-form-wrap, .cg-form-wrap * {box-sizing: border-box !important; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);}\n.cg-form-wrap, .cg-form-wrap input, .cg-form-wrap textarea {font-family: -apple-system,BlinkMacSystemFont,opensans,Optima,\"Microsoft Yahei\",sans-serif; font-size: 12px; line-height: 1;}\n\n.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020002; border: solid 3px #76b9ed; border-radius: 50%; filter: drop-shadow(0 0 7px #76b9ed); pointer-events: none; opacity: 0;}\n.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020001; border: solid 1px rgba(118, 185, 237, .7); box-shadow: 0 0 10px rgba(0, 0, 0, .3); background: rgba(118, 185, 237, .1); pointer-events: none; opacity: 0;}\n</style>");
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
}
exports.setGlobalTheme = setGlobalTheme;
function loadTaskTheme(style, taskId) {
    styleListElement.insertAdjacentHTML("beforeend", "<style class=\"cg-task" + taskId + " cg-theme\">" + style + "</style>");
}
exports.loadTaskTheme = loadTaskTheme;
function clearTaskTheme(taskId) {
    for (var i = 0; i < styleListElement.children.length; ++i) {
        var styleElement = styleListElement.children.item(i);
        if (styleElement.className.indexOf("cg-task" + taskId) === -1) {
            return;
        }
        styleListElement.removeChild(styleElement);
    }
}
exports.clearTaskTheme = clearTaskTheme;
function pushStyle(style, taskId, formId) {
    if (formId === void 0) { formId = 0; }
    styleListElement.insertAdjacentHTML("beforeend", "<style class=\"cg-task" + taskId + (formId > 0 ? " cg-form" + formId : "") + "\">" + style + "</style>");
}
exports.pushStyle = pushStyle;
function removeStyle(taskId, formId) {
    if (formId === void 0) { formId = 0; }
    var s;
    if (formId > 0) {
        s = document.getElementsByClassName("cg-form" + formId);
    }
    else {
        s = document.getElementsByClassName("cg-task" + taskId);
    }
    while (true) {
        var e = s.item(0);
        if (!e) {
            break;
        }
        styleListElement.removeChild(e);
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
        var begin, beginUint, _a, controlPkg, cursor, nameSize, _b, name_1, bodySize, _c, bodyBlob, files, config, bodyCursor, pathSize, _d, path, contentSize, _e, contentBolb, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    begin = blob.slice(0, 2);
                    _a = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(begin)];
                case 1:
                    beginUint = new (_a.apply(Uint8Array, [void 0, _h.sent()]))();
                    if (beginUint[0] !== 192 || beginUint[1] !== 1) {
                        return [2, false];
                    }
                    controlPkg = {};
                    cursor = 2;
                    _h.label = 2;
                case 2:
                    if (!(cursor < blob.size)) return [3, 14];
                    _b = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(blob.slice(cursor, ++cursor))];
                case 3:
                    nameSize = new (_b.apply(Uint8Array, [void 0, _h.sent()]))();
                    return [4, blob2Text(blob.slice(cursor, cursor += nameSize[0]))];
                case 4:
                    name_1 = _h.sent();
                    _c = Uint32Array.bind;
                    return [4, blob2ArrayBuffer(blob.slice(cursor, cursor += 4))];
                case 5:
                    bodySize = new (_c.apply(Uint32Array, [void 0, _h.sent()]))();
                    bodyBlob = blob.slice(cursor, cursor += bodySize[0]);
                    files = {};
                    config = void 0;
                    bodyCursor = 0;
                    _h.label = 6;
                case 6:
                    if (!(bodyCursor < bodyBlob.size)) return [3, 13];
                    _d = Uint8Array.bind;
                    return [4, blob2ArrayBuffer(bodyBlob.slice(bodyCursor, ++bodyCursor))];
                case 7:
                    pathSize = new (_d.apply(Uint8Array, [void 0, _h.sent()]))();
                    return [4, blob2Text(bodyBlob.slice(bodyCursor, bodyCursor += pathSize[0]))];
                case 8:
                    path = _h.sent();
                    _e = Uint32Array.bind;
                    return [4, blob2ArrayBuffer(bodyBlob.slice(bodyCursor, bodyCursor += 4))];
                case 9:
                    contentSize = new (_e.apply(Uint32Array, [void 0, _h.sent()]))();
                    contentBolb = bodyBlob.slice(bodyCursor, bodyCursor += contentSize[0]);
                    if (!(path === "/config.json")) return [3, 11];
                    _g = (_f = JSON).parse;
                    return [4, blob2Text(contentBolb)];
                case 10:
                    config = _g.apply(_f, [_h.sent()]);
                    return [3, 12];
                case 11:
                    files[path] = contentBolb;
                    _h.label = 12;
                case 12: return [3, 6];
                case 13:
                    if (!config) {
                        return [2, false];
                    }
                    controlPkg[name_1] = {
                        "type": "control",
                        "config": config,
                        "files": files
                    };
                    return [3, 2];
                case 14: return [2, controlPkg];
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
            if (t1 === "cg-focus" || t1 === "cg-state-max" || t1 === "cg-state-min") {
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
    style = style.replace(/[-@]keyframes *['"]{0,1}([\w-]+)['"]{0,1}.*?\{/gi, function (t, t1, t2, t3) {
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
        })
    };
}
exports.layoutClassPrepend = layoutClassPrepend;
function changeFormFocus(formId, vm) {
    if (formId === void 0) { formId = 0; }
    var _a, _b;
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
                focusElement.classList.remove("cg-focus");
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
            el.classList.add("cg-focus");
            var taskId = void 0;
            if (vm) {
                if (!vm.customZIndex) {
                    vm.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
                }
                vm.focus = true;
                taskId = vm.taskId;
            }
            else {
                taskId = parseInt((_b = el.getAttribute("data-task-id")) !== null && _b !== void 0 ? _b : "0");
                var task = ClickGo.taskList[taskId];
                if (!task.formList[formId].vue.customZIndex) {
                    task.formList[formId].vue.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
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
