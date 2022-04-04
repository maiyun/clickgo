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

/**
 * /clickgo/, /runtime/, /storage/, /mounted/
 */

const cgConfig: ICGCoreConfig = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
};
export const config: ICGCoreConfig = Vue.reactive({
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
});

Vue.watch(config, function() {
    // --- 检测有没有缺少的 config key ---
    for (const key in cgConfig) {
        if ((config as any)[key] !== undefined) {
            continue;
        }
        clickgo.form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
            'type': 'warning'
        });
        (config as any)[key] = (cgConfig as any)[key];
    }
    for (const key in config) {
        if (!Object.keys(cgConfig).includes(key)) {
            clickgo.form.notify({
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
            const cgPaths = Object.keys(cgConfig['task.pin']).sort().toString();
            if (paths === cgPaths) {
                continue;
            }
            cgConfig['task.pin'] = {};
            for (const path in config['task.pin']) {
                cgConfig['task.pin'][path] = config['task.pin'][path];
            }
            trigger('configChanged', 'task.pin', config['task.pin']);
        }
        else {
            if ((config as any)[key] === (cgConfig as any)[key]) {
                continue;
            }
            (cgConfig as any)[key] = (config as any)[key];
            if (key === 'task.position') {
                clickgo.form.refreshTaskPosition();
            }
            trigger('configChanged', key, (config as any)[key]);
        }
    }
}, {
    'deep': true
});

// --- Native start ---

let sendNativeId = 0;
// --- sendNativeList 一定会被清理 ---
let sendNativeList: Array<{
    'id': number;
    'name': string;
    'param': string | undefined;
}> = [];

/** --- 监听的 listener，需要调用者手动清理 --- */
const nativeListeners: Record<string, Array<{
    'id': number;
    'once': boolean;
    'handler': (param?: string) => void | Promise<void>;
}>> = {};

export function getNativeListeners(): Array<{ 'id': number; 'name': string; 'once': boolean; }> {
    const list = [];
    for (const name in nativeListeners) {
        for (const item of nativeListeners[name]) {
            list.push({
                'id': item.id,
                'name': name,
                'once': item.once
            });
        }
    }
    return list;
}

export function sendNative(name: string, param?: string, handler?: (param?: string) => void | Promise<void>): number {
    if (!clickgo.native) {
        return 0;
    }
    const id = ++sendNativeId;
    sendNativeList.push({
        'id': id,
        'name': name,
        'param': param
    });
    if (handler) {
        onNative(name, handler, id, true);
    }
    return id;
}

export function onNative(
    name: string,
    handler: (param?: string) => void | Promise<void>,
    id?: number,
    once: boolean = false
): void {
    if (!clickgo.native) {
        return;
    }
    if (!nativeListeners[name]) {
        nativeListeners[name] = [];
    }
    nativeListeners[name].push({
        'id': id ?? 0,
        'once': once,
        'handler': handler
    });
}
export function onceNative(name: string, handler: (param?: string) => void | Promise<void>, id?: number): void {
    onNative(name, handler, id, true);
}
export function offNative(name: string, handler: (param?: string) => void | Promise<void>): void {
    if (!nativeListeners[name]) {
        return;
    }
    for (let i = 0; i < nativeListeners[name].length; ++i) {
        if (nativeListeners[name][i].handler !== handler) {
            continue;
        }
        nativeListeners[name].splice(i, 1);
        if (nativeListeners[name].length === 0) {
            delete nativeListeners[name];
            break;
        }
        --i;
    }
}

// --- 将 send 值全部提交给 native ---
export function cgInnerNativeGetSends(): string {
    const json = JSON.stringify(sendNativeList);
    sendNativeList = [];
    return json;
}

// --- 供 node 调用的回调数据（执行结果） ---
export function cgInnerNativeReceive(id: number, name: string, result?: string): void {
    console.log('name', name, 'nativeListeners', nativeListeners, 'sendNativeList', sendNativeList);
    if (!nativeListeners[name]) {
        return;
    }
    for (let i = 0; i < nativeListeners[name].length; ++i) {
        const item = nativeListeners[name][i];
        if (item.id > 0) {
            if (item.id !== id) {
                continue;
            }
            const r = item.handler(result);
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        }
        else {
            const r = item.handler(result);
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log(e);
                });
            }
        }
        if (item.once) {
            nativeListeners[name].splice(i, 1);
            --i;
        }
    }
}

// --- Native end ---

/** --- module 列表 --- */
const modules: Record<string, { func: () => any | Promise<any>; 'obj': null | any; 'loading': boolean; }> = {
    'monaco': {
        func: async function() {
            return new Promise(function(resolve, reject) {
                loader.loadScript(clickgo.cdnPath + '/npm/monaco-editor@0.29.1/min/vs/loader.js').then(function() {
                    (window.require as any).config({
                        paths: {
                            'vs': clickgo.cdnPath + '/npm/monaco-editor@0.29.1/min/vs'
                        }
                    });
                    // --- 初始化 Monaco ---
                    const proxy = URL.createObjectURL(new Blob([`
                        self.MonacoEnvironment = {
                            baseUrl: '${clickgo.cdnPath}/npm/monaco-editor@0.29.1/min/'
                        };
                        importScripts('${clickgo.cdnPath}/npm/monaco-editor@0.29.1/min/vs/base/worker/workerMain.js');
                    `], { type: 'text/javascript' }));
                    (window as any).MonacoEnvironment = {
                        getWorkerUrl: () => proxy
                    };
                    // --- 加载 ---
                    (window.require as any)(['vs/editor/editor.main'], function(monaco: any) {
                        resolve(monaco);
                    });
                }).catch(function(e) {
                    reject(e);
                });
            });
        },
        'obj': null,
        'loading': false
    }
};

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

export function getModule(name: string): null | any {
    if (!modules[name]) {
        return null;
    }
    return modules[name].obj;
}

/** --- clickgo 已经加载的文件列表 --- */
export const clickgoFiles: Record<string, Blob | string> = {};

/** --- 全局响应事件 --- */
export const globalEvents: ICGGlobalEvents = {
    errorHandler: null,
    screenResizeHandler: function(): void {
        clickgo.form.refreshMaxPosition();
    },
    configChangedHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: function(taskId: number, formId: number): void {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        delete clickgo.form.simpletaskRoot.forms[formId];
    },
    formTitleChangedHandler: function(taskId: number, formId: number, title: string): void {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        clickgo.form.simpletaskRoot.forms[formId].title = title;
    },
    formIconChangedHandler: function(taskId: number, formId: number, icon: string): void {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        clickgo.form.simpletaskRoot.forms[formId].icon = icon;
    },
    formStateMinChangedHandler: function(taskId: number, formId: number, state: boolean): void {
        if (clickgo.form.taskInfo.taskId > 0) {
            return;
        }
        if (state) {
            const item = clickgo.form.get(formId);
            if (!item) {
                return;
            }
            clickgo.form.simpletaskRoot.forms[formId] = {
                'title': item.title,
                'icon': item.icon
            };
        }
        else {
            if (!clickgo.form.simpletaskRoot.forms[formId]) {
                return;
            }
            delete clickgo.form.simpletaskRoot.forms[formId];
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
 * --- 主动触发系统级事件 ---
 */
export function trigger(name: TCGGlobalEvent, taskId: number | string = 0, formId: number | string | boolean | Record<string, any> | null = 0, param1: boolean | Error | string = '', param2: string = ''): void {
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId, formId, param1, param2);
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.();
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
            const r = globalEvents.configChangedHandler?.(taskId as TCGCoreConfigName, formId);
            if (r && (r instanceof Promise))  {
                r.catch(function(e) {
                    console.log(e);
                });
            }
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId, formId);
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId, formId, param1, param2);
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId, formId, param1);
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId, formId, param1);
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId, formId);
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
            for (const tid in clickgo.task.list) {
                const task = clickgo.task.list[tid];
                for (const fid in task.forms) {
                    const r = task.forms[fid].events[name]?.(taskId);
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
 * --- 从 cg 目录加载文件（若是已经加载的文件不会再次加载） ---
 * @param path clickgo 文件路径
 */
export async function fetchClickGoFile(path: string): Promise<Blob | string | null> {
    // --- 判断是否加载过 ---
    if (clickgoFiles[path]) {
        return clickgoFiles[path];
    }
    // --- 加载 clickgo 文件 ---
    try {
        const blob = await (await fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random().toString())).blob();
        const lio = path.lastIndexOf('.');
        const ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
        switch (ext) {
            case 'cgc': {
                // --- 控件文件 ---
                const pkg = await clickgo.control.read(blob);
                if (!pkg) {
                    return null;
                }
                clickgo.control.clickgoControlPkgs[path] = pkg;
                break;
            }
            case 'cgt': {
                // --- 主题文件 ---
                const theme = await clickgo.theme.read(blob);
                if (!theme) {
                    return null;
                }
                clickgo.theme.clickgoThemePkgs[path] = theme;
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
 * --- cga 文件 blob 转 IAppPkg 对象 ---
 * @param blob blob 对象
 */
export async function readApp(blob: Blob): Promise<false | ICGAppPkg> {
    const iconLength = parseInt(await blob.slice(0, 7).text());
    const icon = await clickgo.tool.blob2DataUrl(blob.slice(7, 7 + iconLength));
    const zip = await clickgo.zip.get(blob.slice(7 + iconLength));
    if (!zip) {
        return false;
    }
    // --- 开始读取文件 ---
    const files: Record<string, Blob | string> = {};
    /** --- 配置文件 --- */
    const configContent = await zip.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    const config: ICGAppConfig = JSON.parse(configContent);
    for (const file of config.files) {
        const mime = clickgo.tool.getMimeByPath(file);
        if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
            const fab = await zip.getContent(file, 'string');
            if (!fab) {
                continue;
            }
            files[file] = fab.replace(/^\ufeff/, '');
        }
        else {
            const fab = await zip.getContent(file, 'arraybuffer');
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
 * --- 从网址下载应用 ---
 * @param url 相对、绝对或 cg 路径，以 / 结尾的目录 ---
 */
export async function fetchApp(url: string, opt: ICGCoreFetchAppOptions = {}): Promise<null | ICGAppPkg> {
    // --- 判断是通过目录加载，还是 cga 文件 ---
    let isCga: boolean = false;
    if (!url.endsWith('/')) {
        const lio = url.lastIndexOf('.');
        const ext = lio === -1 ? '' : url.slice(lio + 1).toLowerCase();
        if (ext !== 'cga') {
            return null;
        }
        isCga = true;
    }

    // --- 获取绝对路径 ---
    let realUrl: string;
    if (url.startsWith('/clickgo/')) {
        realUrl = clickgo.tool.urlResolve(clickgo.cgRootPath, url.slice(9));
    }
    else {
        realUrl = clickgo.tool.urlResolve(clickgo.rootPath, url);
    }

    // --- 如果是 cga 文件，直接下载并交给 readApp 函数处理 ---
    if (isCga) {
        if (opt.notifyId) {
            const blob = await clickgo.tool.request(realUrl + '?' + Math.random().toString(), {
                progress: (loaded, total): void => {
                    clickgo.form.notifyProgress(opt.notifyId!, loaded / total);
                }
            });
            if (blob === null) {
                return null;
            }
            clickgo.form.notifyProgress(opt.notifyId, 1);
            return await readApp(blob) || null;
        }
        else {
            try {
                const blob = await (await fetch(realUrl + '?' + Math.random().toString())).blob();
                return await readApp(blob) || null;
            }
            catch {
                return null;
            }
        }
    }
    // --- 加载目录 ---
    // --- 加载 json 文件，并创建 control 信息对象 ---
    let config: ICGAppConfig;
    // --- 已加载的 files ---
    let files: Record<string, Blob | string> = {};
    try {
        config = await (await fetch(realUrl + 'config.json?' + Math.random().toString())).json();
        const random = Math.random().toString();
        const lopt: any = {
            'dir': '/',
            'before': realUrl.slice(0, -1),
            'after': '?' + random
        };
        if (opt.notifyId) {
            const total = config.files.length;
            let loaded = 0;
            lopt.loaded = function(): void {
                ++loaded;
                clickgo.form.notifyProgress(opt.notifyId!, loaded / total);
            };
        }
        files = await loader.fetchFiles(config.files, lopt);
    }
    catch {
        return null;
    }
    let icon = clickgo.cgRootPath + 'icon.png';
    if (config.icon && (files[config.icon] instanceof Blob)) {
        icon = await clickgo.tool.blob2DataUrl(files[config.icon] as Blob);
    }
    return {
        'type': 'app',
        'icon': icon,
        'config': config,
        'files': files
    };
}
