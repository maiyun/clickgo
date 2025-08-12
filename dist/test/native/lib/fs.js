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
const drives = [];
async function refreshDrives() {
    if (platform !== 'win32') {
        return;
    }
    drives.length = 0;
    for (let i = 0; i < 26; ++i) {
        const char = String.fromCharCode(97 + i);
        try {
            await fs.promises.stat(char + ':/');
            drives.push(char);
        }
        catch {
        }
    }
}
async function getContent(path, options) {
    path = tool.formatPath(path);
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
                if (!(chunk instanceof Buffer)) {
                    return;
                }
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
                return await fs.promises.readFile(path, {
                    'encoding': encoding
                });
            }
            else {
                return await fs.promises.readFile(path);
            }
        }
        catch {
            return null;
        }
    }
}
async function putContent(path, data, options) {
    path = tool.formatPath(path);
    try {
        await fs.promises.writeFile(path, data, options);
        return true;
    }
    catch {
        return false;
    }
}
async function readLink(path, encoding) {
    path = tool.formatPath(path);
    try {
        return await fs.promises.readlink(path, {
            'encoding': encoding
        });
    }
    catch {
        return null;
    }
}
async function symlink(filePath, linkPath, type) {
    filePath = tool.formatPath(filePath);
    linkPath = tool.formatPath(linkPath);
    try {
        await fs.promises.symlink(filePath, linkPath, type);
        return true;
    }
    catch {
        return false;
    }
}
async function unlink(path) {
    path = tool.formatPath(path);
    for (let i = 0; i <= 2; ++i) {
        try {
            await fs.promises.unlink(path);
            return true;
        }
        catch {
            await tool.sleep(250);
        }
    }
    try {
        await fs.promises.unlink(path);
        return true;
    }
    catch {
        return false;
    }
}
async function stats(path) {
    path = tool.formatPath(path);
    try {
        const item = await fs.promises.lstat(path);
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
    catch {
        return null;
    }
}
async function mkdir(path, mode) {
    path = tool.formatPath(path);
    const stats = await fs.promises.lstat(path);
    if (stats.isDirectory()) {
        return true;
    }
    try {
        await fs.promises.mkdir(path, {
            'recursive': true,
            'mode': mode
        });
        return true;
    }
    catch {
        return false;
    }
}
async function rmdir(path) {
    path = tool.formatPath(path);
    const stats = await fs.promises.lstat(path);
    if (!stats.isDirectory()) {
        return true;
    }
    try {
        await fs.promises.rmdir(path);
        return true;
    }
    catch {
        return false;
    }
}
async function chmod(path, mod) {
    path = tool.formatPath(path);
    try {
        await fs.promises.chmod(path, mod);
        return true;
    }
    catch {
        return false;
    }
}
async function rename(oldPath, newPath) {
    oldPath = tool.formatPath(oldPath);
    newPath = tool.formatPath(newPath);
    try {
        await fs.promises.rename(oldPath, newPath);
        return true;
    }
    catch {
        return false;
    }
}
async function readDir(path, encoding) {
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
        const dlist = await fs.promises.readdir(path, {
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
    catch {
        return [];
    }
}
async function copyFile(src, dest) {
    src = tool.formatPath(src);
    dest = tool.formatPath(dest);
    try {
        await fs.promises.copyFile(src, dest);
        return true;
    }
    catch {
        return false;
    }
}
