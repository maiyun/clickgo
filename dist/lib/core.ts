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
import fabric from 'fabric';
import * as mpegts from 'mpegts.js';
import * as clickgo from '../clickgo';
import * as lFs from './fs';
import * as lForm from './form';
import * as lTask from './task';
import * as lTool from './tool';
import * as lControl from './control';
import type * as lCommand from './command';
import * as lCore from './core';
import { createPackage } from './core/package.js';

/** --- 系统级 ID --- */
let sysId = '';

/**
 * --- 初始化系统级 ID，仅能设置一次 ---
 * @param id 系统级 ID
 */
export function initSysId(id: string): void {
    if (sysId) {
        return;
    }
    sysId = id;
}

/** --- Config 原始参考对象 --- */
const configOrigin: IConfig = {
    'locale': 'en',
    'task.position': 'bottom',
    'task.mode': 'bar',
    'task.margin': 8,
    'task.pin': {},
    'desktop.icon.storage': true,
    'desktop.icon.recycler': true,
    'desktop.wallpaper': null,
    'desktop.path': null,
    'launcher.list': [],
};

/** --- Config 配置对象 --- */
export let config: IConfig;

/** --- App 抽象类 --- */
export abstract class AbstractApp {

    /** --- 当前 js 文件在包内的完整路径 --- */
    public filename: string = '';

    /** --- 系统会自动设置本项 --- */
    public taskId: string = '';

    /** --- App 的入口文件 --- */
    public abstract main(data: Record<string, any>): Promise<void>;

    /**
     * --- 以某个窗体进行正式启动这个 app（入口 form），不启动则任务也启动失败 ---
     * @param form 窗体对象
     */
    public async run(form: lForm.AbstractForm): Promise<void> {
        await form.show();
    }

    /** --- 全局错误事件 --- */
    public onError(taskId: string, formId: string, error: Error, info: string): void | Promise<void>;
    public onError(): void {
        return;
    }

    /** --- 屏幕大小改变事件 --- */
    public onScreenResize(): void | Promise<void>;
    public onScreenResize(): void {
        return;
    }

    /** --- 系统配置变更事件 --- */
    public onConfigChanged<T extends IConfig, TK extends keyof T>(n: TK, v: T[TK]): void | Promise<void>;
    public onConfigChanged(): void {
        return;
    }

    /** --- 窗体创建事件 --- */
    public onFormCreated(
        taskId: string, formId: string, title: string, icon: string, showInSystemTask: boolean
    ): void | Promise<void>;
    public onFormCreated(): void {
        return;
    }

    /** --- 窗体销毁事件 */
    public onFormRemoved(taskId: string, formId: string, title: string, icon: string): void | Promise<void>;
    public onFormRemoved(): void {
        return;
    }

    /** --- 窗体标题改变事件 */
    public onFormTitleChanged(taskId: string, formId: string, title: string): void | Promise<void>;
    public onFormTitleChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体图标改变事件 --- */
    public onFormIconChanged(taskId: string, formId: string, icon: string): void | Promise<void>;
    public onFormIconChanged(): void | Promise<void> {
        return;
    }

    /** --- 窗体最小化状态改变事件 --- */
    public onFormStateMinChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormStateMinChanged(): void {
        return;
    }

    /** --- 窗体最大化状态改变事件 --- */
    public onFormStateMaxChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormStateMaxChanged(): void {
        return;
    }

    /** --- 窗体显示状态改变事件 --- */
    public onFormShowChanged(taskId: string, formId: string, state: boolean): void | Promise<void>;
    public onFormShowChanged(): void {
        return;
    }

    /** --- 窗体获得焦点事件 --- */
    public onFormFocused(taskId: string, formId: string): void | Promise<void>;
    public onFormFocused(): void {
        return;
    }

    /** --- 窗体丢失焦点事件 --- */
    public onFormBlurred(taskId: string, formId: string): void | Promise<void>;
    public onFormBlurred(): void {
        return;
    }

    /** --- 窗体闪烁事件 --- */
    public onFormFlash(taskId: string, formId: string): void | Promise<void>;
    public onFormFlash(): void {
        return;
    }

    /** --- 窗体是否显示在任务栏属性改变事件 --- */
    public onFormShowInSystemTaskChange(taskId: string, formId: string, value: boolean): void | Promise<void>;
    public onFormShowInSystemTaskChange(): void {
        return;
    }

    /** --- 窗体的 formHash 改变事件 --- */
    public onFormHashChange(
        taskId: string, formId: string, value: string, data: Record<string, any>
    ): void | Promise<void>;
    public onFormHashChange(): void {
        return;
    }

    /**
     * --- 托盘注册通知；通过 task.getTrayList(this) 读取快照 ---
     * @param taskId 所属任务
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayCreated(taskId: string, trayId: string): void | Promise<void>;
    public onTrayCreated(): void {
        return;
    }

    /**
     * --- 托盘数据变更通知 ---
     * @param taskId 所属任务
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayChanged(taskId: string, trayId: string): void | Promise<void>;
    public onTrayChanged(): void {
        return;
    }

    /**
     * --- 托盘删除通知 ---
     * @param taskId 所属任务
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayRemoved(taskId: string, trayId: string): void | Promise<void>;
    public onTrayRemoved(): void {
        return;
    }

    /**
     * --- 自己的托盘左键点击，只投递到所属任务 ---
     * @param trayId 托盘 ID
     * @returns 无返回值
     */
    public onTrayClick(trayId: string): void | Promise<void>;
    public onTrayClick(): void {
        return;
    }

    /**
     * --- 自己的托盘菜单命令，只投递到所属任务 ---
     * @param trayId 托盘 ID
     * @param menuId 菜单命令
     * @returns 无返回值
     */
    public onTrayMenuClick(trayId: string, menuId: string): void | Promise<void>;
    public onTrayMenuClick(): void {
        return;
    }

    /** --- 任务开始事件 --- */
    public onTaskStarted(taskId: string): void | Promise<void>;
    public onTaskStarted(): void | Promise<void> {
        return;
    }

    /** --- 任务结束事件 --- */
    public onTaskEnded(taskId: string): void | Promise<void>;
    public onTaskEnded(): void | Promise<void> {
        return;
    }

    /**
     * --- 页面级 WebMCP 接入状态变化，所有 App 共用同一状态 ---
     * @param status 浏览器接入状态，与 command.getAgentInfo 的 webMcp.status 一致
     * @returns 无返回值
     */
    public onWebMcpStatusChanged(status: lCommand.TWebMcpStatus): void | Promise<void>;
    public onWebMcpStatusChanged(): void {
        return;
    }

    /**
     * --- Launcher 显示状态改变事件 ---
     * @param state 是否显示
     * @returns 无返回值
     */
    public onLauncherShowChanged(state: boolean): void | Promise<void>;
    public onLauncherShowChanged(): void {
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

    /** --- 键盘按下事件 --- */
    public onKeydown(e: KeyboardEvent): void | Promise<void>;
    public onKeydown(): void {
        return;
    }

    /** --- 键盘弹起事件 --- */
    public onKeyup(e: KeyboardEvent): void | Promise<void>;
    public onKeyup(): void {
        return;
    }

}

/** --- boot 类 --- */
let boot: clickgo.AbstractBoot;
export function setBoot(b: clickgo.AbstractBoot): void {
    if (boot) {
        return;
    }
    b.setSysId(sysId);
    boot = b;
}

/** --- 系统要处理的全局响应事件 --- */
const globalEvents = {
    screenResize: function(): void {
        lForm.refreshMaxPosition();
        lForm.refreshNotifyPosition();
    },
    formRemoved: function(taskId: string, formId: string): void {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        delete lForm.simpleSystemTaskRoot.forms[formId];
    },
    formTitleChanged: function(taskId: string, formId: string, title: string): void {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        lForm.simpleSystemTaskRoot.forms[formId].title = title;
    },
    formIconChanged: function(taskId: string, formId: string, icon: string): void {
        if (!lForm.simpleSystemTaskRoot.forms[formId]) {
            return;
        }
        lForm.simpleSystemTaskRoot.forms[formId].icon = icon;
    },
    formStateMinChanged: function(taskId: string, formId: string, state: boolean): void {
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
export async function trigger(name: TGlobalEvent, taskId: string | boolean | KeyboardEvent = '', formId: string | boolean | Record<string, any> | null = '', param1: boolean | Error | string = '', param2: string | Record<string, any> = '', param3: boolean = true): Promise<void> {
    const taskList = await lTask.getOriginList(sysId);
    const eventName = 'on' + name[0].toUpperCase() + name.slice(1);
    switch (name) {
        case 'error': {
            // --- boot 是抽象类，具体实现的方法是动态的 ---
            (boot as any)?.[eventName](taskId, formId, param1, param2);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if (!taskId || (taskId === tid) || rt?.permissions.includes('root')) {
                    // --- 动态调用 app 实例的方法 ---
                    (t.class as any)?.[eventName](taskId, formId, param1, param2);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                    }
                }
            }
            break;
        }
        case 'screenResize': {
            globalEvents.screenResize();
            // --- boot 是抽象类，具体实现的方法是动态的 ---
            (boot as any)?.[eventName]();
            for (const tid in taskList) {
                const t = taskList[tid];
                // --- 动态调用 app 实例的方法 ---
                (t.class as any)?.[eventName]();
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.();
                }
            }
            break;
        }
        case 'configChanged': {
            // --- boot 是抽象类，具体实现的方法是动态的 ---
            (boot as any)?.[eventName]();
            for (const tid in taskList) {
                const t = taskList[tid];
                // --- 动态调用 app 实例的方法 ---
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
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId, formId, param1, param2, param3);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2, param3);
                    }
                }
            }
            break;
        }
        case 'formTitleChanged':
        case 'formIconChanged': {
            (globalEvents as any)[name]?.(taskId, formId, param1);
            (boot as any)?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId, formId, param1);
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
            (globalEvents as any)[name]?.(taskId, formId, param1);
            (boot as any)?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId, formId, param1);
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
            (globalEvents as any)[name]?.(taskId, formId);
            (boot as any)?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId, formId);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId);
                    }
                }
            }
            break;
        }
        case 'formShowInSystemTaskChange': {
            (globalEvents as any)[name]?.(taskId, formId, param1);
            (boot as any)?.[eventName](taskId, formId, param1);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId, formId, param1);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1);
                    }
                }
            }
            break;
        }
        case 'formHashChange': {
            (globalEvents as any)[name]?.(taskId, formId, param1, param2);
            (boot as any)?.[eventName](taskId, formId, param1, param2);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId, formId, param1, param2);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId, formId, param1, param2);
                    }
                }
            }
            break;
        }
        case 'trayCreated':
        case 'trayChanged':
        case 'trayRemoved': {
            const observer = boot as unknown as Record<string, ((taskId: unknown, trayId: unknown) => void)>;
            observer?.[eventName]?.(taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId !== tid) && (lTask.systemTaskInfo.taskId !== tid) && !rt?.permissions.includes('root')) {
                    continue;
                }
                try {
                    const app = t.class as unknown as
                        Record<string, ((taskId: unknown, trayId: unknown) => void | Promise<void>)>;
                    await app?.[eventName]?.(taskId, formId);
                    for (const fid in t.forms) {
                        await t.forms[fid].vroot[eventName]?.(taskId, formId);
                    }
                }
                catch (error) {
                    trigger('error', tid, '', error instanceof Error ? error : new Error(String(error)), eventName).catch(() => {});
                }
            }
            break;
        }
        case 'taskStarted':
        case 'taskEnded': {
            (globalEvents as any)[name]?.(taskId, formId);
            (boot as any)?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                const rt = lTask.getRuntime(sysId, tid);
                if ((taskId === tid) || rt?.permissions.includes('root')) {
                    (t.class as any)?.[eventName](taskId);
                    for (const fid in t.forms) {
                        t.forms[fid].vroot[eventName]?.(taskId);
                    }
                }
            }
            break;
        }
        case 'webMcpStatusChanged': {
            if (taskId !== 'unsupported' && taskId !== 'ready') {
                return;
            }
            const status = taskId;
            /**
             * --- 事件回调独立运行，失败不能中断注册或其他接收者 ---
             * @param receiver Boot、App 或 Form
             * @param receiverTaskId 接收者所属任务，Boot 为空
             * @returns 无返回值
             */
            const notify = (receiver: {
                'onWebMcpStatusChanged'?: (status: lCommand.TWebMcpStatus) => void | Promise<void>;
            } | null | undefined, receiverTaskId: string): void => {
                const report = (error: unknown): void => {
                    trigger('error', receiverTaskId, '', error instanceof Error ? error : new Error(String(error)), eventName).catch(() => {});
                };
                try {
                    Promise.resolve(receiver?.onWebMcpStatusChanged?.(status)).catch(report);
                }
                catch (error) {
                    report(error);
                }
            };
            notify(boot, '');
            for (const tid in taskList) {
                const t = taskList[tid];
                if (t.ending) {
                    continue;
                }
                notify(t.class, tid);
                for (const fid in t.forms) {
                    if (t.ending) {
                        break;
                    }
                    const form = t.forms[fid];
                    if (!form.closed) {
                        // --- vroot 为挂载后的 Form 实例，IVue 的通用类型不声明此回调 ---
                        notify(form.vroot as unknown as lForm.AbstractForm, tid);
                    }
                }
            }
            break;
        }
        case 'launcherShowChanged': {
            if (typeof taskId !== 'boolean') {
                return;
            }
            Promise.resolve(boot?.onLauncherShowChanged(taskId)).catch((error: unknown) => {
                trigger('error', '', '', error instanceof Error ? error : new Error(String(error)), eventName).catch(() => {});
            });
            for (const tid in taskList) {
                const t = taskList[tid];
                // --- 逐个投递但不等待异步处理，避免阻塞后来打开/关闭的状态同步。 ---
                const receivers = [t.class, ...Object.values(t.forms).map(form => form.vroot)];
                for (const receiver of receivers) {
                    try {
                        Promise.resolve(receiver?.onLauncherShowChanged?.(taskId)).catch((error: unknown) => {
                            trigger('error', tid, '', error instanceof Error ? error : new Error(String(error)), eventName).catch(() => {});
                        });
                    }
                    catch (error) {
                        trigger('error', tid, '', error instanceof Error ? error : new Error(String(error)), eventName).catch(() => {});
                    }
                }
            }
            break;
        }
        case 'launcherFolderNameChanged': {
            (boot as any)?.[eventName](taskId, formId);
            for (const tid in taskList) {
                const t = taskList[tid];
                (t.class as any)?.[eventName](taskId, formId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId, formId);
                }
            }
            break;
        }
        case 'hashChanged': {
            (boot as any)?.[eventName](taskId);
            for (const tid in taskList) {
                const t = taskList[tid];
                (t.class as any)?.[eventName](taskId);
                for (const fid in t.forms) {
                    t.forms[fid].vroot[eventName]?.(taskId);
                }
            }
            break;
        }
        case 'keydown':
        case 'keyup': {
            (globalEvents as any)[name]?.(taskId);
            (boot as any)?.[eventName](taskId);
            for (const tid in taskList) {
                const t = taskList[tid];
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
 * --- 读取 CGA 应用包及其配置 ---
 * @param blob CGA 应用包的二进制内容
 * @returns 应用信息；包无法识别或缺少文本配置时返回 false
 */
export async function readApp(blob: Blob): Promise<false | IApp> {
    const packageData = await createPackage(blob);
    if (packageData === false) {
        return false;
    }
    const configContent = await packageData.package.getContent('/config.json');
    if (!configContent) {
        return false;
    }
    if (typeof configContent !== 'string') {
        return false;
    }
    const config: IAppConfig = JSON.parse(configContent);
    return {
        'type': 'app',
        'config': config,
        'icon': packageData.icon,
        'package': packageData.package,
    };
}

/**
 * --- 从网址下载应用 ---
 * @param taskId 所属任务 ID
 * @param url 对于当前网页的相对、绝对路径，以 .cga 结尾的文件
 * @param opt 选项
 */
export async function fetchApp(
    taskId: string, url: string,
    opt: ICoreFetchAppOptions = {},
): Promise<null | IApp> {
    /** --- notify 配置项 --- */
    const notify = opt.notify ?
        (typeof opt.notify === 'number' ?
            {
                'id': opt.notify,
                'loaded': 0,
                'total': 0,
            } :
            opt.notify
        ) :
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
    if (
        !url.startsWith('/clickgo/') &&
        !url.startsWith('/storage/') &&
        !url.startsWith('/mounted/') &&
        !url.startsWith('/package/') &&
        !url.startsWith('/current/') &&
        !url.startsWith('http:') &&
        !url.startsWith('https:') &&
        !url.startsWith('file:')
    ) {
        url = lTool.urlResolve(window.location.href, url);
    }
    try {
        const blob = await lFs.getContent(taskId, url, {
            progress: (loaded: number, total: number): void => {
                let per = loaded / total;
                per = notifyTotal ?
                    Math.min((notifyLoaded / notifyTotal) + (1 / notifyTotal * per), 1) :
                    per;
                if (notifyId) {
                    lForm.notifyProgress(notifyId, per);
                }
                if (opt.progress) {
                    opt.progress(loaded, total, per) as unknown;
                }
            },
            'after': opt.after,
        });
        if ((blob === null) || typeof blob === 'string') {
            return null;
        }
        if (notifyId) {
            lForm.notifyProgress(notifyId,
                notifyTotal ? ((notifyLoaded + 1) / notifyTotal) : 1
            );
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
export function getAvailArea(): IAvailArea {
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
        let left: number = 0;
        let top: number = 0;
        let width: number = 0;
        let height: number = 0;
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
 * @param current 当前任务 id
 * @param hash 修改的值，不含 #
 */
export async function hash(current: TCurrent, hash: string): Promise<boolean> {
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
 * @param current 当前任务 id
 * @param url 要跳转的新 URL
 */
export async function location(current: TCurrent, url: string): Promise<boolean> {
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
export function getLocation(): string {
    return window.location.href;
}

/**
 * --- 对浏览器做返回操作 ---
 * @param current 当前任务 id
 */
export async function back(current: TCurrent): Promise<boolean> {
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
export function open(url: string): void {
    window.open(url);
}

window.addEventListener('hashchange', function() {
    trigger('hashChanged', window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '').catch(() => {});
});

/** --- 注册的模块列表 --- */
const modules: Record<string, {
    /** --- 设置 version 代表是 ESM 模块 --- */
    'version'?: string;
    func?: () => any | Promise<any>;
    /** --- 已经在加载中了 --- */
    'loading': boolean;
    /** --- 等待回调 --- */
    'resolve': Array<(loaded: boolean) => void>;
}> = {
    'monaco-editor': {
        func: async function(): Promise<IMonacoLoader | null> {
            /** --- loader、编辑器和 Worker 使用同一资源根路径 --- */
            const baseUrl = `${clickgo.getCdn()}/npm/monaco-editor@0.56.0/min/`;
            try {
                const response = await fetch(baseUrl + 'vs/loader.js');
                if (!response.ok) {
                    return null;
                }
                return {
                    'loader': await lTool.blob2DataUrl(await response.blob()),
                    'baseUrl': baseUrl,
                };
            }
            catch {
                return null;
            }
        },
        'loading': false,
        'resolve': [],
    },
    'xterm': {
        func: async function() {
            const loaded = await lTool.loadAssets([
                `${clickgo.getCdn()}/npm/xterm@5.3.0/lib/xterm.js`,
                `${clickgo.getCdn()}/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.js`,
                `${clickgo.getCdn()}/npm/xterm-addon-webgl@0.16.0/lib/xterm-addon-webgl.js`,
                `${clickgo.getCdn()}/npm/xterm@5.3.0/css/xterm.min.css`,
            ]);
            if ((!loaded) || (!(window as any).Terminal)) {
                return null;
            }
            lTool.loadStyle('.xterm-viewport::-webkit-scrollbar{display:none;}');
            return {
                'Terminal': (window as any).Terminal,
                'FitAddon': (window as any).FitAddon.FitAddon,
                'WebglAddon': (window as any).WebglAddon.WebglAddon,
            };
        },
        'loading': false,
        'resolve': [],
    },
    'echarts': {
        func: async function() {
            await lTool.loadScript(`${clickgo.getCdn()}/npm/echarts@6.0.0/dist/echarts.min.js`);
            if (!(window as any).echarts) {
                throw Error('Echarts load failed.');
            }
            return (window as any).echarts;
        },
        'loading': false,
        'resolve': [],
    },
    '@toast-ui/editor': {
        func: async function() {
            // --- 语言包由编辑器控件按初始化语言加载，纯查看器无需加载 ---
            // --- 本地完整包包含 ProseMirror，避免首次加载时请求多层 ESM 依赖 ---
            const loaded = await lTool.loadAssets([
                lTool.urlResolve(clickgo.getDirname() + '/', './ext/toastui-editor-all.min.js'),
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/toastui-editor.min.css`,
                `${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/theme/toastui-editor-dark.css`,
            ]);
            const host = window as Window & {
                'toastui'?: Record<string, unknown>;
            };
            if ((!loaded) || (typeof host.toastui?.Editor !== 'function')) {
                return null;
            }
            lTool.loadStyle('.toastui-editor-defaultUI-toolbar,.ProseMirror{box-sizing:initial !important}.toastui-editor-main{background:var(--g-plain-background);border-radius:0 0 3px 3px}.ProseMirror{cursor:text}.jodit ::-webkit-scrollbar{width:6px;cursor:default;}.jodit ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1);border-radius:3px;}.jodit ::-webkit-scrollbar-thumb:hover{background: rgba(0,0,0,.2);}');
            /** --- 模块在当前页面全局共享；缓存最多九种语言，不保存 task 或编辑器实例 --- */
            const languageLoads = new Map<string, Promise<boolean>>();
            /** --- 允许加载的 Toast UI 语言包 --- */
            const languages = ['zh-cn', 'zh-tw', 'ja-jp', 'ko-kr', 'es-es', 'de-de', 'fr-fr', 'pt-br', 'ru-ru'];
            return {
                'Editor': host.toastui.Editor,
                /**
                 * --- 按需加载语言包，所有 task 共用请求及成功结果；失败可重试 ---
                 * @param language Toast UI 语言名，如 zh-CN；英文内置，无需请求
                 * @returns 加载是否成功，不支持的语言返回 false
                 */
                async loadLanguage(language: string): Promise<boolean> {
                    const code = language.toLowerCase();
                    if ((code === 'en') || (code === 'en-us')) {
                        return true;
                    }
                    if (!languages.includes(code)) {
                        return false;
                    }
                    let loading = languageLoads.get(code);
                    if (!loading) {
                        // --- 主库已完成初始化，语言脚本可以安全调用其注册方法 ---
                        loading = lTool.loadScript(`${clickgo.getCdn()}/npm/@toast-ui/editor@3.2.2/dist/i18n/${code}.min.js`).catch(() => false);
                        languageLoads.set(code, loading);
                    }
                    const loaded = await loading;
                    if (loaded) {
                        return true;
                    }
                    if (languageLoads.get(code) === loading) {
                        languageLoads.delete(code);
                    }
                    return false;
                },
            };
        },
        'loading': false,
        'resolve': []
    },
    'konva': {
        func: async function() {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/konva@10.2.3/konva.min.js`,
            ]);
            if (!(window as any).Konva) {
                throw Error('Konva load failed.');
            }
            return (window as any).Konva;
        },
        'loading': false,
        'resolve': []
    },
    'jodit': {
        func: async function() {
            const loaded = await lTool.loadAssets([
                `${clickgo.getCdn()}/npm/jodit@4.17.1/es2015/jodit.fat.min.js`,
                `${clickgo.getCdn()}/npm/jodit@4.17.1/es2015/jodit.fat.min.css`,
            ]);
            if ((!loaded) || (!(window as any).Jodit)) {
                return null;
            }
            lTool.loadStyle('.jodit-container:not(.jodit_inline){border:none;display:flex;flex-direction:column;}.jodit-container:not(.jodit_inline) .jodit-workplace{cursor:text;flex:1;}.jodit-wysiwyg a{color:unset;}');
            return (window as any).Jodit;
        },
        'loading': false,
        'resolve': [],
    },
    'fabric': {
        func: async function() {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/fabric@7.2.0/dist/index.min.js`
            ]);
            if (!(window as any).fabric) {
                throw Error('fabric load failed.');
            }
            return (window as any).fabric;
        },
        'loading': false,
        'resolve': [],
    },
    'pdfjs': {
        func: async function() {
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
        func: async function() {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/qrcode@1.5.1/build/qrcode.js`,
            ]);
            if (!(window as any).QRCode) {
                throw Error('QRCode load failed.');
            }
            return (window as any).QRCode;
        },
        'loading': false,
        'resolve': [],
    },
    'mpegts': {
        func: async function() {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/mpegts.js@1.7.3/dist/mpegts.min.js`,
            ]);
            if (!(window as any).mpegts) {
                throw Error('mpegts load failed.');
            }
            (window as any).mpegts.LoggingControl.enableAll = false;
            return (window as any).mpegts;
        },
        'loading': false,
        'resolve': [],
    },
    'tums-player': {
        func: async function(): Promise<ITumsPlayer> {
            await lTool.loadScripts([
                `${clickgo.getDirname()}/ext/tums-player/tums-player.umd.min.js`,
            ]);
            if (!(window as any)['tums-player']) {
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
            const tp = (window as any)['tums-player'].default;
            /** --- 对讲对象，一个页面只能有一个 --- */
            let client: null | any = null;
            return {
                'default': tp,
                startTalk: (opt): Promise<void> => {
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
        func: async function() {
            await lTool.loadScripts([
                'https://turing.captcha.qcloud.com/TJCaptcha.js',
            ]);
            if (!(window as any).TencentCaptcha) {
                throw Error('TJCaptcha load failed.');
            }
            return (window as any).TencentCaptcha;
        },
        'loading': false,
        'resolve': [],
    },
    // --- cf 验证码 ---
    'turnstile': {
        func: async function() {
            await lTool.loadScripts([
                'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
            ]);
            if (!(window as any).turnstile) {
                throw Error('cft load failed.');
            }
            return (window as any).turnstile;
        },
        'loading': false,
        'resolve': [],
    },
    // --- noVNC ---
    '@novnc/novnc': {
        'version': '1.7.0',
        'loading': false,
        'resolve': [],
    },
    // --- marked ---
    'marked': {
        func: async function() {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/marked@17.0.0/lib/marked.umd.min.js`
            ]);
            if (!(window as any).marked) {
                throw Error('marked load failed.');
            }
            return (window as any).marked;
        },
        'loading': false,
        'resolve': [],
    },
    // --- pdf-lib ---
    'pdf-lib': {
        func: async function() {
            await lTool.loadScripts([
                `${clickgo.getCdn()}/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js`
            ]);
            if (!(window as any).PDFLib) {
                throw Error('pdf-lib load failed.');
            }
            return (window as any).PDFLib;
        },
        'loading': false,
        'resolve': [],
    },
};

/**
 * --- 注册模块 ---
 * @param current 当前任务 id
 * @param name 模块名
 * @param opt 选项
 */
export async function regModule(current: TCurrent, name: string, opt: {
    /** --- ESM 模式必填 --- */
    'version'?: string;
    /** --- 除 ESM 模式外必填 --- */
    func?: () => any | Promise<any>;
}): Promise<boolean> {
    if ( !(await lTask.checkPermission(current, 'root'))[0]) {
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
export function checkModule(name: string): boolean {
    return modules[name] !== undefined;
}

export async function getModule(name: 'monaco-editor'): Promise<IMonacoLoader | null>;
export async function getModule(name: 'tums-player'): Promise<ITumsPlayer | null>;
export async function getModule(name: 'mpegts'): Promise<typeof mpegts.default | null>;
export async function getModule(name: 'fabric'): Promise<typeof fabric | null>;
export async function getModule(name: string): Promise<any | null>;
/**
 * --- 获取模块内容，通常用于异步加载模块时使用 ---
 * @param name 模块名
 * @returns 模块对象
 */
export async function getModule(name: string): Promise<any | null> {
    if (!(await loadModule(name))) {
        return null;
    }
    return clickgo.modules[name];
}

/**
 * --- 加载模块，返回 true / false ---
 * @param name 模块名
 */
export async function loadModule(name: string): Promise<boolean> {
    if (!modules[name]) {
        // --- 未注册的，加载啥 ---
        return false;
    }
    if (modules[name].loading) {
        // --- 并发调用共用一次加载，并接收相同的成功或失败结果 ---
        return new Promise<boolean>(resolve => {
            modules[name].resolve.push(resolve);
        });
    }
    if (clickgo.modules[name]) {
        // --- 已经加载过了 ---
        return true;
    }
    let loaded = false;
    modules[name].loading = true;
    try {
        // --- 未加载，走加载流程 ---
        let result: unknown;
        if (modules[name].version) {
            // --- ESM 模块 ---
            result = await import(`${clickgo.getCdn()}/npm/${name}@${modules[name].version}/+esm`);
        }
        if (modules[name].func) {
            result = await modules[name].func();
        }
        if ((result === null) || (result === undefined) || (result === false)) {
            return false;
        }
        // --- 全部依赖成功后再发布模块，避免其他控件读到未完成的结果 ---
        clickgo.modules[name] = result;
        loaded = true;
        return true;
    }
    catch {
        return false;
    }
    finally {
        modules[name].loading = false;
        for (const resolve of modules[name].resolve) {
            resolve(loaded);
        }
        modules[name].resolve.length = 0;
    }
}

// --- 需要初始化 ---

let inited = false;
export function init(): void {
    if (inited) {
        return;
    }
    inited = true;
    config = clickgo.modules.vue.reactive({
        'locale': lTool.lang.getCodeByAccept(),
        'task.position': 'bottom',
        'task.mode': 'bar',
        'task.margin': 8,
        'task.pin': {},
        'desktop.icon.storage': true,
        'desktop.icon.recycler': true,
        'desktop.wallpaper': null,
        'desktop.path': null,
        'launcher.list': [],
    });
    clickgo.modules.vue.watch(config, async function() {
        // --- 检测有没有缺少的 config key ---
        for (const key in configOrigin) {
            if ((config as any)[key] !== undefined) {
                continue;
            }
            lForm.notify({
                'title': 'Warning',
                'content': 'There is a software that maliciously removed the system config item.\nKey: ' + key,
                'type': 'warning'
            });
            (config as any)[key] = (configOrigin as any)[key];
        }
        // --- 有没有多余的或值有问题的 ---
        for (const key in config) {
            if (!Object.keys(configOrigin).includes(key)) {
                lForm.notify({
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
                await trigger('configChanged', 'task.pin', config['task.pin']);
            }
            else {
                // --- 别的要判断值是否和比对组一样 ---
                if ((config as any)[key] === (configOrigin as any)[key]) {
                    continue;
                }
                (configOrigin as any)[key] = (config as any)[key];
                if ((key === 'task.position') || (key === 'task.mode') || (key === 'task.margin')) {
                    lTask.refreshSystemPosition();
                }
                else if (key === 'locale') {
                    lForm.refreshLocaleDirection();
                }
                await trigger('configChanged', key, (config as any)[key]);
            }
        }
    }, {
        'deep': true
    });
    // --- 绑定 resize 事件 ---
    window.addEventListener('resize', function(): void {
        // --- 触发 screenResize 事件 ---
        lTask.refreshSystemPosition();  // --- 会在里面自动触发 screenResize 事件 ---
    });
}

// --- 类型 ---

/** --- Config 对象 --- */
export interface IConfig {
    'locale': string;
    ['task.position']: 'left' | 'right' | 'top' | 'bottom';
    ['task.mode']: 'bar' | 'dock';
    ['task.margin']: number;
    ['task.pin']: Record<string, { 'name': string; 'icon': string; }>;
    ['desktop.icon.storage']: boolean;
    ['desktop.icon.recycler']: boolean;
    ['desktop.wallpaper']: string | null;
    ['desktop.path']: string | null;
    ['launcher.list']: IConfigLauncherItem[];
}

/** --- Launcher 的 item 对象 --- */
export interface IConfigLauncherItem {
    'id'?: string;
    'name': string;
    'path'?: string;
    'icon'?: string;
    'list'?: Array<{ 'id'?: string; 'name': string; 'path': string; 'icon': string; }>;
}

/** --- 屏幕可用区域 --- */
export interface IAvailArea {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
    'owidth': number;
    'oheight': number;
}

/** --- 全局事件类型 --- */
export type TGlobalEvent = 'trayCreated' | 'trayChanged' | 'trayRemoved' | 'error' | 'screenResize' | 'configChanged' | 'formCreated' | 'formRemoved' | 'formTitleChanged' | 'formIconChanged' | 'formStateMinChanged' | 'formStateMaxChanged' | 'formShowChanged' | 'formFocused' | 'formBlurred' | 'formFlash' | 'formShowInSystemTaskChange' | 'formHashChange' | 'taskStarted' | 'taskEnded' | 'webMcpStatusChanged' | 'launcherShowChanged' | 'launcherFolderNameChanged' | 'hashChanged' | 'keydown' | 'keyup';

/** --- 现场下载 app 的参数 --- */
export interface ICoreFetchAppOptions {
    'notify'?: number | {
        /** --- notify id --- */
        'id'?: number;
        /** --- 偏移基准 --- */
        'loaded'?: number;
        /** --- 偏移总量 --- */
        'total'?: number;
    };
    /** --- 网址后面附带的前缀，如 ?123 --- */
    'after'?: string;
    /**
     * --- 下载进度 ---
     * @param loaded 已下载字节
     * @param total 总字节
     * @param per 含偏移进度百分比（0 - 1）
     */
    progress?: (loaded: number, total: number, per: number) => void | Promise<void>;
}

/** --- 应用包解包后对象 --- */
export interface IApp {
    'type': 'app';
    /** --- 控件对象配置文件 --- */
    'config': IAppConfig;
    /** --- 应用图标 --- */
    'icon': string;
    /** --- 新 CGA 的按需解密包读取器 --- */
    'package': IAppPackage;
}

/** --- CGA 包内项目 --- */
export interface IAppPackageEntry {
    'isDirectory': boolean;
    'isFile': boolean;
    'name': string;
}

/** --- CGA 包内项目属性 --- */
export interface IAppPackageStats {
    'isDirectory': boolean;
    'isFile': boolean;
    'size': number;
}

/** --- CGA 按需解密包读取器 --- */
export interface IAppPackage {
    getContent(path: string): Promise<Blob | string | null>;
    stats(path: string): IAppPackageStats | null;
    readDir(path: string): IAppPackageEntry[];
    clear(): void;
}

/** --- 应用文件包 config --- */
export interface IAppConfig {
    /**
     * --- 固定应用 ID，如 net.example.notepad；Native 持久存储必填，跨位置和版本保持不变 ---
     * 1-128 位字母、数字、点、下划线或连字符，以字母或数字开头。
     */
    'id'?: string;
    /** --- 应用名 --- */
    'name': string;
    /** --- 发行版本 --- */
    'ver': number;
    /** --- 发行版本字符串 --- */
    'version': string;
    /** --- 作者 --- */
    'author': string;

    /** --- 将要加载的控件 --- */
    'controls': string[];
    /** --- 将自动加载的主题 --- */
    'themes'?: string[];
    /** --- 将自动申请的权限 --- */
    'permissions'?: string[];
    /** --- 将自动加载的语言包，path: lang --- */
    'locales'?: Record<string, string>;
    /** --- 全局样式，不带扩展名，系统会在末尾添加 .css --- */
    'style'?: string;
    /** --- 图标路径，需包含扩展名 --- */
    'icon'?: string;

    /** --- 将要加载的非 js 文件列表，打包为 cga 模式下此配置可省略 --- */
    'files'?: string[];
    /** --- 要提前加载的库名 --- */
    'modules'?: string[];
}

/** --- Vue 实例 --- */
export interface IVue {
    '$attrs': Record<string, string>;
    '$data': Record<string, any>;
    '$el': HTMLElement;
    $emit(name: string, ...arg: any): void;
    $forceUpdate(): void;
    $nextTick(): Promise<void>;
    '$options': Record<string, any>;
    '$parent': IVue | null;
    '$props': Record<string, any>;
    '$refs': Record<string, HTMLElement & IVue>;
    '$root': IVue;
    '$slots': {
        'default': undefined | ((o?: any) => IVNode[]);
        [key: string]: undefined | ((o?: any) => IVNode[]);
    };
    '$watch': (o: any, cb: (n: any, o: any) => void, opt?: {
        'immediate'?: boolean;
        'deep'?: boolean;
    }) => void;

    [key: string]: any;
}

/** --- Vue 节点 --- */
export interface IVNode {
    'children': {
        'default': undefined | (() => IVNode[]);
        [key: string]: undefined | (() => IVNode[]);
    } & IVNode[];
    'props': Record<string, any>;
    'type': symbol | Record<string, any>;

    [key: string]: any;
}

export interface IVueObject {
    createApp(opt: any): IVApp;
    ref<T extends number | string>(obj: T): { 'value': T; };
    reactive<T>(obj: T): T;
    watch(
        v: any,
        cb: (n: any, o: any) => void | Promise<void>,
        opt: Record<string, string | boolean>
    ): void;
    h(tag: string, props?: Record<string, any> | any[], list?: any[]): any;
}

/** --- Vue 选项合并函数 --- */
export type IVueOptionMergeFunction = (to: unknown, from: unknown, instance: IVue) => any;

/** --- Vue 配置 --- */
export interface IVueConfig {
    errorHandler?(err: unknown, instance: IVue | null, info: string): void;
    'globalProperties': Record<string, any>;
    isCustomElement(tag: string): boolean;
    'optionMergeStrategies': Record<string, IVueOptionMergeFunction>;
    'performance': boolean;
    warnHandler?(msg: string, instance: IVue | null, trace: string): void;
}

/** --- Vue 应用 --- */
export interface IVApp {
    component(name: string): any | undefined;
    component(name: string, config: any): this;
    'config': IVueConfig;
    directive(name: string): any | undefined;
    directive(name: string, config: any): this;
    mixin(mixin: any): this;
    mount(rootContainer: HTMLElement | string): IVue;
    provide<T>(key: string, value: T): this;
    unmount(): void;
    'version': string;

    ['_container']: HTMLElement;
}

export type TCurrent = string | lForm.AbstractForm | lForm.AbstractPanel | lControl.AbstractControl | lCore.AbstractApp;

// --- 模块 ---

/** --- tums-player 模块对象 --- */
export interface ITumsPlayer {
    'default': any;
    /** --- 开始对讲 --- */
    'startTalk': (opt: {
        'sid': string;
        'skey': string;
        'url': string;
        /** --- half_duplex-半双工模式,vad-VAD 人声检测模式,aec-AEC 全双工模式，默认 vad --- */
        'mode'?: 'half_duplex' | 'vad' | 'aec';
    }) => Promise<void>;
    /** --- 停止对讲 --- */
    'stopTalk': () => void;
}

/** --- Monaco 模块的加载资源，编辑器实例由控件在独立 iframe 内创建 --- */
export interface IMonacoLoader {
    /** --- AMD loader 的 data URL --- */
    'loader': string;
    /** --- 编辑器和 Worker 的资源根路径，以 / 结尾 --- */
    'baseUrl': string;
}
