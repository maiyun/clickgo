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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
document.addEventListener("touchstart", function () {
    return;
});
var ClickGo = {
    "rootPath": "",
    "cgRootPath": "",
    "hasTouch": "ontouchstart" in document.documentElement ? true : false,
    "zoom": 1,
    "rzoom": 1,
    "errorHandler": null,
    "screenResizeHandler": null,
    "formCreatedHandler": null,
    "formRemovedHandler": null,
    "formTitleChangedHandler": null,
    "formIconChangedHandler": null,
    "formStateMinChangedHandler": null,
    "formStateMaxChangedHandler": null,
    "formFocusedHandler": null,
    "formBlurredHandler": null,
    "formFlashHandler": null,
    "taskStartedHandler": null,
    "taskEndedHandler": null,
    "taskId": 0,
    "taskList": {},
    "formId": 0,
    "zIndex": 999,
    "topZIndex": 9999999,
    "popZIndex": 0,
    "_readyList": [],
    "_core": null,
    "_loaderConfig": {},
    "_config": {},
    "_pop": null,
    "_watchSize": [],
    showCircular: function (x, y) {
        this._core.showCircular(x, y);
    },
    showRectangle: function (x, y, pos) {
        return this._core.showRectangle(x, y, pos);
    },
    moveRectangle: function (dir) {
        return this._core.moveRectangle(dir);
    },
    hideRectangle: function () {
        return this._core.hideRectangle();
    },
    getPositionByBorderDir: function (dir) {
        return this._core.getPositionByBorderDir(dir);
    },
    appendToPop: function (el) {
        this._core.appendToPop(el);
    },
    removeFromPop: function (el) {
        this._core.removeFromPop(el);
    },
    showPop: function (pop, x, y) {
        if (y === void 0) { y = 0; }
        this._core.showPop(pop, x, y);
    },
    hidePop: function (pop) {
        if (pop === void 0) { pop = null; }
        this._core.hidePop(pop);
    },
    siblings: function (e, cn) {
        return this._core.siblings(e, cn);
    },
    setTheme: function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._core.setTheme(file)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    },
    clearTheme: function () {
        this._core.clearTheme();
    },
    trigger: function (name, taskId, formId, opt) {
        if (opt === void 0) { opt = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._core.trigger(name, taskId, formId, opt)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    },
    loaderConfig: function (config) {
        this._loaderConfig = config;
    },
    config: function (config) {
        if (config.left) {
            this._config.left = config.left;
        }
        if (config.top) {
            this._config.top = config.top;
        }
        if (config.offsetWidth) {
            this._config.offsetWidth = config.offsetWidth;
        }
        if (config.offsetHeight) {
            this._config.offsetHeight = config.offsetHeight;
        }
    },
    getLeft: function () {
        var _a;
        return (_a = this._config.left) !== null && _a !== void 0 ? _a : 0;
    },
    getTop: function () {
        var _a;
        return (_a = this._config.top) !== null && _a !== void 0 ? _a : 0;
    },
    getWidth: function () {
        var _a;
        return window.innerWidth * ClickGo.rzoom + ((_a = this._config.offsetWidth) !== null && _a !== void 0 ? _a : 0);
    },
    getHeight: function () {
        var _a;
        return window.innerHeight * ClickGo.rzoom + ((_a = this._config.offsetHeight) !== null && _a !== void 0 ? _a : 0);
    },
    initRootPath: function () {
        var temp = document.querySelectorAll("head > script");
        var scriptEle = temp[temp.length - 1];
        this.rootPath = window.location.href.slice(0, window.location.href.lastIndexOf("/") + 1);
        this.cgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf("/") + 1);
    },
    onReady: function (cb) {
        this._readyList.push(cb);
    },
    fetchClickGoControl: function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._core.fetchClickGoControl(path)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    },
    fetchApp: function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._core.fetchApp(path)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    },
    runApp: function (path, opt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._core.runApp(path, opt)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    },
    createForm: function (opt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._core.createForm(opt)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    },
    removeForm: function (formId) {
        return this._core.removeForm(formId);
    },
    endTask: function (taskId) {
        return this._core.endTask(taskId);
    },
    watchSize: function (el, cb) {
        return this._core.watchSize(el, cb);
    },
    watchElement: function (el, cb, mode) {
        if (mode === void 0) { mode = "default"; }
        return this._core.watchElement(el, cb, mode);
    },
    bindDown: function (oe, opt) {
        return this._core.bindDown(oe, opt);
    },
    bindMove: function (e, opt) {
        return this._core.bindMove(e, opt);
    },
    bindResize: function (e, opt) {
        return this._core.bindResize(e, opt);
    },
    setGlobalCursor: function (type) {
        return this._core.setGlobalCursor(type);
    },
    requestAnimationFrame: function () {
        return new Promise(function (resolve) {
            var num = requestAnimationFrame(function () {
                resolve(num);
            });
        });
    },
    sleep: function (ms) {
        if (ms === void 0) { ms = 0; }
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, ms);
        });
    },
    getIndex: function (el) {
        var i = 0;
        var child = el;
        while ((child = child.previousSibling) !== null) {
            ++i;
        }
        return i;
    }
};
ClickGo.initRootPath();
loader.ready(function () {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var paths, _i, paths_1, path, core, _b, _c, func;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loader.config(ClickGo._loaderConfig);
                    paths = [
                        "https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js"
                    ];
                    _i = 0, paths_1 = paths;
                    _d.label = 1;
                case 1:
                    if (!(_i < paths_1.length)) return [3, 4];
                    path = paths_1[_i];
                    return [4, loader.loadScript(document.getElementsByTagName("head")[0], path)];
                case 2:
                    if (!(_d.sent())) {
                        alert("Librarys load failed.");
                        return [2];
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4:
                    Vue.config.errorHandler = function (err, vm, info) {
                        if (ClickGo.errorHandler) {
                            ClickGo.errorHandler(vm.taskId, vm.formId, err, info);
                        }
                        else {
                            throw err;
                        }
                    };
                    return [4, loader.require(ClickGo.cgRootPath + "core")];
                case 5:
                    core = ((_a = _d.sent()) !== null && _a !== void 0 ? _a : [])[0];
                    if (!core) {
                        alert("Core load failed.");
                        return [2];
                    }
                    ClickGo._core = core;
                    _b = 0, _c = ClickGo._readyList;
                    _d.label = 6;
                case 6:
                    if (!(_b < _c.length)) return [3, 9];
                    func = _c[_b];
                    return [4, func()];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    _b++;
                    return [3, 6];
                case 9: return [2];
            }
        });
    });
});
