/**
 * Copyright 2021 Han Guoshuai <zohegs@gmail.com>
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
export let global: ICGThemePkg | null = null;
/** --- clickgo 中的 cgt 文件编译后的对象 --- */
export let clickgoThemePkgs: Record<string, ICGThemePkg> = {};

/**
 * --- cgt 文件 blob 转 IThemePkg 对象，会自动创建 object url，请注意释放 ---
 * @param blob blob 对象
 */
export async function read(blob: Blob): Promise<false | ICGThemePkg> {
    let zip = await clickgo.zip.getZip(blob);
    if (!zip) {
        return false;
    }
    let configContent = await zip.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    let config: ICGThemeConfig = JSON.parse(configContent);
    // --- 开始读取文件 ---
    let objectURLs: Record<string, string> = {};
    let filesRead: Record<string, Blob> = {};
    for (let file of config.files) {
        let fab = await zip.getContent(file, 'arraybuffer');
        if (!fab) {
            continue;
        }
        let mimeo = clickgo.tool.getMimeByPath(file);
        filesRead[file] = new Blob([fab], {
            'type': mimeo.mime
        });
        if (!['css'].includes(mimeo.ext)) {
            objectURLs[file] = clickgo.tool.createObjectURL(filesRead[file]);
        }
    }
    return {
        'type': 'theme',
        'config': config,
        'files': filesRead,
        'objectURLs': objectURLs
    };
}

/**
 * --- 移出 IThemePkg 的所有已创建的 object url ---
 * @param pkg 要处理的 theme pkg 对象
 */
export function revokeObjectURL(pkg: ICGThemePkg): void {
    for (let path in pkg.objectURLs) {
        clickgo.tool.revokeObjectURL(pkg.objectURLs[path]);
    }
}

/**
 * --- 加载 theme 给任务（具体执行层，不可用来直接设置全局主题） ---
 * @param taskId 要给某任务 ID 加载主题
 * @param path 特殊字符串“global”代表加载全局主题进来 或 cgt 文件路径只可应用于本任务
 */
export async function load(taskId: number, path: string = 'global'): Promise<boolean> {
    let task = clickgo.task.list[taskId];
    if (!task) {
        return false;
    }
    // --- 如果当前是自定，来设置的是系统，则不修改 ---
    if (task.customTheme && (path === 'global')) {
        return true;
    }
    let theme: ICGThemePkg;
    if (path === 'global') {
        if (!global) {
            return false;
        }
        theme = global;
    }
    else {
        if (path.startsWith('/clickgo/')) {
            // --- 加载的是 clickgo 库的主题 ---
            let clickgoPath = path.slice(8);
            if (!clickgoThemePkgs[clickgoPath]) {
                if ((await clickgo.core.fetchClickGoFile(clickgoPath)) === null) {
                    return false;
                }
            }
            theme = clickgoThemePkgs[clickgoPath];
        }
        else if (task.themePkgs[path]) {
            theme = task.themePkgs[path];
        }
        else {
            return false;
        }
    }
    let styleBlob = theme.files[theme.config.style + '.css'];
    if (!styleBlob) {
        return false;
    }
    let style = await clickgo.tool.blob2Text(styleBlob);
    style = clickgo.tool.stylePrepend(style, `cg-theme-task${taskId}-`).style;
    style = await clickgo.tool.styleUrl2ObjectOrDataUrl(theme.config.style, style, theme);
    if (!task.customTheme) {
        // --- 如果当前 task 是全局主题 ---
        if (path !== 'global') {
            // --- 但当前是自定，则任务标识设置为自定 ---
            task.customTheme = true;
        }
        // --- 只要 task 之前是全局主题，本次就要清除原主题内容 ---
        clickgo.dom.removeStyle(taskId, 'theme');
    }
    clickgo.dom.pushStyle(taskId, style, 'theme', path);
    return true;
}

/**
 * --- 移除当前 task 的 theme（只能移除自定的） ---
 * @param taskId 任务 ID
 * @param path 要移除的 path
 */
export async function remove(taskId: number, path: string): Promise<void> {
    let task = clickgo.task.list[taskId];
    if (!task) {
        return;
    }
    if (!task.customTheme) {
        // --- 当前是系统主题，无权限移除 ---
        return;
    }
    clickgo.dom.removeStyle(taskId, 'theme', path);
    // --- 已被移除干净，切换到系统 ---
    if (clickgo.dom.getStyleCount(taskId, 'theme') === 0) {
        // --- 变系统 ---
        task.customTheme = false;
        if (global) {
            await load(taskId, 'global');
        }
    }
}

/**
 * --- 清除一个 task 中所有加载的 theme（只能清除自定） ---
 * @param taskId task id
 */
export async function clear(taskId: number): Promise<void> {
    let task = clickgo.task.list[taskId];
    if (!task) {
        return;
    }
    // --- 当前自定才可清除 ---
    if (!task.customTheme) {
        // --- 当前是系统，则不许清除 ---
        return;
    }
    clickgo.dom.removeStyle(taskId, 'theme');
    task.customTheme = false;
    if (global) {
        await load(taskId);
    }
}

/**
 * --- 将 cgt 主题设置到全局所有任务 ---
 * @param file cgt 文件的 blob 对象
 */
export async function setGlobal(file: Blob): Promise<void> {
    let pkg = await read(file);
    if (!pkg) {
        return;
    }
    if (global) {
        revokeObjectURL(global);
    }
    global = pkg;
    for (let taskId in clickgo.task.list) {
        await load(parseInt(taskId), 'global');
    }
}

/**
 * --- 清除全局主题 ---
 */
export async function clearGlobal(): Promise<void> {
    if (!global) {
        return;
    }
    revokeObjectURL(global);
    global = null;
    for (let taskId in clickgo.task.list) {
        let task = clickgo.task.list[taskId];
        if (task.customTheme) {
            continue;
        }
        clickgo.dom.removeStyle(task.id, 'theme');
    }
}
