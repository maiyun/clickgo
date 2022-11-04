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
import * as dom from './dom';
import * as tool from './tool';
import * as form from './form';
import * as control from './control';
import * as fs from './fs';
import * as native from './native';

/** --- 当前运行的程序，App 模式下无效 --- */
export const list: Record<number, types.ITask> = {};

/** --- 最后一个 task id，App 模式下无效 --- */
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
 * --- 创建 frame 监听，formId 存在则为窗体范围，否则为任务级范围 ---
 * @param fun 监听回调
 * @param opt 选项,count:执行次数，默认无限次,taskId:APP模式下无效,formId:APP模式下无效
 */
export function onFrame(fun: () => void | Promise<void>, opt: {
    'count'?: number;
    'taskId'?: number;
    'formId'?: number;
} = {}): number {
    const taskId = opt.taskId;
    const formId = opt.formId;
    if (!taskId) {
        return 0;
    }
    const task = list[taskId];
    if (!task) {
        return 0;
    }
    if (formId && !task.forms[formId]) {
        return 0;
    }
    const ft = ++frameTimer;
    /** --- 执行几次，0 代表无限次 --- */
    const count = opt.count ?? 0;
    /** --- 当前已经执行的次数 --- */
    let c: number = 0;
    let timer: number;
    const timerHandler = async (): Promise<void> => {
        ++c;
        if (formId && task.forms[formId] === undefined) {
            // --- form 已经没了 ---
            delete task.timers['1x' + ft.toString()];
            delete frameMaps[ft];
            return;
        }
        await fun();
        if (task.timers['1x' + ft.toString()] == undefined) {
            return;
        }
        if (count > 1) {
            if (c === count) {
                // --- 终止循环 ---
                delete task.timers['1x' + ft.toString()];
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
            delete task.timers['1x' + ft.toString()];
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
    task.timers['1x' + ft.toString()] = formId ?? 0;
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
    if (!list[taskId]) {
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
        'name': list[tid].config.name,
        'locale': list[tid].locale.lang,
        'customTheme': list[tid].customTheme,
        'formCount': Object.keys(list[tid].forms).length,
        'icon': list[tid].app.icon,
        'path': list[tid].path,
        'current': list[tid].current
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
            'name': item.config.name,
            'locale': item.locale.lang,
            'customTheme': item.customTheme,
            'formCount': Object.keys(item.forms).length,
            'icon': item.app.icon,
            'path': item.path,
            'current': item.current
        };
    }
    return rtn;
}

/**
 * --- 运行一个应用，cga 直接文件全部正常加载，url 则静态文件需要去 config 里加载 ---
 * @param url app 路径（以 / 为结尾的路径或以 .cga 结尾的文件）
 * @param opt 选项
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
    // --- 获取并加载 app 对象 ---
    const app = await core.fetchApp(url, {
        'notifyId': notifyId,
        'current': ntask ? ntask.current : undefined,
        'progress': opt.progress
    });
    if (!app) {
        // --- fetch 失败，则返回错误，隐藏 notify ---
        if (notifyId) {
            setTimeout(function(): void {
                form.hideNotify(notifyId);
            }, 2000);
        }
        return -1;
    }
    if (notifyId && !app.net) {
        // --- 仅 app 模式隐藏，net 模式还要在 config 当中加载 xml 等非 js 资源文件 ---
        setTimeout(function(): void {
            form.hideNotify(notifyId);
        }, 2000);
    }
    // --- 申请任务ID ---
    const taskId = ++lastId;
    // --- 注入的参数，屏蔽浏览器全局对象，注入新的对象 ---
    /** --- 不屏蔽的全局对象 --- */
    const unblock = opt.unblock ?? [];
    /** --- 最终注入的对象 --- */
    const invoke: Record<string, any> = {};
    if (!unblock.includes('window')) {
        invoke.window = undefined;
    }
    const ks = Object.getOwnPropertyNames(window);
    for (const k of ks) {
        if (k.includes('Event')) {
            continue;
        }
        if (k.includes('-')) {
            continue;
        }
        if (/^[0-9]+$/.test(k)) {
            continue;
        }
        if ([
            'require',
            '__awaiter', 'eval', 'Math', 'Array', 'Blob', 'Infinity', 'parseInt', 'parseFloat', 'Promise', 'Date', 'JSON', 'fetch'].includes(k)) {
            continue;
        }
        if (unblock.includes(k)) {
            continue;
        }
        invoke[k] = undefined;
    }
    // --- console ---
    invoke.console = {
        log: function(message?: any, ...optionalParams: any[]) {
            console.log(message, ...optionalParams);
        }
    };
    // --- loader ---
    invoke.loader = {
        require: function(paths: string | string[], files: Record<string, Blob | string>, opt?: {
            'executed'?: Record<string, any>;
            'map'?: Record<string, string>;
            'dir'?: string;
            'style'?: string;
            'invoke'?: Record<string, any>;
            'preprocess'?: (code: string, path: string) => string;
        }): any[] {
            return loader.require(paths, files, opt);
        }
    };
    // --- Object ---
    if (!unblock.includes('Object')) {
        invoke.Object = {
            defineProperty: function(): void {
                return;
            },
            keys: function(o: any): string[] {
                return Object.keys(o);
            },
            assign: function(o: any, o2: any): any {
                if (o.controlName !== undefined) {
                    return o;
                }
                return Object.assign(o, o2);
            }
        };
    }
    invoke.navigator = {};
    if (navigator.clipboard) {
        invoke.navigator.clipboard = navigator.clipboard;
    }
    // --- ClickGo 相关 ---
    invoke.invokeClickgo = {
        getVersion: function(): string {
            return clickgo.getVersion();
        },
        isNative(): boolean {
            return clickgo.isNative();
        },
        getPlatform(): string {
            return clickgo.getPlatform();
        },
        isImmersion(): boolean {
            return clickgo.isImmersion();
        },
        hasFrame(): boolean {
            return clickgo.hasFrame();
        },
        'control': {
            'AbstractControl': class extends control.AbstractControl {
                public get taskId(): number {
                    return taskId;
                }
            },
            read: function(blob: Blob): Promise<false | types.TControlPackage> {
                return control.read(blob);
            }
        },
        'core': {
            'config': clickgo.core.config,
            'AbstractApp': class extends core.AbstractApp {
                // eslint-disable-next-line @typescript-eslint/require-await
                public async main(): Promise<void> {
                    return;
                }

                public get taskId(): number {
                    return taskId;
                }
            },
            getCdn: function() {
                return core.getCdn();
            },
            initModules: function(names: string | string[]): Promise<number> {
                return clickgo.core.initModules(names);
            },
            getModule: function(name: string): null | any {
                return clickgo.core.getModule(name);
            },
            readApp: function(blob: Blob): Promise<false | types.IApp> {
                return clickgo.core.readApp(blob);
            },
            getAvailArea: function(): types.IAvailArea {
                return clickgo.core.getAvailArea();
            }
        },
        'dom': {
            setGlobalCursor: function(type?: string): void {
                clickgo.dom.setGlobalCursor(type);
            },
            hasTouchButMouse: function(e: MouseEvent | TouchEvent | PointerEvent): boolean {
                return clickgo.dom.hasTouchButMouse(e);
            },
            getStyleCount: function(taskId: number, type: 'theme' | 'control' | 'form'): number {
                return clickgo.dom.getStyleCount(taskId, type);
            },
            getSize: function(el: HTMLElement): types.IDomSize {
                return clickgo.dom.getSize(el);
            },
            watchSize: function(
                el: HTMLElement,
                cb: (size: types.IDomSize) => Promise<void> | void,
                immediate: boolean = false
            ): types.IDomSize {
                return clickgo.dom.watchSize(el, cb, immediate, taskId);
            },
            unwatchSize: function(el: HTMLElement): void {
                clickgo.dom.unwatchSize(el, taskId);
            },
            clearWatchSize(): void {
                clickgo.dom.clearWatchSize(taskId);
            },
            watch: function(el: HTMLElement, cb: () => void, mode: 'child' | 'childsub' | 'style' | 'default' = 'default', immediate: boolean = false): void {
                clickgo.dom.watch(el, cb, mode, immediate, taskId);
            },
            unwatch: function(el: HTMLElement): void {
                clickgo.dom.unwatch(el, taskId);
            },
            clearWatch: function(): void {
                clickgo.dom.clearWatch(taskId);
            },
            watchStyle: function(
                el: HTMLElement,
                name: string | string[],
                cb: (name: string, value: string) => void,
                immediate: boolean = false
            ): void {
                clickgo.dom.watchStyle(el, name, cb, immediate);
            },
            isWatchStyle: function(el: HTMLElement): boolean {
                return clickgo.dom.isWatchStyle(el);
            },
            bindDown: function(oe: MouseEvent | TouchEvent, opt: types.IBindDownOptions) {
                clickgo.dom.bindDown(oe, opt);
            },
            bindGesture: function(e: MouseEvent | TouchEvent | WheelEvent | { 'x'?: number; 'y'?: number; }, opt: types.IBindGestureOptions): void {
                clickgo.dom.bindGesture(e, opt);
            },
            bindLong: function(
                e: MouseEvent | TouchEvent,
                long: (e: MouseEvent | TouchEvent) => void | Promise<void>
            ): void {
                clickgo.dom.bindLong(e, long);
            },
            bindDrag: function(e: MouseEvent | TouchEvent, opt: { 'el': HTMLElement; 'data'?: any; }): void {
                clickgo.dom.bindDrag(e, opt);
            },
            'is': clickgo.dom.is,
            bindMove: function(e: MouseEvent | TouchEvent, opt: types.IBindMoveOptions): types.IBindMoveResult {
                return clickgo.dom.bindMove(e, opt);
            },
            bindResize: function(e: MouseEvent | TouchEvent, opt: types.IBindResizeOptions): void {
                clickgo.dom.bindResize(e, opt);
            },
            findParentByData: function(el: HTMLElement, name: string): HTMLElement | null {
                return clickgo.dom.findParentByData(el, name);
            },
            findParentByClass: function(el: HTMLElement, name: string): HTMLElement | null {
                return clickgo.dom.findParentByClass(el, name);
            },
            siblings: function(el: HTMLElement): HTMLElement[] {
                return clickgo.dom.siblings(el);
            },
            siblingsData: function(el: HTMLElement, name: string): HTMLElement[] {
                return clickgo.dom.siblingsData(el, name);
            },
            fullscreen: function(): boolean {
                return clickgo.dom.fullscreen();
            }
        },
        'form': {
            'AbstractForm': class extends form.AbstractForm {
                public get taskId(): number {
                    return taskId;
                }
            },
            min: function(fid: number): boolean {
                return clickgo.form.min(fid);
            },
            max: function max(fid: number): boolean {
                return clickgo.form.max(fid);
            },
            close: function(fid: number): boolean {
                return clickgo.form.close(fid);
            },
            bindResize: function(e: MouseEvent | TouchEvent, border: types.TDomBorder): void {
                clickgo.form.bindResize(e, border);
            },
            bindDrag: function(e: MouseEvent | TouchEvent): void {
                clickgo.form.bindDrag(e);
            },
            getTaskId: function(fid: number): number {
                return clickgo.form.getTaskId(fid);
            },
            get: function(fid: number): types.IFormInfo | null {
                return clickgo.form.get(fid);
            },
            getList: function(tid: number): Record<string, types.IFormInfo> {
                return clickgo.form.getList(tid);
            },
            changeFocus: function(fid: number = 0): void {
                clickgo.form.changeFocus(fid);
            },
            getMaxZIndexID: function(out?: {
                'taskIds'?: number[];
                'formIds'?: number[];
            }): number | null {
                return clickgo.form.getMaxZIndexID(out);
            },
            getRectByBorder: function(border: types.TDomBorder): { 'width': number; 'height': number; 'left': number; 'top': number; } {
                return clickgo.form.getRectByBorder(border);
            },
            showCircular: function(x: number, y: number): void {
                clickgo.form.showCircular(x, y);
            },
            moveRectangle: function(border: types.TDomBorder): void {
                clickgo.form.moveRectangle(border);
            },
            showRectangle: function(x: number, y: number, border: types.TDomBorder): void {
                clickgo.form.showRectangle(x, y, border);
            },
            hideRectangle: function(): void {
                clickgo.form.hideRectangle();
            },
            showDrag: function(): void {
                clickgo.form.showDrag();
            },
            moveDrag: function(opt: types.IMoveDragOptions): void {
                clickgo.form.moveDrag(opt);
            },
            hideDrag: function(): void {
                clickgo.form.hideDrag();
            },
            notify: function(opt: types.INotifyOptions): number {
                return clickgo.form.notify(opt);
            },
            notifyProgress: function(notifyId: number, per: number): void {
                clickgo.form.notifyProgress(notifyId, per);
            },
            hideNotify: function(notifyId: number): void {
                clickgo.form.hideNotify(notifyId);
            },
            showPop: function(el: HTMLElement, pop: HTMLElement | undefined, direction: 'h' | 'v' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: { 'size'?: { width?: number; height?: number; }; 'null'?: boolean; } = {}): void {
                clickgo.form.showPop(el, pop, direction, opt);
            },
            hidePop: function(pop?: HTMLElement): void {
                clickgo.form.hidePop(pop);
            },
            dialog: function(opt: string | types.IFormDialogOptions): Promise<string> {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return clickgo.form.dialog(opt);
            },
            confirm: function(opt: string | types.IFormConfirmOptions): Promise<boolean | number> {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return clickgo.form.confirm(opt);
            },
            flash: function(fid: number): void {
                clickgo.form.flash(fid, taskId);
            },
            showLauncher: function(): void {
                clickgo.form.showLauncher();
            },
            hideLauncher: function(): void {
                clickgo.form.hideLauncher();
            }
        },
        'fs': {
            getContent: function(
                path: string,
                options: any = {}
            ): Promise<Blob | string | null> {
                if (!options.files) {
                    options.files = list[taskId].app.files;
                }
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.getContent(path, options);
            },
            putContent: function(path: string, data: string | Buffer, options: any = {}) {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.putContent(path, data, options);
            },
            readLink: function(path: string, options: any = {}): Promise<string | null> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.readLink(path, options);
            },
            symlink: function(fPath: string, linkPath: string, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.symlink(fPath, linkPath, options);
            },
            unlink: function(path: string, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.unlink(path, options);
            },
            stats: function(path: string, options: any = {}): Promise<types.IStats | null> {
                if (!options.files) {
                    options.files = list[taskId].app.files;
                }
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.stats(path, options);
            },
            isDir: function(path: string, options: any = {}): Promise<types.IStats | false> {
                if (!options.files) {
                    options.files = list[taskId].app.files;
                }
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.isDir(path, options);
            },
            isFile: function(path: string, options: any = {}): Promise<types.IStats | false> {
                if (!options.files) {
                    options.files = list[taskId].app.files;
                }
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.isFile(path, options);
            },
            mkdir: function(path: string, mode?: number, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.mkdir(path, mode, options);
            },
            rmdir: function(path: string, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.rmdir(path, options);
            },
            rmdirDeep: function(path: string, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.rmdirDeep(path, options);
            },
            chmod: function(path: string, mod: string | number, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.chmod(path, mod, options);
            },
            rename(oldPath: string, newPath: string, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.rename(oldPath, newPath, options);
            },
            readDir(path: string, options: any = {}): Promise<types.IDirent[]> {
                if (!options.files) {
                    options.files = list[taskId].app.files;
                }
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.readDir(path, options);
            },
            copyFolder(from: string, to: string, options: any = {}): Promise<number> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.copyFolder(from, to, options);
            },
            copyFile(src: string, dest: string, options: any = {}): Promise<boolean> {
                if (!options.current) {
                    options.current = list[taskId].current;
                }
                return clickgo.fs.copyFile(src, dest, options);
            }
        },
        'native': {
            invoke: function(name: string, ...param: any[]): any {
                return clickgo.native.invoke(name, ...param);
            },
            max: function(): void {
                clickgo.native.max();
            },
            min: function(): void {
                clickgo.native.min();
            },
            restore: function(): void {
                clickgo.native.restore();
            },
            size: function(width: number, height: number): void {
                clickgo.native.size(width, height);
            }
        },
        'task': {
            onFrame: function(fun: () => void | Promise<void>, opt: any = {}): number {
                opt.taskId = taskId;
                return clickgo.task.onFrame(fun, opt);
            },
            offFrame: function(ft: number, opt: {
                'taskId'?: number;
            } = {}): void {
                opt.taskId = taskId;
                clickgo.task.offFrame(ft, opt);
            },
            get: function(tid: number): types.ITaskInfo | null {
                return clickgo.task.get(tid);
            },
            getList: function(): Record<string, types.ITaskInfo> {
                return clickgo.task.getList();
            },
            run: function(url: string, opt: types.ITaskRunOptions = {}): Promise<number> {
                opt.taskId = taskId;
                return clickgo.task.run(url, opt);
            },
            end: function(tid: number): boolean {
                return clickgo.task.end(tid ?? taskId);
            },
            loadLocaleData: function(lang: string, data: Record<string, any>, pre: string = ''): void {
                clickgo.task.loadLocaleData(lang, data, pre, taskId);
            },
            loadLocale: function(lang: string, path: string): Promise<boolean> {
                return clickgo.task.loadLocale(lang, path, taskId);
            },
            clearLocale: function(): void {
                clickgo.task.clearLocale(taskId);
            },
            setLocale: function(lang: string, path: string): Promise<boolean> {
                return clickgo.task.setLocale(lang, path, taskId);
            },
            setLocaleLang: function(lang: string): void {
                clickgo.task.setLocaleLang(lang, taskId);
            },
            clearLocaleLang: function(): void {
                clickgo.task.clearLocaleLang(taskId);
            },
            createTimer: function(
                fun: () => void | Promise<void>,
                delay: number,
                opt: types.ICreateTimerOptions = {}
            ): number {
                opt.taskId = taskId;
                return clickgo.task.createTimer(fun, delay, opt);
            },
            removeTimer: function(timer: number): void {
                clickgo.task.removeTimer(timer, taskId);
            },
            sleep: function(fun: () => void | Promise<void>, delay: number): number {
                return clickgo.task.sleep(fun, delay, taskId);
            },
            systemTaskInfo: clickgo.task.systemTaskInfo,
            setSystem: function(fid: number): boolean {
                return clickgo.task.setSystem(fid, taskId);
            },
            clearSystem: function(): boolean {
                return clickgo.task.clearSystem(taskId);
            }
        },
        'theme': {
            read: function(blob: Blob): Promise<types.ITheme | false> {
                return clickgo.theme.read(blob);
            },
            load: async function(theme?: types.ITheme): Promise<boolean> {
                if (!theme) {
                    return false;
                }
                return clickgo.theme.load(theme, taskId);
            },
            remove: function(name: string): Promise<void> {
                return clickgo.theme.remove(name, taskId);
            },
            clear: function(): Promise<void> {
                return clickgo.theme.clear(taskId);
            },
            setGlobal: function(theme: types.ITheme): Promise<void> {
                return clickgo.theme.setGlobal(theme);
            },
            clearGlobal: function(): void {
                clickgo.theme.clearGlobal();
            }
        },
        'tool': {
            blob2ArrayBuffer: function(blob: Blob): Promise<ArrayBuffer> {
                return clickgo.tool.blob2ArrayBuffer(blob);
            },
            clone: function(obj: Record<string, any> | any[]): any[] | any {
                return clickgo.tool.clone(obj);
            },
            sleep: function(ms: number = 0): Promise<boolean> {
                return clickgo.tool.sleep(ms);
            },
            purify: function(text: string): string {
                return clickgo.tool.purify(text);
            },
            rand: function(min: number, max: number): number {
                return clickgo.tool.rand(min, max);
            },
            'RANDOM_N': clickgo.tool.RANDOM_N,
            'RANDOM_U': clickgo.tool.RANDOM_U,
            'RANDOM_L': clickgo.tool.RANDOM_L,
            'RANDOM_UN': clickgo.tool.RANDOM_UN,
            'RANDOM_LN': clickgo.tool.RANDOM_LN,
            'RANDOM_LU': clickgo.tool.RANDOM_LU,
            'RANDOM_LUN': clickgo.tool.RANDOM_LUN,
            'RANDOM_V': clickgo.tool.RANDOM_V,
            'RANDOM_LUNS': clickgo.tool.RANDOM_LUNS,
            random: function(length: number = 8, source: string = clickgo.tool.RANDOM_LN, block: string = ''): string {
                return clickgo.tool.random(length, source, block);
            },
            getBoolean: function(param: boolean | string | number): boolean {
                return clickgo.tool.getBoolean(param);
            },
            getNumber: function(param: string | number): number {
                return clickgo.tool.getNumber(param);
            },
            escapeHTML: function(html: string): string {
                return clickgo.tool.escapeHTML(html);
            },
            request: function(url: string, opt: types.IRequestOptions): Promise<null | any> {
                return clickgo.tool.request(url, opt);
            },
            parseUrl: function(url: string): ILoaderUrl {
                return clickgo.tool.parseUrl(url);
            },
            urlResolve: function(from: string, to: string): string {
                return clickgo.tool.urlResolve(from, to);
            },
            blob2Text: function(blob: Blob): Promise<string> {
                return clickgo.tool.blob2Text(blob);
            },
            blob2DataUrl: function(blob: Blob): Promise<string> {
                return clickgo.tool.blob2DataUrl(blob);
            },
            execCommand: function(ac: string): void {
                clickgo.tool.execCommand(ac);
            }
        },
        'zip': {
            get: function(data?: types.TZipInputFileFormat) {
                return clickgo.zip.get(data);
            }
        }
    };
    /** --- 加载的 js 文件预处理 --- */
    const preprocess = function(code: string, path: string): string {
        // --- 屏蔽 eval 函数 ---
        const exec = /eval\W/.exec(code);
        if (exec) {
            form.notify({
                'title': 'Error',
                'content': `The "eval" is prohibited.\nFile: "${path}".`,
                'type': 'danger'
            });
            return '';
        }
        // --- 给 form 的 class 增加 filename 的 get ---
        code = code.replace(/extends[\s\S]+?\.\s*(AbstractApp|AbstractForm)\s*{/, (t: string) => {
            return t + 'get filename() {return __filename;}';
        });
        return code;
    };
    app.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
    /** --- .cga 文件，或者不含 / 结尾的路径 --- */
    const path = url;
    const lio = path.endsWith('.cga') ? path.lastIndexOf('/') : path.slice(0, -1).lastIndexOf('/');
    const current = path.slice(0, lio);
    // --- 创建任务对象 task.IRT ---
    list[taskId] = {
        'id': taskId,
        'app': app,
        // 'class': null,
        // 'config': {},
        'customTheme': false,
        'locale': clickgo.vue.reactive({
            'lang': '',
            'data': {}
        }),
        'path': path,
        'current': current,

        'runtime': clickgo.vue.reactive({
            'permissions': {},
            'dialogFormIds': []
        }),
        'forms': {},
        'controls': {},
        'timers': {},
        'invoke': invoke
    } as any;
    let expo: any = [];
    try {
        expo = loader.require('/app.js', app.files, {
            'dir': '/',
            'invoke': invoke,
            'preprocess': preprocess,
            'map': {
                'clickgo': '/invoke/clickgo'
            }
        })[0];
    }
    catch (e: any) {
        delete list[taskId];
        core.trigger('error', taskId, 0, e, e.message + '(-1)');
        return -2;
    }
    if (!expo?.default) {
        delete list[taskId];
        return -3;
    }
    // --- 创建 Task 总 style ---
    dom.createToStyleList(taskId);
    // --- 触发 taskStarted 事件 ---
    core.trigger('taskStarted', taskId);
    // --- 第一个任务给 native 发送任务启动成功的消息 ---
    if (taskId === 1) {
        native.invoke('cg-init', native.getToken());
    }
    // --- 执行 app ---
    const appCls: core.AbstractApp = new expo.default();
    await appCls.main();
    if (!list[taskId].class) {
        // --- 创建任务失败，也可能没设置 config，报弹窗错误，清理启动应用并返回错误 ---
        // --- 结束任务 ---
        delete list[taskId];
        dom.removeFromStyleList(taskId);
        core.trigger('taskEnded', taskId);
        return -4;
    }
    return taskId;
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
    if (clickgo.isNative() && (taskId === 1)) {
        native.invoke('cg-close', native.getToken());
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
        core.trigger('formRemoved', taskId, f.id, f.vroot.$refs.form.title, f.vroot.$refs.form.iconDataUrl);
        try {
            f.vapp.unmount();
        }
        catch (err: any) {
            const msg = `Message: ${err.message}\nTask id: ${task.id}\nForm id: ${fid}\nFunction: task.end, unmount.`;
            form.notify({
                'title': 'Runtime Error',
                'content': msg,
                'type': 'danger'
            });
            console.log('Runtime Error', msg, err);
        }
        f.vapp._container.remove();
    }
    const flist = document.querySelectorAll('#cg-form-list > [data-task-id="' + taskId.toString() + '"]');
    for (const f of flist) {
        f.remove();
    }
    // --- 移除 style ---
    dom.removeFromStyleList(taskId);
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
 * @param path 绝对或者相对 app 路径的地址
 * @param taskId 所属的 taskId，App 模式下无效
 */
export async function loadLocale(lang: string, path: string, taskId?: number): Promise<boolean> {
    if (!taskId) {
        return false;
    }
    const task = list[taskId];
    if (!task) {
        return false;
    }
    /** --- 当前父 form 的路径（以 / 结尾）或 /（没有基路径的话） --- */
    path = tool.urlResolve(task.current + '/', path) + '.json';
    /** --- 获取的语言文件 --- */
    const fcontent = await fs.getContent(path, {
        'encoding': 'utf8',
        'files': task.app.files,
        'current': task.current
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
 * @param path 绝对或者相对 app 路径的地址
 * @param taskId 所属的 taskId，App 模式下无效z
 */
export function setLocale(lang: string, path: string, taskId?: number): Promise<boolean> {
    clearLocale(taskId);
    return loadLocale(lang, path, taskId);
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
    const formId = opt.formId;
    if (!taskId) {
        return 0;
    }
    const task = list[taskId];
    if (!task) {
        return 0;
    }
    if (formId && !task.forms[formId]) {
        return 0;
    }
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
        if (formId && task.forms[formId] === undefined) {
            // --- form 已经没了 ---
            clearTimeout(timer);
            delete task.timers[timer];
            return;
        }
        const r = fun();
        if (r instanceof Promise) {
            r.catch(function(e) {
                console.log(e);
            });
        }
        if (count > 0 && c === count) {
            clearTimeout(timer);
            delete task.timers[timer];
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
    task.timers[timer] = formId ?? 0;
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
 */
export function sleep(fun: () => void | Promise<void>, delay: number, taskId?: number): number {
    return createTimer(fun, delay, {
        'taskId': taskId,
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
 * @param formId task bar 的 form id
 * @param taskId task id，App 模式下无效
 */
export function setSystem(formId: number, taskId?: number): boolean {
    if (!taskId) {
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
 * --- 刷新系统任务的 form 的位置以及 length，App 模式下无效 ---
 */
export function refreshSystemPosition(): void {
    if (systemTaskInfo.taskId > 0) {
        const form = list[systemTaskInfo.taskId].forms[systemTaskInfo.formId];
        // --- 更新 task bar 的位置 ---
        switch (core.config['task.position']) {
            case 'left':
            case 'right': {
                form.vroot.$refs.form.setPropData('width', 0);
                form.vroot.$refs.form.setPropData('height', window.innerHeight);
                break;
            }
            case 'top':
            case 'bottom': {
                form.vroot.$refs.form.setPropData('width', window.innerWidth);
                form.vroot.$refs.form.setPropData('height', 0);
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
