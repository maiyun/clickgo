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

window.onerror = (msg, uri, line, col, err) => {
    if (err) {
        alert("Error:\n" + err.message + "\n" + err.stack + "\nLine: " + line + "\nColumn: " + col);
    } else {
        console.log(msg);
    }
};

// --- 核心 ---
class DeskRT {

    /** DeskRT 核心版本 */
    public static version: string = "1.2.0";

    /** 全局可用的变量 */
    public static let: any;

    /** 全局可用的响应式变量 */
    public static g: any;

    // --- 可重复设置的（拥有 get 与 set 方法） ---

    /** 当前的左边栏宽度 */
    private static _asideWidth: string;
    public static get asideWidth(): string {
        return this._asideWidth;
    }
    public static set asideWidth(width: string) {
        DeskRTTools.vuex.commit("setAsideWidth", width);
        this._asideWidth = width;
    }

    // --- 初始化 ---
    public static init(opt: any) {
        DeskRTTools.pre = opt.pre || "";
        DeskRTTools.end = opt.end || "";
        DeskRTTools.i18n = opt.i18n || "";
        DeskRTTools.locales = opt.locales || ["en", "zh-CN"];
        let frame = opt.frame || "";
        let main = opt.main || "";
        let logo = opt.logo || "";
        let size = opt.size || "";
        let paths = opt.paths || {};
        this._asideWidth = opt.asideWidth || "200px";
        this.let = opt.let || {};
        let global = opt.global || {};

        // --- 网页 DOM 加载完成后开始执行 ---
        document.addEventListener("touchstart", function() {});
        document.addEventListener("DOMContentLoaded", () => {
            // --- 获取 body 的 DOM ---
            let body = document.getElementsByTagName("body")[0];
            // --- 插入 Pop 层 DOM ---
            body.innerHTML = `<div id="el-pop">` +
                `<div id="el-mask" class="el--show">` +
                    `<div class="el-loading">` +
                        `<div class="el-loading-1"></div>` +
                        `<div class="el-loading-2"></div>` +
                    `</div>` +
                `</div>` +
                `<div id="el-text-mask">Loading...</div>` +
            `</div>`;
            DeskRTTools.popEle = <HTMLDivElement>document.getElementById("el-pop");
            DeskRTTools.headEle = document.getElementsByTagName("head")[0];

            // --- 先加载异步对象，这个很重要 ---
            let callback = async () => {
                // --- 注册 hashchange 事件，hash 变动时自动 open 页面 ---
                window.addEventListener("hashchange", async () => {
                    // --- 必须在里面调用，否则函数体内的 this 指针会出问题 ---
                    await DeskRTTools.onHashChange();
                });

                // --- 加载 Vue / Vuex / Element UI / SystemJS / whatwg-fetch* / promise-polyfill* ---
                // --- 别处还有 element-ui 的语言包版本需要对应，以及还有高亮 highlight.js 库 ---
                let jsPath = "https://cdn.jsdelivr.net/combine/npm/vue@2.6.10/dist/vue.min.js,npm/vuex@3.1.0/dist/vuex.min.js,npm/element-ui@2.7.0/lib/index.js,npm/systemjs@0.21.6/dist/system.min.js";
                if (typeof fetch !== "function") {
                    jsPath += ",npm/whatwg-fetch@3.0.0/fetch.min.js";
                }
                // --- 异步加载 element 的 css 基文件（是基本的基，不是搞基的基） ---
                DeskRTTools.headEle.insertAdjacentHTML("afterbegin", `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-ui@2.7.0/lib/theme-chalk/index.css">`);
                await this.loadScript([jsPath]);
                // --- 初始化 SystemJS ---
                System.config({
                    packages: {
                        "http:": {defaultExtension: "js?" + DeskRTTools.end},
                        "https:": {defaultExtension: "js?" + DeskRTTools.end}
                    },
                    map: paths
                });
                // --- 加载 i18n，需要默认把 Element UI 的当前客户机语言加载，以及加载当前框架 default 语言包以供 frame 界面使用） ---
                let locale = "";
                if (DeskRTTools.i18n !== "") {
                    // --- 设置当前语言 ---
                    let naviLocale = localStorage.getItem("locale") || navigator.language;
                    if (DeskRTTools.locales.indexOf(naviLocale) === -1) {
                        locale = DeskRTTools.locales[0];
                    } else {
                        locale = naviLocale;
                    }
                    // --- 设置 Element UI 的语言加载器 ---
                    let elOpt: any = {
                        i18n: function (path: string) {
                            if (DeskRTTools.vuex.state.locale !== "zh-CN") {
                                return DeskRTTools.readLocale(path);
                            }
                        }
                    };
                    // --- 设置默认控件大小值 ---
                    if (size !== "") {
                        elOpt.size = size;
                    }
                    Vue.use(ELEMENT, elOpt);
                    await DeskRTTools.loadLocale(locale);
                } else {
                    // --- 设置默认控件大小值 ---
                    if (size !== "") {
                        Vue.use(ELEMENT, {
                            size: size
                        });
                    }
                }
                // --- 初始化 vuex ---
                DeskRTTools.vuex = new Vuex.Store({
                    state: {
                        path: "",                       // --- 当前页面 ---
                        asideWidth: this._asideWidth,   // --- 左边栏宽度 ---
                        locale: locale,                 // --- 当前语言 ---
                        global: global                  // --- 全局可变变量 ---
                    },
                    mutations: {
                        setPath: function(state: any, val: any) {
                            state.path = val;
                        },
                        setAsideWidth: function(state: any, val: any) {
                            state.asideWidth = val;
                        },
                        setLocale: function(state: any, val: any) {
                            state.locale = val;
                        }
                    }
                });
                // --- 加载控件定义信息到 Vue ---
                DeskRTTools.controlsInit();

                // --- 全局响应式变量 ---
                Vue.use({
                    install: function(Vue: any, options: any) {
                        Vue.prototype.$global = DeskRTTools.vuex.state.global;
                    }
                });

                // --- 加载框架主要的 frame.html ---
                let res = await fetch(DeskRTTools.pre + frame + ".html?" + DeskRTTools.end);
                if (res.status === 404) {
                    alert(`Error: "` + DeskRTTools.pre + frame + `.html" not found.`);
                    return;
                }
                let text = this.purify(await res.text());
                if (text !== "") {
                    // --- 检测 frame 是否要加载 js（load-script 是否存在） ---
                    let df = document.createElement("div");
                    df.innerHTML = text;
                    let elFrame = df.children[0];
                    let elMenu = elFrame.querySelector("el-menu");
                    let elHeader = elFrame.querySelector("el-header");
                    if (elMenu && elHeader) {
                        let elMenuHtml = elMenu.innerHTML;
                        let elHeaderHtml = elHeader.innerHTML;
                        // --- 加载 Frame 的 JS 文件（如果有） ---
                        let js = undefined;
                        if (elFrame.getAttribute("load-script") !== null) {
                            try {
                                js = await System.import(DeskRTTools.pre + frame);
                            } catch {
                                alert(`Load script error(1)`);
                                return;
                            }
                        }
                        // --- 将 Frame 插入 HTML ---
                        body.insertAdjacentHTML("afterbegin", `<div id="el-frame">` +
                            `<el-container>` +
                                `<el-aside :width="_asideWidth" :class="{'el--show': elAsideShow}">` +
                                    `<el-logo${logo ? ` style="background-image: url(${DeskRTTools.pre + logo});"` : ""}></el-logo>` +
                                    `<el-menu @select="_onSelect" :default-active="DeskRTTools.vuex.state.path">${elMenuHtml}</el-menu>` +
                                `</el-aside>` +
                                `<el-container>` +
                                    `<el-header>` +
                                        `<div class="el-header-left">` +
                                            `<el-header-item @click="elAsideShow=true"><i class="el-icon-d-liebiaoshitucaidan"></i></el-header-item>` +
                                        `</div>` +
                                        elHeaderHtml +
                                    `</el-header>` +
                                    `<el-main id="el-main"></el-main>` +
                                `</el-container>` +
                            `</el-container>` +
                            `<div id="el-aside-mask" :class="{'el--show': elAsideShow}" @click="elAsideShow=false"></div>` +
                        `</div>`);
                        // --- 点击左侧菜单产生的回调 ---
                        let onSelect = (index: string) => {
                            window.location.hash = "#" + index;
                        };
                        // --- 读取语言数据 ---
                        let $l = (key: string) => {
                            return DeskRTTools.readLocale(key);
                        };
                        if (js !== undefined) {
                            // --- 有 js ---
                            let methods = js.methods || {};
                            methods._onSelect = onSelect;
                            methods.$l = $l;
                            let computed = js.computed || {};
                            computed._asideWidth = () => {
                                return DeskRTTools.vuex.state.asideWidth;
                            };
                            let data = js.data || {};
                            data.elAsideShow = false;
                            DeskRTTools.frameVue = new Vue({
                                el: "#el-frame",
                                data: data,
                                methods: methods,
                                computed: computed
                            });
                        } else {
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
                                    _asideWidth: () => {
                                        return DeskRTTools.vuex.state.asideWidth;
                                    }
                                }
                            });
                        }
                        DeskRTTools.mainEle = <HTMLMainElement>document.getElementById("el-main");
                        // --- 加载主页 ---
                        if (window.location.hash === "") {
                            window.location.hash = "#" + main;
                        } else {
                            await DeskRTTools.onHashChange();
                        }
                    } else {
                        alert("Error: <el-menu> or <el-header> not found.");
                    }
                } else {
                    alert("Error: Frame is empty.");
                }
            };
            if (typeof Promise !== "function") {
                let script = document.createElement("script");
                script.addEventListener("load", () => {
                    callback();
                });
                script.addEventListener("error", () => {
                    alert("Load error.");
                });
                script.src = "https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.0/dist/polyfill.min.js";
                DeskRTTools.headEle.appendChild(script);
            } else {
                callback();
            }
        });
    }

    /**
     * --- 跳转页面到一个新页面 ---
     * @param path 要跳转的页面
     * @param callback 跳转成功后要执行的 methods 以及一个传参
     */
    public static go(path: string, callback?: (vm: any) => any): void {
        DeskRTTools.goCallback = callback;
        window.location.hash = "#" + path;
    }

    /**
     * --- 返回上级页面（基于原生） ---
     */
    public static goBack(): void {
        history.back();
    }

    /**
     * --- 切换当前语言（如果语言不存在会被自动加载，会自动触发 callback 和 mask 相关操作） ---
     * @param loc 目标语言值
     */
    public static async setLocale(loc: string) {
        if (DeskRTTools.vuex.state.locale !== loc) {
            if (DeskRTTools.locales.indexOf(loc) !== -1) {
                // --- 检测当前开启页面的 pkg ---
                let nowPage = DeskRTTools.mainEle.querySelector(".el-page.el--show");
                if (nowPage) {
                    let pkg = nowPage.getAttribute("locale-pkg") || "";
                    await DeskRTTools.loadLocale(loc, pkg, () => {
                        this.showMask(true);
                    }, () => {
                        this.hideMask();
                    });
                    DeskRTTools.vuex.commit("setLocale", loc);
                    localStorage.setItem("locale", loc);
                } else {
                    alert(`Page not opened.`);
                }
            } else {
                alert(`Locale "${loc}" definition not found(locales).`);
            }
        }
    }

    /**
     * --- 顺序加载 js 后再执行 callback ---
     * @param paths 要加载文件的路径数组
     * @param cb 加载完后执行的回调
     */
    public static loadScript(paths: string[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (paths.length > 0) {
                    for (let i = 0; i < paths.length; ++i) {
                        if (DeskRTTools.outPath.indexOf(paths[i]) === -1) {
                            DeskRTTools.outPath.push(paths[i]);
                            await DeskRTTools.loadOutScript(paths[i] + "?" + DeskRTTools.end);
                        }
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
    public static loadLink(paths: string[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (paths.length > 0) {
                    for (let i = 0; i < paths.length; ++i) {
                        if (DeskRTTools.outPath.indexOf(paths[i]) === -1) {
                            DeskRTTools.outPath.push(paths[i]);
                            await DeskRTTools.loadOutLink(paths[i] + "?" + DeskRTTools.end);
                        }
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * --- 数组去重 ---
     * @param arr 要去重的数组
     */
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

    /**
     * --- 去除 html 的空白符、换行（pre 里的不去除） ---
     * @param text 要纯净的字符串
     */
    public static purify(text: string): string {
        if (text.toLowerCase().indexOf("<pre") !== -1) {
            // --- 有代码块，代码块之间的代码不做处理 ---
            text = text.replace(/^\s+|\s+$/g, "").replace(/([\s\S]*?)<pre([\s\S]*?)>([\s\S]*?)<\/pre>/ig, (t: string, $1: string, $2: string, $3: string): string => {
                return this._purify($1) + "<pre" + $2 + ">" + this._purifyPre($3) + "</pre>";
            });
            let lio = text.toLowerCase().lastIndexOf("</pre>");
            return text.slice(0, lio) + this._purify(text.slice(lio));
        } else {
            return this._purify(text.replace(/^\s+|\s+$/g, ""));
        }
    }
    // --- 去除标签之外的部分 ---
    private static _purify(text: string): string {
        text = ">" + text + "<";
        text = text.replace(/>([\s\S]*?)</g, (t: string, $1: string) => {
            return ">" + this._purifyTxt($1) + "<";
        });
        return text.slice(1, -1);
    }
    private static _purifyTxt(text: string): string {
        return text.replace(/\t|\r\n|  /g, "").replace(/\n|\r/g, "");
    }
    private static _purifyPre(text: string): string {
        text = this.trim(text);
        if (text.toLowerCase().indexOf("<code") !== -1) {
            text = text.replace(/<code(.*?)>(\s*)/gi, (t: string, $1: string, $2: string) => {
                return "<code" + $1 + ">";
            }).replace(/(\s*?)<\/code/gi, (t: string, $1: string) => {
                return "</code";
            });
        }
        return text;
    }

    /**
     * --- 完整的克隆一份数组/对象 ---
     * @param obj 要克隆的对象
     */
    public static clone(obj: any) {
        let newObj: any = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (let key in obj) {
            let val = obj[key];
            newObj[key] = typeof val === "object" ? DeskRT.clone(val) : val;
        }
        return newObj;
    }

    /**
     * --- 去除前导尾随 ---
     * @param text 要去除的字符串
     */
    public static trim(text: string): string {
        return text.replace(/^\s+|\s+$/g, "");
    }

    /**
     * --- 将一段字符串中的 HTML 代码转义 ---
     * @param html HTML 代码
     */
    public static html2escape(html: string): string {
        return html.replace(/[<>&"]/g, (c) => {
            return (<any>{"<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;"})[c];
        });
    }

    /**
     * --- 休眠一段时间 ---
     * @param timeout 休眠时间
     */
    public static sleep(timeout: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, timeout);
        });
    }

    /**
     * --- 手动传入 code 值并高亮 code 代码块 ---
     * @param dom Element 对象
     * @param code code 值
     */
    public static highlight(dom: HTMLElement, code: string): void {
        if (DeskRTTools.highlightjs !== undefined) {
            dom.innerText = code;
            DeskRTTools.highlightjs.highlightBlock(dom);
        } else {
            alert("Error: highlight.js not loaded.");
        }
    }

    // --- 网络访问 ---

    /**
     * --- 发起 get 请求 ---
     * @param url 要请求的 URL 地址
     */
    public static async get(url: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await fetch(url, {
                    method: "GET",
                    credentials: "include"
                });
                let text;
                let ct = res.headers.get("Content-Type") || "";
                if (ct.indexOf("json") !== -1) {
                    text = await res.json();
                } else {
                    text = await res.text();
                }
                resolve(text);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * --- 发起 post 请求 ---
     * @param url 要请求的 URL 地址
     * @param data 发送的数据
     */
    public static async post(url: string, data: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let header = new Headers();
                let body = new FormData();
                for (let k in data) {
                    if (data[k] !== undefined) {
                        body.append(k, data[k]);
                    }
                }
                let res = await fetch(url, {
                    method: "POST",
                    headers: header,
                    credentials: "include",
                    body: body
                });
                let text;
                let ct = res.headers.get("Content-Type") || "";
                if (ct.indexOf("json") !== -1) {
                    text = await res.json();
                } else {
                    text = await res.text();
                }
                resolve(text);
            } catch (e) {
                reject(e);
            }
        });
    }

    // --- 遮罩 ---

    /**
     * 显示全局遮罩
     */
    public static showMask(top: boolean = false): void {
        let elMask = (<HTMLDivElement>document.getElementById("el-mask"));
        elMask.classList.add("el--show");
        if (top) {
            elMask.classList.add("el--top");
        } else {
            elMask.classList.remove("el--top");
        }
    }

    /**
     * 隐藏全局遮罩
     */
    public static hideMask(): void {
        (<HTMLDivElement>document.getElementById("el-mask")).classList.remove("el--show");
    }

    /**
     * --- 显示最高层优先级带文字的遮罩 ---
     * @param text 要显示的文字
     */
    public static showTextMask(text: string): void {
        let $mask =  (<HTMLDivElement>document.getElementById("el-text-mask"));
        $mask.innerHTML = text;
        $mask.classList.add("el--show");
    }

    /**
     * --- 隐藏最高层优先级带文字的遮罩 ---
     */
    public static hideTextMask() {
        (<HTMLDivElement>document.getElementById("el-text-mask")).classList.remove("el--show");
    }

    // --- 窗体类 ---

    /**
     * --- 显示 alert 窗体 ---
     * @param text 文本
     */
    public static async alert(text: string): Promise<boolean> {
        await DeskRTTools.frameVue.$alert(text, undefined, {
            showClose: false,
            type: "warning"
        });
        return true;
    }

    /**
     * --- 显示确认窗体 ---
     * @param text 文本
     */
    public static async confirm(text: string): Promise<boolean> {
        try {
            await DeskRTTools.frameVue.$confirm(text, undefined, {
                showClose: false,
                type: "info"
            });
            return true;
        } catch {
            return false;
        }
    }

}

// --- 其他工具 ---
class DeskRTTools {

    // --- 变量 ---
    public static pre: string = "";
    public static end: string = "";

    // --- i18n 相关 ---
    /** i18n 文件路径 */
    public static i18n: string = "";
    /** 初始化时可自动调整的语言值 */
    public static locales: string[] = [];
    /** 已加载的数据包标签 */
    public static localePkg: string[] = ["zh-CN.element"];
    /** 已加载的语言包数据 */
    public static localeObj: any = {
        "en": {}
    };

    // --- 对象 ---

    /** 框架的 VUE 对象 */
    public static frameVue: any;
    /** 全局 VUEX 对象 */
    public static vuex: Vuex.Store;
    /** 所有页面的列表 */
    public static pages: any = {};
    /** 已加载的外部路径 */
    public static outPath: string[] = [];
    /** 高亮 js 对象 */
    public static highlightjs: highlightjs;

    // --- DOM 标签 ---

    /** 浮动层的 DOM 对象 */
    public static popEle: HTMLDivElement;
    /** el-main 对应的 DOM 对象 */
    public static mainEle: HTMLMainElement;
    /** head 标签 */
    public static headEle: HTMLHeadElement;



    // --- 事件 Event ---



    /**
     * --- 当 Hash 发生改变时则执行 ---
     */
    public static async onHashChange() {
        let hash: string = window.location.hash;
        if (hash !== "") {
            hash = hash.substr(1);
            await this.openPage(hash);
        }
    }



    // --- 其他方法 ---



    // --- 加载 script 标签（1条）并等待返回成功（无视是否已经加载过） ---
    public static loadOutScript(path: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let script = document.createElement("script");
            script.addEventListener("load", () => {
                resolve();
            });
            script.addEventListener("error", () => {
                reject("Load error.");
            });
            script.src = path;
            this.headEle.appendChild(script);
        });
    }
    public static loadOutLink(path: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let link = document.createElement("link");
            link.rel = "stylesheet";
            link.addEventListener("load", () => {
                resolve();
            });
            link.addEventListener("error", () => {
                reject("Load error.");
            });
            link.href = path;
            this.headEle.appendChild(link);
        });
    }

    /**
     * --- 获取语言值（语言不存在会出错，不会自动加载） ---
     * @param key 读的值，如 message.ok
     */
    public static readLocale(key: string): string {
        try {
            return key.split(".").reduce((p, k) => p[k], this.localeObj[this.vuex.state.locale]);
        } catch (e) {
            console.log(e);
            return "LocaleError";
        }
    }

    /**
     * --- 根据当前设定语言加载语言包 ---
     * @param locale 要加载的目标语言
     * @param pkg 包名，为空自动填充为 default
     * @param before 如果需要加载，则在加载前会被执行
     * @param after 如果需要加载，则在加载完毕后会被执行
     */
    public static loadLocale(locale: string, pkg: string = "", before: () => any = () => {}, after: () => any = () => {}): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (pkg === "") {
                pkg = "default";
            }
            let isBefore = false;   // --- 是否需要加载额外语言包 ---
            // --- 先检测 Element UI 的语言包是否加载 ---
            if (DeskRTTools.localePkg.indexOf(locale + ".element") === -1) {
                isBefore = true;
                before();
                // --- 加载 Element UI 的官方语言包 ---
                try {
                    let loc = await System.import(`https://cdn.jsdelivr.net/npm/element-ui@2.7.0/lib/locale/lang/${locale}`);
                    if (!this.localeObj[locale]) {
                        this.localeObj[locale] = {};
                    }
                    this.localeObj[locale].el = loc.default.el;
                    this.localePkg.push(locale + ".element");
                } catch {
                    reject("Element UI locale file error.");
                }
            }
            // --- 再检测 default 语言包是否加载了（无论如何 default 语言包必须加载） ---
            if (DeskRTTools.localePkg.indexOf(locale + ".default") === -1) {
                if (isBefore === false) {
                    isBefore = true;
                    before();
                }
                try {
                    let loc = await System.import(`${this.pre}${this.i18n}${locale}`);
                    if (!this.localeObj[locale]) {
                        this.localeObj[locale] = {};
                    }
                    for (let k in loc.default) {
                        this.localeObj[locale][k] = loc.default[k];
                    }
                    this.localePkg.push(locale + ".default");
                } catch {
                    reject(`Load locale file "${locale}.js" error.`);
                }
            }
            // --- 最后检测当前 pkg 是否存在（如果当前 pkg 是 default，则自动会被跳过，因为已经存在于 localePkg 里了） ---
            if (DeskRTTools.localePkg.indexOf(locale + "." + pkg) === -1) {
                if (isBefore === false) {
                    isBefore = true;
                    before();
                }
                try {
                    let loc = await System.import(`${this.pre}${this.i18n}${locale}${pkg !== "default" ? "." + pkg : ""}`);
                    if (!this.localeObj[locale]) {
                        this.localeObj[locale] = {};
                    }
                    for (let k in loc.default) {
                        this.localeObj[locale][k] = loc.default[k];
                    }
                    this.localePkg.push(locale + "." + pkg);
                } catch {
                    reject(`Load locale file "${locale}${pkg !== "default" ? "." + pkg : ""}.js" error.`);
                }
            }
            // --- 结束 ---
            if (isBefore) {
                after();
            }
            resolve();
        });
    }

    /** --- 跳转并执行完 onOpen 后是否要再执行的函数 --- */
    public static goCallback?: (vm: any) => any = undefined;
    /**
     * --- 打开/跳转一个页面（URL 处 hash 地址不变，仅仅打开） ---
     * @param path 要打开的页面地址
     */
    public static async openPage(path: string) {
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
        if (this.pages[path]) {
            // --- 已经加载过 ---
            this.pages[path].query = query;
            // --- 手机端隐藏左侧菜单 ---
            this.frameVue.elAsideShow = false;
            // --- 设置 path ---
            this.vuex.commit("setPath", path);
            // --- onOpen 要在所有加载完毕后执行（页面显示之后） ---
            if (this.pages[path].onOpen) {
                await DeskRT.sleep(1); // 加入延时防止一些异常问题
                await this.pages[path].onOpen();
            }
            // --- 执行用户方法 ---
            if (this.goCallback !== undefined) {
                await this.goCallback(this.pages[path]);
                this.goCallback = undefined;
            }
        } else {
            // --- 未加载，加载 HTML 和 JS ---
            DeskRT.showMask(true);
            let res = await fetch(this.pre + path + ".html?" + this.end);
            let text = "";
            if (res.status === 404) {
                alert(`404 not found.`);
                return;
            } else {
                text = await res.text();
            }
            text = DeskRT.purify(text);
            if (text !== "") {
                let df = document.createElement("div");
                df.innerHTML = text;
                let elPage = df.children[0];
                // --- 初始化要插入 page 的 dom ---
                let pageRandom = "page" + (Math.random() * 1000000000000).toFixed();
                let pageEle = document.createElement("div");
                pageEle.setAttribute(":class", "['el-page', {'el--show': _isPageShow}]");
                pageEle.setAttribute(pageRandom, "");
                if (elPage.getAttribute("v-loading") !== null) {
                    pageEle.setAttribute("v-loading", elPage.getAttribute("v-loading") || "");
                }
                // --- 检测是否有 script、link ---
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
                        }
                    } else if (tagName === "link") {
                        let outPath;
                        if (outPath = dom.getAttribute("href")) {
                            needLoadLink.push(outPath);
                            dom.remove();
                        }
                    } else if (tagName === "style") {
                        styleTxt += dom.innerHTML.replace(/([\s\S]+?){([\s\S]+?)}/g, (t: string, $1: string, $2: string): string => {
                            return "[" + pageRandom + "] " + $1.replace(/, */g, ",[" + pageRandom + "] ") + "{" + $2 + "}";
                        });
                        dom.remove();
                    }
                }
                // --- 加载 i18n （前提是开启了 i18n） ---
                if (this.i18n !== "") {
                    let pkg = elPage.getAttribute("locale-pkg") || "";
                    pageEle.setAttribute("locale-pkg", pkg);
                    await this.loadLocale(this.vuex.state.locale, pkg);
                }
                // --- 加载外部文件 ---
                await DeskRT.loadScript(needLoadScript);
                await DeskRT.loadLink(needLoadLink);
                // --- 页面配套 js、css 加载完后 ---
                // --- 检测是否要加载 js ---
                let js = undefined;
                if (elPage.getAttribute("load-script") !== null) {
                    pageEle.setAttribute("load-script", "");
                    try {
                        js = await System.import(this.pre + path);
                    } catch {
                        alert("Load script error(3).");
                        return;
                    }
                }
                // --- 加载 HTML 到页面 ---
                pageEle.innerHTML = elPage.innerHTML;
                this.mainEle.appendChild(pageEle);
                // --- 追加 style ---
                if (styleTxt !== "") {
                    this.headEle.insertAdjacentHTML("beforeend", `<style>${styleTxt}</style>`);
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
                opt.computed._isPageShow = function(this: any) {
                    return this.pagePath === DeskRTTools.vuex.state.path;
                };
                opt.computed._isMobile = function(this: any) {
                    return false;
                };
                opt.methods.$l = function(key: string) {
                    return DeskRTTools.readLocale(key);
                };
                let vm: any = new Vue(opt);
                this.pages[path] = vm;

                if (vm.onReady !== undefined) {
                    await vm.onReady();
                }
                // --- onOpen 不应该在此处执行 ---
                // --- 判断是否要加载高亮代码着色库（要在页面 VUE 初始化完成后再进行，因为 code 的内容有可能是动态插值插入的） ---
                let hljs = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.15.6/build/highlight.min";
                let hlcss = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.15.6/build/styles/androidstudio.min.css";
                let codeList = vm.$el.querySelectorAll("code");
                if (codeList.length > 0) {
                    if (this.highlightjs === undefined) {
                        // --- 加载 highlightjs 的 js 和 css 库 ---
                        try {
                            await DeskRT.loadLink([hlcss]);
                            let hl = await System.import(hljs);
                            // --- 进行染色 ---
                            for (let i = 0; i < codeList.length; ++i) {
                                hl.highlightBlock(codeList[i]);
                            }
                            this.highlightjs = hl;
                        } catch {
                            alert("Load script error(2).");
                            return;
                        }
                    } else {
                        // --- 进行染色 ---
                        for (let i = 0; i < codeList.length; ++i) {
                            this.highlightjs.highlightBlock(codeList[i]);
                        }
                    }
                }
                // --- 加载完毕隐藏 loading 框 ---
                DeskRT.hideMask();
                // --- 处理完后，进行统一的界面设定 ---
                // --- 手机端隐藏左侧菜单（开启页面意味着左侧菜单点击了，也就是在开启状态，此步骤有助于关闭） ---
                this.frameVue.elAsideShow = false;
                // --- 设置 path，用于切换页面显示 ---
                this.vuex.commit("setPath", path);
                // --- onOpen 要在所有加载完毕后执行（页面显示之后） ---
                if (vm.onOpen !== undefined) {
                    await DeskRT.sleep(1);
                    await vm.onOpen();
                }
                // --- 执行用户方法 ---
                if (this.goCallback !== undefined) {
                    await this.goCallback(this.pages[path]);
                    this.goCallback = undefined;
                }
            } else {
                alert(`Page is empty.`);
            }
        }
    }

    /**
     * 内部控件初始化
     */
    public static controlsInit() {
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
                DeskRTTools.headEle.insertAdjacentElement("beforeend", style);
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
                DeskRTTools.headEle.insertAdjacentElement("beforeend", style);
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
}

