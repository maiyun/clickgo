"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var DeskUI = (function () {
    function DeskUI() {
    }
    Object.defineProperty(DeskUI, "isMobile", {
        get: function () {
            return navigator.userAgent.toLowerCase().indexOf("mobile") !== -1 ? true : false;
        },
        set: function (v) {
            console.error("Sorry, the variable can not be set.");
        },
        enumerable: true,
        configurable: true
    });
    DeskUI.init = function (opt, fun) {
        var _this = this;
        if (fun === void 0) { fun = function () { }; }
        this._cursor = opt.cursor || true;
        this._urlPrefix = opt.urlPrefix || "";
        this._jsUrlPrefix = opt.jsUrlPrefix || "";
        this._navMenuPath = opt.navMenuPath || "";
        this._mainPath = opt.mainPath || "";
        this._reDPR();
        $(window).resize(function () {
            _this._reDPR();
        });
        document.addEventListener("DOMContentLoaded", function () {
            var $body = $("body");
            $body.html("<div id=\"mask\" class=\"mask--show\"><i class=\"iconfont icon-shezhi icon-animation\"></i></div>");
            var $mask = $("#mask");
            Http.get(_this._urlPrefix + _this._navMenuPath, function (text) {
                $mask.removeAttr("class");
                var html = [];
                html.push(NavMenu.render(text));
                if (_this._cursor) {
                    var _cursorClass_1 = "";
                    var $cursor_1 = $("<div id=\"cursor\"></div>");
                    if (_this.isMobile) {
                        $cursor_1.addClass("cursor--normal");
                    }
                    else {
                        $cursor_1.addClass("cursor--normal cursor--shadow");
                        _cursorClass_1 = "cursor--shadow ";
                    }
                    $body.append($cursor_1);
                    $(document).on(_this.isMobile ? "touchstart" : "mousemove", function (e) {
                        if (e.targetTouches) {
                            $cursor_1.css("left", e.targetTouches[0].pageX - 32 + "px");
                            $cursor_1.css("top", e.targetTouches[0].pageY - 32 + "px");
                        }
                        else {
                            $cursor_1.css("left", e.pageX - 32 + "px");
                            $cursor_1.css("top", e.pageY - 32 + "px");
                        }
                        var style = $(e.target).css("--du-cursor");
                        if (style !== undefined && style !== "") {
                            style = style.trim();
                        }
                        else {
                            style = "normal";
                        }
                        if (style === "normal") {
                            if (!$cursor_1.hasClass("cursor--normal")) {
                                $cursor_1.attr("class", _cursorClass_1 + "cursor--normal");
                            }
                        }
                        else {
                            if (!$cursor_1.hasClass("cursor--" + style)) {
                                $cursor_1.attr("class", _cursorClass_1 + "cursor--" + style);
                            }
                        }
                    });
                    $(window).resize(function () {
                        $cursor_1.css("transform", "scale(" + _this._ZOOM + ")");
                    });
                }
                html.push("<div id=\"box\"><div id=\"page-title\"></div><i class=\"iconfont icon-liebiaoshitucaidan\" aria-hidden=\"true\" onclick=\"$('#nav-menu').addClass('nav-menu--mobile-show');$('#nav-mask').addClass('nav-mask--mobile-show');\"></i></div>");
                $body.append(html.join(""));
                var $navMenuMask = $("<div id=\"nav-mask\"></div>").on("tap", function () {
                    NavMenu.mobileHide();
                });
                $body.append($navMenuMask);
                $(window).on("hashchange", function () {
                    var $navMenu = $("#nav-menu");
                    var hash = window.location.hash;
                    if (hash !== "")
                        hash = hash.substr(1);
                    if (hash !== "") {
                        var $item = $("#nav-menu [href=\"#" + hash + "\"]");
                        var isLeft = true;
                        if ($item.parents("#nav-menu__right").length > 0)
                            isLeft = false;
                        var hasSub = $item.hasClass("nav-menu-item--sub") || $item.hasClass("nav-menu-child-item--sub");
                        var hasChild = $item.hasClass("nav-menu-item--child");
                        var isOpen = $item.hasClass("nav-menu-item--child--open");
                        var isSelected = $item.hasClass("nav-menu-item--selected") || $item.hasClass("nav-menu-child-item--selected") || $item.hasClass("nav-menu-sub-item--selected");
                        if (isLeft && !hasSub && !hasChild && !isSelected) {
                            $navMenu.removeClass("nav-menu--open-right");
                            NavMenu.hideVisibleSub();
                            NavMenu.clearAllSelected();
                            $item.addClass("nav-menu" + ($item.hasClass("nav-menu-child-item") ? "-child" : "") + "-item--selected");
                            NavMenu.ifIsChildThenShow($item);
                            _this._open(hash);
                            NavMenu.mobileHide();
                        }
                        else if (isLeft && hasSub && !isSelected) {
                            var $rightSub = $(".nav-menu-sub[data-path=\"" + hash + "\"]");
                            if (!$navMenu.hasClass("nav-menu--open-right"))
                                $navMenu.addClass("nav-menu--open-right");
                            if (!$rightSub.is(":visible")) {
                                NavMenu.hideVisibleSub();
                                $rightSub.show();
                            }
                            NavMenu.clearAllSelected();
                            $item.addClass("nav-menu" + ($item.hasClass("nav-menu-child-item") ? "-child" : "") + "-item--selected");
                            NavMenu.ifIsChildThenShow($item);
                            _this._open($rightSub.children().eq(0).attr("href").substr(1));
                        }
                        else if (isLeft && hasChild && !isOpen) {
                            $(".nav-menu-item--child--open").removeClass("nav-menu-item--child--open").next().hide();
                            $item.addClass("nav-menu-item--child--open").next().show();
                        }
                        else if (!isLeft && !isSelected) {
                            var $rightSub = $item.parent();
                            if (!$navMenu.hasClass("nav-menu--open-right"))
                                $navMenu.addClass("nav-menu--open-right");
                            if (!$rightSub.is(":visible")) {
                                NavMenu.hideVisibleSub();
                                $rightSub.show();
                            }
                            var $leftItem = $("#nav-menu__left [href=\"#" + $item.parent().attr("data-path") + "\"]");
                            if (!$leftItem.hasClass("nav-menu-item--selected") && !$leftItem.hasClass("nav-menu-child-item--selected")) {
                                $(".nav-menu-item--selected,.nav-menu-child-item--selected").removeClass("nav-menu-item--selected nav-menu-child-item--selected");
                                $leftItem.addClass("nav-menu" + ($leftItem.hasClass("nav-menu-child-item") ? "-child" : "") + "-item--selected");
                                NavMenu.ifIsChildThenShow($leftItem);
                            }
                            $(".nav-menu-sub-item--selected").removeClass("nav-menu-sub-item--selected");
                            $item.addClass("nav-menu-sub-item--selected");
                            _this._open(hash);
                            NavMenu.mobileHide();
                        }
                    }
                    else {
                        NavMenu.mobileShow();
                        _this._open(_this._mainPath);
                    }
                });
                $(window).trigger("resize");
                $(window).trigger("hashchange");
            }, function (e) {
                alert("异常：" + e);
                $mask.removeAttr("class");
            });
        });
        fun();
    };
    DeskUI._open = function (hash) {
        var _this = this;
        var hashId = hash.replace(/\//g, "-");
        var $item = $("#nav-menu [href=\"#" + hash + "\"]");
        $("#page-title").text($item.text());
        var $page = $(".page[data-path=\"" + hash + "\"]");
        if ($page.length > 0) {
            $(".page:visible").hide();
            $page.show();
        }
        else {
            var $mask_1 = $("#mask");
            $mask_1.addClass("mask--show");
            Http.get(this._urlPrefix + hash, function (text) {
                var html = Page.render(text, hash, hashId);
                $("#box").append(html);
                $(".page:visible").hide();
                $(document.getElementById(hashId + "-page")).show();
                var attrJs = $item.attr("data-js");
                if (attrJs !== undefined) {
                    if (attrJs === "same")
                        attrJs = hash + ".js";
                    Http.ajax(_this._jsUrlPrefix + attrJs, {
                        success: function (t) {
                            t = t.replace(/(.get *\(["'`].+?["'`]) *\)/g, "$1, \"" + hashId + "\")");
                            eval(t);
                            $mask_1.removeClass("mask--show");
                        },
                        error: function (ex) {
                            alert("网络异常" + ex);
                            $mask_1.removeClass("mask--show");
                        },
                        dataType: "text"
                    });
                }
                else {
                    $mask_1.removeClass("mask--show");
                }
            }, function (ex) {
                alert("网络异常:" + ex);
                console.log(ex);
                $mask_1.removeClass("mask--show");
            });
        }
    };
    DeskUI.__error = function (classes, msg) {
        alert("DeskUI Error:\nClass: " + classes + "\nMessage: " + msg);
    };
    DeskUI._reDPR = function () {
        this._DPR = window.devicePixelRatio;
        this._ZOOM = "1";
        if (this._DPR < 2)
            this._ZOOM = (1 / this._DPR).toString();
    };
    return DeskUI;
}());
DeskUI.version = "1.0";
DeskUI._cursor = true;
DeskUI._urlPrefix = "";
DeskUI._jsUrlPrefix = "";
DeskUI._navMenuPath = "";
DeskUI._mainPath = "";
var Http = (function () {
    function Http() {
    }
    Http.get = function (url, success, error) {
        if (url === void 0) { url = ""; }
        if (success === void 0) { success = function () { }; }
        if (error === void 0) { error = function () { }; }
        this.ajax(url, {
            method: "GET",
            success: success,
            error: error
        });
    };
    Http.post = function (url, data, success, error) {
        if (url === void 0) { url = ""; }
        if (data === void 0) { data = {}; }
        if (success === void 0) { success = function () { }; }
        if (error === void 0) { error = function () { }; }
        this.ajax(url, {
            method: "POST",
            data: data,
            success: success,
            error: error
        });
    };
    Http.ajax = function (url, data) {
        if (url === void 0) { url = ""; }
        if (data === void 0) { data = {}; }
        if (!data.method)
            data.method = "GET";
        if (!data.success)
            data.success = function () { };
        if (!data.error)
            data.error = function () { };
        if (!data.data)
            data.data = {};
        if (!data.dataType)
            data.dataType = "none";
        $.ajax({
            url: url,
            type: data.method,
            data: data.data,
            success: data.success,
            error: data.error,
            dataType: data.dataType
        });
    };
    return Http;
}());
var Control = (function () {
    function Control() {
    }
    Control.get = function (id, hashId) {
        if (!hashId) {
            DeskUI.__error("Control", "\"hashId\" must be input.");
        }
        var ctr = new Control();
        ctr.__dom = $("#" + hashId + "__" + id);
        if (ctr.__dom.length > 0) {
            return ctr;
        }
        else {
            DeskUI.__error("Control", "\"" + id + "\" not found.");
            return ctr;
        }
    };
    Control.prototype.on = function (event, fun) {
        this.__dom.on(event, fun);
    };
    Control.getNode = function (text) {
        if (typeof text === "string") {
            var dp = new DOMParser();
            var dom = dp.parseFromString(text, "application/xml");
            return dom.documentElement;
        }
        else {
            return text.documentElement ? text.documentElement : text;
        }
    };
    Control.initAttr = function (node, hashId, before) {
        if (before === void 0) { before = {}; }
        return (node.hasAttribute("id") ? " id=\"" + hashId + "__" + node.getAttribute("id") + "\"" : "") + (node.hasAttribute("style") ? " style=\"" + ((before.style ? before.style + "" : "") + node.getAttribute("style")) + "\"" : "");
    };
    Control.initClass = function (node, hashId) {
        return node.hasAttribute("class") ? " " + hashId + "__" + node.getAttribute("class").replace(/ /g, " " + hashId + "__") : "";
    };
    Control.renderContainer = function (node, hashId) {
        var html = [];
        if (node.children.length > 0) {
            [].slice.call(node.children).forEach(function (item) {
                var name = item.nodeName.toLowerCase();
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
                        html.push("<style>" + Style.compiler(item.textContent, hashId) + "</style>");
                        break;
                }
            });
        }
        else {
            html.push(node.textContent);
        }
        return html.join("");
    };
    return Control;
}());
var NavMenu = (function (_super) {
    __extends(NavMenu, _super);
    function NavMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenu.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    NavMenu.render = function (node) {
        node = this.getNode(node);
        var html = ["<div id=\"nav-menu\" class=\"nav-menu\"><div id=\"nav-menu__left\"><div id=\"nav-menu__left__logo\"></div>"];
        var htmlRightMenu = ["<div id=\"nav-menu__right\">"];
        [].slice.call(node.children).forEach(function (item) {
            var hasSub = (item.children[0] && item.children[0].nodeName.toLowerCase() === "navmenusub") ? true : false;
            var hasChild = (item.children[0] && item.children[0].nodeName.toLowerCase() === "navmenuchild") ? true : false;
            html.push(NavMenuItem.render(item, hasSub, hasChild));
            if (hasSub) {
                htmlRightMenu.push(NavMenuSub.render(item.children[0], item.getAttribute("path")));
            }
            else if (hasChild) {
                html.push(NavMenuChild.render(item.children[0], htmlRightMenu));
            }
        });
        htmlRightMenu.push("</div>");
        html.push("</div>");
        html.push(htmlRightMenu.join(""));
        html.push("</div>");
        return html.join("");
    };
    NavMenu.mobileHide = function () {
        $("#nav-menu").removeClass("nav-menu--mobile-show");
        $("#nav-mask").removeClass("nav-mask--mobile-show");
    };
    NavMenu.mobileShow = function () {
        $("#nav-menu").addClass("nav-menu--mobile-show");
        $("#nav-mask").addClass("nav-mask--mobile-show");
    };
    NavMenu.clearAllSelected = function () {
        $(".nav-menu-item--selected,.nav-menu-sub-item--selected,.nav-menu-child-item--selected").removeClass("nav-menu-item--selected nav-menu-sub-item--selected nav-menu-child-item--selected");
    };
    NavMenu.ifIsChildThenShow = function ($item) {
        if ($item.hasClass("nav-menu-child-item")) {
            var $itemp = $item.parent();
            if (!$itemp.is(":visible")) {
                $(".nav-menu-item--child--open").removeClass("nav-menu-item--child--open").next().hide();
                $itemp.show().prev().addClass("nav-menu-item--child--open");
            }
        }
        else {
            $(".nav-menu-item--child--open").removeClass("nav-menu-item--child--open").next().hide();
        }
    };
    NavMenu.hideVisibleSub = function () {
        $(".nav-menu-sub:visible").hide();
    };
    return NavMenu;
}(Control));
var NavMenuItem = (function (_super) {
    __extends(NavMenuItem, _super);
    function NavMenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenuItem.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    NavMenuItem.render = function (node, hasSub, hasChild) {
        node = this.getNode(node);
        return "<a href=\"#" + node.getAttribute("path") + "\" class=\"nav-menu-item" + (hasSub ? " nav-menu-item--sub\"" : "") + (hasChild ? " nav-menu-item--child" : "") + "\"" + (node.hasAttribute("js") ? " data-js=\"" + node.getAttribute("js") + "\"" : "") + "><i class=\"iconfont icon-" + (node.hasAttribute("icon") ? node.getAttribute("icon") : "checkbox-weixuan") + "\" aria-hidden=\"true\"></i><span>" + node.getAttribute("text") + "</span></a>";
    };
    return NavMenuItem;
}(Control));
var NavMenuSub = (function (_super) {
    __extends(NavMenuSub, _super);
    function NavMenuSub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenuSub.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    NavMenuSub.render = function (node, path) {
        node = this.getNode(node);
        var html = ["<div class=\"nav-menu-sub\" data-path=\"" + path + "\">"];
        [].slice.call(node.children).forEach(function (item) {
            html.push(NavMenuSubItem.render(item));
        });
        html.push("</div>");
        return html.join("");
    };
    return NavMenuSub;
}(Control));
var NavMenuSubItem = (function (_super) {
    __extends(NavMenuSubItem, _super);
    function NavMenuSubItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenuSubItem.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    NavMenuSubItem.render = function (node) {
        node = this.getNode(node);
        return "<a class=\"nav-menu-sub-item\" href=\"#" + node.getAttribute("path") + "\"" + (node.hasAttribute("js") ? " data-js=\"" + node.getAttribute("js") + "\"" : "") + ">" + node.getAttribute("text") + "</a>";
    };
    return NavMenuSubItem;
}(Control));
var NavMenuChild = (function (_super) {
    __extends(NavMenuChild, _super);
    function NavMenuChild() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenuChild.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    NavMenuChild.render = function (node, htmlRightMenu) {
        node = this.getNode(node);
        var html = [];
        html.push("<div class=\"nav-menu-child\">");
        [].slice.call(node.children).forEach(function (item) {
            var hasSub = (item.children[0] && item.children[0].nodeName.toLowerCase() === "navmenusub") ? true : false;
            html.push(NavMenuChildItem.render(item, hasSub));
            if (hasSub) {
                htmlRightMenu.push(NavMenuSub.render(item.children[0], item.getAttribute("path")));
            }
        });
        html.push("</div>");
        return html.join("");
    };
    return NavMenuChild;
}(Control));
var NavMenuChildItem = (function (_super) {
    __extends(NavMenuChildItem, _super);
    function NavMenuChildItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavMenuChildItem.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    NavMenuChildItem.render = function (node, hasSub) {
        node = this.getNode(node);
        return "<a href=\"#" + node.getAttribute("path") + "\" class=\"nav-menu-child-item" + (hasSub ? " nav-menu-child-item--sub" : "") + "\"" + (node.hasAttribute("js") ? " data-js=\"" + node.getAttribute("js") + "\"" : "") + ">" + node.getAttribute("text") + "</a>";
    };
    return NavMenuChildItem;
}(Control));
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    Page.render = function (node, hash, hashId) {
        node = this.getNode(node);
        var html = ["<div id=\"" + hashId + "-page\" class=\"page" + this.initClass(node, hashId) + "\" data-path=\"" + hash + "\"" + this.initAttr(node, hashId) + ">"];
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    };
    return Page;
}(Control));
var FlexRow = (function (_super) {
    __extends(FlexRow, _super);
    function FlexRow() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexRow.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    FlexRow.render = function (node, hashId) {
        var html = [];
        html.push("<div class=\"flex-row" + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId) + ">");
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    };
    return FlexRow;
}(Control));
var FlexColumn = (function (_super) {
    __extends(FlexColumn, _super);
    function FlexColumn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexColumn.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    FlexColumn.render = function (node, hashId) {
        var html = [];
        html.push("<div class=\"flex-column" + (node.hasAttribute("shadow") && node.getAttribute("shadow") === "on" ? " flex-column--shadow" : "") + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId) + ">");
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    };
    return FlexColumn;
}(Control));
var FlexWrap = (function (_super) {
    __extends(FlexWrap, _super);
    function FlexWrap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FlexWrap.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    FlexWrap.render = function (node, hashId) {
        var html = [];
        html.push("<div class=\"flex-wrap" + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId) + ">");
        html.push(this.renderContainer(node, hashId));
        html.push("</div>");
        return html.join("");
    };
    return FlexWrap;
}(Control));
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Label.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    Label.render = function (node, hashId) {
        return "<div class=\"label" + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId) + ">" + (node.hasAttribute("text") ? node.getAttribute("text") : "") + "</div>";
    };
    return Label;
}(Control));
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    Button.render = function (node, hashId) {
        var html = [];
        html.push("<button class=\"button" + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId) + ">" + (node.hasAttribute("icon") ? "<i class=\"iconfont icon-" + node.getAttribute("icon") + "\" aria-hidden=\"true\"></i>" : "") + "<span>" + (node.getAttribute("text") || "") + "</span></button>");
        return html.join("");
    };
    return Button;
}(Control));
var Tag = (function (_super) {
    __extends(Tag, _super);
    function Tag() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tag.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    Tag.render = function (node, hashId) {
        return "<div class=\"tag" + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId) + ">" + (node.hasAttribute("text") ? node.getAttribute("text") : "") + "</div>";
    };
    return Tag;
}(Control));
var Content = (function (_super) {
    __extends(Content, _super);
    function Content() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Content.get = function (id, hashId) {
        return _super.get.call(this, id, hashId);
    };
    Content.render = function (node, hashId) {
        var attrAlign;
        if (node.hasAttribute("align")) {
            var align = node.getAttribute("align");
            var lr = void 0, tb = void 0;
            if (align.indexOf(" ") !== -1) {
                var alignArray = align.split(" ");
                lr = align[0];
                tb = align[1];
            }
            else {
                lr = tb = align;
            }
            lr = lr.replace(/left/g, "flex-start").replace(/right/g, "flex-end");
            tb = tb.replace(/left/g, "flex-start").replace(/right/g, "flex-end");
            attrAlign = "justify-content:" + lr + "; align-items:" + tb + "; ";
        }
        return "<div class=\"content" + this.initClass(node, hashId) + "\"" + this.initAttr(node, hashId, { style: attrAlign }) + ">" + (node.hasAttribute("text") ? node.getAttribute("text") : "") + "</div>";
    };
    return Content;
}(Control));
var Style = (function () {
    function Style() {
    }
    Style.compiler = function (text, hashId) {
        return text.replace(/[\t\r\n]/g, "").replace(/(.+?){(.+?)}/g, function (reg, className, classValue) {
            var list = [];
            var sp = className.split(",");
            sp.forEach(function (item) {
                item = item.trim();
                list.push("#" + hashId + "-page " + item.replace(/([.#])/g, "$1" + hashId + "__"));
            });
            return list.join(",") + "{" + classValue + "}";
        }).replace(/(FlexRow|FlexColumn|FlexWrap|Label|Button|Tag|Content)/g, function (text) {
            return "." + text.substr(0, 1).toLowerCase() + text.substr(1).replace(/[A-Z]/g, function (t) {
                return "-" + t.toLowerCase();
            });
        });
    };
    return Style;
}());
//# sourceMappingURL=deskui.js.map