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
exports.systemTaskInfo = exports.lastId = exports.list = void 0;
exports.setFocus = setFocus;
exports.getFocus = getFocus;
exports.onFrame = onFrame;
exports.offFrame = offFrame;
exports.get = get;
exports.getPermissions = getPermissions;
exports.getList = getList;
exports.run = run;
exports.checkPermission = checkPermission;
exports.end = end;
exports.loadLocaleData = loadLocaleData;
exports.loadLocale = loadLocale;
exports.clearLocale = clearLocale;
exports.setLocale = setLocale;
exports.setLocaleLang = setLocaleLang;
exports.clearLocaleLang = clearLocaleLang;
exports.createTimer = createTimer;
exports.removeTimer = removeTimer;
exports.sleep = sleep;
exports.setSystem = setSystem;
exports.clearSystem = clearSystem;
exports.refreshSystemPosition = refreshSystemPosition;
const clickgo = __importStar(require("../clickgo"));
const core = __importStar(require("./core"));
const dom = __importStar(require("./dom"));
const tool = __importStar(require("./tool"));
const form = __importStar(require("./form"));
const control = __importStar(require("./control"));
const fs = __importStar(require("./fs"));
const theme = __importStar(require("./theme"));
const native = __importStar(require("./native"));
exports.list = {};
exports.lastId = 0;
let focusId = null;
function setFocus(id) {
    focusId = id ?? null;
}
function getFocus() {
    return focusId;
}
const localeData = {
    'en': {
        'loading': 'Loading...',
    },
    'sc': {
        'loading': '加载中……'
    },
    'tc': {
        'loading': '載入中……'
    },
    'ja': {
        'loading': '読み込み中...'
    },
    'ko': {
        'loading': '로딩 중...'
    },
    'th': {
        'loading': 'กำลังโหลด...'
    },
    'es': {
        'loading': 'Cargando...'
    },
    'de': {
        'loading': 'Laden...'
    },
    'fr': {
        'loading': 'Chargement en cours...'
    },
    'pt': {
        'loading': 'Carregando...'
    },
    'ru': {
        'loading': 'Загрузка...'
    },
    'vi': {
        'loading': 'Đang tải...'
    }
};
let frameTimer = 0;
const frameMaps = {};
function onFrame(fun, opt = {}) {
    const taskId = opt.taskId;
    const formId = opt.formId;
    if (!taskId) {
        return 0;
    }
    const task = exports.list[taskId];
    if (!task) {
        return 0;
    }
    if (formId && !task.forms[formId]) {
        return 0;
    }
    const ft = ++frameTimer;
    const count = opt.count ?? 0;
    let c = 0;
    let timer;
    const timerHandler = async () => {
        ++c;
        if (formId && task.forms[formId] === undefined) {
            delete task.timers['1x' + ft.toString()];
            delete frameMaps[ft];
            return;
        }
        await fun();
        if (task.timers['1x' + ft.toString()] == undefined) {
            return;
        }
        if (count > 1) {
            if (c === count) {
                delete task.timers['1x' + ft.toString()];
                delete frameMaps[ft];
                return;
            }
            else {
                timer = requestAnimationFrame(function () {
                    timerHandler().catch(function (e) {
                        console.log('task.onFrame: -3', e);
                    });
                });
                frameMaps[ft] = timer;
            }
        }
        else if (count === 1) {
            delete task.timers['1x' + ft.toString()];
            delete frameMaps[ft];
        }
        else {
            timer = requestAnimationFrame(function () {
                timerHandler().catch(function (e) {
                    console.log('task.onFrame: -2', e);
                });
            });
            frameMaps[ft] = timer;
        }
    };
    timer = requestAnimationFrame(function () {
        timerHandler().catch(function (e) {
            console.log('task.onFrame: -1', e);
        });
    });
    frameMaps[ft] = timer;
    task.timers['1x' + ft.toString()] = formId ?? 0;
    return ft;
}
function offFrame(ft, opt = {}) {
    const taskId = opt.taskId;
    if (!taskId) {
        return;
    }
    if (!exports.list[taskId]) {
        return;
    }
    const formId = exports.list[taskId].timers['1x' + ft.toString()];
    if (formId === undefined) {
        return;
    }
    cancelAnimationFrame(frameMaps[ft]);
    delete exports.list[taskId].timers['1x' + ft.toString()];
    delete frameMaps[ft];
}
function get(tid) {
    if (exports.list[tid] === undefined) {
        return null;
    }
    return {
        'name': exports.list[tid].app.config.name,
        'locale': exports.list[tid].locale.lang,
        'customTheme': exports.list[tid].customTheme,
        'formCount': Object.keys(exports.list[tid].forms).length,
        'icon': exports.list[tid].app.icon,
        'path': exports.list[tid].path,
        'current': exports.list[tid].current
    };
}
function getPermissions(tid) {
    if (exports.list[tid] === undefined) {
        return [];
    }
    return tool.clone(exports.list[tid].runtime.permissions);
}
function getList() {
    const rtn = {};
    for (const tid in exports.list) {
        const item = exports.list[tid];
        rtn[tid] = {
            'name': item.app.config.name,
            'locale': item.locale.lang,
            'customTheme': item.customTheme,
            'formCount': Object.keys(item.forms).length,
            'icon': item.app.icon,
            'path': item.path,
            'current': item.current
        };
    }
    return rtn;
}
async function run(url, opt = {}, ntid) {
    let app = null;
    if (typeof url === 'string') {
        if (!url.endsWith('/') && !url.endsWith('.cga')) {
            return 0;
        }
        let icon = __dirname + '/../icon.png';
        if (opt.icon) {
            icon = opt.icon;
        }
        opt.notify ??= true;
        const notifyId = opt.notify ? form.notify({
            'title': localeData[core.config.locale]?.loading ?? localeData['en'].loading,
            'content': url,
            'icon': icon,
            'timeout': 0,
            'progress': true
        }) : undefined;
        if (!ntid &&
            !url.startsWith('/clickgo/') &&
            !url.startsWith('/storage/') &&
            !url.startsWith('/mounted/') &&
            !url.startsWith('/package/') &&
            !url.startsWith('/current/')) {
            url = tool.urlResolve(location.href, url);
        }
        app = await core.fetchApp(url, {
            'notifyId': notifyId,
            'progress': opt.progress,
            'cache': opt.cache
        }, ntid);
        if (notifyId) {
            setTimeout(function () {
                form.hideNotify(notifyId);
            }, 3000);
        }
    }
    else if (url.type !== 'app') {
        return -1;
    }
    else {
        app = url;
    }
    if (!app) {
        return -1;
    }
    const taskId = ++exports.lastId;
    const blocks = ['document', 'localStorage'];
    const invoke = {};
    const ks = Object.getOwnPropertyNames(window);
    invoke.window = {};
    for (const k of ks) {
        if (blocks.includes(k)) {
            continue;
        }
        invoke.window[k] = window[k];
    }
    for (const block of blocks) {
        invoke[block] = undefined;
    }
    invoke.console = {
        assert: function (condition, ...data) {
            console.assert(condition, ...data);
        },
        clear: function () {
            console.clear();
        },
        count: function (label) {
            console.count(label);
        },
        countReset: function (label) {
            console.countReset(label);
        },
        debug: function (...data) {
            console.debug(...data);
        },
        dir: function (item, options) {
            console.dir(item, options);
        },
        dirxml: function (...data) {
            console.dirxml(...data);
        },
        error: function (...data) {
            console.error(...data);
        },
        group: function (...data) {
            console.group(...data);
        },
        groupCollapsed: function (...data) {
            console.groupCollapsed(...data);
        },
        groupEnd: function () {
            console.groupEnd();
        },
        info: function (...data) {
            console.info(...data);
        },
        log: function (...data) {
            console.log(...data);
        },
        table: function (tabularData, properties) {
            console.table(tabularData, properties);
        },
        time: function (label) {
            console.time(label);
        },
        timeEnd: function (label) {
            console.timeEnd(label);
        },
        timeLog: function (label, ...data) {
            console.timeLog(label, ...data);
        },
        timeStamp: function (label) {
            console.timeStamp(label);
        },
        trace: function (...data) {
            console.trace(...data);
        },
        warn: function (...data) {
            console.warn(...data);
        }
    };
    invoke.loader = {
        require: function (paths, files, opt) {
            return loader.require(paths, files, opt);
        }
    };
    invoke.invokeClickgo = {
        getVersion: () => {
            return clickgo.getVersion();
        },
        isNative: () => {
            return clickgo.isNative();
        },
        getPlatform: () => {
            return clickgo.getPlatform();
        },
        getDevice: () => {
            return clickgo.getDevice();
        },
        isImmersion: () => {
            return clickgo.isImmersion();
        },
        hasFrame: () => {
            return clickgo.hasFrame();
        },
        'control': {
            'AbstractControl': class extends control.AbstractControl {
                get taskId() {
                    return taskId;
                }
            },
            read: function (blob) {
                return control.read(blob);
            }
        },
        'core': {
            'config': clickgo.core.config,
            'global': clickgo.tool.clone(clickgo.core.global),
            'AbstractApp': class extends core.AbstractApp {
                async main() {
                    return;
                }
                get taskId() {
                    return taskId;
                }
            },
            getCdn: function () {
                return core.getCdn();
            },
            getModule: function (name) {
                return core.getModule(name);
            },
            readApp: function (blob) {
                return core.readApp(blob);
            },
            getAvailArea: function () {
                return core.getAvailArea();
            },
            hash: function (hash) {
                return core.hash(hash, taskId);
            },
            getHash: function () {
                return core.getHash();
            },
            getHost: function () {
                return core.getHost();
            },
            location: function (url) {
                return core.location(url, taskId);
            },
            getLocation: function () {
                return core.getLocation();
            },
            back: function () {
                return core.back(taskId);
            },
            open: function (url) {
                core.open(url);
            }
        },
        'dom': {
            inPage: function (el) {
                return dom.inPage(el);
            },
            'dpi': dom.dpi,
            setGlobalCursor: function (type) {
                dom.setGlobalCursor(type);
            },
            hasTouchButMouse: function (e) {
                return dom.hasTouchButMouse(e);
            },
            getStyleCount: function (taskId, type) {
                return dom.getStyleCount(taskId, type);
            },
            watchPosition: function (el, cb, immediate = false) {
                return dom.watchPosition(el, cb, immediate);
            },
            unwatchPosition: function (el) {
                dom.unwatchPosition(el);
            },
            isWatchPosition: function (el) {
                return dom.isWatchPosition(el);
            },
            getWatchSizeCount: function (taskId) {
                return dom.getWatchSizeCount(taskId);
            },
            watchSize: function (el, cb, immediate = false) {
                return dom.watchSize(el, cb, immediate, taskId);
            },
            unwatchSize: function (el) {
                dom.unwatchSize(el, taskId);
            },
            isWatchSize: function (el) {
                return dom.isWatchSize(el);
            },
            getWatchCount: function (taskId) {
                return dom.getWatchCount(taskId);
            },
            watch: function (el, cb, mode = 'default', immediate = false) {
                dom.watch(el, cb, mode, immediate, taskId);
            },
            unwatch: function (el) {
                dom.unwatch(el, taskId);
            },
            isWatch(el) {
                return dom.isWatch(el);
            },
            watchStyle: function (el, name, cb, immediate = false) {
                dom.watchStyle(el, name, cb, immediate);
            },
            isWatchStyle: function (el) {
                return dom.isWatchStyle(el);
            },
            watchProperty: function (el, name, cb, immediate = false) {
                dom.watchProperty(el, name, cb, immediate);
            },
            isWatchProperty(el) {
                return dom.isWatchProperty(el);
            },
            getWatchInfo: function () {
                return dom.getWatchInfo();
            },
            bindClick: function (e, handler) {
                dom.bindClick(e, handler);
            },
            bindDblClick: function (e, handler) {
                dom.bindDblClick(e, handler);
            },
            bindDown: function (oe, opt) {
                dom.bindDown(oe, opt);
            },
            bindScale: function (oe, handler) {
                dom.bindScale(oe, handler);
            },
            bindGesture: function (oe, before, handler) {
                dom.bindGesture(oe, before, handler);
            },
            bindLong: function (e, long) {
                dom.bindLong(e, long);
            },
            setDragData(data) {
                dom.setDragData(data);
            },
            bindDrag: function (e, opt) {
                dom.bindDrag(e, opt);
            },
            'is': dom.is,
            bindMove: function (e, opt) {
                return dom.bindMove(e, opt);
            },
            bindResize: function (e, opt) {
                dom.bindResize(e, opt);
            },
            findParentByData: function (el, name, value) {
                return dom.findParentByData(el, name, value);
            },
            findParentByClass: function (el, name) {
                return dom.findParentByClass(el, name);
            },
            findParentByTag: function (el, name) {
                return dom.findParentByTag(el, name);
            },
            index: function (el) {
                return dom.index(el);
            },
            siblings: function (el) {
                return dom.siblings(el);
            },
            siblingsData: function (el, name) {
                return dom.siblingsData(el, name);
            },
            fullscreen: function () {
                return dom.fullscreen();
            },
            exitFullscreen: function () {
                return dom.exitFullscreen();
            },
            createElement: function (tagName) {
                return dom.createElement(tagName);
            }
        },
        'form': {
            'AbstractPanel': class extends form.AbstractPanel {
                get taskId() {
                    return taskId;
                }
            },
            'AbstractForm': class extends form.AbstractForm {
                get taskId() {
                    return taskId;
                }
            },
            min: function (fid) {
                return form.min(fid);
            },
            max: function max(fid) {
                return form.max(fid);
            },
            close: function (fid) {
                return form.close(fid);
            },
            bindResize: function (e, border) {
                form.bindResize(e, border);
            },
            bindDrag: function (e) {
                form.bindDrag(e);
            },
            getTaskId: function (fid) {
                return form.getTaskId(fid);
            },
            get: function (fid) {
                return form.get(fid);
            },
            getList: function (tid) {
                return form.getList(tid);
            },
            getFocus: function () {
                return form.getFocus();
            },
            getActivePanel: function (formId) {
                return form.getActivePanel(formId);
            },
            removeActivePanel: function (panelId, formId) {
                return form.removeActivePanel(panelId, formId, taskId);
            },
            setActivePanel: function (panelId, formId) {
                return form.setActivePanel(panelId, formId, taskId);
            },
            hash: function (hash, formId) {
                return form.hash(hash, formId);
            },
            getHash: function (formId) {
                return form.getHash(formId);
            },
            hashBack: function (formId) {
                return form.hashBack(formId);
            },
            changeFocus: function (fid = 0) {
                form.changeFocus(fid);
            },
            getMaxZIndexID: function (out) {
                return form.getMaxZIndexID(out);
            },
            getRectByBorder: function (border) {
                return form.getRectByBorder(border);
            },
            showCircular: function (x, y) {
                form.showCircular(x, y);
            },
            moveRectangle: function (border) {
                form.moveRectangle(border);
            },
            showRectangle: function (x, y, border) {
                form.showRectangle(x, y, border);
            },
            hideRectangle: function () {
                form.hideRectangle();
            },
            showDrag: function () {
                form.showDrag();
            },
            moveDrag: function (opt) {
                form.moveDrag(opt);
            },
            hideDrag: function () {
                form.hideDrag();
            },
            alert: function (content, type) {
                return form.alert(content, type);
            },
            notify: function (opt) {
                return form.notify(opt);
            },
            notifyProgress: function (notifyId, per) {
                form.notifyProgress(notifyId, per);
            },
            notifyContent: function (notifyId, opt) {
                form.notifyContent(notifyId, opt);
            },
            hideNotify: function (notifyId) {
                form.hideNotify(notifyId);
            },
            showPop: function (el, pop, direction, opt = {}) {
                form.showPop(el, pop, direction, opt);
            },
            hidePop: function (pop) {
                form.hidePop(pop);
            },
            isJustPop: function (el) {
                return form.isJustPop(el);
            },
            doFocusAndPopEvent: function (e) {
                form.doFocusAndPopEvent(e);
            },
            removePanel(id, vapp, el) {
                return form.removePanel(id, vapp, el);
            },
            createPanel(rootPanel, cls, opt) {
                return form.createPanel(rootPanel, cls, opt, taskId);
            },
            create: function (cls, data, opt) {
                return form.create(cls, data, opt, taskId);
            },
            dialog: function (opt) {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return form.dialog(opt);
            },
            confirm: function (opt) {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return form.confirm(opt);
            },
            prompt: function (opt) {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return form.prompt(opt);
            },
            flash: function (fid) {
                form.flash(fid, taskId);
            },
            showLauncher: function () {
                form.showLauncher();
            },
            hideLauncher: function () {
                form.hideLauncher();
            }
        },
        'fs': {
            mount: function (name, handler) {
                return clickgo.fs.mount(name, handler, taskId);
            },
            unmount: function (name) {
                return clickgo.fs.unmount(name);
            },
            getContent: function (path, options = {}) {
                return fs.getContent(path, options, taskId);
            },
            putContent: function (path, data, options = {}) {
                return fs.putContent(path, data, options, taskId);
            },
            readLink: function (path, options = {}) {
                return fs.readLink(path, options, taskId);
            },
            symlink: function (fPath, linkPath, options = {}) {
                return fs.symlink(fPath, linkPath, options, taskId);
            },
            unlink: function (path) {
                return fs.unlink(path, taskId);
            },
            stats: function (path) {
                return fs.stats(path, taskId);
            },
            isDir: function (path) {
                return fs.isDir(path, taskId);
            },
            isFile: function (path) {
                return fs.isFile(path, taskId);
            },
            mkdir: function (path, mode) {
                return fs.mkdir(path, mode, taskId);
            },
            rmdir: function (path) {
                return fs.rmdir(path, taskId);
            },
            rmdirDeep: function (path) {
                return fs.rmdirDeep(path, taskId);
            },
            chmod: function (path, mod) {
                return fs.chmod(path, mod, taskId);
            },
            rename(oldPath, newPath) {
                return fs.rename(oldPath, newPath, taskId);
            },
            readDir(path, encoding) {
                return fs.readDir(path, encoding, taskId);
            },
            copyFolder(from, to, options = {}) {
                return fs.copyFolder(from, to, options, taskId);
            },
            copyFile(src, dest) {
                return fs.copyFile(src, dest, taskId);
            }
        },
        'native': {
            on(name, handler, once = false, formId) {
                native.on(name, handler, once, formId, taskId);
            },
            once(name, handler, formId) {
                native.once(name, handler, formId, taskId);
            },
            off(name, formId) {
                native.off(name, formId, taskId);
            },
            clear(formId, taskId) {
                native.clear(formId, taskId);
            },
            getListenerList(taskId) {
                return native.getListenerList(taskId);
            },
            invoke: function (name, ...param) {
                return native.invoke(name, ...param);
            },
            size: async function (width, height) {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.size(width, height);
            },
            max: async function () {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.max();
            },
            min: async function () {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.min();
            },
            restore: async function () {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.restore();
            },
            activate: async function () {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.activate();
            },
            maximizable: async function (val) {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.maximizable(val);
            },
            open: async function (options) {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return null;
                }
                return native.open(options);
            },
            save: async function (options) {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return null;
                }
                return native.save(options);
            },
            dialog: async function (options) {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return -1;
                }
                return native.dialog(options);
            },
            ping: function (val) {
                return native.ping(val);
            },
            isMax: function () {
                return native.isMax();
            },
        },
        'storage': {
            get: function (key) {
                return clickgo.storage.get(key, taskId);
            },
            set: function (key, val) {
                return clickgo.storage.set(key, val, taskId);
            },
            remove: function (key) {
                return clickgo.storage.remove(key, taskId);
            },
            list: function () {
                return clickgo.storage.list(taskId);
            },
            all: function () {
                return clickgo.storage.all();
            },
            clear: function (path) {
                return clickgo.storage.clear(path);
            }
        },
        'task': {
            getFocus: function () {
                return focusId;
            },
            onFrame: function (fun, opt = {}) {
                opt.taskId = taskId;
                return onFrame(fun, opt);
            },
            offFrame: function (ft, opt = {}) {
                opt.taskId = taskId;
                offFrame(ft, opt);
            },
            get: function (tid) {
                return get(tid);
            },
            getPermissions: function (tid) {
                return getPermissions(tid);
            },
            getList: function () {
                return getList();
            },
            run: function (url, opt = {}) {
                if (opt.permissions) {
                    if (!exports.list[taskId]?.runtime.permissions.includes('root')) {
                        opt.permissions = undefined;
                    }
                }
                return run(url, opt, taskId);
            },
            checkPermission: function (vals, apply = false, applyHandler) {
                return checkPermission(vals, apply, applyHandler, taskId);
            },
            end: function (tid) {
                return end(tid ?? taskId);
            },
            loadLocaleData: function (lang, data, pre = '') {
                loadLocaleData(lang, data, pre, taskId);
            },
            loadLocale: function (lang, path) {
                return loadLocale(lang, path, taskId);
            },
            clearLocale: function () {
                clearLocale(taskId);
            },
            setLocale: function (lang, path) {
                return setLocale(lang, path, taskId);
            },
            setLocaleLang: function (lang) {
                setLocaleLang(lang, taskId);
            },
            clearLocaleLang: function () {
                clearLocaleLang(taskId);
            },
            createTimer: function (fun, delay, opt = {}) {
                opt.taskId = taskId;
                return createTimer(fun, delay, opt);
            },
            removeTimer: function (timer) {
                removeTimer(timer, taskId);
            },
            sleep: function (fun, delay) {
                return sleep(fun, delay, taskId);
            },
            'systemTaskInfo': clickgo.task.systemTaskInfo,
            setSystem: function (fid) {
                return setSystem(fid, taskId);
            },
            clearSystem: function () {
                return clearSystem(taskId);
            }
        },
        'theme': {
            read: function (blob) {
                return clickgo.theme.read(blob);
            },
            load: async function (theme) {
                if (!theme) {
                    return false;
                }
                return clickgo.theme.load(theme, taskId);
            },
            remove: function (name) {
                return clickgo.theme.remove(name, taskId);
            },
            clear: function () {
                return clickgo.theme.clear(taskId);
            },
            setGlobal: function (theme) {
                return clickgo.theme.setGlobal(theme);
            },
            clearGlobal: function () {
                clickgo.theme.clearGlobal();
            }
        },
        'tool': {
            compressor: function (file, options = {}) {
                return tool.compressor(file, options);
            },
            blob2ArrayBuffer: function (blob) {
                return tool.blob2ArrayBuffer(blob);
            },
            sizeFormat: function (size, spliter = ' ') {
                return tool.sizeFormat(size, spliter);
            },
            weightFormat: function (weight, spliter = ' ') {
                return tool.weightFormat(weight, spliter);
            },
            clone: function (obj) {
                return tool.clone(obj);
            },
            sleep: function (ms = 0) {
                return tool.sleep(ms);
            },
            nextFrame() {
                return tool.nextFrame();
            },
            sleepFrame(count) {
                return tool.sleepFrame(count);
            },
            purify: function (text) {
                return tool.purify(text);
            },
            match: function (str, regs) {
                return tool.match(str, regs);
            },
            layoutAddTagClassAndReTagName: function (layout, retagname) {
                return tool.layoutAddTagClassAndReTagName(layout, retagname);
            },
            layoutClassPrepend: function (layout, preps) {
                return tool.layoutClassPrepend(layout, preps);
            },
            stylePrepend: function (style, prep = '') {
                return tool.stylePrepend(style, prep);
            },
            rand: function (min, max) {
                return tool.rand(min, max);
            },
            'RANDOM_N': tool.RANDOM_N,
            'RANDOM_U': tool.RANDOM_U,
            'RANDOM_L': tool.RANDOM_L,
            'RANDOM_UN': tool.RANDOM_UN,
            'RANDOM_LN': tool.RANDOM_LN,
            'RANDOM_LU': tool.RANDOM_LU,
            'RANDOM_LUN': tool.RANDOM_LUN,
            'RANDOM_V': tool.RANDOM_V,
            'RANDOM_LUNS': tool.RANDOM_LUNS,
            random: function (length = 8, source = tool.RANDOM_LN, block = '') {
                return tool.random(length, source, block);
            },
            getBoolean: function (param) {
                return tool.getBoolean(param);
            },
            getNumber: function (param) {
                return tool.getNumber(param);
            },
            getArray(param) {
                return tool.getArray(param);
            },
            escapeHTML: function (html) {
                return tool.escapeHTML(html);
            },
            formatColor: function (color) {
                return tool.formatColor(color);
            },
            rgb2hex: function (r, g, b, a = 1) {
                return tool.rgb2hex(r, g, b, a);
            },
            hex2rgb: function (hex) {
                return tool.hex2rgb(hex);
            },
            rgb2hsl: function (r, g, b, a = 1, decimal = false) {
                return tool.rgb2hsl(r, g, b, a, decimal);
            },
            hsl2rgb: function (h, s, l, a = 1, decimal = false) {
                return tool.hsl2rgb(h, s, l, a, decimal);
            },
            request: function (url, opt) {
                return tool.request(url, opt);
            },
            fetch: function (url, init) {
                return tool.fetch(url, init);
            },
            get: function (url, opt) {
                return tool.get(url, opt);
            },
            post: function (url, data, opt) {
                return tool.post(url, data, opt);
            },
            getResponseJson: function (url, opt) {
                return tool.getResponseJson(url, opt);
            },
            postResponseJson: function (url, data, opt) {
                return tool.postResponseJson(url, data, opt);
            },
            parseUrl: function (url) {
                return tool.parseUrl(url);
            },
            urlResolve: function (from, to) {
                return tool.urlResolve(from, to);
            },
            urlAtom: function (url) {
                return tool.urlAtom(url);
            },
            blob2Text: function (blob) {
                return tool.blob2Text(blob);
            },
            blob2DataUrl: function (blob) {
                return tool.blob2DataUrl(blob);
            },
            execCommand: function (ac) {
                tool.execCommand(ac);
            },
            compar: function (before, after) {
                return tool.compar(before, after);
            },
            formatSecond: function (second) {
                return tool.formatSecond(second);
            },
            formatTime: function (ts, tz) {
                return tool.formatTime(ts, tz);
            },
            isMs: function (time) {
                return tool.isMs(time);
            },
            queryStringify: function (query) {
                return tool.queryStringify(query);
            },
            queryParse: function (query) {
                return tool.queryParse(query);
            }
        },
        'zip': {
            get: function (data) {
                return clickgo.zip.get(data);
            }
        }
    };
    const preprocess = function (code, path) {
        const exec = /eval\W/.exec(code);
        if (exec) {
            form.notify({
                'title': 'Error',
                'content': `The "eval" is prohibited.\nFile: "${path}".`,
                'type': 'danger'
            });
            return '';
        }
        code = code.replace(/extends[\s\S]+?\.\s*(AbstractApp|AbstractForm|AbstractPanel)\s*{/, (t) => {
            return t + 'get filename() {return __filename;}';
        });
        return code;
    };
    app.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
    const path = opt.path ?? ((typeof url === 'string') ? url : '/runtime/' + tool.random(8, tool.RANDOM_LUN) + '.cga');
    const lio = path.endsWith('.cga') ? path.lastIndexOf('/') : path.slice(0, -1).lastIndexOf('/');
    const current = path.slice(0, lio);
    exports.list[taskId] = {
        'id': taskId,
        'app': app,
        'customTheme': false,
        'locale': clickgo.vue.reactive({
            'lang': '',
            'data': {}
        }),
        'path': path,
        'current': current,
        'runtime': clickgo.vue.reactive({
            'dialogFormIds': [],
            'permissions': opt.permissions ?? []
        }),
        'forms': {},
        'controls': {},
        'timers': {},
        'invoke': invoke
    };
    if (app.config.locales) {
        for (let path in app.config.locales) {
            const locale = app.config.locales[path];
            if (!path.endsWith('.json')) {
                path += '.json';
            }
            await opt.initProgress?.('Load local ' + path + ' ...');
            const lcontent = await fs.getContent(path, {
                'encoding': 'utf8'
            }, taskId);
            if (!lcontent) {
                continue;
            }
            try {
                const data = JSON.parse(lcontent);
                loadLocaleData(locale, data, '', taskId);
            }
            catch {
            }
        }
    }
    let expo = [];
    try {
        const map = {
            'clickgo': '/invoke/clickgo'
        };
        if (app.config.map) {
            Object.assign(map, app.config.map);
        }
        expo = loader.require('/app.js', app.files, {
            'dir': '/',
            'invoke': invoke,
            'preprocess': preprocess,
            'map': map
        })[0];
    }
    catch (e) {
        delete exports.list[taskId];
        core.trigger('error', taskId, 0, e, e.message + '(-1)');
        return -2;
    }
    if (!expo?.default) {
        delete exports.list[taskId];
        return -3;
    }
    dom.createToStyleList(taskId);
    await opt.initProgress?.('Control initialization ...');
    const r = await control.init(taskId, invoke, opt.cache);
    if (r < 0) {
        dom.removeFromStyleList(taskId);
        delete exports.list[taskId];
        return -400 + r;
    }
    if (app.config.themes?.length) {
        for (let path of app.config.themes) {
            path += '.cgt';
            path = tool.urlResolve('/', path);
            await opt.initProgress?.('Load theme ' + path + ' ...');
            const file = await fs.getContent(path, undefined, taskId);
            if (file && typeof file !== 'string') {
                const th = await theme.read(file);
                if (th) {
                    await theme.load(th, taskId);
                }
            }
        }
    }
    else {
        if (theme.global) {
            await opt.initProgress?.('Load global theme ...');
            await theme.load(undefined, taskId);
        }
    }
    if (app.config.style) {
        const style = await fs.getContent(app.config.style + '.css', {
            'encoding': 'utf8'
        }, taskId);
        if (style) {
            const r = tool.stylePrepend(style, 'cg-task' + taskId.toString() + '_');
            await opt.initProgress?.('Style initialization ...');
            dom.pushStyle(taskId, await tool.styleUrl2DataUrl(app.config.style, r.style, app.files));
        }
    }
    core.trigger('taskStarted', taskId);
    if (app.config.permissions) {
        await opt.initProgress?.('Style initialization ...');
        await checkPermission(app.config.permissions, true, undefined, taskId);
    }
    const appCls = new expo.default();
    exports.list[taskId].class = appCls;
    await opt.initProgress?.('Starting ...');
    await appCls.main(opt.data ?? {});
    return taskId;
}
const locale = {
    'sc': {
        'unknown': '未知权限',
        'root': '<b>危险！</b>最高权限！请一定确认是否允许！',
        'apply-permission': '正在申请权限，请您仔细确认',
        'native.form': '实体窗体控制',
        'hash': '可修改地址栏 hash',
        'fs': '文件系统',
        'readonly': '只读',
        'read-write': '读写'
    },
    'tc': {
        'unknown': '未知許可權',
        'root': '<b>危險！</b>最高許可權！請一定確認是否允許！',
        'apply-permission': '正在申請許可權，請您仔細確認',
        'native.form': '實體視窗控制',
        'hash': '可修改位址列 hash',
        'fs': '檔案系統',
        'readonly': '唯讀',
        'read-write': '讀寫'
    },
    'en': {
        'unknown': 'Unknown',
        'root': '<b>Danger!</b> Highest permission! Please confirm if you want to allow!',
        'apply-permission': 'Applying permission, please confirm carefully',
        'native.form': 'Native window control',
        'hash': 'Can modify address bar "hash"',
        'fs': 'File system',
        'readonly': 'Read-only',
        'read-write': 'Read and write'
    },
    'ja': {
        'unknown': '不明な権限',
        'root': '<b>危険！</b>最高権限です！許可するかどうか必ず確認してください！',
        'apply-permission': '権限を申請中です。よくご確認ください',
        'native.form': 'ネイティブフォームコントロール',
        'hash': 'アドレスバーの "hash" を変更できます',
        'fs': 'ファイルシステム',
        'readonly': '読み取り専用',
        'read-write': '読み書き可能'
    },
    'ko': {
        'unknown': '알 수 없는 권한',
        'root': '<b>위험!</b> 최고 권한입니다! 반드시 허용할 것인지 확인하십시오!',
        'apply-permission': '권한을 신청 중입니다. 주의 깊게 확인하십시오',
        'native.form': '네이티브 폼 제어',
        'hash': '주소 표시 줄 "hash" 를 수정할 수 있습니다',
        'fs': '파일 시스템',
        'readonly': '읽기 전용',
        'read-write': '읽기 및 쓰기',
    },
    'th': {
        'unknown': 'สิทธิ์ที่ไม่รู้จัก',
        'root': '<b>อันตราย!</b> สิทธิ์สูงสุด! โปรดตรวจสอบว่าต้องการอนุญาตหรือไม่!',
        'apply-permission': 'กำลังขอสิทธิ์ โปรดตรวจสอบอย่างรอบคอบ',
        'native.form': 'การควบคุมแบบฟอร์มแบบ Native',
        'hash': 'สามารถแก้ไขแถบที่อยู่ "hash"',
        'fs': 'ระบบไฟล์',
        'readonly': 'อ่านได้อย่างเดียว',
        'read-write': 'อ่านและเขียนได้'
    },
    'es': {
        'unknown': 'Permiso desconocido',
        'root': '<b>¡Peligro!</b> ¡Permiso máximo! ¡Asegúrese de permitirlo!',
        'apply-permission': 'Solicitando permiso. Por favor, compruebe cuidadosamente',
        'native.form': 'Control de formulario nativo',
        'hash': 'Puede modificar el "hash" de la barra de direcciones',
        'fs': 'Sistema de archivos',
        'readonly': 'Solo lectura',
        'read-write': 'Lectura y escritura',
    },
    'de': {
        'unknown': 'Unbekannte Berechtigung',
        'root': '<b>Gefahr!</b> Höchste Berechtigung! Bitte stellen Sie unbedingt sicher, ob dies erlaubt ist!',
        'apply-permission': 'Bitte bestätigen Sie die Berechtigungsanfrage sorgfältig',
        'native.form': 'Natives Formularsteuerelement',
        'hash': 'Adressleisten "hash" bearbeiten',
        'fs': 'Dateisystem',
        'readonly': 'Schreibgeschützt',
        'read-write': 'Lesen/Schreiben'
    },
    'fr': {
        'unknown': 'Autorisation inconnue',
        'root': '<b>Danger !</b> Autorisation maximale ! Veuillez vous assurer que vous êtes autorisé à le faire !',
        'apply-permission': 'Demande d\'autorisation en cours, veuillez vérifier attentivement',
        'native.form': 'Contrôle de formulaire natif',
        'hash': 'Modifier le "hash" de la barre d\'adresse',
        'fs': 'Système de fichiers',
        'readonly': 'Lecture seule',
        'read-write': 'Lecture/écriture'
    },
    'pt': {
        'unknown': 'Permissão desconhecida',
        'root': '<b>Perigo!</b> Permissão máxima! Certifique-se de ter permissão para fazê-lo!',
        'apply-permission': 'Solicitando permissão, por favor confirme cuidadosamente',
        'native.form': 'Controle de formulário nativo',
        'hash': 'Editar "hash" da barra de endereço',
        'fs': 'Sistema de arquivos',
        'readonly': 'Somente leitura',
        'read-write': 'Leitura/escrita'
    },
    'ru': {
        'unknown': 'Неизвестное разрешение',
        'root': '<b>Опасность!</b> Максимальное разрешение! Пожалуйста, обязательно убедитесь, что это разрешено!',
        'apply-permission': 'Выполняется запрос на разрешение, пожалуйста, внимательно подтвердите',
        'native.form': 'Нативный элемент формы',
        'hash': 'Изменить "hash" адресной строки',
        'fs': 'Файловая система',
        'readonly': 'Только для чтения',
        'read-write': 'Чтение/запись'
    },
    'vi': {
        'unknown': 'Quyền không xác định',
        'root': '<b>Nguy hiểm!</b> Quyền hạn cao nhất! Hãy đảm bảo rằng bạn được phép làm điều này!',
        'apply-permission': 'Đang yêu cầu quyền truy cập, vui lòng xác nhận cẩn thận',
        'native.form': 'Thiết bị kiểm soát biểu mẫu gốc',
        'hash': 'Chỉnh sửa "hash" thanh địa chỉ',
        'fs': 'Hệ thống tập tin',
        'readonly': 'Chỉ đọc',
        'read-write': 'Đọc/ghi'
    }
};
async function checkPermission(vals, apply = false, applyHandler, taskId) {
    if (!taskId) {
        return [false];
    }
    const task = exports.list[taskId];
    if (!task) {
        return [false];
    }
    if (typeof vals === 'string') {
        vals = [vals];
    }
    const rtn = [];
    const applyList = [];
    for (const val of vals) {
        if (task.runtime.permissions.includes('root')) {
            rtn.push(true);
            continue;
        }
        if (val.startsWith('fs.')) {
            let yes = false;
            const path = val.slice(3, -1);
            for (const v of task.runtime.permissions) {
                if (!v.startsWith('fs.')) {
                    continue;
                }
                const pa = v.slice(3, -1);
                if (pa.endsWith('/')) {
                    if (!path.startsWith(pa)) {
                        continue;
                    }
                }
                else if (pa !== path) {
                    continue;
                }
                if (val.endsWith('w')) {
                    if (v.endsWith('r')) {
                        continue;
                    }
                }
                yes = true;
                break;
            }
            rtn.push(yes);
            if (!yes && apply) {
                applyList.push(val);
            }
            continue;
        }
        const result = task.runtime.permissions.includes(val);
        if (!result && apply) {
            applyList.push(val);
        }
        rtn.push(result);
    }
    if (applyList.length) {
        let html = '<div>"' + tool.escapeHTML(task.app.config.name) + '" ' + ((locale[core.config.locale]?.['apply-permission'] ?? locale['en']['apply-permission']) + ':') + '</div>';
        for (const item of applyList) {
            if (item.startsWith('fs.')) {
                const path = item.slice(3, -1);
                html += '<div style="margin-top: 10px;">' +
                    (locale[core.config.locale]?.fs ?? locale['en'].fs) + ' ' + tool.escapeHTML(path) + ' ' + (item.endsWith('r') ? (locale[core.config.locale]?.readonly ?? locale['en'].readonly) : (locale[core.config.locale]?.['read-write'] ?? locale['en']['read-write'])) +
                    '<div style="color: hsl(0,0%,60%);">' + tool.escapeHTML(item) + '</div>' +
                    '</div>';
                continue;
            }
            const lang = locale[core.config.locale]?.[item] ?? locale['en'][item];
            html += '<div style="margin-top: 10px;">' +
                (lang ?? locale[core.config.locale]?.unknown ?? locale['en'].unknown) +
                '<div style="color: hsl(0,0%,60%);">' + tool.escapeHTML(item) + '</div>' +
                '</div>';
        }
        if (await form.superConfirm(html)) {
            for (let i = 0; i < rtn.length; ++i) {
                if (rtn[i]) {
                    continue;
                }
                rtn[i] = true;
            }
            for (const item of applyList) {
                task.runtime.permissions.push(item);
            }
            try {
                applyHandler?.(applyList);
            }
            catch (e) {
                console.log('task.checkPermission', e);
            }
        }
    }
    return rtn;
}
function end(taskId) {
    if (typeof taskId === 'string') {
        taskId = parseInt(taskId);
    }
    const task = exports.list[taskId];
    if (!task) {
        return true;
    }
    if (clickgo.isNative() && (taskId === 1)) {
        native.invoke('cg-close', native.getToken());
    }
    const fid = form.getMaxZIndexID({
        'taskIds': [task.id]
    });
    if (fid) {
        form.changeFocus(fid);
    }
    else {
        form.changeFocus();
    }
    for (const fid in task.forms) {
        const f = task.forms[fid];
        core.trigger('formRemoved', taskId, f.id, f.vroot.$refs.form.title, f.vroot.$refs.form.iconDataUrl);
        try {
            f.vapp.unmount();
        }
        catch (err) {
            const msg = `Message: ${err.message}\nTask id: ${task.id}\nForm id: ${fid}\nFunction: task.end, unmount.`;
            form.notify({
                'title': 'Form Unmount Error',
                'content': msg,
                'type': 'danger'
            });
            console.log('Form Unmount Error', msg, err);
        }
        f.vapp._container.remove();
        form.elements.popList.querySelector('[data-form-id="' + f.id.toString() + '"]')?.remove();
        dom.clearWatchStyle(fid);
        dom.clearWatchProperty(fid);
        dom.clearWatchPosition(fid);
        delete form.activePanels[fid];
    }
    const flist = form.elements.list.querySelectorAll('.cg-form-wrap[data-task-id="' + taskId.toString() + '"]');
    for (const f of flist) {
        f.remove();
    }
    dom.removeFromStyleList(taskId);
    for (const timer in exports.list[taskId].timers) {
        if (timer.startsWith('1x')) {
            const ft = timer.slice(2);
            cancelAnimationFrame(frameMaps[ft]);
            delete frameMaps[ft];
        }
        else {
            clearTimeout(parseFloat(timer));
        }
    }
    dom.clearWatchSize(taskId);
    dom.clearWatch(taskId);
    native.clear(undefined, taskId);
    delete exports.list[taskId];
    core.trigger('taskEnded', taskId);
    clearSystem(taskId);
    return true;
}
function loadLocaleData(lang, data, pre = '', taskId) {
    if (!taskId) {
        return;
    }
    if (!exports.list[taskId].locale.data[lang]) {
        exports.list[taskId].locale.data[lang] = {};
    }
    for (const k in data) {
        const v = data[k];
        if (typeof v === 'object') {
            loadLocaleData(lang, v, pre + k + '.', taskId);
        }
        else {
            exports.list[taskId].locale.data[lang][pre + k] = v;
        }
    }
}
async function loadLocale(lang, path, taskId) {
    if (!taskId) {
        return false;
    }
    const task = exports.list[taskId];
    if (!task) {
        return false;
    }
    const fcontent = await fs.getContent(path + '.json', {
        'encoding': 'utf8'
    }, taskId);
    if (!fcontent) {
        return false;
    }
    try {
        const data = JSON.parse(fcontent);
        loadLocaleData(lang, data, '', task.id);
        return true;
    }
    catch {
        return false;
    }
}
function clearLocale(taskId) {
    if (!taskId) {
        return;
    }
    const task = exports.list[taskId];
    if (!task) {
        return;
    }
    task.locale.data = {};
}
function setLocale(lang, path, taskId) {
    clearLocale(taskId);
    return loadLocale(lang, path, taskId);
}
function setLocaleLang(lang, taskId) {
    if (!taskId) {
        return;
    }
    const task = exports.list[taskId];
    if (!task) {
        return;
    }
    task.locale.lang = lang;
}
function clearLocaleLang(taskId) {
    if (!taskId) {
        return;
    }
    const task = exports.list[taskId];
    if (!task) {
        return;
    }
    task.locale.lang = '';
}
function createTimer(fun, delay, opt = {}) {
    const taskId = opt.taskId;
    const formId = opt.formId;
    if (!taskId) {
        return 0;
    }
    const task = exports.list[taskId];
    if (!task) {
        return 0;
    }
    if (formId && !task.forms[formId]) {
        return 0;
    }
    const count = opt.count ?? 0;
    let c = 0;
    if (opt.immediate) {
        const r = fun();
        if (r instanceof Promise) {
            r.catch(function (e) {
                console.log(e);
            });
        }
        ++c;
        if (count > 0 && c === count) {
            return 0;
        }
    }
    let timer;
    const timerHandler = () => {
        ++c;
        if (formId && task.forms[formId] === undefined) {
            clearTimeout(timer);
            delete task.timers[timer];
            return;
        }
        const r = fun();
        if (r instanceof Promise) {
            r.catch(function (e) {
                console.log(e);
            });
        }
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete task.timers[timer];
            return;
        }
    };
    if (count === 1) {
        timer = window.setTimeout(timerHandler, delay);
    }
    else {
        timer = window.setInterval(timerHandler, delay);
    }
    task.timers[timer] = formId ?? 0;
    return timer;
}
function removeTimer(timer, taskId) {
    if (!taskId) {
        return;
    }
    if (exports.list[taskId] === undefined) {
        return;
    }
    const formId = exports.list[taskId].timers[timer];
    if (formId === undefined) {
        return;
    }
    clearTimeout(timer);
    delete exports.list[taskId].timers[timer];
}
function sleep(fun, delay, taskId) {
    return createTimer(fun, delay, {
        'taskId': taskId,
        'count': 1
    });
}
exports.systemTaskInfo = clickgo.vue.reactive({
    'taskId': 0,
    'formId': 0,
    'length': 0
});
clickgo.vue.watch(exports.systemTaskInfo, function (n, o) {
    const originKeys = ['taskId', 'formId', 'length'];
    for (const key of originKeys) {
        if (exports.systemTaskInfo[key] !== undefined) {
            continue;
        }
        form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously removed the system task info item.\nKey: ' + key,
            'type': 'warning'
        });
        exports.systemTaskInfo[key] = o[key] ?? 0;
    }
    for (const key in exports.systemTaskInfo) {
        if (!['taskId', 'formId', 'length'].includes(key)) {
            form.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system task info item.\nKey: ' + key,
                'type': 'warning'
            });
            delete exports.systemTaskInfo[key];
            continue;
        }
        if (typeof exports.systemTaskInfo[key] === 'number') {
            continue;
        }
        form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously modifies the system task info item.\nKey: ' + key,
            'type': 'warning'
        });
        exports.systemTaskInfo[key] = o[key] ?? 0;
    }
}, {
    'deep': true
});
function setSystem(formId, taskId) {
    if (!taskId) {
        return false;
    }
    const task = exports.list[taskId];
    if (!task) {
        return false;
    }
    const f = task.forms[formId];
    if (!f) {
        return false;
    }
    if (f.vroot.position === undefined) {
        form.notify({
            'title': 'Warning',
            'content': `Task id is "${taskId}" app is not an available task app, position not found.`,
            'type': 'warning'
        });
        return false;
    }
    if (exports.systemTaskInfo.taskId > 0) {
        form.notify({
            'title': 'Info',
            'content': 'More than 1 system-level task application is currently running.',
            'type': 'info'
        });
    }
    exports.systemTaskInfo.taskId = taskId;
    exports.systemTaskInfo.formId = formId;
    form.simpleSystemTaskRoot.forms = {};
    refreshSystemPosition();
    return true;
}
function clearSystem(taskId) {
    if (!taskId) {
        return false;
    }
    if (typeof taskId === 'string') {
        taskId = parseInt(taskId);
    }
    if (exports.systemTaskInfo.taskId !== taskId) {
        return false;
    }
    exports.systemTaskInfo.taskId = 0;
    exports.systemTaskInfo.formId = 0;
    exports.systemTaskInfo.length = 0;
    core.trigger('screenResize');
    const tasks = getList();
    for (const taskId in tasks) {
        const forms = form.getList(parseInt(taskId));
        for (const formId in forms) {
            const f = forms[formId];
            if (!f.stateMin) {
                continue;
            }
            form.simpleSystemTaskRoot.forms[formId] = {
                'title': f.title,
                'icon': f.icon
            };
        }
    }
    return true;
}
function refreshSystemPosition() {
    if (exports.systemTaskInfo.taskId > 0) {
        const form = exports.list[exports.systemTaskInfo.taskId].forms[exports.systemTaskInfo.formId];
        switch (core.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 0);
                form.vroot.$refs.form.setPropData('height', window.innerHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', window.innerWidth);
                form.vroot.$refs.form.setPropData('height', 0);
                break;
            }
        }
        setTimeout(function () {
            switch (core.config['task.position']) {
                case 'left': {
                    exports.systemTaskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'right': {
                    exports.systemTaskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', window.innerWidth - exports.systemTaskInfo.length);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'top': {
                    exports.systemTaskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'bottom': {
                    exports.systemTaskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', window.innerHeight - exports.systemTaskInfo.length);
                    break;
                }
            }
            core.trigger('screenResize');
        }, 50);
    }
    else {
        core.trigger('screenResize');
    }
}
