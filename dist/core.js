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
var Tool = require("./lib/Tool");
var formListElement = document.createElement("div");
if (window.devicePixelRatio < 2) {
    ClickGo.zoom = 1 / window.devicePixelRatio;
    ClickGo.rzoom = 1 / ClickGo.zoom;
    formListElement.style.zoom = ClickGo.zoom.toString();
}
formListElement.classList.add("cg-form-list");
document.getElementsByTagName("body")[0].appendChild(formListElement);
var popListElement = document.createElement("div");
popListElement.style.zoom = ClickGo.zoom.toString();
popListElement.classList.add("cg-pop-list");
document.getElementsByTagName("body")[0].appendChild(popListElement);
window.addEventListener("resize", function () {
    return __awaiter(this, void 0, void 0, function () {
        var i, el, taskId, formId, $vm;
        return __generator(this, function (_a) {
            for (i = 0; i < formListElement.children.length; ++i) {
                el = formListElement.children.item(i);
                if (el.className.indexOf("cg-state-max") === -1) {
                    continue;
                }
                taskId = parseInt(el.getAttribute("data-task-id"));
                formId = parseInt(el.getAttribute("data-form-id"));
                if (!ClickGo.taskList[taskId]) {
                    continue;
                }
                $vm = ClickGo.taskList[taskId].formList[formId].vue;
                $vm.$children[0].setPropData("width", ClickGo.getWidth() * ClickGo.rzoom);
                $vm.$children[0].setPropData("height", ClickGo.getHeight() * ClickGo.rzoom);
            }
            trigger("screenResize");
            return [2];
        });
    });
});
var lostFocusEvent = function (e) {
    var target = e.target;
    if (!target) {
        return;
    }
    var element = target.parentElement;
    while (element) {
        if (element.classList.contains("cg-form-list")) {
            hidePop();
            return;
        }
        if (element.classList.contains("cg-pop-list") || element.classList.contains("cg-pop-open")) {
            return;
        }
        element = element.parentElement;
    }
    hidePop();
    Tool.changeFormFocus();
};
if ("ontouchstart" in document.documentElement) {
    window.addEventListener("touchstart", lostFocusEvent);
}
else {
    window.addEventListener("mousedown", lostFocusEvent);
}
var circularElement = document.createElement("div");
circularElement.style.zoom = ClickGo.zoom.toString();
circularElement.classList.add("cg-circular");
document.getElementsByTagName("body")[0].appendChild(circularElement);
function showCircular(x, y) {
    circularElement.style.transition = "none";
    circularElement.style.width = "6px";
    circularElement.style.height = "6px";
    circularElement.style.left = x - 3 + "px";
    circularElement.style.top = y - 3 + "px";
    circularElement.style.opacity = "1";
    setTimeout(function () {
        circularElement.style.transition = "all .3s ease-out";
        circularElement.style.width = "60px";
        circularElement.style.height = "60px";
        circularElement.style.left = x - 30 + "px";
        circularElement.style.top = y - 30 + "px";
        circularElement.style.opacity = "0";
    }, 10);
}
exports.showCircular = showCircular;
var rectangleElement = document.createElement("div");
rectangleElement.style.zoom = ClickGo.zoom.toString();
rectangleElement.setAttribute("data-pos", "");
rectangleElement.classList.add("cg-rectangle");
document.getElementsByTagName("body")[0].appendChild(rectangleElement);
function showRectangle(x, y, pos) {
    rectangleElement.style.transition = "none";
    rectangleElement.style.width = "20px";
    rectangleElement.style.height = "20px";
    rectangleElement.style.left = x - 10 + "px";
    rectangleElement.style.top = y - 10 + "px";
    rectangleElement.style.opacity = "1";
    rectangleElement.setAttribute("data-ready", "0");
    rectangleElement.setAttribute("data-dir", "");
    setTimeout(function () {
        rectangleElement.style.transition = "all .2s ease-out";
        rectangleElement.setAttribute("data-ready", "1");
        moveRectangle(pos);
    }, 10);
}
exports.showRectangle = showRectangle;
function moveRectangle(dir) {
    var _a, _b, _c, _d;
    var dataReady = (_a = rectangleElement.getAttribute("data-ready")) !== null && _a !== void 0 ? _a : "0";
    if (dataReady === "0") {
        return;
    }
    var dataDir = (_b = rectangleElement.getAttribute("data-dir")) !== null && _b !== void 0 ? _b : "";
    var setDataDir = typeof dir === "string" ? dir : "o-" + dir.left + "-" + ((_c = dir.top) !== null && _c !== void 0 ? _c : "n") + "-" + dir.width + "-" + ((_d = dir.height) !== null && _d !== void 0 ? _d : "n");
    if (dataDir === setDataDir) {
        return;
    }
    rectangleElement.setAttribute("data-dir", setDataDir);
    var pos = getPositionByBorderDir(dir);
    var width = pos.width - 20;
    var height = pos.height - 20;
    var left = pos.left + 10;
    var top = pos.top + 10;
    if (width !== undefined && height !== undefined && left !== undefined && top !== undefined) {
        rectangleElement.style.width = width + "px";
        rectangleElement.style.height = height + "px";
        rectangleElement.style.left = left + "px";
        rectangleElement.style.top = top + "px";
    }
}
exports.moveRectangle = moveRectangle;
function hideRectangle() {
    rectangleElement.style.opacity = "0";
}
exports.hideRectangle = hideRectangle;
function getPositionByBorderDir(dir) {
    var _a, _b;
    var width, height, left, top;
    if (typeof dir === "string") {
        switch (dir) {
            case "lt": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
            case "t": {
                width = ClickGo.getWidth();
                height = ClickGo.getHeight();
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
            case "tr": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop();
                break;
            }
            case "r": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight();
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop();
                break;
            }
            case "rb": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft() + ClickGo.getWidth() / 2;
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "b": {
                width = ClickGo.getWidth();
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "bl": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight() / 2;
                left = ClickGo.getLeft();
                top = ClickGo.getTop() + ClickGo.getHeight() / 2;
                break;
            }
            case "l": {
                width = ClickGo.getWidth() / 2;
                height = ClickGo.getHeight();
                left = ClickGo.getLeft();
                top = ClickGo.getTop();
                break;
            }
        }
    }
    else {
        width = dir.width;
        height = (_a = dir.height) !== null && _a !== void 0 ? _a : ClickGo.getHeight();
        left = dir.left;
        top = (_b = dir.top) !== null && _b !== void 0 ? _b : ClickGo.getTop();
    }
    return {
        "width": width,
        "height": height,
        "left": left,
        "top": top
    };
}
exports.getPositionByBorderDir = getPositionByBorderDir;
function appendToPop(el) {
    popListElement.appendChild(el);
}
exports.appendToPop = appendToPop;
function removeFromPop(el) {
    popListElement.removeChild(el);
}
exports.removeFromPop = removeFromPop;
function showPop(pop, x, y) {
    if (y === void 0) { y = 0; }
    if (pop.$parent.$data._controlName !== "menu-pop-item") {
        ClickGo._pop = pop;
    }
    pop.$parent.popOpen = true;
    pop.open = true;
    var left, top;
    if (x instanceof HTMLElement) {
        var bcr_1 = x.getBoundingClientRect();
        if (y === 0) {
            left = bcr_1.left;
            top = bcr_1.top + bcr_1.height;
        }
        else {
            left = bcr_1.left + bcr_1.width - 2;
            top = bcr_1.top - 2;
        }
        setTimeout(function () {
            if (pop.$el.offsetWidth + left > ClickGo.getWidth()) {
                if (y === 0) {
                    pop.$el.style.left = ClickGo.getWidth() - pop.$el.offsetWidth + "px";
                }
                else {
                    pop.$el.style.left = bcr_1.left - pop.$el.offsetWidth + 2 + "px";
                }
            }
            pop.$el.style.visibility = "";
        });
    }
    else {
        left = x;
        top = y;
        setTimeout(function () {
            if (pop.$el.offsetWidth + left > ClickGo.getWidth()) {
                pop.$el.style.left = x - pop.$el.offsetWidth + "px";
            }
            pop.$el.style.visibility = "";
        });
    }
    pop.$el.style.left = left + "px";
    pop.$el.style.top = top + "px";
    pop.$el.style.visibility = "hidden";
    pop.$el.style.zIndex = (++ClickGo.popZIndex).toString();
}
exports.showPop = showPop;
function hidePop(pop) {
    if (pop === void 0) { pop = null; }
    if (!pop) {
        pop = ClickGo._pop;
        if (!pop) {
            return;
        }
        ClickGo._pop = null;
    }
    pop.$parent.popOpen = false;
    pop.open = false;
    pop.onHide && pop.onHide();
}
exports.hidePop = hidePop;
function siblings(e, cn) {
    if (!e.parentElement) {
        return null;
    }
    for (var i = 0; i < e.parentElement.children.length; ++i) {
        var el = e.parentElement.children.item(i);
        if (el === e) {
            continue;
        }
        if (el.classList.contains(cn)) {
            return el;
        }
    }
    return null;
}
exports.siblings = siblings;
function setTheme(file) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, Tool.setGlobalTheme(file)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.setTheme = setTheme;
function clearTheme() {
    Tool.clearGlobalTheme();
}
exports.clearTheme = clearTheme;
var clickgoFiles = {};
function trigger(name, taskId, formId, opt) {
    if (taskId === void 0) { taskId = 0; }
    if (formId === void 0) { formId = 0; }
    if (opt === void 0) { opt = {}; }
    switch (name) {
        case "screenResize": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"]();
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]();
                    }
                }
            }
            break;
        }
        case "formCreated":
        case "formRemoved": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.title, opt.icon);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.title, opt.icon);
                    }
                }
            }
            break;
        }
        case "formTitleChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.title);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.title);
                    }
                }
            }
            break;
        }
        case "formIconChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.icon);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.icon);
                    }
                }
            }
            break;
        }
        case "formStateMinChanged":
        case "formStateMaxChanged": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId, opt.state);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId, opt.state);
                    }
                }
            }
            break;
        }
        case "formFocused":
        case "formBlurred":
        case "formFlash": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId, formId);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId, formId);
                    }
                }
            }
            break;
        }
        case "taskStarted":
        case "taskEnded": {
            if (ClickGo[name + "Handler"]) {
                ClickGo[name + "Handler"](taskId);
            }
            for (var tTaskId in ClickGo.taskList) {
                for (var tFormId in ClickGo.taskList[tTaskId].formList) {
                    if (ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name]) {
                        ClickGo.taskList[tTaskId].formList[tFormId].vue.eventList[name](taskId);
                    }
                }
            }
            break;
        }
    }
}
exports.trigger = trigger;
function fetchClickGoFile(path) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (path.slice(0, 9) !== "/clickgo/") {
                        return [2, null];
                    }
                    path = path.slice(8);
                    if (clickgoFiles[path]) {
                        return [2, clickgoFiles[path]];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    _a = clickgoFiles;
                    _b = path;
                    return [4, fetch(ClickGo.cgRootPath + path.slice(1) + "?" + Math.random())];
                case 2: return [4, (_d.sent()).blob()];
                case 3:
                    _a[_b] = _d.sent();
                    return [2, clickgoFiles[path]];
                case 4:
                    _c = _d.sent();
                    return [2, null];
                case 5: return [2];
            }
        });
    });
}
exports.fetchClickGoFile = fetchClickGoFile;
function fetchApp(path) {
    return __awaiter(this, void 0, void 0, function () {
        var realPath, config, files, _i, _a, file, blob, resp, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (path.slice(-1) !== "/") {
                        return [2, null];
                    }
                    realPath = Tool.parsePath(path);
                    files = {};
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 11, , 12]);
                    return [4, fetch(realPath + "config.json?" + Math.random())];
                case 2: return [4, (_e.sent()).json()];
                case 3:
                    config = _e.sent();
                    _i = 0, _a = config.files;
                    _e.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3, 10];
                    file = _a[_i];
                    if (!(file.slice(0, 9) === "/clickgo/")) return [3, 6];
                    return [4, fetchClickGoFile(file)];
                case 5:
                    blob = _e.sent();
                    if (!blob) {
                        return [2, null];
                    }
                    files[file] = blob;
                    return [3, 9];
                case 6: return [4, fetch(realPath + file.slice(1) + "?" + Math.random())];
                case 7:
                    resp = _e.sent();
                    _b = files;
                    _c = file;
                    return [4, resp.blob()];
                case 8:
                    _b[_c] = _e.sent();
                    _e.label = 9;
                case 9:
                    _i++;
                    return [3, 4];
                case 10: return [3, 12];
                case 11:
                    _d = _e.sent();
                    return [2, null];
                case 12: return [2, {
                        "type": "app",
                        "config": config,
                        "files": files
                    }];
            }
        });
    });
}
exports.fetchApp = fetchApp;
function runApp(path, opt) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var appPkg, files, fpath, fpath, taskId, task, form, style, r, _b, _c, _i, _d, theme, blob;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    opt = opt !== null && opt !== void 0 ? opt : {};
                    opt.runtime = (_a = opt.runtime) !== null && _a !== void 0 ? _a : {};
                    if (!(typeof path === "string")) return [3, 2];
                    return [4, fetchApp(path)];
                case 1:
                    if (!(appPkg = _e.sent())) {
                        return [2, -1];
                    }
                    return [3, 3];
                case 2:
                    appPkg = path;
                    _e.label = 3;
                case 3:
                    files = {};
                    for (fpath in appPkg.files) {
                        files[fpath] = appPkg.files[fpath];
                    }
                    for (fpath in opt.runtime) {
                        files["/runtime" + fpath] = opt.runtime[fpath];
                    }
                    appPkg.files = files;
                    taskId = ++ClickGo.taskId;
                    ClickGo.taskList[taskId] = {
                        "taskId": taskId,
                        "appPkg": appPkg,
                        "formList": {}
                    };
                    Tool.createTaskStyle(taskId);
                    task = ClickGo.taskList[taskId];
                    return [4, createForm({
                            "file": appPkg.config.mainLayout,
                            "taskId": task.taskId
                        })];
                case 4:
                    form = _e.sent();
                    if (typeof form === "number") {
                        delete (ClickGo.taskList[taskId]);
                        Tool.removeTaskStyle(taskId);
                        return [2, form];
                    }
                    if (!(appPkg.config.styleGlobal && appPkg.files[appPkg.config.styleGlobal + ".css"])) return [3, 7];
                    return [4, Tool.blob2Text(appPkg.files[appPkg.config.styleGlobal + ".css"])];
                case 5:
                    style = _e.sent();
                    r = Tool.stylePrepend(style, "cg-task" + task.taskId + "_");
                    _c = (_b = Tool).pushStyle;
                    return [4, Tool.styleUrl2DataUrl(appPkg.config.styleGlobal, r.style, files)];
                case 6:
                    _c.apply(_b, [_e.sent(), task.taskId]);
                    _e.label = 7;
                case 7:
                    if (!appPkg.config.theme) return [3, 11];
                    _i = 0, _d = appPkg.config.theme;
                    _e.label = 8;
                case 8:
                    if (!(_i < _d.length)) return [3, 11];
                    theme = _d[_i];
                    blob = appPkg.files[theme + ".cgt"];
                    if (!blob) {
                        return [3, 10];
                    }
                    return [4, Tool.loadTaskTheme(blob, task.taskId)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _i++;
                    return [3, 8];
                case 11: return [2, task.taskId];
            }
        });
    });
}
exports.runApp = runApp;
function createForm(opt) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var appPkg, formId, controlsStyle, components, _i, _d, controlPath, controlBlob, controlPkg, _loop_1, _e, _f, _g, name_1, state_1, style, layout, layoutBlob, styleBlob, data, methods, computed, watch, mounted, destroyed, expo, rand, r_1, randList, r, el, $vm, getFocusEvent, form;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    appPkg = ClickGo.taskList[opt.taskId].appPkg;
                    formId = ++ClickGo.formId;
                    controlsStyle = "";
                    components = {};
                    _i = 0, _d = appPkg.config.controls;
                    _h.label = 1;
                case 1:
                    if (!(_i < _d.length)) return [3, 7];
                    controlPath = _d[_i];
                    controlBlob = appPkg.files[controlPath + ".cgc"];
                    if (!controlBlob) {
                        return [2, -101];
                    }
                    return [4, Tool.controlBlob2Pkg(controlBlob)];
                case 2:
                    controlPkg = _h.sent();
                    if (!controlPkg) {
                        return [2, -102];
                    }
                    _loop_1 = function (name_1) {
                        var item, props, data_1, methods_1, computed_1, watch_1, mounted_1, destroyed_1, expo, rand_1, styleBlob, r_2, _a, _b, _c, layoutBlob, randList_1, r_3, _d, _e, layout_1;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    item = controlPkg[name_1];
                                    props = {};
                                    data_1 = {};
                                    methods_1 = {};
                                    computed_1 = {};
                                    watch_1 = {};
                                    mounted_1 = null;
                                    destroyed_1 = undefined;
                                    if (!item.files[item.config.code + ".js"]) return [3, 2];
                                    return [4, loader.requireMemory(item.config.code, item.files, {
                                            "after": "?" + Math.random()
                                        })];
                                case 1:
                                    expo = ((_a = _f.sent()) !== null && _a !== void 0 ? _a : [])[0];
                                    if (expo) {
                                        props = expo.props || {};
                                        data_1 = expo.data || {};
                                        methods_1 = expo.methods || {};
                                        computed_1 = expo.computed || {};
                                        watch_1 = expo.watch || {};
                                        mounted_1 = expo.mounted || null;
                                        destroyed_1 = expo.destroyed;
                                    }
                                    _f.label = 2;
                                case 2:
                                    rand_1 = "";
                                    styleBlob = item.files[item.config.style + ".css"];
                                    if (!styleBlob) return [3, 5];
                                    _b = (_a = Tool).stylePrepend;
                                    return [4, Tool.blob2Text(styleBlob)];
                                case 3:
                                    r_2 = _b.apply(_a, [_f.sent()]);
                                    rand_1 = r_2.rand;
                                    _c = controlsStyle;
                                    return [4, Tool.styleUrl2DataUrl(item.config.style, r_2.style, item.files)];
                                case 4:
                                    controlsStyle = _c + _f.sent();
                                    _f.label = 5;
                                case 5:
                                    layoutBlob = item.files[item.config.layout + ".html"];
                                    if (!layoutBlob) {
                                        return [2, { value: -103 }];
                                    }
                                    randList_1 = [
                                        "cg-theme-global-" + name_1 + "_",
                                        "cg-theme-task" + opt.taskId + "-" + name_1 + "_"
                                    ];
                                    if (rand_1 !== "") {
                                        randList_1.push(rand_1);
                                    }
                                    _e = (_d = Tool).layoutClassPrepend;
                                    return [4, Tool.blob2Text(layoutBlob)];
                                case 6:
                                    r_3 = _e.apply(_d, [_f.sent(), randList_1]);
                                    layout_1 = Tool.purify(r_3.layout);
                                    data_1.taskId = opt.taskId;
                                    data_1.formId = formId;
                                    data_1._scope = rand_1;
                                    data_1._controlName = name_1;
                                    methods_1.stopPropagation = function (e) {
                                        if (e instanceof MouseEvent && ClickGo.hasTouch) {
                                            return;
                                        }
                                        e.stopPropagation();
                                        Tool.changeFormFocus(this.formId);
                                    },
                                        methods_1._down = function (e) {
                                            if (e instanceof MouseEvent && ClickGo.hasTouch) {
                                                return;
                                            }
                                            this.$emit("down", event);
                                        };
                                    methods_1._tap = function (e) {
                                        e.stopPropagation();
                                        if (this.$el.className.indexOf("cg-disabled") !== -1) {
                                            return;
                                        }
                                        this.$emit("tap");
                                    };
                                    methods_1._dblclick = function (e) {
                                        e.stopPropagation();
                                        if (this.$el.className.indexOf("cg-disabled") !== -1) {
                                            return;
                                        }
                                        this.$emit("dblclick");
                                    };
                                    methods_1.getBlob = function (file) {
                                        var _a;
                                        return (_a = ClickGo.taskList[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                                    };
                                    methods_1.getDataUrl = function (file) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var f, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        f = ClickGo.taskList[this.taskId].appPkg.files[file];
                                                        if (!f) return [3, 2];
                                                        return [4, Tool.blob2DataUrl(f)];
                                                    case 1:
                                                        _a = _b.sent();
                                                        return [3, 3];
                                                    case 2:
                                                        _a = null;
                                                        _b.label = 3;
                                                    case 3: return [2, _a];
                                                }
                                            });
                                        });
                                    };
                                    methods_1._classPrepend = function (cla) {
                                        if (typeof cla !== "string") {
                                            return cla;
                                        }
                                        if (cla.slice(0, 3) === "cg-") {
                                            return cla;
                                        }
                                        return "cg-theme-global-" + this.$data._controlName + "_" + cla + " cg-theme-task" + this.taskId + "-" + this.$data._controlName + "_" + cla + " " + this.$data._scope + cla;
                                    };
                                    components["cg-" + name_1] = {
                                        "template": layout_1,
                                        "props": props,
                                        "data": function () {
                                            return Tool.clone(data_1);
                                        },
                                        "methods": methods_1,
                                        "computed": computed_1,
                                        "watch": watch_1,
                                        "mounted": function () {
                                            this.$nextTick(function () {
                                                mounted_1 === null || mounted_1 === void 0 ? void 0 : mounted_1.call(this);
                                            });
                                        },
                                        "destroyed": destroyed_1
                                    };
                                    return [2];
                            }
                        });
                    };
                    _e = [];
                    for (_f in controlPkg)
                        _e.push(_f);
                    _g = 0;
                    _h.label = 3;
                case 3:
                    if (!(_g < _e.length)) return [3, 6];
                    name_1 = _e[_g];
                    return [5, _loop_1(name_1)];
                case 4:
                    state_1 = _h.sent();
                    if (typeof state_1 === "object")
                        return [2, state_1.value];
                    _h.label = 5;
                case 5:
                    _g++;
                    return [3, 3];
                case 6:
                    _i++;
                    return [3, 1];
                case 7:
                    style = opt.style;
                    layout = opt.layout;
                    if (!opt.file) return [3, 11];
                    layoutBlob = appPkg.files[opt.file + ".xml"];
                    if (!layoutBlob) return [3, 9];
                    return [4, Tool.blob2Text(layoutBlob)];
                case 8:
                    layout = _h.sent();
                    _h.label = 9;
                case 9:
                    styleBlob = appPkg.files[opt.file + ".css"];
                    if (!styleBlob) return [3, 11];
                    return [4, Tool.blob2Text(styleBlob)];
                case 10:
                    style = _h.sent();
                    _h.label = 11;
                case 11:
                    if (!layout) {
                        return [2, -104];
                    }
                    data = {};
                    methods = {};
                    computed = {};
                    watch = {};
                    mounted = null;
                    destroyed = undefined;
                    if (!appPkg.files[opt.file + ".js"]) return [3, 13];
                    return [4, loader.requireMemory((_b = opt.file) !== null && _b !== void 0 ? _b : "", appPkg.files, {
                            "after": "?" + Math.random()
                        })];
                case 12:
                    expo = ((_c = _h.sent()) !== null && _c !== void 0 ? _c : [])[0];
                    if (expo) {
                        data = expo.data || {};
                        methods = expo.methods || {};
                        computed = expo.computed || {};
                        watch = expo.watch || {};
                        mounted = expo.mounted || null;
                        destroyed = expo.destroyed;
                    }
                    _h.label = 13;
                case 13:
                    rand = "";
                    if (!style) return [3, 15];
                    r_1 = Tool.stylePrepend(style);
                    rand = r_1.rand;
                    return [4, Tool.styleUrl2DataUrl("/", r_1.style, appPkg.files)];
                case 14:
                    style = _h.sent();
                    _h.label = 15;
                case 15:
                    layout = Tool.layoutInsertAttr(layout, ":focus=\"focus\"");
                    layout = Tool.purify(layout.replace(/<(\/{0,1})(.+?)>/g, function (t, t1, t2) {
                        if (t2 === "template") {
                            return t;
                        }
                        else {
                            return "<" + t1 + "cg-" + t2 + ">";
                        }
                    }));
                    randList = ["cg-task" + opt.taskId + "_"];
                    if (rand !== "") {
                        randList.push(rand);
                    }
                    r = Tool.layoutClassPrepend(layout, randList);
                    formListElement.insertAdjacentHTML("beforeend", r.layout);
                    el = formListElement.children.item(formListElement.children.length - 1);
                    el.classList.add("cg-form-wrap");
                    el.setAttribute("data-form-id", formId.toString());
                    el.setAttribute("data-task-id", opt.taskId.toString());
                    data.taskId = opt.taskId;
                    data.formId = formId;
                    data._scope = rand;
                    data.focus = false;
                    data._customZIndex = false;
                    if (opt.topMost) {
                        data._topMost = true;
                    }
                    else {
                        data._topMost = false;
                    }
                    methods.createForm = function (paramOpt, cfOpt) {
                        if (cfOpt === void 0) { cfOpt = {}; }
                        return __awaiter(this, void 0, void 0, function () {
                            var inOpt, form;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        inOpt = {
                                            "taskId": opt.taskId
                                        };
                                        if (typeof paramOpt === "string") {
                                            inOpt.file = paramOpt;
                                        }
                                        else {
                                            if (paramOpt.code) {
                                                inOpt.code = paramOpt.code;
                                            }
                                            if (paramOpt.layout) {
                                                inOpt.layout = paramOpt.layout;
                                            }
                                            if (paramOpt.style) {
                                                inOpt.style = paramOpt.style;
                                            }
                                        }
                                        if (cfOpt.mask) {
                                            this.$children[0].maskFor = true;
                                        }
                                        if (this.$data._topMost) {
                                            inOpt.topMost = true;
                                        }
                                        return [4, createForm(inOpt)];
                                    case 1:
                                        form = _a.sent();
                                        if (typeof form === "number") {
                                            this.$children[0].maskFor = undefined;
                                        }
                                        else {
                                            if (this.$children[0].maskFor) {
                                                this.$children[0].maskFor = form.formId;
                                                form.vue.$children[0].maskFrom = this.formId;
                                            }
                                        }
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.closeForm = function () {
                        removeForm(this.formId);
                    };
                    methods.bindFormDrag = function (e) {
                        this.$children[0].moveMethod(e);
                    };
                    methods.setSystemEventListener = function (name, func) {
                        this.eventList[name] = func;
                    };
                    methods.removeSystemEventListener = function (name) {
                        delete (this.eventList[name]);
                    };
                    methods.getBlob = function (file) {
                        var _a;
                        return (_a = ClickGo.taskList[this.taskId].appPkg.files[file]) !== null && _a !== void 0 ? _a : null;
                    };
                    methods.getDataUrl = function (file) {
                        return __awaiter(this, void 0, void 0, function () {
                            var f, _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        f = ClickGo.taskList[this.taskId].appPkg.files[file];
                                        if (!f) return [3, 2];
                                        return [4, Tool.blob2DataUrl(f)];
                                    case 1:
                                        _a = _b.sent();
                                        return [3, 3];
                                    case 2:
                                        _a = null;
                                        _b.label = 3;
                                    case 3: return [2, _a];
                                }
                            });
                        });
                    };
                    methods.loadTheme = function (path) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, Tool.loadTaskTheme(path, this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.clearTheme = function () {
                        Tool.clearTaskTheme(this.taskId);
                    };
                    methods.setTheme = function (path) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        Tool.clearTaskTheme(this.taskId);
                                        return [4, Tool.loadTaskTheme(path, this.taskId)];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    methods.setTopMost = function (top) {
                        this.$data._customZIndex = false;
                        if (top) {
                            this.$data._topMost = true;
                            if (!this.focus) {
                                Tool.changeFormFocus(this.formId, this);
                            }
                            else {
                                this.$children[0].setPropData("zIndex", ++ClickGo.topZIndex);
                            }
                        }
                        else {
                            this.$data._topMost = false;
                            this.$children[0].setPropData("zIndex", ++ClickGo.zIndex);
                        }
                    };
                    methods.flash = function () {
                        var _this = this;
                        if (!this.focus) {
                            Tool.changeFormFocus(this.formId);
                        }
                        if (this.$children[0].flashTimer) {
                            clearTimeout(this.$children[0].flashTimer);
                            this.$children[0].flashTimer = undefined;
                        }
                        this.$children[0].flashTimer = setTimeout(function () {
                            _this.$children[0].flashTimer = undefined;
                        }, 1000);
                        trigger("formFlash", opt.taskId, formId);
                    };
                    methods._classPrepend = function (cla) {
                        if (typeof cla !== "string") {
                            return cla;
                        }
                        if (cla.slice(0, 3) === "cg-") {
                            return cla;
                        }
                        return "cg-task" + this.taskId + "_" + cla + " " + this.$data._scope + cla;
                    };
                    return [4, new Promise(function (resolve) {
                            new Vue({
                                "el": el,
                                "data": data,
                                "methods": methods,
                                "computed": computed,
                                "watch": watch,
                                "components": components,
                                "mounted": function () {
                                    this.$nextTick(function () {
                                        if (this.$el.getAttribute !== undefined) {
                                            resolve(this);
                                        }
                                        else {
                                            if (this.$el.parentNode) {
                                                this.$destroy();
                                                Tool.removeStyle(this.taskId, this.formId);
                                                formListElement.removeChild(this.$el);
                                            }
                                            resolve(false);
                                        }
                                    });
                                },
                                "destroyed": destroyed
                            });
                        })];
                case 16:
                    $vm = _h.sent();
                    if (!$vm) {
                        return [2, -106];
                    }
                    $vm.eventList = {};
                    if (controlsStyle !== "") {
                        Tool.pushStyle(controlsStyle, opt.taskId, "controls", formId);
                    }
                    if (style) {
                        Tool.pushStyle(style, opt.taskId, "forms", formId);
                    }
                    if (!$vm.$children[0].stateMaxData) {
                        if ($vm.$children[0].left === -1) {
                            $vm.$children[0].setPropData("left", (ClickGo.getWidth() - $vm.$el.offsetWidth) / 2);
                        }
                        if ($vm.$children[0].top === -1) {
                            $vm.$children[0].setPropData("top", (ClickGo.getHeight() - $vm.$el.offsetHeight) / 2);
                        }
                    }
                    if ($vm.$children[0].zIndex !== -1) {
                        $vm.$data._customZIndex = true;
                    }
                    if (mounted) {
                        try {
                            mounted.call($vm);
                        }
                        catch (err) {
                            formListElement.removeChild($vm.$el);
                            Tool.removeStyle($vm.taskId, $vm.formId);
                            if (ClickGo.errorHandler) {
                                ClickGo.errorHandler($vm.taskId, $vm.formId, err, "Create form mounted error.");
                            }
                            else {
                                console.log(err);
                            }
                            return [2, -105];
                        }
                    }
                    Tool.changeFormFocus(formId, $vm);
                    getFocusEvent = function () {
                        Tool.changeFormFocus(formId);
                    };
                    if ("ontouchstart" in document.documentElement) {
                        $vm.$el.addEventListener("touchstart", getFocusEvent);
                    }
                    else {
                        $vm.$el.addEventListener("mousedown", getFocusEvent);
                    }
                    form = {
                        "formId": formId,
                        "vue": $vm
                    };
                    if (!ClickGo.taskList[opt.taskId]) {
                        $vm.$destroy();
                        Tool.removeStyle(opt.taskId, formId);
                        formListElement.removeChild($vm.$el);
                        return [2, -107];
                    }
                    ClickGo.taskList[opt.taskId].formList[formId] = form;
                    trigger("formCreated", opt.taskId, formId, { "title": $vm.$children[0].title, "icon": $vm.$children[0].iconData });
                    return [2, form];
            }
        });
    });
}
exports.createForm = createForm;
function removeForm(formId) {
    var formElement = formListElement.querySelector("[data-form-id=\"" + formId + "\"]");
    if (!formElement) {
        return false;
    }
    var taskIdAttr = formElement.getAttribute("data-task-id");
    if (!taskIdAttr) {
        return false;
    }
    var taskId = parseInt(taskIdAttr);
    if (Object.keys(ClickGo.taskList[taskId].formList).length === 1) {
        return endTask(taskId);
    }
    var title = "";
    if (ClickGo.taskList[taskId].formList[formId]) {
        title = ClickGo.taskList[taskId].formList[formId].vue.$children[0].title;
        ClickGo.taskList[taskId].formList[formId].vue.$destroy();
        if (ClickGo.taskList[taskId].formList[formId].vue.$children[0].maskFrom !== undefined) {
            var fid = ClickGo.taskList[taskId].formList[formId].vue.$children[0].maskFrom;
            ClickGo.taskList[taskId].formList[fid].vue.$children[0].maskFor = undefined;
        }
        delete (ClickGo.taskList[taskId].formList[formId]);
    }
    Tool.removeStyle(taskId, formId);
    formListElement.removeChild(formElement);
    trigger("formRemoved", taskId, formId, { "title": title });
    return true;
}
exports.removeForm = removeForm;
function endTask(taskId) {
    var _a, _b;
    if (!ClickGo.taskList[taskId]) {
        return true;
    }
    for (var i = 0; i < formListElement.children.length; ++i) {
        var el = formListElement.children.item(i);
        var dataTaskId = parseInt((_a = el.getAttribute("data-task-id")) !== null && _a !== void 0 ? _a : "0");
        if (dataTaskId !== taskId) {
            continue;
        }
        var formId = parseInt((_b = el.getAttribute("data-form-id")) !== null && _b !== void 0 ? _b : "0");
        if (ClickGo.taskList[taskId].formList[formId]) {
            ClickGo.taskList[taskId].formList[formId].vue.$destroy();
            var title = ClickGo.taskList[taskId].formList[formId].vue.$children[0].title;
            ClickGo.trigger("formRemoved", taskId, formId, { "title": title });
        }
        formListElement.removeChild(el);
        --i;
    }
    Tool.removeStyle(taskId);
    delete (ClickGo.taskList[taskId]);
    trigger("taskEnded", taskId);
    return true;
}
exports.endTask = endTask;
function watchSize(el, cb) {
    var rect = el.getBoundingClientRect();
    for (var _i = 0, _a = ClickGo._watchSize; _i < _a.length; _i++) {
        var item = _a[_i];
        if (item.el === el) {
            return rect;
        }
    }
    ClickGo._watchSize.push({
        "el": el,
        "rect": rect,
        "cb": cb
    });
    return rect;
}
exports.watchSize = watchSize;
function watchElement(el, cb) {
    var mo = new MutationObserver(cb);
    mo.observe(el, {
        "attributeFilter": ["style", "class"],
        "attributes": true,
        "characterData": true,
        "childList": true,
        "subtree": true
    });
    return mo;
}
exports.watchElement = watchElement;
function bindDown(oe, opt) {
    if (oe instanceof MouseEvent && ClickGo.hasTouch) {
        return;
    }
    var ox, oy;
    if (oe instanceof MouseEvent) {
        ox = oe.clientX;
        oy = oe.clientY;
    }
    else {
        ox = oe.touches[0].clientX;
        oy = oe.touches[0].clientY;
    }
    var isStart = false;
    var end;
    var move = function (e) {
        e.preventDefault();
        var x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        var y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        if (x === ox && y === oy) {
            return;
        }
        if (!isStart) {
            isStart = true;
            if (opt.start && (opt.start(e) === false)) {
                if (e instanceof MouseEvent) {
                    window.removeEventListener("mousemove", move);
                    window.removeEventListener("mouseup", end);
                }
                else {
                    window.removeEventListener("touchmove", move);
                    window.removeEventListener("touchend", end);
                }
                return;
            }
        }
        if (opt.move && (opt.move(e) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", end);
            }
            else {
                window.removeEventListener("touchmove", move);
                window.removeEventListener("touchend", end);
            }
            return;
        }
    };
    end = function (e) {
        if (e instanceof MouseEvent) {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", end);
        }
        else {
            window.removeEventListener("touchmove", move);
            window.removeEventListener("touchend", end);
        }
        opt.up && opt.up(e);
        if (isStart) {
            opt.end && opt.end(e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", end);
    }
    else {
        window.addEventListener("touchmove", move, { passive: false });
        window.addEventListener("touchend", end);
    }
    opt.down && opt.down(oe);
}
exports.bindDown = bindDown;
function bindMove(e, opt) {
    var _a, _b, _c, _d;
    setGlobalCursor(getComputedStyle(e.target).cursor);
    var tx, ty;
    if (e instanceof MouseEvent) {
        tx = e.clientX * ClickGo.rzoom;
        ty = e.clientY * ClickGo.rzoom;
    }
    else {
        tx = e.touches[0].clientX * ClickGo.rzoom;
        ty = e.touches[0].clientY * ClickGo.rzoom;
    }
    var left, top, right, bottom;
    if (opt.offsetObject) {
        if (!(opt.offsetObject instanceof HTMLElement)) {
            opt.offsetObject = opt.offsetObject.$el;
        }
        var rect = opt.offsetObject.getBoundingClientRect();
        var sd = getComputedStyle(opt.offsetObject);
        left = rect.left + opt.offsetObject.clientLeft + parseFloat(sd.paddingLeft);
        top = rect.top + opt.offsetObject.clientTop + parseFloat(sd.paddingTop);
        right = rect.left + rect.width - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
        bottom = rect.top + rect.height - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
    }
    else {
        left = (_a = opt.left) !== null && _a !== void 0 ? _a : ClickGo.getLeft();
        top = (_b = opt.top) !== null && _b !== void 0 ? _b : ClickGo.getTop();
        right = (_c = opt.right) !== null && _c !== void 0 ? _c : ClickGo.getWidth();
        bottom = (_d = opt.bottom) !== null && _d !== void 0 ? _d : ClickGo.getHeight();
    }
    if (opt.offsetLeft) {
        left += opt.offsetLeft;
    }
    if (opt.offsetTop) {
        top += opt.offsetTop;
    }
    if (opt.offsetRight) {
        right += opt.offsetRight;
    }
    if (opt.offsetBottom) {
        bottom += opt.offsetBottom;
    }
    var isBorder = false;
    var objectLeft, objectTop, objectWidth, objectHeight;
    var offsetLeft = 0;
    var offsetTop = 0;
    var offsetRight = 0;
    var offsetBottom = 0;
    var moveTime = [];
    ClickGo.bindDown(e, {
        start: function () {
            var _a, _b, _c, _d;
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    setGlobalCursor();
                    return false;
                }
            }
            if (opt.object) {
                if (!(opt.object instanceof HTMLElement)) {
                    opt.object = opt.object.$el;
                }
                var rect = opt.object.getBoundingClientRect();
                objectLeft = rect.left;
                objectTop = rect.top;
                objectWidth = rect.width;
                objectHeight = rect.height;
            }
            else {
                objectLeft = (_a = opt.objectLeft) !== null && _a !== void 0 ? _a : 0;
                objectTop = (_b = opt.objectTop) !== null && _b !== void 0 ? _b : 0;
                objectWidth = (_c = opt.objectWidth) !== null && _c !== void 0 ? _c : 0;
                objectHeight = (_d = opt.objectHeight) !== null && _d !== void 0 ? _d : 0;
            }
            if (objectWidth > 0) {
                offsetLeft = tx - objectLeft;
            }
            if (objectHeight > 0) {
                offsetTop = ty - objectTop;
            }
            offsetRight = objectWidth - offsetLeft;
            offsetBottom = objectHeight - offsetTop;
        },
        move: function (e) {
            var x, y;
            x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
            y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
            if (x === tx && y === ty) {
                return;
            }
            var inBorderTop = false, inBorderRight = false, inBorderBottom = false, inBorderLeft = false;
            var xol = x - offsetLeft;
            var xor = x + offsetRight;
            if (xol <= left) {
                if (xol < left && x < tx) {
                    if (tx - offsetLeft > left) {
                        x = left + offsetLeft;
                    }
                    else {
                        x = tx;
                    }
                }
                inBorderLeft = true;
            }
            else if (offsetRight > 0) {
                if (xor >= right) {
                    if (xor > right && x > tx) {
                        if (tx + offsetRight < right) {
                            x = right - offsetRight;
                        }
                        else {
                            x = tx;
                        }
                    }
                    inBorderRight = true;
                }
            }
            else if (offsetRight === 0) {
                var rs1 = right - 1;
                if (x >= rs1) {
                    if (x > rs1 && x > tx) {
                        if (tx < rs1) {
                            x = rs1;
                        }
                        else {
                            x = tx;
                        }
                    }
                    inBorderRight = true;
                }
            }
            var yot = y - offsetTop;
            var yob = y + offsetBottom;
            if (yot <= top) {
                if (yot < top && y < ty) {
                    if (ty - offsetTop > top) {
                        y = top + offsetTop;
                    }
                    else {
                        y = ty;
                    }
                }
                inBorderTop = true;
            }
            else if (offsetBottom > 0) {
                if (yob >= bottom) {
                    if (yob > bottom && y > ty) {
                        if (ty + offsetBottom < bottom) {
                            y = bottom - offsetBottom;
                        }
                        else {
                            y = ty;
                        }
                    }
                    inBorderBottom = true;
                }
            }
            else if (offsetBottom === 0) {
                var bs1 = bottom - 1;
                if (y >= bs1) {
                    if (y > bs1 && y > ty) {
                        if (ty < bs1) {
                            y = bs1;
                        }
                        else {
                            y = ty;
                        }
                    }
                    inBorderBottom = true;
                }
            }
            var border = "";
            if (inBorderTop || inBorderRight || inBorderBottom || inBorderLeft) {
                if (inBorderTop) {
                    if (x - left <= 20) {
                        border = "lt";
                    }
                    else if (right - x <= 20) {
                        border = "tr";
                    }
                    else {
                        border = "t";
                    }
                }
                else if (inBorderRight) {
                    if (y - top <= 20) {
                        border = "tr";
                    }
                    else if (bottom - y <= 20) {
                        border = "rb";
                    }
                    else {
                        border = "r";
                    }
                }
                else if (inBorderBottom) {
                    if (right - x <= 20) {
                        border = "rb";
                    }
                    else if (x - left <= 20) {
                        border = "bl";
                    }
                    else {
                        border = "b";
                    }
                }
                else if (inBorderLeft) {
                    if (y - top <= 20) {
                        border = "lt";
                    }
                    else if (bottom - y <= 20) {
                        border = "bl";
                    }
                    else {
                        border = "l";
                    }
                }
                if (!isBorder) {
                    isBorder = true;
                    opt.borderIn && opt.borderIn(x, y, border);
                }
            }
            else {
                if (isBorder) {
                    isBorder = false;
                    opt.borderOut && opt.borderOut();
                }
            }
            moveTime.push(Date.now());
            if (moveTime.length > 2) {
                moveTime.splice(0, 1);
            }
            opt.move && opt.move(x - tx, y - ty, x, y, border);
            tx = x;
            ty = y;
        },
        up: function () {
            setGlobalCursor();
            opt.up && opt.up();
        },
        end: function () {
            opt.end && opt.end(moveTime[0] || 0);
        }
    });
    if (opt.showRect) {
        showRectangle(tx, ty, {
            "left": left,
            "top": top,
            "width": right - left,
            "height": bottom - top
        });
        setTimeout(function () {
            hideRectangle();
        }, 500);
    }
    return {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom
    };
}
exports.bindMove = bindMove;
function bindResize(e, opt) {
    var _a, _b;
    opt.minWidth = (_a = opt.minWidth) !== null && _a !== void 0 ? _a : 0;
    opt.minHeight = (_b = opt.minHeight) !== null && _b !== void 0 ? _b : 0;
    var x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * ClickGo.rzoom;
    var y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * ClickGo.rzoom;
    var offsetLeft, offsetTop, offsetRight, offsetBottom;
    var left, top, right, bottom;
    if (opt.dir === "tr" || opt.dir === "r" || opt.dir === "rb") {
        left = opt.left + opt.minWidth;
        offsetLeft = x - (opt.left + opt.width);
        offsetRight = offsetLeft;
    }
    else if (opt.dir === "bl" || opt.dir === "l" || opt.dir === "lt") {
        right = opt.left + opt.width - opt.minWidth;
        offsetLeft = x - opt.left;
        offsetRight = offsetLeft;
    }
    if (opt.dir === "rb" || opt.dir === "b" || opt.dir === "bl") {
        top = opt.top + opt.minHeight;
        offsetTop = y - (opt.top + opt.height);
        offsetBottom = offsetTop;
    }
    else if (opt.dir === "lt" || opt.dir === "t" || opt.dir === "tr") {
        bottom = opt.top + opt.height - opt.minHeight;
        offsetTop = y - opt.top;
        offsetBottom = offsetTop;
    }
    bindMove(e, {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom,
        "offsetLeft": offsetLeft,
        "offsetTop": offsetTop,
        "offsetRight": offsetRight,
        "offsetBottom": offsetBottom,
        "start": opt.start,
        "move": function (ox, oy, x, y, border) {
            if (opt.dir === "tr" || opt.dir === "r" || opt.dir === "rb") {
                opt.width += ox;
            }
            else if (opt.dir === "bl" || opt.dir === "l" || opt.dir === "lt") {
                opt.width -= ox;
                opt.left += ox;
            }
            if (opt.dir === "rb" || opt.dir === "b" || opt.dir === "bl") {
                opt.height += oy;
            }
            else if (opt.dir === "lt" || opt.dir === "t" || opt.dir === "tr") {
                opt.height -= oy;
                opt.top += oy;
            }
            opt.move && opt.move(opt.left, opt.top, opt.width, opt.height, x, y, border);
        },
        "end": opt.end
    });
}
exports.bindResize = bindResize;
var globalCursorStyle;
function setGlobalCursor(type) {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById("cg-global-cursor");
    }
    if (type) {
        globalCursorStyle.innerHTML = "* {cursor: " + type + " !important;}";
    }
    else {
        globalCursorStyle.innerHTML = "";
    }
}
exports.setGlobalCursor = setGlobalCursor;
