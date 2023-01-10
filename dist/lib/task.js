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
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSystemPosition = exports.clearSystem = exports.setSystem = exports.systemTaskInfo = exports.sleep = exports.removeTimer = exports.createTimer = exports.clearLocaleLang = exports.setLocaleLang = exports.setLocale = exports.clearLocale = exports.loadLocale = exports.loadLocaleData = exports.end = exports.checkPermission = exports.run = exports.getList = exports.getPermissions = exports.get = exports.offFrame = exports.onFrame = exports.getFocus = exports.setFocus = exports.lastId = exports.list = void 0;
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
    focusId = id !== null && id !== void 0 ? id : null;
}
exports.setFocus = setFocus;
function getFocus() {
    return focusId;
}
exports.getFocus = getFocus;
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
    }
};
let frameTimer = 0;
const frameMaps = {};
function onFrame(fun, opt = {}) {
    var _a;
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
    const count = (_a = opt.count) !== null && _a !== void 0 ? _a : 0;
    let c = 0;
    let timer;
    const timerHandler = () => __awaiter(this, void 0, void 0, function* () {
        ++c;
        if (formId && task.forms[formId] === undefined) {
            delete task.timers['1x' + ft.toString()];
            delete frameMaps[ft];
            return;
        }
        yield fun();
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
                        console.log(e);
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
                    console.log(e);
                });
            });
            frameMaps[ft] = timer;
        }
    });
    timer = requestAnimationFrame(function () {
        timerHandler().catch(function (e) {
            console.log(e);
        });
    });
    frameMaps[ft] = timer;
    task.timers['1x' + ft.toString()] = formId !== null && formId !== void 0 ? formId : 0;
    return ft;
}
exports.onFrame = onFrame;
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
exports.offFrame = offFrame;
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
exports.get = get;
function getPermissions(tid) {
    if (exports.list[tid] === undefined) {
        return [];
    }
    return tool.clone(exports.list[tid].runtime.permissions);
}
exports.getPermissions = getPermissions;
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
exports.getList = getList;
function run(url, opt = {}, ntid) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (!url.endsWith('/') && !url.endsWith('.cga')) {
            return 0;
        }
        let icon = __dirname + '/../icon.png';
        if (opt.icon) {
            icon = opt.icon;
        }
        if (opt.notify === undefined) {
            opt.notify = true;
        }
        const notifyId = opt.notify ? form.notify({
            'title': (_b = (_a = localeData[core.config.locale]) === null || _a === void 0 ? void 0 : _a.loading) !== null && _b !== void 0 ? _b : localeData['en'].loading,
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
        const app = yield core.fetchApp(url, {
            'notifyId': notifyId,
            'progress': opt.progress
        }, ntid);
        if (notifyId) {
            setTimeout(function () {
                form.hideNotify(notifyId);
            }, 2000);
        }
        if (!app) {
            return -1;
        }
        const taskId = ++exports.lastId;
        const unblock = opt.unblock ? tool.clone(opt.unblock) : [];
        const unblockSys = [
            'require',
            '__awaiter', 'eval', 'Math', 'Array', 'Blob', 'Error', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON', 'fetch', 'Number', 'Object'
        ];
        for (const name of unblockSys) {
            if (unblock.includes(name)) {
                continue;
            }
            unblock.push(name);
        }
        const invoke = {};
        if (!unblock.includes('window')) {
            invoke.window = {};
            for (const name of unblock) {
                if (window[name] === undefined) {
                    continue;
                }
                invoke.window[name] = window[name];
            }
        }
        const ks = Object.getOwnPropertyNames(window);
        for (const k of ks) {
            if (k.includes('window')) {
                continue;
            }
            if (k.includes('Event')) {
                continue;
            }
            if (k.includes('-')) {
                continue;
            }
            if (/^[0-9]+$/.test(k)) {
                continue;
            }
            if (unblock.includes(k)) {
                continue;
            }
            invoke[k] = undefined;
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
        if (!unblock.includes('Object')) {
            invoke.Object = {
                defineProperty: function () {
                    return;
                },
                keys: function (o) {
                    return Object.keys(o);
                },
                assign: function (o, o2) {
                    if (o.controlName !== undefined) {
                        return o;
                    }
                    return Object.assign(o, o2);
                }
            };
        }
        invoke.navigator = {};
        if (navigator.clipboard) {
            invoke.navigator.clipboard = navigator.clipboard;
        }
        invoke.invokeClickgo = {
            getVersion: function () {
                return clickgo.getVersion();
            },
            isNative() {
                return clickgo.isNative();
            },
            getPlatform() {
                return clickgo.getPlatform();
            },
            isImmersion() {
                return clickgo.isImmersion();
            },
            hasFrame() {
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
                'AbstractApp': class extends core.AbstractApp {
                    main() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return;
                        });
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
                }
            },
            'dom': {
                setGlobalCursor: function (type) {
                    dom.setGlobalCursor(type);
                },
                hasTouchButMouse: function (e) {
                    return dom.hasTouchButMouse(e);
                },
                getStyleCount: function (taskId, type) {
                    return dom.getStyleCount(taskId, type);
                },
                watchSize: function (el, cb, immediate = false) {
                    return dom.watchSize(el, cb, immediate, taskId);
                },
                unwatchSize: function (el) {
                    dom.unwatchSize(el, taskId);
                },
                isWatchSize(el) {
                    return dom.isWatchSize(el);
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
                watchProperty(el, name, cb, immediate = false) {
                    dom.watchProperty(el, name, cb, immediate);
                },
                isWatchProperty(el) {
                    return dom.isWatchProperty(el);
                },
                bindClick(e, handler) {
                    dom.bindClick(e, handler);
                },
                bindDown: function (oe, opt) {
                    dom.bindDown(oe, opt);
                },
                bindGesture: function (oe, before, handler) {
                    dom.bindGesture(oe, before, handler);
                },
                bindLong: function (e, long) {
                    dom.bindLong(e, long);
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
                findParentByData: function (el, name) {
                    return dom.findParentByData(el, name);
                },
                findParentByClass: function (el, name) {
                    return dom.findParentByClass(el, name);
                },
                siblings: function (el) {
                    return dom.siblings(el);
                },
                siblingsData: function (el, name) {
                    return dom.siblingsData(el, name);
                },
                fullscreen: function () {
                    return dom.fullscreen();
                }
            },
            'form': {
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
                notify: function (opt) {
                    return form.notify(opt);
                },
                notifyProgress: function (notifyId, per) {
                    form.notifyProgress(notifyId, per);
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
                readDir(path, options = {}) {
                    return fs.readDir(path, options, taskId);
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
                max: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtn = yield checkPermission('native.form', false, undefined, taskId);
                        if (!rtn[0]) {
                            return;
                        }
                        yield native.max();
                    });
                },
                min: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtn = yield checkPermission('native.form', false, undefined, taskId);
                        if (!rtn[0]) {
                            return;
                        }
                        yield native.min();
                    });
                },
                restore: function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtn = yield checkPermission('native.form', false, undefined, taskId);
                        if (!rtn[0]) {
                            return;
                        }
                        yield native.restore();
                    });
                },
                size: function (width, height) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtn = yield checkPermission('native.form', false, undefined, taskId);
                        if (!rtn[0]) {
                            return;
                        }
                        yield native.size(width, height);
                    });
                },
                maximizable: function (val) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const rtn = yield checkPermission('native.form', false, undefined, taskId);
                        if (!rtn[0]) {
                            return;
                        }
                        yield native.maximizable(val);
                    });
                },
                ping: function (val) {
                    return native.ping(val);
                },
                isMax: function () {
                    return native.isMax();
                }
            },
            'task': {
                getFocus() {
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
                    var _a;
                    if (opt.unblock) {
                        const inUnblock = [];
                        for (const item of opt.unblock) {
                            if (!unblock.includes(item)) {
                                continue;
                            }
                            inUnblock.push(item);
                        }
                        opt.unblock = inUnblock;
                    }
                    if (opt.permissions) {
                        if (!((_a = exports.list[taskId]) === null || _a === void 0 ? void 0 : _a.runtime.permissions.includes('root'))) {
                            opt.permissions = undefined;
                        }
                    }
                    return run(url, opt, taskId);
                },
                checkPermission: function (vals, apply = false, applyHandler) {
                    return checkPermission(vals, apply, applyHandler, taskId);
                },
                end: function (tid) {
                    return end(tid !== null && tid !== void 0 ? tid : taskId);
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
                load: function (theme) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!theme) {
                            return false;
                        }
                        return clickgo.theme.load(theme, taskId);
                    });
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
                blob2ArrayBuffer: function (blob) {
                    return tool.blob2ArrayBuffer(blob);
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
                rgb2hsl: function (rgb) {
                    return tool.rgb2hsl(rgb);
                },
                request: function (url, opt) {
                    return tool.request(url, opt);
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
            code = code.replace(/extends[\s\S]+?\.\s*(AbstractApp|AbstractForm)\s*{/, (t) => {
                return t + 'get filename() {return __filename;}';
            });
            return code;
        };
        app.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
        const path = url;
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
                'permissions': (_c = opt.permissions) !== null && _c !== void 0 ? _c : []
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
                const lcontent = yield fs.getContent(path, {
                    'encoding': 'utf8'
                }, taskId);
                if (!lcontent) {
                    continue;
                }
                try {
                    const data = JSON.parse(lcontent);
                    loadLocaleData(locale, data, '', taskId);
                }
                catch (_e) {
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
        if (!(expo === null || expo === void 0 ? void 0 : expo.default)) {
            delete exports.list[taskId];
            return -3;
        }
        dom.createToStyleList(taskId);
        const r = yield control.init(taskId, invoke);
        if (r < 0) {
            dom.removeFromStyleList(taskId);
            delete exports.list[taskId];
            return -400 + r;
        }
        if ((_d = app.config.themes) === null || _d === void 0 ? void 0 : _d.length) {
            for (let path of app.config.themes) {
                path += '.cgt';
                path = tool.urlResolve('/', path);
                const file = yield fs.getContent(path, undefined, taskId);
                if (file && typeof file !== 'string') {
                    const th = yield theme.read(file);
                    if (th) {
                        yield theme.load(th, taskId);
                    }
                }
            }
        }
        else {
            if (theme.global) {
                yield theme.load(undefined, taskId);
            }
        }
        if (app.config.style) {
            const style = yield fs.getContent(app.config.style + '.css', {
                'encoding': 'utf8'
            }, taskId);
            if (style) {
                const r = tool.stylePrepend(style, 'cg-task' + taskId.toString() + '_');
                dom.pushStyle(taskId, yield tool.styleUrl2DataUrl(app.config.style, r.style, app.files));
            }
        }
        core.trigger('taskStarted', taskId);
        if (app.config.permissions) {
            yield checkPermission(app.config.permissions, true, undefined, taskId);
        }
        const appCls = new expo.default();
        exports.list[taskId].class = appCls;
        yield appCls.main();
        return taskId;
    });
}
exports.run = run;
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
        'root': '<b>Danger!</b> Highest authorization! Please confirm whether to authorize?',
        'apply-permission': 'is applying for permissions, please check carefully',
        'native.form': 'Native window control',
        'hash': 'Can modify the location hash',
        'fs': 'File system',
        'readonly': 'Read only',
        'read-write': 'Read and write'
    },
    'ja': {
        'unknown': '不明な許可',
        'root': '<b>危険！</b>最高の許可！承認するかどうかを確認してください！',
        'apply-permission': '許可申請中、よくご確認ください',
        'native.form': 'ローカルウィンドウを操作する',
        'hash': '網址の hash 変更可能',
        'fs': '資料システム',
        'readonly': '読み取り専用',
        'read-write': '読み書き'
    }
};
function checkPermission(vals, apply = false, applyHandler, taskId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __awaiter(this, void 0, void 0, function* () {
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
            let html = '<div>"' + tool.escapeHTML(task.app.config.name) + '" ' + (((_b = (_a = locale[core.config.locale]) === null || _a === void 0 ? void 0 : _a['apply-permission']) !== null && _b !== void 0 ? _b : locale['en']['apply-permission']) + ':') + '</div>';
            for (const item of applyList) {
                if (item.startsWith('fs.')) {
                    const path = item.slice(3, -1);
                    html += '<div style="margin-top: 10px;">' +
                        ((_d = (_c = locale[core.config.locale]) === null || _c === void 0 ? void 0 : _c.fs) !== null && _d !== void 0 ? _d : locale['en'].fs) + ' ' + tool.escapeHTML(path) + ' ' + (item.endsWith('r') ? ((_f = (_e = locale[core.config.locale]) === null || _e === void 0 ? void 0 : _e.readonly) !== null && _f !== void 0 ? _f : locale['en'].readonly) : ((_h = (_g = locale[core.config.locale]) === null || _g === void 0 ? void 0 : _g['read-write']) !== null && _h !== void 0 ? _h : locale['en']['read-write'])) +
                        '<div style="color: var(--system-border-color);">' + tool.escapeHTML(item) + '</div>' +
                        '</div>';
                    continue;
                }
                const lang = (_k = (_j = locale[core.config.locale]) === null || _j === void 0 ? void 0 : _j[item]) !== null && _k !== void 0 ? _k : locale['en'][item];
                html += '<div style="margin-top: 10px;">' +
                    ((_m = lang !== null && lang !== void 0 ? lang : (_l = locale[core.config.locale]) === null || _l === void 0 ? void 0 : _l.unknown) !== null && _m !== void 0 ? _m : locale['en'].unknown) +
                    '<div style="color: var(--system-border-color);">' + tool.escapeHTML(item) + '</div>' +
                    '</div>';
            }
            if (yield form.superConfirm(html)) {
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
                    applyHandler === null || applyHandler === void 0 ? void 0 : applyHandler(applyList);
                }
                catch (e) {
                    console.log('task.checkPermission', e);
                }
            }
        }
        return rtn;
    });
}
exports.checkPermission = checkPermission;
function end(taskId) {
    var _a;
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
        (_a = form.elements.popList.querySelector('[data-form-id="' + f.id.toString() + '"]')) === null || _a === void 0 ? void 0 : _a.remove();
        dom.clearWatchStyle(fid);
        dom.clearWatchProperty(fid);
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
exports.end = end;
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
exports.loadLocaleData = loadLocaleData;
function loadLocale(lang, path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId) {
            return false;
        }
        const task = exports.list[taskId];
        if (!task) {
            return false;
        }
        path = tool.urlResolve(task.current + '/', path) + '.json';
        const fcontent = yield fs.getContent(path, {
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
        catch (_a) {
            return false;
        }
    });
}
exports.loadLocale = loadLocale;
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
exports.clearLocale = clearLocale;
function setLocale(lang, path, taskId) {
    clearLocale(taskId);
    return loadLocale(lang, path, taskId);
}
exports.setLocale = setLocale;
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
exports.setLocaleLang = setLocaleLang;
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
exports.clearLocaleLang = clearLocaleLang;
function createTimer(fun, delay, opt = {}) {
    var _a;
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
    const count = (_a = opt.count) !== null && _a !== void 0 ? _a : 0;
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
    task.timers[timer] = formId !== null && formId !== void 0 ? formId : 0;
    return timer;
}
exports.createTimer = createTimer;
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
exports.removeTimer = removeTimer;
function sleep(fun, delay, taskId) {
    return createTimer(fun, delay, {
        'taskId': taskId,
        'count': 1
    });
}
exports.sleep = sleep;
exports.systemTaskInfo = clickgo.vue.reactive({
    'taskId': 0,
    'formId': 0,
    'length': 0
});
clickgo.vue.watch(exports.systemTaskInfo, function (n, o) {
    var _a, _b;
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
        exports.systemTaskInfo[key] = (_a = o[key]) !== null && _a !== void 0 ? _a : 0;
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
        exports.systemTaskInfo[key] = (_b = o[key]) !== null && _b !== void 0 ? _b : 0;
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
exports.setSystem = setSystem;
function clearSystem(taskId) {
    if (!taskId) {
        return false;
    }
    if (typeof taskId !== 'number') {
        form.notify({
            'title': 'Warning',
            'content': 'The "formId" of "clearTask" must be a number type.',
            'type': 'warning'
        });
        return false;
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
exports.clearSystem = clearSystem;
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
exports.refreshSystemPosition = refreshSystemPosition;
