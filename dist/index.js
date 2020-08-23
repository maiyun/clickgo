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
var tmpCgRootPath = '';
(function () {
    var temp = document.querySelectorAll('head > script');
    var scriptEle = temp[temp.length - 1];
    tmpCgRootPath = scriptEle.src.slice(0, scriptEle.src.lastIndexOf('/') + 1);
})();
var tmpZoom = 1;
if (window.devicePixelRatio < 2) {
    tmpZoom = 1 / window.devicePixelRatio;
}
var clickgo = {
    'rootPath': window.location.href.slice(0, window.location.href.lastIndexOf('/') + 1),
    'cgRootPath': tmpCgRootPath,
    'hasTouch': ('ontouchstart' in document.documentElement) ? true : false,
    'isNative': navigator.userAgent.toLowerCase().indexOf('electron') === -1 ? false : true,
    'zoom': tmpZoom,
    'rzoom': 1 / tmpZoom,
    'position': {
        'left': null,
        'top': null,
        'width': null,
        'height': null,
        'offsetWidth': null,
        'offsetHeight': null
    },
    getPosition: function () {
        var _a, _b, _c, _d, _e, _f;
        return {
            'left': (_a = this.position.left) !== null && _a !== void 0 ? _a : 0,
            'top': (_b = this.position.top) !== null && _b !== void 0 ? _b : 0,
            'width': window.innerWidth * this.rzoom + ((_c = this.position.offsetWidth) !== null && _c !== void 0 ? _c : 0),
            'height': window.innerHeight * this.rzoom + ((_d = this.position.offsetHeight) !== null && _d !== void 0 ? _d : 0),
            'offsetWidth': (_e = this.position.offsetWidth) !== null && _e !== void 0 ? _e : 0,
            'offsetHeight': (_f = this.position.offsetHeight) !== null && _f !== void 0 ? _f : 0
        };
    },
    'isReady': false,
    'readys': [],
    ready: function (callback) {
        if (this.isReady) {
            var rtn = callback();
            if (rtn instanceof Promise) {
                rtn.catch(function (e) {
                    throw e;
                });
            }
        }
        else {
            this.readys.push(callback);
        }
    },
    'core': {},
    'element': {},
    'form': {},
    'theme': {},
    'tool': {}
};
var tmpScript = document.createElement('script');
tmpScript.src = 'https://cdn.jsdelivr.net/npm/@litert/loader@1.0.0-beta/dist/index.min.js';
tmpScript.addEventListener('load', function () {
    var _this = this;
    loader.ready(function () { return __awaiter(_this, void 0, void 0, function () {
        var paths, _i, paths_1, path, cg, _a, _b, func, rtn;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    loader.setAfter('?' + Math.random());
                    paths = [
                        'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js'
                    ];
                    _i = 0, paths_1 = paths;
                    _d.label = 1;
                case 1:
                    if (!(_i < paths_1.length)) return [3, 4];
                    path = paths_1[_i];
                    return [4, loader.loadScript(document.getElementsByTagName('head')[0], path)];
                case 2:
                    if (!(_d.sent())) {
                        alert('Librarys load failed.');
                        return [2];
                    }
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [4, loader.require(clickgo.cgRootPath + 'clickgo')];
                case 5:
                    cg = ((_c = _d.sent()) !== null && _c !== void 0 ? _c : [])[0];
                    if (!clickgo) {
                        alert('Clickgo load failed.');
                        return [2];
                    }
                    clickgo.core = cg.core;
                    clickgo.element = cg.element;
                    clickgo.form = cg.form;
                    clickgo.theme = cg.theme;
                    clickgo.tool = cg.tool;
                    clickgo.isReady = true;
                    for (_a = 0, _b = clickgo.readys; _a < _b.length; _a++) {
                        func = _b[_a];
                        rtn = func();
                        if (rtn instanceof Promise) {
                            rtn.catch(function (e) {
                                throw e;
                            });
                        }
                    }
                    return [2];
            }
        });
    }); });
});
document.getElementsByTagName('head')[0].insertAdjacentElement('afterend', tmpScript);
document.addEventListener('touchstart', function () {
    return;
});
