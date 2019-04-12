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
define(["require", "exports", "./deskrt"], function (require, exports, DeskRT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var headElement = document.getElementsByTagName("head")[0];
    var bodyElement = document.getElementsByTagName("body")[0];
    var mainElement;
    var ROOT_PATH;
    var frameVue;
    var vuex;
    var UserConfig;
    var highlightjs;
    var tpLibs = {
        "vue,vuex,element-ui": "https://cdn.jsdelivr.net/combine/npm/vue@2.6.10/dist/vue.min.js,npm/vuex@3.1.0/dist/vuex.min.js,npm/element-ui@2.7.2/lib/index.js",
        "whatwg-fetch": ",npm/whatwg-fetch@3.0.0/fetch.min.js",
        "element-ui-css": "https://cdn.jsdelivr.net/npm/element-ui@2.7.2/lib/theme-chalk/index.css",
        "highlightjs": "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.15.6/build/highlight.min",
        "highlightjs-css": "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.15.6/build/styles/androidstudio.min.css"
    };
    function onReady(config, rp) {
        return __awaiter(this, void 0, void 0, function () {
            var jsPath, locale, clientLocale, elOpt, res, text, _a, _b, frameDiv, elFrame, elMenu, elHeader, elMenuHtml, elHeaderHtml, js, e_1, onSelect, $l, methods, computed, data;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ROOT_PATH = rp;
                        UserConfig = config;
                        DeskRT.__getConfig(config);
                        jsPath = tpLibs["vue,vuex,element-ui"];
                        if (typeof fetch !== "function") {
                            jsPath += tpLibs["whatwg-fetch"];
                        }
                        return [4, DeskRT.loadScript([jsPath])];
                    case 1:
                        _c.sent();
                        return [4, DeskRT.loadResource([
                                tpLibs["element-ui-css"],
                                {
                                    name: "deskrt-theme",
                                    path: ROOT_PATH + "deskrt.css"
                                }
                            ])];
                    case 2:
                        _c.sent();
                        locale = "";
                        if (!(config.localePath !== "")) return [3, 4];
                        clientLocale = localStorage.getItem("locale") || navigator.language;
                        if (config.locales.indexOf(clientLocale) === -1) {
                            locale = config.locales[0];
                        }
                        else {
                            locale = clientLocale;
                        }
                        elOpt = {
                            i18n: function (path) {
                                if (vuex.state.locale !== "zh-CN") {
                                    return DeskRT.__readLocale(path);
                                }
                            }
                        };
                        if (config.size) {
                            elOpt.size = config.size;
                        }
                        Vue.use(ELEMENT, elOpt);
                        return [4, DeskRT.__loadLocale(locale)];
                    case 3:
                        _c.sent();
                        return [3, 5];
                    case 4:
                        if (config.size) {
                            Vue.use(ELEMENT, {
                                size: config.size
                            });
                        }
                        _c.label = 5;
                    case 5:
                        vuex = new Vuex.Store({
                            state: {
                                path: "",
                                asideWidth: config.asideWidth,
                                locale: locale,
                                global: config.global
                            },
                            mutations: {
                                setPath: function (state, val) {
                                    state.path = val;
                                },
                                setLocale: function (state, val) {
                                    state.locale = val;
                                }
                            }
                        });
                        DeskRT.__getVuex(vuex);
                        Vue.use({
                            install: function (Vue, options) {
                                Vue.prototype.$global = vuex.state.global;
                                Vue.prototype.$asideWidth = vuex.state.asideWidth;
                                Vue.prototype.$path = vuex.state.path;
                            }
                        });
                        controlsInit();
                        window.addEventListener("hashchange", function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, onHashChange()];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); });
                        return [4, fetch(config.pre + config.frame + ".html?" + config.end)];
                    case 6:
                        res = _c.sent();
                        if (res.status === 404) {
                            alert("[Error] \"" + config.pre + config.frame + ".html\" not found.");
                            return [2];
                        }
                        _b = (_a = DeskRT).purify;
                        return [4, res.text()];
                    case 7:
                        text = _b.apply(_a, [_c.sent()]);
                        if (text === "") {
                            alert("[Error] Frame is empty.");
                            return [2];
                        }
                        frameDiv = document.createElement("div");
                        frameDiv.innerHTML = text;
                        elFrame = frameDiv.children[0];
                        elMenu = elFrame.querySelector("el-menu");
                        elHeader = elFrame.querySelector("el-header");
                        if (!elMenu || !elHeader) {
                            alert("[Error] <el-menu> or <el-header> not found.");
                            return [2];
                        }
                        elMenuHtml = elMenu.innerHTML;
                        elHeaderHtml = elHeader.innerHTML;
                        js = undefined;
                        if (!(elFrame.getAttribute("load-script") !== null)) return [3, 11];
                        _c.label = 8;
                    case 8:
                        _c.trys.push([8, 10, , 11]);
                        return [4, System.import(config.pre + config.frame)];
                    case 9:
                        js = _c.sent();
                        return [3, 11];
                    case 10:
                        e_1 = _c.sent();
                        alert("[Error] " + e_1.getMessage());
                        return [2];
                    case 11:
                        bodyElement.insertAdjacentHTML("afterbegin", "<div id=\"el-frame\">" +
                            "<el-container>" +
                            "<el-aside :width=\"$asideWidth\" :class=\"{'el--show': $data.__asideShow}\">" +
                            ("<el-logo" + (config.logo ? " style=\"background-image: url(" + (config.pre + config.logo) + ");\"" : "") + "></el-logo>") +
                            ("<el-menu @select=\"__onSelect\" :default-active=\"$path\">" + elMenuHtml + "</el-menu>") +
                            "</el-aside>" +
                            "<el-container>" +
                            "<el-header>" +
                            "<div class=\"el-header-left\">" +
                            "<el-header-item @click=\"$data.__asideShow=true\"><i class=\"el-icon-d-liebiaoshitucaidan\"></i></el-header-item>" +
                            "</div>" +
                            elHeaderHtml +
                            "</el-header>" +
                            "<el-main id=\"el-main\"></el-main>" +
                            "</el-container>" +
                            "</el-container>" +
                            "<div id=\"el-aside-mask\" :class=\"{'el--show':$data.__asideShow}\" @click=\"$data.__asideShow=false\"></div>" +
                            "</div>");
                        onSelect = function (index) {
                            window.location.hash = "#" + index;
                        };
                        $l = function (key) {
                            return DeskRT.__readLocale(key);
                        };
                        if (js !== undefined) {
                            methods = js.methods || {};
                            methods.__onSelect = onSelect;
                            methods.$l = $l;
                            computed = js.computed || {};
                            data = js.data || {};
                            data.__asideShow = false;
                            frameVue = new Vue({
                                el: "#el-frame",
                                data: data,
                                methods: methods,
                                computed: computed
                            });
                        }
                        else {
                            frameVue = new Vue({
                                el: "#el-frame",
                                data: {
                                    __asideShow: false
                                },
                                methods: {
                                    __onSelect: onSelect,
                                    $l: $l
                                }
                            });
                        }
                        DeskRT.__getFrameVue(frameVue);
                        mainElement = document.getElementById("el-main");
                        DeskRT.__getMainElement(mainElement);
                        if (!(window.location.hash === "")) return [3, 12];
                        window.location.hash = "#" + config.main;
                        return [3, 14];
                    case 12: return [4, onHashChange()];
                    case 13:
                        _c.sent();
                        _c.label = 14;
                    case 14: return [2];
                }
            });
        });
    }
    exports.onReady = onReady;
    function onHashChange() {
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = window.location.hash;
                        if (!(hash !== "")) return [3, 2];
                        hash = hash.slice(1);
                        return [4, openPage(hash)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2];
                }
            });
        });
    }
    var pageData = {};
    function openPage(path) {
        return __awaiter(this, void 0, void 0, function () {
            var queryIndex, query, queryArray, i, tmp, res, text, df, elPage, pageRandom_1, pageEle, needLoadScript, needLoadLink, styleTxt, i, dom, tagName, outPath, outPath, pkg, js, e_2, opt, vm_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
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
                        if (!pageData[path]) return [3, 5];
                        pageData[path].query = query;
                        frameVue.$data.__asideShow = false;
                        vuex.commit("setPath", path);
                        if (!pageData[path].onOpen) return [3, 3];
                        return [4, DeskRT.sleep(1)];
                    case 1:
                        _a.sent();
                        return [4, pageData[path].onOpen()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4, DeskRT.goCallback(pageData[path])];
                    case 4:
                        _a.sent();
                        DeskRT.__setGoCallback(function () { });
                        return [3, 18];
                    case 5:
                        DeskRT.showMask(true);
                        return [4, fetch(UserConfig.pre + path + ".html?" + UserConfig.end)];
                    case 6:
                        res = _a.sent();
                        text = "";
                        if (!(res.status === 404)) return [3, 7];
                        alert("[Error] 404 not found.");
                        return [2];
                    case 7: return [4, res.text()];
                    case 8:
                        text = _a.sent();
                        _a.label = 9;
                    case 9:
                        text = DeskRT.purify(text);
                        if (text === "") {
                            alert("[Error] Page is empty.");
                            return [2];
                        }
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
                        if (!(UserConfig.localePath !== "")) return [3, 11];
                        pkg = elPage.getAttribute("locale-pkg") || "";
                        pageEle.setAttribute("locale-pkg", pkg);
                        return [4, DeskRT.__loadLocale(vuex.state.locale, pkg)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [4, DeskRT.loadScript(needLoadScript)];
                    case 12:
                        _a.sent();
                        return [4, DeskRT.loadResource(needLoadLink)];
                    case 13:
                        _a.sent();
                        js = undefined;
                        if (!(elPage.getAttribute("load-script") !== null)) return [3, 17];
                        pageEle.setAttribute("load-script", "");
                        _a.label = 14;
                    case 14:
                        _a.trys.push([14, 16, , 17]);
                        return [4, System.import(UserConfig.pre + path)];
                    case 15:
                        js = _a.sent();
                        return [3, 17];
                    case 16:
                        e_2 = _a.sent();
                        alert("[Error] " + e_2.getMessage());
                        return [2];
                    case 17:
                        pageEle.innerHTML = elPage.innerHTML;
                        mainElement.appendChild(pageEle);
                        if (styleTxt !== "") {
                            headElement.insertAdjacentHTML("beforeend", "<style>" + styleTxt + "</style>");
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
                            return this.pagePath === vuex.state.path;
                        };
                        opt.computed._isMobile = function () {
                            return false;
                        };
                        opt.methods.$l = function (key) {
                            return DeskRT.__readLocale(key);
                        };
                        opt.mounted = function () {
                            this.$nextTick(function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var codeList, i, e_3, i;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(vm_1.onReady !== undefined)) return [3, 2];
                                                return [4, vm_1.onReady()];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2:
                                                codeList = vm_1.$el.querySelectorAll("code");
                                                if (!(codeList.length > 0)) return [3, 9];
                                                if (!(highlightjs === undefined)) return [3, 8];
                                                _a.label = 3;
                                            case 3:
                                                _a.trys.push([3, 6, , 7]);
                                                return [4, DeskRT.loadResource([tpLibs["highlightjs-css"]])];
                                            case 4:
                                                _a.sent();
                                                return [4, System.import(tpLibs.highlightjs)];
                                            case 5:
                                                highlightjs = _a.sent();
                                                for (i = 0; i < codeList.length; ++i) {
                                                    highlightjs.highlightBlock(codeList[i]);
                                                }
                                                DeskRT.__getHighlightjs(highlightjs);
                                                return [3, 7];
                                            case 6:
                                                e_3 = _a.sent();
                                                alert("[Error] " + e_3.getMessage());
                                                return [2];
                                            case 7: return [3, 9];
                                            case 8:
                                                for (i = 0; i < codeList.length; ++i) {
                                                    highlightjs.highlightBlock(codeList[i]);
                                                }
                                                _a.label = 9;
                                            case 9:
                                                DeskRT.hideMask();
                                                frameVue.$data.__asideShow = false;
                                                vuex.commit("setPath", path);
                                                if (!(vm_1.onOpen !== undefined)) return [3, 12];
                                                return [4, DeskRT.sleep(1)];
                                            case 10:
                                                _a.sent();
                                                return [4, vm_1.onOpen()];
                                            case 11:
                                                _a.sent();
                                                _a.label = 12;
                                            case 12: return [4, DeskRT.goCallback(pageData[path])];
                                            case 13:
                                                _a.sent();
                                                DeskRT.__setGoCallback(function () { });
                                                return [2];
                                        }
                                    });
                                });
                            });
                        };
                        vm_1 = new Vue(opt);
                        pageData[path] = vm_1;
                        _a.label = 18;
                    case 18: return [2];
                }
            });
        });
    }
    function controlsInit() {
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
                headElement.insertAdjacentElement("beforeend", style);
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
                headElement.insertAdjacentElement("beforeend", style);
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
    }
});
