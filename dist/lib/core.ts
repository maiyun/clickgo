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

/** --- Config 原始参考对象 --- */
const configOrigin: types.IConfig = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': []
};

/** --- Config 配置对象 --- */
export const config: types.IConfig = clickgo.vue.reactive({
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': []
});

/** --- 用户在浏览器页面定义的全局数据 --- */
export const global: any = (window as any).clickgoGlobal ?? {};

/** --- App 抽象类 --- */
export abstract class AbstractApp {

    /** --- 当前 js 文件在包内的完整路径 --- */
    public get filename(): string {
        return '';
    }

    /** --- invoke 时系统会自动设置本项 --- */
    public get taskId(): number {
        return 0;
    }

    public set taskId(v: number) {
        form.notify({
            'title': 'Error',
            'content': `The software tries to modify the system variable "taskId" to "${v}".\nPath: ${this.filename}`,
            'type': 'danger'
        });
    }

    /** --- App 的入口文件 --- */
    public abstract main(data: Record<string, any>): Promise<void>;

    /**
     * --- 以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败 ---
     * @param form 窗体对象
     */
    public run(form: form.AbstractForm): void {
        form.show();
    }

    /** --- 全局错误事件 --- */
    public onError(taskId: number, formId: number, error: Error, info: string): void | Promise<void>;
    public onError(): void {
        return;
    }

    /** --- 屏幕大小改变事件 --- */
    public onScreenResize(): void | Promise<void>;
    public onScreenResize(): void {
        return;
    }

    /** --- 系统配置变更事件 --- */
    public onConfigChanged<T extends types.IConfig, TK extends keyof T>(n: TK, v: T[TK]): void | Promise<void>;
    public onConfigChanged(): void {
        return;
    }

    /** --- 窗体创建事件 --- */
    public onFormCreated(
        taskId: number, formId: number, title: string, icon: string, showInSystemTask: boolean
    ): void | Promise<void>;
    public onFormCreated(): void {
        return;
    }

    /** --- 窗体销毁事件 */
    public onFormRemoved(taskId: number, formId: number, title: string, icon: string): void | Promise<void>;
    public onFormRemoved(): void {
        return;
    }

    /** --- 窗体标题改变事件 */
    public onFormTitleChanged(taskId: number, formId: number, title: string): void | Promise<void>;
    public onFormTitleChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体图标改变事件 --- */
    public onFormIconChanged(taskId: number, formId: number, icon: string): void | Promise<void>;
    public onFormIconChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体最小化状态改变事件 --- */
    public onFormStateMinChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormStateMinChanged(): void {
        return;
    }

    /** --- 窗体最大化状态改变事件 --- */
    public onFormStateMaxChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormStateMaxChanged(): void {
        return;
    }

    /** --- 窗体显示状态改变事件 --- */
    public onFormShowChanged(taskId: number, formId: number, state: boolean): void | Promise<void>;
    public onFormShowChanged(): void {
        return;
    }

    /** --- 窗体获得焦点事件 --- */
    public onFormFocused(taskId: number, formId: number): void | Promise<void>;
    public onFormFocused(): void {
        return;
    }

    /** --- 窗体丢失焦点事件 --- */
    public onFormBlurred(taskId: number, formId: number): void | Promise<void>;
    public onFormBlurred(): void {
        return;
    }

    /** --- 窗体闪烁事件 --- */
    public onFormFlash(taskId: number, formId: number): void | Promise<void>;
    public onFormFlash(): void {
        return;
    }

    /** --- 窗体是否显示在任务栏属性改变事件 --- */
    public onFormShowInSystemTaskChange(taskId: number, formId: number, value: boolean): void | Promise<void>;
    public onFormShowInSystemTaskChange(): void {
        return;
    }

    /** --- 窗体的 formHash 改变事件 --- */
    public onFormHashChange(taskId: number, formId: number, value: string, data: Record<string, any>): void | Promise<void>;
    public onFormHashChange(): void {
        return;
    }

    /** --- 任务开始事件 --- */
    public onTaskStarted(taskId: number): void | Promise<void>;
    public onTaskStarted(): void | Promise<void> {
        return;
    }

    /** --- 任务结束事件 --- */
    public onTaskEnded(taskId: number): void | Promise<void>;
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

}

/** --- CDN 地址 --- */
export function getCdn(): string {
    return loader.cdn;
}

/** --- boot 类 --- */
export let boot: import('../index').AbstractBoot;

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
const modules: Record<string, {
    func: () => any | Promise<any>;
    'obj': null | any;
    'loading': boolean;
    'resolve': Array<() => void | Promise<void>>;
}> = {
    'monaco': {
        func: async function() {
            return new Promise(function(resolve, reject) {
                fetch(loader.cdn + '/npm/monaco-editor@0.45.0/min/vs/loader.js').then(function(r) {
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
        'loading': false,
        'resolve': []
    },
    'xterm': {
        func: async function() {
            await loader.loadScripts([
                loader.cdn + '/npm/xterm@5.3.0/lib/xterm.js',
                loader.cdn + '/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js',
                loader.cdn + '/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js'
            ]);
            if (!(window as any).Terminal) {
                throw Error('Xterm load failed.');
            }
            await loader.loadLinks([
                loader.cdn + '/npm/xterm@5.3.0/css/xterm.min.css'
            ]);
            loader.loadStyle('.xterm-viewport::-webkit-scrollbar{display:none;}');
            return [(window as any).Terminal, (window as any).FitAddon.FitAddon, (window as any).WebglAddon.WebglAddon];
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'echarts': {
        func: async function() {
            await loader.loadScript(loader.cdn + '/npm/echarts@5.4.2/dist/echarts.min.js');
            if (!(window as any).echarts) {
                throw Error('Xterm load failed.');
            }
            return (window as any).echarts;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    },
    'tuieditor': {
        func: async function() {
            await loader.loadScripts([
                __dirname + '/../ext/toastui-editor-all.min.js'
            ]);
            if (!(window as any).toastui.Editor) {
                throw Error('Tuieditor load failed.');
            }
            await loader.loadScripts([
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-cn.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-tw.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/ja-jp.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/ko-kr.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/es-es.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/de-de.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/fr-fr.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/pt-br.min.js',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/i18n/ru-ru.min.js'
            ]);
            await loader.loadLinks([
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css',
                loader.cdn + '/npm/@toast-ui/editor@3.2.2/dist/theme/toastui-editor-dark.css'
            ]);
            loader.loadStyle('.toastui-editor-defaultUI-toolbar,.ProseMirror{box-sizing:initial !important}.toastui-editor-main{background:var(--g-plain-background);border-radius:0 0 3px 3px}.ProseMirror{cursor:text}');
            return (window as any).toastui.Editor;
        },
        'obj': null,
        'loading': false,
        'resolve': []
    }
};

/**
 * --- 注册新的外接模块，App 模式下无效 ---
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
        'loading': false,
        'resolve': []
    };
    return true;
}

/**
 * --- 获取外接模块 ---
 * @param name 模块名
 */
export function getModule(name: string): Promise<null | any> {
    return new Promise((resolve) => {
        if (!modules[name]) {
            return null;
        }
        if (!modules[name].obj) {
            // --- obj 是 null 判断是否要初始化 ---
            if (modules[name].loading) {
                // --- 加载中，等待 ---
                modules[name].resolve.push(() => {
                    resolve(modules[name].obj);
                });
            }
            else {
                // --- 没加载，开始加载 ---
                const rtn = modules[name].func();
                if (rtn instanceof Promise) {
                    modules[name].loading = true;
                    rtn.then(function(obj) {
                        modules[name].obj = obj;
                        modules[name].loading = false;
                        resolve(obj);
                        for (const r of modules[name].resolve) {
                            r() as any;
                        }
                    }).catch(function() {
                        modules[name].loading = false;
                        resolve(null);
                        for (const r of modules[name].resolve) {
                            r() as any;
                        }
                    });
                }
                else {
                    modules[name].obj = rtn;
                    resolve(rtn);
                }
            }
            return;
        }
        resolve(modules[name].obj);
        return;
    });
}

/** --- 系统要处理的全局响应事件 --- */
const globalEvents = {
    screenResize: function(): void {
        form.refreshMaxPosition();
    },
    formRemoved: function(taskId: number, formId: number): void {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete form.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChanged: function(taskId: number, formId: number, title: string): void {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChanged: function(taskId: number, formId: number, icon: string): void {
        if (!form.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        form.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChanged: function(taskId: number, formId: number, state: boolean): void {
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
    }
};

/**
 * --- 主动触发系统级事件，App 中无效，用 this.trigger 替代 ---
 */
export function trigger(name: types.TGlobalEvent, taskId: number | string | boolean = 0, formId: number | string | boolean | Record<string, any> | null = 0, param1: boolean | Error | string = '', param2: string | Record<string, any> = '', param3: boolean = true): void {
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            if (typeof taskId !== 'number' || typeof formId !== 'number') {
                break;
            }
            (boot as any)?.[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResize();
            (boot as any)?.[eventName]();
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName]();
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.();
                }
            }
            break;
        }
        case 'configChanged': {
            if ((typeof taskId !== 'string') || (typeof formId === 'number')) {
                break;
            }
            (boot as any)?.[eventName]();
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            (globalEvents as any)[name]?.(taskId, formId, param1, param2, param3);
            (boot as any)?.[eventName](taskId, formId, param1, param2, param3);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId, param1, param2, param3);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2, param3);
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (globalEvents as any)[name]?.(taskId, formId, param1);
            (boot as any)?.[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            (globalEvents as any)[name]?.(taskId, formId, param1);
            (boot as any)?.[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            (globalEvents as any)[name]?.(taskId, formId);
            (boot as any)?.[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'formShowInSystemTaskChange': {
            (globalEvents as any)[name]?.(taskId, formId, param1);
            (boot as any)?.[eventName](taskId, formId, param1);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId, param1);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                }
            }
            break;
        }
        case 'formHashChange': {
            (globalEvents as any)[name]?.(taskId, formId, param1, param2);
            (boot as any)?.[eventName](taskId, formId, param1, param2);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId, param1, param2);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (globalEvents as any)[name]?.(taskId, formId);
            (boot as any)?.[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            if (typeof formId !== 'string') {
                break;
            }
            if (typeof taskId !== 'string') {
                taskId = taskId.toString();
            }
            (boot as any)?.[eventName](taskId, formId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'hashChanged': {
            if (typeof taskId !== 'string') {
                break;
            }
            (boot as any)?.[eventName](taskId);
            for (const tid in task.list) {
                const t = task.list[tid];
                (t.class as any)?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
    }
}

/**
 * --- cga blob 文件解包 ---
 * @param blob blob 对象
 */
export async function readApp(blob: Blob): Promise<false | types.IApp> {
    const head = await tool.blob2Text(blob.slice(0, 5));
    if (head !== '-CGA-') {
        return false;
    }
    const iconLength = parseInt(await blob.slice(21, 28).text());
    if (Number.isNaN(iconLength)) {
        return false;
    }
    const icon = iconLength ? await tool.blob2DataUrl(blob.slice(28, 28 + iconLength)) : '';
    const nb = new Blob([blob.slice(5, 21), blob.slice(28 + iconLength)], {
        'type': blob.type
    });
    const z = await zip.get(nb);
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
    // --- 读取包 ---
    const list = z.readDir('/', {
        'hasChildren': true
    });
    for (const file of list) {
        const mime = tool.getMimeByPath(file.name);
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
        'type': 'app',
        'config': config,
        'files': files,
        'icon': icon
    };
}

/**
 * --- 从网址下载应用，App 模式下本方法不可用 ---
 * @param url 对于当前网页的相对、绝对路径，以 / 结尾的目录或 .cga 结尾的文件 ---
 * @param opt,notifyId:显示进度条的 notify id,current:设置则以设置的为准，不以 / 结尾，否则以 location 为准 ---
 * @param taskId 所属任务 ID
 */
export async function fetchApp(
    url: string,
    opt: types.ICoreFetchAppOptions = {},
    taskId?: number
): Promise<null | types.IApp> {
    /** --- 若是 cga 文件，则是 cga 的文件名，含 .cga --- */
    let cga: string = '';
    if (!url.endsWith('/')) {
        const lio = url.lastIndexOf('/');
        cga = lio === -1 ? url : url.slice(lio + 1);
        if (!cga.endsWith('.cga')) {
            return null;
        }
    }
    // --- 非 taskId 模式下 current 以 location 为准 ---
    if (!taskId &&
        !url.startsWith('/clickgo/') &&
        !url.startsWith('/storage/') &&
        !url.startsWith('/mounted/') &&
        !url.startsWith('/package/') &&
        !url.startsWith('/current/') &&
        !url.startsWith('http:') &&
        !url.startsWith('https:') &&
        !url.startsWith('file:')
    ) {
        url = tool.urlResolve(window.location.href, url);
    }
    // --- 如果是 cga 文件，直接读取并交给 readApp 函数处理 ---
    if (cga) {
        try {
            const blob = await fs.getContent(url, {
                'progress': (loaded: number, total: number): void => {
                    if (opt.notifyId) {
                        form.notifyProgress(opt.notifyId, loaded / total);
                    }
                    if (opt.progress) {
                        opt.progress(loaded, total) as unknown;
                    }
                }
            }, taskId);
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
    // --- 从网络加载 app ---
    let config: types.IAppConfig;
    /** --- 已加载的 files --- */
    const files: Record<string, Blob | string> = {};
    try {
        const blob = await fs.getContent(url + 'config.json', undefined, taskId);
        if (blob === null || typeof blob === 'string') {
            return null;
        }
        config = JSON.parse(await tool.blob2Text(blob));
        await new Promise<void>(function(resolve) {
            if (!config.files) {
                return;
            }
            const total = config.files.length;
            let loaded = 0;
            if (opt.progress) {
                opt.progress(loaded + 1, total + 1) as unknown;
            }
            for (const file of config.files) {
                fs.getContent(url + file.slice(1), undefined, taskId).then(async function(blob) {
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
                    if (opt.notifyId) {
                        form.notifyProgress(opt.notifyId, loaded / total);
                    }
                    if (opt.progress) {
                        opt.progress(loaded + 1, total + 1) as unknown;
                    }
                    if (loaded < total) {
                        return;
                    }
                    resolve();
                }).catch(function() {
                    ++loaded;
                    if (opt.notifyId) {
                        form.notifyProgress(opt.notifyId, loaded / total);
                    }
                    if (opt.progress) {
                        opt.progress(loaded + 1, total + 1) as unknown;
                    }
                    if (loaded < total) {
                        return;
                    }
                    resolve();
                });
            }
        });
    }
    catch (e: any) {
        console.log('core.fetchApp', e);
        trigger('error', 0, 0, e, e.message);
        return null;
    }

    let icon = '';
    if (config.icon && (files[config.icon] instanceof Blob)) {
        icon = await tool.blob2DataUrl(files[config.icon] as Blob);
    }
    if (icon === '') {
        const iconBlob = await fs.getContent('/clickgo/icon.png', undefined, taskId);
        if (iconBlob instanceof Blob) {
            icon = await tool.blob2DataUrl(iconBlob);
        }
    }

    return {
        'type': 'app',
        'config': config,
        'files': files,
        'icon': icon
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
            'height': window.innerHeight - 46,
            'owidth': window.innerWidth,
            'oheight': window.innerHeight
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
            'height': height,
            'owidth': window.innerWidth,
            'oheight': window.innerHeight
        };
    }
}

/**
 * --- 修改浏览器 hash ---
 * @param hash 修改的值，不含 #
 * @param taskId 基任务，App 模式下无效
 */
export function hash(hash: string, taskId?: number): boolean {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    if (!t.runtime.permissions.includes('root') && !t.runtime.permissions.includes('hash')) {
        return false;
    }
    window.location.hash = hash;
    return true;
}

/**
 * --- 获取当前浏览器的 hash ---
 */
export function getHash(): string {
    return window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
}

/**
 * --- 获取当前浏览器的 host ---
 */
export function getHost(): string {
    const match = /https?:\/\/([-a-zA-Z0-9:.]+)/.exec(window.location.href);
    if (!match) {
        return '';
    }
    return match[1];
}

/**
 * --- 对浏览器做跳转操作 ---
 * @param url 要跳转的新 URL
 * @param taskId 基任务，App 模式下无效
 */
export function location(url: string, taskId?: number): boolean {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    if (!t.runtime.permissions.includes('root') && !t.runtime.permissions.includes('location')) {
        return false;
    }
    window.location.href = url;
    return true;
}

/**
 * --- 获取当前的浏览器的 url ---
 */
export function getLocation(): string {
    return window.location.href;
}

/**
 * --- 对浏览器做返回操作 ---
 * @param taskId 基任务，App 模式下无效
 */
export function back(taskId?: number): boolean {
    if (!taskId) {
        return false;
    }
    const t = task.list[taskId];
    if (!t) {
        return false;
    }
    if (!t.runtime.permissions.includes('root') && !t.runtime.permissions.includes('location')) {
        return false;
    }
    window.history.back();
    return true;
}

/**
 * --- 打开新的标签页
 * @param url 要访问的网址
 */
export function open(url: string): void {
    window.open(url);
}

window.addEventListener('hashchange', function() {
    trigger('hashChanged', window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '');
});
