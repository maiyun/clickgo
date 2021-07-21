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
exports.fetchApp = exports.readApp = exports.fetchClickGoFile = exports.trigger = exports.globalEvents = exports.clickgoFiles = exports.config = void 0;
exports.config = Vue.reactive({
    'local': 'en-us'
});
exports.clickgoFiles = {};
exports.globalEvents = {
    errorHandler: null,
    screenResizeHandler: function () {
        clickgo.form.refreshMaxPosition();
    },
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    switch (name) {
        case 'error': {
            (_a = exports.globalEvents.errorHandler) === null || _a === void 0 ? void 0 : _a.call(exports.globalEvents, taskId, formId, param1, param2);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_c = (_b = task.forms[fid].events)[name]) === null || _c === void 0 ? void 0 : _c.call(_b, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'screenResize': {
            (_d = exports.globalEvents.screenResizeHandler) === null || _d === void 0 ? void 0 : _d.call(exports.globalEvents);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_f = (_e = task.forms[fid].events)[name]) === null || _f === void 0 ? void 0 : _f.call(_e);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (_h = (_g = exports.globalEvents)[name + 'Handler']) === null || _h === void 0 ? void 0 : _h.call(_g, taskId, formId, param1, param2);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_k = (_j = task.forms[fid].events)[name]) === null || _k === void 0 ? void 0 : _k.call(_j, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (_m = (_l = exports.globalEvents)[name + 'Handler']) === null || _m === void 0 ? void 0 : _m.call(_l, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_p = (_o = task.forms[fid].events)[name]) === null || _p === void 0 ? void 0 : _p.call(_o, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (_r = (_q = exports.globalEvents)[name + 'Handler']) === null || _r === void 0 ? void 0 : _r.call(_q, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_t = (_s = task.forms[fid].events)[name]) === null || _t === void 0 ? void 0 : _t.call(_s, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (_v = (_u = exports.globalEvents)[name + 'Handler']) === null || _v === void 0 ? void 0 : _v.call(_u, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_x = (_w = task.forms[fid].events)[name]) === null || _x === void 0 ? void 0 : _x.call(_w, taskId, formId);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (_z = (_y = exports.globalEvents)[name + 'Handler']) === null || _z === void 0 ? void 0 : _z.call(_y, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_1 = (_0 = task.forms[fid].events)[name]) === null || _1 === void 0 ? void 0 : _1.call(_0, taskId);
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
        let iconLength = parseInt(yield blob.slice(0, 7).text());
        let icon = yield clickgo.tool.blob2DataUrl(blob.slice(7, 7 + iconLength));
        let zip = yield clickgo.zip.get(blob.slice(7 + iconLength));
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
            let mime = clickgo.tool.getMimeByPath(file);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                let fab = yield zip.getContent(file, 'string');
                if (!fab) {
                    continue;
                }
                files[file] = fab;
            }
            else {
                let fab = yield zip.getContent(file, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                files[file] = new Blob([fab], {
                    'type': mime.mime
                });
            }
        }
        if (!config) {
            return false;
        }
        return {
            'type': 'app',
            'icon': icon,
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
        if (url.startsWith('/clickgo/')) {
            realUrl = clickgo.tool.urlResolve(clickgo.cgRootPath, url.slice(9));
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
            let random = Math.random().toString();
            files = yield loader.fetchFiles(config.files, {
                'dir': '/',
                'before': realUrl.slice(0, -1),
                'after': '?' + random
            });
        }
        catch (_b) {
            return null;
        }
        let icon = clickgo.cgRootPath + 'icon.png';
        if (config.icon && (files[config.icon] instanceof Blob)) {
            icon = yield clickgo.tool.blob2DataUrl(files[config.icon]);
        }
        return {
            'type': 'app',
            'icon': icon,
            'config': config,
            'files': files
        };
    });
}
exports.fetchApp = fetchApp;
