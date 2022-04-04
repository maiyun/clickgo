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
exports.offFrame = exports.onFrame = exports.removeTimer = exports.createTimer = exports.loadLocaleData = exports.end = exports.run = exports.getList = exports.get = exports.lastId = exports.list = void 0;
exports.list = {};
exports.lastId = 0;
let localeData = {
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
function get(tid) {
    if (exports.list[tid] === undefined) {
        return null;
    }
    return {
        'name': exports.list[tid].appPkg.config.name,
        'customTheme': exports.list[tid].customTheme,
        'localeName': exports.list[tid].locale.name,
        'formCount': Object.keys(exports.list[tid].forms).length,
        'icon': exports.list[tid].icon,
        'path': exports.list[tid].path
    };
}
exports.get = get;
function getList() {
    let list = {};
    for (let tid in clickgo.task.list) {
        let item = clickgo.task.list[tid];
        list[tid] = {
            'name': item.appPkg.config.name,
            'customTheme': item.customTheme,
            'localeName': item.locale.name,
            'formCount': Object.keys(item.forms).length,
            'icon': item.icon,
            'path': item.path
        };
    }
    return list;
}
exports.getList = getList;
function run(url, opt = {}) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let icon = clickgo.cgRootPath + 'icon.png';
        if (opt.icon) {
            icon = opt.icon;
        }
        if (opt.progress === undefined) {
            opt.progress = true;
        }
        if (!opt.runtime) {
            opt.runtime = {};
        }
        let notifyId = opt.progress ? clickgo.form.notify({
            'title': (_b = (_a = localeData[clickgo.core.config.locale]) === null || _a === void 0 ? void 0 : _a.loading) !== null && _b !== void 0 ? _b : localeData['en'].loading,
            'content': url,
            'icon': opt.icon,
            'timeout': 0,
            'progress': true
        }) : undefined;
        let appPkg = yield clickgo.core.fetchApp(url, {
            'notifyId': notifyId
        });
        if (notifyId) {
            setTimeout(function () {
                clickgo.form.hideNotify(notifyId);
            }, 2000);
        }
        if (!appPkg) {
            return -1;
        }
        let files = {};
        for (let fpath in appPkg.files) {
            files[fpath] = appPkg.files[fpath];
        }
        for (let fpath in opt.runtime) {
            files['/runtime' + fpath] = opt.runtime[fpath];
        }
        let taskId = ++exports.lastId;
        exports.list[taskId] = {
            'id': taskId,
            'appPkg': appPkg,
            'customTheme': false,
            'locale': Vue.reactive({
                'name': '',
                'data': {}
            }),
            'icon': (_c = appPkg.icon) !== null && _c !== void 0 ? _c : icon,
            'path': url,
            'permission': {},
            'controlPkgs': {},
            'themePkgs': {},
            'files': files,
            'forms': {},
            'objectURLs': {},
            'initControls': {},
            'timers': {}
        };
        let task = exports.list[taskId];
        let clickgoFileList = [];
        for (let path of appPkg.config.controls) {
            path += '.cgc';
            if (path.startsWith('/clickgo/')) {
                clickgoFileList.push(path.slice(8));
            }
            else if (task.files[path]) {
                let pkg = yield clickgo.control.read(task.files[path]);
                if (pkg) {
                    task.controlPkgs[path] = pkg;
                }
            }
        }
        if (appPkg.config.themes) {
            for (let path of appPkg.config.themes) {
                path += '.cgt';
                if (path.startsWith('/clickgo/')) {
                    clickgoFileList.push(path.slice(8));
                }
                else if (task.files[path]) {
                    let pkg = yield clickgo.theme.read(task.files[path]);
                    if (pkg) {
                        task.themePkgs[path] = pkg;
                    }
                }
            }
        }
        if (appPkg.config.locales) {
            for (let path in appPkg.config.locales) {
                let localeName = appPkg.config.locales[path];
                path += '.json';
                if (task.files[path]) {
                    try {
                        let data = JSON.parse(task.files[path]);
                        loadLocaleData(task.id, localeName, data);
                    }
                    catch (_d) {
                    }
                }
            }
        }
        if (clickgoFileList.length > 0) {
            try {
                yield new Promise(function (resolve, reject) {
                    let count = 0;
                    for (let file of clickgoFileList) {
                        clickgo.core.fetchClickGoFile(file).then(function (blob) {
                            if (blob === null) {
                                reject();
                                return;
                            }
                            ++count;
                            if (count === clickgoFileList.length) {
                                resolve();
                            }
                        }).catch(function () {
                            reject();
                        });
                    }
                });
            }
            catch (_e) {
                return -2;
            }
        }
        clickgo.core.trigger('taskStarted', task.id);
        clickgo.dom.createToStyleList(task.id);
        let form = yield clickgo.form.create(task.id, {
            'file': appPkg.config.main
        });
        if (typeof form === 'number') {
            for (let name in task.controlPkgs) {
                clickgo.control.revokeObjectURL(task.controlPkgs[name]);
            }
            for (let name in task.themePkgs) {
                clickgo.theme.revokeObjectURL(task.themePkgs[name]);
            }
            delete (exports.list[task.id]);
            clickgo.dom.removeFromStyleList(task.id);
            clickgo.core.trigger('taskEnded', task.id);
            return form - 100;
        }
        if (appPkg.config.style && appPkg.files[appPkg.config.style + '.css']) {
            let style = appPkg.files[appPkg.config.style + '.css'];
            let r = clickgo.tool.stylePrepend(style, 'cg-task' + task.id + '_');
            clickgo.dom.pushStyle(task.id, yield clickgo.tool.styleUrl2ObjectOrDataUrl(appPkg.config.style, r.style, task));
        }
        if (appPkg.config.themes) {
            task.customTheme = true;
            for (let theme of appPkg.config.themes) {
                yield clickgo.theme.load(task.id, theme + '.cgt');
            }
        }
        else {
            if (clickgo.theme.global) {
                yield clickgo.theme.load(task.id);
            }
        }
        return task.id;
    });
}
exports.run = run;
function end(taskId) {
    let task = exports.list[taskId];
    if (!task) {
        return true;
    }
    let fid = clickgo.form.getMaxZIndexFormID({
        'taskIds': [task.id]
    });
    if (fid) {
        clickgo.form.changeFocus(fid);
    }
    else {
        clickgo.form.changeFocus();
    }
    for (let fid in task.forms) {
        let form = task.forms[fid];
        clickgo.core.trigger('formRemoved', taskId, form.id, form.vroot.$refs.form.title, form.vroot.$refs.form.iconData);
        form.vapp.unmount();
        form.vapp._container.remove();
    }
    clickgo.dom.removeFromStyleList(taskId);
    for (let path in task.objectURLs) {
        let url = task.objectURLs[path];
        clickgo.tool.revokeObjectURL(url);
    }
    for (let name in task.controlPkgs) {
        clickgo.control.revokeObjectURL(task.controlPkgs[name]);
    }
    for (let timer in exports.list[taskId].timers) {
        if (timer.slice(0, 2) === '1x') {
            let ft = timer.slice(2);
            cancelAnimationFrame(frameMaps[ft]);
            delete (frameMaps[ft]);
        }
        else {
            clearTimeout(parseFloat(timer));
        }
    }
    delete (exports.list[taskId]);
    clickgo.core.trigger('taskEnded', taskId);
    clickgo.form.clearTask(taskId);
    return true;
}
exports.end = end;
function loadLocaleData(taskId, name, data, pre = '') {
    if (!exports.list[taskId].locale.data[name]) {
        exports.list[taskId].locale.data[name] = {};
    }
    for (let k in data) {
        let v = data[k];
        if (typeof v === 'object') {
            loadLocaleData(taskId, name, v, pre + k + '.');
        }
        else {
            clickgo.task.list[taskId].locale.data[name][pre + k] = v;
        }
    }
}
exports.loadLocaleData = loadLocaleData;
function createTimer(taskId, formId, fun, delay, opt = {}) {
    var _a, _b;
    let scope = (_a = opt.scope) !== null && _a !== void 0 ? _a : 'form';
    let count = (_b = opt.count) !== null && _b !== void 0 ? _b : 0;
    let c = 0;
    if (opt.immediate) {
        fun();
        ++c;
        if (count > 0 && c === count) {
            return 0;
        }
    }
    let timer;
    let timerHandler = () => {
        ++c;
        if (exports.list[taskId].forms[formId] === undefined) {
            if (scope === 'form') {
                clearTimeout(timer);
                delete (exports.list[taskId].timers[timer]);
                return;
            }
        }
        fun();
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete (exports.list[taskId].timers[timer]);
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
function removeTimer(taskId, timer) {
    if (clickgo.task.list[taskId] === undefined) {
        return;
    }
    let formId = clickgo.task.list[taskId].timers[timer];
    if (formId === undefined) {
        return;
    }
    clearTimeout(timer);
    delete (clickgo.task.list[taskId].timers[timer]);
}
exports.removeTimer = removeTimer;
let frameTimer = 0;
let frameMaps = {};
function onFrame(taskId, formId, fun, opt = {}) {
    var _a, _b;
    let ft = ++frameTimer;
    let scope = (_a = opt.scope) !== null && _a !== void 0 ? _a : 'form';
    let count = (_b = opt.count) !== null && _b !== void 0 ? _b : 0;
    let c = 0;
    let timer;
    let timerHandler = () => __awaiter(this, void 0, void 0, function* () {
        ++c;
        if (exports.list[taskId].forms[formId] === undefined) {
            if (scope === 'form') {
                delete (exports.list[taskId].timers['1x' + ft]);
                delete (frameMaps[ft]);
                return;
            }
        }
        yield fun();
        if (exports.list[taskId].timers['1x' + ft] == undefined) {
            return;
        }
        if (count > 1) {
            if (c === count) {
                delete (exports.list[taskId].timers['1x' + ft]);
                delete (frameMaps[ft]);
                return;
            }
            else {
                timer = requestAnimationFrame(timerHandler);
                frameMaps[ft] = timer;
            }
        }
        else if (count === 1) {
            delete (exports.list[taskId].timers['1x' + ft]);
            delete (frameMaps[ft]);
        }
        else {
            timer = requestAnimationFrame(timerHandler);
            frameMaps[ft] = timer;
        }
    });
    timer = requestAnimationFrame(timerHandler);
    frameMaps[ft] = timer;
    exports.list[taskId].timers['1x' + ft] = formId;
    return ft;
}
exports.onFrame = onFrame;
function offFrame(taskId, ft) {
    if (clickgo.task.list[taskId] === undefined) {
        return;
    }
    let formId = clickgo.task.list[taskId].timers['1x' + ft];
    if (formId === undefined) {
        return;
    }
    cancelAnimationFrame(frameMaps[ft]);
    delete (clickgo.task.list[taskId].timers['1x' + ft]);
    delete (frameMaps[ft]);
}
exports.offFrame = offFrame;
