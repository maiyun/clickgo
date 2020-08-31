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
exports.clearGlobal = exports.setGlobal = exports.clear = exports.remove = exports.load = exports.fetchClickGo = exports.readBlob = exports.clickgoThemes = exports.global = void 0;
exports.global = null;
exports.clickgoThemes = {};
function readBlob(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        let begin = blob.slice(0, 2);
        let beginUint = new Uint8Array(yield clickgo.tool.blob2ArrayBuffer(begin));
        if (beginUint[0] !== 192 || beginUint[1] !== 2) {
            return false;
        }
        let files = {};
        let config;
        let cursor = 2;
        while (cursor < blob.size) {
            let pathSize = new Uint8Array(yield clickgo.tool.blob2ArrayBuffer(blob.slice(cursor, ++cursor)));
            let path = yield clickgo.tool.blob2Text(blob.slice(cursor, cursor += pathSize[0]));
            let contentSize = new Uint32Array(yield clickgo.tool.blob2ArrayBuffer(blob.slice(cursor, cursor += 4)));
            let contentBolb = blob.slice(cursor, cursor += contentSize[0]);
            if (path === '/config.json') {
                config = JSON.parse(yield clickgo.tool.blob2Text(contentBolb));
            }
            else {
                files[path] = contentBolb;
            }
        }
        if (!config) {
            return false;
        }
        return {
            'type': 'theme',
            'config': config,
            'files': files
        };
    });
}
exports.readBlob = readBlob;
function fetchClickGo(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.clickgoThemes[path]) {
            return exports.clickgoThemes[path];
        }
        if (!(yield clickgo.core.fetchClickGoFile(path))) {
            return null;
        }
        return exports.clickgoThemes[path];
    });
}
exports.fetchClickGo = fetchClickGo;
function load(path, taskId, custom = true) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.core.tasks[taskId];
        if (!task) {
            return false;
        }
        if (task.customTheme && !custom) {
            return true;
        }
        let theme;
        if (typeof path === 'string') {
            if (path.slice(0, 9) === '/clickgo/') {
                let t = yield fetchClickGo(path.slice(8));
                if (!t) {
                    return false;
                }
                theme = t;
            }
            else {
                if (clickgo.core.tasks[taskId].themes[path]) {
                    theme = clickgo.core.tasks[taskId].themes[path];
                }
                else {
                    let blob = clickgo.core.tasks[taskId].appPkg.files[path];
                    if (!blob) {
                        return false;
                    }
                    let t = yield readBlob(blob);
                    if (!t) {
                        return false;
                    }
                    theme = t;
                }
            }
        }
        else {
            theme = path;
        }
        let styleBlob = theme.files[theme.config.style + '.css'];
        if (!styleBlob) {
            return false;
        }
        let style = yield clickgo.tool.blob2Text(styleBlob);
        style = clickgo.tool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
        style = yield clickgo.tool.styleUrl2DataUrl(theme.config.style, style, theme.files);
        if (!task.customTheme && custom) {
            task.customTheme = true;
            document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`).innerHTML = '';
        }
        if (!task.customTheme && !custom) {
            document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`).innerHTML = '';
        }
        document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`).insertAdjacentHTML('beforeend', `<style data-path="${typeof path === 'string' ? path : path.config.name}">${style}</style>`);
        if (!custom && !exports.global) {
            exports.global = theme;
        }
        return true;
    });
}
exports.load = load;
function remove(path, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.core.tasks[taskId];
        if (!task) {
            return;
        }
        if (!task.customTheme) {
            return;
        }
        document.querySelector(`#cg-style-task${taskId} > .cg-style-themes > [data-path="${path}"]`).remove();
        if (document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`).children.length === 0) {
            task.customTheme = false;
            if (exports.global) {
                yield load(exports.global, taskId, false);
            }
        }
    });
}
exports.remove = remove;
function clear(taskId, custom = true) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.core.tasks[taskId];
        if (!task) {
            return;
        }
        if ((task.customTheme && !custom) || (!task.customTheme && custom)) {
            return;
        }
        let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`);
        el.innerHTML = '';
        if (task.customTheme) {
            task.customTheme = false;
            if (exports.global) {
                yield load(exports.global, taskId, false);
            }
        }
    });
}
exports.clear = clear;
function setGlobal(file) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let tid in clickgo.core.tasks) {
            let task = clickgo.core.tasks[tid];
            if (task.customTheme) {
                continue;
            }
            yield load(file, parseInt(tid), false);
        }
    });
}
exports.setGlobal = setGlobal;
function clearGlobal() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let tid in clickgo.core.tasks) {
            let task = clickgo.core.tasks[tid];
            if (task.customTheme) {
                continue;
            }
            yield clear(parseInt(tid), false);
        }
    });
}
exports.clearGlobal = clearGlobal;
