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
electron.Menu.setApplicationMenu(null);
let isReady = false;
let isFrame = false;
let isQuit = true;
const platform = 'darwin';
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
    const op = {
        'width': 500,
        'height': 400,
        'frame': isFrame,
        'resizable': false,
        'show': false,
        'center': true,
        'transparent': isFrame ? undefined : true
    };
    win = new electron.BrowserWindow(op);
    win.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' ' + platform + '/' + process.arch;
    win.once('ready-to-show', function () {
        if (!win) {
            return;
        }
        if (platform === 'win32') {
            win.maximize();
            win.setIgnoreMouseEvents(true, { 'forward': true });
        }
        else {
        }
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
                            if (!win) {
                                return;
                            }
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
    const lio = path.indexOf('?');
    const search = lio === -1 ? '' : path.slice(lio + 1);
    if (lio !== -1) {
        path = path.slice(0, lio);
    }
    win.loadFile(path, {
        'search': search
    }).catch(function (e) {
        throw e;
    });
    win.on('close', function () {
        win = undefined;
    });
}
function run(path, opt = {}) {
    if (!isReady) {
        return;
    }
    if (opt.frame !== undefined) {
        isFrame = opt.frame;
    }
    if (opt.quit !== undefined) {
        isQuit = opt.quit;
    }
    createForm(path);
    once('cg-init', function (t) {
        if (!t || !win) {
            return;
        }
        win.resizable = true;
        token = t;
    });
    on('cg-quit', function (j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            electron.app.quit();
        }
        catch (e) {
            console.log(e);
        }
    });
    on('cg-set-size', function (j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            if (!rtn.width || !rtn.height) {
                return;
            }
            win.setSize(rtn.width, rtn.height);
            win.center();
        }
        catch (e) {
            console.log(e);
        }
    });
    on('cg-set-state', function (j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            switch (rtn.state) {
                case 'max': {
                    win.maximize();
                    break;
                }
                case 'min': {
                    win.minimize();
                    break;
                }
                default: {
                    win.restore();
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    on('cg-main-close', function (j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
            if (!verifyToken(rtn.token)) {
                return;
            }
            if (isQuit) {
                electron.app.quit();
            }
            else {
                win.close();
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    on('cg-mouse-ignore', function (j) {
        if (!win || !j) {
            return;
        }
        try {
            const rtn = JSON.parse(j);
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
        if (isQuit) {
            electron.app.quit();
        }
    });
    electron.app.on('activate', function () {
        if (electron.BrowserWindow.getAllWindows().length === 0) {
            createForm(path);
            once('cg-init', function (t) {
                if (!t || !win) {
                    return;
                }
                win.resizable = true;
                token = t;
            });
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
