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
exports.clearGlobal = exports.setGlobal = exports.clear = exports.remove = exports.load = exports.read = exports.global = void 0;
const zip = require("./zip");
const tool = require("./tool");
const task = require("./task");
const dom = require("./dom");
exports.global = null;
function read(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        const z = yield zip.get(blob);
        if (!z) {
            return false;
        }
        const configContent = yield z.getContent('config.json');
        if (!configContent) {
            return false;
        }
        const config = JSON.parse(configContent);
        const files = {};
        for (const file of config.files) {
            const mime = tool.getMimeByPath(file);
            if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                const fab = yield z.getContent(file, 'string');
                if (!fab) {
                    continue;
                }
                files[file] = fab.replace(/^\ufeff/, '');
            }
            else {
                const fab = yield z.getContent(file, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                files[file] = new Blob([fab], {
                    'type': mime.mime
                });
            }
        }
        return {
            'type': 'theme',
            'config': config,
            'files': files
        };
    });
}
exports.read = read;
function load(theme, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId) {
            return false;
        }
        const t = task.list[taskId];
        if (!t) {
            return false;
        }
        const isGlobal = theme ? false : true;
        if (t.customTheme && isGlobal) {
            return true;
        }
        if (!theme) {
            if (!exports.global) {
                return true;
            }
            theme = exports.global;
        }
        let style = theme.files[theme.config.style + '.css'];
        if (!style) {
            return false;
        }
        style = tool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
        style = yield tool.styleUrl2DataUrl(theme.config.style, style, theme.files);
        style = style.replace(/\[CGTMP-GLOBAL\]/g, `#cg-form-list > [data-task-id="${taskId}"], #cg-pop-list > [class^="cg-theme-task${taskId}-"]`);
        if (!t.customTheme) {
            if (!isGlobal) {
                t.customTheme = true;
            }
            dom.removeStyle(taskId, 'theme');
        }
        dom.pushStyle(taskId, style, 'theme', theme.config.name);
        return true;
    });
}
exports.load = load;
function remove(name, taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId) {
            return;
        }
        const t = task.list[taskId];
        if (!t) {
            return;
        }
        if (!t.customTheme) {
            return;
        }
        dom.removeStyle(taskId, 'theme', name);
        if (dom.getStyleCount(taskId, 'theme') === 0) {
            t.customTheme = false;
            if (exports.global) {
                yield load(undefined, taskId);
            }
        }
    });
}
exports.remove = remove;
function clear(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!taskId) {
            return;
        }
        const t = task.list[taskId];
        if (!t) {
            return;
        }
        if (!t.customTheme) {
            return;
        }
        dom.removeStyle(taskId, 'theme');
        t.customTheme = false;
        if (exports.global) {
            yield load(undefined, taskId);
        }
    });
}
exports.clear = clear;
function setGlobal(theme) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.global = theme;
        for (const taskId in task.list) {
            yield load(undefined, parseInt(taskId));
        }
    });
}
exports.setGlobal = setGlobal;
function clearGlobal() {
    if (!exports.global) {
        return;
    }
    exports.global = null;
    for (const taskId in task.list) {
        const t = task.list[taskId];
        if (t.customTheme) {
            continue;
        }
        dom.removeStyle(t.id, 'theme');
    }
}
exports.clearGlobal = clearGlobal;
