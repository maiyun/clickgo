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
exports.get = exports.Zip = void 0;
const jszip_1 = __importDefault(require("jszip"));
const tool = __importStar(require("./tool"));
class Zip {
    constructor(zip) {
        this._path = '/';
        this._list = {};
        this._zip = zip;
        this._refreshList();
    }
    getContent(path, type = 'string') {
        return __awaiter(this, void 0, void 0, function* () {
            path = tool.urlResolve(this._path, path);
            const f = this._zip.file(path.slice(1));
            if (!f) {
                return null;
            }
            if (type === 'string') {
                return f.async('string');
            }
            else {
                return f.async(type);
            }
        });
    }
    putContent(path, data, options = {}) {
        path = tool.urlResolve(this._path, path);
        this._zip.file(path.slice(1), data, {
            'base64': options.base64,
            'binary': options.binary,
            'date': options.date
        });
        this._refreshList();
    }
    unlink(path) {
        path = tool.urlResolve(this._path, path);
        this._zip.remove(path.slice(1));
        this._refreshList();
    }
    stats(path) {
        path = tool.urlResolve(this._path, path);
        let dirpath = path.endsWith('/') ? path : path + '/';
        if (!this._list[dirpath]) {
            if (path.endsWith('/')) {
                return null;
            }
            const lio = path.lastIndexOf('/') + 1;
            const dpath = path.slice(0, lio);
            const fname = path.slice(lio);
            if (!this._list[dpath]) {
                return null;
            }
            const file = this._list[dpath][fname];
            if (!file) {
                return null;
            }
            return {
                'date': file.date,
                'isFile': true,
                'isDirectory': false
            };
        }
        else {
            if (dirpath === '/') {
                return {
                    'date': new Date(),
                    'isFile': false,
                    'isDirectory': true
                };
            }
            dirpath = dirpath.slice(0, -1);
            const lio = dirpath.lastIndexOf('/') + 1;
            const dpath = dirpath.slice(0, lio);
            const fname = dirpath.slice(lio);
            const pfolder = this._list[dpath];
            const folder = pfolder[fname];
            return {
                'date': folder.date,
                'isFile': false,
                'isDirectory': true
            };
        }
    }
    isDir(path) {
        const pstats = this.stats(path);
        if (!pstats || !pstats.isDirectory) {
            return false;
        }
        return pstats;
    }
    isFile(path) {
        const pstats = this.stats(path);
        if (!pstats || !pstats.isFile) {
            return false;
        }
        return pstats;
    }
    readDir(path, opt = {}) {
        if (opt.hasChildren === undefined) {
            opt.hasChildren = false;
        }
        if (opt.hasDir === undefined) {
            opt.hasDir = true;
        }
        if (opt.pathAsKey === undefined) {
            opt.pathAsKey = false;
        }
        if (!path) {
            path = this._path;
        }
        else {
            path = tool.urlResolve(this._path, path);
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        const folder = this._zip.folder(path.slice(1));
        if (!folder) {
            return opt.pathAsKey ? {} : [];
        }
        if (!this._list[path]) {
            return opt.pathAsKey ? {} : [];
        }
        if (!opt.hasChildren) {
            if (opt.pathAsKey) {
                return this._list[path];
            }
            const list = [];
            for (const k in this._list[path]) {
                list.push(this._list[path][k]);
            }
            return list;
        }
        if (opt.pathAsKey) {
            const list = {};
            for (const k in this._list[path]) {
                const item = this._list[path][k];
                if (item.isFile || opt.hasDir) {
                    list[item.path + item.name] = item;
                }
                if (item.isDirectory) {
                    Object.assign(list, this._readDir(item, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list = [];
            for (const k in this._list[path]) {
                const item = this._list[path][k];
                if (item.isFile || opt.hasDir) {
                    list.push(item);
                }
                if (item.isDirectory) {
                    list = list.concat(this._readDir(item, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }
    _readDir(item, opt) {
        if (opt.pathAsKey) {
            const list = {};
            if (!this._list[item.path + item.name + '/']) {
                return {};
            }
            for (const k in this._list[item.path + item.name + '/']) {
                const it = this._list[item.path + item.name + '/'][k];
                if (it.isFile || opt.hasDir) {
                    list[it.path + it.name] = it;
                }
                if (it.isDirectory) {
                    Object.assign(list, this._readDir(it, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list = [];
            if (!this._list[item.path + item.name + '/']) {
                return [];
            }
            for (const k in this._list[item.path + item.name + '/']) {
                const it = this._list[item.path + item.name + '/'][k];
                if (it.isFile || opt.hasDir) {
                    list.push(it);
                }
                if (it.isDirectory) {
                    list = list.concat(this._readDir(it, {
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }
    _refreshList() {
        const list = {};
        this._zip.forEach(function (relativePath, item) {
            if (relativePath.startsWith('/')) {
                relativePath = relativePath.slice(1);
            }
            let parentPath = '/';
            let name = '';
            let s;
            if (item.dir) {
                s = relativePath.slice(0, -1).lastIndexOf('/');
            }
            else {
                s = relativePath.lastIndexOf('/');
            }
            if (s !== -1) {
                parentPath = '/' + relativePath.slice(0, s + 1);
                name = relativePath.slice(s + 1);
            }
            else {
                name = relativePath;
            }
            if (item.dir) {
                name = name.slice(0, -1);
            }
            if (!list[parentPath]) {
                list[parentPath] = {};
            }
            list[parentPath][name] = {
                'name': name,
                'date': item.date,
                'isFile': !item.dir,
                'isDirectory': item.dir,
                'path': parentPath
            };
        });
        this._list = list;
    }
    pwd() {
        return this._path.slice(0, -1);
    }
    cd(dir) {
        this._path = tool.urlResolve(this._path, dir);
        if (!this._path.endsWith('/')) {
            this._path += '/';
        }
        return this._path;
    }
    generate(options = {}) {
        const opt = {};
        if (options.type === undefined) {
            opt.type = 'blob';
        }
        else {
            opt.type = options.type;
        }
        if (options.level === undefined) {
            options.level = 9;
        }
        else if (options.level > 9) {
            options.level = 9;
        }
        if (options.level > 0) {
            opt.compression = 'DEFLATE';
        }
        return this._zip.generateAsync(opt, function (meta) {
            var _a;
            (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, meta.percent, meta.currentFile);
        });
    }
    getList() {
        return new Promise((resolve) => {
            const files = {};
            const list = this.readDir('/', {
                'hasChildren': true,
                'hasDir': false
            });
            let loaded = 0;
            for (const file of list) {
                const mime = tool.getMimeByPath(file.name);
                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                    this.getContent(file.path + file.name, 'string').then(function (fb) {
                        if (fb) {
                            files[file.path + file.name] = fb;
                        }
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    }).catch(function () {
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    });
                }
                else {
                    this.getContent(file.path + file.name, 'arraybuffer').then(function (fb) {
                        if (fb) {
                            files[file.path + file.name] = new Blob([fb], {
                                'type': mime.mime
                            });
                        }
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    }).catch(function () {
                        ++loaded;
                        if (loaded === list.length) {
                            resolve(files);
                        }
                    });
                }
            }
            return files;
        });
    }
}
exports.Zip = Zip;
function get(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const z = (0, jszip_1.default)();
        try {
            if (data) {
                yield z.loadAsync(data);
            }
            return new Zip(z);
        }
        catch (_a) {
            return null;
        }
    });
}
exports.get = get;
