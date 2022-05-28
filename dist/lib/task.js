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
exports.refreshSystemPosition = exports.clearSystem = exports.setSystem = exports.systemTaskInfo = exports.sleep = exports.removeTimer = exports.createTimer = exports.clearLocaleLang = exports.setLocaleLang = exports.setLocale = exports.clearLocale = exports.loadLocale = exports.loadLocaleData = exports.end = exports.run = exports.getList = exports.get = exports.offFrame = exports.onFrame = exports.lastId = exports.list = void 0;
const core = require("./core");
const control = require("./control");
const dom = require("./dom");
const tool = require("./tool");
const form = require("./form");
const theme = require("./theme");
const fs = require("./fs");
const native = require("./native");
exports.list = {};
exports.lastId = 0;
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
    var _a, _b;
    const taskId = opt.taskId;
    const formId = opt.formId;
    if (!taskId || !formId) {
        return 0;
    }
    const ft = ++frameTimer;
    const scope = (_a = opt.scope) !== null && _a !== void 0 ? _a : 'form';
    const count = (_b = opt.count) !== null && _b !== void 0 ? _b : 0;
    let c = 0;
    let timer;
    const timerHandler = () => __awaiter(this, void 0, void 0, function* () {
        ++c;
        if (exports.list[taskId].forms[formId] === undefined) {
            if (scope === 'form') {
                delete exports.list[taskId].timers['1x' + ft.toString()];
                delete frameMaps[ft];
                return;
            }
        }
        yield fun();
        if (exports.list[taskId].timers['1x' + ft.toString()] == undefined) {
            return;
        }
        if (count > 1) {
            if (c === count) {
                delete exports.list[taskId].timers['1x' + ft.toString()];
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
            delete exports.list[taskId].timers['1x' + ft.toString()];
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
    exports.list[taskId].timers['1x' + ft.toString()] = formId;
    return ft;
}
exports.onFrame = onFrame;
function offFrame(ft, opt = {}) {
    const taskId = opt.taskId;
    if (!taskId) {
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
        'icon': exports.list[tid].icon,
        'path': exports.list[tid].path
    };
}
exports.get = get;
function getList() {
    const rtn = {};
    for (const tid in exports.list) {
        const item = exports.list[tid];
        rtn[tid] = {
            'name': item.app.config.name,
            'locale': item.locale.lang,
            'customTheme': item.customTheme,
            'formCount': Object.keys(item.forms).length,
            'icon': item.icon,
            'path': item.path
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
        if (opt.progress === undefined) {
            opt.progress = true;
        }
        const notifyId = opt.progress ? form.notify({
            'title': (_b = (_a = localeData[core.config.locale]) === null || _a === void 0 ? void 0 : _a.loading) !== null && _b !== void 0 ? _b : localeData['en'].loading,
            'content': url,
            'icon': opt.icon,
            'timeout': 0,
            'progress': true
        }) : undefined;
        const app = yield core.fetchApp(url, {
            'notifyId': notifyId,
            'current': ntask ? ntask.path : undefined
        });
        if (notifyId) {
            setTimeout(function () {
                form.hideNotify(notifyId);
            }, 2000);
        }
        if (!app) {
            return -1;
        }
        const files = {};
        for (const fpath in app.files) {
            files[fpath] = app.files[fpath];
        }
        const taskId = ++exports.lastId;
        exports.list[taskId] = {
            'id': taskId,
            'app': app,
            'customTheme': false,
            'locale': Vue.reactive({
                'lang': '',
                'data': {}
            }),
            'icon': (_c = app.icon) !== null && _c !== void 0 ? _c : icon,
            'path': url,
            'files': files,
            'permissions': {},
            'forms': {},
            'objectURLs': [],
            'controls': {
                'loaded': {},
                'layout': {},
                'prep': {}
            },
            'timers': {}
        };
        const task = exports.list[taskId];
        for (let path of app.config.controls) {
            path += '.cgc';
            path = tool.urlResolve('/', path);
            const file = yield fs.getContent(path, {
                'files': task.files
            });
            if (file && typeof file !== 'string') {
                const c = yield control.read(file);
                if (c) {
                    task.controls.loaded[path] = c;
                }
                else {
                    form.notify({
                        'title': 'Control failed to load',
                        'content': path
                    });
                }
            }
        }
        if (app.config.themes) {
            for (let path of app.config.themes) {
                path += '.cgt';
                path = tool.urlResolve('/', path);
                const file = yield fs.getContent(path, {
                    'files': task.files
                });
                if (file && typeof file !== 'string') {
                    const th = yield theme.read(file);
                    if (th) {
                        yield theme.load(th, taskId);
                    }
                }
            }
        }
        if (app.config.locales) {
            for (let path in app.config.locales) {
                const locale = app.config.locales[path];
                if (!path.endsWith('.json')) {
                    path += '.json';
                }
                const lcontent = yield fs.getContent(path, {
                    'encoding': 'utf8',
                    'files': task.files,
                    'current': task.path
                });
                if (!lcontent) {
                    continue;
                }
                try {
                    const data = JSON.parse(lcontent);
                    loadLocaleData(locale, data, '', task.id);
                }
                catch (_d) {
                }
            }
        }
        core.trigger('taskStarted', task.id);
        dom.createToStyleList(task.id);
        const f = yield form.create({
            'taskId': task.id,
            'file': app.config.main
        });
        if (typeof f === 'number') {
            delete exports.list[task.id];
            dom.removeFromStyleList(task.id);
            core.trigger('taskEnded', task.id);
            return f - 100;
        }
        if (app.config.style && app.files[app.config.style + '.css']) {
            const style = app.files[app.config.style + '.css'];
            const r = tool.stylePrepend(style, 'cg-task' + task.id.toString() + '_');
            dom.pushStyle(task.id, yield tool.styleUrl2DataUrl(app.config.style, r.style, app.files));
        }
        if (app.config.themes && app.config.themes.length > 0) {
            task.customTheme = true;
            for (const path of app.config.themes) {
                const blob = yield fs.getContent(path, {
                    'files': task.files,
                    'current': task.path
                });
                if (!(blob instanceof Blob)) {
                    continue;
                }
                const th = yield theme.read(blob);
                if (!th) {
                    continue;
                }
                yield theme.load(th, task.id);
            }
        }
        else {
            if (theme.global) {
                yield theme.load(undefined, task.id);
            }
        }
        return task.id;
    });
}
exports.run = run;
function end(taskId) {
    const task = exports.list[taskId];
    if (!task) {
        return true;
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
        f.vapp.unmount();
        f.vapp._container.remove();
    }
    dom.removeFromStyleList(taskId);
    for (const url of task.objectURLs) {
        tool.revokeObjectURL(url, task.id);
    }
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
    native.clearListener(taskId);
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
function loadLocale(lang, path, taskId, formId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId) {
            return false;
        }
        const task = exports.list[taskId];
        if (!task) {
            return false;
        }
        let form = null;
        if (formId) {
            if (!task.forms[formId]) {
                return false;
            }
            form = task.forms[formId];
        }
        const base = form ? form.vroot.cgPath : '/';
        path = tool.urlResolve(base, path) + '.json';
        const fcontent = yield fs.getContent(path, {
            'encoding': 'utf8',
            'files': task.files,
            'current': task.path
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
function setLocale(lang, path, taskId, formId) {
    clearLocale(taskId);
    return loadLocale(lang, path, taskId, formId);
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
    var _a, _b;
    const taskId = opt.taskId;
    if (!taskId) {
        return 0;
    }
    const formId = opt.formId;
    if (!formId) {
        return 0;
    }
    const scope = (_a = opt.scope) !== null && _a !== void 0 ? _a : 'form';
    const count = (_b = opt.count) !== null && _b !== void 0 ? _b : 0;
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
        if (exports.list[taskId].forms[formId] === undefined) {
            if (scope === 'form') {
                clearTimeout(timer);
                delete exports.list[taskId].timers[timer];
                return;
            }
        }
        const r = fun();
        if (r instanceof Promise) {
            r.catch(function (e) {
                console.log(e);
            });
        }
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete exports.list[taskId].timers[timer];
            return;
        }
    };
    if (count === 1) {
        timer = window.setTimeout(timerHandler, delay);
    }
    else {
        timer = window.setInterval(timerHandler, delay);
    }
    exports.list[taskId].timers[timer] = formId;
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
function sleep(fun, delay, taskId, formId) {
    return createTimer(fun, delay, {
        'taskId': taskId,
        'formId': formId,
        'count': 1
    });
}
exports.sleep = sleep;
exports.systemTaskInfo = Vue.reactive({
    'taskId': 0,
    'formId': 0,
    'length': 0
});
Vue.watch(exports.systemTaskInfo, function (n, o) {
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
    if (!formId || !taskId) {
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
                form.vroot.$refs.form.setPropData('width', 'auto');
                form.vroot.$refs.form.setPropData('height', document.body.clientHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', document.body.clientWidth);
                form.vroot.$refs.form.setPropData('height', 'auto');
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
                    form.vroot.$refs.form.setPropData('left', document.body.clientWidth - exports.systemTaskInfo.length);
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
                    form.vroot.$refs.form.setPropData('top', document.body.clientHeight - exports.systemTaskInfo.length);
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
