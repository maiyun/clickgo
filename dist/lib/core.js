/**
 * Copyright 2007-2025 MAIYUN.NET

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
import * as clickgo from '../clickgo';
import * as lFs from './fs';
import * as lForm from './form';
import * as lTask from './task';
import * as lTool from './tool';
import * as lZip from './zip';
/** --- 系统级 ID --- */
let sysId = '';
/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id) {
    if (sysId) {
        return;
    }
    sysId = id;
}
/** --- Config 原始参考对象 --- */
const configOrigin = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': [],
};
/** --- Config 配置对象 --- */
export let config;
/** --- App 抽象类 --- */
export class AbstractApp {
    constructor() {
        /** --- 当前 js 文件在包内的完整路径 --- */
        this.filename = '';
        /** --- 系统会自动设置本项 --- */
        this.taskId = '';
    }
    /**
     * --- 以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败 ---
     * @param form 窗体对象
     */
    async run(form) {
        await form.show();
    }
    onError() {
        return;
    }
    onScreenResize() {
        return;
    }
    onConfigChanged() {
        return;
    }
    onFormCreated() {
        return;
    }
    onFormRemoved() {
        return;
    }
    onFormTitleChanged() {
        return;
    }
    onFormIconChanged() {
        return;
    }
    onFormStateMinChanged() {
        return;
    }
    onFormStateMaxChanged() {
        return;
    }
    onFormShowChanged() {
        return;
    }
    onFormFocused() {
        return;
    }
    onFormBlurred() {
        return;
    }
    onFormFlash() {
        return;
    }
    onFormShowInSystemTaskChange() {
        return;
    }
    onFormHashChange() {
        return;
    }
    onTaskStarted() {
        return;
    }
    onTaskEnded() {
        return;
    }
    onLauncherFolderNameChanged() {
        return;
    }
    onHashChanged() {
        return;
    }
    onKeydown() {
        return;
    }
    onKeyup() {
        return;
    }
}
/** --- boot 类 --- */
let boot;
export function setBoot(b) {
    if (boot) {
        return;
    }
    b.setSysId(sysId);
    boot = b;
}
/** --- 系统要处理的全局响应事件 --- */
const globalEvents = {
    screenResize: function () {
        lForm.refreshMaxPosition();
    },
    formRemoved: function (taskId, formId) {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete lForm.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChanged: function (taskId, formId, title) {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        lForm.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChanged: function (taskId, formId, icon) {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        lForm.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChanged: function (taskId, formId, state) {
        if (lTask.systemTaskInfo.taskId) {
            return;
        }
        if (state) {
            const item = lForm.get(formId);
            if (!item) {
                return;
            }
            lForm.simpleSystemTaskRoot.forms[formId] = {
                'title': item.title,
                'icon': item.icon
            };
        }
        else {
            if (!lForm.simpleSystemTaskRoot.forms[formId]) {
                return;
            }
            delete lForm.simpleSystemTaskRoot.forms[formId];
        }
    }
};
/**
 * --- 主动触发系统级事件，用 this.trigger 替代 ---
 */
export async function trigger(name, taskId = '', formId = '', param1 = '', param2 = '', param3 = true) {
    const taskList = await lTask.getOriginList(sysId);
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            boot?.[eventName](taskId, formId, param1, param2);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if (!taskId || (taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1, param2);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                    }
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResize();
            boot?.[eventName]();
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName]();
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.();
                }
            }
            break;
        }
        case 'configChanged': {
            boot?.[eventName]();
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'formCreated':
        case 'formRemoved': {
            globalEvents[name]?.(taskId, formId, param1, param2, param3);
            boot?.[eventName](taskId, formId, param1, param2, param3);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1, param2, param3);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2, param3);
                    }
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            globalEvents[name]?.(taskId, formId, param1);
            boot?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formStateMinChanged':
        case 'formStateMaxChanged':
        case 'formShowChanged': {
            globalEvents[name]?.(taskId, formId, param1);
            boot?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formFocused':
        case 'formBlurred':
        case 'formFlash': {
            globalEvents[name]?.(taskId, formId);
            boot?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId);
                    }
                }
            }
            break;
        }
        case 'formShowInSystemTaskChange': {
            globalEvents[name]?.(taskId, formId, param1);
            boot?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formHashChange': {
            globalEvents[name]?.(taskId, formId, param1, param2);
            boot?.[eventName](taskId, formId, param1, param2);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId, formId, param1, param2);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                    }
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            globalEvents[name]?.(taskId, formId);
            boot?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    t.class?.[eventName](taskId);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId);
                    }
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            boot?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'hashChanged': {
            boot?.[eventName](taskId);
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
        case 'keydown':
        case 'keyup': {
            globalEvents[name]?.(taskId);
            boot?.[eventName](taskId);
            for (const tid in taskList) {
                const t = taskList[tid];
                t.class?.[eventName](taskId);
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
export async function readApp(blob) {
    const head = await lTool.blob2Text(blob.slice(0, 5));
    if (head !== '-CGA-') {
        return false;
    }
    const iconLength = parseInt(await blob.slice(21, 28).text());
    if (Number.isNaN(iconLength)) {
        return false;
    }
    const icon = iconLength ? await lTool.blob2DataUrl(blob.slice(28, 28 + iconLength)) : '';
    const nb = new Blob([blob.slice(5, 21), blob.slice(28 + iconLength)], {
        'type': blob.type
    });
    const z = await lZip.get(nb);
    if (!z) {
        return false;
    }
    // --- 开始读取文件 ---
    const files = {};
    /** --- 配置文件 --- */
    const configContent = await z.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    const config = JSON.parse(configContent);
    // --- 读取包 ---
    const list = z.readDir('/', {
        'hasChildren': true,
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
        'type': 'app',
        'config': config,
        'files': files,
        'icon': icon
    };
}
/**
 * --- 从网址下载应用 ---
 * @param url 对于当前网页的相对、绝对路径，以 .cga 结尾的文件 ---
 * @param opt,notifyId:显示进度条的 notify id,current:设置则以设置的为准，不以 / 结尾，否则以 location 为准 ---
 * @param taskId 所属任务 ID
 */
export async function fetchApp(taskId, url, opt = {}) {
    /** --- notify 配置项 --- */
    const notify = opt.notify ?
        (typeof opt.notify === 'number' ?
            {
                'id': opt.notify,
                'loaded': 0,
                'total': 0,
            } :
            opt.notify) :
        {
            'id': undefined,
            'loaded': 0,
            'total': 0,
        };
    const notifyId = notify.id;
    const notifyLoaded = notify.loaded ?? 0;
    const notifyTotal = notify.total ?? 0;
    if (!url.endsWith('.cga')) {
        return null;
    }
    if (!url.startsWith('/clickgo/') &&
        !url.startsWith('/storage/') &&
        !url.startsWith('/mounted/') &&
        !url.startsWith('/package/') &&
        !url.startsWith('/current/') &&
        !url.startsWith('http:') &&
        !url.startsWith('https:') &&
        !url.startsWith('file:')) {
        url = lTool.urlResolve(window.location.href, url);
    }
    try {
        const blob = await lFs.getContent(taskId, url, {
            progress: (loaded, total) => {
                let per = loaded / total;
                per = notifyTotal ?
                    Math.min((notifyLoaded / notifyTotal) + (1 / notifyTotal * per), 1) :
                    per;
                if (notifyId) {
                    lForm.notifyProgress(notifyId, per);
                }
                if (opt.progress) {
                    opt.progress(loaded, total, per);
                }
            },
            'after': opt.after,
        });
        if ((blob === null) || typeof blob === 'string') {
            return null;
        }
        if (notifyId) {
            lForm.notifyProgress(notifyId, notifyTotal ? ((notifyLoaded + 1) / notifyTotal) : 1);
        }
        return await readApp(blob) || null;
    }
    catch {
        return null;
    }
}
/**
 * --- 获取屏幕可用区域 ---
 */
export function getAvailArea() {
    if (Object.keys(lForm.simpleSystemTaskRoot.forms).length > 0) {
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
        let left = 0;
        let top = 0;
        let width = 0;
        let height = 0;
        switch (config['task.position']) {
            case 'left': {
                left = lTask.systemTaskInfo.length;
                top = 0;
                width = window.innerWidth - lTask.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'right': {
                left = 0;
                top = 0;
                width = window.innerWidth - lTask.systemTaskInfo.length;
                height = window.innerHeight;
                break;
            }
            case 'top': {
                left = 0;
                top = lTask.systemTaskInfo.length;
                width = window.innerWidth;
                height = window.innerHeight - lTask.systemTaskInfo.length;
                break;
            }
            case 'bottom': {
                left = 0;
                top = 0;
                width = window.innerWidth;
                height = window.innerHeight - lTask.systemTaskInfo.length;
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
 * @param taskId 当前任务 id
 * @param hash 修改的值，不含 #
 */
export async function hash(current, hash) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const p = await lTask.checkPermission(current, 'hash');
    if (!p[0]) {
        return false;
    }
    window.location.hash = hash;
    return true;
}
/**
 * --- 获取当前浏览器的 hash ---
 */
export function getHash() {
    return window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
}
/**
 * --- 获取当前浏览器的 host ---
 */
export function getHost() {
    const match = /https?:\/\/([-a-zA-Z0-9:.]+)/.exec(window.location.href);
    if (!match) {
        return '';
    }
    return match[1];
}
/**
 * --- 对浏览器做跳转操作 ---
 * @param current 当前任务 id
 * @param url 要跳转的新 URL
 */
export async function location(current, url) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const p = await lTask.checkPermission(current, 'location');
    if (!p[0]) {
        return false;
    }
    window.location.href = url;
    return true;
}
/**
 * --- 获取当前的浏览器的 url ---
 */
export function getLocation() {
    return window.location.href;
}
/**
 * --- 对浏览器做返回操作 ---
 * @param current 当前任务 id
 */
export async function back(current) {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    const p = await lTask.checkPermission(current, 'location');
    if (!p[0]) {
        return false;
    }
    window.history.back();
    return true;
}
/**
 * --- 打开新的标签页
 * @param url 要访问的网址
 */
export function open(url) {
    window.open(url);
}
window.addEventListener('hashchange', function () {
    trigger('hashChanged', window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '').catch(() => { });
});
/** --- 注册的模块列表 --- */
const modules = {
    'monaco-editor': {
        func: async function () {
            return new Promise(resolve => {
                fetch(clickgo.getCdn() + '/npm/monaco-editor@0.52.2/min/vs/loader.js')
                    .then(r => r.blob())
                    .then(b => lTool.blob2DataUrl(b))
                    .then(d => {
                    resolve(d);
                })
                    .catch(() => {
                    resolve(null);
                });
            });
        },
        'loading': false,
        'resolve': [],
    },
    'xterm': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/xterm@5.3.0/lib/xterm.js`,
                `${clickgo.getCdn()}/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js`,
                `${clickgo.getCdn()}/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js`
            ]);
            if (!window.Terminal) {
                throw Error('Xterm load failed.');
            }
            await lTool.loadLinks([
                `${clickgo.getCdn()}/npm/xterm@5.3.0/css/xterm.min.css`
            ]);
            lTool.loadStyle('.xterm-viewport::-webkit-scrollbar{display:none;}');
            return {
                'Terminal': window.Terminal,
                'FitAddon': window.FitAddon.FitAddon,
                'WebglAddon': window.WebglAddon.WebglAddon,
            };
        },
        'loading': false,
        'resolve': [],
    },
    'echarts': {
        func: async function () {
            await lTool.loadScript(`${clickgo.getCdn()}/npm/echarts@5.4.2/dist/echarts.min.js`);
            if (!window.echarts) {
                throw Error('Echarts load failed.');
            }
            return window.echarts;
        },
        'loading': false,
        'resolve': [],
    },
    '@toast-ui/editor': {
        func: async function () {
            await lTool.loadScripts([
                lTool.urlResolve(clickgo.getDirname() + '/', './ext/toastui-editor-all.min.js'),
            ]);
            if (!window.toastui.Editor) {
                throw Error('Tuieditor load failed.');
            }
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-cn.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/zh-tw.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/ja-jp.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/ko-kr.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/es-es.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/de-de.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/fr-fr.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/pt-br.min.js`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/ru-ru.min.js`,
            ]);
            await lTool.loadLinks([
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/theme/toastui-editor-dark.css`,
            ]);
            lTool.loadStyle('.toastui-editor-defaultUI-toolbar,.ProseMirror{box-sizing:initial !important}.toastui-editor-main{background:var(--g-plain-background);border-radius:0 0 3px 3px}.ProseMirror{cursor:text}.jodit ::-webkit-scrollbar{width:6px;cursor:default;}.jodit ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px;}.jodit ::-webkit-scrollbar-thumb:hover{background: rgba(0,0,0,.2);}');
            return window.toastui;
        },
        'loading': false,
        'resolve': []
    },
    'jodit': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/jodit@4.2.27/es2015/jodit.fat.min.js`,
            ]);
            await lTool.loadLinks([
                `${clickgo.getCdn()}/npm/jodit@4.2.27/es2015/jodit.fat.min.css`,
            ]);
            lTool.loadStyle('.jodit-container:not(.jodit_inline){border:none;display:flex;flex-direction:column;}.jodit-container:not(.jodit_inline) .jodit-workplace{cursor:text;flex:1;}.jodit-wysiwyg a{color:unset;}');
            return window.Jodit;
        },
        'loading': false,
        'resolve': [],
    },
    'pdfjs': {
        func: async function () {
            try {
                const m = await import(`${clickgo.getCdn()}/npm/pdfjs-dist@5.4.54/+esm`);
                m.GlobalWorkerOptions.workerSrc = `${clickgo.getCdn()}/npm/pdfjs-dist@5.4.54/build/pdf.worker.min.mjs`;
                return m;
            }
            catch {
                throw Error('pdf.js load failed.');
            }
        },
        'loading': false,
        'resolve': [],
    },
    'qrcode': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/qrcode@1.5.1/build/qrcode.js`,
            ]);
            if (!window.QRCode) {
                throw Error('QRCode load failed.');
            }
            return window.QRCode;
        },
        'loading': false,
        'resolve': [],
    },
    'mpegts': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/mpegts.js@1.7.3/dist/mpegts.min.js`,
            ]);
            if (!window.mpegts) {
                throw Error('mpegts load failed.');
            }
            window.mpegts.LoggingControl.enableAll = false;
            return window.mpegts;
        },
        'loading': false,
        'resolve': [],
    },
    'tplinkhd': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getDirname()}/ext/tplinkhd.min.js`,
            ]);
            if (!window.HDPluginControl) {
                throw Error('Tplink load failed.');
            }
            return window.HDPluginControl;
        },
        'loading': false,
        'resolve': [],
    },
    'tums-player': {
        func: async function () {
            await lTool.loadScripts([
                `${clickgo.getDirname()}/ext/tums-player/tums-player.umd.min.js`,
            ]);
            if (!window['tums-player']) {
                throw Error('Tums load failed.');
            }
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = '-9999px';
            div.style.top = '-9999px';
            div.style.width = '200px';
            div.style.height = '100px';
            document.body.appendChild(div);
            /** --- tums-player 原生对象 --- */
            const tp = window['tums-player'].default;
            /** --- 对讲对象，一个页面只能有一个 --- */
            let client = null;
            return {
                'default': tp,
                startTalk: (opt) => {
                    return new Promise(resolve => {
                        if (client) {
                            client.stopVoiceIntercom();
                            client.destroy();
                            client = null;
                        }
                        client = new tp(div, {
                            'type': 'relay',
                            'url': 'none',
                            'pluginPath': clickgo.getDirname() + '/ext',
                            'talkEnable': true,
                            'appKey': opt.sid,
                            'appSecret': opt.skey,
                        });
                        client.on('ready', () => {
                            client.startVoiceIntercom({
                                'url': opt.url,
                                'mode': opt.mode,
                            });
                            resolve();
                        });
                    });
                },
                stopTalk: () => {
                    if (!client) {
                        return;
                    }
                    client.stopVoiceIntercom();
                    client.destroy();
                    client = null;
                },
            };
        },
        'loading': false,
        'resolve': [],
    },
    // --- 腾讯云验证码 ---
    'tjcaptcha': {
        func: async function () {
            await lTool.loadScripts([
                'https://turing.captcha.qcloud.com/TJCaptcha.js',
            ]);
            if (!window.TencentCaptcha) {
                throw Error('TJCaptcha load failed.');
            }
            return window.TencentCaptcha;
        },
        'loading': false,
        'resolve': [],
    },
    // --- cf 验证码 ---
    'turnstile': {
        func: async function () {
            await lTool.loadScripts([
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
            ]);
            if (!window.turnstile) {
                throw Error('cft load failed.');
            }
            return window.turnstile;
        },
        'loading': false,
        'resolve': [],
    },
    // --- noVNC ---
    '@novnc/novnc': {
        'version': '1.6.0',
        'loading': false,
        'resolve': [],
    },
};
/**
 * --- 注册模块 ---
 * @param current 当前任务 id
 * @param name 模块名
 * @param func 执行加载函数
 * @param version 版本号，非 ESM 可留空
 */
export async function regModule(current, name, opt) {
    if (!(await lTask.checkPermission(current, 'root'))[0]) {
        return false;
    }
    if (modules[name]) {
        return false;
    }
    if (clickgo.modules[name]) {
        // --- 已经加载过的也不能注册了 ---
        return false;
    }
    modules[name] = {
        'version': opt.version,
        'func': opt.func,
        'loading': false,
        'resolve': [],
    };
    return true;
}
/**
 * --- 检查特殊模块是否注册 ---
 * @param name 模块名
 */
export function checkModule(name) {
    return modules[name] !== undefined;
}
/**
 * --- 获取模块内容，通常用于异步加载模块时使用 ---
 * @param name 模块名
 * @returns 模块对象
 */
export async function getModule(name) {
    if (!(await loadModule(name))) {
        return null;
    }
    return clickgo.modules[name];
}
/**
 * --- 加载模块，返回 true / false ---
 * @param name 模块名
 */
export async function loadModule(name) {
    if (!modules[name]) {
        // --- 未注册的，加载啥 ---
        return false;
    }
    if (clickgo.modules[name]) {
        // --- 已经加载过了 ---
        return true;
    }
    try {
        if (modules[name].loading) {
            // --- 加载中，等待 ---
            await new Promise(resolve => {
                modules[name].resolve.push(() => {
                    resolve();
                });
            });
            return true;
        }
        // --- 未加载，走加载流程 ---
        modules[name].loading = true;
        if (modules[name].version) {
            // --- ESM 模块 ---
            const r = await import(`${clickgo.getCdn()}/npm/${name}@${modules[name].version}/+esm`);
            clickgo.modules[name] = r;
        }
        if (modules[name].func) {
            const r = await modules[name].func();
            clickgo.modules[name] = r;
        }
        modules[name].loading = false;
        for (const r of modules[name].resolve) {
            r();
        }
        modules[name].resolve.length = 0;
        return true;
    }
    catch {
        return false;
    }
}
// --- 需要初始化 ---
let inited = false;
export function init() {
    if (inited) {
        return;
    }
    inited = true;
    config = clickgo.modules.vue.reactive({
        'locale': lTool.lang.getCodeByAccept(),
        'task.position': 'bottom',
        'task.pin': {},
        'desktop.icon.storage': true,
        'desktop.icon.recycler': true,
        'desktop.wallpaper': null,
        'desktop.path': null,
        'launcher.list': [],
    });
    clickgo.modules.vue.watch(config, async function () {
        // --- 检测有没有缺少的 config key ---
        for (const key in configOrigin) {
            if (config[key] !== undefined) {
                continue;
            }
            lForm.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
                'type': 'warning'
            });
            config[key] = configOrigin[key];
        }
        // --- 有没有多余的或值有问题的 ---
        for (const key in config) {
            if (!Object.keys(configOrigin).includes(key)) {
                lForm.notify({
                    'title': 'Warning',
                    'content': 'There is a software that maliciously modifies the system config.\nKey: ' + key,
                    'type': 'warning'
                });
                delete config[key];
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
                await trigger('configChanged', 'task.pin', config['task.pin']);
            }
            else {
                // --- 别的要判断值是否和比对组一样 ---
                if (config[key] === configOrigin[key]) {
                    continue;
                }
                configOrigin[key] = config[key];
                if (key === 'task.position') {
                    lTask.refreshSystemPosition();
                }
                await trigger('configChanged', key, config[key]);
            }
        }
    }, {
        'deep': true
    });
}
