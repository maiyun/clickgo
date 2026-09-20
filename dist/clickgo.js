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
const version = '6.4.2';
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
    /** --- 当前是否是 debug 模式 --- */
    _debug = false;
    /** --- 切勿传给 App --- */
    _sysId = '';
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
/** --- 显示浏览器运行环境提示 --- */
export function showBrowserWarning(text) {
    document.getElementById('cg-browser-warning')?.remove();
    const el = document.createElement('div');
    el.id = 'cg-browser-warning';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'polite');
    const icon = document.createElement('div');
    icon.className = 'cg-browser-warning-icon';
    icon.textContent = '!';
    el.appendChild(icon);
    const body = document.createElement('div');
    body.className = 'cg-browser-warning-body';
    el.appendChild(body);
    const title = document.createElement('div');
    title.className = 'cg-browser-warning-title';
    title.textContent = text.title;
    body.appendChild(title);
    const content = document.createElement('div');
    content.className = 'cg-browser-warning-content';
    content.textContent = text.content;
    body.appendChild(content);
    const button = document.createElement('button');
    button.className = 'cg-browser-warning-button';
    button.type = 'button';
    button.textContent = text.button;
    button.addEventListener('click', () => {
        el.remove();
    });
    body.appendChild(button);
    document.body.appendChild(el);
}
/**
 * --- 检查浏览器是否支持 ClickGo 使用的现代颜色语法，不支持时显示升级提示 ---
 */
function checkBrowserColorSupport() {
    if ((typeof CSS !== 'undefined') &&
        CSS.supports('color', 'oklch(.7 .2 43)') &&
        CSS.supports('color', 'color-mix(in oklch, #000000, #ffffff)') &&
        CSS.supports('color', 'oklch(from #ff6600 l c h)')) {
        return;
    }
    const locale = lCore.config.locale;
    showBrowserWarning(locale === 'sc' ? {
        'title': '浏览器版本较低',
        'content': '当前浏览器无法完整显示界面颜色，建议升级浏览器后继续使用。',
        'button': '知道了'
    } : (locale === 'tc' ? {
        'title': '瀏覽器版本較低',
        'content': '目前瀏覽器無法完整顯示介面色彩，建議升級瀏覽器後繼續使用。',
        'button': '知道了'
    } : {
        'title': 'Browser update recommended',
        'content': 'Your browser cannot display all interface colors. Please update it for the best experience.',
        'button': 'Got it'
    }));
}
/**
 * --- 启动 ClickGo ---
 * @param boot 启动类
 */
export async function launcher(boot) {
    // --- 先加载核心库 ---
    await lTool.loadScripts([
        `${cdn}/npm/vue@3.5.42/dist/vue.global${boot.isDebug() ? '' : '.prod.min'}.js`,
    ]);
    // --- 再加载三方库，防止 Vue 没加载好，三方库加载会有异常 ---
    await lTool.loadScripts([
        // --- 加载 jszip ---
        `${cdn}/npm/jszip@3.10.1/dist/jszip.min.js`,
        // --- 加载 pointer ---
        `${cdn}/npm/@litert/pointer@1.7.6/dist/index.umd.min.js`,
    ]);
    await lTool.loadLinks([
        `${cdn}/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css`,
    ]);
    modules.vue = window.Vue;
    modules.jszip = window.JSZip;
    modules.pointer = window.pointer;
    modules.pointer.addMoveHook('down', () => {
        lDom.is.move = true;
    });
    modules.pointer.addMoveHook('up', () => {
        lDom.is.move = false;
    });
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
    // --- 初始化各个模块 ---
    lForm.init();
    lCore.init();
    checkBrowserColorSupport();
    lDom.init();
    lTask.init();
    lNative.init();
    lCore.setBoot(boot);
    // --- 判断 TouchEvent 是否存在（例如某些浏览器可能不存在这个对象） ---
    if (!(window.TouchEvent)) {
        window.TouchEvent = CustomEvent;
    }
    // --- 执行回调 ---
    await boot.main();
}
export { lControl as control, lCore as core, lDom as dom, lForm as form, lFs as fs, lNative as native, lStorage as storage, lTask as task, lTheme as theme, lTool as tool, lZip as zip };
