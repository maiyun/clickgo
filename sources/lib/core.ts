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

let cgConfig: ICGCoreConfig = {
    'local': 'en-us',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
};
export let config: ICGCoreConfig = Vue.reactive({
    'local': 'en-us',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null
});

Vue.watch(config, function() {
    // --- 检测有没有缺少的 config key ---
    for (let key in cgConfig) {
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
    for (let key in config) {
        if (!Object.keys(cgConfig).includes(key)) {
            clickgo.form.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system config.\nKey: ' + key,
                'type': 'warning'
            });
            delete((config as any)[key]);
            continue;
        }
        if (key === 'task.pin') {
            // --- 如果是 pin，要检查老的和新的的 path 是否相等 ---
            let paths = Object.keys(config['task.pin']).sort().toString();
            let cgPaths = Object.keys(cgConfig['task.pin']).sort().toString();
            if (paths === cgPaths) {
                continue;
            }
            cgConfig['task.pin'] = {};
            for (let path in config['task.pin']) {
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

/** --- clickgo 已经加载的文件列表 --- */
export let clickgoFiles: Record<string, Blob | string> = {};

/** --- 全局响应事件 --- */
export let globalEvents: ICGGlobalEvents = {
    errorHandler: null,
    screenResizeHandler: function() {
        clickgo.form.refreshMaxPosition();
    },
    configChangedHandler: null,
    formCreatedHandler: null,
    formRemovedHandler: function(taskId: number, formId: number): void {
        if (!clickgo.form.simpletaskRoot.forms[formId]) {
            return;
        }
        delete(clickgo.form.simpletaskRoot.forms[formId]);
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
        if (clickgo.form.getTask().taskId > 0) {
            return;
        }
        if (state) {
            let item = clickgo.form.get(formId);
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
            delete(clickgo.form.simpletaskRoot.forms[formId]);
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
            globalEvents.errorHandler?.(taskId, formId, param1 as Error, param2) as void;
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1, param2) as void;
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResizeHandler?.() as void;
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.() as void;
                }
            }
            break;
        }
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            globalEvents.configChangedHandler?.(taskId as TCGCoreConfigName, formId) as void;
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId) as void;
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1, param2);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1, param2) as void;
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1) as void;
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId, param1);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId, param1) as void;
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId, formId) as void;
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (globalEvents as any)[name + 'Handler']?.(taskId, formId);
            for (let tid in clickgo.task.list) {
                let task = clickgo.task.list[tid];
                for (let fid in task.forms) {
                    task.forms[fid].events[name]?.(taskId) as void;
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
        let blob = await (await fetch(clickgo.cgRootPath + path.slice(1) + '?' + Math.random())).blob();
        let lio = path.lastIndexOf('.');
        let ext = lio === -1 ? '' : path.slice(lio + 1).toLowerCase();
        switch (ext) {
            case 'cgc': {
                // --- 控件文件 ---
                let pkg = await clickgo.control.read(blob);
                if (!pkg) {
                    return null;
                }
                clickgo.control.clickgoControlPkgs[path] = pkg;
                break;
            }
            case 'cgt': {
                // --- 主题文件 ---
                let theme = await clickgo.theme.read(blob);
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
    let iconLength = parseInt(await blob.slice(0, 7).text());
    let icon = await clickgo.tool.blob2DataUrl(blob.slice(7, 7 + iconLength));
    let zip = await clickgo.zip.get(blob.slice(7 + iconLength));
    if (!zip) {
        return false;
    }
    // --- 开始读取文件 ---
    let files: Record<string, Blob | string> = {};
    /** --- 配置文件 --- */
    let configContent = await zip.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    let config: ICGAppConfig = JSON.parse(configContent);
    for (let file of config.files) {
        let mime = clickgo.tool.getMimeByPath(file);
        if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
            let fab = await zip.getContent(file, 'string');
            if (!fab) {
                continue;
            }
            files[file] = fab;
        }
        else {
            let fab = await zip.getContent(file, 'arraybuffer');
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
        let lio = url.lastIndexOf('.');
        let ext = lio === -1 ? '' : url.slice(lio + 1).toLowerCase();
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
            let blob = await clickgo.tool.request(realUrl + '?' + Math.random(), {
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
                let blob = await (await fetch(realUrl + '?' + Math.random())).blob();
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
        config = await (await fetch(realUrl + 'config.json?' + Math.random())).json();
        let random = Math.random().toString();
        let lopt: any = {
            'dir': '/',
            'before': realUrl.slice(0, -1),
            'after': '?' + random
        };
        if (opt.notifyId) {
            let total = config.files.length;
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
