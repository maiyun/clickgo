"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = sleep;
exports.formatPath = formatPath;
exports.parsePath = parsePath;
const platform = process.platform;
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}
function formatPath(path) {
    if (platform !== 'win32') {
        return path;
    }
    if (path === '/') {
        return path;
    }
    path = path.replace(/\//g, '\\');
    return path[1] + ':' + path.slice(2);
}
function parsePath(path) {
    if (platform !== 'win32') {
        return path;
    }
    path = path.replace(/\\/g, '/');
    if (path === '/') {
        return path;
    }
    return '/' + path[0].toLowerCase() + path.slice(2);
}
