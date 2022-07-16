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
exports.run = exports.off = exports.once = exports.on = exports.ready = exports.verifyToken = void 0;
const electron = require("electron");
let isReady = false;
let token = '';
function verifyToken(t) {
    if (t !== token) {
        return false;
    }
    return true;
}
exports.verifyToken = verifyToken;
function ready() {
    return __awaiter(this, void 0, void 0, function* () {
        yield electron.app.whenReady();
        isReady = true;
    });
}
exports.ready = ready;
const listeners = {};
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
            delete listeners[name];
            break;
        }
        --i;
    }
}
exports.off = off;
let win;
function createForm(path) {
    win = new electron.BrowserWindow({
        'width': 500,
        'height': 400,
        'frame': false,
        'show': false,
        'transparent': true,
        'hasShadow': false,
        'center': true
    });
    win.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' s' + process.platform + '/' + process.arch;
    win.once('ready-to-show', function () {
        if (!win) {
            return;
        }
        if (process.platform === 'win32') {
            win.maximize();
            win.setIgnoreMouseEvents(true, { 'forward': true });
        }
        win.resizable = false;
        win.show();
        const timerFunc = function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!win) {
                    return;
                }
                try {
                    const rtn = yield win.webContents.executeJavaScript('window.clickGoNative && clickGoNative.isReady');
                    if (!rtn) {
                        setTimeout(function () {
                            timerFunc().catch(function (e) {
                                console.log(e);
                            });
                        }, 100);
                        return;
                    }
                }
                catch (_a) {
                    setTimeout(function () {
                        timerFunc().catch(function (e) {
                            console.log(e);
                        });
                    }, 100);
                    return;
                }
                const list = JSON.parse(yield win.webContents.executeJavaScript('clickGoNative.cgInnerGetSends()'));
                for (const item of list) {
                    if (!listeners[item.name]) {
                        continue;
                    }
                    for (let i = 0; i < listeners[item.name].length; ++i) {
                        const it = listeners[item.name][i];
                        const result = it.handler(item.param);
                        if (it.once) {
                            listeners[item.name].splice(i, 1);
                            --i;
                        }
                        if (result instanceof Promise) {
                            result.then(function (result) {
                                if (!win) {
                                    return;
                                }
                                win.webContents.executeJavaScript(`clickGoNative.cgInnerReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + result.replace(/"/g, '\\"') + '"') : ''})`).catch(function (e) {
                                    console.log(e);
                                });
                            }).catch(function (e) {
                                console.log(e);
                            });
                        }
                        else {
                            win.webContents.executeJavaScript(`clickGoNative.cgInnerReceive(${item.id}, "${item.name}", ${result !== undefined ? (', "' + result.replace(/"/g, '\\"') + '"') : ''})`).catch(function (e) {
                                console.log(e);
                            });
                        }
                        if (it.once) {
                            listeners[item.name].splice(i, 1);
                            if (listeners[item.name].length === 0) {
                                delete listeners[item.name];
                                break;
                            }
                            --i;
                        }
                    }
                }
                setTimeout(function () {
                    timerFunc().catch(function (e) {
                        console.log(e);
                    });
                }, 100);
            });
        };
        timerFunc().catch(function (e) {
            console.log(e);
        });
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
    once('cg-set-token', function (t) {
        if (!t) {
            return;
        }
        token = t;
    });
    on('cg-mouse-ignore', function (b) {
        if (!win || !b) {
            return;
        }
        try {
            const rtn = JSON.parse(b);
            if (!verifyToken(rtn.token)) {
                return;
            }
            if (rtn.param) {
                win.setIgnoreMouseEvents(true, { 'forward': true });
            }
            else {
                win.setIgnoreMouseEvents(false);
            }
        }
        catch (e) {
            console.log(e);
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
setInterval(function () {
    const keysCount = {};
    let count = 0;
    for (const key in listeners) {
        keysCount[key] = listeners[key].length;
        count += keysCount[key];
    }
    console.log('keysCount', keysCount);
    console.log(`All count: ${count}`);
}, 5000);
