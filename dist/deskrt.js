"use strict";
var DeskRT;
(function (DeskRT) {
    var Core = (function () {
        function Core() {
        }
        Core.init = function (opt) {
            var _this = this;
            this._pre = opt.pre || "";
            this._end = opt.end || "";
            this._frame = opt.frame || "";
            this._main = opt.main || "";
            this._logo = opt.logo || undefined;
            this._theme = opt.theme || "default";
            this.let = opt.let || {};
            document.addEventListener("DOMContentLoaded", function () {
                var body = document.getElementsByTagName("body")[0];
                body.innerHTML = "<div id=\"el-pop\">" +
                    "<div id=\"el-mask\">" +
                    "<div class=\"el-spin el-spin-spinning\"><span class=\"el-spin-dot\"><i></i><i></i><i></i><i></i></span></div>" +
                    "</div>" +
                    "</div>";
                _this.__popDiv = document.getElementById("el-pop");
                var hashChange = function () {
                    var hash = window.location.hash;
                    if (hash !== "")
                        hash = hash.substr(1);
                    if (hash !== "") {
                        _this.open(hash);
                    }
                };
                window.addEventListener("hashchange", hashChange);
                _this.libs([
                    "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js",
                    "https://cdn.jsdelivr.net/npm/vuex@3/dist/vuex.min.js",
                    "https://cdn.jsdelivr.net/npm/element-ui@2/lib/index.js",
                    "https://cdn.jsdelivr.net/npm/element-ui@2/lib/theme-chalk/index.css",
                    "https://cdn.jsdelivr.net/npm/systemjs@0/dist/system.js"
                ], function () {
                    SystemJS.config({
                        packages: {
                            "http:": { defaultExtension: "js?" + _this._end },
                            "https:": { defaultExtension: "js?" + _this._end }
                        }
                    });
                    _this.__vuex = new Vuex.Store({
                        state: {
                            path: "",
                            theme: _this._theme
                        },
                        mutations: {
                            set: function (state, o) {
                                state[o[0]] = o[1];
                            }
                        }
                    });
                    Controls.init();
                    Mask.show();
                    var goOn = true;
                    fetch(_this._pre + _this._frame + ".html?" + _this._end).then(function (res) {
                        if (res.status === 404) {
                            alert("Error: \"" + _this._pre + _this._frame + ".html\" not found.");
                            goOn = false;
                        }
                        return res.text();
                    }).then(function (text) {
                        if (goOn) {
                            var callback_1 = function (js) {
                                Mask.hide();
                                text = _this.purifyText(text);
                                var textArr = text.match(/<el-menu(.+?)<\/el-menu><el-header>(.+?)<\/el-header>/);
                                if (textArr.length > 0) {
                                    body.insertAdjacentHTML("afterbegin", "<div id=\"el-frame\" :class=\"[elTheme!='default' && 'el-theme-' + elTheme]\">" +
                                        "<el-container>" +
                                        "<el-aside width=\"200px\">" +
                                        ("<el-logo" + (_this._logo ? " style=\"background-image: url(" + _this._logo + ");\"" : "") + "></el-logo>") +
                                        ("<el-menu @select=\"elSelect\" :default-active=\"DeskRT.Core.__vuex.state.path\"" + textArr[1] + "</el-menu>") +
                                        "</el-aside>" +
                                        "<el-container>" +
                                        ("<el-header>" + textArr[2] + "</el-header>") +
                                        "<el-main id=\"el-main\">" +
                                        "</el-main>" +
                                        "</el-container>" +
                                        "</el-container>" +
                                        "</div>");
                                    var elSelect = function (index) {
                                        window.location.hash = "#" + index;
                                    };
                                    if (js !== undefined) {
                                        var methods = js.methods || {};
                                        methods.elSelect = elSelect;
                                        var computed = js.computed || {};
                                        computed.elTheme = function () {
                                            return Core.__vuex.state.theme;
                                        };
                                        Core.__frameVm = new Vue({
                                            el: "#el-frame",
                                            data: js.data,
                                            methods: methods,
                                            computed: computed
                                        });
                                    }
                                    else {
                                        Core.__frameVm = new Vue({
                                            el: "#el-frame",
                                            methods: {
                                                elSelect: elSelect
                                            },
                                            computed: {
                                                elTheme: function () {
                                                    return Core.__vuex.state.theme;
                                                }
                                            }
                                        });
                                    }
                                    if (window.location.hash === "") {
                                        window.location.hash = "#" + _this._main;
                                    }
                                    else {
                                        hashChange();
                                    }
                                }
                                else {
                                    alert("Error: <el-menu> and <el-header> not found.");
                                }
                            };
                            SystemJS.import(_this._pre + _this._frame).then(function (js) {
                                callback_1(js);
                            }).catch(function () {
                                callback_1();
                            });
                        }
                    });
                });
            });
        };
        Core.open = function (path) {
            var _this = this;
            var queryIndex = path.indexOf("?");
            var query = {};
            if (queryIndex !== -1) {
                var queryArray = path.slice(queryIndex + 1).split("&");
                path = path.slice(0, queryIndex);
                for (var i = 0; i < queryArray.length; ++i) {
                    var tmp = queryArray[i].split("=");
                    query[tmp[0]] = decodeURIComponent(tmp[1]);
                }
            }
            this.__vuex.commit("set", ["path", path]);
            var pages = document.getElementById("el-main");
            if (this.__pages[path]) {
                this.__pages[path].elQuery = query;
                if (this.__pages[path].elOpen) {
                    this.__pages[path].elOpen();
                }
            }
            else {
                Mask.show();
                var goOn_1 = true;
                fetch(this._pre + path + ".html?" + this._end).then(function (res) {
                    if (res.status === 404) {
                        goOn_1 = false;
                    }
                    return res.text();
                }).then(function (text) {
                    if (goOn_1) {
                        text = text.slice(9, -10);
                        var page_1 = document.createElement("div");
                        page_1.setAttribute(":class", "['el-page', {'el--show': elPageShow}]");
                        if (text.indexOf("<pre>") !== -1) {
                            text = text.replace(/([\s\S]+?)<pre>([\s\S]+?)<\/pre>([\s\S]*?)/g, function (t, $1, $2, $3) {
                                return _this.purifyText($1) + "<pre>" + $2 + "</pre>";
                            });
                            var lio = text.lastIndexOf("</pre>");
                            text = text.slice(0, lio) + _this.purifyText(text.slice(lio));
                            page_1.innerHTML = text;
                        }
                        else {
                            page_1.innerHTML = _this.purifyText(text);
                        }
                        var callback_2 = function (js) {
                            Mask.hide();
                            pages.appendChild(page_1);
                            var opt;
                            if (js !== undefined) {
                                opt = {
                                    el: page_1,
                                    data: js.data,
                                    methods: js.methods,
                                    computed: js.computed
                                };
                            }
                            else {
                                opt = {
                                    el: page_1
                                };
                            }
                            if (!opt.computed) {
                                opt.computed = {};
                            }
                            if (!opt.data) {
                                opt.data = {};
                            }
                            opt.data.elPagePath = path;
                            opt.data.elQuery = query;
                            opt.computed.elPageShow = function () {
                                return this.elPagePath === Core.__vuex.state.path;
                            };
                            opt.computed.elMobile = function () {
                                return this.elMobile === Core.__vuex.state.mobile;
                            };
                            var vm = new Vue(opt);
                            _this.__pages[path] = vm;
                            var readyRtn = true;
                            if (vm.elReady !== undefined) {
                                readyRtn = vm.elReady();
                            }
                            if (vm.elOpen && (readyRtn !== false)) {
                                vm.elOpen();
                            }
                        };
                        SystemJS.import(_this._pre + path).then(function (js) {
                            callback_2(js);
                        }).catch(function () {
                            callback_2();
                        });
                    }
                });
            }
        };
        Core.go = function (path) {
            window.location.hash = "#" + path;
        };
        Core.openUrl = function (url) {
            var a = document.getElementById("el-core-openurl");
            if (!a) {
                a = document.createElement("a");
                a.setAttribute("id", "el-core-openurl");
                a.setAttribute("target", "_blank");
                this.__popDiv.appendChild(a);
            }
            a.setAttribute("href", url);
            a.click();
        };
        Core.libs = function (paths, cb) {
            var noLoad = [];
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var path = paths_1[_i];
                if (this._LIBS.indexOf(path) === -1) {
                    noLoad.push(path);
                }
            }
            if (noLoad.length > 0) {
                Mask.show();
                this._libsLoad(0, noLoad, cb, document.getElementsByTagName("head")[0]);
            }
            else {
                cb();
            }
        };
        Core._libsLoad = function (index, paths, cb, head) {
            var _this = this;
            this._LIBS.push(paths[index]);
            var ext = paths[index].slice(-3);
            if (ext === "css") {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.addEventListener("load", function () {
                    ++index;
                    if (paths.length === index) {
                        Mask.hide();
                        cb();
                    }
                    else {
                        _this._libsLoad(index, paths, cb, head);
                    }
                });
                link.href = paths[index] + "?" + this._end;
                head.insertBefore(link, this.__scriptElement);
            }
            else {
                var script = document.createElement("script");
                script.addEventListener("load", function () {
                    ++index;
                    if (paths.length === index) {
                        Mask.hide();
                        cb();
                    }
                    else {
                        _this._libsLoad(index, paths, cb, head);
                    }
                });
                script.src = paths[index] + "?" + this._end;
                head.insertBefore(script, this.__scriptElement);
            }
        };
        Core.setTheme = function (theme) {
            this.__vuex.commit("set", ["theme", theme]);
        };
        Core.arrayUnique = function (arr) {
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
        Core.purifyText = function (text) {
            return text.replace(/\t|\r\n|\n|\r|    /g, "");
        };
        Core.html2escape = function (html) {
            return html.replace(/[<>&"]/g, function (c) {
                return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[c];
            });
        };
        Core.version = "0.0.4";
        Core.__pages = {};
        Core._LIBS = [];
        return Core;
    }());
    DeskRT.Core = Core;
    var Http = (function () {
        function Http() {
        }
        Http.get = function (url, success) {
            fetch(url, {
                method: "GET",
                credentials: "include"
            }).then(function (res) { return res.json(); }).then(function (j) {
                success(j);
            });
        };
        Http.post = function (url, data, success) {
            var header = new Headers();
            var body = new FormData();
            for (var k in data) {
                if (data[k] !== undefined) {
                    body.append(k, data[k]);
                }
            }
            fetch(url, {
                method: "POST",
                headers: header,
                credentials: "include",
                body: body
            }).then(function (res) { return res.json(); }).then(function (j) {
                success(j);
            });
        };
        return Http;
    }());
    DeskRT.Http = Http;
    var Mask = (function () {
        function Mask() {
        }
        Mask.show = function () {
            var frame = document.getElementById("el-frame");
            if (frame !== null) {
                frame.classList.add("el--mask");
            }
            document.getElementById("el-mask").classList.add("el--show");
        };
        Mask.hide = function () {
            var frame = document.getElementById("el-frame");
            if (frame !== null) {
                frame.classList.remove("el--mask");
            }
            document.getElementById("el-mask").classList.remove("el--show");
        };
        return Mask;
    }());
    DeskRT.Mask = Mask;
    var Controls = (function () {
        function Controls() {
        }
        Controls.init = function () {
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
                    "<span class=\"el-upload-list__item-delete\" @click=\"value.splice(index, 1);$emit('input', value);\">" +
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
                template: "<div class=\"el-phone-line\">" +
                    "<template>" +
                    "<slot>" +
                    "</template>" +
                    "<el-button-group>" +
                    "<el-button @click=\"$emit('addline')\" type=\"primary\" icon=\"el-icon-tickets\" size=\"small\">\u52A0\u884C</el-button>" +
                    "<el-button @click=\"$emit('removeline')\" type=\"primary\" icon=\"el-icon-delete\" size=\"small\">\u5220\u884C</el-button>" +
                    "<el-button @click=\"$emit('addctr')\" type=\"primary\" icon=\"el-icon-circle-plus-outline\" size=\"small\">\u52A0\u63A7\u4EF6</el-button>" +
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
        };
        return Controls;
    }());
    DeskRT.Controls = Controls;
})(DeskRT || (DeskRT = {}));
(function () {
    var temp = document.querySelectorAll("head > script");
    DeskRT.Core.__scriptElement = temp[temp.length - 1];
})();
