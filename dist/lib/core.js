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
exports.getAvailArea = exports.fetchApp = exports.readApp = exports.trigger = exports.removeSystemEventListener = exports.setSystemEventListener = exports.globalEvents = exports.getModule = exports.initModules = exports.regModule = exports.cdn = exports.config = void 0;
const clickgo = require("../clickgo");
const fs = require("./fs");
const form = require("./form");
const task = require("./task");
const tool = require("./tool");
const zip = require("./zip");
const configOrigin = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
};
exports.config = clickgo.vue.reactive({
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
});
exports.cdn = '';
clickgo.vue.watch(exports.config, function () {
    for (const key in configOrigin) {
        if (exports.config[key] !== undefined) {
            continue;
        }
        form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
            'type': 'warning'
        });
        exports.config[key] = configOrigin[key];
    }
    for (const key in exports.config) {
        if (!Object.keys(configOrigin).includes(key)) {
            form.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system config.\nKey: ' + key,
                'type': 'warning'
            });
            delete exports.config[key];
            continue;
        }
        if (key === 'task.pin') {
            const paths = Object.keys(exports.config['task.pin']).sort().toString();
            const originPaths = Object.keys(configOrigin['task.pin']).sort().toString();
            if (paths === originPaths) {
                continue;
            }
            configOrigin['task.pin'] = {};
            for (const path in exports.config['task.pin']) {
                configOrigin['task.pin'][path] = exports.config['task.pin'][path];
            }
            trigger('configChanged', 'task.pin', exports.config['task.pin']);
        }
        else {
            if (exports.config[key] === configOrigin[key]) {
                continue;
            }
            configOrigin[key] = exports.config[key];
            if (key === 'task.position') {
                task.refreshSystemPosition();
            }
            trigger('configChanged', key, exports.config[key]);
        }
    }
}, {
    'deep': true
});
const modules = {
    'monaco': {
        func: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(function (resolve, reject) {
                    fetch(loader.cdn + '/npm/monaco-editor@0.33.0/min/vs/loader.js').then(function (r) {
                        return r.blob();
                    }).then(function (b) {
                        return tool.blob2DataUrl(b);
                    }).then(function (d) {
                        resolve(d);
                    }).catch(function (e) {
                        reject(e);
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
        for (const name of names) {
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
            const rtn = modules[name].func();
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
exports.globalEvents = {
    errorHandler: null,
    screenResizeHandler: function () {
        form.refreshMaxPosition();
    },
    configChangedHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: function (taskId, formId) {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete form.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChangedHandler: function (taskId, formId, title) {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChangedHandler: function (taskId, formId, icon) {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChangedHandler: function (taskId, formId, state) {
        if (task.systemTaskInfo.taskId > 0) {
            return;
        }
        if (state) {
            const item = form.get(formId);
            if (!item) {
                return;
            }
            form.simpleSystemTaskRoot.forms[formId] = {
                'title': item.title,
                'icon': item.icon
            };
        }
        else {
            if (!form.simpleSystemTaskRoot.forms[formId]) {
                return;
            }
            delete form.simpleSystemTaskRoot.forms[formId];
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
function setSystemEventListener(name, func, formId, taskId) {
    if (!taskId) {
        return;
    }
    const t = task.list[taskId];
    if (!t) {
        return;
    }
    if (!formId) {
        return;
    }
    const f = t.forms[formId];
    if (!f) {
        return;
    }
    f.events[name] = func;
}
exports.setSystemEventListener = setSystemEventListener;
function removeSystemEventListener(name, formId, taskId) {
    if (!taskId) {
        return;
    }
    const t = task.list[taskId];
    if (!t) {
        return;
    }
    if (!formId) {
        return;
    }
    const f = t.forms[formId];
    if (!f) {
        return;
    }
    delete f.events[name];
}
exports.removeSystemEventListener = removeSystemEventListener;
function trigger(name, taskId = 0, formId = 0, param1 = '', param2 = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
            const r = (_a = exports.globalEvents.errorHandler) === null || _a === void 0 ? void 0 : _a.call(exports.globalEvents, taskId, formId, param1, param2);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_c = (_b = t.forms[fid].events)[name]) === null || _c === void 0 ? void 0 : _c.call(_b, taskId, formId, param1, param2);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'screenResize': {
            const r = (_d = exports.globalEvents.screenResizeHandler) === null || _d === void 0 ? void 0 : _d.call(exports.globalEvents);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_f = (_e = t.forms[fid].events)[name]) === null || _f === void 0 ? void 0 : _f.call(_e);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            const r = (_g = exports.globalEvents.configChangedHandler) === null || _g === void 0 ? void 0 : _g.call(exports.globalEvents, taskId, formId);
            if (r && (r instanceof Promise)) {
                r.catch(function (e) {
                    console.log(e);
                });
            }
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_j = (_h = t.forms[fid].events)[name]) === null || _j === void 0 ? void 0 : _j.call(_h, taskId, formId);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (_l = (_k = exports.globalEvents)[name + 'Handler']) === null || _l === void 0 ? void 0 : _l.call(_k, taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_o = (_m = t.forms[fid].events)[name]) === null || _o === void 0 ? void 0 : _o.call(_m, taskId, formId, param1, param2);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (_q = (_p = exports.globalEvents)[name + 'Handler']) === null || _q === void 0 ? void 0 : _q.call(_p, taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_s = (_r = t.forms[fid].events)[name]) === null || _s === void 0 ? void 0 : _s.call(_r, taskId, formId, param1);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (_u = (_t = exports.globalEvents)[name + 'Handler']) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_w = (_v = t.forms[fid].events)[name]) === null || _w === void 0 ? void 0 : _w.call(_v, taskId, formId, param1);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (_y = (_x = exports.globalEvents)[name + 'Handler']) === null || _y === void 0 ? void 0 : _y.call(_x, taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_0 = (_z = t.forms[fid].events)[name]) === null || _0 === void 0 ? void 0 : _0.call(_z, taskId, formId);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (_2 = (_1 = exports.globalEvents)[name + 'Handler']) === null || _2 === void 0 ? void 0 : _2.call(_1, taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = (_4 = (_3 = t.forms[fid].events)[name]) === null || _4 === void 0 ? void 0 : _4.call(_3, taskId);
                    if (r instanceof Promise) {
                        r.catch(function (e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
    }
}
exports.trigger = trigger;
function readApp(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        const iconLength = parseInt(yield blob.slice(0, 7).text());
        const icon = yield tool.blob2DataUrl(blob.slice(7, 7 + iconLength));
        const z = yield zip.get(blob.slice(7 + iconLength));
        if (!z) {
            return false;
        }
        const files = {};
        const configContent = yield z.getContent('/config.json');
        if (!configContent) {
            return false;
        }
        const config = JSON.parse(configContent);
        for (const file of config.files) {
            const mime = tool.getMimeByPath(file);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                const fab = yield z.getContent(file, 'string');
                if (!fab) {
                    continue;
                }
                files[file] = fab.replace(/^\ufeff/, '');
            }
            else {
                const fab = yield z.getContent(file, 'arraybuffer');
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
        let cga = '';
        if (!url.endsWith('/')) {
            const lio = url.lastIndexOf('/');
            cga = lio === -1 ? url : url.slice(lio + 1);
            if (!cga.endsWith('.cga')) {
                return null;
            }
        }
        let current = '';
        if (opt.current) {
            if (!opt.current.endsWith('/')) {
                return null;
            }
            if (!url.startsWith('/')) {
                url = '/current/' + url;
            }
        }
        else {
            if (!url.startsWith('/clickgo/') && !url.startsWith('/storage/') && !url.startsWith('/mounted/')) {
                current = tool.urlResolve(window.location.href, url);
                if (cga) {
                    current = current.slice(0, -cga.length);
                    url = '/current/' + cga;
                }
                else {
                    url = '/current/';
                }
            }
        }
        if (cga) {
            try {
                const blob = yield fs.getContent(url, {
                    'current': current,
                    'progress': (loaded, total) => {
                        if (opt.notifyId) {
                            form.notifyProgress(opt.notifyId, loaded / total);
                        }
                        if (opt.progress) {
                            opt.progress(loaded, total);
                        }
                    }
                });
                if ((blob === null) || typeof blob === 'string') {
                    return null;
                }
                if (opt.notifyId) {
                    form.notifyProgress(opt.notifyId, 1);
                }
                return (yield readApp(blob)) || null;
            }
            catch (_a) {
                return null;
            }
        }
        let config;
        const files = {};
        try {
            const blob = yield fs.getContent(url + 'config.json', {
                'current': current
            });
            if (blob === null || typeof blob === 'string') {
                return null;
            }
            config = JSON.parse(yield tool.blob2Text(blob));
            yield new Promise(function (resolve) {
                const total = config.files.length;
                let loaded = 0;
                for (const file of config.files) {
                    fs.getContent(url + file.slice(1), {
                        'current': current
                    }).then(function (blob) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (blob === null || typeof blob === 'string') {
                                clickgo.form.notify({
                                    'title': 'File not found',
                                    'content': url + file.slice(1),
                                    'type': 'danger'
                                });
                                return;
                            }
                            const mime = tool.getMimeByPath(file);
                            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                                files[file] = (yield tool.blob2Text(blob)).replace(/^\ufeff/, '');
                            }
                            else {
                                files[file] = blob;
                            }
                            ++loaded;
                            if (opt.notifyId) {
                                form.notifyProgress(opt.notifyId, loaded / total);
                            }
                            if (loaded < total) {
                                return;
                            }
                            resolve();
                        });
                    }).catch(function () {
                        ++loaded;
                        if (opt.notifyId) {
                            form.notifyProgress(opt.notifyId, loaded / total);
                        }
                        if (loaded < total) {
                            return;
                        }
                        resolve();
                    });
                }
            });
        }
        catch (_b) {
            return null;
        }
        let icon = '/clickgo/icon.png';
        if (config.icon && (files[config.icon] instanceof Blob)) {
            icon = yield tool.blob2DataUrl(files[config.icon]);
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
function getAvailArea() {
    if (Object.keys(form.simpleSystemTaskRoot.forms).length > 0) {
        return {
            'left': 0,
            'top': 0,
            'width': document.body.clientWidth,
            'height': document.body.clientHeight - 46
        };
    }
    else {
        let left = 0;
        let top = 0;
        let width = 0;
        let height = 0;
        switch (exports.config['task.position']) {
            case 'left': {
                left = task.systemTaskInfo.length;
                top = 0;
                width = document.body.clientWidth - task.systemTaskInfo.length;
                height = document.body.clientHeight;
                break;
            }
            case 'right': {
                left = 0;
                top = 0;
                width = document.body.clientWidth - task.systemTaskInfo.length;
                height = document.body.clientHeight;
                break;
            }
            case 'top': {
                left = 0;
                top = task.systemTaskInfo.length;
                width = document.body.clientWidth;
                height = document.body.clientHeight - task.systemTaskInfo.length;
                break;
            }
            case 'bottom': {
                left = 0;
                top = 0;
                width = document.body.clientWidth;
                height = document.body.clientHeight - task.systemTaskInfo.length;
            }
        }
        return {
            'left': left,
            'top': top,
            'width': width,
            'height': height
        };
    }
}
exports.getAvailArea = getAvailArea;
