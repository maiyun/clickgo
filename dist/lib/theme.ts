/**
 * Copyright 2007-2025 MAIYUN.NET
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
import * as lZip from './zip';
import * as lTool from './tool';
import * as lTask from './task';
import * as lDom from './dom';
import * as lFs from './fs';
import * as lCore from './core';
import * as lForm from './form';

/** --- 系统级 ID --- */
let sysId = '';

/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id: string): void {
    if (sysId) {
        return;
    }
    sysId = id;
}

/** --- 当前全局主题 --- */
export let global: ITheme | null = null;

/**
 * --- cgt 文件 blob 转 IThemePkg 对象，会自动创建 object url，请注意释放 ---
 * @param blob blob 对象
 */
export async function read(blob: Blob): Promise<ITheme | false> {
    const z = await lZip.get(blob);
    if (!z) {
        return false;
    }
    const configContent = await z.getContent('config.json');
    if (!configContent) {
        return false;
    }
    const config: IThemeConfig = JSON.parse(configContent);
    const files: Record<string, Blob | string> = {};
    // --- 读取包文件 ---
    const list = z.readDir('/', {
        'hasChildren': true
    });
    for (const file of list) {
        const mime = lTool.getMimeByPath(file.name);
        if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
            const fab = await z.getContent(file.path + file.name, 'string');
            if (!fab) {
                continue;
            }
            files[file.path + file.name] = fab.replace(/^\ufeff/, '');
        }
        else {
            const fab = await z.getContent(file.path + file.name, 'arraybuffer');
            if (!fab) {
                continue;
            }
            files[file.path + file.name] = new Blob([fab], {
                'type': mime.mime
            });
        }
    }
    return {
        'type': 'theme',
        'config': config,
        'files': files
    };
}

/**
 * --- 加载 theme 给任务 ---
 * @param taskId 要给某任务 ID 加载主题
 * @param theme ITheme 对象，undefined 代表加载全局的默认主题
 */
export async function load(taskId: lCore.TCurrent, theme?: ITheme): Promise<boolean> {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const t = lTask.getOrigin(taskId);
    if (!t) {
        return false;
    }
    /** --- 是否加载全局的主题到本任务 --- */
    const isGlobal = theme ? false : true;
    // --- 如果当前是自定，来设置的是全局，则不修改 ---
    if (t.customTheme && isGlobal) {
        return true;
    }
    if (!theme) {
        // --- 等同于 if (isGlobal) { ---
        // --- 设置系统主题 ---
        if (!global) {
            // --- 但系统主题不存在，也算设置成功了 ---
            return true;
        }
        // --- 当前任务非自定，可以设置为系统主题 ---
        theme = global;
    }
    let style = theme.files[theme.config.style + '.css'] as string;
    if (!style) {
        return false;
    }
    style = lTool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
    style = await lTool.styleUrl2DataUrl(theme.config.style, style, theme.files);
    // --- 替换 [CGTMP-GLOBAL] ---
    style = style.replace(/\[CGTMP-GLOBAL\] +::selection/g, `#cg-form-list > [data-task-id="${taskId}"] ::selection, #cg-pop-list > [data-task-id="${taskId}"] ::selection`);
    style = style.replace(/\[CGTMP-GLOBAL\]/g, `#cg-form-list > [data-task-id="${taskId}"], #cg-pop-list > [data-task-id="${taskId}"]`);
    if (!t.customTheme) {
        // --- 如果当前 task 不是自定主题 ---
        if (!isGlobal) {
            // --- 但当前设置为自定，则任务标识设置为自定 ---
            t.customTheme = true;
        }
        // --- 只要 task 之前是全局主题，本次就要清除原主题所有内容 ---
        lDom.removeStyle(taskId, 'theme');
    }
    lDom.pushStyle(taskId, style, 'theme', theme.config.name);
    return true;
}

/**
 * --- 移除当前 task 的 theme（只能移除自定的） ---
 * @param taskId 任务 ID
 * @param name 要移除的主题
 */
export async function remove(taskId: lCore.TCurrent, name: string): Promise<void> {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const t = lTask.getOrigin(taskId);
    if (!t) {
        return;
    }
    if (!t.customTheme) {
        // --- 当前是系统主题，无权限移除 ---
        return;
    }
    lDom.removeStyle(taskId, 'theme', name);
    // --- 判断是否所有自定主题都被移除干净 ---
    if (lDom.getStyleCount(taskId, 'theme') === 0) {
        // --- 全部干净了，切换为系统主题 ---
        t.customTheme = false;
        if (global) {
            await load(taskId);
        }
    }
}

/**
 * --- 清除一个 task 中所有加载的 theme（只能清除自定） ---
 * @param taskId 要清除的任务 id
 */
export async function clear(taskId: lCore.TCurrent): Promise<void> {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const t = lTask.getOrigin(taskId);
    if (!t) {
        return;
    }
    // --- 当前自定才可清除 ---
    if (!t.customTheme) {
        // --- 当前是系统，则不许清除 ---
        return;
    }
    lDom.removeStyle(taskId, 'theme');
    t.customTheme = false;
    if (global) {
        await load(taskId);
    }
}

/**
 * --- 将 cgt 主题设置到全局所有任务 ---
 * @param theme 主题对象或主题路径（不带 .cgt）
 * @param current 如果要读包内对象，则要传当前任务
 */
export async function setGlobal(theme: ITheme | string, current: lCore.TCurrent | null = null): Promise<number> {
    if (typeof theme === 'string') {
        // --- 是个路径 ---
        const f = await lFs.getContent(current, theme + '.cgt');
        if (!f) {
            return 0;
        }
        if (typeof f === 'string') {
            return -1;
        }
        const t = await read(f);
        if (!t) {
            return -2;
        }
        theme = t;
    }
    global = theme;
    const tlist = await lTask.getOriginList(sysId);
    for (const taskId in tlist) {
        await load(taskId);
    }
    return 1;
}

/**
 * --- 清除全局主题 ---
 */
export async function clearGlobal(): Promise<void> {
    if (!global) {
        return;
    }
    global = null;
    const tlist = await lTask.getOriginList(sysId);
    for (const taskId in tlist) {
        const t = tlist[taskId];
        if (t.customTheme) {
            continue;
        }
        lDom.removeStyle(t.id, 'theme');
    }
}

/**
 * --- 设置全局主色 ---
 * @param color 如 oklch(.7 .2 43)，留空为还原
 * @param hue 主色的 hue 值，留空为还原
 */
export function setMain(color?: string, hue?: number): void {
    if (color) {
        lForm.elements.wrap.style.setProperty('--main', color);
    }
    else {
        lForm.elements.wrap.style.removeProperty('--main');
    }
    if (hue) {
        lForm.elements.wrap.style.setProperty('--main-hue', hue.toString());
    }
    else {
        lForm.elements.wrap.style.removeProperty('--main-hue');
    }
}

// --- 类型 ---

/** --- 主题对象 --- */
export interface ITheme {
    'type': 'theme';
    /** --- 主题对象配置文件 --- */
    'config': IThemeConfig;
    /** --- 所有已加载的文件内容 --- */
    'files': Record<string, Blob | string>;
}

/** --- 主题文件包的 config --- */
export interface IThemeConfig {
    'name': string;
    'ver': number;
    'version': string;
    'author': string;

    /** --- 不带扩展名，系统会在末尾添加 .css --- */
    'style': string;

    /** --- 将要加载的文件 --- */
    'files': string[];
}
