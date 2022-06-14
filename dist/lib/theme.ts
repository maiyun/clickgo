/**
 * Copyright 2022 Han Guoshuai <zohegs@gmail.com>
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
import * as types from '../../types';
import * as zip from './zip';
import * as tool from './tool';
import * as task from './task';
import * as dom from './dom';

/** --- 当前全局主题 --- */
export let global: types.ITheme | null = null;

/**
 * --- cgt 文件 blob 转 IThemePkg 对象，会自动创建 object url，请注意释放 ---
 * @param blob blob 对象
 */
export async function read(blob: Blob): Promise<types.ITheme | false> {
    const z = await zip.get(blob);
    if (!z) {
        return false;
    }
    const configContent = await z.getContent('config.json');
    if (!configContent) {
        return false;
    }
    const config: types.IThemeConfig = JSON.parse(configContent);
    // --- 开始读取文件 ---
    const files: Record<string, Blob | string> = {};
    for (const file of config.files) {
        const mime = tool.getMimeByPath(file);
        if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
            const fab = await z.getContent(file, 'string');
            if (!fab) {
                continue;
            }
            files[file] = fab.replace(/^\ufeff/, '');
        }
        else {
            const fab = await z.getContent(file, 'arraybuffer');
            if (!fab) {
                continue;
            }
            files[file] = new Blob([fab], {
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
 * --- 加载 theme 给任务（App 模式下必须设置 theme，不能用来加载所谓的全局主题） ---
 * @param theme ITheme 对象，undefined 代表加载全局的默认主题，但 App 模式下必须设置此项
 * @param taskId 要给某任务 ID 加载主题，App 模式下无效
 */
export async function load(theme?: types.ITheme, taskId?: number): Promise<boolean> {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
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
    style = tool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
    style = await tool.styleUrl2DataUrl(theme.config.style, style, theme.files);
    // --- 替换 [CGTMP-GLOBAL] ---
    style = style.replace(/\[CGTMP-GLOBAL\] +::selection/g, `#cg-form-list > [data-task-id="${taskId}"] ::selection, #cg-pop-list > [class^="cg-theme-task${taskId}-"] ::selection`);
    style = style.replace(/\[CGTMP-GLOBAL\]/g, `#cg-form-list > [data-task-id="${taskId}"], #cg-pop-list > [class^="cg-theme-task${taskId}-"]`);
    if (!t.customTheme) {
        // --- 如果当前 task 不是自定主题 ---
        if (!isGlobal) {
            // --- 但当前设置为自定，则任务标识设置为自定 ---
            t.customTheme = true;
        }
        // --- 只要 task 之前是全局主题，本次就要清除原主题所有内容 ---
        dom.removeStyle(taskId, 'theme');
    }
    dom.pushStyle(taskId, style, 'theme', theme.config.name);
    return true;
}

/**
 * --- 移除当前 task 的 theme（只能移除自定的） ---
 * @param 要移除的主题 name
 * @param taskId 任务 ID，App 模式下无效
 */
export async function remove(name: string, taskId?: number): Promise<void> {
    if (!taskId) {
        return;
    }
    const t = task.list[taskId];
    if (!t) {
        return;
    }
    if (!t.customTheme) {
        // --- 当前是系统主题，无权限移除 ---
        return;
    }
    dom.removeStyle(taskId, 'theme', name);
    // --- 判断是否所有自定主题都被移除干净 ---
    if (dom.getStyleCount(taskId, 'theme') === 0) {
        // --- 全部干净了，切换为系统主题 ---
        t.customTheme = false;
        if (global) {
            await load(undefined, taskId);
        }
    }
}

/**
 * --- 清除一个 task 中所有加载的 theme（只能清除自定） ---
 * @param taskId 要清除的任务 id，App 模式下无效
 */
export async function clear(taskId?: number): Promise<void> {
    if (!taskId) {
        return;
    }
    const t = task.list[taskId];
    if (!t) {
        return;
    }
    // --- 当前自定才可清除 ---
    if (!t.customTheme) {
        // --- 当前是系统，则不许清除 ---
        return;
    }
    dom.removeStyle(taskId, 'theme');
    t.customTheme = false;
    if (global) {
        await load(undefined, taskId);
    }
}

/**
 * --- 将 cgt 主题设置到全局所有任务 ---
 * @param theme 主题对象
 */
export async function setGlobal(theme: types.ITheme): Promise<void> {
    global = theme;
    for (const taskId in task.list) {
        await load(undefined, parseInt(taskId));
    }
}

/**
 * --- 清除全局主题 ---
 */
export function clearGlobal(): void {
    if (!global) {
        return;
    }
    global = null;
    for (const taskId in task.list) {
        const t = task.list[taskId];
        if (t.customTheme) {
            continue;
        }
        dom.removeStyle(t.id, 'theme');
    }
}
