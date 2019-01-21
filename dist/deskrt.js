"use strict";
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
var DeskRT = (function () {
    function DeskRT() {
    }
    Object.defineProperty(DeskRT, "asideWidth", {
        get: function () {
            return this._asideWidth;
        },
        set: function (width) {
            DeskRTTools.vuex.commit("setAsideWidth", width);
            this._asideWidth = width;
        },
        enumerable: true,
        configurable: true
    });
    DeskRT.init = function (opt) {
        var _this = this;
        DeskRTTools.pre = opt.pre || "";
        DeskRTTools.end = opt.end || "";
        DeskRTTools.i18n = opt.i18n || "";
        DeskRTTools.locales = opt.locales || ["en", "zh-CN"];
        var frame = opt.frame || "";
        var main = opt.main || "";
        var logo = opt.logo || "";
        var size = opt.size || "";
        var paths = opt.paths || {};
        this._asideWidth = opt.asideWidth || "200px";
        this.let = opt.let || {};
        document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
            var body, jsPath, locale, res, text, _a, df, elFrame, elMenu, elHeader, elMenuHtml, elHeaderHtml, js, _b, onSelect, $l, methods, computed, data;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        body = document.getElementsByTagName("body")[0];
                        body.innerHTML = "<div id=\"el-pop\">" +
                            "<div id=\"el-mask\" class=\"el--show\">" +
                            "<div class=\"el-spin el-spin-spinning\"><span class=\"el-spin-dot\"><i></i><i></i><i></i><i></i></span></div>" +
                            "</div>" +
                            "</div>";
                        DeskRTTools.popEle = document.getElementById("el-pop");
                        DeskRTTools.headEle = document.getElementsByTagName("head")[0];
                        window.addEventListener("hashchange", function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, DeskRTTools.onHashChange()];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        jsPath = "https://cdn.jsdelivr.net/combine/npm/vue@2.5.21,npm/vuex@3.0.1/dist/vuex.min.js,npm/element-ui@2.4.11/lib/index.js,npm/systemjs@0.21.6/dist/system.min.js";
                        if (typeof fetch !== "function") {
                            jsPath += ",npm/whatwg-fetch@3.0.0/fetch.min.js";
                        }
                        if (typeof Promise !== "function") {
                            jsPath += ",npm/promise-polyfill@8.1.0/dist/polyfill.min.js";
                        }
                        DeskRTTools.headEle.insertAdjacentHTML("afterbegin", "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/element-ui@2.4.11/lib/theme-chalk/index.css\">");
                        return [4, this.loadScript([jsPath])];
                    case 1:
                        _c.sent();
                        System.config({
                            packages: {
                                "http:": { defaultExtension: "js?" + DeskRTTools.end },
                                "https:": { defaultExtension: "js?" + DeskRTTools.end }
                            },
                            map: paths
                        });
                        if (size !== "") {
                            Vue.prototype.$ELEMENT = { size: size, zIndex: 2e3 };
                        }
                        locale = "";
                        if (!(DeskRTTools.i18n !== "")) return [3, 3];
                        if (DeskRTTools.locales.indexOf(navigator.language) === -1) {
                            locale = DeskRTTools.locales[0];
                        }
                        else {
                            locale = navigator.language;
                        }
                        Vue.use(ELEMENT, {
                            i18n: function (path) {
                                if (DeskRTTools.vuex.state.locale !== "zh-CN") {
                                    return DeskRTTools.readLocale(path);
                                }
                            }
                        });
                        return [4, DeskRTTools.loadLocale(locale)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        DeskRTTools.vuex = new Vuex.Store({
                            state: {
                                path: "",
                                asideWidth: this._asideWidth,
                                locale: locale
                            },
                            mutations: {
                                setPath: function (state, val) {
                                    state.path = val;
                                },
                                setAsideWidth: function (state, val) {
                                    state.asideWidth = val;
                                },
                                setLocale: function (state, val) {
                                    state.locale = val;
                                }
                            }
                        });
                        DeskRTTools.controlsInit();
                        return [4, fetch(DeskRTTools.pre + frame + ".html?" + DeskRTTools.end)];
                    case 4:
                        res = _c.sent();
                        if (res.status === 404) {
                            alert("Error: \"" + DeskRTTools.pre + frame + ".html\" not found.");
                            return [2];
                        }
                        _a = this.purify;
                        return [4, res.text()];
                    case 5:
                        text = _a.apply(this, [_c.sent()]);
                        if (!(text !== "")) return [3, 15];
                        df = document.createElement("div");
                        df.innerHTML = text;
                        elFrame = df.children[0];
                        elMenu = elFrame.querySelector("el-menu");
                        elHeader = elFrame.querySelector("el-header");
                        if (!(elMenu && elHeader)) return [3, 13];
                        elMenuHtml = elMenu.innerHTML;
                        elHeaderHtml = elHeader.innerHTML;
                        js = undefined;
                        if (!(elFrame.getAttribute("load-script") !== null)) return [3, 9];
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        return [4, System.import(DeskRTTools.pre + frame)];
                    case 7:
                        js = _c.sent();
                        return [3, 9];
                    case 8:
                        _b = _c.sent();
                        alert("Load script error(1)");
                        return [2];
                    case 9:
                        body.insertAdjacentHTML("afterbegin", "<div id=\"el-frame\" class=\"el--mask\">" +
                            "<el-container>" +
                            "<el-aside :width=\"_asideWidth\" :class=\"{'el--show': elAsideShow}\">" +
                            ("<el-logo" + (logo ? " style=\"background-image: url(" + logo + ");\"" : "") + "></el-logo>") +
                            ("<el-menu @select=\"_onSelect\" :default-active=\"DeskRTTools.vuex.state.path\">" + elMenuHtml + "</el-menu>") +
                            "</el-aside>" +
                            "<el-container>" +
                            "<el-header>" +
                            "<div class=\"el-header-left\">" +
                            "<el-header-item @click=\"elAsideShow=true\"><i class=\"el-icon-d-liebiaoshitucaidan\"></i></el-header-item>" +
                            "</div>" +
                            elHeaderHtml +
                            "</el-header>" +
                            "<el-main id=\"el-main\"></el-main>" +
                            "</el-container>" +
                            "</el-container>" +
                            "<div id=\"el-aside-mask\" :class=\"{'el--show': elAsideShow}\" @click=\"elAsideShow=false\"></div>" +
                            "</div>");
                        onSelect = function (index) {
                            window.location.hash = "#" + index;
                        };
                        $l = function (key) {
                            return DeskRTTools.readLocale(key);
                        };
                        if (js !== undefined) {
                            methods = js.methods || {};
                            methods._onSelect = onSelect;
                            methods.$l = $l;
                            computed = js.computed || {};
                            computed._asideWidth = function () {
                                return DeskRTTools.vuex.state.asideWidth;
                            };
                            data = js.data || {};
                            data.elAsideShow = false;
                            DeskRTTools.frameVue = new Vue({
                                el: "#el-frame",
                                data: data,
                                methods: methods,
                                computed: computed
                            });
                        }
                        else {
                            DeskRTTools.frameVue = new Vue({
                                el: "#el-frame",
                                data: {
                                    elAsideShow: false
                                },
                                methods: {
                                    _onSelect: onSelect,
                                    $l: $l
                                },
                                computed: {
                                    _asideWidth: function () {
                                        return DeskRTTools.vuex.state.asideWidth;
                                    }
                                }
                            });
                        }
                        DeskRTTools.mainEle = document.getElementById("el-main");
                        if (!(window.location.hash === "")) return [3, 10];
                        window.location.hash = "#" + main;
                        return [3, 12];
                    case 10: return [4, DeskRTTools.onHashChange()];
                    case 11:
                        _c.sent();
                        _c.label = 12;
                    case 12: return [3, 14];
                    case 13:
                        alert("Error: <el-menu> or <el-header> not found.");
                        _c.label = 14;
                    case 14: return [3, 16];
                    case 15:
                        alert("Error: Frame is empty.");
                        _c.label = 16;
                    case 16: return [2];
                }
            });
        }); });
    };
    DeskRT.go = function (path) {
        window.location.hash = "#" + path;
    };
    DeskRT.setLocale = function (loc) {
        return __awaiter(this, void 0, void 0, function () {
            var nowPage, pkg;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(DeskRTTools.vuex.state.locale !== loc)) return [3, 5];
                        if (!(DeskRTTools.locales.indexOf(loc) !== -1)) return [3, 4];
                        nowPage = DeskRTTools.mainEle.querySelector(".el-page.el--show");
                        if (!nowPage) return [3, 2];
                        pkg = nowPage.getAttribute("locale-pkg") || "";
                        console.log(nowPage);
                        return [4, DeskRTTools.loadLocale(loc, pkg, function () {
                                _this.showMask();
                            }, function () {
                                _this.hideMask();
                            })];
                    case 1:
                        _a.sent();
                        DeskRTTools.vuex.commit("setLocale", loc);
                        return [3, 3];
                    case 2:
                        alert("Page not opened.");
                        _a.label = 3;
                    case 3: return [3, 5];
                    case 4:
                        alert("Locale \"" + loc + "\" definition not found(locales).");
                        _a.label = 5;
                    case 5: return [2];
                }
            });
        });
    };
    DeskRT.loadScript = function (paths) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(paths.length > 0)) return [3, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < paths.length)) return [3, 4];
                        if (!(DeskRTTools.outPath.indexOf(paths[i]) === -1)) return [3, 3];
                        DeskRTTools.outPath.push(paths[i]);
                        return [4, DeskRTTools.loadOutScript(paths[i] + "?" + DeskRTTools.end)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3, 1];
                    case 4:
                        resolve();
                        return [3, 6];
                    case 5:
                        e_1 = _a.sent();
                        reject(e_1);
                        return [3, 6];
                    case 6: return [2];
                }
            });
        }); });
    };
    DeskRT.loadLink = function (paths) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var i, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!(paths.length > 0)) return [3, 4];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < paths.length)) return [3, 4];
                        if (!(DeskRTTools.outPath.indexOf(paths[i]) === -1)) return [3, 3];
                        DeskRTTools.outPath.push(paths[i]);
                        return [4, DeskRTTools.loadOutLink(paths[i] + "?" + DeskRTTools.end)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3, 1];
                    case 4:
                        resolve();
                        return [3, 6];
                    case 5:
                        e_2 = _a.sent();
                        reject(e_2);
                        return [3, 6];
                    case 6: return [2];
                }
            });
        }); });
    };
    DeskRT.arrayUnique = function (arr) {
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
    };
    DeskRT.purify = function (text) {
        var _this = this;
        if (text.toLowerCase().indexOf("<pre") !== -1) {
            text = text.replace(/^\s+|\s+$/g, "").replace(/([\s\S]*?)<pre([\s\S]*?)>([\s\S]*?)<\/pre>/ig, function (t, $1, $2, $3) {
                return _this._purify($1) + "<pre" + $2 + ">" + _this._purifyPre($3) + "</pre>";
            });
            var lio = text.toLowerCase().lastIndexOf("</pre>");
            return text.slice(0, lio) + this._purify(text.slice(lio));
        }
        else {
            return this._purify(text.replace(/^\s+|\s+$/g, ""));
        }
    };
    DeskRT._purify = function (text) {
        var _this = this;
        text = ">" + text + "<";
        text = text.replace(/>([\s\S]*?)</g, function (t, $1) {
            return ">" + _this._purifyTxt($1) + "<";
        });
        return text.slice(1, -1);
    };
    DeskRT._purifyTxt = function (text) {
        return text.replace(/\t|\r\n|  /g, "").replace(/\n|\r/g, "");
    };
    DeskRT._purifyPre = function (text) {
        text = this.trim(text);
        if (text.toLowerCase().indexOf("<code") !== -1) {
            text = text.replace(/<code(.*?)>(\s*)/gi, function (t, $1, $2) {
                return "<code" + $1 + ">";
            }).replace(/(\s*?)<\/code/gi, function (t, $1) {
                return "</code";
            });
        }
        return text;
    };
    DeskRT.clone = function (obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            newObj[key] = typeof val === "object" ? DeskRT.clone(val) : val;
        }
        return newObj;
    };
    DeskRT.trim = function (text) {
        return text.replace(/^\s+|\s+$/g, "");
    };
    DeskRT.html2escape = function (html) {
        return html.replace(/[<>&"]/g, function (c) {
            return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[c];
        });
    };
    DeskRT.highlight = function (dom, code) {
        if (DeskRTTools.highlightjs !== undefined) {
            dom.innerText = code;
            DeskRTTools.highlightjs.highlightBlock(dom);
        }
        else {
            alert("Error: highlight.js not loaded.");
        }
    };
    DeskRT.get = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
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
                    }); })];
            });
        });
    };
    DeskRT.post = function (url, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
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
                    }); })];
            });
        });
    };
    DeskRT.showMask = function () {
        var frame = document.getElementById("el-frame");
        if (frame !== null) {
            frame.classList.add("el--mask");
        }
        document.getElementById("el-mask").classList.add("el--show");
    };
    DeskRT.hideMask = function () {
        var frame = document.getElementById("el-frame");
        if (frame !== null) {
            frame.classList.remove("el--mask");
        }
        document.getElementById("el-mask").classList.remove("el--show");
    };
    DeskRT.version = "1.0.0";
    return DeskRT;
}());
var DeskRTTools = (function () {
    function DeskRTTools() {
    }
    DeskRTTools.onHashChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = window.location.hash;
                        if (!(hash !== "")) return [3, 2];
                        hash = hash.substr(1);
                        return [4, this.openPage(hash)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    };
    DeskRTTools.loadOutScript = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var script;
            return __generator(this, function (_a) {
                script = document.createElement("script");
                script.addEventListener("load", function () {
                    resolve();
                });
                script.addEventListener("error", function () {
                    reject("Load error.");
                });
                script.src = path;
                this.headEle.appendChild(script);
                return [2];
            });
        }); });
    };
    DeskRTTools.loadOutLink = function (path) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var link;
            return __generator(this, function (_a) {
                link = document.createElement("link");
                link.rel = "stylesheet";
                link.addEventListener("load", function () {
                    resolve();
                });
                link.addEventListener("error", function () {
                    reject("Load error.");
                });
                link.href = path;
                this.headEle.appendChild(link);
                return [2];
            });
        }); });
    };
    DeskRTTools.readLocale = function (key) {
        try {
            return key.split(".").reduce(function (p, k) { return p[k]; }, this.localeObj[this.vuex.state.locale]);
        }
        catch (e) {
            console.log(e);
            return "LocaleError";
        }
    };
    DeskRTTools.loadLocale = function (locale, pkg, before, after) {
        var _this = this;
        if (pkg === void 0) { pkg = ""; }
        if (before === void 0) { before = function () { }; }
        if (after === void 0) { after = function () { }; }
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var isBefore, loc, _a, loc, k, _b, loc, k, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (pkg === "") {
                            pkg = "default";
                        }
                        isBefore = false;
                        if (!(DeskRTTools.localePkg.indexOf(locale + ".element") === -1)) return [3, 4];
                        isBefore = true;
                        before();
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4, System.import("https://cdn.jsdelivr.net/npm/element-ui@2.4.11/lib/locale/lang/" + locale)];
                    case 2:
                        loc = _d.sent();
                        if (!this.localeObj[locale]) {
                            this.localeObj[locale] = {};
                        }
                        this.localeObj[locale].el = loc.default.el;
                        this.localePkg.push(locale + ".element");
                        return [3, 4];
                    case 3:
                        _a = _d.sent();
                        reject("Element UI locale file error.");
                        return [3, 4];
                    case 4:
                        if (!(DeskRTTools.localePkg.indexOf(locale + ".default") === -1)) return [3, 8];
                        if (isBefore === false) {
                            isBefore = true;
                            before();
                        }
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4, System.import("" + this.pre + this.i18n + locale)];
                    case 6:
                        loc = _d.sent();
                        if (!this.localeObj[locale]) {
                            this.localeObj[locale] = {};
                        }
                        for (k in loc.default) {
                            this.localeObj[locale][k] = loc.default[k];
                        }
                        this.localePkg.push(locale + ".default");
                        return [3, 8];
                    case 7:
                        _b = _d.sent();
                        reject("Load locale file \"" + locale + ".js\" error.");
                        return [3, 8];
                    case 8:
                        if (!(DeskRTTools.localePkg.indexOf(locale + "." + pkg) === -1)) return [3, 12];
                        if (isBefore === false) {
                            isBefore = true;
                            before();
                        }
                        _d.label = 9;
                    case 9:
                        _d.trys.push([9, 11, , 12]);
                        return [4, System.import("" + this.pre + this.i18n + locale + (pkg !== "default" ? "." + pkg : ""))];
                    case 10:
                        loc = _d.sent();
                        if (!this.localeObj[locale]) {
                            this.localeObj[locale] = {};
                        }
                        for (k in loc.default) {
                            this.localeObj[locale][k] = loc.default[k];
                        }
                        this.localePkg.push(locale + "." + pkg);
                        return [3, 12];
                    case 11:
                        _c = _d.sent();
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
    };
    DeskRTTools.openPage = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var queryIndex, query, queryArray, i, tmp, res, text, df, elPage, pageRandom_1, pageEle, needLoadScript, needLoadLink, styleTxt, i, dom, tagName, outPath, outPath, pkg, js, _a, opt, vm, readyRtn, hljs, hlcss, codeList, hl, i, _b, i;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        queryIndex = path.indexOf("?");
                        query = {};
                        if (queryIndex !== -1) {
                            queryArray = path.slice(queryIndex + 1).split("&");
                            path = path.slice(0, queryIndex);
                            for (i = 0; i < queryArray.length; ++i) {
                                tmp = queryArray[i].split("=");
                                query[tmp[0]] = decodeURIComponent(tmp[1]);
                            }
                        }
                        if (!this.pages[path]) return [3, 1];
                        this.vuex.commit("setPath", path);
                        this.pages[path]._query = query;
                        if (this.pages[path].onOpen) {
                            this.pages[path].onOpen();
                        }
                        this.frameVue.elAsideShow = false;
                        return [3, 22];
                    case 1:
                        DeskRT.showMask();
                        return [4, fetch(this.pre + path + ".html?" + this.end)];
                    case 2:
                        res = _c.sent();
                        text = "";
                        if (!(res.status === 404)) return [3, 3];
                        alert("404 not found.");
                        return [2];
                    case 3: return [4, res.text()];
                    case 4:
                        text = _c.sent();
                        _c.label = 5;
                    case 5:
                        text = DeskRT.purify(text);
                        if (!(text !== "")) return [3, 21];
                        df = document.createElement("div");
                        df.innerHTML = text;
                        elPage = df.children[0];
                        pageRandom_1 = "page" + (Math.random() * 1000000000000).toFixed();
                        pageEle = document.createElement("div");
                        pageEle.setAttribute(":class", "['el-page', {'el--show': _isPageShow}]");
                        pageEle.setAttribute(pageRandom_1, "");
                        if (elPage.getAttribute("v-loading") !== null) {
                            pageEle.setAttribute("v-loading", elPage.getAttribute("v-loading") || "");
                        }
                        needLoadScript = [];
                        needLoadLink = [];
                        styleTxt = "";
                        for (i = 0; i < elPage.children.length; ++i) {
                            dom = elPage.children[i];
                            tagName = dom.tagName.toLowerCase();
                            if (tagName === "script") {
                                outPath = void 0;
                                if (outPath = dom.getAttribute("src")) {
                                    needLoadScript.push(outPath);
                                    dom.remove();
                                }
                            }
                            else if (tagName === "link") {
                                outPath = void 0;
                                if (outPath = dom.getAttribute("href")) {
                                    needLoadLink.push(outPath);
                                    dom.remove();
                                }
                            }
                            else if (tagName === "style") {
                                styleTxt += dom.innerHTML.replace(/([\s\S]+?){([\s\S]+?)}/g, function (t, $1, $2) {
                                    return "[" + pageRandom_1 + "] " + $1.replace(/, */g, ",[" + pageRandom_1 + "] ") + "{" + $2 + "}";
                                });
                                dom.remove();
                            }
                        }
                        if (!(this.i18n !== "")) return [3, 7];
                        pkg = elPage.getAttribute("locale-pkg") || "";
                        pageEle.setAttribute("locale-pkg", pkg);
                        return [4, this.loadLocale(this.vuex.state.locale, pkg)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7: return [4, DeskRT.loadScript(needLoadScript)];
                    case 8:
                        _c.sent();
                        return [4, DeskRT.loadLink(needLoadLink)];
                    case 9:
                        _c.sent();
                        js = undefined;
                        if (!(elPage.getAttribute("load-script") !== null)) return [3, 13];
                        pageEle.setAttribute("load-script", "");
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        return [4, System.import(this.pre + path)];
                    case 11:
                        js = _c.sent();
                        return [3, 13];
                    case 12:
                        _a = _c.sent();
                        alert("Load script error(3).");
                        return [2];
                    case 13:
                        pageEle.innerHTML = elPage.innerHTML;
                        this.mainEle.appendChild(pageEle);
                        if (styleTxt !== "") {
                            this.headEle.insertAdjacentHTML("beforeend", "<style>" + styleTxt + "</style>");
                        }
                        opt = void 0;
                        if (js !== undefined) {
                            opt = {
                                el: pageEle,
                                data: js.data ? DeskRT.clone(js.data) : {},
                                methods: js.methods,
                                computed: js.computed,
                                watch: js.watch ? DeskRT.clone(js.watch) : {}
                            };
                        }
                        else {
                            opt = {
                                el: pageEle
                            };
                        }
                        if (!opt.methods) {
                            opt.methods = {};
                        }
                        if (!opt.computed) {
                            opt.computed = {};
                        }
                        if (!opt.data) {
                            opt.data = {};
                        }
                        opt.data.pagePath = path;
                        opt.data.query = query;
                        opt.computed._isPageShow = function () {
                            return this.pagePath === DeskRTTools.vuex.state.path;
                        };
                        opt.computed._isMobile = function () {
                            return false;
                        };
                        opt.methods.$l = function (key) {
                            return DeskRTTools.readLocale(key);
                        };
                        vm = new Vue(opt);
                        this.pages[path] = vm;
                        readyRtn = true;
                        if (vm.onReady !== undefined) {
                            readyRtn = vm.onReady();
                        }
                        if (vm.onOpen && (readyRtn !== false)) {
                            vm.onOpen();
                        }
                        hljs = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.13.1/build/highlight.min";
                        hlcss = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/androidstudio.min.css";
                        codeList = vm.$el.querySelectorAll("code");
                        if (!(codeList.length > 0)) return [3, 20];
                        if (!(this.highlightjs === undefined)) return [3, 19];
                        _c.label = 14;
                    case 14:
                        _c.trys.push([14, 17, , 18]);
                        return [4, DeskRT.loadLink([hlcss])];
                    case 15:
                        _c.sent();
                        return [4, System.import(hljs)];
                    case 16:
                        hl = _c.sent();
                        for (i = 0; i < codeList.length; ++i) {
                            hl.highlightBlock(codeList[i]);
                        }
                        this.highlightjs = hl;
                        return [3, 18];
                    case 17:
                        _b = _c.sent();
                        alert("Load script error(2).");
                        return [2];
                    case 18: return [3, 20];
                    case 19:
                        for (i = 0; i < codeList.length; ++i) {
                            this.highlightjs.highlightBlock(codeList[i]);
                        }
                        _c.label = 20;
                    case 20:
                        DeskRT.hideMask();
                        this.frameVue.elAsideShow = false;
                        this.vuex.commit("setPath", path);
                        return [3, 22];
                    case 21:
                        alert("Page is empty.");
                        _c.label = 22;
                    case 22: return [2];
                }
            });
        });
    };
    DeskRTTools.controlsInit = function () {
        Vue.component("el-header-item", {
            template: "<div class=\"el-header-item\" @click=\"$emit('click')\"><slot></div>"
        });
        Vue.component("el-logo", {
            template: "<div class=\"el-logo\"></div>"
        });
        Vue.component("el-table-info", {
            template: "<table class=\"el-table-info\">" +
                "<tbody><slot></tbody>" +
                "</table>"
        });
        Vue.component("el-tr", {
            template: "<tr>" +
                "<slot>" +
                "</tr>"
        });
        Vue.component("el-th", {
            template: "<th>" +
                "<slot>" +
                "</th>"
        });
        Vue.component("el-td", {
            template: "<td>" +
                "<slot>" +
                "</td>"
        });
        Vue.component("el-center", {
            template: "<div class=\"el-center\">" +
                "<slot>" +
                "</div>"
        });
        Vue.component("el-tip", {
            template: "<div class=\"el-tip\">" +
                "<slot>" +
                "</div>"
        });
        Vue.component("el-exp", {
            template: "<div class=\"el-exp\">" +
                "<slot>" +
                "</div>"
        });
        Vue.component("el-pictureswall", {
            props: {
                value: {
                    default: []
                },
                pre: {
                    default: ""
                },
                end: {
                    default: ""
                },
                endPreview: {
                    default: ""
                }
            },
            data: function () {
                return {
                    dialogVisible: false,
                    dialogImageUrl: ""
                };
            },
            methods: {
                preview: function (url) {
                    this.dialogImageUrl = this.pre + url + this.endPreview;
                    this.dialogVisible = true;
                },
                click: function () {
                    this.$emit("select");
                }
            },
            template: "<div class=\"el-pictureswall\">" +
                "<div>" +
                "<ul class=\"el-upload-list el-upload-list--picture-card\">" +
                "<li v-for=\"(url, index) of value\" tabindex=\"0\" class=\"el-upload-list__item is-success\">" +
                "<img :src=\"pre + url + end\" alt=\"\" class=\"el-upload-list__item-thumbnail\">" +
                "<a class=\"el-upload-list__item-name\">" +
                "<i class=\"el-icon-document\"></i>" +
                "</a>" +
                "<i class=\"el-icon-close\"></i>" +
                "<span class=\"el-upload-list__item-actions\">" +
                "<span class=\"el-upload-list__item-preview\" @click=\"preview(url)\">" +
                "<i class=\"el-icon-zoom-in\"></i>" +
                "</span>" +
                "<span class=\"el-upload-list__item-delete\" @click=\"value.splice(index, 1);$emit('remove', index);$emit('input', value);\">" +
                "<i class=\"el-icon-delete\"></i>" +
                "</span>" +
                "</span>" +
                "</li>" +
                "</ul>" +
                "<div tabindex=\"0\" class=\"el-upload el-upload--picture-card\" @click=\"click\">" +
                "<i class=\"el-icon-plus\"></i>" +
                "<input name=\"file\" class=\"el-upload__input\" type=\"file\">" +
                "</div>" +
                "</div>" +
                "<el-dialog :visible.sync=\"dialogVisible\" size=\"tiny\">" +
                "<img width=\"100%\" :src=\"dialogImageUrl\" alt=\"\">" +
                "</el-dialog>" +
                "</div>"
        });
        Vue.component("el-phone", {
            props: {
                padding: {
                    default: "0"
                }
            },
            template: "<div class=\"el-phone\">" +
                "<div class=\"el-phone--inner\" :style=\"{padding: padding}\"><slot></div>" +
                "</div>"
        });
        Vue.component("el-phone-line", {
            props: {
                controls: {
                    default: []
                }
            },
            template: "<div class=\"el-phone-line\">" +
                "<template>" +
                "<slot>" +
                "</template>" +
                "<el-button-group v-if=\"controls !== []\">" +
                "<el-button v-for=\"control of controls\" @click=\"$emit('action', control.name)\" type=\"primary\" :icon=\"control.icon\" size=\"small\">{{control.name}}</el-button>" +
                "</el-button-group>" +
                "</div>"
        });
        Vue.component("el-data-button-group", {
            props: {
                delimiter: {
                    default: undefined
                }
            },
            template: "<div class=\"el-data-button-group\" :class=\"[delimiter !== undefined && 'el--delimiter']\">" +
                "<slot>" +
                "</div>"
        });
        Vue.component("el-data-button", {
            template: "<div class=\"el-data-button\">" +
                "<slot>" +
                "</div>"
        });
        Vue.component("el-tile-button", {
            props: {
                href: {
                    default: undefined
                },
                background: {
                    default: undefined
                }
            },
            template: "<a class=\"el-tile-button\" :class=\"[background && 'el--background', $slots.icon && 'el--icon']\" :href=\"href\" :style=\"{'background': background}\">" +
                "<div v-if=\"$slots.icon\" class=\"el-tile-button__icon\">" +
                "<slot name=\"icon\">" +
                "</div>" +
                "<div class=\"el-tile-button__body\">" +
                "<slot>" +
                "</div>" +
                "</a>"
        });
        Vue.component("el-resp", {
            props: {
                gutter: {
                    default: undefined
                }
            },
            data: function () {
                return {
                    unique: "resp_" + (Math.random() * 100000000000000000)
                };
            },
            template: "<div class=\"el-resp\" :data-unique=\"unique\">" +
                "<slot>" +
                "</div>",
            mounted: function () {
                var _this = this;
                var style = document.createElement("style");
                DeskRTTools.headEle.insertAdjacentElement("beforeend", style);
                this.$watch("gutter", function () {
                    var gutter = _this.$props.gutter !== undefined ? parseInt(_this.$props.gutter) : undefined;
                    if (gutter !== undefined && gutter !== 0) {
                        style.innerHTML = ".el-resp[data-unique=\"" + _this.$data.unique + "\"] > :not(:last-child) {margin: 0 " + gutter + "px 0 0;}" +
                            "@media(min-width: 780px) {" +
                            (".el-resp[data-unique=\"" + _this.$data.unique + "\"] > * {width: 0;}") +
                            "}" +
                            "@media(max-width: 780px) {" +
                            (".el-resp[data-unique=\"" + _this.$data.unique + "\"] > :not(:last-child) {margin: 0 0 " + gutter + "px 0;}") +
                            "}";
                    }
                    else {
                        style.innerHTML = "";
                    }
                }, {
                    immediate: true
                });
            }
        });
        Vue.component("el-resp-row", {
            props: {
                gutter: {
                    default: undefined,
                    type: Number
                }
            },
            data: function () {
                return {
                    unique: "resp_row_" + (Math.random() * 100000000000000000)
                };
            },
            template: "<div class=\"el-resp-row\" :data-unique=\"unique\">" +
                "<slot>" +
                "</div>",
            mounted: function () {
                var _this = this;
                var style = document.createElement("style");
                DeskRTTools.headEle.insertAdjacentElement("beforeend", style);
                this.$watch("gutter", function () {
                    var gutter = _this.$props.gutter !== undefined ? parseInt(_this.$props.gutter) : undefined;
                    if (gutter !== undefined && gutter !== 0) {
                        style.innerHTML = ".el-resp-row[data-unique=\"" + _this.$data.unique + "\"] > :not(:last-child) {margin-right: " + gutter + "px;}";
                    }
                    else {
                        style.innerHTML = "";
                    }
                }, {
                    immediate: true
                });
            }
        });
        Vue.component("el-resp-col", {
            props: {
                flex: {
                    default: undefined
                }
            },
            template: "<div class=\"el-resp-col\" :style=\"{flex: flex}\">" +
                "<slot>" +
                "</div>"
        });
    };
    DeskRTTools.pre = "";
    DeskRTTools.end = "";
    DeskRTTools.i18n = "";
    DeskRTTools.locales = [];
    DeskRTTools.localePkg = ["zh-CN.element"];
    DeskRTTools.localeObj = {
        "en": {}
    };
    DeskRTTools.pages = {};
    DeskRTTools.outPath = [];
    return DeskRTTools;
}());
