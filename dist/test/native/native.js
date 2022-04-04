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
exports.run = exports.off = exports.once = exports.on = exports.ready = void 0;
const electron = require("electron");
let isReady = false;
function ready() {
    return __awaiter(this, void 0, void 0, function* () {
        yield electron.app.whenReady();
        isReady = true;
    });
}
exports.ready = ready;
let listeners = {};
function on(name, handler, once = false) {
    if (!listeners[name]) {
        listeners[name] = [];
    }
    listeners[name].push({
        'once': once,
        'handler': handler
    });
}
exports.on = on;
function once(name, handler) {
    on(name, handler, true);
}
exports.once = once;
function off(name, handler) {
    if (!listeners[name]) {
        return;
    }
    for (let i = 0; i < listeners[name].length; ++i) {
        if (listeners[name][i].handler !== handler) {
            continue;
        }
        listeners[name].splice(i, 1);
        if (listeners[name].length === 0) {
            delete (listeners[name]);
            break;
        }
        --i;
    }
}
exports.off = off;
let win;
function createForm(path) {
    win = new electron.BrowserWindow({
        'width': 400,
        'height': 400,
        'frame': false,
        'resizable': false,
        'show': false,
        'transparent': true
    });
    win.once('ready-to-show', function () {
        if (!win) {
            return;
        }
        win.maximize();
        win.show();
        win.setIgnoreMouseEvents(true, { 'forward': true });
        let timerFunc = function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!win) {
                    return;
                }
                let isReady = yield win.webContents.executeJavaScript('clickgo.isReady');
                if (!isReady) {
                    setTimeout(function () {
                        timerFunc();
                    }, 100);
                    return;
                }
                let list = JSON.parse(yield win.webContents.executeJavaScript('clickgo.core.__nativeGetSends()'));
                for (let item of list) {
                    for (let it of listeners[item.name]) {
                        let result = it.handler(item.param);
                        if (result instanceof Promise) {
                            result.then(function (result) {
                                if (!win) {
                                    return;
                                }
                                win.webContents.executeJavaScript(`clickgo.core.__nativeReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + result.replace(/"/g, '\"') + '"') : ''})`);
                            });
                        }
                        else {
                            win.webContents.executeJavaScript(`clickgo.core.__nativeReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + result.replace(/"/g, '\"') + '"') : ''})`);
                        }
                    }
                }
                setTimeout(function () {
                    timerFunc();
                }, 100);
            });
        };
        timerFunc();
    });
    win.loadFile(path).catch(function (e) {
        throw e;
    });
    win.on('close', function () {
        win = undefined;
    });
}
function run(path) {
    if (!isReady) {
        return;
    }
    createForm(path);
    on('cg-mouse-ignore', function (b) {
        if (!win) {
            return;
        }
        if (b === 'true') {
            win.setIgnoreMouseEvents(true, { 'forward': true });
        }
        else {
            win.setIgnoreMouseEvents(false);
        }
    });
    electron.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron.app.quit();
        }
    });
    electron.app.on('activate', function () {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            createForm(path);
        }
    });
}
exports.run = run;
