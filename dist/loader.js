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
window.onerror = function (msg, uri, line, col, err) {
    if (err) {
        alert("Error:\n" + err.message + "\n" + err.stack + "\nLine: " + line + "\nColumn: " + col);
    }
    else {
        console.log(msg);
    }
};
var ROOT_PATH = "/";
(function () {
    var temp = document.querySelectorAll("head > script");
    var scriptEle = temp[temp.length - 1];
    ROOT_PATH = scriptEle.src.slice(0, scriptEle.src.lastIndexOf("/") + 1);
})();
document.addEventListener("touchstart", function () { });
document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByTagName("body")[0].innerHTML = "<style>" +
        "#el-mask {display: none; background: rgba(255,255,255,.4); position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 1999; justify-content: center; align-items: center;}" +
        "#el-text-mask {display: none; background: rgba(0,0,0,.4); position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 20000; justify-content: center; align-items: center; color: #FFF; font-size: 36px; font-weight: 900; -webkit-text-stroke: 2px #000;}" +
        "#el-mask.el--show, #el-text-mask.el--show {display: flex;}" +
        "#el-mask.el--top {z-index: 20001;}" +
        "@-webkit-keyframes elLoading-1 { 0% {transform: rotate(45deg);} 25% {transform: rotate(-45deg);} 50% {transform: rotate(-135deg);} 75% {transform: rotate(-225deg);} 100% {transform: rotate(-315deg);}}" +
        "@keyframes elLoading-1 { 0% {transform: rotate(45deg);} 25% {transform: rotate(-45deg);} 50% {transform: rotate(-135deg);} 75% {transform: rotate(-225deg);} 100% {transform: rotate(-315deg);}}" +
        "@-webkit-keyframes elLoading-2 { 0% {transform: rotate(0);} 25% {transform: rotate(90deg);} 50% {transform: rotate(180deg);} 75% {transform: rotate(270deg);} 100% {transform: rotate(360deg);}}" +
        "@keyframes elLoading-2 { 0% {transform: rotate(0);} 25% {transform: rotate(90deg);} 50% {transform: rotate(180deg);} 75% {transform: rotate(270deg);} 100% {transform: rotate(360deg);}}" +
        ".el-loading {width: 25px; height: 25px; position: relative;}" +
        ".el-loading-1, .el-loading-2 {width: 25px; height: 25px; box-sizing: border-box; border: solid 2px #24292e; position: absolute; left: 0; top: 0; animation: elLoading-2 3s ease-in-out infinite;}" +
        ".el-loading-1 {animation-name: elLoading-1; border-color: rgba(36, 41, 46, .6);}" +
        ".el-loading-2 {box-shadow: 0 0 2px 1px rgba(36, 41, 46, 0.3);}" +
        "</style>" +
        "<div id=\"el-mask\" class=\"el--show\">" +
        "<div class=\"el-loading\">" +
        "<div class=\"el-loading-1\"></div>" +
        "<div class=\"el-loading-2\"></div>" +
        "</div>" +
        "</div>" +
        "<div id=\"el-text-mask\">Loading...</div>";
    var configEle = document.querySelector("script[type=deskrt-config]");
    if (!configEle) {
        alert("[Error] Config not found.");
        return;
    }
    var config = (new Function("return " + configEle.innerHTML.trim()))();
    config.pre = config.pre || "";
    config.end = config.end || "";
    config.localePath = config.localePath || "";
    config.locales = config.locales || ["en", "zh-CN"];
    config.frame = config.frame || "";
    config.main = config.main || "";
    config.logo = config.logo || "";
    config.size = config.size || "";
    config.paths = config.paths || {};
    config.asideWidth = config.asideWidth || "200px";
    config.const = config.const || {};
    config.global = config.global || {};
    config.theme = config.theme || "";
    var script = document.createElement("script");
    script.addEventListener("load", function () {
        return __awaiter(this, void 0, void 0, function () {
            var core;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        System.config({
                            packages: {
                                "http:": {
                                    defaultExtension: "js?" + config.end
                                },
                                "https:": {
                                    defaultExtension: "js?" + config.end
                                }
                            },
                            map: config.paths
                        });
                        return [4, System.import(ROOT_PATH + "core")];
                    case 1:
                        core = _a.sent();
                        core.onReady(config, ROOT_PATH);
                        return [2];
                }
            });
        });
    });
    script.addEventListener("error", function (e) {
        alert("[Error] " + e.message);
    });
    script.src = "https://cdn.jsdelivr.net/npm/systemjs@0.21.6/dist/system.js";
    document.getElementsByTagName("head")[0].appendChild(script);
});
