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
exports.run = exports.ready = exports.verifyToken = exports.unbind = exports.once = exports.bind = void 0;
const electron = require("electron");
const path = require("path");
electron.Menu.setApplicationMenu(null);
let isReady = false;
let isFrame = false;
let isQuit = true;
let win;
const platform = 'darwin';
let token = '';
const methods = {
    'cg-init': {
        'once': true,
        handler: function (t) {
            if (!t || !win) {
                return;
            }
            win.resizable = true;
            token = t;
        }
    },
    'cg-quit': {
        'once': false,
        handler: function (t) {
            if (!win || !t) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            electron.app.quit();
        }
    },
    'cg-set-size': {
        'once': false,
        handler: function (t, width, height) {
            if (!win || !width || !height) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            win.setSize(width, height);
            win.center();
        }
    },
    'cg-set-state': {
        'once': false,
        handler: function (t, state) {
            if (!win || !state) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            switch (state) {
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
    },
    'cg-close': {
        'once': false,
        handler: function (t) {
            if (!win) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            win.close();
        }
    },
    'cg-mouse-ignore': {
        'once': false,
        handler: function (t, val) {
            if (!win) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            if (val) {
                win.setIgnoreMouseEvents(true, { 'forward': true });
            }
            else {
                win.setIgnoreMouseEvents(false);
            }
        }
    }
};
function bind(name, handler, once = false) {
    methods[name] = {
        'once': once,
        'handler': handler
    };
}
exports.bind = bind;
function once(name, handler) {
    bind(name, handler, true);
}
exports.once = once;
function unbind(name) {
    if (!methods[name]) {
        return;
    }
    delete methods[name];
}
exports.unbind = unbind;
electron.ipcMain.handle('pre', function (e, name, ...param) {
    if (!methods[name]) {
        return;
    }
    const r = methods[name].handler(...param);
    if (methods[name].once) {
        delete methods[name];
    }
    return r;
});
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
function createForm(p) {
    const op = {
        'webPreferences': {
            'nodeIntegration': false,
            'contextIsolation': true,
            'preload': path.join(__dirname, '/pre.js')
        },
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
    });
    const lio = p.indexOf('?');
    const search = lio === -1 ? '' : p.slice(lio + 1);
    if (lio !== -1) {
        p = p.slice(0, lio);
    }
    win.loadFile(p, {
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
    electron.app.on('window-all-closed', function () {
        if (isQuit) {
            electron.app.quit();
        }
    });
    electron.app.on('activate', function () {
        if (electron.BrowserWindow.getAllWindows().length > 0) {
            return;
        }
        createForm(path);
        methods['cg-init'] = {
            'once': true,
            handler: function (t) {
                if (!t || !win) {
                    return;
                }
                win.resizable = true;
                token = t;
            }
        };
    });
}
exports.run = run;
