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
function trigger(name, taskId = 0, formId = 0, opt = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    switch (name) {
        case 'screenResize': {
            const rtn = (_a = exports.globalEvents.screenResizeHandler) === null || _a === void 0 ? void 0 : _a.call(exports.globalEvents);
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_c = (_b = exports.tasks[tid].forms[fid].events)[name]) === null || _c === void 0 ? void 0 : _c.call(_b);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
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
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_e = (_d = exports.tasks[tid].forms[fid].events)[name]) === null || _e === void 0 ? void 0 : _e.call(_d, taskId, formId, opt.title, opt.icon);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formTitleChanged': {
            const rtn = (_f = exports.globalEvents.formTitleChangedHandler) === null || _f === void 0 ? void 0 : _f.call(exports.globalEvents, taskId, formId, (_g = opt.title) !== null && _g !== void 0 ? _g : '');
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_j = (_h = exports.tasks[tid].forms[fid].events)[name]) === null || _j === void 0 ? void 0 : _j.call(_h, taskId, formId, opt.title);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formIconChanged': {
            const rtn = (_k = exports.globalEvents.formIconChangedHandler) === null || _k === void 0 ? void 0 : _k.call(exports.globalEvents, taskId, formId, (_l = opt.icon) !== null && _l !== void 0 ? _l : '');
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_o = (_m = exports.tasks[tid].forms[fid].events)[name]) === null || _o === void 0 ? void 0 : _o.call(_m, taskId, formId, opt.icon);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
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
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_s = (_r = exports.tasks[tid].forms[fid].events)[name]) === null || _s === void 0 ? void 0 : _s.call(_r, taskId, formId, opt.state);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
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
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_u = (_t = exports.tasks[tid].forms[fid].events)[name]) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
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
            for (let tid in exports.tasks) {
                for (let fid in exports.tasks[tid].forms) {
                    const rtn = (_w = (_v = exports.tasks[tid].forms[fid].events)[name]) === null || _w === void 0 ? void 0 : _w.call(_v, taskId);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
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
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.clickgoFiles[path]) {
            return exports.clickgoFiles[path];
        }
        try {
            let blob = yield (yield fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random())).blob();
            let lio = path.lastIndexOf('.');
            let ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
            switch (ext) {
                case 'cgc': {
                    let pkg = yield clickgo.tool.controlBlob2Pkg(blob);
                    if (!pkg) {
                        return null;
                    }
                    exports.clickgoControlPkgs[path] = pkg;
                    break;
                }
                case 'cgt': {
                    let t = yield clickgo.theme.readBlob(blob);
                    if (!t) {
                        return null;
                    }
                    clickgo.theme.clickgoThemes[path] = t;
                    break;
                }
            }
            exports.clickgoFiles[path] = blob;
            return exports.clickgoFiles[path];
        }
        catch (_a) {
            return null;
        }
    });
}
exports.fetchClickGoFile = fetchClickGoFile;
function fetchClickGoControlPkg(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.clickgoControlPkgs[path]) {
            return exports.clickgoControlPkgs[path];
        }
        if (!(yield fetchClickGoFile(path))) {
            return null;
        }
        return exports.clickgoControlPkgs[path];
    });
}
exports.fetchClickGoControlPkg = fetchClickGoControlPkg;
function fetchApp(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (path.slice(-1) !== '/') {
            return null;
        }
        let realPath = clickgo.tool.parsePath(path);
        let config;
        let files = {};
        try {
            config = yield (yield fetch(realPath + 'config.json?' + Math.random())).json();
            for (let file of config.files) {
                let resp = yield fetch(realPath + file.slice(1) + '?' + Math.random());
                files[file] = yield resp.blob();
            }
            if (config.controls) {
                for (let file of config.controls) {
                    if (file.slice(0, 9) !== '/clickgo/') {
                        continue;
                    }
                    if ((yield fetchClickGoFile(file.slice(8) + '.cgc')) === null) {
                        return null;
                    }
                }
            }
            if (config.themes) {
                for (let file of config.themes) {
                    if (file.slice(0, 9) !== '/clickgo/') {
                        continue;
                    }
                    if ((yield fetchClickGoFile(file.slice(8) + '.cgt')) === null) {
                        return null;
                    }
                }
            }
        }
        catch (_a) {
            return null;
        }
        return {
            'type': 'app',
            'config': config,
            'files': files
        };
    });
}
exports.fetchApp = fetchApp;
function runApp(path, opt) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        opt = opt !== null && opt !== void 0 ? opt : {};
        opt.runtime = (_a = opt.runtime) !== null && _a !== void 0 ? _a : {};
        let appPkg;
        if (typeof path === 'string') {
            if (!(appPkg = yield fetchApp(path))) {
                return -1;
            }
        }
        else {
            appPkg = path;
        }
        let files = {};
        for (let fpath in appPkg.files) {
            files[fpath] = appPkg.files[fpath];
        }
        for (let fpath in opt.runtime) {
            files['/runtime' + fpath] = opt.runtime[fpath];
        }
        appPkg.files = files;
        let taskId = ++exports.lastTaskId;
        exports.tasks[taskId] = {
            'id': taskId,
            'appPkg': appPkg,
            'customTheme': false,
            'controlPkgs': {},
            'themes': {},
            'forms': {}
        };
        clickgo.tool.createTaskStyleElement(taskId);
        let task = exports.tasks[taskId];
        let form = yield clickgo.form.create({
            'file': appPkg.config.main,
            'taskId': task.id
        });
        if (typeof form === 'number') {
            delete (exports.tasks[taskId]);
            clickgo.tool.removeTaskStyleElement(taskId);
            return form;
        }
        if (appPkg.config.style && appPkg.files[appPkg.config.style + '.css']) {
            let style = yield clickgo.tool.blob2Text(appPkg.files[appPkg.config.style + '.css']);
            let r = clickgo.tool.stylePrepend(style, 'cg-task' + task.id + '_');
            clickgo.tool.pushStyle(yield clickgo.tool.styleUrl2DataUrl(appPkg.config.style, r.style, files), task.id);
        }
        if (appPkg.config.themes) {
            task.customTheme = true;
            for (let theme of appPkg.config.themes) {
                yield clickgo.theme.load(theme + '.cgt', task.id);
            }
        }
        else {
            if (clickgo.theme.global) {
                yield clickgo.theme.load(clickgo.theme.global, task.id, false);
            }
        }
        return task.id;
    });
}
exports.runApp = runApp;
function endTask(taskId) {
    let task = exports.tasks[taskId];
    if (!task) {
        return true;
    }
    for (let fid in task.forms) {
        let form = task.forms[fid];
        let title = form.vroot.$refs.form.title;
        form.vapp.unmount();
        form.vapp._container.remove();
        trigger('formRemoved', taskId, form.id, { 'title': title });
    }
    clickgo.tool.removeStyle(taskId);
    delete (exports.tasks[taskId]);
    trigger('taskEnded', taskId);
    return true;
}
exports.endTask = endTask;
let globalCursorStyle;
function setGlobalCursor(type) {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById('cg-global-cursor');
    }
    if (type) {
        globalCursorStyle.innerHTML = `* {cursor: ${type} !important;}`;
    }
    else {
        globalCursorStyle.innerHTML = '';
    }
}
exports.setGlobalCursor = setGlobalCursor;
