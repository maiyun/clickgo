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
exports.get = void 0;
class Zip {
    constructor(zip) {
        this._path = '/';
        this._list = {};
        this._zip = zip;
        this._refreshList();
    }
    getContent(path, type = 'string') {
        return __awaiter(this, void 0, void 0, function* () {
            path = loader.urlResolve(this._path, path);
            let f = this._zip.file(path.slice(1));
            if (!f) {
                return null;
            }
            if (type === 'string') {
                return yield f.async('string');
            }
            else {
                return yield f.async(type);
            }
        });
    }
    putContent(path, data, options = {}) {
        path = loader.urlResolve(this._path, path);
        this._zip.file(path.slice(1), data, {
            'base64': options.base64,
            'binary': options.binary,
            'date': options.date
        });
        this._refreshList();
    }
    unlink(path) {
        path = loader.urlResolve(this._path, path);
        this._zip.remove(path.slice(1));
        this._refreshList();
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
            path = loader.urlResolve(this._path, path);
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        let folder = this._zip.folder(path.slice(1));
        if (!folder) {
            return [];
        }
        if (!this._list[path]) {
            return [];
        }
        if (!opt.hasChildren) {
            return this._list[path];
        }
        if (opt.pathAsKey) {
            let list = {};
            for (let item of this._list[path]) {
                if (item.isFile || opt.hasDir) {
                    list[item.path + item.name] = item;
                }
                if (item.isDirectory) {
                    Object.assign(list, this._readDir(item, {
                        'hasChildren': opt.hasChildren,
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
        else {
            let list = [];
            for (let item of this._list[path]) {
                if (item.isFile || opt.hasDir) {
                    list.push(item);
                }
                if (item.isDirectory) {
                    list = list.concat(this._readDir(item, {
                        'hasChildren': opt.hasChildren,
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
            let list = {};
            if (!this._list[item.path + item.name + '/']) {
                return {};
            }
            for (let it of this._list[item.path + item.name + '/']) {
                if (it.isFile || opt.hasDir) {
                    list[it.path + it.name] = it;
                }
                if (it.isDirectory) {
                    Object.assign(list, this._readDir(it, {
                        'hasChildren': opt.hasChildren,
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
            for (let it of this._list[item.path + item.name + '/']) {
                if (it.isFile || opt.hasDir) {
                    list.push(it);
                }
                if (it.isDirectory) {
                    list = list.concat(this._readDir(it, {
                        'hasChildren': opt.hasChildren,
                        'hasDir': opt.hasDir,
                        'pathAsKey': opt.pathAsKey
                    }));
                }
            }
            return list;
        }
    }
    _refreshList() {
        let list = {};
        this._zip.forEach(function (relativePath, item) {
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
                list[parentPath] = [];
            }
            list[parentPath].push({
                'name': name,
                'date': item.date,
                'isFile': !item.dir,
                'isDirectory': item.dir,
                'path': parentPath
            });
        });
        this._list = list;
    }
    pwd() {
        return this._path.slice(0, -1);
    }
    cd(dir) {
        this._path = loader.urlResolve(this._path, dir);
        if (!this._path.endsWith('/')) {
            this._path += '/';
        }
        return this._path;
    }
    generate(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let opt = {};
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
            return yield this._zip.generateAsync(opt, function (meta) {
                var _a;
                (_a = options.onUpdate) === null || _a === void 0 ? void 0 : _a.call(options, meta.percent, meta.currentFile);
            });
        });
    }
}
function get(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let z = JSZip();
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
