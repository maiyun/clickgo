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
exports.global = void 0;
exports.read = read;
exports.load = load;
exports.remove = remove;
exports.clear = clear;
exports.setGlobal = setGlobal;
exports.clearGlobal = clearGlobal;
const zip = __importStar(require("./zip"));
const tool = __importStar(require("./tool"));
const task = __importStar(require("./task"));
const dom = __importStar(require("./dom"));
exports.global = null;
async function read(blob) {
    const z = await zip.get(blob);
    if (!z) {
        return false;
    }
    const configContent = await z.getContent('config.json');
    if (!configContent) {
        return false;
    }
    const config = JSON.parse(configContent);
    const files = {};
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
        'type': 'theme',
        'config': config,
        'files': files
    };
}
async function load(theme, taskId) {
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
    style = await tool.styleUrl2DataUrl(theme.config.style, style, theme.files);
    style = style.replace(/\[CGTMP-GLOBAL\] +::selection/g, `#cg-form-list > [data-task-id="${taskId}"] ::selection, #cg-pop-list > [data-task-id="${taskId}"] ::selection`);
    style = style.replace(/\[CGTMP-GLOBAL\]/g, `#cg-form-list > [data-task-id="${taskId}"], #cg-pop-list > [data-task-id="${taskId}"]`);
    if (!t.customTheme) {
        if (!isGlobal) {
            t.customTheme = true;
        }
        dom.removeStyle(taskId, 'theme');
    }
    dom.pushStyle(taskId, style, 'theme', theme.config.name);
    return true;
}
async function remove(name, taskId) {
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
            await load(undefined, taskId);
        }
    }
}
async function clear(taskId) {
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
        await load(undefined, taskId);
    }
}
async function setGlobal(theme) {
    exports.global = theme;
    for (const taskId in task.list) {
        await load(undefined, parseInt(taskId));
    }
}
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
