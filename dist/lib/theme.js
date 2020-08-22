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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearGlobal = exports.setGlobal = exports.clear = exports.remove = exports.load = exports.fetchClickGo = exports.readBlob = exports.clickgoThemes = exports.global = void 0;
exports.global = null;
exports.clickgoThemes = {};
function readBlob(blob) {
    return __awaiter(this, void 0, void 0, function () {
        var begin, beginUint, _a, files, config, cursor, pathSize, _b, path, contentSize, _c, contentBolb, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    begin = blob.slice(0, 2);
                    _a = Uint8Array.bind;
                    return [4, clickgo.tool.blob2ArrayBuffer(begin)];
                case 1:
                    beginUint = new (_a.apply(Uint8Array, [void 0, _f.sent()]))();
                    if (beginUint[0] !== 192 || beginUint[1] !== 2) {
                        return [2, false];
                    }
                    files = {};
                    cursor = 2;
                    _f.label = 2;
                case 2:
                    if (!(cursor < blob.size)) return [3, 9];
                    _b = Uint8Array.bind;
                    return [4, clickgo.tool.blob2ArrayBuffer(blob.slice(cursor, ++cursor))];
                case 3:
                    pathSize = new (_b.apply(Uint8Array, [void 0, _f.sent()]))();
                    return [4, clickgo.tool.blob2Text(blob.slice(cursor, cursor += pathSize[0]))];
                case 4:
                    path = _f.sent();
                    _c = Uint32Array.bind;
                    return [4, clickgo.tool.blob2ArrayBuffer(blob.slice(cursor, cursor += 4))];
                case 5:
                    contentSize = new (_c.apply(Uint32Array, [void 0, _f.sent()]))();
                    contentBolb = blob.slice(cursor, cursor += contentSize[0]);
                    if (!(path === '/config.json')) return [3, 7];
                    _e = (_d = JSON).parse;
                    return [4, clickgo.tool.blob2Text(contentBolb)];
                case 6:
                    config = _e.apply(_d, [_f.sent()]);
                    return [3, 8];
                case 7:
                    files[path] = contentBolb;
                    _f.label = 8;
                case 8: return [3, 2];
                case 9:
                    if (!config) {
                        return [2, false];
                    }
                    return [2, {
                            'type': 'theme',
                            'config': config,
                            'files': files
                        }];
            }
        });
    });
}
exports.readBlob = readBlob;
function fetchClickGo(path) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (exports.clickgoThemes[path]) {
                        return [2, exports.clickgoThemes[path]];
                    }
                    return [4, clickgo.core.fetchClickGoFile(path)];
                case 1:
                    if (!(_a.sent())) {
                        return [2, null];
                    }
                    return [2, exports.clickgoThemes[path]];
            }
        });
    });
}
exports.fetchClickGo = fetchClickGo;
function load(path, taskId, custom) {
    if (custom === void 0) { custom = true; }
    return __awaiter(this, void 0, void 0, function () {
        var task, theme, t, blob, t, styleBlob, style;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    task = clickgo.core.tasks[taskId];
                    if (!task) {
                        return [2, false];
                    }
                    if (task.customTheme && !custom) {
                        return [2, true];
                    }
                    if (!(typeof path === 'string')) return [3, 6];
                    if (!(path.slice(0, 9) === '/clickgo/')) return [3, 2];
                    return [4, fetchClickGo(path.slice(8))];
                case 1:
                    t = _a.sent();
                    if (!t) {
                        return [2, false];
                    }
                    theme = t;
                    return [3, 5];
                case 2:
                    if (!clickgo.core.tasks[taskId].themes[path]) return [3, 3];
                    theme = clickgo.core.tasks[taskId].themes[path];
                    return [3, 5];
                case 3:
                    blob = clickgo.core.tasks[taskId].appPkg.files[path];
                    if (!blob) {
                        return [2, false];
                    }
                    return [4, readBlob(blob)];
                case 4:
                    t = _a.sent();
                    if (!t) {
                        return [2, false];
                    }
                    theme = t;
                    _a.label = 5;
                case 5: return [3, 7];
                case 6:
                    theme = path;
                    _a.label = 7;
                case 7:
                    styleBlob = theme.files[theme.config.style + '.css'];
                    if (!styleBlob) {
                        return [2, false];
                    }
                    return [4, clickgo.tool.blob2Text(styleBlob)];
                case 8:
                    style = _a.sent();
                    style = clickgo.tool.stylePrepend(style, "cg-theme-task" + taskId + "-").style;
                    return [4, clickgo.tool.styleUrl2DataUrl(theme.config.style, style, theme.files)];
                case 9:
                    style = _a.sent();
                    if (!task.customTheme && custom) {
                        task.customTheme = true;
                        document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes").innerHTML = '';
                    }
                    if (!task.customTheme && !custom) {
                        document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes").innerHTML = '';
                    }
                    document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes").insertAdjacentHTML('beforeend', "<style data-path=\"" + (typeof path === 'string' ? path : path.config.name) + "\">" + style + "</style>");
                    if (!custom && !exports.global) {
                        exports.global = theme;
                    }
                    return [2, true];
            }
        });
    });
}
exports.load = load;
function remove(path, taskId) {
    return __awaiter(this, void 0, void 0, function () {
        var task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    task = clickgo.core.tasks[taskId];
                    if (!task) {
                        return [2];
                    }
                    if (!task.customTheme) {
                        return [2];
                    }
                    document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes > [data-path=\"" + path + "\"]").remove();
                    if (!(document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes").children.length === 0)) return [3, 2];
                    task.customTheme = false;
                    if (!exports.global) return [3, 2];
                    return [4, load(exports.global, taskId, false)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2];
            }
        });
    });
}
exports.remove = remove;
function clear(taskId, custom) {
    if (custom === void 0) { custom = true; }
    return __awaiter(this, void 0, void 0, function () {
        var task, el;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    task = clickgo.core.tasks[taskId];
                    if (!task) {
                        return [2];
                    }
                    if ((task.customTheme && !custom) || (!task.customTheme && custom)) {
                        return [2];
                    }
                    el = document.querySelector("#cg-style-task" + taskId + " > .cg-style-themes");
                    el.innerHTML = '';
                    if (!task.customTheme) return [3, 2];
                    task.customTheme = false;
                    if (!exports.global) return [3, 2];
                    return [4, load(exports.global, taskId, false)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2];
            }
        });
    });
}
exports.clear = clear;
function setGlobal(file) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _i, tid, task;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in clickgo.core.tasks)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    tid = _a[_i];
                    task = clickgo.core.tasks[tid];
                    if (task.customTheme) {
                        return [3, 3];
                    }
                    return [4, load(file, parseInt(tid), false)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    });
}
exports.setGlobal = setGlobal;
function clearGlobal() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _i, tid, task;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in clickgo.core.tasks)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    tid = _a[_i];
                    task = clickgo.core.tasks[tid];
                    if (task.customTheme) {
                        return [3, 3];
                    }
                    return [4, clear(parseInt(tid), false)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    });
}
exports.clearGlobal = clearGlobal;
