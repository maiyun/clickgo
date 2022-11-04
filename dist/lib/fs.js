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
exports.copyFile = exports.copyFolder = exports.readDir = exports.rename = exports.chmod = exports.rmdirDeep = exports.rmdir = exports.mkdir = exports.isFile = exports.isDir = exports.stats = exports.unlink = exports.symlink = exports.readLink = exports.putContent = exports.getContent = void 0;
const tool = require("./tool");
const clickgoFiles = ['/app/', '/app/demo/', '/app/demo/app.js', '/app/demo/form/', '/app/demo/form/control/', '/app/demo/form/control/block/', '/app/demo/form/control/block/block.css', '/app/demo/form/control/block/block.xml', '/app/demo/form/control/button/', '/app/demo/form/control/button/button.css', '/app/demo/form/control/button/button.js', '/app/demo/form/control/button/button.xml', '/app/demo/form/control/check/', '/app/demo/form/control/check/check.js', '/app/demo/form/control/check/check.xml', '/app/demo/form/control/dialog/', '/app/demo/form/control/dialog/dialog.js', '/app/demo/form/control/dialog/dialog.xml', '/app/demo/form/control/file/', '/app/demo/form/control/file/file.js', '/app/demo/form/control/file/file.xml', '/app/demo/form/control/form/', '/app/demo/form/control/form/form.css', '/app/demo/form/control/form/form.js', '/app/demo/form/control/form/form.xml', '/app/demo/form/control/greatview/', '/app/demo/form/control/greatview/greatview.css', '/app/demo/form/control/greatview/greatview.js', '/app/demo/form/control/greatview/greatview.xml', '/app/demo/form/control/img/', '/app/demo/form/control/img/img.xml', '/app/demo/form/control/label/', '/app/demo/form/control/label/label.xml', '/app/demo/form/control/list/', '/app/demo/form/control/list/list.css', '/app/demo/form/control/list/list.js', '/app/demo/form/control/list/list.xml', '/app/demo/form/control/loading/', '/app/demo/form/control/loading/loading.xml', '/app/demo/form/control/marquee/', '/app/demo/form/control/marquee/marquee.js', '/app/demo/form/control/marquee/marquee.xml', '/app/demo/form/control/menu/', '/app/demo/form/control/menu/menu.js', '/app/demo/form/control/menu/menu.xml', '/app/demo/form/control/monaco/', '/app/demo/form/control/monaco/monaco.js', '/app/demo/form/control/monaco/monaco.xml', '/app/demo/form/control/overflow/', '/app/demo/form/control/overflow/overflow.css', '/app/demo/form/control/overflow/overflow.js', '/app/demo/form/control/overflow/overflow.xml', '/app/demo/form/control/property/', '/app/demo/form/control/property/property.js', '/app/demo/form/control/property/property.xml', '/app/demo/form/control/radio/', '/app/demo/form/control/radio/radio.js', '/app/demo/form/control/radio/radio.xml', '/app/demo/form/control/scroll/', '/app/demo/form/control/scroll/scroll.js', '/app/demo/form/control/scroll/scroll.xml', '/app/demo/form/control/select/', '/app/demo/form/control/select/select.js', '/app/demo/form/control/select/select.xml', '/app/demo/form/control/tab/', '/app/demo/form/control/tab/tab.js', '/app/demo/form/control/tab/tab.xml', '/app/demo/form/control/text/', '/app/demo/form/control/text/text.js', '/app/demo/form/control/text/text.xml', '/app/demo/form/control/view/', '/app/demo/form/control/view/view.css', '/app/demo/form/control/view/view.js', '/app/demo/form/control/view/view.xml', '/app/demo/form/event/', '/app/demo/form/event/form/', '/app/demo/form/event/form/form.css', '/app/demo/form/event/form/form.js', '/app/demo/form/event/form/form.xml', '/app/demo/form/event/screen/', '/app/demo/form/event/screen/screen.js', '/app/demo/form/event/screen/screen.xml', '/app/demo/form/event/task/', '/app/demo/form/event/task/task.js', '/app/demo/form/event/task/task.xml', '/app/demo/form/main.css', '/app/demo/form/main.js', '/app/demo/form/main.xml', '/app/demo/form/method/', '/app/demo/form/method/aform/', '/app/demo/form/method/aform/aform.js', '/app/demo/form/method/aform/aform.xml', '/app/demo/form/method/aform/test.xml', '/app/demo/form/method/core/', '/app/demo/form/method/core/core.js', '/app/demo/form/method/core/core.xml', '/app/demo/form/method/dom/', '/app/demo/form/method/dom/dom.css', '/app/demo/form/method/dom/dom.js', '/app/demo/form/method/dom/dom.xml', '/app/demo/form/method/form/', '/app/demo/form/method/form/form.css', '/app/demo/form/method/form/form.js', '/app/demo/form/method/form/form.xml', '/app/demo/form/method/fs/', '/app/demo/form/method/fs/fs.js', '/app/demo/form/method/fs/fs.xml', '/app/demo/form/method/fs/text.js', '/app/demo/form/method/fs/text.xml', '/app/demo/form/method/task/', '/app/demo/form/method/task/locale1.json', '/app/demo/form/method/task/locale2.json', '/app/demo/form/method/task/task.js', '/app/demo/form/method/task/task.xml', '/app/demo/form/method/theme/', '/app/demo/form/method/theme/theme.js', '/app/demo/form/method/theme/theme.xml', '/app/demo/form/method/tool/', '/app/demo/form/method/tool/tool.js', '/app/demo/form/method/tool/tool.xml', '/app/demo/form/method/zip/', '/app/demo/form/method/zip/zip.js', '/app/demo/form/method/zip/zip.xml', '/app/demo/global.css', '/app/demo/res/', '/app/demo/res/icon.svg', '/app/demo/res/img.jpg', '/app/demo/res/r-1.svg', '/app/demo/res/r-2.svg', '/app/demo/res/sql.svg', '/app/demo/res/txt.svg', '/app/demo/res/zip.svg', '/app/task/', '/app/task/app.js', '/app/task/form/', '/app/task/form/bar/', '/app/task/form/bar/bar.js', '/app/task/form/bar/bar.xml', '/app/task/form/desktop/', '/app/task/form/desktop/desktop.xml', '/app/task/locale/', '/app/task/locale/en.json', '/app/task/locale/ja.json', '/app/task/locale/sc.json', '/app/task/locale/tc.json', '/clickgo.js', '/clickgo.ts', '/control/', '/control/common.cgc', '/control/form.cgc', '/control/monaco.cgc', '/control/property.cgc', '/control/task.cgc', '/global.css', '/icon.png', '/index.js', '/index.ts', '/lib/', '/lib/control.js', '/lib/control.ts', '/lib/core.js', '/lib/core.ts', '/lib/dom.js', '/lib/dom.ts', '/lib/form.js', '/lib/form.ts', '/lib/fs.js', '/lib/fs.ts', '/lib/native.js', '/lib/native.ts', '/lib/task.js', '/lib/task.ts', '/lib/theme.js', '/lib/theme.ts', '/lib/tool.js', '/lib/tool.ts', '/lib/zip.js', '/lib/zip.ts', '/theme/', '/theme/familiar.cgt'];
function getContent(path, options) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (typeof options === 'string') {
            options = {
                'encoding': options
            };
        }
        else if (!options) {
            options = {};
        }
        const encoding = options.encoding;
        const start = options.start;
        const end = options.end;
        if (path.startsWith('/clickgo/') || path.startsWith('http:') || path.startsWith('https:') || path.startsWith('file:')) {
            let ourl = '';
            if (path.startsWith('/clickgo/')) {
                if (!clickgoFiles.includes(fpath)) {
                    return null;
                }
                ourl = tool.urlResolve(__dirname, './').slice(0, -1) + fpath;
            }
            else {
                ourl = path;
            }
            try {
                const rand = Math.random().toString();
                let blob = null;
                const headers = {};
                if (start || end) {
                    headers['range'] = `bytes=${start === undefined ? '0' : start}-${end === undefined ? '' : end}`;
                }
                if (options.progress) {
                    blob = yield tool.request(ourl + '?' + rand, {
                        'headers': headers,
                        'progress': options.progress,
                        'responseType': 'blob'
                    });
                }
                else {
                    blob = yield (yield fetch(ourl + '?' + rand, {
                        'headers': headers
                    })).blob();
                }
                if (!blob) {
                    return null;
                }
                if (!encoding) {
                    return blob;
                }
                return yield new Promise(function (resolve) {
                    const fr = new FileReader();
                    fr.addEventListener('load', function () {
                        resolve(fr.result);
                    });
                    fr.readAsText(blob, encoding);
                });
            }
            catch (_a) {
                return null;
            }
        }
        else if (path.startsWith('/storage/')) {
            return null;
        }
        else if (path.startsWith('/mounted/')) {
            return null;
        }
        else if (path.startsWith('/package/')) {
            if (!options.files) {
                return null;
            }
            const file = options.files[fpath];
            if (!file) {
                return null;
            }
            if (typeof file === 'string') {
                return file;
            }
            if (!options.encoding) {
                return file;
            }
            const encoding = options.encoding;
            return new Promise(function (resolve) {
                const fr = new FileReader();
                fr.addEventListener('load', function () {
                    resolve(fr.result);
                });
                fr.readAsText(file, encoding);
            });
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return null;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return getContent(current + fpath, options);
        }
        else {
            return null;
        }
    });
}
exports.getContent = getContent;
function putContent(path, data, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/')) {
            return false;
        }
        else if (path.startsWith('/mounted/')) {
            return false;
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return putContent(current + fpath, data, options);
        }
        else {
            return false;
        }
    });
}
exports.putContent = putContent;
function readLink(path, options) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (typeof options === 'string') {
            options = {
                'encoding': options
            };
        }
        else if (!options) {
            options = {};
        }
        if (path.startsWith('/clickgo/')) {
            return null;
        }
        else if (path.startsWith('/storage/')) {
            return null;
        }
        else if (path.startsWith('/mounted/')) {
            return null;
        }
        else if (path.startsWith('/package/')) {
            return null;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return null;
            }
            if (options.current.endsWith('/')) {
                return options.current.slice(0, -1);
            }
            return options.current;
        }
        else {
            return null;
        }
    });
}
exports.readLink = readLink;
function symlink(filePath, linkPath, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        filePath = tool.urlResolve('/', filePath);
        linkPath = tool.urlResolve('/', linkPath);
        if (filePath.startsWith('/clickgo/')) {
            return false;
        }
        else if (filePath.startsWith('/storage/')) {
            return false;
        }
        else if (filePath.startsWith('/mounted/')) {
            return false;
        }
        else if (filePath.startsWith('/package/')) {
            return false;
        }
        else if (filePath.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            if (linkPath.startsWith('/current/')) {
                linkPath = current + linkPath.slice(8);
            }
            return symlink(current + filePath.slice(8), linkPath, options);
        }
        else {
            return false;
        }
    });
}
exports.symlink = symlink;
function unlink(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/')) {
            return false;
        }
        else if (path.startsWith('/mounted/')) {
            return false;
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return unlink(current + fpath, options);
        }
        else {
            return false;
        }
    });
}
exports.unlink = unlink;
function getClickGoStats(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (path.endsWith('/')) {
            const date = new Date();
            const ms = date.getTime();
            return {
                isFile: function () {
                    return false;
                },
                isDirectory: function () {
                    return true;
                },
                isSymbolicLink: function () {
                    return false;
                },
                'size': 0,
                'blksize': 0,
                'atimeMs': ms,
                'mtimeMs': ms,
                'ctimeMs': ms,
                'birthtimeMs': ms,
                'atime': date,
                'mtime': date,
                'ctime': date,
                'birthtime': date
            };
        }
        else {
            try {
                const res = yield fetch(tool.urlResolve(__dirname, './').slice(0, -1) + path + '?' + Math.random().toString(), {
                    'headers': {
                        'range': `bytes=0-1`
                    }
                });
                const hdate = res.headers.get('date');
                const hmdate = res.headers.get('last-modified');
                const hlength = res.headers.get('content-length');
                let date = new Date();
                let mdate = date;
                if (hdate) {
                    date = new Date(hdate);
                }
                if (hmdate) {
                    mdate = new Date(hmdate);
                }
                const ms = date.getTime();
                const mms = mdate.getTime();
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
                    'size': hlength ? parseInt(hlength) : 0,
                    'blksize': hlength ? parseInt(hlength) : 0,
                    'atimeMs': ms,
                    'mtimeMs': mms,
                    'ctimeMs': mms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': mdate,
                    'ctime': mdate,
                    'birthtime': date
                };
            }
            catch (_a) {
                return null;
            }
        }
    });
}
function stats(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        let fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            if (!clickgoFiles.includes(fpath)) {
                if (!clickgoFiles.includes(fpath + '/')) {
                    return null;
                }
                fpath += '/';
            }
            return getClickGoStats(fpath);
        }
        else if (path.startsWith('/storage/')) {
            return null;
        }
        else if (path.startsWith('/mounted/')) {
            return null;
        }
        else if (path.startsWith('/package/')) {
            if (!options.files) {
                return null;
            }
            if (options.files[fpath]) {
                const file = options.files[fpath];
                const date = new Date();
                const ms = date.getTime();
                let size = 0;
                if (typeof file !== 'string') {
                    size = file.size;
                }
                else {
                    size = new Blob([file]).size;
                }
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
            }
            if (!fpath.endsWith('/')) {
                fpath += '/';
            }
            for (const p in options.files) {
                if (!p.startsWith(fpath)) {
                    continue;
                }
                const date = new Date();
                const ms = date.getTime();
                return {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'size': 0,
                    'blksize': 0,
                    'atimeMs': ms,
                    'mtimeMs': ms,
                    'ctimeMs': ms,
                    'birthtimeMs': ms,
                    'atime': date,
                    'mtime': date,
                    'ctime': date,
                    'birthtime': date
                };
            }
            return null;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return null;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return stats(current + fpath, options);
        }
        else {
            return null;
        }
    });
}
exports.stats = stats;
function isDir(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const pstats = yield stats(path, options);
        if (!pstats || !pstats.isDirectory()) {
            return false;
        }
        return pstats;
    });
}
exports.isDir = isDir;
function isFile(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const pstats = yield stats(path, options);
        if (!pstats || !pstats.isFile()) {
            return false;
        }
        return pstats;
    });
}
exports.isFile = isFile;
function mkdir(path, mode = 0o755, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        if (yield isDir(path, options)) {
            return true;
        }
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/')) {
            return false;
        }
        else if (path.startsWith('/mounted/')) {
            return false;
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return mkdir(current + fpath, mode, options);
        }
        else {
            return false;
        }
    });
}
exports.mkdir = mkdir;
function rmdir(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/')) {
            return false;
        }
        else if (path.startsWith('/mounted/')) {
            return false;
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return rmdir(current + fpath, options);
        }
        else {
            return false;
        }
    });
}
exports.rmdir = rmdir;
function rmdirDeep(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        if (!path.endsWith('/')) {
            path += '/';
        }
        const list = yield readDir(path, options);
        for (const item of list) {
            const stat = yield stats(path + item.name, options);
            if (!stat) {
                return false;
            }
            if (stat.isDirectory()) {
                const rtn = yield rmdirDeep(path + item.name, options);
                if (!rtn) {
                    return false;
                }
            }
            else {
                const rtn = yield unlink(path + item.name, options);
                if (!rtn) {
                    return false;
                }
            }
        }
        return rmdir(path, options);
    });
}
exports.rmdirDeep = rmdirDeep;
function chmod(path, mod, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            return false;
        }
        else if (path.startsWith('/storage/')) {
            return false;
        }
        else if (path.startsWith('/mounted/')) {
            return false;
        }
        else if (path.startsWith('/package/')) {
            return false;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return chmod(current + fpath, mod, options);
        }
        else {
            return false;
        }
    });
}
exports.chmod = chmod;
function rename(oldPath, newPath, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        oldPath = tool.urlResolve('/', oldPath);
        newPath = tool.urlResolve('/', newPath);
        if (!oldPath.startsWith(newPath.slice(0, 9))) {
            return false;
        }
        const ofpath = oldPath.slice(8);
        const nfpath = newPath.slice(8);
        if (oldPath.startsWith('/clickgo/')) {
            return false;
        }
        else if (oldPath.startsWith('/storage/')) {
            return false;
        }
        else if (oldPath.startsWith('/mounted/')) {
            return false;
        }
        else if (oldPath.startsWith('/package/')) {
            return false;
        }
        else if (oldPath.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return rename(current + ofpath, current + nfpath, options);
        }
        else {
            return false;
        }
    });
}
exports.rename = rename;
function readDir(path, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        path = tool.urlResolve('/', path);
        if (path === '/') {
            const list = [
                {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'clickgo'
                },
                {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'storage'
                },
                {
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return true;
                    },
                    isSymbolicLink: function () {
                        return false;
                    },
                    'name': 'mounted'
                }
            ];
            if (options.files) {
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
                    'name': 'package'
                });
            }
            if (options.current) {
                list.push({
                    isFile: function () {
                        return false;
                    },
                    isDirectory: function () {
                        return false;
                    },
                    isSymbolicLink: function () {
                        return true;
                    },
                    'name': 'current'
                });
            }
            return list;
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        const fpath = path.slice(8);
        if (path.startsWith('/clickgo/')) {
            const list = [];
            for (const item of clickgoFiles) {
                if (!item.startsWith(fpath)) {
                    continue;
                }
                if (fpath === item) {
                    continue;
                }
                const rpath = item.slice(fpath.length);
                if (rpath.includes('/')) {
                    if (rpath.endsWith('/')) {
                        if (rpath.slice(0, -1).includes('/')) {
                            continue;
                        }
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
                            'name': rpath.slice(0, -1)
                        });
                    }
                    continue;
                }
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
                    'name': rpath
                });
            }
            return list;
        }
        else if (path.startsWith('/storage/')) {
            return [];
        }
        else if (path.startsWith('/mounted/')) {
            return [];
        }
        else if (path.startsWith('/package/')) {
            if (!options.files) {
                return [];
            }
            const list = [];
            const dirs = [];
            for (const p in options.files) {
                if (!p.startsWith(fpath)) {
                    continue;
                }
                const rpath = p.slice(fpath.length);
                const sio = rpath.indexOf('/');
                if (sio !== -1) {
                    const name = rpath.slice(0, sio);
                    if (!dirs.includes(name)) {
                        dirs.push(name);
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
                            'name': name
                        });
                    }
                    continue;
                }
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
                    'name': rpath
                });
            }
            return list;
        }
        else if (path.startsWith('/current/')) {
            if (!options.current) {
                return [];
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return readDir(current + fpath, options);
        }
        else {
            return [];
        }
    });
}
exports.readDir = readDir;
function copyFolder(from, to, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        from = tool.urlResolve('/', from);
        to = tool.urlResolve('/', to);
        if (!from.startsWith(to.slice(0, 9))) {
            return 0;
        }
        const ffpath = from.slice(8);
        const tfpath = from.slice(8);
        if (from.startsWith('/clickgo/')) {
            return 0;
        }
        else if (from.startsWith('/storage/')) {
            return 0;
        }
        else if (from.startsWith('/mounted/')) {
            return 0;
        }
        else if (from.startsWith('/package/')) {
            return 0;
        }
        else if (from.startsWith('/current/')) {
            if (!options.current) {
                return 0;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return copyFolder(current + ffpath, current + tfpath, options);
        }
        else {
            return 0;
        }
    });
}
exports.copyFolder = copyFolder;
function copyFile(src, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        src = tool.urlResolve('/', src);
        dest = tool.urlResolve('/', dest);
        if (!src.startsWith(dest.slice(0, 9))) {
            return false;
        }
        const sfpath = src.slice(8);
        const dfpath = dest.slice(8);
        if (src.startsWith('/clickgo/')) {
            return false;
        }
        else if (src.startsWith('/storage/')) {
            return false;
        }
        else if (src.startsWith('/mounted/')) {
            return false;
        }
        else if (src.startsWith('/package/')) {
            return false;
        }
        else if (src.startsWith('/current/')) {
            if (!options.current) {
                return false;
            }
            const current = options.current.endsWith('/') ? options.current.slice(0, -1) : options.current;
            return copyFile(current + sfpath, current + dfpath, options);
        }
        else {
            return false;
        }
    });
}
exports.copyFile = copyFile;
