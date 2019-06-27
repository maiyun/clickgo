var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = "2.0.8";
    exports.c = {};
    var _bodyElement = document.getElementsByTagName("body")[0];
    var _headElement = document.getElementsByTagName("head")[0];
    var _mainElement;
    var _config;
    var _vuex;
    var _highlightjs;
    var _frameVue;
    var _tpLibs;
    _bodyElement.insertAdjacentHTML("beforeend", "<div id=\"el-resource\"></div>");
    var _resourceElement = document.getElementById("el-resource");
    function loadResource(paths, step) {
        if (step === void 0) { step = function () { }; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        var needPaths = [];
                        for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                            var path = paths_1[_i];
                            var pathLio = path.lastIndexOf("?");
                            if (pathLio !== -1) {
                                path = path.slice(0, pathLio);
                            }
                            var ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
                            if (ext === "css") {
                                if (!_headElement.querySelector("[data-deskrt-res=\"" + path + "\"]")) {
                                    needPaths.push({
                                        ext: ext,
                                        path: path
                                    });
                                }
                            }
                            else {
                                if (!_resourceElement.querySelector("[data-deskrt-res=\"" + path + "\"]")) {
                                    needPaths.push({
                                        ext: ext,
                                        path: path
                                    });
                                }
                            }
                        }
                        var pathsLength = needPaths.length;
                        if (pathsLength <= 0) {
                            resolve();
                            return;
                        }
                        var loaded = 0;
                        var _loop_1 = function (item) {
                            if (item.ext === "css") {
                                var link = document.createElement("link");
                                link.rel = "stylesheet";
                                link.setAttribute("data-deskrt-res", item.path);
                                link.addEventListener("load", function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4, step(item.path)];
                                                case 1:
                                                    _a.sent();
                                                    ++loaded;
                                                    if (loaded === pathsLength) {
                                                        resolve();
                                                    }
                                                    return [2];
                                            }
                                        });
                                    });
                                });
                                link.addEventListener("error", function (e) {
                                    reject(e);
                                });
                                link.href = item.path + "?" + _config.end;
                                _headElement.appendChild(link);
                            }
                            else {
                                var img = document.createElement("img");
                                img.setAttribute("data-deskrt-res", item.path);
                                img.addEventListener("load", function () {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4, step(item.path)];
                                                case 1:
                                                    _a.sent();
                                                    ++loaded;
                                                    if (loaded === pathsLength) {
                                                        resolve();
                                                    }
                                                    return [2];
                                            }
                                        });
                                    });
                                });
                                img.addEventListener("error", function (e) {
                                    reject(e);
                                });
                                img.src = item.path + "?" + _config.end;
                                _resourceElement.appendChild(img);
                            }
                        };
                        for (var _a = 0, needPaths_1 = needPaths; _a < needPaths_1.length; _a++) {
                            var item = needPaths_1[_a];
                            _loop_1(item);
                        }
                    })];
            });
        });
    }
    exports.loadResource = loadResource;
    function removeResource(paths) {
        for (var _i = 0, paths_2 = paths; _i < paths_2.length; _i++) {
            var path = paths_2[_i];
            var pathLio = path.lastIndexOf("?");
            if (pathLio !== -1) {
                path = path.slice(0, pathLio);
            }
            var ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
            if (ext === "css") {
                var link = _headElement.querySelector("[data-deskrt-res=\"" + path + "\"]");
                if (link) {
                    link.remove();
                }
            }
            else {
                var img = _resourceElement.querySelector("[data-deskrt-res=\"" + path + "\"]");
                if (img) {
                    img.remove();
                }
            }
        }
    }
    exports.removeResource = removeResource;
    function loadScript(paths, step) {
        var _this = this;
        if (step === void 0) { step = function () { }; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _i, paths_3, path, pathLio, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!(paths.length > 0)) return [3, 5];
                        _i = 0, paths_3 = paths;
                        _a.label = 1;
                    case 1:
                        if (!(_i < paths_3.length)) return [3, 5];
                        path = paths_3[_i];
                        pathLio = path.lastIndexOf("?");
                        if (pathLio !== -1) {
                            path = path.slice(0, pathLio);
                        }
                        if (_headElement.querySelector("[data-deskrt-res=\"" + path + "\"]")) {
                            return [3, 4];
                        }
                        return [4, _loadScript(path)];
                    case 2:
                        _a.sent();
                        return [4, step(path)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3, 1];
                    case 5:
                        resolve();
                        return [3, 7];
                    case 6:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3, 7];
                    case 7: return [2];
                }
            });
        }); });
    }
    exports.loadScript = loadScript;
    function _loadScript(path) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var script;
            return __generator(this, function (_a) {
                script = document.createElement("script");
                script.setAttribute("data-deskrt-res", path);
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function (e) {
                    reject(e);
                });
                script.src = path + "?" + _config.end;
                _headElement.appendChild(script);
                return [2];
            });
        }); });
    }
    function setTheme(theme, mask) {
        if (mask === void 0) { mask = true; }
        return __awaiter(this, void 0, void 0, function () {
            var oldPath, path;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (_config.theme === theme) {
                            return [2];
                        }
                        oldPath = _config.theme === "" ? "" : _getThemePath(_config.theme);
                        if (theme === "") {
                            removeResource([oldPath]);
                            _config.theme = "";
                            return [2];
                        }
                        path = _getThemePath(theme);
                        if (mask) {
                            showMask(true);
                        }
                        return [4, loadResource([path])];
                    case 1:
                        _a.sent();
                        if (oldPath !== "") {
                            removeResource([oldPath]);
                        }
                        _config.theme = theme;
                        if (mask) {
                            hideMask();
                        }
                        return [2];
                }
            });
        });
    }
    exports.setTheme = setTheme;
    function _getThemePath(theme) {
        var l = ["/", "http://", "https://"];
        for (var _i = 0, l_1 = l; _i < l_1.length; _i++) {
            var i = l_1[_i];
            if (theme.slice(0, i.length).toLowerCase() === i) {
                return theme;
            }
        }
        return ROOT_PATH + "theme/" + theme + "/index.css";
    }
    var localeLoaded = ["zh-CN.element"];
    var localeData = {
        "en": {}
    };
    function setLocale(loc) {
        return __awaiter(this, void 0, void 0, function () {
            var nowPage, pkg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (_vuex.state.locale === loc) {
                            return [2];
                        }
                        if (_config.locales.indexOf(loc) === -1) {
                            alert("[Error] Locale \"" + loc + "\" definition not found in \"locales\".");
                            return [2];
                        }
                        nowPage = _mainElement.querySelector(".el-page.el--show");
                        if (!nowPage) {
                            alert("[Error] Page not opened.");
                            return [2];
                        }
                        pkg = nowPage.getAttribute("locale-pkg") || "";
                        return [4, __loadLocale(loc, pkg, function () {
                                showMask(true);
                            }, function () {
                                hideMask();
                            })];
                    case 1:
                        _a.sent();
                        _vuex.commit("setLocale", loc);
                        localStorage.setItem("deskrt-locale", loc);
                        return [2];
                }
            });
        });
    }
    exports.setLocale = setLocale;
    function __loadLocale(locale, pkg, before, after) {
        var _this = this;
        if (pkg === void 0) { pkg = ""; }
        if (before === void 0) { before = function () { }; }
        if (after === void 0) { after = function () { }; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var isBefore, loc, e_2, loc, k, _a, loc, k, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (pkg === "") {
                            pkg = "default";
                        }
                        isBefore = false;
                        if (!(localeLoaded.indexOf(locale + ".element") === -1)) return [3, 4];
                        isBefore = true;
                        before();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4, System.import("https://cdn.jsdelivr.net/npm/" + _tpLibs["element-ui@ver"] + "/lib/locale/lang/" + locale + ".min")];
                    case 2:
                        loc = _c.sent();
                        if (!localeData[locale]) {
                            localeData[locale] = {};
                        }
                        localeData[locale].el = loc.default.el;
                        localeLoaded.push(locale + ".element");
                        return [3, 4];
                    case 3:
                        e_2 = _c.sent();
                        reject(e_2);
                        return [3, 4];
                    case 4:
                        if (!(localeLoaded.indexOf(locale + ".default") === -1)) return [3, 8];
                        if (isBefore === false) {
                            isBefore = true;
                            before();
                        }
                        _c.label = 5;
                    case 5:
                        _c.trys.push([5, 7, , 8]);
                        return [4, System.import("" + _config.pre + _config.localePath + locale)];
                    case 6:
                        loc = _c.sent();
                        if (!localeData[locale]) {
                            localeData[locale] = {};
                        }
                        for (k in loc.default) {
                            localeData[locale][k] = loc.default[k];
                        }
                        localeLoaded.push(locale + ".default");
                        return [3, 8];
                    case 7:
                        _a = _c.sent();
                        reject("Load locale file \"" + locale + ".js\" error.");
                        return [3, 8];
                    case 8:
                        if (!(localeLoaded.indexOf(locale + "." + pkg) === -1)) return [3, 12];
                        if (isBefore === false) {
                            isBefore = true;
                            before();
                        }
                        _c.label = 9;
                    case 9:
                        _c.trys.push([9, 11, , 12]);
                        return [4, System.import("" + _config.pre + _config.localePath + locale + (pkg !== "default" ? "." + pkg : ""))];
                    case 10:
                        loc = _c.sent();
                        if (!localeData[locale]) {
                            localeData[locale] = {};
                        }
                        for (k in loc.default) {
                            localeData[locale][k] = loc.default[k];
                        }
                        localeLoaded.push(locale + "." + pkg);
                        return [3, 12];
                    case 11:
                        _b = _c.sent();
                        reject("Load locale file \"" + locale + (pkg !== "default" ? "." + pkg : "") + ".js\" error.");
                        return [3, 12];
                    case 12:
                        if (isBefore) {
                            after();
                        }
                        resolve();
                        return [2];
                }
            });
        }); });
    }
    exports.__loadLocale = __loadLocale;
    function __readLocale(key) {
        try {
            return key.split(".").reduce(function (p, k) { return p[k]; }, localeData[_vuex.state.locale]);
        }
        catch (e) {
            console.log(e);
            return "LocaleError";
        }
    }
    exports.__readLocale = __readLocale;
    function setAsideWidth(width) {
        _vuex.commit("setAsideWidth", width);
    }
    exports.setAsideWidth = setAsideWidth;
    function arrayUnique(arr) {
        var res = [];
        var json = {};
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var val = arr_1[_i];
            if (!json[val]) {
                res.push(val);
                json[val] = 1;
            }
        }
        return res;
    }
    exports.arrayUnique = arrayUnique;
    function html2escape(html) {
        return html.replace(/[<>&"]/g, function (c) {
            return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[c];
        });
    }
    exports.html2escape = html2escape;
    function highlight(dom, code) {
        if (_highlightjs === undefined) {
            alert("[Error] \"highlight.js\" not loaded.");
            return;
        }
        dom.innerText = code;
        _highlightjs.highlightBlock(dom);
    }
    exports.highlight = highlight;
    function purify(text) {
        if (text.toLowerCase().indexOf("<pre") !== -1) {
            text = text.replace(/^\s+|\s+$/g, "").replace(/([\s\S]*?)<pre([\s\S]*?)>([\s\S]*?)<\/pre>/ig, function (t, $1, $2, $3) {
                return purifyOut($1) + "<pre" + $2 + ">" + purifyPre($3) + "</pre>";
            });
            var lio = text.toLowerCase().lastIndexOf("</pre>");
            return text.slice(0, lio) + purifyOut(text.slice(lio));
        }
        else {
            return purifyOut(text.replace(/^\s+|\s+$/g, ""));
        }
    }
    exports.purify = purify;
    function purifyOut(text) {
        text = ">" + text + "<";
        text = text.replace(/>([\s\S]*?)</g, function (t, $1) {
            return ">" + purifyTxt($1) + "<";
        });
        return text.slice(1, -1);
    }
    function purifyTxt(text) {
        return text.replace(/\t|\r\n|  /g, "").replace(/\n|\r/g, "");
    }
    function purifyPre(text) {
        text = text.trim();
        if (text.toLowerCase().indexOf("<code") !== -1) {
            text = text.replace(/<code(.*?)>(\s*)/gi, function (t, $1, $2) {
                return "<code" + $1 + ">";
            }).replace(/(\s*?)<\/code/gi, function (t, $1) {
                return "</code";
            });
        }
        return text;
    }
    function sleep(timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            setTimeout(function () {
                                resolve();
                            }, timeout);
                            return [2];
                        });
                    }); })];
            });
        });
    }
    exports.sleep = sleep;
    function clone(obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            newObj[key] = typeof val === "object" ? clone(val) : val;
        }
        return newObj;
    }
    exports.clone = clone;
    function showMask(top) {
        if (top === void 0) { top = false; }
        var elMask = document.getElementById("el-mask");
        elMask.classList.add("el--show");
        if (top) {
            elMask.classList.add("el--top");
        }
        else {
            elMask.classList.remove("el--top");
        }
    }
    exports.showMask = showMask;
    function hideMask() {
        document.getElementById("el-mask").classList.remove("el--show");
    }
    exports.hideMask = hideMask;
    function showTextMask(text) {
        var $mask = document.getElementById("el-text-mask");
        $mask.innerHTML = text;
        $mask.classList.add("el--show");
    }
    exports.showTextMask = showTextMask;
    function hideTextMask() {
        document.getElementById("el-text-mask").classList.remove("el--show");
    }
    exports.hideTextMask = hideTextMask;
    function alert(text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, _frameVue.$alert(text, undefined, {
                            showClose: false,
                            type: "warning"
                        })];
                    case 1:
                        _a.sent();
                        return [2, true];
                }
            });
        });
    }
    exports.alert = alert;
    function confirm(text) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4, _frameVue.$confirm(text, undefined, {
                                showClose: false,
                                type: "info"
                            })];
                    case 1:
                        _b.sent();
                        return [2, true];
                    case 2:
                        _a = _b.sent();
                        return [2, false];
                    case 3: return [2];
                }
            });
        });
    }
    exports.confirm = confirm;
    exports.goCallback = function () { };
    function __setGoCallback(callback) {
        if (callback === void 0) { callback = function () { }; }
        exports.goCallback = callback;
    }
    exports.__setGoCallback = __setGoCallback;
    function go(path, callback) {
        if (callback === void 0) { callback = function () { }; }
        exports.goCallback = callback;
        window.location.hash = "#" + path;
    }
    exports.go = go;
    function goBack() {
        history.back();
    }
    exports.goBack = goBack;
    function get(url) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var res, text, ct, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4, fetch(url, {
                                method: "GET",
                                credentials: "include"
                            })];
                    case 1:
                        res = _a.sent();
                        text = void 0;
                        ct = res.headers.get("Content-Type") || "";
                        if (!(ct.indexOf("json") !== -1)) return [3, 3];
                        return [4, res.json()];
                    case 2:
                        text = _a.sent();
                        return [3, 5];
                    case 3: return [4, res.text()];
                    case 4:
                        text = _a.sent();
                        _a.label = 5;
                    case 5:
                        resolve(text);
                        return [3, 7];
                    case 6:
                        e_3 = _a.sent();
                        reject(e_3);
                        return [3, 7];
                    case 7: return [2];
                }
            });
        }); });
    }
    exports.get = get;
    function post(url, data) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var header, body, k, res, text, ct, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        header = new Headers();
                        body = new FormData();
                        for (k in data) {
                            if (data[k] !== undefined) {
                                body.append(k, data[k]);
                            }
                        }
                        return [4, fetch(url, {
                                method: "POST",
                                headers: header,
                                credentials: "include",
                                body: body
                            })];
                    case 1:
                        res = _a.sent();
                        text = void 0;
                        ct = res.headers.get("Content-Type") || "";
                        if (!(ct.indexOf("json") !== -1)) return [3, 3];
                        return [4, res.json()];
                    case 2:
                        text = _a.sent();
                        return [3, 5];
                    case 3: return [4, res.text()];
                    case 4:
                        text = _a.sent();
                        _a.label = 5;
                    case 5:
                        resolve(text);
                        return [3, 7];
                    case 6:
                        e_4 = _a.sent();
                        reject(e_4);
                        return [3, 7];
                    case 7: return [2];
                }
            });
        }); });
    }
    exports.post = post;
    function __setConfig(config) {
        _config = config;
        exports.c = config.const;
    }
    exports.__setConfig = __setConfig;
    function __setVuex(vx) {
        _vuex = vx;
    }
    exports.__setVuex = __setVuex;
    function __setMainElement(me) {
        _mainElement = me;
    }
    exports.__setMainElement = __setMainElement;
    function __setHighlightjs(hjs) {
        _highlightjs = hjs;
    }
    exports.__setHighlightjs = __setHighlightjs;
    function __setFrameVue(fv) {
        _frameVue = fv;
    }
    exports.__setFrameVue = __setFrameVue;
    function __setTpLibs(tl) {
        _tpLibs = tl;
    }
    exports.__setTpLibs = __setTpLibs;
});
