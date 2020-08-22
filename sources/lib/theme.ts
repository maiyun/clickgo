/**
 * Copyright 2020 Han Guoshuai <zohegs@gmail.com>
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

/** --- 当前全局主题 --- */
export let global: ITheme | null = null;
/** --- clickgo 中的 cgt 文件编译后的对象 --- */
export let clickgoThemes: Record<string, ITheme> = {};

/**
 * --- cgt 文件 blob 转 ITheme 对象 ---
 * @param blob blob 对象
 */
export async function readBlob(blob: Blob): Promise<false | ITheme> {
    // --- 判断是否是 cgt 文件 ---
    let begin = blob.slice(0, 2);
    let beginUint = new Uint8Array(await clickgo.tool.blob2ArrayBuffer(begin));
    if (beginUint[0] !== 192 || beginUint[1] !== 2) {
        // --- 不是 cgt 文件 ---
        return false;
    }
    // --- 开始读取文件 ---
    let files: Record<string, Blob> = {};
    /** --- 配置文件 --- */
    let config!: IThemeConfig;
    /** --- 当前游标 --- */
    let cursor: number = 2;
    while (cursor < blob.size) {
        let pathSize = new Uint8Array(await clickgo.tool.blob2ArrayBuffer(blob.slice(cursor, ++cursor)));
        let path = await clickgo.tool.blob2Text(blob.slice(cursor, cursor += pathSize[0]));

        let contentSize = new Uint32Array(await clickgo.tool.blob2ArrayBuffer(blob.slice(cursor, cursor += 4)));
        let contentBolb = blob.slice(cursor, cursor += contentSize[0]);

        if (path === '/config.json') {
            config = JSON.parse(await clickgo.tool.blob2Text(contentBolb));
        }
        else {
            files[path] = contentBolb;
        }
    }
    if (!config) {
        return false;
    }
    return {
        'type': 'theme',
        'config': config,
        'files': files
    };
}

/**
 * --- 通过 clickgo 路径加载主题
 * @param path cgt 结尾的路径 ---
 */
export async function fetchClickGo(path: string): Promise<null | ITheme> {
    // --- 判断是否加载过 ---
    if (clickgoThemes[path]) {
        return clickgoThemes[path];
    }
    if (!await clickgo.core.fetchClickGoFile(path)) {
        return null;
    }
    return clickgoThemes[path];
}

/**
 * --- 加载 theme 给任务 ---
 * @param style cgt 文件路径或 cgt blob 对象
 * @param taskId 任务 ID
 * @param custom 自定为 true，系统为 false
 */
export async function load(path: string | ITheme, taskId: number, custom = true): Promise<boolean> {
    let task = clickgo.core.tasks[taskId];
    if (!task) {
        return false;
    }
    // --- 如果当前是自定，来设置的是系统，则不修改 ---
    if (task.customTheme && !custom) {
        return true;
    }
    let theme: ITheme;
    if (typeof path === 'string') {
        if (path.slice(0, 9) === '/clickgo/') {
            let t = await fetchClickGo(path.slice(8));
            if (!t) {
                return false;
            }
            theme = t;
        }
        else {
            if (clickgo.core.tasks[taskId].themes[path]) {
                theme = clickgo.core.tasks[taskId].themes[path];
            }
            else {
                let blob = clickgo.core.tasks[taskId].appPkg.files[path];
                if (!blob) {
                    return false;
                }
                let t = await readBlob(blob);
                if (!t) {
                    return false;
                }
                theme = t;
            }
        }
    }
    else {
        theme = path;
    }
    let styleBlob = theme.files[theme.config.style + '.css'];
    if (!styleBlob) {
        return false;
    }
    let style = await clickgo.tool.blob2Text(styleBlob);
    style = clickgo.tool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
    style = await clickgo.tool.styleUrl2DataUrl(theme.config.style, style, theme.files);
    // --- 如果当前是全局，现在设置的是自定，则清除全局主题样式 ---
    if (!task.customTheme && custom) {
        task.customTheme = true;
        document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`)!.innerHTML = '';
    }
    document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`)!.insertAdjacentHTML('beforeend', `<style data-path="${typeof path === 'string' ? path : path.config.name}">${style}</style>`);
    // --- 检查是否是设定为全局 ---
    if (!custom && !global) {
        global = theme;
    }
    return true;
}

/**
 * --- 移除当前 task 的 theme（只能移除自定的） ---
 * @param path 要移除的 path 或 name
 * @param taskId 任务 ID
 */
export async function remove(path: string, taskId: number): Promise<void> {
    let task = clickgo.core.tasks[taskId];
    if (!task) {
        return;
    }
    // --- 当前系统无需移除 ---
    if (!task.customTheme) {
        return;
    }
    document.querySelector(`#cg-style-task${taskId} > .cg-style-themes > [data-path="${path}"]`)!.remove();
    // --- 已被移除干净，切换到系统 ---
    if (document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`)!.children.length === 0) {
        // --- 变系统 ---
        task.customTheme = false;
        if (global) {
            await load(global, taskId, false);
        }
    }
}

/**
 * --- 清除一个 task 中所有加载的 theme
 * @param taskId task id
 */
export async function clear(taskId: number, custom = true): Promise<void> {
    let task = clickgo.core.tasks[taskId];
    if (!task) {
        return;
    }
    // --- 当前自定系统无法清除，当前系统自定无法清除 ---
    if ((task.customTheme && !custom) || (!task.customTheme && custom)) {
        return;
    }
    let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-themes`) as HTMLDivElement;
    el.innerHTML = '';
    // --- 如果是自定，清除后变成系统 ---
    if (task.customTheme) {
        task.customTheme = false;
        if (global) {
            await load(global, taskId, false);
        }
    }
}

/**
 * --- 将 cgt 主题设置到全局所有任务 ---
 * @param file cgt 文件的 blob 或 ITheme 对象
 */
export async function loadGlobal(file: string | ITheme): Promise<void> {
    for (let tid in clickgo.core.tasks) {
        let task = clickgo.core.tasks[tid];
        if (task.customTheme) {
            continue;
        }
        await load(file, parseInt(tid), false);
    }
}

/**
 * --- 清除全局主题 ---
 */
export async function clearGlobal(): Promise<void> {
    for (let tid in clickgo.core.tasks) {
        let task = clickgo.core.tasks[tid];
        if (task.customTheme) {
            continue;
        }
        await clear(parseInt(tid), false);
    }
}
