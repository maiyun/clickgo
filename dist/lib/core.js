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
exports.fetchApp = exports.readApp = exports.fetchClickGoFile = exports.trigger = exports.globalEvents = exports.clickgoFiles = void 0;
exports.clickgoFiles = {};
exports.globalEvents = {
    errorHandler: null,
    screenResizeHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: null,
    formTitleChangedHandler: null,
    formIconChangedHandler: null,
    formStateMinChangedHandler: null,
    formStateMaxChangedHandler: null,
    formShowChangedHandler: null,
    formFocusedHandler: null,
    formBlurredHandler: null,
    formFlashHandler: null,
    taskStartedHandler: null,
    taskEndedHandler: null
};
function trigger(name, taskId = 0, formId = 0, param1 = '', param2 = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    switch (name) {
        case 'screenResize': {
            const rtn = (_a = exports.globalEvents.screenResizeHandler) === null || _a === void 0 ? void 0 : _a.call(exports.globalEvents);
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_c = (_b = task.forms[fid].events)[name]) === null || _c === void 0 ? void 0 : _c.call(_b);
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
                exports.globalEvents[name + 'Handler'](taskId, formId, param1, param2);
            }
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_e = (_d = task.forms[fid].events)[name]) === null || _e === void 0 ? void 0 : _e.call(_d, taskId, formId, param1, param2);
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
            const rtn = (_f = exports.globalEvents.formTitleChangedHandler) === null || _f === void 0 ? void 0 : _f.call(exports.globalEvents, taskId, formId, param1);
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_h = (_g = task.forms[fid].events)[name]) === null || _h === void 0 ? void 0 : _h.call(_g, taskId, formId, param1);
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
            const rtn = (_j = exports.globalEvents.formIconChangedHandler) === null || _j === void 0 ? void 0 : _j.call(exports.globalEvents, taskId, formId, param1);
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_l = (_k = task.forms[fid].events)[name]) === null || _l === void 0 ? void 0 : _l.call(_k, taskId, formId, param1);
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
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (_o = (_m = exports.globalEvents)[name + 'Handler']) === null || _o === void 0 ? void 0 : _o.call(_m, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_q = (_p = task.forms[fid].events)[name]) === null || _q === void 0 ? void 0 : _q.call(_p, taskId, formId, param1);
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
            (_s = (_r = exports.globalEvents)[name + 'Handler']) === null || _s === void 0 ? void 0 : _s.call(_r, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_u = (_t = task.forms[fid].events)[name]) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId);
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
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    const rtn = (_w = (_v = task.forms[fid].events)[name]) === null || _w === void 0 ? void 0 : _w.call(_v, taskId);
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
                    let pkg = yield clickgo.control.read(blob);
                    if (!pkg) {
                        return null;
                    }
                    clickgo.control.clickgoControlPkgs[path] = pkg;
                    break;
                }
                case 'cgt': {
                    let theme = yield clickgo.theme.read(blob);
                    if (!theme) {
                        return null;
                    }
                    clickgo.theme.clickgoThemePkgs[path] = theme;
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
function readApp(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        let zip = yield clickgo.zip.getZip(blob);
        if (!zip) {
            return false;
        }
        let files = {};
        let configContent = yield zip.getContent('/config.json');
        if (!configContent) {
            return false;
        }
        let config = JSON.parse(configContent);
        for (let file of config.files) {
            let fab = yield zip.getContent(file, 'arraybuffer');
            if (!fab) {
                continue;
            }
            let mimeo = clickgo.tool.getMimeByPath(file);
            files[file] = new Blob([fab], {
                'type': mimeo.mime
            });
        }
        if (!config) {
            return false;
        }
        return {
            'type': 'app',
            'config': config,
            'files': files
        };
    });
}
exports.readApp = readApp;
function fetchApp(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let isCga = false;
        if (!url.endsWith('/')) {
            let lio = url.lastIndexOf('.');
            let ext = lio === -1 ? '' : url.slice(lio + 1).toLowerCase();
            if (ext !== 'cga') {
                return null;
            }
            isCga = true;
        }
        let realUrl;
        if (url.startsWith('clickgo/')) {
            realUrl = clickgo.tool.urlResolve(clickgo.cgRootPath, url.slice(8));
        }
        else {
            realUrl = clickgo.tool.urlResolve(clickgo.rootPath, url);
        }
        if (isCga) {
            try {
                let blob = yield (yield fetch(realUrl + '?' + Math.random())).blob();
                return (yield readApp(blob)) || null;
            }
            catch (_a) {
                return null;
            }
        }
        let config;
        let files = {};
        try {
            config = yield (yield fetch(realUrl + 'config.json?' + Math.random())).json();
            yield new Promise(function (resolve, reject) {
                let count = 0;
                for (let file of config.files) {
                    if (file.startsWith('/clickgo/')) {
                        ++count;
                        continue;
                    }
                    fetch(realUrl + file.slice(1) + '?' + Math.random()).then(function (res) {
                        return res.blob();
                    }).then(function (blob) {
                        files[file] = blob;
                        ++count;
                        if (count === config.files.length) {
                            resolve();
                        }
                    }).catch(function () {
                        reject();
                    });
                }
            });
        }
        catch (_b) {
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
