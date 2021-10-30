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
exports.fetchApp = exports.readApp = exports.fetchClickGoFile = exports.trigger = exports.globalEvents = exports.clickgoFiles = exports.getModule = exports.initModules = exports.regModule = exports.config = void 0;
let cgConfig = {
    'local': 'en-us',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
};
exports.config = Vue.reactive({
    'local': 'en-us',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
});
Vue.watch(exports.config, function () {
    for (let key in cgConfig) {
        if (exports.config[key] !== undefined) {
            continue;
        }
        clickgo.form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
            'type': 'warning'
        });
        exports.config[key] = cgConfig[key];
    }
    for (let key in exports.config) {
        if (!Object.keys(cgConfig).includes(key)) {
            clickgo.form.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system config.\nKey: ' + key,
                'type': 'warning'
            });
            delete (exports.config[key]);
            continue;
        }
        if (key === 'task.pin') {
            let paths = Object.keys(exports.config['task.pin']).sort().toString();
            let cgPaths = Object.keys(cgConfig['task.pin']).sort().toString();
            if (paths === cgPaths) {
                continue;
            }
            cgConfig['task.pin'] = {};
            for (let path in exports.config['task.pin']) {
                cgConfig['task.pin'][path] = exports.config['task.pin'][path];
            }
            trigger('configChanged', 'task.pin', exports.config['task.pin']);
        }
        else {
            if (exports.config[key] === cgConfig[key]) {
                continue;
            }
            cgConfig[key] = exports.config[key];
            if (key === 'task.position') {
                clickgo.form.refreshTaskPosition();
            }
            trigger('configChanged', key, exports.config[key]);
        }
    }
}, {
    'deep': true
});
let modules = {
    'monaco': {
        func: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(function (resolve, reject) {
                    loader.loadScript(clickgo.cdnPath + '/npm/monaco-editor@0.29.1/min/vs/loader.js').then(function () {
                        window.require.config({
                            paths: {
                                'vs': clickgo.cdnPath + '/npm/monaco-editor@0.29.1/min/vs'
                            }
                        });
                        let proxy = URL.createObjectURL(new Blob([`
                        self.MonacoEnvironment = {
                            baseUrl: '${clickgo.cdnPath}/npm/monaco-editor@0.29.1/min/'
                        };
                        importScripts('${clickgo.cdnPath}/npm/monaco-editor@0.29.1/min/vs/base/worker/workerMain.js');
                    `], { type: 'text/javascript' }));
                        window.MonacoEnvironment = {
                            getWorkerUrl: () => proxy
                        };
                        window.require(['vs/editor/editor.main'], function (monaco) {
                            resolve(monaco);
                        });
                    }).catch(function () {
                        reject();
                    });
                });
            });
        },
        'obj': null,
        'loading': false
    }
};
function regModule(name, func) {
    if (modules[name]) {
        return false;
    }
    modules[name] = {
        func: func,
        'obj': null,
        'loading': false
    };
    return true;
}
exports.regModule = regModule;
function initModules(names) {
    return new Promise(function (resolve) {
        if (typeof names === 'string') {
            names = [names];
        }
        if (names.length === 0) {
            resolve(0);
            return;
        }
        let loaded = 0;
        let successful = 0;
        for (let name of names) {
            if (!modules[name]) {
                ++loaded;
                if (loaded === names.length) {
                    resolve(successful);
                    return;
                }
                continue;
            }
            if (modules[name].obj) {
                ++loaded;
                ++successful;
                if (loaded === names.length) {
                    resolve(successful);
                    return;
                }
                continue;
            }
            if (modules[name].loading) {
                ++loaded;
                if (loaded === names.length) {
                    resolve(successful);
                    return;
                }
                continue;
            }
            modules[name].loading = true;
            let rtn = modules[name].func();
            if (rtn instanceof Promise) {
                rtn.then(function (obj) {
                    modules[name].obj = obj;
                    modules[name].loading = false;
                    ++loaded;
                    ++successful;
                    if (loaded === names.length) {
                        resolve(successful);
                        return;
                    }
                }).catch(function () {
                    modules[name].loading = false;
                    ++loaded;
                    if (loaded === names.length) {
                        resolve(successful);
                    }
                });
            }
            else {
                modules[name].obj = rtn;
                modules[name].loading = false;
                ++loaded;
                ++successful;
                if (loaded === names.length) {
                    resolve(successful);
                }
            }
        }
    });
}
exports.initModules = initModules;
function getModule(name) {
    if (!modules[name]) {
        return null;
    }
    return modules[name].obj;
}
exports.getModule = getModule;
exports.clickgoFiles = {};
exports.globalEvents = {
    errorHandler: null,
    screenResizeHandler: function () {
        clickgo.form.refreshMaxPosition();
    },
    configChangedHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: function (taskId, formId) {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        delete (clickgo.form.simpletaskRoot.forms[formId]);
    },
    formTitleChangedHandler: function (taskId, formId, title) {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        clickgo.form.simpletaskRoot.forms[formId].title = title;
    },
    formIconChangedHandler: function (taskId, formId, icon) {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        clickgo.form.simpletaskRoot.forms[formId].icon = icon;
    },
    formStateMinChangedHandler: function (taskId, formId, state) {
        if (clickgo.form.taskInfo.taskId > 0) {
            return;
        }
        if (state) {
            let item = clickgo.form.get(formId);
            if (!item) {
                return;
            }
            clickgo.form.simpletaskRoot.forms[formId] = {
                'title': item.title,
                'icon': item.icon
            };
        }
        else {
            if (!clickgo.form.simpletaskRoot.forms[formId]) {
                return;
            }
            delete (clickgo.form.simpletaskRoot.forms[formId]);
        }
    },
    formStateMaxChangedHandler: null,
    formShowChangedHandler: null,
    formFocusedHandler: null,
    formBlurredHandler: null,
    formFlashHandler: null,
    taskStartedHandler: null,
    taskEndedHandler: null
};
function trigger(name, taskId = 0, formId = 0, param1 = '', param2 = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
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
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            (_g = exports.globalEvents.configChangedHandler) === null || _g === void 0 ? void 0 : _g.call(exports.globalEvents, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_j = (_h = task.forms[fid].events)[name]) === null || _j === void 0 ? void 0 : _j.call(_h, taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (_l = (_k = exports.globalEvents)[name + 'Handler']) === null || _l === void 0 ? void 0 : _l.call(_k, taskId, formId, param1, param2);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_o = (_m = task.forms[fid].events)[name]) === null || _o === void 0 ? void 0 : _o.call(_m, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (_q = (_p = exports.globalEvents)[name + 'Handler']) === null || _q === void 0 ? void 0 : _q.call(_p, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_s = (_r = task.forms[fid].events)[name]) === null || _s === void 0 ? void 0 : _s.call(_r, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (_u = (_t = exports.globalEvents)[name + 'Handler']) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_w = (_v = task.forms[fid].events)[name]) === null || _w === void 0 ? void 0 : _w.call(_v, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (_y = (_x = exports.globalEvents)[name + 'Handler']) === null || _y === void 0 ? void 0 : _y.call(_x, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_0 = (_z = task.forms[fid].events)[name]) === null || _0 === void 0 ? void 0 : _0.call(_z, taskId, formId);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (_2 = (_1 = exports.globalEvents)[name + 'Handler']) === null || _2 === void 0 ? void 0 : _2.call(_1, taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    (_4 = (_3 = task.forms[fid].events)[name]) === null || _4 === void 0 ? void 0 : _4.call(_3, taskId);
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
function fetchApp(url, opt = {}) {
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
            if (opt.notifyId) {
                let blob = yield clickgo.tool.request(realUrl + '?' + Math.random(), {
                    progress: (loaded, total) => {
                        clickgo.form.notifyProgress(opt.notifyId, loaded / total);
                    }
                });
                if (blob === null) {
                    return null;
                }
                clickgo.form.notifyProgress(opt.notifyId, 1);
                return (yield readApp(blob)) || null;
            }
            else {
                try {
                    let blob = yield (yield fetch(realUrl + '?' + Math.random())).blob();
                    return (yield readApp(blob)) || null;
                }
                catch (_a) {
                    return null;
                }
            }
        }
        let config;
        let files = {};
        try {
            config = yield (yield fetch(realUrl + 'config.json?' + Math.random())).json();
            let random = Math.random().toString();
            let lopt = {
                'dir': '/',
                'before': realUrl.slice(0, -1),
                'after': '?' + random
            };
            if (opt.notifyId) {
                let total = config.files.length;
                let loaded = 0;
                lopt.loaded = function () {
                    ++loaded;
                    clickgo.form.notifyProgress(opt.notifyId, loaded / total);
                };
            }
            files = yield loader.fetchFiles(config.files, lopt);
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
