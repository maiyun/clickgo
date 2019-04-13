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

let ROOT_PATH = "/";
(() => {
    let temp = document.querySelectorAll("head > script");
    let scriptEle = <HTMLScriptElement>temp[temp.length - 1];
    ROOT_PATH = scriptEle.src.slice(0, scriptEle.src.lastIndexOf("/") + 1);
})();

document.addEventListener("touchstart", function() {});
// --- 网页 DOM 加载完成后开始执行 ---
document.addEventListener("DOMContentLoaded", function () {
    // --- z-index 1999 比 dialog、alert 等层级低 ---
    document.getElementsByTagName("body")[0].innerHTML = `<style>` +
        `#el-mask {display: none; background: rgba(255,255,255,.4); position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 1999; justify-content: center; align-items: center;}` +
        `#el-text-mask {display: none; background: rgba(0,0,0,.4); position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 20000; justify-content: center; align-items: center; color: #FFF; font-size: 36px; font-weight: 900; -webkit-text-stroke: 2px #000;}` +
        `#el-mask.el--show, #el-text-mask.el--show {display: flex;}` +
        `#el-mask.el--top {z-index: 20001;}` +
        `@-webkit-keyframes elLoading-1 { 0% {transform: rotate(45deg);} 25% {transform: rotate(-45deg);} 50% {transform: rotate(-135deg);} 75% {transform: rotate(-225deg);} 100% {transform: rotate(-315deg);}}` +
        `@keyframes elLoading-1 { 0% {transform: rotate(45deg);} 25% {transform: rotate(-45deg);} 50% {transform: rotate(-135deg);} 75% {transform: rotate(-225deg);} 100% {transform: rotate(-315deg);}}` +
        `@-webkit-keyframes elLoading-2 { 0% {transform: rotate(0);} 25% {transform: rotate(90deg);} 50% {transform: rotate(180deg);} 75% {transform: rotate(270deg);} 100% {transform: rotate(360deg);}}` +
        `@keyframes elLoading-2 { 0% {transform: rotate(0);} 25% {transform: rotate(90deg);} 50% {transform: rotate(180deg);} 75% {transform: rotate(270deg);} 100% {transform: rotate(360deg);}}` +
        `.el-loading {width: 25px; height: 25px; position: relative;}` +
        `.el-loading-1, .el-loading-2 {width: 25px; height: 25px; box-sizing: border-box; border: solid 2px #24292e; position: absolute; left: 0; top: 0; animation: elLoading-2 3s ease-in-out infinite;}` +
        `.el-loading-1 {animation-name: elLoading-1; border-color: rgba(36, 41, 46, .6);}` +
        `.el-loading-2 {box-shadow: 0 0 2px 1px rgba(36, 41, 46, 0.3);}` +
    `</style>` +
    `<div id="el-mask" class="el--show">` +
        `<div class="el-loading">` +
            `<div class="el-loading-1"></div>` +
            `<div class="el-loading-2"></div>` +
        `</div>` +
    `</div>` +
    `<div id="el-text-mask">Loading...</div>`;
    // --- 加载 config ---
    let configEle = document.querySelector("script[type=deskrt-config]");
    if (!configEle) {
        alert("[Error] Config not found.");
        return;
    }
    let config = (new Function("return " + configEle.innerHTML.trim()))();
    config.pre = config.pre || "";
    config.end = config.end || "";
    config.localePath = config.localePath || "";
    config.locales = config.locales || ["en", "zh-CN"];
    config.frame = config.frame || "";
    config.main = config.main || "";
    config.logo = config.logo || "";
    config.size = config.size || "";
    config.paths = config.paths || {};
    config.paths.deskrt = ROOT_PATH + "deskrt";
    config.asideWidth = config.asideWidth || "200px";
    config.const = config.const || {};
    config.global = config.global || {};
    config.theme = config.theme || "";
    // --- 加载 System.js ---
    let script = document.createElement("script");
    script.addEventListener("load", async function() {
        // --- 加载 core ---
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
        let core = await System.import(ROOT_PATH + "core");
        core.onReady(config, ROOT_PATH);
    });
    script.addEventListener("error", function(e) {
        alert("[Error] " + e.message);
    });
    script.src = "https://cdn.jsdelivr.net/npm/systemjs@0.21.6/dist/system.js";
    document.getElementsByTagName("head")[0].appendChild(script);
});
