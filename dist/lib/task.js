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
exports.refreshSystemPosition = exports.clearSystem = exports.setSystem = exports.systemTaskInfo = exports.sleep = exports.removeTimer = exports.createTimer = exports.clearLocaleLang = exports.setLocaleLang = exports.setLocale = exports.clearLocale = exports.loadLocale = exports.loadLocaleData = exports.end = exports.run = exports.getList = exports.get = exports.offFrame = exports.onFrame = exports.isMain = exports.setMain = exports.lastId = exports.list = void 0;
const clickgo = require("../clickgo");
const core = require("./core");
const dom = require("./dom");
const tool = require("./tool");
const form = require("./form");
const control = require("./control");
const fs = require("./fs");
const native = require("./native");
exports.list = {};
exports.lastId = 0;
let mainTaskId = 0;
function setMain(taskId) {
    if (mainTaskId > 0) {
        return false;
    }
    mainTaskId = taskId;
    return true;
}
exports.setMain = setMain;
function isMain(taskId) {
    return taskId === mainTaskId;
}
exports.isMain = isMain;
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
        'name': exports.list[tid].config.name,
        'locale': exports.list[tid].locale.lang,
        'customTheme': exports.list[tid].customTheme,
        'formCount': Object.keys(exports.list[tid].forms).length,
        'icon': exports.list[tid].app.icon,
        'path': exports.list[tid].path,
        'current': exports.list[tid].current
    };
}
exports.get = get;
function getList() {
    const rtn = {};
    for (const tid in exports.list) {
        const item = exports.list[tid];
        rtn[tid] = {
            'name': item.config.name,
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
function run(url, opt = {}) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let ntask = null;
        if (opt.taskId) {
            ntask = exports.list[opt.taskId];
        }
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
        const app = yield core.fetchApp(url, {
            'notifyId': notifyId,
            'current': ntask ? ntask.current : undefined,
            'progress': opt.progress
        });
        if (!app) {
            if (notifyId) {
                setTimeout(function () {
                    form.hideNotify(notifyId);
                }, 2000);
            }
            return -1;
        }
        if (notifyId && !app.net) {
            setTimeout(function () {
                form.hideNotify(notifyId);
            }, 2000);
        }
        const taskId = ++exports.lastId;
        const unblock = (_c = opt.unblock) !== null && _c !== void 0 ? _c : [];
        const invoke = {};
        if (!unblock.includes('window')) {
            invoke.window = undefined;
        }
        const ks = Object.getOwnPropertyNames(window);
        for (const k of ks) {
            if (k.includes('Event')) {
                continue;
            }
            if (k.includes('-')) {
                continue;
            }
            if (/^[0-9]+$/.test(k)) {
                continue;
            }
            if ([
                'require',
                '__awaiter', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON', 'fetch'
            ].includes(k)) {
                continue;
            }
            if (unblock.includes(k)) {
                continue;
            }
            invoke[k] = undefined;
        }
        invoke.console = {
            log: function (message, ...optionalParams) {
                console.log(message, ...optionalParams);
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
            getNative() {
                return clickgo.getNative();
            },
            getPlatform() {
                return clickgo.getPlatform();
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
                initModules: function (names) {
                    return clickgo.core.initModules(names);
                },
                getModule: function (name) {
                    return clickgo.core.getModule(name);
                },
                readApp: function (blob) {
                    return clickgo.core.readApp(blob);
                },
                getAvailArea: function () {
                    return clickgo.core.getAvailArea();
                }
            },
            'dom': {
                setGlobalCursor: function (type) {
                    clickgo.dom.setGlobalCursor(type);
                },
                hasTouchButMouse: function (e) {
                    return clickgo.dom.hasTouchButMouse(e);
                },
                getStyleCount: function (taskId, type) {
                    return clickgo.dom.getStyleCount(taskId, type);
                },
                getSize: function (el) {
                    return clickgo.dom.getSize(el);
                },
                watchSize: function (el, cb, immediate = false) {
                    return clickgo.dom.watchSize(el, cb, immediate, taskId);
                },
                unwatchSize: function (el) {
                    clickgo.dom.unwatchSize(el, taskId);
                },
                clearWatchSize() {
                    clickgo.dom.clearWatchSize(taskId);
                },
                watch: function (el, cb, mode = 'default', immediate = false) {
                    clickgo.dom.watch(el, cb, mode, immediate, taskId);
                },
                unwatch: function (el) {
                    clickgo.dom.unwatch(el, taskId);
                },
                clearWatch: function () {
                    clickgo.dom.clearWatch(taskId);
                },
                watchStyle: function (el, name, cb, immediate = false) {
                    clickgo.dom.watchStyle(el, name, cb, immediate);
                },
                isWatchStyle: function (el) {
                    return clickgo.dom.isWatchStyle(el);
                },
                bindDown: function (oe, opt) {
                    clickgo.dom.bindDown(oe, opt);
                },
                bindGesture: function (e, opt) {
                    clickgo.dom.bindGesture(e, opt);
                },
                bindLong: function (e, long) {
                    clickgo.dom.bindLong(e, long);
                },
                bindDrag: function (e, opt) {
                    clickgo.dom.bindDrag(e, opt);
                },
                'is': clickgo.dom.is,
                bindMove: function (e, opt) {
                    return clickgo.dom.bindMove(e, opt);
                },
                bindResize: function (e, opt) {
                    clickgo.dom.bindResize(e, opt);
                },
                findParentByData: function (el, name) {
                    return clickgo.dom.findParentByData(el, name);
                },
                findParentByClass: function (el, name) {
                    return clickgo.dom.findParentByClass(el, name);
                },
                siblings: function (el) {
                    return clickgo.dom.siblings(el);
                },
                siblingsData: function (el, name) {
                    return clickgo.dom.siblingsData(el, name);
                },
                fullscreen: function () {
                    return clickgo.dom.fullscreen();
                }
            },
            'form': {
                'AbstractForm': class extends form.AbstractForm {
                    get taskId() {
                        return taskId;
                    }
                },
                min: function (fid) {
                    return clickgo.form.min(fid);
                },
                max: function max(fid) {
                    return clickgo.form.max(fid);
                },
                close: function (fid) {
                    return clickgo.form.close(fid);
                },
                bindResize: function (e, border) {
                    clickgo.form.bindResize(e, border);
                },
                bindDrag: function (e) {
                    clickgo.form.bindDrag(e);
                },
                getTaskId: function (fid) {
                    return clickgo.form.getTaskId(fid);
                },
                get: function (fid) {
                    return clickgo.form.get(fid);
                },
                getList: function (tid) {
                    return clickgo.form.getList(tid);
                },
                changeFocus: function (fid = 0) {
                    clickgo.form.changeFocus(fid);
                },
                getMaxZIndexID: function (out) {
                    return clickgo.form.getMaxZIndexID(out);
                },
                getRectByBorder: function (border) {
                    return clickgo.form.getRectByBorder(border);
                },
                showCircular: function (x, y) {
                    clickgo.form.showCircular(x, y);
                },
                moveRectangle: function (border) {
                    clickgo.form.moveRectangle(border);
                },
                showRectangle: function (x, y, border) {
                    clickgo.form.showRectangle(x, y, border);
                },
                hideRectangle: function () {
                    clickgo.form.hideRectangle();
                },
                showDrag: function () {
                    clickgo.form.showDrag();
                },
                moveDrag: function (opt) {
                    clickgo.form.moveDrag(opt);
                },
                hideDrag: function () {
                    clickgo.form.hideDrag();
                },
                notify: function (opt) {
                    return clickgo.form.notify(opt);
                },
                notifyProgress: function (notifyId, per) {
                    clickgo.form.notifyProgress(notifyId, per);
                },
                hideNotify: function (notifyId) {
                    clickgo.form.hideNotify(notifyId);
                },
                showPop: function (el, pop, direction, opt = {}) {
                    clickgo.form.showPop(el, pop, direction, opt);
                },
                hidePop: function (pop) {
                    clickgo.form.hidePop(pop);
                },
                dialog: function (opt) {
                    if (typeof opt === 'string') {
                        opt = {
                            'content': opt
                        };
                    }
                    opt.taskId = taskId;
                    return clickgo.form.dialog(opt);
                },
                confirm: function (opt) {
                    if (typeof opt === 'string') {
                        opt = {
                            'content': opt
                        };
                    }
                    opt.taskId = taskId;
                    return clickgo.form.confirm(opt);
                },
                flash: function (fid) {
                    clickgo.form.flash(fid, taskId);
                },
                showLauncher: function () {
                    clickgo.form.showLauncher();
                },
                hideLauncher: function () {
                    clickgo.form.hideLauncher();
                }
            },
            'fs': {
                getContent: function (path, options = {}) {
                    if (!options.files) {
                        options.files = exports.list[taskId].app.files;
                    }
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.getContent(path, options);
                },
                putContent: function (path, data, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.putContent(path, data, options);
                },
                readLink: function (path, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.readLink(path, options);
                },
                symlink: function (fPath, linkPath, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.symlink(fPath, linkPath, options);
                },
                unlink: function (path, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.unlink(path, options);
                },
                stats: function (path, options = {}) {
                    if (!options.files) {
                        options.files = exports.list[taskId].app.files;
                    }
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.stats(path, options);
                },
                isDir: function (path, options = {}) {
                    if (!options.files) {
                        options.files = exports.list[taskId].app.files;
                    }
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.isDir(path, options);
                },
                isFile: function (path, options = {}) {
                    if (!options.files) {
                        options.files = exports.list[taskId].app.files;
                    }
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.isFile(path, options);
                },
                mkdir: function (path, mode, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.mkdir(path, mode, options);
                },
                rmdir: function (path, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.rmdir(path, options);
                },
                rmdirDeep: function (path, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.rmdirDeep(path, options);
                },
                chmod: function (path, mod, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.chmod(path, mod, options);
                },
                rename(oldPath, newPath, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.rename(oldPath, newPath, options);
                },
                readDir(path, options = {}) {
                    if (!options.files) {
                        options.files = exports.list[taskId].app.files;
                    }
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.readDir(path, options);
                },
                copyFolder(from, to, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.copyFolder(from, to, options);
                },
                copyFile(src, dest, options = {}) {
                    if (!options.current) {
                        options.current = exports.list[taskId].current;
                    }
                    return clickgo.fs.copyFile(src, dest, options);
                }
            },
            'native': {
                invoke: function (name, ...param) {
                    return clickgo.native.invoke(name, ...param);
                },
                max: function () {
                    clickgo.native.max();
                },
                min: function () {
                    clickgo.native.min();
                },
                restore: function () {
                    clickgo.native.restore();
                },
                size: function (width, height) {
                    clickgo.native.size(width, height);
                }
            },
            'task': {
                isMain(taskId) {
                    return isMain(taskId);
                },
                onFrame: function (fun, opt = {}) {
                    opt.taskId = taskId;
                    return clickgo.task.onFrame(fun, opt);
                },
                offFrame: function (ft, opt = {}) {
                    opt.taskId = taskId;
                    clickgo.task.offFrame(ft, opt);
                },
                get: function (tid) {
                    return clickgo.task.get(tid);
                },
                getList: function () {
                    return clickgo.task.getList();
                },
                run: function (url, opt = {}) {
                    opt.taskId = taskId;
                    opt.main = false;
                    return clickgo.task.run(url, opt);
                },
                end: function (tid) {
                    return clickgo.task.end(tid !== null && tid !== void 0 ? tid : taskId);
                },
                loadLocaleData: function (lang, data, pre = '') {
                    clickgo.task.loadLocaleData(lang, data, pre, taskId);
                },
                loadLocale: function (lang, path) {
                    return clickgo.task.loadLocale(lang, path, taskId);
                },
                clearLocale: function () {
                    clickgo.task.clearLocale(taskId);
                },
                setLocale: function (lang, path) {
                    return clickgo.task.setLocale(lang, path, taskId);
                },
                setLocaleLang: function (lang) {
                    clickgo.task.setLocaleLang(lang, taskId);
                },
                clearLocaleLang: function () {
                    clickgo.task.clearLocaleLang(taskId);
                },
                createTimer: function (fun, delay, opt = {}) {
                    opt.taskId = taskId;
                    return clickgo.task.createTimer(fun, delay, opt);
                },
                removeTimer: function (timer) {
                    clickgo.task.removeTimer(timer, taskId);
                },
                sleep: function (fun, delay) {
                    return clickgo.task.sleep(fun, delay, taskId);
                },
                systemTaskInfo: clickgo.task.systemTaskInfo,
                setSystem: function (fid) {
                    return clickgo.task.setSystem(fid, taskId);
                },
                clearSystem: function () {
                    return clickgo.task.clearSystem(taskId);
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
                    return clickgo.tool.blob2ArrayBuffer(blob);
                },
                clone: function (obj) {
                    return clickgo.tool.clone(obj);
                },
                sleep: function (ms = 0) {
                    return clickgo.tool.sleep(ms);
                },
                purify: function (text) {
                    return clickgo.tool.purify(text);
                },
                rand: function (min, max) {
                    return clickgo.tool.rand(min, max);
                },
                'RANDOM_N': clickgo.tool.RANDOM_N,
                'RANDOM_U': clickgo.tool.RANDOM_U,
                'RANDOM_L': clickgo.tool.RANDOM_L,
                'RANDOM_UN': clickgo.tool.RANDOM_UN,
                'RANDOM_LN': clickgo.tool.RANDOM_LN,
                'RANDOM_LU': clickgo.tool.RANDOM_LU,
                'RANDOM_LUN': clickgo.tool.RANDOM_LUN,
                'RANDOM_V': clickgo.tool.RANDOM_V,
                'RANDOM_LUNS': clickgo.tool.RANDOM_LUNS,
                random: function (length = 8, source = clickgo.tool.RANDOM_LN, block = '') {
                    return clickgo.tool.random(length, source, block);
                },
                getBoolean: function (param) {
                    return clickgo.tool.getBoolean(param);
                },
                escapeHTML: function (html) {
                    return clickgo.tool.escapeHTML(html);
                },
                request: function (url, opt) {
                    return clickgo.tool.request(url, opt);
                },
                parseUrl: function (url) {
                    return clickgo.tool.parseUrl(url);
                },
                urlResolve: function (from, to) {
                    return clickgo.tool.urlResolve(from, to);
                },
                blob2Text: function (blob) {
                    return clickgo.tool.blob2Text(blob);
                },
                blob2DataUrl: function (blob) {
                    return clickgo.tool.blob2DataUrl(blob);
                },
                execCommand: function (ac) {
                    clickgo.tool.execCommand(ac);
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
                'permissions': {},
                'dialogFormIds': []
            }),
            'forms': {},
            'controls': {},
            'timers': {},
            'invoke': invoke
        };
        let expo = [];
        try {
            expo = loader.require('/app.js', app.files, {
                'dir': '/',
                'invoke': invoke,
                'preprocess': preprocess,
                'map': {
                    'clickgo': '/invoke/clickgo'
                }
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
        const appCls = new expo.default();
        yield appCls.main();
        if (!exports.list[taskId].class) {
            delete exports.list[taskId];
            dom.removeFromStyleList(taskId);
            return -4;
        }
        core.trigger('taskStarted', taskId);
        if (taskId === 1) {
            native.invoke('cg-init', native.getToken());
        }
        return taskId;
    });
}
exports.run = run;
function end(taskId) {
    const task = exports.list[taskId];
    if (!task) {
        return true;
    }
    if (clickgo.getNative() && isMain(taskId)) {
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
        core.trigger('formRemoved', taskId, f.id, f.vroot.$refs.form.title, f.vroot.$refs.form.iconData);
        try {
            f.vapp.unmount();
        }
        catch (err) {
            const msg = `Message: ${err.message}\nTask id: ${task.id}\nForm id: ${fid}\nFunction: task.end, unmount.`;
            form.notify({
                'title': 'Runtime Error',
                'content': msg,
                'type': 'danger'
            });
            console.log('Runtime Error', msg, err);
        }
        f.vapp._container.remove();
    }
    const flist = document.querySelectorAll('#cg-form-list > [data-task-id="' + taskId.toString() + '"]');
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
            'encoding': 'utf8',
            'files': task.app.files,
            'current': task.current
        });
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
