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
export const modules: {
    /* eslint-disable @typescript-eslint/naming-convention */
    'clickgo': typeof clickgo;
    /** --- 原生 vue --- */
    'vue': typeof import('vue');
    /** --- 原生 jszip --- */
    'jszip': typeof import('jszip');
    /** --- 原生 pointer --- */
    'pointer': typeof import('@litert/pointer');
    /** --- 原生 tums-player 对象（在 default 里） --- */
    'tums-player': lCore.ITumsPlayer;

    /* eslint-enable */

    /** --- 其他任何模块 --- */
    [key: string]: any;
} = {
    'clickgo': clickgo,
} as any;

const version = '5.6.5';
/** --- 获取当前版本 --- */
export function getVersion(): string {
    return version;
}

const native = navigator.userAgent.includes('electron') ? true : false;
/** --- 是否是 native 环境 --- */
export function isNative(): boolean {
    return native;
}

const dirname = import.meta.url.slice(0, import.meta.url.lastIndexOf('/'));
/** --- 获取当前 ClickGo 所在的目录，不以 / 结尾 --- */
export function getDirname(): string {
    return dirname;
}

/** --- 当前平台（web 则只返回 web） --- */
let platform: NodeJS.Platform | 'web' = 'web';
/** --- native 是否含有窗体外边框 --- */
let frame: boolean = false;

if (!(window as any).clickgo) {
    (window as any).clickgo = {};
}
(window as any).clickgo.modules = modules;
/** --- 用户定义的 ClickGo 信息 --- */
const userClickGo = (window as any).clickgo;

/** --- 用户定义的全局对象 --- */
export const global = userClickGo.global ?? {};

/** --- 读取用户的 cdn 设置 --- */
const cdn = userClickGo.config?.cdn ?? 'https://cdn.jsdelivr.net';
/** --- 获取当前 cdn 前缀 --- */
export function getCdn(): string {
    return cdn;
}

if (native) {
    const reg = /electron\/(.+?) (.+?)\/(.+?) frame\/([0-9])/.exec(navigator.userAgent);
    if (reg) {
        platform = reg[2] as any;
        frame = reg[4] === '0' ? false : true;
    }
}

/** --- 获取当前平台（web 则只返回 web） --- */
export function getPlatform(): NodeJS.Platform | 'web' {
    return platform;
}

let device: {
    'type': 'unknown' | 'mobile' | 'desktop';
    'os': 'unknown' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';
} = {
    'type': 'unknown',
    'os': 'unknown',
};

/** --- 获取当前设备信息（支持 native 和 web） --- */
export function getDevice(): typeof device {
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
export function hasFrame(): boolean {
    return frame;
}

/** --- 全局类 --- */
export abstract class AbstractBoot {

    /** --- 当前是否是 debug 模式 --- */
    private readonly _debug: boolean = false;

    /** --- 切勿传给 App --- */
    protected _sysId: string = '';

    public setSysId(sysId: string): void {
        if (this._sysId) {
            return;
        }
        this._sysId = sysId;
    }

    /** --- 判断当前是否是 debug 模式 --- */
    public isDebug(): boolean {
        return this._debug;
    }

    public constructor(opt: {
        'debug'?: boolean;
    } = {}) {
        if (opt.debug) {
            this._debug = true;
        }
    }

    /** --- 入口方法 --- */
    public abstract main(): void | Promise<void>;

    /** --- 全局错误事件 --- */
    public onError(taskId: string, formId: string, error: Error, info: string): void | Promise<void>;
    public onError(): void {
        return;
    }

    /** --- 屏幕大小改变事件 --- */
    public onScreenResize(): void | Promise<void>;
    public onScreenResize(): void {
        return;
    }

    /** --- 系统配置变更事件 --- */
    public onConfigChanged<T extends lCore.IConfig, TK extends keyof T>(n: TK, v: T[TK]): void | Promise<void>;
    public onConfigChanged(): void {
        return;
    }

    /** --- 窗体创建事件 --- */
    public onFormCreated(
        taskId: string, formId: string, title: string, icon: string, showInSystemTask: boolean
    ): void | Promise<void>;
    public onFormCreated(): void {
        return;
    }

    /** --- 窗体销毁事件 */
    public onFormRemoved(taskId: string, formId: string, title: string, icon: string): void | Promise<void>;
    public onFormRemoved(): void {
        return;
    }

    /** --- 窗体标题改变事件 */
    public onFormTitleChanged(taskId: string, formId: string, title: string): void | Promise<void>;
    public onFormTitleChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体图标改变事件 --- */
    public onFormIconChanged(taskId: string, formId: string, icon: string): void | Promise<void>;
    public onFormIconChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体最小化状态改变事件 --- */
    public onFormStateMinChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormStateMinChanged(): void {
        return;
    }

    /** --- 窗体最大化状态改变事件 --- */
    public onFormStateMaxChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormStateMaxChanged(): void {
        return;
    }

    /** --- 窗体显示状态改变事件 --- */
    public onFormShowChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormShowChanged(): void {
        return;
    }

    /** --- 窗体获得焦点事件 --- */
    public onFormFocused(taskId: string, formId: string): void | Promise<void>;
    public onFormFocused(): void {
        return;
    }

    /** --- 窗体丢失焦点事件 --- */
    public onFormBlurred(taskId: string, formId: string): void | Promise<void>;
    public onFormBlurred(): void {
        return;
    }

    /** --- 窗体闪烁事件 --- */
    public onFormFlash(taskId: string, formId: string): void | Promise<void>;
    public onFormFlash(): void {
        return;
    }

    /** --- 窗体是否显示在任务栏属性改变事件 --- */
    public onFormShowInSystemTaskChange(taskId: string, formId: string, value: boolean): void | Promise<void>;
    public onFormShowInSystemTaskChange(): void {
        return;
    }

    /** --- 窗体的 formHash 改变事件 --- */
    public onFormHashChange(
        taskId: string, formId: string, value: string, data: Record<string, any>
    ): void | Promise<void>;
    public onFormHashChange(): void {
        return;
    }

    /** --- 任务开始事件 --- */
    public onTaskStarted(taskId: string): void | Promise<void>;
    public onTaskStarted(): void | Promise<void> {
        return;
    }

    /** --- 任务结束事件 --- */
    public onTaskEnded(taskId: string): void | Promise<void>;
    public onTaskEnded(): void | Promise<void> {
        return;
    }

    /** --- launcher 文件夹名称修改事件 --- */
    public onLauncherFolderNameChanged(id: string, name: string): void | Promise<void>;
    public onLauncherFolderNameChanged(): void {
        return;
    }

    /** --- location hash 改变事件 --- */
    public onHashChanged(hash: string): void | Promise<void>;
    public onHashChanged(): void {
        return;
    }

    /** --- 键盘按下事件 --- */
    public onKeydown(e: KeyboardEvent): void | Promise<void>;
    public onKeydown(): void {
        return;
    }

    /** --- 键盘弹起事件 --- */
    public onKeyup(e: KeyboardEvent): void | Promise<void>;
    public onKeyup(): void {
        return;
    }

    /** --- 环境文件准备加载时的事件 --- */
    public onRuntimeFileLoad(url: string): void | Promise<void>;
    public onRuntimeFileLoad(): void {
        return;
    }

    /** --- 环境文件加载完成的事件 --- */
    public onRuntimeFileLoaded(url: string, state: number): void | Promise<void>;
    public onRuntimeFileLoaded(): void {
        return;
    }

}

/**
 * --- 启动 ClickGo ---
 * @param boot 启动类
 */
export async function launcher(boot: AbstractBoot): Promise<void> {
    // --- 先加载核心库 ---
    await lTool.loadScripts([
        `${cdn}/npm/vue@3.5.26/dist/vue.global${boot.isDebug() ? '' : '.prod.min'}.js`,
    ]);
    // --- 再加载三方库，防止 Vue 没加载好，三方库加载会有异常 ---
    await lTool.loadScripts([
        // --- 加载 jszip ---
        `${cdn}/npm/jszip@3.10.1/dist/jszip.min.js`,
        // --- 加载 pointer ---
        `${cdn}/npm/@litert/pointer@1.7.1/dist/index.umd.min.js`,
    ]);
    modules.vue = (window as any).Vue;
    modules.jszip = (window as any).JSZip;
    modules.pointer = (window as any).pointer;
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
        let match: RegExpExecArray | null = null;
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
    lDom.init();
    lTask.init();
    lNative.init();
    lCore.setBoot(boot);
    // --- 判断 TouchEvent 是否存在（例如某些浏览器可能不存在这个对象） ---
    if (!((window as any).TouchEvent)) {
        (window as any).TouchEvent = CustomEvent;
    }
    // --- 执行回调 ---
    await boot.main();
}

export {
    lControl as control, lCore as core, lDom as dom,
    lForm as form, lFs as fs, lNative as native, lStorage as storage,
    lTask as task, lTheme as theme, lTool as tool, lZip as zip
};
