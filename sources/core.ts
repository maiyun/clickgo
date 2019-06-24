/**
 * Copyright 2019 Han Guoshuai <zohegs@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as DeskRT from "./deskrt";

let _headElement = document.getElementsByTagName("head")[0];
let _bodyElement = document.getElementsByTagName("body")[0];
let _mainElement: HTMLElement;
let _progressChunk = (<HTMLElement>document.getElementById("el-progress-chunk"));
let _progressCount = 6;
let _frameVue: Vue;
let _vuex: Vuex.Store;
let _config: any;
let _highlightjs: highlightjs;

// --- 要加载的 tp 库的 link ---
let _tpLibs = {
    "vue,vuex,element-ui": "https://cdn.jsdelivr.net/combine/npm/vue@2.6.10/dist/vue.min.js,npm/vuex@3.1.1/dist/vuex.min.js,npm/element-ui@2.9.1/lib/index.js",
    "whatwg-fetch": ",npm/whatwg-fetch@3.0.0/fetch.min.js",
    "element-ui-css": "https://cdn.jsdelivr.net/npm/element-ui@2.9.1/lib/theme-chalk/index.css",
    "element-ui@ver": "element-ui@2.9.1",
    "highlightjs": "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.15.8/build/highlight.min",
    "highlightjs-css": "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.15.8/build/styles/androidstudio.min.css"
};

export async function onReady(config: any) {
    _config = config;
    // --- 导入 config 到 DeskRT 对象 ---
    DeskRT.__setConfig(config);
    if (_config.theme !== "") {
        await DeskRT.setTheme(_config.theme, false);
    }
    DeskRT.__setTpLibs(_tpLibs);
    // --- 加载 Vue / Vuex / Element UI / SystemJS / whatwg-fetch* ---
    // --- 别处还有 element-ui 的语言包版本需要对应，以及还有高亮 highlight.js 库 ---
    let jsPath = _tpLibs["vue,vuex,element-ui"];
    if (typeof fetch !== "function") {
        jsPath += _tpLibs["whatwg-fetch"];
    }
    await DeskRT.loadScript([jsPath], function() {
        _progressChunk.style.width = parseFloat(_progressChunk.style.width || "0") + 1 / _progressCount * 100 + "%";
    });
    await DeskRT.loadResource([
        _tpLibs["element-ui-css"],
        ROOT_PATH + "deskrt.css"
    ], function() {
        _progressChunk.style.width = parseFloat(_progressChunk.style.width || "0") + 1 / _progressCount * 100 + "%";
    });
    // --- 加载 locale，需要默认把 Element UI 的当前客户机语言加载，以及加载当前框架 default 语言包以供 frame 界面使用） ---
    let locale = "";
    if (config.localePath !== "") {
        // --- 设置当前语言 ---
        let clientLocale = localStorage.getItem("deskrt-locale") || navigator.language;
        if (config.locales.indexOf(clientLocale) === -1) {
            locale = config.locales[0];
        } else {
            locale = clientLocale;
        }
        // --- 设置 Element UI 的语言加载器 ---
        let elOpt: any = {
            i18n: function (path: string) {
                if (_vuex.state.locale !== "zh-CN") {
                    return DeskRT.__readLocale(path);
                }
            }
        };
        // --- 设置默认控件大小值 ---
        if (config.size) {
            elOpt.size = config.size;
        }
        Vue.use(ELEMENT, elOpt);
        await DeskRT.__loadLocale(locale);
    } else {
        // --- 设置默认控件大小值 ---
        if (config.size) {
            Vue.use(ELEMENT, {
                size: config.size
            });
        }
    }
    // --- 创建 vuex 对象 ---
    _vuex = new Vuex.Store({
        state: {
            path: "",                                   // --- 当前页面 ---
            asideWidth: config.asideWidth,              // --- 左边栏宽度 ---
            locale: locale,                             // --- 当前语言 ---
            global: config.global                       // --- 全局可变变量 ---
        },
        mutations: {
            setPath: function(state: any, val: string) {
                state.path = val;
            },
            setAsideWidth: function(state: any, val: string) {
                state.asideWidth = val;
            },
            setLocale: function(state: any, val: any) {
                state.locale = val;
            }
        }
    });
    // --- 执行 DeskRT 的 ready ---
    DeskRT.__setVuex(_vuex);
    // --- 设置全局响应式 ---
    Vue.use({
        install: function(Vue: any, options: any) {
            Vue.prototype.$global = _vuex.state.global;
            Vue.prototype.$l = function(key: string) {
                return DeskRT.__readLocale(key);
            };
            // --- 此值不响应，也没响应的意义，手机电脑还能变来变去？ ---
            Vue.prototype.$isMobile = navigator.userAgent.toLowerCase().indexOf("mobile") === -1 ? false : true;
            Vue.prototype.$go = DeskRT.go;
            Vue.prototype.$goBack = DeskRT.goBack;
        }
    });
    // --- 加载控件定义 ---
    controlsInit();
    // --- 注册 hashchange 事件，hash 变动时自动 open 页面 ---
    window.addEventListener("hashchange", async () => {
        // --- 必须在里面调用，否则函数体内的 this 指针会出问题 ---
        await onHashChange();
    });
    // --- 加载框架主要的 frame.html ---
    let res = await fetch(config.pre + config.frame + ".html?" + config.end);
    // --- 加载条 ---
    _progressChunk.style.width = parseFloat(_progressChunk.style.width || "0") + 1 / _progressCount * 100 + "%";
    if (res.status === 404) {
        alert(`[Error] "` + config.pre + config.frame + `.html" not found.`);
        return;
    }
    let text = DeskRT.purify(await res.text());
    if (text === "") {
        alert("[Error] Frame is empty.");
        return;
    }
    // --- 检测 frame 是否要加载 js（load-script 是否存在） ---
    let frameDiv = document.createElement("div");
    frameDiv.innerHTML = text;
    let elFrame = frameDiv.children[0];
    let elMenu = elFrame.querySelector("el-menu");
    let elHeader = elFrame.querySelector("el-header");
    if (!elMenu || !elHeader) {
        alert("[Error] <el-menu> or <el-header> not found.");
        return;
    }
    let elMenuHtml = elMenu.innerHTML;
    let elHeaderHtml = elHeader.innerHTML;
    // --- 加载 Frame 的 JS 文件（如果有） ---
    let js = undefined;
    if (elFrame.getAttribute("load-script") !== null) {
        try {
            js = await System.import(config.pre + config.frame);
            // --- 加载条 ---
            _progressChunk.style.width = parseFloat(_progressChunk.style.width || "0") + 1 / _progressCount * 100 + "%";
        } catch {
            alert(`[Error] Frame script not found.`);
            return;
        }
    } else {
        // --- 加载条 ---
        _progressChunk.style.width = parseFloat(_progressChunk.style.width || "0") + 1 / _progressCount * 100 + "%";
    }
    // --- 隐藏并卸载加载条 ---
    (<HTMLElement>document.getElementById("el-progress")).style.opacity = "0";
    setTimeout(function() {
        (<HTMLElement>document.getElementById("el-progress")).remove();
    }, 1000);
    // --- 将 Frame 插入 HTML ---
    _bodyElement.insertAdjacentHTML("afterbegin", `<div id="el-frame">` +
        `<el-container>` +
            `<el-aside :width="__asideWidth" :class="{'el--show': $data.__asideShow}">` +
                `<el-logo${config.logo ? ` style="background-image: url(${config.pre + config.logo});"` : ""}></el-logo>` +
                `<el-menu @select="__onSelect" :default-active="__path">${elMenuHtml}</el-menu>` +
            `</el-aside>` +
            `<el-container>` +
                `<el-header>` +
                    `<div class="el-header-left">` +
                        `<el-header-item @click="$data.__asideShow=true"><i class="el-icon-d-liebiaoshitucaidan"></i></el-header-item>` +
                    `</div>` +
                    elHeaderHtml +
                `</el-header>` +
                `<el-main id="el-main"></el-main>` +
            `</el-container>` +
        `</el-container>` +
        `<div id="el-aside-mask" :class="{'el--show':$data.__asideShow}" @click="$data.__asideShow=false"></div>` +
    `</div>`);
    // --- 点击左侧菜单产生的回调 ---
    let onSelect = (index: string) => {
        window.location.hash = "#" + index;
    };
    // --- frameVue 创建 ---
    if (js !== undefined) {
        // --- 有 js ---
        let methods = js.methods || {};
        methods.__onSelect = onSelect;
        let computed = js.computed || {};
        computed.__asideWidth = function() {
            return _vuex.state.asideWidth;
        };
        computed.__path = function() {
            return _vuex.state.path;
        };
        computed.$locale = function() {
            return _vuex.state.locale;
        };
        let data = js.data || {};
        data.__asideShow = false;
        _frameVue = new Vue({
            el: "#el-frame",
            data: data,
            methods: methods,
            computed: computed
        });
    } else {
        _frameVue = new Vue({
            el: "#el-frame",
            data: {
                __asideShow: false
            },
            methods: {
                __onSelect: onSelect
            },
            computed: {
                __asideWidth: function() {
                    return _vuex.state.asideWidth;
                },
                __path: function() {
                    return _vuex.state.path;
                },
                $locale: function() {
                    return _vuex.state.locale;
                }
            }
        });
    }
    DeskRT.__setFrameVue(_frameVue);
    // --- 赋值 ---
    _mainElement = <HTMLElement>document.getElementById("el-main");
    DeskRT.__setMainElement(_mainElement);
    // --- 加载主页 ---
    if (window.location.hash === "") {
        window.location.hash = "#" + config.main;
    } else {
        await onHashChange();
    }
}

/**
 * --- 当 Hash 发生改变时则执行 ---
 */
async function onHashChange() {
    let hash: string = window.location.hash;
    if (hash !== "") {
        hash = hash.slice(1);
        await openPage(hash);
    }
}

/** --- 所有页面对象列表 --- */
let pageData: any = {};
/**
 * --- 打开/跳转一个页面（URL 处 hash 地址不变，仅仅打开） ---
 * @param path 要打开的页面地址
 */
async function openPage(path: string) {
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
    // --- 判断 path 有没有被加载 ---
    if (pageData[path]) {
        // --- 已经加载过 ---
        pageData[path].query = query;
        // --- 手机端隐藏左侧菜单 ---
        _frameVue.$data.__asideShow = false;
        // --- 设置 path ---
        _vuex.commit("setPath", path);
        // --- onOpen 要在所有加载完毕后执行（页面显示之后） ---
        if (pageData[path].onOpen) {
            await DeskRT.sleep(1); // 加入延时防止一些因异步导致的异常问题
            await pageData[path].onOpen();
        }
        // --- 执行用户方法 ---
        await DeskRT.goCallback(pageData[path]);
        DeskRT.__setGoCallback(function() {});
    } else {
        // --- 未加载，加载 HTML 和 JS ---
        DeskRT.showMask(true);
        let res = await fetch(_config.pre + path + ".html?" + _config.end);
        let text = "";
        if (res.status === 404) {
            alert(`[Error] 404 not found.`);
            return;
        } else {
            text = await res.text();
        }
        text = DeskRT.purify(text);
        if (text === "") {
            alert(`[Error] Page is empty.`);
            return;
        }
        let df = document.createElement("div");
        df.innerHTML = text;
        let elPage = df.children[0];
        // --- 初始化要插入 page 的 dom ---
        let pageRandom = "page" + (Math.random() * 1000000000000).toFixed();
        let pageEle = document.createElement("div");
        pageEle.setAttribute(":class", "['el-page', {'el--show': $isPageShow}]");
        pageEle.setAttribute(pageRandom, "");
        if (elPage.getAttribute("v-loading") !== null) {
            pageEle.setAttribute("v-loading", elPage.getAttribute("v-loading") || "");
        }
        // --- 检测是否有 script、link 标签 ---
        let needLoadScript: string[] = [];
        let needLoadLink: string[] = [];
        let styleTxt: string = ""; // 要插入的 style 的内容
        for (let i = 0; i < elPage.children.length; ++i) {
            let dom = elPage.children[i];
            let tagName = dom.tagName.toLowerCase();
            if (tagName === "script") {
                let outPath;
                if (outPath = dom.getAttribute("src")) {
                    needLoadScript.push(outPath);
                    dom.remove();
                    --i;
                }
            } else if (tagName === "link") {
                let outPath;
                if (outPath = dom.getAttribute("href")) {
                    needLoadLink.push(outPath);
                    dom.remove();
                    --i;
                }
            } else if (tagName === "style") {
                styleTxt += dom.innerHTML.replace(/([\s\S]+?){([\s\S]+?)}/g, (t: string, $1: string, $2: string): string => {
                    return "[" + pageRandom + "] " + $1.replace(/, */g, ",[" + pageRandom + "] ") + "{" + $2 + "}";
                });
                dom.remove();
                --i;
            }
        }
        // --- 加载 i18n （前提是开启了 i18n） ---
        if (_config.localePath !== "") {
            let pkg = elPage.getAttribute("locale-pkg") || "";
            pageEle.setAttribute("locale-pkg", pkg);
            await DeskRT.__loadLocale(_vuex.state.locale, pkg);
        }
        // --- 加载外部文件 ---
        await DeskRT.loadScript(needLoadScript);
        await DeskRT.loadResource(needLoadLink);
        // --- 页面配套 js、css 加载完后 ---
        // --- 检测是否要加载 js ---
        let js = undefined;
        if (elPage.getAttribute("load-script") !== null) {
            pageEle.setAttribute("load-script", "");
            try {
                js = await System.import(_config.pre + path);
            } catch (e) {
                console.log(e);
                alert("[Error] Page script not found.");
                return;
            }
        }
        // --- 加载 HTML 到页面 ---
        pageEle.innerHTML = elPage.innerHTML;
        _mainElement.appendChild(pageEle);
        // --- 追加 style ---
        if (styleTxt !== "") {
            _headElement.insertAdjacentHTML("beforeend", `<style>${styleTxt}</style>`);
        }
        let opt: any;
        if (js !== undefined) {
            opt = {
                el: pageEle,
                data: js.data ? DeskRT.clone(js.data) : {},
                methods: js.methods,
                computed: js.computed,
                watch: js.watch ? DeskRT.clone(js.watch) : {}
            };
        } else {
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
        opt.computed.$isPageShow = function(this: any) {
            return this.pagePath === _vuex.state.path;
        };
        opt.computed.$locale = function() {
            return _vuex.state.locale;
        };
        // --- page vue 完全挂载完后执行的 ---
        opt.mounted = function () {
            this.$nextTick(async function () {
                // --- 接着执行的代码在这里 ---
                if (vm.onReady !== undefined) {
                    await vm.onReady();
                }
                // --- 判断是否要加载高亮代码着色库（要在页面 VUE 完全初始化完成后再进行，因为 code 的内容有可能是动态插值插入的） ---
                // --- onOpen 不应该在此处执行，onOpen 会在完全准备好后执行（加载界面消失之后） ---
                let codeList = vm.$el.querySelectorAll("code");
                if (codeList.length > 0) {
                    if (_highlightjs === undefined) {
                        // --- 加载 highlightjs 的 js 和 css 库 ---
                        try {
                            await DeskRT.loadResource([_tpLibs["highlightjs-css"]]);
                            _highlightjs = await System.import(_tpLibs.highlightjs);
                            // --- 进行染色 ---
                            for (let i = 0; i < codeList.length; ++i) {
                                _highlightjs.highlightBlock(codeList[i]);
                            }
                            DeskRT.__setHighlightjs(_highlightjs);
                        } catch (e) {
                            alert("[Error] " + e.getMessage());
                            return;
                        }
                    } else {
                        // --- 进行染色 ---
                        for (let i = 0; i < codeList.length; ++i) {
                            _highlightjs.highlightBlock(codeList[i]);
                        }
                    }
                }
                // --- 加载完毕隐藏 loading 框 ---
                DeskRT.hideMask();
                // --- 处理完后，进行统一的界面设定 ---
                // --- 手机端隐藏左侧菜单（开启页面意味着左侧菜单点击了，也就是在开启状态，此步骤有助于关闭） ---
                _frameVue.$data.__asideShow = false;
                // --- 设置 path，用于切换页面显示 ---
                _vuex.commit("setPath", path);
                // --- onOpen 要在所有加载完毕后执行（页面显示之后） ---
                if (vm.onOpen !== undefined) {
                    await DeskRT.sleep(1);
                    await vm.onOpen();
                }
                // --- 执行用户方法 ---
                await DeskRT.goCallback(pageData[path]);
                DeskRT.__setGoCallback(function() {});
            });
        };
        let vm: any = new Vue(opt);
        pageData[path] = vm;
    }
}

/**
 * 内部控件初始化
 */
function controlsInit() {
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
                            `<span class="el-upload-list__item-delete" @click="value.splice(index, 1);$emit('remove', index);$emit('input', value);">` +
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
        props: {
            controls: {
                default: []
            }
        },
        template: `<div class="el-phone-line">` +
            `<template>` +
                `<slot>` +
            `</template>` +
            `<el-button-group v-if="controls !== []">` +
                `<el-button v-for="control of controls" @click="$emit('action', control.name)" type="primary" :icon="control.icon" size="small">{{control.name}}</el-button>` +
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
    // --- Resp 响应式布局 ---
    Vue.component("el-resp", {
        props: {
            gutter: {
                default: undefined
            }
        },
        data: function() {
            return {
                unique: "resp_" + (Math.random() * 100000000000000000)
            };
        },
        template: `<div class="el-resp" :data-unique="unique">` +
            `<slot>` +
        `</div>`,
        mounted: function (this: Vue) {
            let style = document.createElement("style");
            _headElement.insertAdjacentElement("beforeend", style);
            this.$watch("gutter", () => {
                let gutter = this.$props.gutter !== undefined ? parseInt(this.$props.gutter) : undefined;
                if (gutter !== undefined && gutter !== 0) {
                    style.innerHTML = `.el-resp[data-unique="${this.$data.unique}"] > :not(:last-child) {margin: 0 ${gutter}px 0 0;}` +
                    `@media(min-width: 780px) {` +
                        `.el-resp[data-unique="${this.$data.unique}"] > * {width: 0;}` +
                    `}` +
                    `@media(max-width: 780px) {` +
                        `.el-resp[data-unique="${this.$data.unique}"] > :not(:last-child) {margin: 0 0 ${gutter}px 0;}` +
                    `}`;
                } else {
                    style.innerHTML = ``;
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
        data: function() {
            return {
                unique: "resp_row_" + (Math.random() * 100000000000000000)
            };
        },
        template: `<div class="el-resp-row" :data-unique="unique">` +
            `<slot>` +
        `</div>`,
        mounted: function (this: Vue) {
            let style = document.createElement("style");
            _headElement.insertAdjacentElement("beforeend", style);
            this.$watch("gutter", () => {
                let gutter = this.$props.gutter !== undefined ? parseInt(this.$props.gutter) : undefined;
                if (gutter !== undefined && gutter !== 0) {
                    style.innerHTML = `.el-resp-row[data-unique="${this.$data.unique}"] > :not(:last-child) {margin-right: ${gutter}px;}`;
                } else {
                    style.innerHTML = ``;
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
        template: `<div class="el-resp-col" :style="{flex: flex}">` +
            `<slot>` +
        `</div>`
    });
}