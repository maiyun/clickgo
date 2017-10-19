interface DeskUIOptions {
    cursor?: boolean;
    urlPrefix?: string;
    jsUrlPrefix?: string;
    navMenuPath?: string;
    mainPath?: string;
}

class DeskUI {

    public static version: string = "1.0";

    // --- ZOOM(主要针对1.5) ---
    private static _DPR: number;
    private static _ZOOM: string;

    // --- 仅允许设置一次的 ---
    private static _cursor: boolean = true;
    private static _urlPrefix: string = "";
    private static _jsUrlPrefix: string = "";
    private static _navMenuPath: string = "";
    private static _mainPath: string = "";

    // --- 用以获取当前（实时）是否是手机浏览器 ---
    static get isMobile(): boolean {
        return navigator.userAgent.toLowerCase().indexOf("mobile") !== -1 ? true : false;
    }
    static set isMobile(v) {
        console.error("Sorry, the variable can not be set.");
    }

    public static init(opt: DeskUIOptions, fun: () => void = function(): void {}) {

        this._cursor = opt.cursor || true;
        this._urlPrefix = opt.urlPrefix || "";
        this._jsUrlPrefix = opt.jsUrlPrefix || "";
        this._navMenuPath = opt.navMenuPath || "";
        this._mainPath = opt.mainPath || "";

        // --- 初始化 DPR 相关 ---
        this._reDPR();
        $(window).resize((): void => {
            this._reDPR();
        });

        // --- 开始 init ---
        document.addEventListener("DOMContentLoaded", (): void => {
            // --- 先显示加载框 ---
            let $body = $("body");
            $body.html(`<div id="mask" class="mask--show"><i class="iconfont icon-shezhi icon-animation"></i></div>`);
            let $mask = $("#mask");
            // --- 加载  Menu XML ---
            Http.get(this._urlPrefix + this._navMenuPath, (text: any): void => {
                $mask.removeAttr("class");
                let html = [];
                // --- 渲染菜单 ---
                html.push(NavMenu.render(text));
                // --- 接下来开始加载常规内容 ---
                if (this._cursor) {
                    let _cursorClass: string = "";
                    let $cursor = $(`<div id="cursor"></div>`)
                    if (this.isMobile) {
                        $cursor.addClass("cursor--normal");
                    } else {
                        $cursor.addClass("cursor--normal cursor--shadow");
                        _cursorClass = "cursor--shadow ";
                    }
                    $body.append($cursor);
                    // --- 鼠标跟随真鼠标 ---
                    $(document).on(this.isMobile ? "touchstart" : "mousemove", (e: any): void => {
                        if (e.targetTouches) {
                            $cursor.css("left", e.targetTouches[0].pageX - 32 + "px");
                            $cursor.css("top", e.targetTouches[0].pageY - 32 + "px");
                        } else {
                            $cursor.css("left", e.pageX - 32 + "px");
                            $cursor.css("top", e.pageY - 32 + "px");
                        }
                        let style = $(e.target).css("--du-cursor");
                        if (style !== undefined && style !== "") {
                            style = style.trim();
                        } else {
                            style = "normal";
                        }
                        if (style === "normal") {
                            if (!$cursor.hasClass("cursor--normal")) {
                                $cursor.attr("class", _cursorClass + "cursor--normal");
                            }
                        } else {
                            if (!$cursor.hasClass("cursor--" + style)) {
                                $cursor.attr("class", _cursorClass + "cursor--" + style);
                            }
                        }
                    });
                    $(window).resize((): void => {
                        // --- 调整鼠标缩放 ---
                        $cursor.css("transform", `scale(${this._ZOOM})`);
                    });
                }
                // --- 添加右侧 BOX ---
                html.push(`<div id="box"><div id="page-title"></div><i class="iconfont icon-liebiaoshitucaidan" aria-hidden="true" onclick="$('#nav-menu').addClass('nav-menu--mobile-show');$('#nav-mask').addClass('nav-mask--mobile-show');"></i></div>`);
                // --- 加载到窗体 ---
                $body.append(html.join(""));
                // --- 添加菜单遮罩(手机) ---
                let $navMenuMask = $(`<div id="nav-mask"></div>`).on("tap", (): void => {
                    NavMenu.mobileHide();
                });
                $body.append($navMenuMask);
                // --- 核心：根据 hash 操控 NavMenu 效果 ---
                $(window).on("hashchange", (): void => {
                    let $navMenu = $("#nav-menu");
                    let hash: string = window.location.hash;
                    if (hash !== "") hash = hash.substr(1);
                    // --- 非首页 ---
                    if (hash !== "") {
                        // --- 获取当前条 ---
                        let $item = $(`#nav-menu [href="#${hash}"]`);
                        let isLeft: boolean = true;
                        if ($item.parents("#nav-menu__right").length > 0) isLeft = false;
                        let hasSub: boolean = $item.hasClass("nav-menu-item--sub") || $item.hasClass("nav-menu-child-item--sub");
                        let hasChild: boolean = $item.hasClass("nav-menu-item--child");
                        let isOpen: boolean = $item.hasClass("nav-menu-item--child--open");
                        let isSelected: boolean = $item.hasClass("nav-menu-item--selected") || $item.hasClass("nav-menu-child-item--selected") || $item.hasClass("nav-menu-sub-item--selected");
                        // --- 左侧直接打开 ---
                        if (isLeft && !hasSub && !hasChild && !isSelected) {
                            $navMenu.removeClass("nav-menu--open-right");
                            NavMenu.hideVisibleSub();
                            NavMenu.clearAllSelected();
                            $item.addClass(`nav-menu${$item.hasClass("nav-menu-child-item") ? "-child" : ""}-item--selected`);
                            NavMenu.ifIsChildThenShow($item);
                            this._open(hash);
                            NavMenu.mobileHide();
                        // --- 左侧有右侧菜单 ---
                        } else if (isLeft && hasSub && !isSelected) {
                            let $rightSub = $(`.nav-menu-sub[data-path="${hash}"]`);
                            if (!$navMenu.hasClass("nav-menu--open-right")) $navMenu.addClass("nav-menu--open-right");
                            if (!$rightSub.is(":visible")) {
                                NavMenu.hideVisibleSub();
                                $rightSub.show();
                            }
                            NavMenu.clearAllSelected();
                            $item.addClass(`nav-menu${$item.hasClass("nav-menu-child-item") ? "-child" : ""}-item--selected`);
                            NavMenu.ifIsChildThenShow($item);
                            this._open($rightSub.children().eq(0).attr("href").substr(1));
                        // --- 左侧有孩子菜单 ---
                        } else if (isLeft && hasChild && !isOpen) {
                            $(".nav-menu-item--child--open").removeClass("nav-menu-item--child--open").next().hide();
                            $item.addClass("nav-menu-item--child--open").next().show();
                        // --- 右侧菜单 ---
                        } else if (!isLeft && !isSelected) {
                            let $rightSub = $item.parent();
                            if (!$navMenu.hasClass("nav-menu--open-right")) $navMenu.addClass("nav-menu--open-right");
                            if (!$rightSub.is(":visible")) {
                                NavMenu.hideVisibleSub();
                                $rightSub.show();
                            }
                            // --- 判断左侧是否已选中 ---
                            let $leftItem = $(`#nav-menu__left [href="#${$item.parent().attr("data-path")}"]`);
                            if (!$leftItem.hasClass("nav-menu-item--selected") && !$leftItem.hasClass("nav-menu-child-item--selected")) {
                                $(".nav-menu-item--selected,.nav-menu-child-item--selected").removeClass("nav-menu-item--selected nav-menu-child-item--selected");
                                $leftItem.addClass(`nav-menu${$leftItem.hasClass("nav-menu-child-item") ? "-child" : ""}-item--selected`);
                                NavMenu.ifIsChildThenShow($leftItem);
                            }
                            // --- 清除右边已经选中的其他的 ---
                            $(".nav-menu-sub-item--selected").removeClass("nav-menu-sub-item--selected");
                            $item.addClass("nav-menu-sub-item--selected");
                            this._open(hash);
                            NavMenu.mobileHide();
                        }
                    } else {
                        NavMenu.mobileShow();
                        // --- 如果没有 hash 则为刚刚打开网页首页，加载首页页 ---
                        this._open(this._mainPath);
                    }
                });
                // --- 触发 HASH、RESIZE ---
                $(window).trigger("resize");
                $(window).trigger("hashchange");
            }, function(e) {
                alert("异常：" + e);
                $mask.removeAttr("class");
            });
        });
        // --- 执行用户 init 函数 ---
        fun();
    }

    // --- AJAX 获取 PAGE 页面 ---
    private static _open(hash: string): void {
        let hashId: string = hash.replace(/\//g, "-");
        // --- 先获取菜单 ---
        let $item = $(`#nav-menu [href="#${hash}"]`);
        $("#page-title").text($item.text());
        // --- 判断页面存在与否 ---
        let $page = $(`.page[data-path="${hash}"]`);
        if ($page.length > 0) {
            $(".page:visible").hide();
            $page.show();
        } else {
            let $mask = $("#mask");
            $mask.addClass("mask--show");
            // --- AJAX 加载页面以及 JS（先加载页面再加载JS） ---
            Http.get(this._urlPrefix + hash, (text: string): void => {
                let html: string = Page.render(text, hash, hashId);
                $("#box").append(html);
                $(".page:visible").hide();
                $(document.getElementById(`${hashId}-page`)).show();
                let attrJs = $item.attr("data-js");
                if (attrJs !== undefined) {
                    // --- 加载JS ---
                    if (attrJs === "same") attrJs = hash + ".js";
                    Http.ajax(this._jsUrlPrefix + attrJs, {
                        success: (t: string): void => {
                            t = t.replace(/(.get *\(["'`].+?["'`]) *\)/g, `$1, "${hashId}")`);
                            eval(t);
                            $mask.removeClass("mask--show");
                        },
                        error: (ex: any): void => {
                            alert("网络异常" + ex);
                            $mask.removeClass("mask--show");
                        },
                        dataType: "text"
                    });
                } else {
                    $mask.removeClass("mask--show");
                }
            }, (ex: any): void => {
                alert("网络异常:" + ex);
                console.log(ex);
                $mask.removeClass("mask--show");
            });
        }
    }

    // --- 报错功能 ---
    public static __error(classes: string, msg: string): void {
        alert("DeskUI Error:\nClass: " + classes + "\nMessage: " + msg);
    }

    // --- 初始化DPR信息 ---
    private static _reDPR(): void {

        this._DPR = window.devicePixelRatio;
        this._ZOOM = "1";
        if (this._DPR < 2) this._ZOOM = (1 / this._DPR).toString();

    }

}

/* --- 库们 --- */

// --- 网络访问库 ---
class Http {

    public static get(url: string = "", success: (text?: string) => void = function(): void {}, error: (ex?: any) => void = function(): void {}): void {
        this.ajax(url, {
            method: "GET",
            success: success,
            error: error
        });
    }

    public static post(url: string = "", data: any = {}, success: (text?: string) => void = function(): void {}, error: (ex?: any) => void = function(): void {}): void {
        this.ajax(url, {
            method: "POST",
            data: data,
            success: success,
            error: error
        });
    }

    public static ajax(url: string = "", data: any = {}): void {
        if (!data.method) data.method = "GET";
        if (!data.success) data.success = function(): void {};
        if (!data.error) data.error = function(): void {};
        if (!data.data) data.data = {};
        if (!data.dataType) data.dataType = "none";

        $.ajax({
            url: url,
            type: data.method,
            data: data.data,
            success: data.success,
            error: data.error,
            dataType: data.dataType
        });
        /*
        fetch(url, {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache"
            },
            credentials: "include"
        }).then(function(r: Response): Promise<string> {
            return r.text();
        }).then(success).catch(error);
        //*/
    }

}

/* --- 控件们 --- */

// --- 控件基类 ---
class Control {

    public __dom: ZeptoCollection;

    // --- 公开静态方法 ---
    // --- 获取控件 ---
    public static get(id: string, hashId?: string): Control {
        if (!hashId) {
            DeskUI.__error("Control", `"hashId" must be input.`);
        }
        let ctr: Control = new Control();
        ctr.__dom = $("#" + hashId + "__" + id);
        if (ctr.__dom.length > 0) {
            return ctr;
        } else {
            DeskUI.__error("Control", `"${id}" not found.`);
            return ctr;
        }
    }

    // --- 实例化方法 ---
    // --- 设置事件 ---
    public on(event: string, fun: () => void): void {
        this.__dom.on(event, fun);
    }

    // --- 私有 ---
    // --- 获取 node ---
    protected static getNode(text: string | Element): Element {

        if (typeof text === "string") {
            let dp: DOMParser = new DOMParser();
            let dom: Document = dp.parseFromString(text, "application/xml");
            return dom.documentElement;
        } else {
            return (<any>text).documentElement ? (<any>text).documentElement : text;
        }

    }

    // --- 预设的 attr ---
    protected static initAttr(node: Element, hashId: string, before: any = {}): string {
        return (node.hasAttribute("id") ? ` id="${hashId}__${node.getAttribute("id")}"` : "") + (node.hasAttribute("style") ? ` style="${(before.style ? before.style + "" : "") + node.getAttribute("style")}"` : "");
    }

    // --- 预设的 class ---
    protected static initClass(node: Element, hashId: string): string {
        return node.hasAttribute("class") ? " " + hashId + "__" + (<string>node.getAttribute("class")).replace(/ /g, " " + hashId + "__") : "";
    }

    // --- 渲染容器类控件 ---
    protected static renderContainer(node: Element, hashId: string): string {
        let html: string[] = [];
        if (node.children.length > 0) {
            [].slice.call(node.children).forEach(function(item: Element) {
                let name: string = item.nodeName.toLowerCase();
                switch (name) {
                    case "button":
                        html.push(Button.render(item, hashId));
                        break;
                    case "flexrow":
                        html.push(FlexRow.render(item, hashId));
                        break;
                    case "flexcolumn":
                        html.push(FlexColumn.render(item, hashId));
                        break;
                    case "flexwrap":
                        html.push(FlexWrap.render(item, hashId));
                        break;
                    case "label":
                        html.push(Label.render(item, hashId));
                        break;
                    case "tag":
                        html.push(Tag.render(item, hashId));
                        break;
                    case "content":
                        html.push(Content.render(item, hashId));
                        break;
                    case "style":
                        html.push("<style>" + Style.compiler(<string>item.textContent, hashId) + "</style>");
                        break;
                }
            });
        } else {
            html.push(<string>node.textContent);
        }
        return html.join("");
    }

}

// --- 导航菜单 ---
class NavMenu extends Control {

    public static get(id: string, hashId?: string): NavMenu {
        return super.get(id, hashId);
    }

    public static render(node: Element | string): string {
        node = this.getNode(node);
        let html = [`<div id="nav-menu" class="nav-menu"><div id="nav-menu__left"><div id="nav-menu__left__logo"></div>`];
        let htmlRightMenu = [`<div id="nav-menu__right">`];
        // --- 导航菜单 ---
        [].slice.call(node.children).forEach((item: Element): void => {
            // --- 导航主菜单列 ---
            let hasSub: boolean = (item.children[0] && item.children[0].nodeName.toLowerCase() === "navmenusub") ? true : false;
            let hasChild: boolean = (item.children[0] && item.children[0].nodeName.toLowerCase() === "navmenuchild") ? true : false;
            html.push(NavMenuItem.render(item, hasSub, hasChild));
            // --- 检测子菜单或者是右侧菜单 ---
            // --- 有右侧菜单 ---
            if (hasSub) {
                htmlRightMenu.push(NavMenuSub.render(<Element>item.children[0], <string>item.getAttribute("path")));
                // --- 有子菜单 ---
            } else if (hasChild) {
                html.push(NavMenuChild.render(<Element>item.children[0], htmlRightMenu));
            }
        });
        htmlRightMenu.push("</div>");
        html.push("</div>"); // --- 闭合 nav-menu__left ---
        html.push(htmlRightMenu.join(""));
        html.push("</div>"); // --- 闭合 nav-menu ---
        return html.join("");
    }

    // --- 关闭显示 nav-menu（仅限手机） ---
    public static mobileHide() {
        $("#nav-menu").removeClass("nav-menu--mobile-show");
        $("#nav-mask").removeClass("nav-mask--mobile-show");
    }

    // --- 打开显示 nav-menu（仅限手机） ---
    public static mobileShow() {
        $("#nav-menu").addClass("nav-menu--mobile-show");
        $("#nav-mask").addClass("nav-mask--mobile-show");
    }

    // --- 清除所有的已经选择的效果（UI） ---
    public static clearAllSelected() {
        $(".nav-menu-item--selected,.nav-menu-sub-item--selected,.nav-menu-child-item--selected").removeClass("nav-menu-item--selected nav-menu-sub-item--selected nav-menu-child-item--selected");
    }

    // --- 检测当前菜单项是否处于 child 下(UI) ---
    public static ifIsChildThenShow($item: ZeptoCollection) {
        if ($item.hasClass("nav-menu-child-item")) {
            let $itemp: ZeptoCollection = $item.parent();
            if (!$itemp.is(":visible")) {
                $(".nav-menu-item--child--open").removeClass("nav-menu-item--child--open").next().hide();
                $itemp.show().prev().addClass("nav-menu-item--child--open");
            }
        } else {
            $(".nav-menu-item--child--open").removeClass("nav-menu-item--child--open").next().hide();
        }
    }

    // --- 隐藏显示的 sub 控件 ---
    public static hideVisibleSub(): void {
        $(".nav-menu-sub:visible").hide();
    }

}

class NavMenuItem extends Control {

    public static get(id: string, hashId?: string): NavMenuItem {
        return super.get(id, hashId);
    }

    public static render(node: Element | string, hasSub: boolean, hasChild: boolean): string {
        node = this.getNode(node);
        return `<a href="#${node.getAttribute("path")}" class="nav-menu-item${hasSub ? ` nav-menu-item--sub"` : ""}${hasChild ? ` nav-menu-item--child` : ""}"${node.hasAttribute("js") ? ` data-js="${node.getAttribute("js")}"` : ""}><i class="iconfont icon-${node.hasAttribute("icon") ? node.getAttribute("icon") : "checkbox-weixuan"}" aria-hidden="true"></i><span>${node.getAttribute("text")}</span></a>`;
    }

}

class NavMenuSub extends Control {

    public static get(id: string, hashId?: string): NavMenuSub {
        return super.get(id, hashId);
    }

    public static render(node: Element | string, path: string) {
        node = this.getNode(node);
        let html = [`<div class="nav-menu-sub" data-path="${path}">`];
        [].slice.call(node.children).forEach(function(item: Element) {
            html.push(NavMenuSubItem.render(item));
        });
        html.push("</div>");
        return html.join("");
    }

}

class NavMenuSubItem extends Control {

    public static get(id: string, hashId?: string): NavMenuSubItem {
        return super.get(id, hashId);
    }

    public static render(node: Element | string): string {

        node = this.getNode(node);
        return `<a class="nav-menu-sub-item" href="#${node.getAttribute("path")}"${node.hasAttribute("js") ? ` data-js="${node.getAttribute("js")}"` : ""}>${node.getAttribute("text")}</a>`;

    }

}

class NavMenuChild extends Control {

    public static get(id: string, hashId?: string): NavMenuChild {
        return super.get(id, hashId);
    }

    public static render(node: Element | string, htmlRightMenu: string[]): string {
        node = this.getNode(node);
        let html: string[] = [];
        html.push(`<div class="nav-menu-child">`);
        [].slice.call(node.children).forEach(function(item: Element) {
            let hasSub: boolean = (item.children[0] && item.children[0].nodeName.toLowerCase() === "navmenusub") ? true : false;
            html.push(NavMenuChildItem.render(item, hasSub));
            if (hasSub) {
                htmlRightMenu.push(NavMenuSub.render(<Element>item.children[0], <string>item.getAttribute("path")));
            }
        });
        html.push("</div>");
        return html.join("");
    }

}

class NavMenuChildItem extends Control {

    public static get(id: string, hashId?: string): NavMenuChildItem {
        return super.get(id, hashId);
    }

    public static render(node: Element | string, hasSub: boolean): string {
        node = this.getNode(node);
        return `<a href="#${node.getAttribute("path")}" class="nav-menu-child-item${hasSub ? " nav-menu-child-item--sub" : ""}"${node.hasAttribute("js") ? ` data-js="${node.getAttribute("js")}"` : ""}>${node.getAttribute("text")}</a>`;
    }

}

class Page extends Control {

    public static get(id: string, hashId?: string): Page {
        return super.get(id, hashId);
    }

    public static render(node: Element | string, hash: string, hashId: string): string {
        node = this.getNode(node);
        let html: string[] = [`<div id="${hashId}-page" class="page${this.initClass(node, hashId)}" data-path="${hash}"${this.initAttr(node, hashId)}>`];
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    }

}

class FlexRow extends Control {

    public static get(id: string, hashId?: string): FlexRow {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        let html: string[] = [];
        html.push(`<div class="flex-row${this.initClass(node, hashId)}"${this.initAttr(node, hashId)}>`);
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    }

}

class FlexColumn extends Control {

    public static get(id: string, hashId?: string): FlexColumn {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        let html: string[] = [];
        html.push(`<div class="flex-column${node.hasAttribute("shadow") && node.getAttribute("shadow") === "on" ? " flex-column--shadow" : ""}${this.initClass(node, hashId)}"${this.initAttr(node, hashId)}>`);
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    }

}

class FlexWrap extends Control {

    public static get(id: string, hashId?: string): FlexWrap {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        let html: string[] = [];
        html.push(`<div class="flex-wrap${this.initClass(node, hashId)}"${this.initAttr(node, hashId)}>`);
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    }

}

class Label extends Control {

    public static get(id: string, hashId?: string): Label {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        return `<div class="label${this.initClass(node, hashId)}"${this.initAttr(node, hashId)}>${node.hasAttribute("text") ? node.getAttribute("text") : ""}</div>`;
    }

}

class Button extends Control {

    public static get(id: string, hashId?: string): Button {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        let html: string[] = [];
        html.push(`<button class="button${this.initClass(node, hashId)}"${this.initAttr(node, hashId)}>${node.hasAttribute("icon") ? `<i class="iconfont icon-${node.getAttribute("icon")}" aria-hidden="true"></i>` : ""}<span>${node.getAttribute("text") || ""}</span></button>`);
        return html.join("");
    }

}

class Tag extends Control {

    public static get(id: string, hashId?: string): Tag {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        return `<div class="tag${this.initClass(node, hashId)}"${this.initAttr(node, hashId)}>${node.hasAttribute("text") ? node.getAttribute("text") : ""}</div>`;
    }

}

class Content extends Control {

    public static get(id: string, hashId?: string): Content {
        return super.get(id, hashId);
    }

    public static render(node: Element, hashId: string): string {
        let attrAlign;
        if (node.hasAttribute("align")) {
            let align: string = <string>node.getAttribute("align");
            let lr, tb;
            if (align.indexOf(" ") !== -1) {
                let alignArray: string[] = align.split(" ");
                lr = align[0];
                tb = align[1];
            } else {
                lr = tb = align;
            }
            lr = lr.replace(/left/g, "flex-start").replace(/right/g, "flex-end");
            tb = tb.replace(/left/g, "flex-start").replace(/right/g, "flex-end");
            attrAlign = `justify-content:${lr}; align-items:${tb}; `;
        }
        return `<div class="content${this.initClass(node, hashId)}"${this.initAttr(node, hashId, {style: attrAlign})}>${node.hasAttribute("text") ? node.getAttribute("text") : ""}</div>`;
    }

}

class Style {

    public static compiler(text: string, hashId?: string): string {
        return text.replace(/[\t\r\n]/g, "").replace(/(.+?){(.+?)}/g, (reg: string, className: string, classValue: string): string => {
            let list: string[] = [];
            let sp: string[] = className.split(",");
            sp.forEach((item: string): void => {
                item = item.trim();
                list.push("#" + hashId + "-page " + item.replace(/([.#])/g, `$1${hashId}__`));
            });
            return list.join(",") + "{" + classValue + "}";
        }).replace(/(FlexRow|FlexColumn|FlexWrap|Label|Button|Tag|Content)/g, (text: string): string => {
            return "." + text.substr(0, 1).toLowerCase() + text.substr(1).replace(/[A-Z]/g, (t: string): string => {
                return "-" + t.toLowerCase();
            });
        });
    }

}

