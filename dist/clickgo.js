/**
 * Copyright 2025 MAIYUN.NET
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
import * as lTool from './lib/tool';
import * as lControl from './lib/control';
import * as lCore from './lib/core';
import * as lDom from './lib/dom';
import * as lForm from './lib/form';
import * as lFs from './lib/fs';
import * as lNative from './lib/native';
import * as lStorage from './lib/storage';
import * as lTask from './lib/task';
import * as lTheme from './lib/theme';
import * as lZip from './lib/zip';
// --- 获取自身 ---
import * as clickgo from './clickgo';
/** --- 系统级 ID --- */
const sysId = lTool.random(16, lTool.RANDOM_LUN);
lTask.initSysId(sysId);
lControl.initSysId(sysId);
lCore.initSysId(sysId);
lDom.initSysId(sysId);
lForm.initSysId(sysId);
lFs.initSysId(sysId);
lStorage.initSysId(sysId);
lTheme.initSysId(sysId);
lNative.initSysId(sysId);
/** --- 原生模块 --- */
export const modules = {
    'clickgo': clickgo,
};
const version = '4.0.0';
/** --- 获取当前版本 --- */
export function getVersion() {
    return version;
}
const native = navigator.userAgent.includes('electron') ? true : false;
/** --- 是否是 native 环境 --- */
export function isNative() {
    return native;
}
const dirname = import.meta.url.slice(0, import.meta.url.lastIndexOf('/'));
/** --- 获取当前 ClickGo 所在的目录，不以 / 结尾 --- */
export function getDirname() {
    return dirname;
}
/** --- 当前平台（web 则只返回 web） --- */
let platform = 'web';
/** --- native 是否含有窗体外边框 --- */
let frame = false;
if (!window.clickgo) {
    window.clickgo = {};
}
window.clickgo.modules = modules;
/** --- 用户定义的 ClickGo 信息 --- */
const userClickGo = window.clickgo;
/** --- 用户定义的全局对象 --- */
export const global = userClickGo.global ?? {};
/** --- 读取用户的 cdn 设置 --- */
const cdn = userClickGo.config?.cdn ?? 'https://cdn.jsdelivr.net';
/** --- 获取当前 cdn 前缀 --- */
export function getCdn() {
    return cdn;
}
if (native) {
    const reg = /electron\/(.+?) (.+?)\/(.+?) frame\/([0-9])/.exec(navigator.userAgent);
    if (reg) {
        platform = reg[2];
        frame = reg[4] === '0' ? false : true;
    }
}
/** --- 获取当前平台（web 则只返回 web） --- */
export function getPlatform() {
    return platform;
}
let device = {
    'type': 'unknown',
    'os': 'unknown',
};
/** --- 获取当前设备信息（支持 native 和 web） --- */
export function getDevice() {
    if (device.type !== 'unknown') {
        return device;
    }
    const ua = navigator.userAgent.toLowerCase();
    // --- 先判断操作系统 ---
    if (ua.includes('android')) {
        device.os = 'android';
    }
    else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
        device.os = 'ios';
    }
    else if (ua.includes('windows') || ua.includes('win32')) {
        device.os = 'windows';
    }
    else if (ua.includes('mac os') || ua.includes('darwin')) {
        device.os = 'macos';
    }
    else if (ua.includes('linux')) {
        device.os = 'linux';
    }
    device.type = ['windows', 'macos', 'linux'].includes(device.os) ? 'desktop' : 'mobile';
    return device;
}
/**
 * --- 是否含有窗体外边框 ---
 */
export function hasFrame() {
    return frame;
}
/** --- 全局类 --- */
export class AbstractBoot {
    setSysId(sysId) {
        if (this._sysId) {
            return;
        }
        this._sysId = sysId;
    }
    /** --- 判断当前是否是 debug 模式 --- */
    isDebug() {
        return this._debug;
    }
    constructor(opt = {}) {
        /** --- 当前是否是 debug 模式 --- */
        this._debug = false;
        /** --- 切勿传给 App --- */
        this._sysId = '';
        if (opt.debug) {
            this._debug = true;
        }
    }
    onError() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onFormShowInSystemTaskChange() {
        return;
    }
    onFormHashChange() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
    onHashChanged() {
        return;
    }
    onKeydown() {
        return;
    }
    onKeyup() {
        return;
    }
    onRuntimeFileLoad() {
        return;
    }
    onRuntimeFileLoaded() {
        return;
    }
}
/**
 * --- 启动 ClickGo ---
 * @param boot 启动类
 */
export async function launcher(boot) {
    /** --- 加载 Vue --- */
    await lTool.loadScript(`${cdn}/npm/vue@3.5.21/dist/vue.global${boot.isDebug() ? '' : '.prod.min'}.js`);
    modules.vue = window.Vue;
    /** --- 加载 jszip --- */
    modules.jszip = (await import(cdn + '/npm/jszip@3.10.1/+esm')).default;
    // --- 初始化各个模块 ---
    lForm.init();
    lCore.init();
    lDom.init();
    lTask.init();
    lNative.init();
    lCore.setBoot(boot);
    // --- 判断 TouchEvent 是否存在（例如某些浏览器可能不存在这个对象） ---
    if (!(window.TouchEvent)) {
        window.TouchEvent = CustomEvent;
    }
    // --- 加载 clickgo 的 global css ---
    const globalUrl = `${dirname}/global.css`;
    try {
        let style = await (await fetch(globalUrl)).text();
        // --- 将 style 里的 url 转换一下路径 ---
        const reg = /url\(['"]?([/\w.-]+)['"]?\)/g;
        let match = null;
        while ((match = reg.exec(style))) {
            style = style.replace(match[0], `url('${lTool.urlResolve(dirname + '/', match[1])}')`);
        }
        document.getElementById('cg-global')?.insertAdjacentHTML('afterbegin', style);
    }
    catch {
        alert(`ClickGo: "${globalUrl}" load failed.`);
    }
    // --- 执行回调 ---
    await boot.main();
}
export { lControl as control, lCore as core, lDom as dom, lForm as form, lFs as fs, lNative as native, lStorage as storage, lTask as task, lTheme as theme, lTool as tool, lZip as zip };
