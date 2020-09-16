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

/** --- clickgo 已经加载的文件列表 --- */
export let clickgoFiles: Record<string, Blob> = {};
/** --- clickgo 中的 cgc 文件编译后的 pkg 对象 --- */
export let clickgoControlPkgs: Record<string, IControlPkg> = {};
/** --- 当前运行的程序 --- */
export let tasks: Record<number, ITask> = {};
/** --- 最后一个 task id --- */
export let lastTaskId: number = 0;

/** --- 全局响应事件 --- */
export let globalEvents: IGlobalEvents = {
    errorHandler: null,
    screenResizeHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: null,
    formTitleChangedHandler: null,
    formIconChangedHandler: null,
    formStateMinChangedHandler: null,
    formStateMaxChangedHandler: null,
    formFocusedHandler: null,
    formBlurredHandler: null,
    formFlashHandler: null,
    taskStartedHandler: null,
    taskEndedHandler: null
};

/**
 * --- 触发系统级事件 ---
 */
export function trigger(name: TGlobalEvent, taskId: number = 0, formId: number = 0, opt: { 'title'?: string; 'state'?: boolean; 'icon'?: string; } = {}): void {
    switch (name) {
        case 'screenResize': {
            const rtn = globalEvents.screenResizeHandler?.();
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.();
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            if ((globalEvents as any)[name + 'Handler']) {
                (globalEvents as any)[name + 'Handler'](taskId, formId, opt.title, opt.icon);
            }
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.(taskId, formId, opt.title, opt.icon);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formTitleChanged': {
            const rtn = globalEvents.formTitleChangedHandler?.(taskId, formId, opt.title ?? '');
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.(taskId, formId, opt.title);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formIconChanged': {
            const rtn = globalEvents.formIconChangedHandler?.(taskId, formId, opt.icon ?? '');
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.(taskId, formId, opt.icon);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, opt.state);
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.(taskId, formId, opt.state);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            if ((globalEvents as any)[name + 'Handler']) {
                (globalEvents as any)[name + 'Handler'](taskId, formId);
            }
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.(taskId, formId);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            if ((globalEvents as any)[name + 'Handler']) {
                (globalEvents as any)[name + 'Handler'](taskId, formId);
            }
            for (let tid in tasks) {
                for (let fid in tasks[tid].forms) {
                    const rtn = tasks[tid].forms[fid].events[name]?.(taskId);
                    if (rtn instanceof Promise) {
                        rtn.catch((e) => {
                            throw e;
                        });
                    }
                }
            }
            break;
        }
    }
}

/**
 * --- 从 cg 目录加载文件（若是已经加载的文件不会再次加载） ---
 * @param path clickgo 文件路径 ---
 */
export async function fetchClickGoFile(path: string): Promise<null | Blob> {
    // --- 判断是否加载过 ---
    if (clickgoFiles[path]) {
        return clickgoFiles[path];
    }
    // --- 加载 clickgo 文件 ---
    try {
        let blob = await (await fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random())).blob();
        let lio = path.lastIndexOf('.');
        let ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
        switch (ext) {
            case 'cgc': {
                let pkg = await clickgo.tool.controlBlob2Pkg(blob);
                if (!pkg) {
                    return null;
                }
                clickgoControlPkgs[path] = pkg;
                break;
            }
            case 'cgt': {
                let t = await clickgo.theme.readBlob(blob);
                if (!t) {
                    return null;
                }
                clickgo.theme.clickgoThemes[path] = t;
                break;
            }
        }
        clickgoFiles[path] = blob;
        return clickgoFiles[path];
    }
    catch {
        return null;
    }
}

/**
 * --- 通过 clickgo 路径加载控件
 * @param path cgc 结尾的路径 ---
 */
export async function fetchClickGoControlPkg(path: string): Promise<null | IControlPkg> {
    // --- 判断是否加载过 ---
    if (clickgoControlPkgs[path]) {
        return clickgoControlPkgs[path];
    }
    if (!await fetchClickGoFile(path)) {
        return null;
    }
    return clickgoControlPkgs[path];
}

/**
 * --- 从网络加载应用（不能加载 cga 文件） ---
 * @param path 相对、绝对或 cg 路径，以 / 结尾的目录 ---
 */
export async function fetchApp(path: string): Promise<null | IAppPkg> {
    if (path.slice(-1) !== '/') {
        return null;
    }
    let realPath = clickgo.tool.parsePath(path);
    // --- 加载 json 文件，并创建 control 信息对象 ---
    let config: IAppConfig;
    // --- 已加载的 files ---
    let files: Record<string, Blob> = {};
    try {
        config = await (await fetch(realPath + 'config.json?' + Math.random())).json();
        // --- 将预加载文件进行加载 ---
        for (let file of config.files) {
            let resp: Response = await fetch(realPath + file.slice(1) + '?' + Math.random());
            files[file] = await resp.blob();
        }
        // --- 预加载 clickgo 相关文件 ---
        if (config.controls) {
            for (let file of config.controls) {
                if (file.slice(0, 9) !== '/clickgo/') {
                    continue;
                }
                if ((await fetchClickGoFile(file.slice(8) + '.cgc')) === null) {
                    return null;
                }
            }
        }
        if (config.themes) {
            for (let file of config.themes) {
                if (file.slice(0, 9) !== '/clickgo/') {
                    continue;
                }
                if ((await fetchClickGoFile(file.slice(8) + '.cgt')) === null) {
                    return null;
                }
            }
        }
    }
    catch {
        return null;
    }
    return {
        'type': 'app',
        'config': config,
        'files': files
    };
}

/**
 * --- 运行一个应用 ---
 * @param path app 路径
 * @param opt runtime 运行时要注入的文件列表（cg 文件默认被注入） ---
 */
export async function runApp(path: string | IAppPkg, opt?: {
    'runtime'?: Record<string, Blob>;
}): Promise<number> {
    opt = opt ?? {};
    opt.runtime = opt.runtime ?? {};

    let appPkg: IAppPkg | null;
    if (typeof path === 'string') {
        if (!(appPkg = await fetchApp(path))) {
            return -1;
        }
    }
    else {
        appPkg = path;
    }
    // --- app 的内置文件以及运行时文件 ---
    let files: Record<string, Blob> = {};
    for (let fpath in appPkg.files) {
        files[fpath] = appPkg.files[fpath];
    }
    for (let fpath in opt.runtime) {
        files['/runtime' + fpath] = opt.runtime[fpath];
    }
    appPkg.files = files;
    // --- 创建任务对象 ---
    let taskId = ++lastTaskId;
    tasks[taskId] = {
        'id': taskId,
        'appPkg': appPkg,
        'customTheme': false,

        'controlPkgs': {},
        'themes': {},
        'forms': {}
    };
    clickgo.tool.createTaskStyleElement(taskId);
    let task: ITask = tasks[taskId];
    // --- 创建 form ---
    let form = await clickgo.form.create({
        'file': appPkg.config.main,
        'taskId': task.id
    });
    if (typeof form === 'number') {
        delete(tasks[taskId]);
        clickgo.tool.removeTaskStyleElement(taskId);
        return form;
    }
    // --- 设置 global style（如果 form 创建失败，就不设置 global style 了） ---
    if (appPkg.config.style && appPkg.files[appPkg.config.style + '.css']) {
        let style = await clickgo.tool.blob2Text(appPkg.files[appPkg.config.style + '.css']);
        let r = clickgo.tool.stylePrepend(style, 'cg-task' + task.id + '_');
        clickgo.tool.pushStyle(await clickgo.tool.styleUrl2DataUrl(appPkg.config.style, r.style, files), task.id);
    }
    // --- 是否要加载独立的 theme ---
    if (appPkg.config.themes) {
        task.customTheme = true;
        for (let theme of appPkg.config.themes) {
            await clickgo.theme.load(theme + '.cgt', task.id);
        }
    }
    else {
        // --- 检测是否加载系统 theme ---
        if (clickgo.theme.global) {
            await clickgo.theme.load(clickgo.theme.global, task.id, false);
        }
    }
    return task.id;
}

/**
 * --- 完全结束任务 ---
 * @param taskId 任务 id
 */
export function endTask(taskId: number): boolean {
    let task = tasks[taskId];
    if (!task) {
        return true;
    }
    // --- 移除窗体 list ---
    for (let fid in task.forms) {
        let form = task.forms[fid];
        let el = form.vue.$el;
        let title = form.vue.$children[0].title;
        form.vue.unmount(form.vue.$el.parentNode);
        el.remove();
        trigger('formRemoved', taskId, form.id, {'title': title});
    }
    // --- 移除 style ---
    clickgo.tool.removeStyle(taskId);
    // --- 移除 task ---
    delete(tasks[taskId]);
    // --- 触发 taskEnded 事件 ---
    trigger('taskEnded', taskId);
    return true;
}

/** --- 全局 cursor 设置的 style 标签 */
let globalCursorStyle: HTMLStyleElement;
/**
 * --- 设置全局鼠标样式 ---
 * @param type 样式或留空，留空代表取消
 */
export function setGlobalCursor(type?: string): void {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById('cg-global-cursor') as HTMLStyleElement;
    }
    if (type) {
        globalCursorStyle.innerHTML = `* {cursor: ${type} !important;}`;
    }
    else {
        globalCursorStyle.innerHTML = '';
    }
}
