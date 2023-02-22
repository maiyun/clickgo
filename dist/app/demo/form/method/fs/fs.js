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
    open(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path.endsWith('/')) {
                path += '/';
            }
            this.list = [];
            const ls = yield clickgo.fs.readDir(path);
            for (const item of ls) {
                this.list.push({
                    'label': (item.isDirectory() ? '[FOLD]' : (item.isSymbolicLink() ? '[SYMB]' : '[FILE]')) + ' ' + item.name,
                    'value': path + item.name
                });
            }
            this.ppath = path;
        });
    }
    stats() {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield clickgo.fs.stats(this.val[0]);
            yield clickgo.form.dialog(stats ? JSON.stringify(stats) : 'null');
        });
    }
    dblclick(e) {
        clickgo.dom.bindDblClick(e, () => __awaiter(this, void 0, void 0, function* () {
            const r = yield clickgo.fs.isFile(this.val[0]);
            if (r) {
                const extlio = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    yield clickgo.form.dialog('This extension is not supported.');
                    return;
                }
                const ext = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    let content = yield clickgo.fs.getContent(this.val[0], this.get ? {
                        'start': 2,
                        'end': 4
                    } : undefined);
                    if (!content) {
                        yield clickgo.form.dialog('This file cannot be opened.');
                        return;
                    }
                    if (content instanceof Blob) {
                        content = yield clickgo.tool.blob2Text(content);
                    }
                    const f = yield clickgo.form.create(text_1.default, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    f.show();
                    return;
                }
                yield clickgo.form.dialog('The extension "' + ext + '" is not supported.');
                return;
            }
            yield this.open(this.val[0]);
        }));
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ppath === '/') {
                return;
            }
            const path = this.ppath.slice(0, -1);
            const lif = path.lastIndexOf('/');
            const npath = path.slice(0, lif + 1);
            yield this.open(npath);
        });
    }
    mount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.fs.mount('test', {
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
        });
    }
    unmount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog((yield clickgo.fs.unmount('test')) ? 'true' : 'false');
        });
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.open('/');
        });
    }
}
exports.default = default_1;
