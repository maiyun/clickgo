/**
 * Copyright 2022 Han Guoshuai <zohegs@gmail.com>

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
import * as clickgo from '../clickgo';
import * as fs from './fs';
import * as form from './form';
import * as task from './task';
import * as tool from './tool';
import * as zip from './zip';

const configOrigin: types.IConfig = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
};
export const config: types.IConfig = clickgo.vue.reactive({
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
});

export const cdn = '';

clickgo.vue.watch(config, function() {
    // --- 检测有没有缺少的 config key ---
    for (const key in configOrigin) {
        if ((config as any)[key] !== undefined) {
            continue;
        }
        form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
            'type': 'warning'
        });
        (config as any)[key] = (configOrigin as any)[key];
    }
    for (const key in config) {
        if (!Object.keys(configOrigin).includes(key)) {
            form.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system config.\nKey: ' + key,
                'type': 'warning'
            });
            delete (config as any)[key];
            continue;
        }
        if (key === 'task.pin') {
            // --- 如果是 pin，要检查老的和新的的 path 是否相等 ---
            const paths = Object.keys(config['task.pin']).sort().toString();
            const originPaths = Object.keys(configOrigin['task.pin']).sort().toString();
            if (paths === originPaths) {
                continue;
            }
            configOrigin['task.pin'] = {};
            for (const path in config['task.pin']) {
                configOrigin['task.pin'][path] = config['task.pin'][path];
            }
            trigger('configChanged', 'task.pin', config['task.pin']);
        }
        else {
            // --- 别的要判断值是否和比对组一样 ---
            if ((config as any)[key] === (configOrigin as any)[key]) {
                continue;
            }
            (configOrigin as any)[key] = (config as any)[key];
            if (key === 'task.position') {
                task.refreshSystemPosition();
            }
            trigger('configChanged', key, (config as any)[key]);
        }
    }
}, {
    'deep': true
});

/** --- module 列表 --- */
const modules: Record<string, { func: () => any | Promise<any>; 'obj': null | any; 'loading': boolean; }> = {
    'monaco': {
        func: async function() {
            return new Promise(function(resolve, reject) {
                fetch(loader.cdn + '/npm/monaco-editor@0.33.0/min/vs/loader.js').then(function(r) {
                    return r.blob();
                }).then(function(b) {
                    return tool.blob2DataUrl(b);
                }).then(function(d) {
                    resolve(d);
                }).catch(function(e) {
                    reject(e);
                });
            });
        },
        'obj': null,
        'loading': false
    }
};

/**
 * --- 注册新的外接模块 ---
 * @param name 模块名
 * @param func 执行加载函数
 */
export function regModule(name: string, func: () => any | Promise<any>): boolean {
    if (modules[name]) {
        return false;
    }
    modules[name] = {
        func: func,
        'obj': null,
        'loading': false
    };
    return true;
}

/**
 * --- 外接模块需要 init 后才能使用 ---
 * @param names 要加载的模块名
 */
export function initModules(names: string | string[]): Promise<number> {
    return new Promise(function(resolve) {
        if (typeof names === 'string') {
            names = [names];
        }
        if (names.length === 0) {
            resolve(0);
            return;
        }
        let loaded = 0;
        let successful = 0;
        for (const name of names) {
            if (!modules[name]) {
                ++loaded;
                if (loaded === names.length) {
                    resolve(successful);
                    return;
                }
                continue;
            }
            if (modules[name].obj) {
                ++loaded;
                ++successful;
                if (loaded === names.length) {
                    resolve(successful);
                    return;
                }
                continue;
            }
            if (modules[name].loading) {
                ++loaded;
                if (loaded === names.length) {
                    resolve(successful);
                    return;
                }
                continue;
            }
            // --- 正式开始加载 init ---
            modules[name].loading = true;
            const rtn = modules[name].func();
            if (rtn instanceof Promise) {
                rtn.then(function(obj) {
                    modules[name].obj = obj;
                    modules[name].loading = false;
                    ++loaded;
                    ++successful;
                    if (loaded === names.length) {
                        resolve(successful);
                        return;
                    }
                }).catch(function() {
                    modules[name].loading = false;
                    ++loaded;
                    if (loaded === names.length) {
                        resolve(successful);
                    }
                });
            }
            else {
                modules[name].obj = rtn;
                modules[name].loading = false;
                ++loaded;
                ++successful;
                if (loaded === names.length) {
                    resolve(successful);
                }
            }
        }
    });
}

/**
 * --- 获取外接模块 ---
 * @param name 模块名
 */
export function getModule(name: string): null | any {
    if (!modules[name]) {
        return null;
    }
    return modules[name].obj;
}

/** --- 全局响应事件 --- */
export const globalEvents: types.IGlobalEvents = {
    errorHandler: null,
    screenResizeHandler: function(): void {
        form.refreshMaxPosition();
    },
    configChangedHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: function(taskId: number, formId: number): void {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete form.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChangedHandler: function(taskId: number, formId: number, title: string): void {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChangedHandler: function(taskId: number, formId: number, icon: string): void {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChangedHandler: function(taskId: number, formId: number, state: boolean): void {
        if (task.systemTaskInfo.taskId > 0) {
            return;
        }
        if (state) {
            const item = form.get(formId);
            if (!item) {
                return;
            }
            form.simpleSystemTaskRoot.forms[formId] = {
                'title': item.title,
                'icon': item.icon
            };
        }
        else {
            if (!form.simpleSystemTaskRoot.forms[formId]) {
                return;
            }
            delete form.simpleSystemTaskRoot.forms[formId];
        }
    },
    formStateMaxChangedHandler: null,
    formShowChangedHandler: null,
    formFocusedHandler: null,
    formBlurredHandler: null,
    formFlashHandler: null,
    taskStartedHandler: null,
    taskEndedHandler: null
};

/**
 * --- 设置系统事件监听，一个窗体只能设置一个监听 ---
 * @param name 系统事件名
 * @param func 回调函数
 * @param formId 窗体 id，app 模式下留空为当前窗体
 * @param taskId 任务 id，app 模式下无效
 */
export function setSystemEventListener(
    name: types.TGlobalEvent,
    func: (...any: any) => void | Promise<void>,
    formId?: number,
    taskId?: number
): void {
    if (!taskId) {
        return;
    }
    const t = task.list[taskId];
    if (!t) {
        return;
    }
    if (!formId) {
        return;
    }
    const f = t.forms[formId];
    if (!f) {
        return;
    }
    f.events[name] = func;
}

/**
 * --- 移除系统事件监听，一个窗体只能设置一个监听 ---
 * @param name name 系统事件名
 * @param formId 窗体 id，app 默认为当前窗体
 * @param taskId 任务 id，app 模式下无效
 */
export function removeSystemEventListener(
    name: types.TGlobalEvent,
    formId?: number,
    taskId?: number
): void {
    if (!taskId) {
        return;
    }
    const t = task.list[taskId];
    if (!t) {
        return;
    }
    if (!formId) {
        return;
    }
    const f = t.forms[formId];
    if (!f) {
        return;
    }
    delete f.events[name];
}

/**
 * --- 主动触发系统级事件 ---
 */
export function trigger(name: types.TGlobalEvent, taskId: number | string = 0, formId: number | string | boolean | Record<string, any> | null = 0, param1: boolean | Error | string = '', param2: string = ''): void {
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
            const r = globalEvents.errorHandler?.(taskId, formId, param1 as Error, param2);
            if (r && (r instanceof Promise))  {
                r.catch(function(e) {
                    console.log(e);
                });
            }
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId, formId, param1, param2);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'screenResize': {
            const r = globalEvents.screenResizeHandler?.();
            if (r && (r instanceof Promise))  {
                r.catch(function(e) {
                    console.log(e);
                });
            }
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.();
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            const r = globalEvents.configChangedHandler?.(taskId as types.TConfigName, formId);
            if (r && (r instanceof Promise))  {
                r.catch(function(e) {
                    console.log(e);
                });
            }
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId, formId);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId, formId, param1, param2);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId, formId, param1);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId, formId, param1);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId, formId);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                for (const fid in t.forms) {
                    const r = t.forms[fid].events[name]?.(taskId);
                    if (r instanceof Promise)  {
                        r.catch(function(e) {
                            console.log(e);
                        });
                    }
                }
            }
            break;
        }
    }
}

/**
 * --- cga 文件 blob 转 IApp 对象 ---
 * @param blob blob 对象
 */
export async function readApp(blob: Blob): Promise<false | types.IApp> {
    const iconLength = parseInt(await blob.slice(0, 7).text());
    const icon = await tool.blob2DataUrl(blob.slice(7, 7 + iconLength));
    const z = await zip.get(blob.slice(7 + iconLength));
    if (!z) {
        return false;
    }
    // --- 开始读取文件 ---
    const files: Record<string, Blob | string> = {};
    /** --- 配置文件 --- */
    const configContent = await z.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    const config: types.IAppConfig = JSON.parse(configContent);
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
    if (!config) {
        return false;
    }
    return {
        'type': 'app',
        'icon': icon,
        'config': config,
        'files': files
    };
}

/**
 * --- 从网址下载应用，App 模式下本方法不可用 ---
 * @param url 对于当前网页的相对、绝对路径，以 / 结尾的目录或 .cga 结尾的文件 ---
 * @param opt,notifyId:显示进度条的 notify id,current:设置则以设置的为准，以 / 结尾，否则以 location 为准 ---
 */
export async function fetchApp(url: string, opt: types.ICoreFetchAppOptions = {}): Promise<null | types.IApp> {
    /** --- 若是 cga 文件，则是 cga 的文件名，含 .cga --- */
    let cga: string = '';
    if (!url.endsWith('/')) {
        const lio = url.lastIndexOf('/');
        cga = lio === -1 ? url : url.slice(lio + 1);
        if (!cga.endsWith('.cga')) {
            return null;
        }
    }

    let current = '';
    if (opt.current) {
        if (!opt.current.endsWith('/')) {
            return null;
        }
        if (!url.startsWith('/')) {
            url = '/current/' + url;
        }
    }
    else {
        if (!url.startsWith('/clickgo/') && !url.startsWith('/storage/') && !url.startsWith('/mounted/')) {
            current = tool.urlResolve(window.location.href, url);
            if (cga) {
                current = current.slice(0, -cga.length);
                url = '/current/' + cga;
            }
            else {
                url = '/current/';
            }
        }
    }

    // --- 如果是 cga 文件，直接读取并交给 readApp 函数处理 ---
    if (cga) {
        try {
            const blob = await fs.getContent(url, {
                'current': current,
                'progress': (loaded: number, total: number): void => {
                    if (opt.notifyId) {
                        form.notifyProgress(opt.notifyId, loaded / total);
                    }
                    if (opt.progress) {
                        opt.progress(loaded, total) as unknown;
                    }
                }
            });
            if ((blob === null) || typeof blob === 'string') {
                return null;
            }
            if (opt.notifyId) {
                form.notifyProgress(opt.notifyId, 1);
            }
            return await readApp(blob) || null;
        }
        catch {
            return null;
        }
    }
    // --- 加载目录 ---
    // --- 加载 json 文件，并创建 control 信息对象 ---
    let config: types.IAppConfig;
    // --- 已加载的 files ---
    const files: Record<string, Blob | string> = {};
    try {
        const blob = await fs.getContent(url + 'config.json', {
            'current': current
        });
        if (blob === null || typeof blob === 'string') {
            return null;
        }
        config = JSON.parse(await tool.blob2Text(blob));
        await new Promise<void>(function(resolve) {
            const total = config.files.length;
            let loaded = 0;
            for (const file of config.files) {
                fs.getContent(url + file.slice(1), {
                    'current': current
                }).then(async function(blob) {
                    if (blob === null || typeof blob === 'string') {
                        clickgo.form.notify({
                            'title': 'File not found',
                            'content': url + file.slice(1),
                            'type': 'danger'
                        });
                        return;
                    }
                    const mime = tool.getMimeByPath(file);
                    if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                        files[file] = (await tool.blob2Text(blob)).replace(/^\ufeff/, '');
                    }
                    else {
                        files[file] = blob;
                    }
                    ++loaded;
                    opt.progress?.(loaded, total) as unknown;
                    if (opt.notifyId) {
                        form.notifyProgress(opt.notifyId, loaded / total);
                    }
                    if (loaded < total) {
                        return;
                    }
                    resolve();
                }).catch(function() {
                    ++loaded;
                    opt.progress?.(loaded, total) as unknown;
                    if (opt.notifyId) {
                        form.notifyProgress(opt.notifyId, loaded / total);
                    }
                    if (loaded < total) {
                        return;
                    }
                    resolve();
                });
            }
        });
    }
    catch {
        return null;
    }
    let icon = '/clickgo/icon.png';
    if (config.icon && (files[config.icon] instanceof Blob)) {
        icon = await tool.blob2DataUrl(files[config.icon] as Blob);
    }
    return {
        'type': 'app',
        'icon': icon,
        'config': config,
        'files': files
    };
}

/**
 * --- 获取屏幕可用区域 ---
 */
export function getAvailArea(): types.IAvailArea {
    if (Object.keys(form.simpleSystemTaskRoot.forms).length > 0) {
        return {
            'left': 0,
            'top': 0,
            'width': window.innerWidth,
            'height': window.innerHeight - 46
        };
    }
    else {
        let left: number = 0;
        let top: number = 0;
        let width: number = 0;
        let height: number = 0;
        switch (config['task.position']) {
            case 'left': {
                left = task.systemTaskInfo.length;
                top = 0;
                width = window.innerWidth - task.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'right': {
                left = 0;
                top = 0;
                width = window.innerWidth - task.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'top': {
                left = 0;
                top = task.systemTaskInfo.length;
                width = window.innerWidth;
                height = window.innerHeight - task.systemTaskInfo.length;
                break;
            }
            case 'bottom': {
                left = 0;
                top = 0;
                width = window.innerWidth;
                height = window.innerHeight - task.systemTaskInfo.length;
            }
        }
        return {
            'left': left,
            'top': top,
            'width': width,
            'height': height
        };
    }
}
