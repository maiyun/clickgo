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
import * as clickgo from '../clickgo';
import * as core from './core';
import * as control from './control';
import * as dom from './dom';
import * as tool from './tool';
import * as form from './form';
import * as theme from './theme';
import * as fs from './fs';
import * as native from './native';

/** --- 当前运行的程序 --- */
export const list: Record<number, types.ITask> = {};
/** --- 最后一个 task id --- */
export let lastId: number = 0;

/** --- task lib 用到的语言包 --- */
const localeData: Record<string, {
    'loading': string;
}> = {
    'en': {
        'loading': 'Loading...',
    },
    'sc': {
        'loading': '加载中……'
    },
    'tc': {
        'loading': '載入中……'
    },
    'ja': {
        'loading': '読み込み中...'
    }
};

// --- 创建 frame 监听 ---
let frameTimer: number = 0;
const frameMaps: Record<string, number> = {};

/**
 * --- 创建 frame 监听 ---
 * @param fun 监听回调
 * @param opt 选项, scope:有效范围,count:执行次数，默认无限次,taskId:APP模式下无效,formId:APP模式下无效
 */
export function onFrame(fun: () => void | Promise<void>, opt: {
    'scope'?: 'form' | 'task';
    'count'?: number;
    'taskId'?: number;
    'formId'?: number;
} = {}): number {
    const taskId = opt.taskId;
    const formId = opt.formId;
    if (!taskId || !formId) {
        return 0;
    }
    const ft = ++frameTimer;
    /** --- 作用域 --- */
    const scope = opt.scope ?? 'form';
    /** --- 执行几次，0 代表无限次 --- */
    const count = opt.count ?? 0;
    /** --- 当前已经执行的次数 --- */
    let c: number = 0;
    let timer: number;
    const timerHandler = async (): Promise<void> => {
        ++c;
        if (list[taskId].forms[formId] === undefined) {
            // --- form 已经没了 ---
            if (scope === 'form') {
                delete list[taskId].timers['1x' + ft.toString()];
                delete frameMaps[ft];
                return;
            }
        }
        await fun();
        if (list[taskId].timers['1x' + ft.toString()] == undefined) {
            return;
        }
        if (count > 1) {
            if (c === count) {
                // --- 终止循环 ---
                delete list[taskId].timers['1x' + ft.toString()];
                delete frameMaps[ft];
                return;
            }
            else {
                // --- 接着循环 ---
                timer = requestAnimationFrame(function() {
                    timerHandler().catch(function(e) {
                        console.log(e);
                    });
                });
                frameMaps[ft] = timer;
            }
        }
        else if (count === 1) {
            // --- 不循环 ---
            delete list[taskId].timers['1x' + ft.toString()];
            delete frameMaps[ft];
        }
        else {
            // --- 无限循环 ---
            timer = requestAnimationFrame(function() {
                timerHandler().catch(function(e) {
                    console.log(e);
                });
            });
            frameMaps[ft] = timer;
        }
    };
    /** --- timer 对象 number --- */
    timer = requestAnimationFrame(function() {
        timerHandler().catch(function(e) {
            console.log(e);
        });
    });
    frameMaps[ft] = timer;
    list[taskId].timers['1x' + ft.toString()] = formId;
    return ft;
}

/**
 * --- 移除 frame 监听 ---
 * @param ft 监听 ID
 * @param opt 选项,taskId:APP模式下无效
 */
export function offFrame(ft: number, opt: {
    'taskId'?: number;
} = {}): void {
    const taskId = opt.taskId;
    if (!taskId) {
        return;
    }
    const formId = list[taskId].timers['1x' + ft.toString()];
    if (formId === undefined) {
        return;
    }
    cancelAnimationFrame(frameMaps[ft]);
    delete list[taskId].timers['1x' + ft.toString()];
    delete frameMaps[ft];
}

/**
 * --- 获取任务当前信息 ---
 * @param tid 任务 id
 */
export function get(tid: number): types.ITaskInfo | null {
    if (list[tid] === undefined) {
        return null;
    }
    return {
        'name': list[tid].app.config.name,
        'locale': list[tid].locale.lang,
        'customTheme': list[tid].customTheme,
        'formCount': Object.keys(list[tid].forms).length,
        'icon': list[tid].icon,
        'path': list[tid].path
    };
}

/**
 * --- 获取 task list 的简略情况 ---
 */
export function getList(): Record<string, types.ITaskInfo> {
    const rtn: Record<string, types.ITaskInfo> = {};
    for (const tid in list) {
        const item = list[tid];
        rtn[tid] = {
            'name': item.app.config.name,
            'locale': item.locale.lang,
            'customTheme': item.customTheme,
            'formCount': Object.keys(item.forms).length,
            'icon': item.icon,
            'path': item.path
        };
    }
    return rtn;
}

/**
 * --- 运行一个应用 ---
 * @param url app 路径（以 / 为结尾的路径或以 .cga 结尾的文件）
 * @param opt 选项，icon:图标,progress:显示进度条,main:native模式下的主进程，App 模式下无效,taskId:所属任务，App 模式下无效
 */
export async function run(url: string, opt: types.ITaskRunOptions = {}): Promise<number> {
    /** --- 是否是在任务当中启动的任务 --- */
    let ntask: types.ITask | null = null;
    if (opt.taskId) {
        ntask = list[opt.taskId];
    }
    // --- 检测 url 是否合法 ---
    if (!url.endsWith('/') && !url.endsWith('.cga')) {
        return 0;
    }
    /** --- 要显示的应用图标 --- */
    let icon = __dirname + '/../icon.png';
    if (opt.icon) {
        icon = opt.icon;
    }
    if (opt.notify === undefined) {
        opt.notify = true;
    }
    const notifyId: number | undefined = opt.notify ? form.notify({
        'title': localeData[core.config.locale]?.loading ?? localeData['en'].loading,
        'content': url,
        'icon': icon,
        'timeout': 0,
        'progress': true
    }) : undefined;
    const app: types.IApp | null = await core.fetchApp(url, {
        'notifyId': notifyId,
        'current': ntask ? ntask.path : undefined,
        'progress': opt.progress
    });
    if (notifyId) {
        setTimeout(function(): void {
            form.hideNotify(notifyId);
        }, 2000);
    }
    if (!app) {
        return -1;
    }
    // --- app 的内置文件以及运行时文件 ---
    const files: Record<string, Blob | string> = {};
    for (const fpath in app.files) {
        files[fpath] = app.files[fpath];
    }
    // --- 创建任务对象 ITask ---
    const taskId = ++lastId;
    list[taskId] = {
        'id': taskId,
        'app': app,
        'customTheme': false,
        'locale': clickgo.vue.reactive({
            'lang': '',
            'data': {}
        }),
        'icon': app.icon ?? icon,
        'path': url,
        'files': files,
        'main': opt.main ?? false,

        'permissions': {},
        'forms': {},
        'objectURLs': [],
        'controls': {
            'loaded': {},
            'layout': {},
            'prep': {}
        },
        'timers': {}
    };
    const task: types.ITask = list[taskId];
    // --- control ---
    for (let path of app.config.controls) {
        path += '.cgc';
        path = tool.urlResolve('/', path);
        const file = await fs.getContent(path, {
            'files': task.files
        });
        if (file && typeof file !== 'string') {
            const c = await control.read(file);
            if (c) {
                task.controls.loaded[path] = c;
            }
            else {
                form.notify({
                    'title': 'Control failed to load',
                    'content': path
                });
            }
        }
    }
    // --- theme ---
    if (app.config.themes) {
        for (let path of app.config.themes) {
            path += '.cgt';
            path = tool.urlResolve('/', path);
            const file = await fs.getContent(path, {
                'files': task.files
            });
            if (file && typeof file !== 'string') {
                const th = await theme.read(file);
                if (th) {
                    await theme.load(th, taskId);
                }
            }
        }
    }
    // --- locale ---
    if (app.config.locales) {
        for (let path in app.config.locales) {
            const locale = app.config.locales[path];
            if (!path.endsWith('.json')) {
                path += '.json';
            }
            const lcontent = await fs.getContent(path, {
                'encoding': 'utf8',
                'files': task.files,
                'current': task.path
            });
            if (!lcontent) {
                continue;
            }
            try {
                const data = JSON.parse(lcontent);
                loadLocaleData(locale, data, '', task.id);
            }
            catch {
                // --- 无所谓 ---
            }
        }
    }
    // --- 触发 taskStarted 事件 ---
    core.trigger('taskStarted', task.id);
    // --- 创建 Task 总 style ---
    dom.createToStyleList(task.id);
    // --- 创建 form ---
    const f = await form.create({
        'taskId': task.id,
        'file': app.config.main
    });
    if (typeof f === 'number') {
        // --- 结束任务 ---
        delete list[task.id];
        dom.removeFromStyleList(task.id);
        core.trigger('taskEnded', task.id);
        return f - 100;
    }
    if (clickgo.getNative() && opt.sync) {
        f.vroot.$refs.form.isNativeSync = true;
        setTimeout(function() {
            clickgo.native.send('cg-set-size', JSON.stringify({
                'token': clickgo.native.getToken(),
                'width': f.vroot.$refs.form.widthData,
                'height': f.vroot.$refs.form.heightData
            }));
            window.addEventListener('resize', function(): void {
                f.vroot.$refs.form.setPropData('width', window.innerWidth);
                f.vroot.$refs.form.setPropData('height', window.innerHeight);
            });
        }, 10);
    }
    // --- 设置 global style（如果 form 创建失败，就不设置 global style 了） ---
    if (app.config.style && app.files[app.config.style + '.css']) {
        const style = app.files[app.config.style + '.css'] as string;
        const r = tool.stylePrepend(style, 'cg-task' + task.id.toString() + '_');
        dom.pushStyle(task.id, await tool.styleUrl2DataUrl(app.config.style, r.style, app.files));
    }
    // --- 是否要加载独立的 theme ---
    if (app.config.themes && app.config.themes.length > 0) {
        task.customTheme = true;
        for (const path of app.config.themes) {
            const blob = await fs.getContent(path, {
                'files': task.files,
                'current': task.path
            });
            if (!(blob instanceof Blob)) {
                continue;
            }
            const th = await theme.read(blob);
            if (!th) {
                continue;
            }
            await theme.load(th, task.id);
        }
    }
    else {
        // --- 检测是否加载系统 theme ---
        if (theme.global) {
            await theme.load(undefined, task.id);
        }
    }
    // --- 给 native 发送任务启动成功的消息 ---
    if (task.id === 1) {
        clickgo.native.send('cg-init', clickgo.native.getToken());
    }
    return task.id;
}

/**
 * --- 完全结束任务 ---
 * @param taskId 任务 id
 */
export function end(taskId: number): boolean {
    const task = list[taskId];
    if (!task) {
        return true;
    }
    // --- 如果是 native 模式 ---
    if (clickgo.getNative() && task.main) {
        clickgo.native.send('cg-main-close', JSON.stringify({
            'token': clickgo.native.getToken()
        }));
    }
    // --- 获取最大的 z index 窗体，并让他获取焦点 ---
    const fid = form.getMaxZIndexID({
        'taskIds': [task.id]
    });
    if (fid) {
        form.changeFocus(fid);
    }
    else {
        form.changeFocus();
    }
    // --- 移除窗体 list ---
    for (const fid in task.forms) {
        const f = task.forms[fid];
        core.trigger('formRemoved', taskId, f.id, f.vroot.$refs.form.title, f.vroot.$refs.form.iconData);
        f.vapp.unmount();
        f.vapp._container.remove();
    }
    // --- 移除 style ---
    dom.removeFromStyleList(taskId);
    // --- 移除本 task 创建的所有 object url ---
    for (const url of task.objectURLs) {
        tool.revokeObjectURL(url, task.id);
    }
    // --- 移除所有 timer ---
    for (const timer in list[taskId].timers) {
        if (timer.startsWith('1x')) {
            const ft = timer.slice(2);
            cancelAnimationFrame(frameMaps[ft]);
            delete frameMaps[ft];
        }
        else {
            clearTimeout(parseFloat(timer));
        }
    }
    // --- 移除各类监听 ---
    native.clearListener(taskId);
    dom.clearWatchSize(taskId);
    // --- 移除 task ---
    delete list[taskId];
    // --- 触发 taskEnded 事件 ---
    core.trigger('taskEnded', taskId);
    // --- 移除 task bar ---
    clearSystem(taskId);
    return true;
}

/**
 * --- 加载 locale data 对象到 task ---
 * @param lang 语言名，如 sc
 * @param data 数据
 * @param pre 前置
 * @param taskId 任务ID，App 模式下无效
 */
export function loadLocaleData(lang: string, data: Record<string, any>, pre: string = '', taskId?: number): void {
    if (!taskId) {
        return;
    }
    if (!list[taskId].locale.data[lang]) {
        list[taskId].locale.data[lang] = {};
    }
    for (const k in data) {
        const v = data[k];
        if (typeof v === 'object') {
            loadLocaleData(lang, v, pre + k + '.', taskId);
        }
        else {
            list[taskId].locale.data[lang][pre + k] = v;
        }
    }
}

/**
 * --- 加载 locale 文件 json ---
 * @param lang 语言名，如 sc
 * @param path 地址
 * @param taskId 所属的 taskId，App 模式下无效
 * @param formId 所属的 formId，App 模式下无效
 */
export async function loadLocale(lang: string, path: string, taskId?: number, formId?: number): Promise<boolean> {
    if (!taskId) {
        return false;
    }
    const task = list[taskId];
    if (!task) {
        return false;
    }
    let form: types.IForm | null = null;
    if (formId) {
        if (!task.forms[formId]) {
            return false;
        }
        form = task.forms[formId];
    }
    /** --- 当前父 form 的路径（以 / 结尾）或 /（没有基路径的话） --- */
    const base: string = form ? form.vroot.cgPath : '/';
    path = tool.urlResolve(base, path) + '.json';
    /** --- 获取的语言文件 --- */
    const fcontent = await fs.getContent(path, {
        'encoding': 'utf8',
        'files': task.files,
        'current': task.path
    });
    if (!fcontent) {
        return false;
    }
    try {
        const data = JSON.parse(fcontent);
        loadLocaleData(lang, data, '', task.id);
        return true;
    }
    catch {
        return false;
    }
}

/**
 * --- 清除任务的所有加载的语言包 ---
 * @param taskId 所属的 taskId，App 模式下无效
 */
export function clearLocale(taskId?: number): void {
    if (!taskId) {
        return;
    }
    const task = list[taskId];
    if (!task) {
        return;
    }
    task.locale.data = {};
}

/**
 * --- 加载全新 locale（老 locale 的所以语言的缓存会被卸载） ---
 * @param lang 语言名，如 sc
 * @param path 路径
 * @param taskId 所属的 taskId，App 模式下无效
 * @param formId 所属的 formId，App 模式下无效
 */
export function setLocale(lang: string, path: string, taskId?: number, formId?: number): Promise<boolean> {
    clearLocale(taskId);
    return loadLocale(lang, path, taskId, formId);
}

/**
 * --- 设置本 task 的语言 name ---
 * @param lang 语言名，如 sc
 * @param taskId 所属的 taskId，App 模式下无效
 */
export function setLocaleLang(lang: string, taskId?: number): void {
    if (!taskId) {
        return;
    }
    const task = list[taskId];
    if (!task) {
        return;
    }
    task.locale.lang = lang;
}

/**
 * --- 清除 task 的语言设置 ---
 * @param taskId 所属的 taskId，App 模式下无效
 */
export function clearLocaleLang(taskId?: number): void {
    if (!taskId) {
        return;
    }
    const task = list[taskId];
    if (!task) {
        return;
    }
    task.locale.lang = '';
}

/**
 * --- 创建 timer ---
 * @param fun 执行函数
 * @param delay 延迟/间隔
 * @param opt 选项, taskId: App 模式下无效, formId: 可省略，App 模式下省略代表当前窗体，immediate: 立即执行
 */
export function createTimer(
    fun: () => void | Promise<void>,
    delay: number,
    opt: types.ICreateTimerOptions = {}
): number {
    const taskId = opt.taskId;
    if (!taskId) {
        return 0;
    }
    const formId = opt.formId;
    if (!formId) {
        return 0;
    }
    /** --- 作用域 --- */
    const scope = opt.scope ?? 'form';
    /** --- 执行几次，0 代表无限次 --- */
    const count = opt.count ?? 0;
    /** --- 当前已经执行的次数 --- */
    let c: number = 0;
    // --- 是否立即执行 ---
    if (opt.immediate) {
        const r = fun();
        if (r instanceof Promise) {
            r.catch(function(e) {
                console.log(e);
            });
        }
        ++c;
        if (count > 0 && c === count) {
            return 0;
        }
    }
    let timer: number;
    const timerHandler = (): void => {
        ++c;
        if (list[taskId].forms[formId] === undefined) {
            // --- form 已经没了 ---
            if (scope === 'form') {
                clearTimeout(timer);
                delete list[taskId].timers[timer];
                return;
            }
        }
        const r = fun();
        if (r instanceof Promise) {
            r.catch(function(e) {
                console.log(e);
            });
        }
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete list[taskId].timers[timer];
            return;
        }
    };
    /** --- timer 对象 number --- */
    if (count === 1) {
        timer = window.setTimeout(timerHandler, delay);
    }
    else {
        timer = window.setInterval(timerHandler, delay);
    }
    list[taskId].timers[timer] = formId;
    return timer;
}

/**
 * --- 移除 timer ---
 * @param timer ID
 * @param taskId 任务 id，App 模式下无效
 */
export function removeTimer(timer: number, taskId?: number): void {
    if (!taskId) {
        return;
    }
    if (list[taskId] === undefined) {
        return;
    }
    const formId = list[taskId].timers[timer];
    if (formId === undefined) {
        return;
    }
    // --- 放在这，防止一个 task 能结束 别的 task 的 timer ---
    clearTimeout(timer);
    delete list[taskId].timers[timer];
}

/**
 * --- 暂停一小段时间 ---
 * @param fun 回调函数
 * @param delay 暂停时间
 * @param taskId 任务 id，App 模式下无效
 * @param formId 窗体 id，App 模式下无效
 */
export function sleep(fun: () => void | Promise<void>, delay: number, taskId?: number, formId?: number): number {
    return createTimer(fun, delay, {
        'taskId': taskId,
        'formId': formId,
        'count': 1
    });
}

/** --- task 的信息 --- */
export const systemTaskInfo: types.ISystemTaskInfo = clickgo.vue.reactive({
    'taskId': 0,
    'formId': 0,
    'length': 0
});

clickgo.vue.watch(systemTaskInfo, function(n: any, o: any) {
    const originKeys = ['taskId', 'formId', 'length'];
    // --- 检测有没有缺少的 key ---
    for (const key of originKeys) {
        if ((systemTaskInfo as any)[key] !== undefined) {
            continue;
        }
        form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously removed the system task info item.\nKey: ' + key,
            'type': 'warning'
        });
        (systemTaskInfo as any)[key] = o[key] ?? 0;
    }
    for (const key in systemTaskInfo) {
        if (!['taskId', 'formId', 'length'].includes(key)) {
            form.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously modifies the system task info item.\nKey: ' + key,
                'type': 'warning'
            });
            delete (systemTaskInfo as any)[key];
            continue;
        }
        if (typeof (systemTaskInfo as any)[key] === 'number') {
            continue;
        }
        form.notify({
            'title': 'Warning',
            'content': 'There is a software that maliciously modifies the system task info item.\nKey: ' + key,
            'type': 'warning'
        });
        (systemTaskInfo as any)[key] = o[key] ?? 0;
    }
}, {
    'deep': true
});

/**
 * --- 将任务注册为系统 task ---
 * @param formId task bar 的 form id，App 模式下留空为当前窗体
 * @param taskId task id，App 模式下无效
 */
export function setSystem(formId?: number, taskId?: number): boolean {
    if (!formId || !taskId) {
        return false;
    }
    const task = list[taskId];
    if (!task) {
        return false;
    }
    const f = task.forms[formId];
    if (!f) {
        return false;
    }
    if (f.vroot.position === undefined) {
        form.notify({
            'title': 'Warning',
            'content': `Task id is "${taskId}" app is not an available task app, position not found.`,
            'type': 'warning'
        });
        return false;
    }
    if (systemTaskInfo.taskId > 0) {
        form.notify({
            'title': 'Info',
            'content': 'More than 1 system-level task application is currently running.',
            'type': 'info'
        });
    }
    systemTaskInfo.taskId = taskId;
    systemTaskInfo.formId = formId;
    form.simpleSystemTaskRoot.forms = {};
    refreshSystemPosition();
    return true;
}

/**
 * --- 清除系统任务设定 ---
 * @param taskId 清除的 taskid 为 task id 才能清除，App 模式下无效
 */
export function clearSystem(taskId?: number): boolean {
    if (!taskId) {
        return false;
    }
    if (typeof taskId !== 'number') {
        form.notify({
            'title': 'Warning',
            'content': 'The "formId" of "clearTask" must be a number type.',
            'type': 'warning'
        });
        return false;
    }
    if (systemTaskInfo.taskId !== taskId) {
        return false;
    }
    systemTaskInfo.taskId = 0;
    systemTaskInfo.formId = 0;
    systemTaskInfo.length = 0;
    core.trigger('screenResize');
    // --- 如果此时已经有最小化的窗体，那么他将永远“不见天日”，需要将他们传递给 simpletask ---
    const tasks = getList();
    for (const taskId in tasks) {
        const forms = form.getList(parseInt(taskId));
        for (const formId in forms) {
            const f = forms[formId];
            if (!f.stateMin) {
                continue;
            }
            form.simpleSystemTaskRoot.forms[formId] = {
                'title': f.title,
                'icon': f.icon
            };
        }
    }
    return true;
}

/**
 * --- 刷新系统任务的 form 的位置以及 length ---
 */
export function refreshSystemPosition(): void {
    if (systemTaskInfo.taskId > 0) {
        const form = list[systemTaskInfo.taskId].forms[systemTaskInfo.formId];
        // --- 更新 task bar 的位置 ---
        switch (core.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 'auto');
                form.vroot.$refs.form.setPropData('height', window.innerHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', window.innerWidth);
                form.vroot.$refs.form.setPropData('height', 'auto');
                break;
            }
        }
        setTimeout(function() {
            switch (core.config['task.position']) {
                case 'left': {
                    systemTaskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'right': {
                    systemTaskInfo.length = form.vroot.$el.offsetWidth;
                    form.vroot.$refs.form.setPropData('left', window.innerWidth - systemTaskInfo.length);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'top': {
                    systemTaskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', 0);
                    break;
                }
                case 'bottom': {
                    systemTaskInfo.length = form.vroot.$el.offsetHeight;
                    form.vroot.$refs.form.setPropData('left', 0);
                    form.vroot.$refs.form.setPropData('top', window.innerHeight - systemTaskInfo.length);
                    break;
                }
            }
            core.trigger('screenResize');
        }, 50);
    }
    else {
        core.trigger('screenResize');
    }
}
