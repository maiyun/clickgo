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
exports.getAvailArea = exports.fetchApp = exports.readApp = exports.trigger = exports.getModule = exports.regModule = exports.boot = exports.getCdn = exports.AbstractApp = exports.config = void 0;
const clickgo = require("../clickgo");
const fs = require("./fs");
const form = require("./form");
const task = require("./task");
const tool = require("./tool");
const control = require("./control");
const theme = require("./theme");
const zip = require("./zip");
const dom = require("./dom");
const configOrigin = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': []
};
exports.config = clickgo.vue.reactive({
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': []
});
class AbstractApp {
    get filename() {
        return '';
    }
    get taskId() {
        return 0;
    }
    set taskId(v) {
        form.notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "taskId" to "${v}".\nPath: ${this.filename}`,
            'type': 'danger'
        });
    }
    config(config) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const t = task.list[this.taskId];
            if (!t) {
                return false;
            }
            t.config = config;
            if (t.app.net) {
                if (!t.config.files) {
                    return false;
                }
                const files = t.config.files;
                const net = t.app.net;
                yield new Promise(function (resolve) {
                    var _a, _b;
                    let loaded = 0;
                    const total = files.length;
                    const beforeTotal = Object.keys(t.app.files).length;
                    (_a = net.progress) === null || _a === void 0 ? void 0 : _a.call(net, loaded + beforeTotal, total + beforeTotal);
                    for (const file of files) {
                        if (t.app.files[file]) {
                            ++loaded;
                            (_b = net.progress) === null || _b === void 0 ? void 0 : _b.call(net, loaded + beforeTotal, total + beforeTotal);
                            if (net.notify) {
                                form.notifyProgress(net.notify, (loaded / total) / 2 + 0.5);
                            }
                            if (loaded < total) {
                                continue;
                            }
                            resolve();
                            return;
                        }
                        fs.getContent(net.url + file.slice(1), {
                            'current': net.current
                        }).then(function (blob) {
                            var _a;
                            return __awaiter(this, void 0, void 0, function* () {
                                if (blob === null || typeof blob === 'string') {
                                    clickgo.form.notify({
                                        'title': 'File not found',
                                        'content': net.url + file.slice(1),
                                        'type': 'danger'
                                    });
                                    return;
                                }
                                const mime = tool.getMimeByPath(file);
                                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                                    t.app.files[file] = (yield tool.blob2Text(blob)).replace(/^\ufeff/, '');
                                }
                                else {
                                    t.app.files[file] = blob;
                                }
                                ++loaded;
                                (_a = net.progress) === null || _a === void 0 ? void 0 : _a.call(net, loaded + beforeTotal, total + beforeTotal);
                                if (net.notify) {
                                    form.notifyProgress(net.notify, (loaded / total) / 2 + 0.5);
                                }
                                if (loaded < total) {
                                    return;
                                }
                                resolve();
                            });
                        }).catch(function () {
                            var _a;
                            ++loaded;
                            (_a = net.progress) === null || _a === void 0 ? void 0 : _a.call(net, loaded + beforeTotal, total + beforeTotal);
                            if (net.notify) {
                                form.notifyProgress(net.notify, (loaded / total) / 2 + 0.5);
                            }
                            if (loaded < total) {
                                return;
                            }
                            resolve();
                        });
                    }
                });
                if (net.notify) {
                    setTimeout(function () {
                        form.hideNotify(net.notify);
                    }, 2000);
                }
            }
            if (!(yield control.init(this.taskId))) {
                return false;
            }
            if ((_a = config.themes) === null || _a === void 0 ? void 0 : _a.length) {
                for (let path of config.themes) {
                    path += '.cgt';
                    path = tool.urlResolve('/', path);
                    const file = yield fs.getContent(path, {
                        'files': t.app.files,
                        'current': t.current
                    });
                    if (file && typeof file !== 'string') {
                        const th = yield theme.read(file);
                        if (th) {
                            yield theme.load(th, t.id);
                        }
                    }
                }
            }
            else {
                if (theme.global) {
                    yield theme.load(undefined, this.taskId);
                }
            }
            if (config.locales) {
                for (let path in config.locales) {
                    const locale = config.locales[path];
                    if (!path.endsWith('.json')) {
                        path += '.json';
                    }
                    const lcontent = yield fs.getContent(path, {
                        'encoding': 'utf8',
                        'files': t.app.files,
                        'current': t.current
                    });
                    if (!lcontent) {
                        continue;
                    }
                    try {
                        const data = JSON.parse(lcontent);
                        task.loadLocaleData(locale, data, '', t.id);
                    }
                    catch (_b) {
                    }
                }
            }
            if (config.style) {
                const style = yield fs.getContent(config.style + '.css', {
                    'encoding': 'utf8',
                    'files': t.app.files,
                    'current': t.current
                });
                if (style) {
                    const r = tool.stylePrepend(style, 'cg-task' + this.taskId.toString() + '_');
                    dom.pushStyle(this.taskId, yield tool.styleUrl2DataUrl(config.style, r.style, t.app.files));
                }
            }
            if (config.icon) {
                const icon = yield fs.getContent(config.icon, {
                    'files': t.app.files,
                    'current': t.current
                });
                if (icon && typeof icon !== 'string') {
                    t.app.icon = yield tool.blob2DataUrl(icon);
                }
            }
            t.class = this;
            return true;
        });
    }
    run(form) {
        if (typeof form === 'number') {
            const msg = 'Application run error, Form creation failed (' + form.toString() + ').';
            trigger('error', this.taskId, 0, new Error(msg), msg);
            return;
        }
        form.show();
    }
    onError() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
}
exports.AbstractApp = AbstractApp;
function getCdn() {
    return loader.cdn;
}
exports.getCdn = getCdn;
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
                    fetch(loader.cdn + '/npm/monaco-editor@0.34.1/min/vs/loader.js').then(function (r) {
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
        'loading': false,
        'resolve': []
    }
};
function regModule(name, func) {
    if (modules[name]) {
        return false;
    }
    modules[name] = {
        func: func,
        'obj': null,
        'loading': false,
        'resolve': []
    };
    return true;
}
exports.regModule = regModule;
function getModule(name) {
    return new Promise((resolve) => {
        if (!modules[name]) {
            return null;
        }
        if (!modules[name].obj) {
            if (modules[name].loading) {
                modules[name].resolve.push(() => {
                    resolve(modules[name].obj);
                });
            }
            else {
                const rtn = modules[name].func();
                if (rtn instanceof Promise) {
                    modules[name].loading = true;
                    rtn.then(function (obj) {
                        modules[name].obj = obj;
                        modules[name].loading = false;
                        resolve(obj);
                        for (const r of modules[name].resolve) {
                            r();
                        }
                    }).catch(function () {
                        modules[name].loading = false;
                        resolve(null);
                        for (const r of modules[name].resolve) {
                            r();
                        }
                    });
                }
                else {
                    modules[name].obj = rtn;
                    resolve(rtn);
                }
            }
            return;
        }
        resolve(modules[name].obj);
        return;
    });
}
exports.getModule = getModule;
const globalEvents = {
    screenResize: function () {
        form.refreshMaxPosition();
    },
    formRemoved: function (taskId, formId) {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete form.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChanged: function (taskId, formId, title) {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChanged: function (taskId, formId, icon) {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChanged: function (taskId, formId, state) {
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
    }
};
function trigger(name, taskId = 0, formId = 0, param1 = '', param2 = '') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
            exports.boot[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_a = t.class) === null || _a === void 0 ? void 0 : _a[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    (_c = (_b = t.forms[fid].vroot)[eventName]) === null || _c === void 0 ? void 0 : _c.call(_b, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResize();
            exports.boot[eventName]();
            for (const tid in task.list) {
                const t = task.list[tid];
                (_d = t.class) === null || _d === void 0 ? void 0 : _d[eventName]();
                for (const fid in t.forms) {
                    (_f = (_e = t.forms[fid].vroot)[eventName]) === null || _f === void 0 ? void 0 : _f.call(_e);
                }
            }
            break;
        }
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            exports.boot[eventName]();
            for (const tid in task.list) {
                const t = task.list[tid];
                (_g = t.class) === null || _g === void 0 ? void 0 : _g[eventName](taskId, formId);
                for (const fid in t.forms) {
                    (_j = (_h = t.forms[fid].vroot)[eventName]) === null || _j === void 0 ? void 0 : _j.call(_h, taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (_l = (_k = globalEvents)[name]) === null || _l === void 0 ? void 0 : _l.call(_k, taskId, formId, param1, param2);
            exports.boot[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_m = t.class) === null || _m === void 0 ? void 0 : _m[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    (_p = (_o = t.forms[fid].vroot)[eventName]) === null || _p === void 0 ? void 0 : _p.call(_o, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (_r = (_q = globalEvents)[name]) === null || _r === void 0 ? void 0 : _r.call(_q, taskId, formId, param1);
            exports.boot[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_s = t.class) === null || _s === void 0 ? void 0 : _s[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    (_u = (_t = t.forms[fid].vroot)[eventName]) === null || _u === void 0 ? void 0 : _u.call(_t, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (_w = (_v = globalEvents)[name]) === null || _w === void 0 ? void 0 : _w.call(_v, taskId, formId, param1);
            exports.boot[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_x = t.class) === null || _x === void 0 ? void 0 : _x[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    (_z = (_y = t.forms[fid].vroot)[eventName]) === null || _z === void 0 ? void 0 : _z.call(_y, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (_1 = (_0 = globalEvents)[name]) === null || _1 === void 0 ? void 0 : _1.call(_0, taskId, formId);
            exports.boot[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_2 = t.class) === null || _2 === void 0 ? void 0 : _2[eventName](taskId, formId);
                for (const fid in t.forms) {
                    (_4 = (_3 = t.forms[fid].vroot)[eventName]) === null || _4 === void 0 ? void 0 : _4.call(_3, taskId, formId);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (_6 = (_5 = globalEvents)[name]) === null || _6 === void 0 ? void 0 : _6.call(_5, taskId, formId);
            exports.boot[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_7 = t.class) === null || _7 === void 0 ? void 0 : _7[eventName](taskId);
                for (const fid in t.forms) {
                    (_9 = (_8 = t.forms[fid].vroot)[eventName]) === null || _9 === void 0 ? void 0 : _9.call(_8, taskId);
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            if (typeof formId !== 'string') {
                break;
            }
            if (typeof taskId === 'number') {
                taskId = taskId.toString();
            }
            exports.boot[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_10 = t.class) === null || _10 === void 0 ? void 0 : _10[eventName](taskId, formId);
                for (const fid in t.forms) {
                    (_12 = (_11 = t.forms[fid].vroot)[eventName]) === null || _12 === void 0 ? void 0 : _12.call(_11, taskId, formId);
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
        const list = z.readDir('/', {
            'hasChildren': true
        });
        for (const file of list) {
            const mime = tool.getMimeByPath(file.name);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                const fab = yield z.getContent(file.path + file.name, 'string');
                if (!fab) {
                    continue;
                }
                files[file.path + file.name] = fab.replace(/^\ufeff/, '');
            }
            else {
                const fab = yield z.getContent(file.path + file.name, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                files[file.path + file.name] = new Blob([fab], {
                    'type': mime.mime
                });
            }
        }
        return {
            'icon': icon,
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
            current = opt.current.endsWith('/') ? opt.current.slice(0, -1) : opt.current;
            url = tool.urlResolve('/current/', url);
        }
        else {
            if (!url.startsWith('/clickgo/') && !url.startsWith('/storage/') && !url.startsWith('/mounted/')) {
                current = tool.urlResolve(window.location.href, url);
                if (cga) {
                    current = current.slice(0, -cga.length - 1);
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
        let loaded = 0;
        let total = 30;
        const files = yield loader.sniffFiles(url + 'app.js', {
            'dir': '/',
            adapter: (url) => __awaiter(this, void 0, void 0, function* () {
                const r = yield fs.getContent(url, {
                    'encoding': 'utf8',
                    'current': current
                });
                return r;
            }),
            'loaded': () => {
                ++loaded;
                if (loaded === total) {
                    ++total;
                }
                if (opt.notifyId) {
                    form.notifyProgress(opt.notifyId, (loaded / total) / 2);
                }
                if (opt.progress) {
                    opt.progress(loaded, total);
                }
            }
        });
        if (opt.notifyId) {
            form.notifyProgress(opt.notifyId, 0.5);
        }
        if (Object.keys(files).length === 0) {
            return null;
        }
        const ul = url.length - 1;
        for (const fn in files) {
            files[fn.slice(ul)] = files[fn];
            delete files[fn];
        }
        return {
            'net': {
                'current': current,
                'notify': opt.notifyId,
                'url': url,
                'progress': opt.progress
            },
            'icon': '',
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
            'width': window.innerWidth,
            'height': window.innerHeight - 46
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
                width = window.innerWidth - task.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'right': {
                left = 0;
                top = 0;
                width = window.innerWidth - task.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'top': {
                left = 0;
                top = task.systemTaskInfo.length;
                width = window.innerWidth;
                height = window.innerHeight - task.systemTaskInfo.length;
                break;
            }
            case 'bottom': {
                left = 0;
                top = 0;
                width = window.innerWidth;
                height = window.innerHeight - task.systemTaskInfo.length;
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
