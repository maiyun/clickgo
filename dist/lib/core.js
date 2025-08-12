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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = exports.AbstractApp = exports.global = exports.config = void 0;
exports.getCdn = getCdn;
exports.regModule = regModule;
exports.getModule = getModule;
exports.trigger = trigger;
exports.readApp = readApp;
exports.fetchApp = fetchApp;
exports.getAvailArea = getAvailArea;
exports.hash = hash;
exports.getHash = getHash;
exports.getHost = getHost;
exports.location = location;
exports.getLocation = getLocation;
exports.back = back;
exports.open = open;
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
exports.global = window.clickgoGlobal ?? {};
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
    onKeydown() {
        return;
    }
    onKeyup() {
        return;
    }
}
exports.AbstractApp = AbstractApp;
function getCdn() {
    return loader.cdn;
}
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
        func: async function () {
            return new Promise(function (resolve, reject) {
                fetch(loader.cdn + '/npm/monaco-editor@0.50.0/min/vs/loader.js').then(function (r) {
                    return r.blob();
                }).then(function (b) {
                    return tool.blob2DataUrl(b);
                }).then(function (d) {
                    resolve(d);
                }).catch(function (e) {
                    reject(e);
                });
            });
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'xterm': {
        func: async function () {
            await loader.loadScripts([
                loader.cdn + '/npm/xterm@5.3.0/lib/xterm.js',
                loader.cdn + '/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js',
                loader.cdn + '/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js'
            ]);
            if (!window.Terminal) {
                throw Error('Xterm load failed.');
            }
            await loader.loadLinks([
                loader.cdn + '/npm/xterm@5.3.0/css/xterm.min.css'
            ]);
            loader.loadStyle('.xterm-viewport::-webkit-scrollbar{display:none;}');
            return [window.Terminal, window.FitAddon.FitAddon, window.WebglAddon.WebglAddon];
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'echarts': {
        func: async function () {
            await loader.loadScript(loader.cdn + '/npm/echarts@5.4.2/dist/echarts.min.js');
            if (!window.echarts) {
                throw Error('Echarts load failed.');
            }
            return window.echarts;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'tuieditor': {
        func: async function () {
            await loader.loadScripts([
                __dirname + '/../ext/toastui-editor-all.min.js'
            ]);
            if (!window.toastui.Editor) {
                throw Error('Tuieditor load failed.');
            }
            await loader.loadScripts([
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
            await loader.loadLinks([
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/theme/toastui-editor-dark.css'
            ]);
            loader.loadStyle('.toastui-editor-defaultUI-toolbar,.ProseMirror{box-sizing:initial !important}.toastui-editor-main{background:var(--g-plain-background);border-radius:0 0 3px 3px}.ProseMirror{cursor:text}.jodit ::-webkit-scrollbar{width:6px;cursor:default;}.jodit ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px;}.jodit ::-webkit-scrollbar-thumb:hover{background: rgba(0,0,0,.2);}');
            return window.toastui.Editor;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'jodit': {
        func: async function () {
            await loader.loadScripts([
                loader.cdn + '/npm/jodit@4.2.27/es2015/jodit.fat.min.js'
            ]);
            await loader.loadLinks([
                loader.cdn + '/npm/jodit@4.2.27/es2015/jodit.fat.min.css'
            ]);
            loader.loadStyle('.jodit-container:not(.jodit_inline){border:none;display:flex;flex-direction:column;}.jodit-container:not(.jodit_inline) .jodit-workplace{cursor:text;flex:1;}.jodit-wysiwyg a{color:unset;}');
            return window.Jodit;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'compressorjs': {
        func: async function () {
            await loader.loadScripts([
                loader.cdn + '/npm/compressorjs@1.2.1/dist/compressor.min.js'
            ]);
            if (!window.Compressor) {
                throw Error('Compressor load failed.');
            }
            return [window.Compressor];
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'pdfjs': {
        func: async function () {
            await loader.loadScripts([
                loader.cdn + '/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs'
            ], {
                'module': true
            });
            if (!window.pdfjsLib) {
                throw Error('pdf.js load failed.');
            }
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = loader.cdn + '/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';
            return window.pdfjsLib;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'qrcode': {
        func: async function () {
            await loader.loadScripts([
                loader.cdn + '/npm/qrcode@1.5.1/build/qrcode.js'
            ]);
            if (!window.QRCode) {
                throw Error('QRCode load failed.');
            }
            return window.QRCode;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'mpegts': {
        func: async function () {
            await loader.loadScripts([
                loader.cdn + '/npm/mpegts.js@1.7.3/dist/mpegts.min.js'
            ]);
            if (!window.mpegts) {
                throw Error('mpegts load failed.');
            }
            window.mpegts.LoggingControl.enableAll = false;
            return window.mpegts;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'tplink': {
        func: async function () {
            await loader.loadScripts([
                __dirname + '/../ext/tplinkhd.min.js'
            ]);
            if (!window.HDPluginControl) {
                throw Error('Tplink load failed.');
            }
            return window.HDPluginControl;
        },
        'obj': null,
        'loading': false,
        'resolve': [],
    },
    'tcc': {
        func: async function () {
            await loader.loadScripts([
                'https://turing.captcha.qcloud.com/TJCaptcha.js'
            ]);
            if (!window.TencentCaptcha) {
                throw Error('tcc load failed.');
            }
            return window.TencentCaptcha;
        },
        'obj': null,
        'loading': false,
        'resolve': [],
    },
    'cft': {
        func: async function () {
            await loader.loadScripts([
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
            ]);
            if (!window.turnstile) {
                throw Error('cft load failed.');
            }
            return window.turnstile;
        },
        'obj': null,
        'loading': false,
        'resolve': [],
    },
    'novnc': {
        func: async function () {
            console.log('alpha, not use');
            try {
                console.log('xxx2');
                const novnc = await Promise.resolve(`${loader.cdn + '/npm/@novnc/novnc@1.6.0/+esm'}`).then(s => __importStar(require(s)));
                console.log('xxx', novnc);
                return novnc.default.default;
            }
            catch (e) {
                console.log('xxx222', e);
                throw Error('novnc load failed.');
            }
        },
        'obj': null,
        'loading': false,
        'resolve': [],
    },
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
function getModule(name) {
    return new Promise((resolve) => {
        if (!modules[name]) {
            resolve(null);
            return;
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
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
            exports.boot?.[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResize();
            exports.boot?.[eventName]();
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName]();
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.();
                }
            }
            break;
        }
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            exports.boot?.[eventName]();
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            globalEvents[name]?.(taskId, formId, param1, param2, param3);
            exports.boot?.[eventName](taskId, formId, param1, param2, param3);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId, param1, param2, param3);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2, param3);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            globalEvents[name]?.(taskId, formId, param1);
            exports.boot?.[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            globalEvents[name]?.(taskId, formId, param1);
            exports.boot?.[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            globalEvents[name]?.(taskId, formId);
            exports.boot?.[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'formShowInSystemTaskChange': {
            globalEvents[name]?.(taskId, formId, param1);
            exports.boot?.[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                }
            }
            break;
        }
        case 'formHashChange': {
            globalEvents[name]?.(taskId, formId, param1, param2);
            exports.boot?.[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            globalEvents[name]?.(taskId, formId);
            exports.boot?.[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            if (typeof formId !== 'string') {
                break;
            }
            if (typeof taskId !== 'string') {
                break;
            }
            exports.boot?.[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'hashChanged': {
            if (typeof taskId !== 'string') {
                break;
            }
            exports.boot?.[eventName](taskId);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
        case 'keydown':
        case 'keyup': {
            globalEvents[name]?.(taskId);
            exports.boot?.[eventName](taskId);
            for (const tid in task.list) {
                const t = task.list[tid];
                t.class?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
    }
}
async function readApp(blob) {
    const head = await tool.blob2Text(blob.slice(0, 5));
    if (head !== '-CGA-') {
        return false;
    }
    const iconLength = parseInt(await blob.slice(21, 28).text());
    if (Number.isNaN(iconLength)) {
        return false;
    }
    const icon = iconLength ? await tool.blob2DataUrl(blob.slice(28, 28 + iconLength)) : '';
    const nb = new Blob([blob.slice(5, 21), blob.slice(28 + iconLength)], {
        'type': blob.type
    });
    const z = await zip.get(nb);
    if (!z) {
        return false;
    }
    const files = {};
    const configContent = await z.getContent('/config.json');
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
            const fab = await z.getContent(file.path + file.name, 'string');
            if (!fab) {
                continue;
            }
            files[file.path + file.name] = fab.replace(/^\ufeff/, '');
        }
        else {
            const fab = await z.getContent(file.path + file.name, 'arraybuffer');
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
}
async function fetchApp(url, opt = {}, taskId) {
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
            const blob = await fs.getContent(url, {
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
            return await readApp(blob) || null;
        }
        catch {
            return null;
        }
    }
    let config;
    const files = {};
    try {
        const blob = await fs.getContent(url + 'config.json', {
            'cache': opt.cache
        }, taskId);
        if (blob === null || typeof blob === 'string') {
            return null;
        }
        config = JSON.parse(await tool.blob2Text(blob));
        await new Promise(function (resolve) {
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
                }, taskId).then(async function (blob) {
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
                        files[file] = (await tool.blob2Text(blob)).replace(/^\ufeff/, '');
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
        icon = await tool.blob2DataUrl(files[config.icon]);
    }
    if (icon === '') {
        const iconBlob = await fs.getContent('/clickgo/icon.png', undefined, taskId);
        if (iconBlob instanceof Blob) {
            icon = await tool.blob2DataUrl(iconBlob);
        }
    }
    return {
        'type': 'app',
        'config': config,
        'files': files,
        'icon': icon
    };
}
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
function getHash() {
    return window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
}
function getHost() {
    const match = /https?:\/\/([-a-zA-Z0-9:.]+)/.exec(window.location.href);
    if (!match) {
        return '';
    }
    return match[1];
}
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
function getLocation() {
    return window.location.href;
}
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
function open(url) {
    window.open(url);
}
window.addEventListener('hashchange', function () {
    trigger('hashChanged', window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '');
});
