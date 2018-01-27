/*
 * DeskRT
 * Author: HanGuoShuai
 * Github: https://github.com/MaiyunNET/DeskRT
 */

namespace DeskRT {

    // --- 核心 ---
    export class Core {

        // --- 核心版本 ---
        public static version: string = "0.0.6";

        // --- 仅允许设置一次的 ---
        private static _pre: string;
        private static _end: string;
        private static _frame: string;
        private static _main: string;
        private static _logo: string;
        private static _theme: string;

        // --- Frame VM ---
        public static __frameVm: any;
        // --- Pop Div ---
        public static __popDiv: HTMLDivElement;

        // --- 全局 VUEX ---
        public static __vuex: Vuex.Store;

        // --- 全局变量 ---
        public static let: any;

        // --- 当前的 script 的标签 DOM ---
        public static __scriptElement: HTMLScriptElement;

        // --- 页面相关 ---
        public static __pages: any = {};

        public static init(opt: any) {
            this._pre = opt.pre || "";
            this._end = opt.end || "";
            this._frame = opt.frame || "";
            this._main = opt.main || "";
            this._logo = opt.logo || undefined;
            this._theme = opt.theme || "default";
            this.let = opt.let || {};

            document.addEventListener("DOMContentLoaded", (): void => {
                // --- 初始化 HTML ---
                let body = document.getElementsByTagName("body")[0];
                body.innerHTML = `<div id="el-pop">` +
                    `<div id="el-mask">` +
                        `<div class="el-spin el-spin-spinning"><span class="el-spin-dot"><i></i><i></i><i></i><i></i></span></div>` +
                    `</div>` +
                `</div>`;
                this.__popDiv = <HTMLDivElement>document.getElementById("el-pop");
                // --- 核心：根据 hash 操控 nav 和加载页面 ---
                let hashChange = (): void => {
                    let hash: string = window.location.hash;
                    if (hash !== "") hash = hash.substr(1);
                    if (hash !== "") {
                        this.open(hash);
                    }
                };
                window.addEventListener("hashchange", hashChange);
                // --- 加载 vue / vuex / 饿了么框架 / systemjs ---
                this.libs([
                    "https://cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js",
                    "https://cdn.jsdelivr.net/npm/vuex@3/dist/vuex.min.js",
                    "https://cdn.jsdelivr.net/npm/element-ui@2/lib/index.js",
                    "https://cdn.jsdelivr.net/npm/element-ui@2/lib/theme-chalk/index.css",
                    "https://cdn.jsdelivr.net/npm/systemjs@0/dist/system.js"
                ], () => {
                    // --- 初始化 SystemJS ---
                    SystemJS.config({
                        packages: {
                            "http:": {defaultExtension: "js?" + this._end},
                            "https:": {defaultExtension: "js?" + this._end}
                        }
                    });
                    // --- 初始化 vuex ---
                    this.__vuex = new Vuex.Store({
                        state: {
                            path: "", // --- 当前页面 ---
                            theme: this._theme // --- 当前主题 ---
                        },
                        mutations: {
                            set: function(state: any, o: any) {
                                state[o[0]] = o[1];
                            }
                        }
                    });
                    // --- 加载控件 ---
                    Controls.init();
                    // --- 加载 frame ---
                    Mask.show();
                    let goOn = true;
                    fetch(this._pre + this._frame + ".html?" + this._end).then((res) => {
                        if (res.status === 404) {
                            alert(`Error: "` + this._pre + this._frame + `.html" not found.`);
                            goOn = false;
                        }
                        return res.text();
                    }).then((text) => {
                        if (goOn) {
                            let callback = (js?: any) => {
                                Mask.hide();
                                // --- 分离 frame 文件中的 menu 和 header ---
                                text = this.purifyText(text);
                                let textArr = <RegExpMatchArray>text.match(/<el-menu(.+?)<\/el-menu><el-header>(.+?)<\/el-header>/);
                                if (textArr.length > 0) {
                                    // --- 将 Frame 插入 HTML ---
                                    body.insertAdjacentHTML("afterbegin", `<div id="el-frame" :class="[elTheme!='default' && 'el-theme-' + elTheme]">` +
                                        `<el-container>` +
                                            `<el-aside width="200px">` +
                                                `<el-logo${this._logo ? ` style="background-image: url(${this._logo});"` : ""}></el-logo>` +
                                                `<el-menu @select="elSelect" :default-active="DeskRT.Core.__vuex.state.path"${textArr[1]}</el-menu>` +
                                            `</el-aside>` +
                                            `<el-container>` +
                                                `<el-header>${textArr[2]}</el-header>` +
                                                `<el-main id="el-main">` +
                                                `</el-main>` +
                                            `</el-container>` +
                                        `</el-container>` +
                                    `</div>`);
                                    // --- 点击菜单项跳转 URL ---
                                    let elSelect = (index: string) => {
                                        window.location.hash = "#" + index;
                                    };
                                    if (js !== undefined) {
                                        // --- 有 js ---
                                        let methods = js.methods || {};
                                        methods.elSelect = elSelect;
                                        let computed = js.computed || {};
                                        computed.elTheme = function() {
                                            return Core.__vuex.state.theme;
                                        };
                                        Core.__frameVm = new Vue({
                                            el: "#el-frame",
                                            data: js.data,
                                            methods: methods,
                                            computed: computed
                                        });
                                    } else {
                                        Core.__frameVm = new Vue({
                                            el: "#el-frame",
                                            methods: {
                                                elSelect: elSelect
                                            },
                                            computed: {
                                                elTheme: function() {
                                                    return Core.__vuex.state.theme;
                                                }
                                            }
                                        });
                                    }
                                    // --- 加载主页 ---
                                    if (window.location.hash === "") {
                                        window.location.hash = "#" + this._main;
                                    } else {
                                        hashChange();
                                    }
                                } else {
                                    alert("Error: <el-menu> and <el-header> not found.");
                                }
                            };
                            // --- 加载 frame 的 js ---
                            SystemJS.import(this._pre + this._frame).then((js) => {
                                callback(js);
                            }).catch(() => {
                                callback();
                            });
                        }
                    });
                });
            });
        }

        // --- 开启 page ---
        public static open(path: string) {
            // --- 判断有没有问号 ---
            let queryIndex = path.indexOf("?");
            let query: any = {};
            if (queryIndex !== -1) {
                let queryArray = path.slice(queryIndex + 1).split("&");
                path = path.slice(0, queryIndex);
                for (let i = 0; i < queryArray.length; ++i) {
                    let tmp = queryArray[i].split("=");
                    query[tmp[0]] = decodeURIComponent(tmp[1]);
                }
            }
            // --- 设置 path ---
            this.__vuex.commit("set", ["path", path]);
            // --- 判断 path 有没有被加载 ---
            let pages = <HTMLDivElement>document.getElementById("el-main");
            if (this.__pages[path]) {
                // --- 已经加载过 ---
                this.__pages[path].elQuery = query;
                if (this.__pages[path].elOpen) {
                    this.__pages[path].elOpen();
                }
            } else {
                Mask.show();
                let goOn = true;
                fetch(this._pre + path + ".html?" + this._end).then((res) => {
                    if (res.status === 404) {
                        goOn = false;
                    }
                    return res.text();
                }).then((text) => {
                    if (goOn) {
                        // text 内容为 HTML
                        text = text.trim().slice(8, -9);
                        // --- TODO ---
                        let pageHTML = [`<el-page :class="['el-page', {'el--show': elPageShow}]"`];
                        if (text.indexOf("<pre>") !== -1) {
                            text = text.replace(/([\s\S]+?)<pre>([\s\S]+?)<\/pre>([\s\S]*?)/g, (t: string, $1: string, $2: string, $3: string): string => {
                                return this.purifyText($1) + "<pre>" + $2 + "</pre>";
                            });
                            let lio = text.lastIndexOf("</pre>");
                            text = text.slice(0, lio) + this.purifyText(text.slice(lio));
                            pageHTML.push(text + "/el-page>");
                        } else {
                            pageHTML.push(this.purifyText(text) + "/el-page>");
                        }
                        // --- js ---
                        let callback = (js?: any) => {
                            Mask.hide();
                            // --- 加载 HTML 到页面 ---
                            pages.insertAdjacentHTML("beforeend", pageHTML.join(""));
                            let page = pages.childNodes[pages.childNodes.length - 1];
                            let opt: any;
                            if (js !== undefined) {
                                opt = {
                                    el: page,
                                    data: Core.clone(js.data),
                                    methods: js.methods,
                                    computed: js.computed
                                };
                            } else {
                                opt = {
                                    el: page
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
                            opt.computed.elPageShow = function(this: any) {
                                return this.elPagePath === Core.__vuex.state.path;
                            };
                            opt.computed.elMobile = function(this: any) {
                                return this.elMobile === Core.__vuex.state.mobile;
                            };
                            let vm: any = new Vue(opt);
                            this.__pages[path] = vm;

                            let readyRtn = true;
                            if (vm.elReady !== undefined) {
                                readyRtn = vm.elReady();
                            }
                            if (vm.elOpen && (readyRtn !== false)) {
                                vm.elOpen();
                            }
                        };
                        SystemJS.import(this._pre + path).then((js) => {
                            callback(js);
                        }).catch(() => {
                            callback();
                        });
                    }
                });
            }
        }
        public static go(path: string) {
            window.location.hash = "#" + path;
        }

        // --- openUrl ---
        public static openUrl(url: string) {
            let a = document.getElementById("el-core-openurl");
            if (!a) {
                a = document.createElement("a");
                a.setAttribute("id", "el-core-openurl");
                a.setAttribute("target", "_blank");
                this.__popDiv.appendChild(a);
            }
            a.setAttribute("href", url);
            a.click();
        }

        // --- 顺序加载 libs 后在执行 callback 运行 ---
        private static _LIBS: string[] = [];
        public static libs(paths: string[], cb: () => any) {
            let noLoad: string[] = [];
            for (let path of paths) {
                if (this._LIBS.indexOf(path) === -1) {
                    noLoad.push(path);
                }
            }
            if (noLoad.length > 0) {
                // --- 顺序加载 ---
                Mask.show();
                this._libsLoad(0, noLoad, cb, document.getElementsByTagName("head")[0]);
            } else {
                cb();
            }
        }
        private static _libsLoad(index: number, paths: string[], cb: () => any, head: HTMLHeadElement) {
            this._LIBS.push(paths[index]);
            let ext = paths[index].slice(-3);
            if (ext === "css") {
                let link = document.createElement("link");
                link.rel = "stylesheet";
                link.addEventListener("load", () => {
                    ++index;
                    if (paths.length === index) {
                        Mask.hide();
                        cb();
                    } else {
                        this._libsLoad(index, paths, cb, head);
                    }
                });
                link.href = paths[index] + "?" + this._end;
                head.insertBefore(link, this.__scriptElement);
            } else {
                let script = document.createElement("script");
                script.addEventListener("load", () => {
                    ++index;
                    if (paths.length === index) {
                        Mask.hide();
                        cb();
                    } else {
                        this._libsLoad(index, paths, cb, head);
                    }
                });
                script.src = paths[index] + "?" + this._end;
                head.insertBefore(script, this.__scriptElement);
            }
        }

        // --- 更改主题 ---
        public static setTheme(theme: string) {
            this.__vuex.commit("set", ["theme", theme]);
        }

        // --- 数组去重 ---
        public static arrayUnique(arr: any[]): any[] {
            let res = [];
            let json: any = {};
            for (let val of arr) {
                if (!json[val]) {
                    res.push(val);
                    json[val] = 1;
                }
            }
            return res;
        }

        // --- 去除 html 的空白符、换行 ---
        public static purifyText(text: string): string {
            return text.replace(/>([\s\S]+?)</g, (t: string, $1: string) => {
                return ">" + $1.replace(/\t|\r\n|\n|\r|    /g, "") + "<";
            });
        }

        // --- HTML 转义 ---
        public static html2escape(html: string) {
            return html.replace(/[<>&"]/g, (c) => {
                return (<any>{"<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;"})[c];
            });
        }

        // --- 克隆 ---
        public static clone(obj: any) {
            let newObj: any = {};
            if (obj instanceof Array) {
                newObj = [];
            }
            for (let key in obj) {
                let val = obj[key];
                newObj[key] = typeof val === "object" ? Core.clone(val) : val;
            }
            return newObj;
        }

    }

    // --- 网络访问 ---
    export class Http {

        public static get(url: string, success: (o: any) => any) {
            fetch(url, {
                method: "GET",
                credentials: "include"
            }).then((res) => res.json()).then((j) => {
                success(j);
            });
        }

        public static post(url: string, data: any, success: (o: any) => any) {
            let header = new Headers();
            let body = new FormData();
            for (let k in data) {
                if (data[k] !== undefined) {
                    body.append(k, data[k]);
                }
            }
            fetch(url, {
                method: "POST",
                headers: header,
                credentials: "include",
                body: body
            }).then((res) => res.json()).then((j) => {
                success(j);
            });
        }

    }

    // --- 遮罩 ---
    export class Mask {

        public static show() {
            let frame = document.getElementById("el-frame");
            if (frame !== null) {
                frame.classList.add("el--mask");
            }
            (<HTMLDivElement>document.getElementById("el-mask")).classList.add("el--show");
        }

        public static hide() {
            let frame = document.getElementById("el-frame");
            if (frame !== null) {
                frame.classList.remove("el--mask");
            }
            (<HTMLDivElement>document.getElementById("el-mask")).classList.remove("el--show");
        }

    }

    // --- 控件 ---
    export class Controls {
        public static init() {
            // --- 头部 ---
            Vue.component("el-header-item", {
                template: `<div class="el-header-item" @click="$emit('click')"><slot></div>`
            });
            Vue.component("el-logo", {
                template: `<div class="el-logo"></div>`
            });
            // --- 信息表格 ---
            Vue.component("el-table-info", {
                template: `<table class="el-table-info">` +
                    `<tbody><slot></tbody>` +
                `</table>`
            });
            Vue.component("el-tr", {
                template: `<tr>` +
                    `<slot>` +
                `</tr>`
            });
            Vue.component("el-th", {
                template: `<th>` +
                    `<slot>` +
                `</th>`
            });
            Vue.component("el-td", {
                template: `<td>` +
                    `<slot>` +
                `</td>`
            });
            // --- 居中上间距 ---
            Vue.component("el-center", {
                template: `<div class="el-center">` +
                    `<slot>` +
                `</div>`
            });
            // --- 嵌入提示 ---
            Vue.component("el-tip", {
                template: `<div class="el-tip">` +
                    `<slot>` +
                `</div>`
            });
            // --- 表单下方小描述 ---
            Vue.component("el-exp", {
                template: `<div class="el-exp">` +
                    `<slot>` +
                `</div>`
            });
            // --- 照片墙 --- 扩展于 el-upload ---
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
                data: function() {
                    return {
                        dialogVisible: false,
                        dialogImageUrl: ""
                    };
                },
                methods: {
                    preview: function(this: any, url: string) {
                        this.dialogImageUrl = this.pre + url + this.endPreview;
                        this.dialogVisible = true;
                    },
                    click: function(this: any) {
                        this.$emit("select");
                    }
                },
                template: `<div class="el-pictureswall">` +
                    `<div>` +
                        `<ul class="el-upload-list el-upload-list--picture-card">` +
                            `<li v-for="(url, index) of value" tabindex="0" class="el-upload-list__item is-success">` +
                                `<img :src="pre + url + end" alt="" class="el-upload-list__item-thumbnail">` +
                                `<a class="el-upload-list__item-name">` +
                                    `<i class="el-icon-document"></i>` +
                                `</a>` +
                                `<i class="el-icon-close"></i>` +
                                `<span class="el-upload-list__item-actions">` +
                                    `<span class="el-upload-list__item-preview" @click="preview(url)">` +
                                        `<i class="el-icon-zoom-in"></i>` +
                                    `</span>` +
                                    `<span class="el-upload-list__item-delete" @click="value.splice(index, 1);$emit('input', value);">` +
                                        `<i class="el-icon-delete"></i>` +
                                    `</span>` +
                                `</span>` +
                            `</li>` +
                        `</ul>` +
                        `<div tabindex="0" class="el-upload el-upload--picture-card" @click="click">` +
                            `<i class="el-icon-plus"></i>` +
                            `<input name="file" class="el-upload__input" type="file">` +
                        `</div>` +
                    `</div>` +
                    `<el-dialog :visible.sync="dialogVisible" size="tiny">` +
                        `<img width="100%" :src="dialogImageUrl" alt="">` +
                    `</el-dialog>` +
                `</div>`
            });
            // --- 手机样式 ---
            Vue.component("el-phone", {
                props: {
                    padding: {
                        default: "0"
                    }
                },
                template: `<div class="el-phone">` +
                    `<div class="el-phone--inner" :style="{padding: padding}"><slot></div>` +
                `</div>`
            });
            Vue.component("el-phone-line", {
                template: `<div class="el-phone-line">` +
                    `<template>` +
                        `<slot>` +
                    `</template>` +
                    `<el-button-group>` +
                        `<el-button @click="$emit('addline')" type="primary" icon="el-icon-tickets" size="small">加行</el-button>` +
                        `<el-button @click="$emit('removeline')" type="primary" icon="el-icon-delete" size="small">删行</el-button>` +
                        `<el-button @click="$emit('addctr')" type="primary" icon="el-icon-circle-plus-outline" size="small">加控件</el-button>` +
                    `</el-button-group>` +
                `</div>`
            });
            // --- DataButton ---
            Vue.component("el-data-button-group", {
                props: {
                    delimiter: {
                        default: undefined
                    }
                },
                template: `<div class="el-data-button-group" :class="[delimiter !== undefined && 'el--delimiter']">` +
                    `<slot>` +
                `</div>`
            });
            Vue.component("el-data-button", {
                template: `<div class="el-data-button">` +
                    `<slot>` +
                `</div>`
            });
            // --- TileButton ---
            Vue.component("el-tile-button", {
                props: {
                    href: {
                        default: undefined
                    },
                    background: {
                        default: undefined
                    }
                },
                template: `<a class="el-tile-button" :class="[background && 'el--background', $slots.icon && 'el--icon']" :href="href" :style="{'background': background}">` +
                    `<div v-if="$slots.icon" class="el-tile-button__icon">` +
                        `<slot name="icon">` +
                    `</div>` +
                    `<div class="el-tile-button__body">` +
                        `<slot>` +
                    `</div>` +
                `</a>`
            });
        }
    }

}

// --- iOS 下 :last-child 在此时获取不到 ---
(() => {
    let temp = document.querySelectorAll("head > script");
    DeskRT.Core.__scriptElement = <HTMLScriptElement>temp[temp.length - 1];
})();



