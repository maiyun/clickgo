"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.open = exports.back = exports.getLocation = exports.location = exports.getHost = exports.getHash = exports.hash = exports.getAvailArea = exports.fetchApp = exports.readApp = exports.trigger = exports.getModule = exports.regModule = exports.boot = exports.getCdn = exports.AbstractApp = exports.global = exports.config = void 0;
const clickgo = __importStar(require("../clickgo"));
const fs = __importStar(require("./fs"));
const form = __importStar(require("./form"));
const task = __importStar(require("./task"));
const tool = __importStar(require("./tool"));
const zip = __importStar(require("./zip"));
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
exports.global = (_a = window.clickgoGlobal) !== null && _a !== void 0 ? _a : {};
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
    run(form) {
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
    onFormShowInSystemTaskChange() {
        return;
    }
    onFormHashChange() {
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
    onHashChanged() {
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
                    fetch(loader.cdn + '/npm/monaco-editor@0.46.0/min/vs/loader.js').then(function (r) {
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
    },
    'xterm': {
        func: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loader.loadScripts([
                    loader.cdn + '/npm/xterm@5.3.0/lib/xterm.js',
                    loader.cdn + '/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js',
                    loader.cdn + '/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js'
                ]);
                if (!window.Terminal) {
                    throw Error('Xterm load failed.');
                }
                yield loader.loadLinks([
                    loader.cdn + '/npm/xterm@5.3.0/css/xterm.min.css'
                ]);
                loader.loadStyle('.xterm-viewport::-webkit-scrollbar{display:none;}');
                return [window.Terminal, window.FitAddon.FitAddon, window.WebglAddon.WebglAddon];
            });
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'echarts': {
        func: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loader.loadScript(loader.cdn + '/npm/echarts@5.4.2/dist/echarts.min.js');
                if (!window.echarts) {
                    throw Error('Xterm load failed.');
                }
                return window.echarts;
            });
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'tuieditor': {
        func: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield loader.loadScripts([
                    __dirname + '/../ext/toastui-editor-all.min.js'
                ]);
                if (!window.toastui.Editor) {
                    throw Error('Tuieditor load failed.');
                }
                yield loader.loadScripts([
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-cn.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-tw.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/ja-jp.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/ko-kr.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/es-es.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/de-de.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/fr-fr.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/pt-br.min.js',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/ru-ru.min.js'
                ]);
                yield loader.loadLinks([
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css',
                    loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/theme/toastui-editor-dark.css'
                ]);
                loader.loadStyle('.toastui-editor-defaultUI-toolbar,.ProseMirror{box-sizing:initial !important}.toastui-editor-main{background:var(--g-plain-background);border-radius:0 0 3px 3px}.ProseMirror{cursor:text}');
                return window.toastui.Editor;
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
function trigger(name, taskId = 0, formId = 0, param1 = '', param2 = '', param3 = true) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId, param1, param2);
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
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName]();
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
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName]();
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
            (_l = (_k = globalEvents)[name]) === null || _l === void 0 ? void 0 : _l.call(_k, taskId, formId, param1, param2, param3);
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId, param1, param2, param3);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_m = t.class) === null || _m === void 0 ? void 0 : _m[eventName](taskId, formId, param1, param2, param3);
                for (const fid in t.forms) {
                    (_p = (_o = t.forms[fid].vroot)[eventName]) === null || _p === void 0 ? void 0 : _p.call(_o, taskId, formId, param1, param2, param3);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (_r = (_q = globalEvents)[name]) === null || _r === void 0 ? void 0 : _r.call(_q, taskId, formId, param1);
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId, param1);
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
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId, param1);
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
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_2 = t.class) === null || _2 === void 0 ? void 0 : _2[eventName](taskId, formId);
                for (const fid in t.forms) {
                    (_4 = (_3 = t.forms[fid].vroot)[eventName]) === null || _4 === void 0 ? void 0 : _4.call(_3, taskId, formId);
                }
            }
            break;
        }
        case 'formShowInSystemTaskChange': {
            (_6 = (_5 = globalEvents)[name]) === null || _6 === void 0 ? void 0 : _6.call(_5, taskId, formId, param1);
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_7 = t.class) === null || _7 === void 0 ? void 0 : _7[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    (_9 = (_8 = t.forms[fid].vroot)[eventName]) === null || _9 === void 0 ? void 0 : _9.call(_8, taskId, formId, param1);
                }
            }
            break;
        }
        case 'formHashChange': {
            (_11 = (_10 = globalEvents)[name]) === null || _11 === void 0 ? void 0 : _11.call(_10, taskId, formId, param1, param2);
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_12 = t.class) === null || _12 === void 0 ? void 0 : _12[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    (_14 = (_13 = t.forms[fid].vroot)[eventName]) === null || _14 === void 0 ? void 0 : _14.call(_13, taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (_16 = (_15 = globalEvents)[name]) === null || _16 === void 0 ? void 0 : _16.call(_15, taskId, formId);
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_17 = t.class) === null || _17 === void 0 ? void 0 : _17[eventName](taskId);
                for (const fid in t.forms) {
                    (_19 = (_18 = t.forms[fid].vroot)[eventName]) === null || _19 === void 0 ? void 0 : _19.call(_18, taskId);
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            if (typeof formId !== 'string') {
                break;
            }
            if (typeof taskId !== 'string') {
                taskId = taskId.toString();
            }
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_20 = t.class) === null || _20 === void 0 ? void 0 : _20[eventName](taskId, formId);
                for (const fid in t.forms) {
                    (_22 = (_21 = t.forms[fid].vroot)[eventName]) === null || _22 === void 0 ? void 0 : _22.call(_21, taskId, formId);
                }
            }
            break;
        }
        case 'hashChanged': {
            if (typeof taskId !== 'string') {
                break;
            }
            exports.boot === null || exports.boot === void 0 ? void 0 : exports.boot[eventName](taskId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (_23 = t.class) === null || _23 === void 0 ? void 0 : _23[eventName](taskId);
                for (const fid in t.forms) {
                    (_25 = (_24 = t.forms[fid].vroot)[eventName]) === null || _25 === void 0 ? void 0 : _25.call(_24, taskId);
                }
            }
            break;
        }
    }
}
exports.trigger = trigger;
function readApp(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        const head = yield tool.blob2Text(blob.slice(0, 5));
        if (head !== '-CGA-') {
            return false;
        }
        const iconLength = parseInt(yield blob.slice(21, 28).text());
        if (Number.isNaN(iconLength)) {
            return false;
        }
        const icon = iconLength ? yield tool.blob2DataUrl(blob.slice(28, 28 + iconLength)) : '';
        const nb = new Blob([blob.slice(5, 21), blob.slice(28 + iconLength)], {
            'type': blob.type
        });
        const z = yield zip.get(nb);
        if (!z) {
            return false;
        }
        const files = {};
        const configContent = yield z.getContent('/config.json');
        if (!configContent) {
            return false;
        }
        const config = JSON.parse(configContent);
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
            'type': 'app',
            'config': config,
            'files': files,
            'icon': icon
        };
    });
}
exports.readApp = readApp;
function fetchApp(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, opt = {}, taskId) {
        let cga = '';
        if (!url.endsWith('/')) {
            const lio = url.lastIndexOf('/');
            cga = lio === -1 ? url : url.slice(lio + 1);
            if (!cga.endsWith('.cga')) {
                return null;
            }
        }
        if (!taskId &&
            !url.startsWith('/clickgo/') &&
            !url.startsWith('/storage/') &&
            !url.startsWith('/mounted/') &&
            !url.startsWith('/package/') &&
            !url.startsWith('/current/') &&
            !url.startsWith('http:') &&
            !url.startsWith('https:') &&
            !url.startsWith('file:')) {
            url = tool.urlResolve(window.location.href, url);
        }
        if (cga) {
            try {
                const blob = yield fs.getContent(url, {
                    'progress': (loaded, total) => {
                        if (opt.notifyId) {
                            form.notifyProgress(opt.notifyId, loaded / total);
                        }
                        if (opt.progress) {
                            opt.progress(loaded, total);
                        }
                    },
                    'cache': opt.cache
                }, taskId);
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
                'cache': opt.cache
            }, taskId);
            if (blob === null || typeof blob === 'string') {
                return null;
            }
            config = JSON.parse(yield tool.blob2Text(blob));
            yield new Promise(function (resolve) {
                if (!config.files) {
                    return;
                }
                const total = config.files.length;
                let loaded = 0;
                if (opt.progress) {
                    opt.progress(loaded + 1, total + 1);
                }
                for (const file of config.files) {
                    fs.getContent(url + file.slice(1), {
                        'cache': opt.cache
                    }, taskId).then(function (blob) {
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
                            if (opt.progress) {
                                opt.progress(loaded + 1, total + 1);
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
                        if (opt.progress) {
                            opt.progress(loaded + 1, total + 1);
                        }
                        if (loaded < total) {
                            return;
                        }
                        resolve();
                    });
                }
            });
        }
        catch (e) {
            console.log('core.fetchApp', e);
            trigger('error', 0, 0, e, e.message);
            return null;
        }
        let icon = '';
        if (config.icon && (files[config.icon] instanceof Blob)) {
            icon = yield tool.blob2DataUrl(files[config.icon]);
        }
        if (icon === '') {
            const iconBlob = yield fs.getContent('/clickgo/icon.png', undefined, taskId);
            if (iconBlob instanceof Blob) {
                icon = yield tool.blob2DataUrl(iconBlob);
            }
        }
        return {
            'type': 'app',
            'config': config,
            'files': files,
            'icon': icon
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
            'height': window.innerHeight - 46,
            'owidth': window.innerWidth,
            'oheight': window.innerHeight
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
            'height': height,
            'owidth': window.innerWidth,
            'oheight': window.innerHeight
        };
    }
}
exports.getAvailArea = getAvailArea;
function hash(hash, taskId) {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    if (!t.runtime.permissions.includes('root') && !t.runtime.permissions.includes('hash')) {
        return false;
    }
    window.location.hash = hash;
    return true;
}
exports.hash = hash;
function getHash() {
    return window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
}
exports.getHash = getHash;
function getHost() {
    const match = /https?:\/\/([-a-zA-Z0-9:.]+)/.exec(window.location.href);
    if (!match) {
        return '';
    }
    return match[1];
}
exports.getHost = getHost;
function location(url, taskId) {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    if (!t.runtime.permissions.includes('root') && !t.runtime.permissions.includes('location')) {
        return false;
    }
    window.location.href = url;
    return true;
}
exports.location = location;
function getLocation() {
    return window.location.href;
}
exports.getLocation = getLocation;
function back(taskId) {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    if (!t.runtime.permissions.includes('root') && !t.runtime.permissions.includes('location')) {
        return false;
    }
    window.history.back();
    return true;
}
exports.back = back;
function open(url) {
    window.open(url);
}
exports.open = open;
window.addEventListener('hashchange', function () {
    trigger('hashChanged', window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '');
});
