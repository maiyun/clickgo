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
exports.setGlobalCursor = exports.endTask = exports.runApp = exports.fetchApp = exports.fetchClickGoControlPkg = exports.fetchClickGoFile = exports.trigger = exports.globalEvents = exports.lastTaskId = exports.tasks = exports.clickgoControlPkgs = exports.clickgoFiles = void 0;
exports.clickgoFiles = {};
exports.clickgoControlPkgs = {};
exports.tasks = {};
exports.lastTaskId = 0;
exports.globalEvents = {
    errorHandler: null,
    screenResizeHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: null,
    formTitleChangedHandler: null,
    formIconChangedHandler: null,
    formStateMinChangedHandler: null,
    formStateMaxChangedHandler: null,
    formFocusedHandler: null,
    formBlurredHandler: null,
    formFlashHandler: null,
    taskStartedHandler: null,
    taskEndedHandler: null
};
function trigger(name, taskId, formId, opt) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    if (taskId === void 0) { taskId = 0; }
    if (formId === void 0) { formId = 0; }
    if (opt === void 0) { opt = {}; }
    switch (name) {
        case 'screenResize': {
            var rtn = (_a = exports.globalEvents.screenResizeHandler) === null || _a === void 0 ? void 0 : _a.call(exports.globalEvents);
            if (rtn instanceof Promise) {
                rtn.catch(function (e) {
                    throw e;
                });
            }
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn_1 = (_c = (_b = exports.tasks[tid].forms[fid].events)[name]) === null || _c === void 0 ? void 0 : _c.call(_b);
                    if (rtn_1 instanceof Promise) {
                        rtn_1.catch(function (e) {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            if (exports.globalEvents[name + 'Handler']) {
                exports.globalEvents[name + 'Handler'](taskId, formId, opt.title, opt.icon);
            }
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn = (_e = (_d = exports.tasks[tid].forms[fid].events)[name]) === null || _e === void 0 ? void 0 : _e.call(_d, taskId, formId, opt.title, opt.icon);
                    if (rtn instanceof Promise) {
                        rtn.catch(function (e) {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formTitleChanged': {
            var rtn = (_f = exports.globalEvents.formTitleChangedHandler) === null || _f === void 0 ? void 0 : _f.call(exports.globalEvents, taskId, formId, (_g = opt.title) !== null && _g !== void 0 ? _g : '');
            if (rtn instanceof Promise) {
                rtn.catch(function (e) {
                    throw e;
                });
            }
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn_2 = (_j = (_h = exports.tasks[tid].forms[fid].events)[name]) === null || _j === void 0 ? void 0 : _j.call(_h, taskId, formId, opt.title);
                    if (rtn_2 instanceof Promise) {
                        rtn_2.catch(function (e) {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formIconChanged': {
            var rtn = (_k = exports.globalEvents.formIconChangedHandler) === null || _k === void 0 ? void 0 : _k.call(exports.globalEvents, taskId, formId, (_l = opt.icon) !== null && _l !== void 0 ? _l : '');
            if (rtn instanceof Promise) {
                rtn.catch(function (e) {
                    throw e;
                });
            }
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn_3 = (_o = (_m = exports.tasks[tid].forms[fid].events)[name]) === null || _o === void 0 ? void 0 : _o.call(_m, taskId, formId, opt.icon);
                    if (rtn_3 instanceof Promise) {
                        rtn_3.catch(function (e) {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged': {
            (_q = (_p = exports.globalEvents)[name + 'Handler']) === null || _q === void 0 ? void 0 : _q.call(_p, taskId, formId, opt.state);
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn = (_s = (_r = exports.tasks[tid].forms[fid].events)[name]) === null || _s === void 0 ? void 0 : _s.call(_r, taskId, formId, opt.state);
                    if (rtn instanceof Promise) {
                        rtn.catch(function (e) {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            if (exports.globalEvents[name + 'Handler']) {
                exports.globalEvents[name + 'Handler'](taskId, formId);
            }
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn = (_u = (_t = exports.tasks[tid].forms[fid].events)[name]) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId);
                    if (rtn instanceof Promise) {
                        rtn.catch(function (e) {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            if (exports.globalEvents[name + 'Handler']) {
                exports.globalEvents[name + 'Handler'](taskId, formId);
            }
            for (var tid in exports.tasks) {
                for (var fid in exports.tasks[tid].forms) {
                    var rtn = (_w = (_v = exports.tasks[tid].forms[fid].events)[name]) === null || _w === void 0 ? void 0 : _w.call(_v, taskId);
                    if (rtn instanceof Promise) {
                        rtn.catch(function (e) {
                            throw e;
                        });
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
        var blob, lio, ext, _a, pkg, t, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (exports.clickgoFiles[path]) {
                        return [2, exports.clickgoFiles[path]];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, , 10]);
                    return [4, fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random())];
                case 2: return [4, (_c.sent()).blob()];
                case 3:
                    blob = _c.sent();
                    lio = path.lastIndexOf('.');
                    ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
                    _a = ext;
                    switch (_a) {
                        case 'cgc': return [3, 4];
                        case 'cgt': return [3, 6];
                    }
                    return [3, 8];
                case 4: return [4, clickgo.tool.controlBlob2Pkg(blob)];
                case 5:
                    pkg = _c.sent();
                    if (!pkg) {
                        return [2, null];
                    }
                    exports.clickgoControlPkgs[path] = pkg;
                    return [3, 8];
                case 6: return [4, clickgo.theme.readBlob(blob)];
                case 7:
                    t = _c.sent();
                    if (!t) {
                        return [2, null];
                    }
                    clickgo.theme.clickgoThemes[path] = t;
                    return [3, 8];
                case 8:
                    exports.clickgoFiles[path] = blob;
                    return [2, exports.clickgoFiles[path]];
                case 9:
                    _b = _c.sent();
                    return [2, null];
                case 10: return [2];
            }
        });
    });
}
exports.fetchClickGoFile = fetchClickGoFile;
function fetchClickGoControlPkg(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (exports.clickgoControlPkgs[path]) {
                        return [2, exports.clickgoControlPkgs[path]];
                    }
                    return [4, fetchClickGoFile(path)];
                case 1:
                    if (!(_a.sent())) {
                        return [2, null];
                    }
                    return [2, exports.clickgoControlPkgs[path]];
            }
        });
    });
}
exports.fetchClickGoControlPkg = fetchClickGoControlPkg;
function fetchApp(path) {
    return __awaiter(this, void 0, void 0, function () {
        var realPath, config, files, _i, _a, file, resp, _b, _c, _d, _e, file, _f, _g, file, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    if (path.slice(-1) !== '/') {
                        return [2, null];
                    }
                    realPath = clickgo.tool.parsePath(path);
                    files = {};
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, 17, , 18]);
                    return [4, fetch(realPath + 'config.json?' + Math.random())];
                case 2: return [4, (_j.sent()).json()];
                case 3:
                    config = _j.sent();
                    _i = 0, _a = config.files;
                    _j.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3, 8];
                    file = _a[_i];
                    return [4, fetch(realPath + file.slice(1) + '?' + Math.random())];
                case 5:
                    resp = _j.sent();
                    _b = files;
                    _c = file;
                    return [4, resp.blob()];
                case 6:
                    _b[_c] = _j.sent();
                    _j.label = 7;
                case 7:
                    _i++;
                    return [3, 4];
                case 8:
                    if (!config.controls) return [3, 12];
                    _d = 0, _e = config.controls;
                    _j.label = 9;
                case 9:
                    if (!(_d < _e.length)) return [3, 12];
                    file = _e[_d];
                    if (file.slice(0, 9) !== '/clickgo/') {
                        return [3, 11];
                    }
                    return [4, fetchClickGoFile(file.slice(8) + '.cgc')];
                case 10:
                    if ((_j.sent()) === null) {
                        return [2, null];
                    }
                    _j.label = 11;
                case 11:
                    _d++;
                    return [3, 9];
                case 12:
                    if (!config.themes) return [3, 16];
                    _f = 0, _g = config.themes;
                    _j.label = 13;
                case 13:
                    if (!(_f < _g.length)) return [3, 16];
                    file = _g[_f];
                    if (file.slice(0, 9) !== '/clickgo/') {
                        return [3, 15];
                    }
                    return [4, fetchClickGoFile(file.slice(8) + '.cgt')];
                case 14:
                    if ((_j.sent()) === null) {
                        return [2, null];
                    }
                    _j.label = 15;
                case 15:
                    _f++;
                    return [3, 13];
                case 16: return [3, 18];
                case 17:
                    _h = _j.sent();
                    return [2, null];
                case 18: return [2, {
                        'type': 'app',
                        'config': config,
                        'files': files
                    }];
            }
        });
    });
}
exports.fetchApp = fetchApp;
function runApp(path, opt) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var appPkg, files, fpath, fpath, taskId, task, form, style, r, _b, _c, _i, _d, theme;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    opt = opt !== null && opt !== void 0 ? opt : {};
                    opt.runtime = (_a = opt.runtime) !== null && _a !== void 0 ? _a : {};
                    if (!(typeof path === 'string')) return [3, 2];
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
                        files['/runtime' + fpath] = opt.runtime[fpath];
                    }
                    appPkg.files = files;
                    taskId = ++exports.lastTaskId;
                    exports.tasks[taskId] = {
                        'id': taskId,
                        'appPkg': appPkg,
                        'customTheme': false,
                        'controlPkgs': {},
                        'themes': {},
                        'forms': {}
                    };
                    clickgo.tool.createTaskStyleElement(taskId);
                    task = exports.tasks[taskId];
                    return [4, clickgo.form.create({
                            'file': appPkg.config.main,
                            'taskId': task.id
                        })];
                case 4:
                    form = _e.sent();
                    if (typeof form === 'number') {
                        delete (exports.tasks[taskId]);
                        clickgo.tool.removeTaskStyleElement(taskId);
                        return [2, form];
                    }
                    if (!(appPkg.config.style && appPkg.files[appPkg.config.style + '.css'])) return [3, 7];
                    return [4, clickgo.tool.blob2Text(appPkg.files[appPkg.config.style + '.css'])];
                case 5:
                    style = _e.sent();
                    r = clickgo.tool.stylePrepend(style, 'cg-task' + task.id + '_');
                    _c = (_b = clickgo.tool).pushStyle;
                    return [4, clickgo.tool.styleUrl2DataUrl(appPkg.config.style, r.style, files)];
                case 6:
                    _c.apply(_b, [_e.sent(), task.id]);
                    _e.label = 7;
                case 7:
                    if (!appPkg.config.themes) return [3, 12];
                    task.customTheme = true;
                    _i = 0, _d = appPkg.config.themes;
                    _e.label = 8;
                case 8:
                    if (!(_i < _d.length)) return [3, 11];
                    theme = _d[_i];
                    return [4, clickgo.theme.load(theme + '.cgt', task.id)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _i++;
                    return [3, 8];
                case 11: return [3, 14];
                case 12:
                    if (!clickgo.theme.global) return [3, 14];
                    return [4, clickgo.theme.load(clickgo.theme.global, task.id, false)];
                case 13:
                    _e.sent();
                    _e.label = 14;
                case 14: return [2, task.id];
            }
        });
    });
}
exports.runApp = runApp;
function endTask(taskId) {
    var task = exports.tasks[taskId];
    if (!task) {
        return true;
    }
    for (var fid in task.forms) {
        var form = task.forms[fid];
        var el = form.vue.$el;
        var title = form.vue.$children[0].title;
        form.vue.$destroy();
        el.remove();
        trigger('formRemoved', taskId, form.id, { 'title': title });
    }
    clickgo.tool.removeStyle(taskId);
    delete (exports.tasks[taskId]);
    trigger('taskEnded', taskId);
    return true;
}
exports.endTask = endTask;
var globalCursorStyle;
function setGlobalCursor(type) {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById('cg-global-cursor');
    }
    if (type) {
        globalCursorStyle.innerHTML = "* {cursor: " + type + " !important;}";
    }
    else {
        globalCursorStyle.innerHTML = '';
    }
}
exports.setGlobalCursor = setGlobalCursor;
