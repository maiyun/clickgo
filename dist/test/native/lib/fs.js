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
exports.refreshDrives = refreshDrives;
exports.getContent = getContent;
exports.putContent = putContent;
exports.readLink = readLink;
exports.symlink = symlink;
exports.unlink = unlink;
exports.stats = stats;
exports.mkdir = mkdir;
exports.rmdir = rmdir;
exports.chmod = chmod;
exports.rename = rename;
exports.readDir = readDir;
exports.copyFile = copyFile;
const fs = __importStar(require("fs"));
const tool = __importStar(require("./tool"));
const platform = process.platform;
function formatPath(path) {
    if (platform !== 'win32') {
        return path;
    }
    if (path === '/') {
        return path;
    }
    return path[1] + ':' + path.slice(2);
}
const drives = [];
function refreshDrives() {
    return __awaiter(this, void 0, void 0, function* () {
        if (platform !== 'win32') {
            return;
        }
        drives.length = 0;
        for (let i = 0; i < 26; ++i) {
            const char = String.fromCharCode(97 + i);
            try {
                yield fs.promises.stat(char + ':/');
                drives.push(char);
            }
            catch (_a) {
            }
        }
    });
}
function getContent(path, options) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        const encoding = options.encoding;
        const start = options.start;
        const end = options.end;
        if (start || end) {
            return new Promise(function (resolve) {
                const rs = fs.createReadStream(path, {
                    'encoding': encoding,
                    'start': start,
                    'end': end
                });
                const data = [];
                rs.on('data', function (chunk) {
                    data.push(chunk);
                }).on('end', function () {
                    const buf = Buffer.concat(data);
                    if (encoding) {
                        resolve(buf.toString());
                    }
                    else {
                        resolve(buf);
                    }
                }).on('error', function () {
                    resolve(null);
                });
            });
        }
        else {
            try {
                if (encoding) {
                    return yield fs.promises.readFile(path, {
                        'encoding': encoding
                    });
                }
                else {
                    return yield fs.promises.readFile(path);
                }
            }
            catch (_a) {
                return null;
            }
        }
    });
}
function putContent(path, data, options) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        try {
            yield fs.promises.writeFile(path, data, options);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function readLink(path, encoding) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        try {
            return yield fs.promises.readlink(path, {
                'encoding': encoding
            });
        }
        catch (_a) {
            return null;
        }
    });
}
function symlink(filePath, linkPath, type) {
    return __awaiter(this, void 0, void 0, function* () {
        filePath = formatPath(filePath);
        linkPath = formatPath(linkPath);
        try {
            yield fs.promises.symlink(filePath, linkPath, type);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function unlink(path) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        for (let i = 0; i <= 2; ++i) {
            try {
                yield fs.promises.unlink(path);
                return true;
            }
            catch (_a) {
                yield tool.sleep(250);
            }
        }
        try {
            yield fs.promises.unlink(path);
            return true;
        }
        catch (_b) {
            return false;
        }
    });
}
function stats(path) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        try {
            const item = yield fs.promises.lstat(path);
            return {
                isFile: item.isFile(),
                isDirectory: item.isDirectory(),
                isSymbolicLink: item.isSymbolicLink(),
                'size': item.size,
                'blksize': item.blksize,
                'atimeMs': item.atimeMs,
                'mtimeMs': item.mtimeMs,
                'ctimeMs': item.ctimeMs,
                'birthtimeMs': item.birthtimeMs,
                'atime': item.atime,
                'mtime': item.mtime,
                'ctime': item.ctime,
                'birthtime': item.birthtime
            };
        }
        catch (_a) {
            return null;
        }
    });
}
function mkdir(path, mode) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        const stats = yield fs.promises.lstat(path);
        if (stats.isDirectory()) {
            return true;
        }
        try {
            yield fs.promises.mkdir(path, {
                'recursive': true,
                'mode': mode
            });
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function rmdir(path) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        const stats = yield fs.promises.lstat(path);
        if (!stats.isDirectory()) {
            return true;
        }
        try {
            yield fs.promises.rmdir(path);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function chmod(path, mod) {
    return __awaiter(this, void 0, void 0, function* () {
        path = formatPath(path);
        try {
            yield fs.promises.chmod(path, mod);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function rename(oldPath, newPath) {
    return __awaiter(this, void 0, void 0, function* () {
        oldPath = formatPath(oldPath);
        newPath = formatPath(newPath);
        try {
            yield fs.promises.rename(oldPath, newPath);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
function readDir(path, encoding) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const list = [];
            if (platform === 'win32') {
                if (path === '/') {
                    for (const item of drives) {
                        list.push({
                            isFile: false,
                            isDirectory: true,
                            isSymbolicLink: false,
                            'name': item
                        });
                    }
                    return list;
                }
                else {
                    path = path[1] + ':' + path.slice(2);
                }
            }
            const dlist = yield fs.promises.readdir(path, {
                'encoding': encoding,
                'withFileTypes': true
            });
            for (const item of dlist) {
                if (item.name === '.' || item.name === '..') {
                    continue;
                }
                list.push({
                    isFile: item.isFile(),
                    isDirectory: item.isDirectory(),
                    isSymbolicLink: item.isSymbolicLink(),
                    'name': item.name
                });
            }
            return list;
        }
        catch (_a) {
            return [];
        }
    });
}
function copyFile(src, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        src = formatPath(src);
        dest = formatPath(dest);
        try {
            yield fs.promises.copyFile(src, dest);
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
