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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const text_1 = __importDefault(require("./text"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ppath = '/';
        this.list = [];
        this.val = [];
        this.get = false;
    }
    async open(path) {
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = await clickgo.fs.readDir(path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory() ? '[FOLD]' : (item.isSymbolicLink() ? '[SYMB]' : '[FILE]')) + ' ' + item.name,
                'value': path + item.name
            });
        }
        this.ppath = path;
    }
    async stats() {
        const stats = await clickgo.fs.stats(this.val[0]);
        await clickgo.form.dialog(stats ? JSON.stringify(stats) : 'null');
    }
    dblclick(e) {
        clickgo.dom.bindDblClick(e, async () => {
            const r = await clickgo.fs.isFile(this.val[0]);
            if (r) {
                const extlio = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    await clickgo.form.dialog('This extension is not supported.');
                    return;
                }
                const ext = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    let content = await clickgo.fs.getContent(this.val[0], this.get ? {
                        'start': 2,
                        'end': 4
                    } : undefined);
                    if (!content) {
                        await clickgo.form.dialog('This file cannot be opened.');
                        return;
                    }
                    if (content instanceof Blob) {
                        content = await clickgo.tool.blob2Text(content);
                    }
                    const f = await clickgo.form.create(text_1.default, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    f.show();
                    return;
                }
                await clickgo.form.dialog('The extension "' + ext + '" is not supported.');
                return;
            }
            await this.open(this.val[0]);
        });
    }
    async up() {
        if (this.ppath === '/') {
            return;
        }
        const path = this.ppath.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        await this.open(npath);
    }
    async mount() {
        await clickgo.form.dialog(clickgo.fs.mount('test', {
            readDir: (path) => {
                const list = [];
                switch (path) {
                    case '/': {
                        list.push({
                            isFile: function () {
                                return false;
                            },
                            isDirectory: function () {
                                return true;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': 'test1'
                        });
                        list.push({
                            isFile: function () {
                                return false;
                            },
                            isDirectory: function () {
                                return true;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': 'test2'
                        });
                        break;
                    }
                    case '/test2/': {
                        list.push({
                            isFile: function () {
                                return true;
                            },
                            isDirectory: function () {
                                return false;
                            },
                            isSymbolicLink: function () {
                                return false;
                            },
                            'name': 'test.txt'
                        });
                        break;
                    }
                }
                return list;
            },
            stats: (path) => {
                if (path !== '/test2/test.txt') {
                    return null;
                }
                const date = new Date();
                const ms = date.getTime();
                const size = 7;
                return {
                    isFile: function () {
                        return true;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': size,
                    'blksize': size,
                    'atimeMs': ms,
                    'mtimeMs': ms,
                    'ctimeMs': ms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': date,
                    'ctime': date,
                    'birthtime': date
                };
            },
            getContent: (path, options) => {
                if (path !== '/test2/test.txt') {
                    return null;
                }
                const content = 'testabc';
                if (!options || typeof options === 'string') {
                    return content;
                }
                return content.slice(options.start, options.end);
            },
        }) ? 'true' : 'fasle');
    }
    async unmount() {
        await clickgo.form.dialog(await clickgo.fs.unmount('test') ? 'true' : 'false');
    }
    async onMounted() {
        await this.open('/');
    }
}
exports.default = default_1;
