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
exports.clearGlobal = exports.setGlobal = exports.clear = exports.remove = exports.load = exports.revokeObjectURL = exports.read = exports.clickgoThemePkgs = exports.global = void 0;
exports.global = null;
exports.clickgoThemePkgs = {};
function read(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        let zip = yield clickgo.zip.getZip(blob);
        if (!zip) {
            return false;
        }
        let configContent = yield zip.getContent('/config.json');
        if (!configContent) {
            return false;
        }
        let config = JSON.parse(configContent);
        let objectURLs = {};
        let filesRead = {};
        for (let file of config.files) {
            let fab = yield zip.getContent(file, 'arraybuffer');
            if (!fab) {
                continue;
            }
            let mimeo = clickgo.tool.getMimeByPath(file);
            filesRead[file] = new Blob([fab], {
                'type': mimeo.mime
            });
            if (!['css'].includes(mimeo.ext)) {
                objectURLs[file] = clickgo.tool.createObjectURL(filesRead[file]);
            }
        }
        return {
            'type': 'theme',
            'config': config,
            'files': filesRead,
            'objectURLs': objectURLs
        };
    });
}
exports.read = read;
function revokeObjectURL(pkg) {
    for (let path in pkg.objectURLs) {
        clickgo.tool.revokeObjectURL(pkg.objectURLs[path]);
    }
}
exports.revokeObjectURL = revokeObjectURL;
function load(taskId, path = 'global') {
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.task.list[taskId];
        if (!task) {
            return false;
        }
        if (task.customTheme && (path === 'global')) {
            return true;
        }
        let theme;
        if (path === 'global') {
            if (!exports.global) {
                return false;
            }
            theme = exports.global;
        }
        else {
            if (path.startsWith('/clickgo/')) {
                let clickgoPath = path.slice(8);
                if (!exports.clickgoThemePkgs[clickgoPath]) {
                    if ((yield clickgo.core.fetchClickGoFile(clickgoPath)) === null) {
                        return false;
                    }
                }
                theme = exports.clickgoThemePkgs[clickgoPath];
            }
            else if (task.themePkgs[path]) {
                theme = task.themePkgs[path];
            }
            else {
                return false;
            }
        }
        let styleBlob = theme.files[theme.config.style + '.css'];
        if (!styleBlob) {
            return false;
        }
        let style = yield clickgo.tool.blob2Text(styleBlob);
        style = clickgo.tool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
        style = yield clickgo.tool.styleUrl2ObjectOrDataUrl(theme.config.style, style, theme);
        if (!task.customTheme) {
            if (path !== 'global') {
                task.customTheme = true;
            }
            clickgo.dom.removeStyle(taskId, 'theme');
        }
        clickgo.dom.pushStyle(taskId, style, 'theme', path);
        return true;
    });
}
exports.load = load;
function remove(taskId, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.task.list[taskId];
        if (!task) {
            return;
        }
        if (!task.customTheme) {
            return;
        }
        clickgo.dom.removeStyle(taskId, 'theme', path);
        if (clickgo.dom.getStyleCount(taskId, 'theme') === 0) {
            task.customTheme = false;
            if (exports.global) {
                yield load(taskId, 'global');
            }
        }
    });
}
exports.remove = remove;
function clear(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        let task = clickgo.task.list[taskId];
        if (!task) {
            return;
        }
        if (!task.customTheme) {
            return;
        }
        clickgo.dom.removeStyle(taskId, 'theme');
        task.customTheme = false;
        if (exports.global) {
            yield load(taskId);
        }
    });
}
exports.clear = clear;
function setGlobal(file) {
    return __awaiter(this, void 0, void 0, function* () {
        let pkg = yield read(file);
        if (!pkg) {
            return;
        }
        if (exports.global) {
            revokeObjectURL(exports.global);
        }
        exports.global = pkg;
        for (let taskId in clickgo.task.list) {
            yield load(parseInt(taskId), 'global');
        }
    });
}
exports.setGlobal = setGlobal;
function clearGlobal() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.global) {
            return;
        }
        revokeObjectURL(exports.global);
        exports.global = null;
        for (let taskId in clickgo.task.list) {
            let task = clickgo.task.list[taskId];
            if (task.customTheme) {
                continue;
            }
            clickgo.dom.removeStyle(task.id, 'theme');
        }
    });
}
exports.clearGlobal = clearGlobal;
