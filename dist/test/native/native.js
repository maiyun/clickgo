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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.launcher = exports.AbstractBoot = exports.tool = exports.fs = void 0;
const electron = __importStar(require("electron"));
const path = __importStar(require("path"));
const libFs = __importStar(require("./lib/fs"));
exports.fs = libFs;
const libTool = __importStar(require("./lib/tool"));
exports.tool = libTool;
let isImmersion = false;
let hasFrame = false;
let isNoFormQuit = true;
let form;
let token = '';
const platform = process.platform;
const methods = {
    'cg-init': {
        'once': true,
        handler: function (t) {
            if (!t || !form) {
                return;
            }
            form.resizable = true;
            token = t;
        }
    },
    'cg-quit': {
        'once': false,
        handler: function (t) {
            if (!t || !form) {
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
            if (isImmersion || !form || !width || !height) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            form.setSize(width, height);
            form.center();
        }
    },
    'cg-set-state': {
        'once': false,
        handler: function (t, state) {
            if (hasFrame || !form || !state) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            switch (state) {
                case 'max': {
                    form.maximize();
                    break;
                }
                case 'min': {
                    form.minimize();
                    break;
                }
                default: {
                    form.restore();
                }
            }
        }
    },
    'cg-close': {
        'once': false,
        handler: function (t) {
            if (!form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            form.close();
        }
    },
    'cg-mouse-ignore': {
        'once': false,
        handler: function (t, val) {
            if (!isImmersion || !form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            if (val) {
                form.setIgnoreMouseEvents(true, { 'forward': true });
            }
            else {
                form.setIgnoreMouseEvents(false);
            }
        }
    },
    'cg-maximizable': {
        'once': false,
        handler: function (t, val) {
            if (isImmersion || !form) {
                return;
            }
            if (!verifyToken(t)) {
                return;
            }
            form.setMaximizable(val);
        }
    },
    'cg-fs-getContent': {
        'once': false,
        handler: function (t, path, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return null;
                }
                return libFs.getContent(path, options);
            });
        }
    },
    'cg-fs-putContent': {
        'once': false,
        handler: function (t, path, data, options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.putContent(path, data, options);
            });
        }
    },
    'cg-fs-readLink': {
        'once': false,
        handler: function (t, path, encoding) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return null;
                }
                return exports.fs.readLink(path, encoding);
            });
        }
    },
    'cg-fs-symlink': {
        'once': false,
        handler: function (t, filePath, linkPath, type) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.symlink(filePath, linkPath, type);
            });
        }
    },
    'cg-fs-unlink': {
        'once': false,
        handler: function (t, path) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.unlink(path);
            });
        }
    },
    'cg-fs-stats': {
        'once': false,
        handler: function (t, path) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return null;
                }
                return exports.fs.stats(path);
            });
        }
    },
    'cg-fs-mkdir': {
        'once': false,
        handler: function (t, path, mode) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.mkdir(path, mode);
            });
        }
    },
    'cg-fs-rmdir': {
        'once': false,
        handler: function (t, path) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.rmdir(path);
            });
        }
    },
    'cg-fs-chmod': {
        'once': false,
        handler: function (t, path, mod) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.chmod(path, mod);
            });
        }
    },
    'cg-fs-rename': {
        'once': false,
        handler: function (t, oldPath, newPath) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.rename(oldPath, newPath);
            });
        }
    },
    'cg-fs-readDir': {
        'once': false,
        handler: function (t, path, encoding) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return [];
                }
                return exports.fs.readDir(path, encoding);
            });
        }
    },
    'cg-fs-copyFile': {
        'once': false,
        handler: function (t, src, dest) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!verifyToken(t)) {
                    return false;
                }
                return exports.fs.copyFile(src, dest);
            });
        }
    },
    'cg-ping': {
        'once': false,
        handler: function (t) {
            return 'pong: ' + t;
        }
    },
    'cg-is-max': {
        'once': false,
        handler: function () {
            return (form === null || form === void 0 ? void 0 : form.isMaximized) ? true : false;
        }
    }
};
class AbstractBoot {
    get isImmersion() {
        return isImmersion;
    }
    get hasFrame() {
        return hasFrame;
    }
    get isNoFormQuit() {
        return isNoFormQuit;
    }
    get platform() {
        return platform;
    }
    get token() {
        return token;
    }
    run(path, opt = {}) {
        if (opt.frame !== undefined) {
            hasFrame = opt.frame;
        }
        if (opt.quit !== undefined) {
            isNoFormQuit = opt.quit;
        }
        if (platform === 'win32') {
            if (!hasFrame) {
                isImmersion = true;
            }
        }
        createForm(path);
        electron.app.on('window-all-closed', function () {
            if (isNoFormQuit) {
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
                    if (!t || !form) {
                        return;
                    }
                    form.resizable = true;
                    token = t;
                }
            };
        });
    }
    on(name, handler, once = false) {
        methods[name] = {
            'once': once,
            'handler': handler
        };
    }
    once(name, handler) {
        this.on(name, handler, true);
    }
    off(name) {
        if (!methods[name]) {
            return;
        }
        delete methods[name];
    }
}
exports.AbstractBoot = AbstractBoot;
function launcher(boot) {
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield electron.app.whenReady();
            yield exports.fs.refreshDrives();
            yield boot.main();
        });
    })().catch(function () {
        return;
    });
}
exports.launcher = launcher;
electron.Menu.setApplicationMenu(null);
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
function createForm(p) {
    const op = {
        'webPreferences': {
            'nodeIntegration': false,
            'contextIsolation': true,
            'preload': path.join(__dirname, '/pre.js')
        },
        'width': hasFrame ? 800 : 500,
        'height': hasFrame ? 600 : 300,
        'frame': hasFrame,
        'resizable': false,
        'show': false,
        'center': true,
        'transparent': isImmersion ? true : false
    };
    form = new electron.BrowserWindow(op);
    form.webContents.userAgent = 'electron/' + electron.app.getVersion() + ' ' + platform + '/' + process.arch + ' immersion/' + (isImmersion ? '1' : '0') + ' frame/' + (hasFrame ? '1' : '0');
    form.once('ready-to-show', function () {
        if (!form) {
            return;
        }
        if (isImmersion) {
            form.maximize();
            form.setIgnoreMouseEvents(true, { 'forward': true });
        }
        else {
        }
        form.show();
    });
    const lio = p.indexOf('?');
    const search = lio === -1 ? '' : p.slice(lio + 1);
    if (lio !== -1) {
        p = p.slice(0, lio);
    }
    form.loadFile(p, {
        'search': search
    }).catch(function (e) {
        throw e;
    });
    form.on('close', function () {
        form = undefined;
    });
    form.on('maximize', function () {
        form === null || form === void 0 ? void 0 : form.webContents.executeJavaScript('if(window.clickgoNativeWeb){clickgoNativeWeb.invoke("maximize")}');
    });
    form.on('unmaximize', function () {
        form === null || form === void 0 ? void 0 : form.webContents.executeJavaScript('if(window.clickgoNativeWeb){clickgoNativeWeb.invoke("unmaximize")}');
    });
}
