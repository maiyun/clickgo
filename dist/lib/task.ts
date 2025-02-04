/**
 * Copyright 2024 Han Guoshuai <zohegs@gmail.com>
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
import * as theme from './theme';
import * as native from './native';

/** --- 当前运行的程序，App 模式下无效 --- */
export const list: Record<number, types.ITask> = {};

/** --- 最后一个 task id，App 模式下无效 --- */
export let lastId: number = 0;

/** --- 当前有焦点的任务 ID --- */
let focusId: number | null = null;

/**
 * --- 设置 task focus id ---
 * @param id id 或 null
 */
export function setFocus(id?: number): void {
    focusId = id ?? null;
}

/** --- 获取当前有焦点的任务 ID --- */
export function getFocus(): number | null {
    return focusId;
}

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
    },
    'ko': {
        'loading': '로딩 중...'
    },
    'th': {
        'loading': 'กำลังโหลด...'
    },
    'es': {
        'loading': 'Cargando...'
    },
    'de': {
        'loading': 'Laden...'
    },
    'fr': {
        'loading': 'Chargement en cours...'
    },
    'pt': {
        'loading': 'Carregando...'
    },
    'ru': {
        'loading': 'Загрузка...'
    },
    'vi': {
        'loading': 'Đang tải...'
    }
};

// --- 创建 frame 监听 ---
let frameTimer: number = 0;
const frameMaps: Record<string, number> = {};

/**
 * --- 创建 frame 监听，formId 存在则为窗体范围，否则为任务级范围 ---
 * @param fun 监听回调
 * @param opt 选项,count:执行次数，默认无限次,formId:限定在当前任务的某个窗体,taskId:APP模式下无效
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
                        console.log('task.onFrame: -3', e);
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
                    console.log('task.onFrame: -2', e);
                });
            });
            frameMaps[ft] = timer;
        }
    };
    /** --- timer 对象 number --- */
    timer = requestAnimationFrame(function() {
        timerHandler().catch(function(e) {
            console.log('task.onFrame: -1', e);
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
        'name': list[tid].app.config.name,
        'locale': list[tid].locale.lang,
        'customTheme': list[tid].customTheme,
        'formCount': Object.keys(list[tid].forms).length,
        'icon': list[tid].app.icon,
        'path': list[tid].path,
        'current': list[tid].current
    };
}

/**
 * --- 获取某个任务的已授权权限列表 ---
 * @param tid 任务 id
 */
export function getPermissions(tid: number): string[] {
    if (list[tid] === undefined) {
        return [];
    }
    return tool.clone(list[tid].runtime.permissions);
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
            'icon': item.app.icon,
            'path': item.path,
            'current': item.current
        };
    }
    return rtn;
}

/**
 * --- 运行一个应用，cga 直接文件全部正常加载，url 则静态文件需要去 config 里加载 ---
 * @param url app 路径（以 / 为结尾的路径或以 .cga 结尾的文件），或 APP 包对象
 * @param opt 选项
 * @param ntid App 模式下无效
 */
export async function run(url: string | types.IApp, opt: types.ITaskRunOptions = {}, ntid?: number): Promise<number> {
    let app: types.IApp | null = null;
    if (typeof url === 'string') {
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
        // --- 非 ntid 模式下 current 以 location 为准 ---
        if (!ntid &&
            !url.startsWith('/clickgo/') &&
            !url.startsWith('/storage/') &&
            !url.startsWith('/mounted/') &&
            !url.startsWith('/package/') &&
            !url.startsWith('/current/')
        ) {
            url = tool.urlResolve(location.href, url);
        }
        // --- 获取并加载 app 对象 ---
        app = await core.fetchApp(url, {
            'notifyId': notifyId,
            'progress': opt.progress,
            'cache': opt.cache
        }, ntid);
        // --- 无论是否成功，都可以先隐藏 notify 了 ---
        if (notifyId) {
            setTimeout(function(): void {
                form.hideNotify(notifyId);
            }, 3000);
        }
    }
    else if (url.type !== 'app') {
        return -1;
    }
    else {
        app = url;
    }
    if (!app) {
        return -1;
    }
    // --- 申请任务ID ---
    const taskId = ++lastId;
    // --- 注入的参数，屏蔽一些全局对象 ---
    const blocks = ['document', 'localStorage'];
    /** --- 最终注入的对象 --- */
    const invoke: Record<string, any> = {};
    const ks = Object.getOwnPropertyNames(window);
    invoke.window = {};
    for (const k of ks) {
        if (blocks.includes(k)) {
            continue;
        }
        invoke.window[k] = (window as Record<string, any>)[k];
    }
    for (const block of blocks) {
        invoke[block] = undefined;
    }
    // --- console ---
    invoke.console = {
        assert: function(condition?: boolean, ...data: any[]): void {
            console.assert(condition, ...data);
        },
        clear: function(): void {
            console.clear();
        },
        count: function(label?: string): void {
            console.count(label);
        },
        countReset: function(label?: string): void {
            console.countReset(label);
        },
        debug: function(...data: any[]): void {
            console.debug(...data);
        },
        dir: function(item?: any, options?: any): void {
            console.dir(item, options);
        },
        dirxml: function(...data: any[]): void {
            console.dirxml(...data);
        },
        error: function(...data: any[]): void {
            console.error(...data);
        },
        group: function(...data: any[]): void {
            console.group(...data);
        },
        groupCollapsed: function(...data: any[]): void {
            console.groupCollapsed(...data);
        },
        groupEnd: function(): void {
            console.groupEnd();
        },
        info: function(...data: any[]): void {
            console.info(...data);
        },
        log: function(...data: any[]): void {
            console.log(...data);
        },
        table: function(tabularData?: any, properties?: string[]): void {
            console.table(tabularData, properties);
        },
        time: function(label?: string): void {
            console.time(label);
        },
        timeEnd: function(label?: string): void {
            console.timeEnd(label);
        },
        timeLog: function(label?: string, ...data: any[]): void {
            console.timeLog(label, ...data);
        },
        timeStamp: function(label?: string): void {
            console.timeStamp(label);
        },
        trace: function(...data: any[]): void {
            console.trace(...data);
        },
        warn: function(...data: any[]): void {
            console.warn(...data);
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
            'global': clickgo.tool.clone(clickgo.core.global),
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
            getModule: function(name: string): null | any {
                return core.getModule(name);
            },
            readApp: function(blob: Blob): Promise<false | types.IApp> {
                return core.readApp(blob);
            },
            getAvailArea: function(): types.IAvailArea {
                return core.getAvailArea();
            },
            hash: function(hash: string): boolean {
                return core.hash(hash, taskId);
            },
            getHash: function(): string {
                return core.getHash();
            },
            getHost: function(): string {
                return core.getHost();
            },
            location: function(url: string): boolean {
                return core.location(url, taskId);
            },
            getLocation: function(): string {
                return core.getLocation();
            },
            back: function(): boolean {
                return core.back(taskId);
            },
            open: function(url: string): void {
                core.open(url);
            }
        },
        'dom': {
            inPage: function(el: HTMLElement): boolean {
                return dom.inPage(el);
            },
            'dpi': dom.dpi,
            setGlobalCursor: function(type?: string): void {
                dom.setGlobalCursor(type);
            },
            hasTouchButMouse: function(e: MouseEvent | TouchEvent | PointerEvent): boolean {
                return dom.hasTouchButMouse(e);
            },
            getStyleCount: function(taskId: number, type: 'theme' | 'control' | 'form'): number {
                return dom.getStyleCount(taskId, type);
            },
            watchPosition: function(el: HTMLElement, cb: (tate: {
                'position': boolean;
                'size': boolean;
            }) => void | Promise<void>, immediate: boolean = false
            ): boolean {
                return dom.watchPosition(el, cb, immediate);
            },
            unwatchPosition: function(el: HTMLElement): void {
                dom.unwatchPosition(el);
            },
            isWatchPosition: function(el: HTMLElement): boolean {
                return dom.isWatchPosition(el);
            },
            getWatchSizeCount: function(taskId?: number): number {
                return dom.getWatchSizeCount(taskId);
            },
            watchSize: function(
                el: HTMLElement,
                cb: () => void | Promise<void>,
                immediate: boolean = false
            ): boolean {
                return dom.watchSize(el, cb, immediate, taskId);
            },
            unwatchSize: function(el: HTMLElement): void {
                dom.unwatchSize(el, taskId);
            },
            isWatchSize: function(el: HTMLElement): boolean {
                return dom.isWatchSize(el);
            },
            getWatchCount: function(taskId?: number): number {
                return dom.getWatchCount(taskId);
            },
            watch: function(el: HTMLElement, cb: (mutations: MutationRecord[]) => void | Promise<void>, mode: 'child' | 'childsub' | 'style' | 'default' = 'default', immediate: boolean = false): void {
                dom.watch(el, cb, mode, immediate, taskId);
            },
            unwatch: function(el: HTMLElement): void {
                dom.unwatch(el, taskId);
            },
            isWatch(el: HTMLElement): boolean {
                return dom.isWatch(el);
            },
            watchStyle: function(
                el: HTMLElement,
                name: string | string[],
                cb: (name: string, value: string, old: string) => void | Promise<void>,
                immediate: boolean = false
            ): void {
                dom.watchStyle(el, name, cb, immediate);
            },
            isWatchStyle: function(el: HTMLElement): boolean {
                return dom.isWatchStyle(el);
            },
            watchProperty: function(
                el: HTMLElement,
                name: string | string[],
                cb: (name: string, value: any) => void | Promise<void>,
                immediate: boolean = false
            ): void {
                dom.watchProperty(el, name, cb, immediate);
            },
            isWatchProperty(el: HTMLElement): boolean {
                return dom.isWatchProperty(el);
            },
            getWatchInfo: function(): types.IGetWatchInfoResult {
                return dom.getWatchInfo();
            },
            bindClick: function(
                e: MouseEvent | TouchEvent,
                handler: (e: MouseEvent | TouchEvent, x: number, y: number) => void | Promise<void>
            ): void {
                dom.bindClick(e, handler);
            },
            bindDblClick: function(
                e: MouseEvent | TouchEvent,
                handler: (e: MouseEvent | TouchEvent) => void | Promise<void>
            ): void {
                dom.bindDblClick(e, handler);
            },
            bindDown: function<T extends MouseEvent | TouchEvent>(oe: T, opt: types.IBindDownOptions<T>) {
                dom.bindDown(oe, opt);
            },
            bindScale: function(oe: MouseEvent | TouchEvent | WheelEvent, handler: (e: MouseEvent | TouchEvent | WheelEvent, scale: number, cpos: { 'x': number; 'y': number; }) => void | Promise<void>): void {
                dom.bindScale(oe, handler);
            },
            bindGesture: function(oe: MouseEvent | TouchEvent | WheelEvent, before: (e: MouseEvent | TouchEvent | WheelEvent, dir: 'top' | 'right' | 'bottom' | 'left') => number, handler: (dir: 'top' | 'right' | 'bottom' | 'left') => void): void {
                dom.bindGesture(oe, before, handler);
            },
            bindLong: function(
                e: MouseEvent | TouchEvent,
                long: (e: MouseEvent | TouchEvent) => void | Promise<void>
            ): void {
                dom.bindLong(e, long);
            },
            setDragData(data?: string | number | boolean | Record<string, any>): void {
                dom.setDragData(data);
            },
            bindDrag: function(e: MouseEvent | TouchEvent, opt: {
                'el': HTMLElement;
                'data'?: any;

                'start'?: (x: number, y: number) => any;
                'move'?: (e: MouseEvent | TouchEvent, opt: types.IBindMoveMoveOptions) => void;
                'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
            }): void {
                dom.bindDrag(e, opt);
            },
            'is': dom.is,
            bindMove: function(e: MouseEvent | TouchEvent, opt: types.IBindMoveOptions): types.IBindMoveResult {
                return dom.bindMove(e, opt);
            },
            bindResize: function(e: MouseEvent | TouchEvent, opt: types.IBindResizeOptions): void {
                dom.bindResize(e, opt);
            },
            findParentByData: function(el: HTMLElement, name: string, value?: string): HTMLElement | null {
                return dom.findParentByData(el, name, value);
            },
            findParentByClass: function(el: HTMLElement, name: string): HTMLElement | null {
                return dom.findParentByClass(el, name);
            },
            findParentByTag: function(el: HTMLElement, name: string): HTMLElement | null {
                return dom.findParentByTag(el, name);
            },
            index: function(el: HTMLElement): number {
                return dom.index(el);
            },
            siblings: function(el: HTMLElement): HTMLElement[] {
                return dom.siblings(el);
            },
            siblingsData: function(el: HTMLElement, name: string): HTMLElement[] {
                return dom.siblingsData(el, name);
            },
            fullscreen: function() {
                return dom.fullscreen();
            },
            exitFullscreen: function() {
                return dom.exitFullscreen();
            },
            createElement: function<T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap[T] {
                return dom.createElement(tagName);
            }
        },
        'form': {
            'AbstractPanel': class extends form.AbstractPanel {
                public get taskId(): number {
                    return taskId;
                }
            },
            'AbstractForm': class extends form.AbstractForm {
                public get taskId(): number {
                    return taskId;
                }
            },
            min: function(fid: number): boolean {
                return form.min(fid);
            },
            max: function max(fid: number): boolean {
                return form.max(fid);
            },
            close: function(fid: number): boolean {
                return form.close(fid);
            },
            bindResize: function(e: MouseEvent | TouchEvent, border: types.TDomBorder): void {
                form.bindResize(e, border);
            },
            bindDrag: function(e: MouseEvent | TouchEvent): void {
                form.bindDrag(e);
            },
            getTaskId: function(fid: number): number {
                return form.getTaskId(fid);
            },
            get: function(fid: number): types.IFormInfo | null {
                return form.get(fid);
            },
            getList: function(tid: number): Record<string, types.IFormInfo> {
                return form.getList(tid);
            },
            getFocus: function(): number | null {
                return form.getFocus();
            },
            getActivePanel: function(formId: number): number[] {
                return form.getActivePanel(formId);
            },
            removeActivePanel: function(panelId: number, formId: number): boolean {
                return form.removeActivePanel(panelId, formId, taskId);
            },
            setActivePanel: function(panelId: number, formId: number): boolean {
                return form.setActivePanel(panelId, formId, taskId);
            },
            hash: function(hash: string, formId: number): boolean {
                return form.hash(hash, formId);
            },
            getHash: function(formId: number): string {
                return form.getHash(formId);
            },
            hashBack: function(formId: number): Promise<boolean> {
                return form.hashBack(formId);
            },
            changeFocus: function(fid: number = 0): void {
                form.changeFocus(fid);
            },
            getMaxZIndexID: function(out?: {
                'taskIds'?: number[];
                'formIds'?: number[];
            }): number | null {
                return form.getMaxZIndexID(out);
            },
            getRectByBorder: function(border: types.TDomBorder): { 'width': number; 'height': number; 'left': number; 'top': number; } {
                return form.getRectByBorder(border);
            },
            showCircular: function(x: number, y: number): void {
                form.showCircular(x, y);
            },
            moveRectangle: function(border: types.TDomBorder): void {
                form.moveRectangle(border);
            },
            showRectangle: function(x: number, y: number, border: types.TDomBorder): void {
                form.showRectangle(x, y, border);
            },
            hideRectangle: function(): void {
                form.hideRectangle();
            },
            showDrag: function(): void {
                form.showDrag();
            },
            moveDrag: function(opt: types.IMoveDragOptions): void {
                form.moveDrag(opt);
            },
            hideDrag: function(): void {
                form.hideDrag();
            },
            alert: function(content: string, type?: 'default' | 'primary' | 'info' | 'warning' | 'danger'): number {
                return form.alert(content, type);
            },
            notify: function(opt: types.INotifyOptions): number {
                return form.notify(opt);
            },
            notifyProgress: function(notifyId: number, per: number): void {
                form.notifyProgress(notifyId, per);
            },
            notifyContent: function(notifyId: number, opt: types.INotifyContentOptions): void {
                form.notifyContent(notifyId, opt);
            },
            hideNotify: function(notifyId: number): void {
                form.hideNotify(notifyId);
            },
            showPop: function(el: HTMLElement, pop: HTMLElement | undefined, direction: 'h' | 'v' | 't' | MouseEvent | TouchEvent | { x: number; y: number; }, opt: {
                'size'?: { width?: number; height?: number; };
                'null'?: boolean;
                'autoPosition'?: boolean;
                'autoScroll'?: boolean;
                'flow'?: boolean;
                'way'?: 'normal' | 'click' | 'hover';
            } = {}): void {
                form.showPop(el, pop, direction, opt);
            },
            hidePop: function(pop?: HTMLElement): void {
                form.hidePop(pop);
            },
            isJustPop: function(el: HTMLElement): boolean {
                return form.isJustPop(el);
            },
            doFocusAndPopEvent: function(e: MouseEvent | TouchEvent): void {
                form.doFocusAndPopEvent(e);
            },
            removePanel(id: number, vapp: types.IVApp, el: HTMLElement): boolean {
                return form.removePanel(id, vapp, el);
            },
            createPanel<T extends form.AbstractPanel>(
                rootPanel: control.AbstractControl,
                cls: string | (new () => T),
                opt?: {
                    'layout'?: string;
                    'style'?: string;
                    'path'?: string;
                }
            ): Promise<{
                'vapp': types.IVApp;
                'vroot': T;
            }> {
                return form.createPanel(rootPanel, cls, opt, taskId);
            },
            create: function<T extends form.AbstractForm>(
                cls: string | (new () => T),
                data?: Record<string, any>,
                opt?: {
                    'layout'?: string;
                    'style'?: string;
                    'path'?: string;
                }
            ): Promise<T> {
                return form.create(cls, data, opt, taskId);
            },
            dialog: function(opt: string | types.IFormDialogOptions): Promise<string> {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return form.dialog(opt);
            },
            confirm: function(opt: string | types.IFormConfirmOptions): Promise<boolean | number> {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return form.confirm(opt);
            },
            prompt: function(opt: string | types.IFormPromptOptions): Promise<string> {
                if (typeof opt === 'string') {
                    opt = {
                        'content': opt
                    };
                }
                opt.taskId = taskId;
                return form.prompt(opt);
            },
            flash: function(fid: number): void {
                form.flash(fid, taskId);
            },
            showLauncher: function(): void {
                form.showLauncher();
            },
            hideLauncher: function(): void {
                form.hideLauncher();
            }
        },
        'fs': {
            mount: function(name: string, handler: types.IMountHandler): boolean {
                return clickgo.fs.mount(name, handler, taskId);
            },
            unmount: function(name: string): Promise<boolean> {
                return clickgo.fs.unmount(name);
            },
            getContent: function(
                path: string,
                options: any = {}
            ): Promise<Blob | string | null> {
                return fs.getContent(path, options, taskId);
            },
            putContent: function(path: string, data: string | Blob, options: any = {}) {
                return fs.putContent(path, data, options, taskId);
            },
            readLink: function(path: string, options: any = {}): Promise<string | null> {
                return fs.readLink(path, options, taskId);
            },
            symlink: function(fPath: string, linkPath: string, options: any = {}): Promise<boolean> {
                return fs.symlink(fPath, linkPath, options, taskId);
            },
            unlink: function(path: string): Promise<boolean> {
                return fs.unlink(path, taskId);
            },
            stats: function(path: string): Promise<types.IStats | null> {
                return fs.stats(path, taskId);
            },
            isDir: function(path: string): Promise<types.IStats | false> {
                return fs.isDir(path, taskId);
            },
            isFile: function(path: string): Promise<types.IStats | false> {
                return fs.isFile(path, taskId);
            },
            mkdir: function(path: string, mode?: number): Promise<boolean> {
                return fs.mkdir(path, mode, taskId);
            },
            rmdir: function(path: string): Promise<boolean> {
                return fs.rmdir(path, taskId);
            },
            rmdirDeep: function(path: string): Promise<boolean> {
                return fs.rmdirDeep(path, taskId);
            },
            chmod: function(path: string, mod: string | number): Promise<boolean> {
                return fs.chmod(path, mod, taskId);
            },
            rename(oldPath: string, newPath: string): Promise<boolean> {
                return fs.rename(oldPath, newPath, taskId);
            },
            readDir(path: string, encoding?: BufferEncoding): Promise<types.IDirent[]> {
                return fs.readDir(path, encoding, taskId);
            },
            copyFolder(from: string, to: string, options: any = {}): Promise<number> {
                return fs.copyFolder(from, to, options, taskId);
            },
            copyFile(src: string, dest: string): Promise<boolean> {
                return fs.copyFile(src, dest, taskId);
            }
        },
        'native': {
            on(
                name: string,
                handler: (...param: any[]) => any | Promise<any>,
                once: boolean = false,
                formId?: number
            ): void {
                native.on(name, handler, once, formId, taskId);
            },
            once(
                name: string,
                handler: (...param: any[]) => any | Promise<any>,
                formId?: number
            ): void {
                native.once(name, handler, formId, taskId);
            },
            off(name: string, formId?: number): void {
                native.off(name, formId, taskId);
            },
            clear(formId?: number, taskId?: number): void {
                native.clear(formId, taskId);
            },
            getListenerList(taskId?: number): Record<string, Record<string, Record<string, number>>> {
                return native.getListenerList(taskId);
            },
            invoke: function(name: string, ...param: any[]): Promise<any> {
                return native.invoke(name, ...param);
            },
            max: async function(): Promise<void> {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.max();
            },
            min: async function(): Promise<void> {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.min();
            },
            restore: async function(): Promise<void> {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.restore();
            },
            size: async function(width: number, height: number): Promise<void> {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.size(width, height);
            },
            maximizable: async function(val: boolean): Promise<void> {
                const rtn = await checkPermission('native.form', false, undefined, taskId);
                if (!rtn[0]) {
                    return;
                }
                await native.maximizable(val);
            },
            ping: function(val: string): Promise<string> {
                return native.ping(val);
            },
            isMax: function(): Promise<boolean> {
                return native.isMax();
            }
        },
        'storage': {
            get: function(key: string): any {
                return clickgo.storage.get(key, taskId);
            },
            set: function(key: string, val: string | number | any[] | Record<string, any>): boolean {
                return clickgo.storage.set(key, val, taskId);
            },
            remove: function(key: string): boolean {
                return clickgo.storage.remove(key, taskId);
            },
            list: function(): Record<string, number> {
                return clickgo.storage.list(taskId);
            },
            all: function(): Record<string, number> {
                return clickgo.storage.all();
            },
            clear: function(path: string): Promise<number> {
                return clickgo.storage.clear(path);
            }
        },
        'task': {
            getFocus: function(): number | null {
                return focusId;
            },
            onFrame: function(fun: () => void | Promise<void>, opt: any = {}): number {
                opt.taskId = taskId;
                return onFrame(fun, opt);
            },
            offFrame: function(ft: number, opt: {
                'taskId'?: number;
            } = {}): void {
                opt.taskId = taskId;
                offFrame(ft, opt);
            },
            get: function(tid: number): types.ITaskInfo | null {
                return get(tid);
            },
            getPermissions: function(tid: number): string[] {
                return getPermissions(tid);
            },
            getList: function(): Record<string, types.ITaskInfo> {
                return getList();
            },
            run: function(url: string, opt: types.ITaskRunOptions = {}): Promise<number> {
                if (opt.permissions) {
                    if (!list[taskId]?.runtime.permissions.includes('root')) {
                        opt.permissions = undefined;
                    }
                }
                return run(url, opt, taskId);
            },
            checkPermission: function(
                vals: string | string[],
                apply: boolean = false,
                applyHandler?: (list: string[]) => void | Promise<void>
            ): Promise<boolean[]> {
                return checkPermission(vals, apply, applyHandler, taskId);
            },
            end: function(tid: number): boolean {
                return end(tid ?? taskId);
            },
            loadLocaleData: function(lang: string, data: Record<string, any>, pre: string = ''): void {
                loadLocaleData(lang, data, pre, taskId);
            },
            loadLocale: function(lang: string, path: string): Promise<boolean> {
                return loadLocale(lang, path, taskId);
            },
            clearLocale: function(): void {
                clearLocale(taskId);
            },
            setLocale: function(lang: string, path: string): Promise<boolean> {
                return setLocale(lang, path, taskId);
            },
            setLocaleLang: function(lang: string): void {
                setLocaleLang(lang, taskId);
            },
            clearLocaleLang: function(): void {
                clearLocaleLang(taskId);
            },
            createTimer: function(
                fun: () => void | Promise<void>,
                delay: number,
                opt: types.ICreateTimerOptions = {}
            ): number {
                opt.taskId = taskId;
                return createTimer(fun, delay, opt);
            },
            removeTimer: function(timer: number): void {
                removeTimer(timer, taskId);
            },
            sleep: function(fun: () => void | Promise<void>, delay: number): number {
                return sleep(fun, delay, taskId);
            },
            'systemTaskInfo': clickgo.task.systemTaskInfo,
            setSystem: function(fid: number): boolean {
                return setSystem(fid, taskId);
            },
            clearSystem: function(): boolean {
                return clearSystem(taskId);
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
            compressor: function<T extends File | Blob>(file: T, options: {
                /** --- 最大宽度，默认无限 --- */
                'maxWidth'?: number;
                /** --- 最高高度，默认无限 --- */
                'maxHeight'?: number;
                /** --- 压缩质量，默认 0.8 --- */
                'quality'?: number;
            } = {}): Promise<File | Blob | false> {
                return tool.compressor(file, options);
            },
            blob2ArrayBuffer: function(blob: Blob): Promise<ArrayBuffer> {
                return tool.blob2ArrayBuffer(blob);
            },
            sizeFormat: function(size: number, spliter: string = ' '): string {
                return tool.sizeFormat(size, spliter);
            },
            weightFormat: function(weight: number, spliter: string = ' '): string {
                return tool.weightFormat(weight, spliter);
            },
            clone: function(obj: Record<string, any> | any[]): any[] | any {
                return tool.clone(obj);
            },
            sleep: function(ms: number = 0): Promise<boolean> {
                return tool.sleep(ms);
            },
            nextFrame(): Promise<void> {
                return tool.nextFrame();
            },
            sleepFrame(count: number): Promise<void> {
                return tool.sleepFrame(count);
            },
            purify: function(text: string): string {
                return tool.purify(text);
            },
            match: function(str: string, regs: RegExp[]): boolean {
                return tool.match(str, regs);
            },
            layoutAddTagClassAndReTagName: function(layout: string, retagname: boolean): string {
                return tool.layoutAddTagClassAndReTagName(layout, retagname);
            },
            layoutClassPrepend: function(layout: string, preps: string[]): string {
                return tool.layoutClassPrepend(layout, preps);
            },
            stylePrepend: function(style: string, prep: string = ''): { 'style': string; 'prep': string; } {
                return tool.stylePrepend(style, prep);
            },
            rand: function(min: number, max: number): number {
                return tool.rand(min, max);
            },
            'RANDOM_N': tool.RANDOM_N,
            'RANDOM_U': tool.RANDOM_U,
            'RANDOM_L': tool.RANDOM_L,
            'RANDOM_UN': tool.RANDOM_UN,
            'RANDOM_LN': tool.RANDOM_LN,
            'RANDOM_LU': tool.RANDOM_LU,
            'RANDOM_LUN': tool.RANDOM_LUN,
            'RANDOM_V': tool.RANDOM_V,
            'RANDOM_LUNS': tool.RANDOM_LUNS,
            random: function(length: number = 8, source: string = tool.RANDOM_LN, block: string = ''): string {
                return tool.random(length, source, block);
            },
            getBoolean: function(param: boolean | string | number): boolean {
                return tool.getBoolean(param);
            },
            getNumber: function(param: string | number): number {
                return tool.getNumber(param);
            },
            getArray(param: string | any[]): any[] {
                return tool.getArray(param);
            },
            escapeHTML: function(html: string): string {
                return tool.escapeHTML(html);
            },
            formatColor: function(color: string): number[] {
                return tool.formatColor(color);
            },
            rgb2hex: function(
                r: string | number, g?: string | number, b?: string | number, a: string | number = 1
            ): string {
                return tool.rgb2hex(r, g, b, a);
            },
            hex2rgb: function(hex: string): {
                'r': number;
                'g': number;
                'b': number;
                'a': number;
                'rgb': string;
            } {
                return tool.hex2rgb(hex);
            },
            rgb2hsl: function(
                r: string | number, g?: string | number, b?: string | number, a: string | number = 1,
                decimal: boolean = false
            ): {
                    'h': number;
                    's': number;
                    'l': number;
                    'a': number;
                    'hsl': string;
                } {
                return tool.rgb2hsl(r, g, b, a, decimal);
            },
            hsl2rgb: function(
                h: string | number, s?: string | number, l?: string | number, a: string | number = 1,
                decimal: boolean = false
            ): {
                    'r': number;
                    'g': number;
                    'b': number;
                    'a': number;
                    'rgb': string;
                } {
                return tool.hsl2rgb(h, s, l, a, decimal);
            },
            request: function(url: string, opt: types.IRequestOptions): Promise<null | any> {
                return tool.request(url, opt);
            },
            fetch: function(url: string, init?: RequestInit): Promise<string | Blob | null> {
                return tool.fetch(url, init);
            },
            get: function(url: string, opt?: {
                'credentials'?: 'include' | 'same-origin' | 'omit';
                'headers'?: HeadersInit;
            }) {
                return tool.get(url, opt);
            },
            post: function(url: string, data: Record<string, any> | FormData, opt?: {
                'credentials'?: 'include' | 'same-origin' | 'omit';
                'headers'?: HeadersInit;
            }): Promise<Response | null> {
                return tool.post(url, data, opt);
            },
            getResponseJson: function(url: string, opt?: {
                'credentials'?: 'include' | 'same-origin' | 'omit';
                'headers'?: HeadersInit;
            }): Promise<any | null> {
                return tool.getResponseJson(url, opt);
            },
            postResponseJson: function(url: string, data: Record<string, any> | FormData, opt?: {
                'credentials'?: 'include' | 'same-origin' | 'omit';
                'headers'?: HeadersInit;
            }): Promise<any | null> {
                return tool.postResponseJson(url, data, opt);
            },
            parseUrl: function(url: string): ILoaderUrl {
                return tool.parseUrl(url);
            },
            urlResolve: function(from: string, to: string): string {
                return tool.urlResolve(from, to);
            },
            urlAtom: function(url: string): string {
                return tool.urlAtom(url);
            },
            blob2Text: function(blob: Blob): Promise<string> {
                return tool.blob2Text(blob);
            },
            blob2DataUrl: function(blob: Blob): Promise<string> {
                return tool.blob2DataUrl(blob);
            },
            execCommand: function(ac: string): void {
                tool.execCommand(ac);
            },
            compar: function(before: string[], after: string[]): {
                'remove': Record<string, number>;
                'add': Record<string, number>;
                'length': {
                    'remove': number;
                    'add': number;
                };
            } {
                return tool.compar(before, after);
            },
            formatSecond: function(second: number): string {
                return tool.formatSecond(second);
            },
            formatTime: function(ts: number | Date, tz?: number): {
                'date': string;
                'time': string;
                'zone': string;
            } {
                return tool.formatTime(ts, tz);
            },
            isMs: function(time: number): boolean {
                return tool.isMs(time);
            },
            queryStringify: function(query: Record<string, any>): string {
                return tool.queryStringify(query);
            },
            queryParse: function(query: string): Record<string, string | string[]> {
                return tool.queryParse(query);
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
        code = code.replace(/extends[\s\S]+?\.\s*(AbstractApp|AbstractForm|AbstractPanel)\s*{/, (t: string) => {
            return t + 'get filename() {return __filename;}';
        });
        return code;
    };
    app.files['/invoke/clickgo.js'] = `module.exports = invokeClickgo;`;
    /** --- .cga 文件，或者以 / 结尾的路径 --- */
    const path = opt.path ?? ((typeof url === 'string') ? url : '/runtime/' + tool.random(8, tool.RANDOM_LUN) + '.cga');
    const lio = path.endsWith('.cga') ? path.lastIndexOf('/') : path.slice(0, -1).lastIndexOf('/');
    const current = path.slice(0, lio);
    // --- 创建任务对象 ---
    list[taskId] = {
        'id': taskId,
        'app': app,
        // 'class': null,
        'customTheme': false,
        'locale': clickgo.vue.reactive({
            'lang': '',
            'data': {}
        }),
        'path': path,
        'current': current,

        'runtime': clickgo.vue.reactive({
            'dialogFormIds': [],
            'permissions': opt.permissions ?? []
        }),
        'forms': {},
        'controls': {},
        'timers': {},
        'invoke': invoke
    } as any;
    // --- locale ---
    if (app.config.locales) {
        for (let path in app.config.locales) {
            const locale = app.config.locales[path];
            if (!path.endsWith('.json')) {
                path += '.json';
            }
            await opt.initProgress?.('Load local ' + path + ' ...');
            const lcontent = await fs.getContent(path, {
                'encoding': 'utf8'
            }, taskId);
            if (!lcontent) {
                continue;
            }
            try {
                const data = JSON.parse(lcontent);
                loadLocaleData(locale, data, '', taskId);
            }
            catch {
                // --- 无所谓 ---
            }
        }
    }
    let expo: any = [];
    try {
        const map = {
            'clickgo': '/invoke/clickgo'
        };
        if (app.config.map) {
            Object.assign(map, app.config.map);
        }
        expo = loader.require('/app.js', app.files, {
            'dir': '/',
            'invoke': invoke,
            'preprocess': preprocess,
            'map': map
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
    // --- 加载 control ---
    await opt.initProgress?.('Control initialization ...');
    const r = await control.init(taskId, invoke, opt.cache);
    if (r < 0) {
        dom.removeFromStyleList(taskId);
        delete list[taskId];
        return -400 + r;
    }
    // --- 加载 theme ---
    if (app.config.themes?.length) {
        for (let path of app.config.themes) {
            path += '.cgt';
            path = tool.urlResolve('/', path);
            await opt.initProgress?.('Load theme ' + path + ' ...');
            const file = await fs.getContent(path, undefined, taskId);
            if (file && typeof file !== 'string') {
                const th = await theme.read(file);
                if (th) {
                    await theme.load(th, taskId);
                }
            }
        }
    }
    else {
        // --- 加载全局主题 ---
        if (theme.global) {
            await opt.initProgress?.('Load global theme ...');
            await theme.load(undefined, taskId);
        }
    }
    // --- 加载任务级全局样式 ---
    if (app.config.style) {
        const style = await fs.getContent(app.config.style + '.css', {
            'encoding': 'utf8'
        }, taskId);
        if (style) {
            const r = tool.stylePrepend(style, 'cg-task' + taskId.toString() + '_');
            await opt.initProgress?.('Style initialization ...');
            dom.pushStyle(taskId, await tool.styleUrl2DataUrl(app.config.style, r.style, app.files));
        }
    }
    // --- 触发 taskStarted 事件 ---
    core.trigger('taskStarted', taskId);
    // --- 请求权限 ---
    if (app.config.permissions) {
        await opt.initProgress?.('Style initialization ...');
        await checkPermission(app.config.permissions, true, undefined, taskId);
    }
    // --- 执行 app ---
    const appCls: core.AbstractApp = new expo.default();
    list[taskId].class = appCls;
    await opt.initProgress?.('Starting ...');
    await appCls.main(opt.data ?? {});
    return taskId;
}

/** --- 本页用到的语言包 --- */
const locale: Record<string, {
    'unknown': string;
    'root': string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'apply-permission': string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'native.form': string;
    'hash': string;
    'fs': string;
    'readonly': string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'read-write': string;
}> = {
    'sc': {
        'unknown': '未知权限',
        'root': '<b>危险！</b>最高权限！请一定确认是否允许！',
        'apply-permission': '正在申请权限，请您仔细确认',
        'native.form': '实体窗体控制',
        'hash': '可修改地址栏 hash',
        'fs': '文件系统',
        'readonly': '只读',
        'read-write': '读写'
    },
    'tc': {
        'unknown': '未知許可權',
        'root': '<b>危險！</b>最高許可權！請一定確認是否允許！',
        'apply-permission': '正在申請許可權，請您仔細確認',
        'native.form': '實體視窗控制',
        'hash': '可修改位址列 hash',
        'fs': '檔案系統',
        'readonly': '唯讀',
        'read-write': '讀寫'
    },
    'en': {
        'unknown': 'Unknown',
        'root': '<b>Danger!</b> Highest permission! Please confirm if you want to allow!',
        'apply-permission': 'Applying permission, please confirm carefully',
        'native.form': 'Native window control',
        'hash': 'Can modify address bar "hash"',
        'fs': 'File system',
        'readonly': 'Read-only',
        'read-write': 'Read and write'
    },
    'ja': {
        'unknown': '不明な権限',
        'root': '<b>危険！</b>最高権限です！許可するかどうか必ず確認してください！',
        'apply-permission': '権限を申請中です。よくご確認ください',
        'native.form': 'ネイティブフォームコントロール',
        'hash': 'アドレスバーの "hash" を変更できます',
        'fs': 'ファイルシステム',
        'readonly': '読み取り専用',
        'read-write': '読み書き可能'
    },
    'ko': {
        'unknown': '알 수 없는 권한',
        'root': '<b>위험!</b> 최고 권한입니다! 반드시 허용할 것인지 확인하십시오!',
        'apply-permission': '권한을 신청 중입니다. 주의 깊게 확인하십시오',
        'native.form': '네이티브 폼 제어',
        'hash': '주소 표시 줄 "hash" 를 수정할 수 있습니다',
        'fs': '파일 시스템',
        'readonly': '읽기 전용',
        'read-write': '읽기 및 쓰기',
    },
    'th': {
        'unknown': 'สิทธิ์ที่ไม่รู้จัก',
        'root': '<b>อันตราย!</b> สิทธิ์สูงสุด! โปรดตรวจสอบว่าต้องการอนุญาตหรือไม่!',
        'apply-permission': 'กำลังขอสิทธิ์ โปรดตรวจสอบอย่างรอบคอบ',
        'native.form': 'การควบคุมแบบฟอร์มแบบ Native',
        'hash': 'สามารถแก้ไขแถบที่อยู่ "hash"',
        'fs': 'ระบบไฟล์',
        'readonly': 'อ่านได้อย่างเดียว',
        'read-write': 'อ่านและเขียนได้'
    },
    'es': {
        'unknown': 'Permiso desconocido',
        'root': '<b>¡Peligro!</b> ¡Permiso máximo! ¡Asegúrese de permitirlo!',
        'apply-permission': 'Solicitando permiso. Por favor, compruebe cuidadosamente',
        'native.form': 'Control de formulario nativo',
        'hash': 'Puede modificar el "hash" de la barra de direcciones',
        'fs': 'Sistema de archivos',
        'readonly': 'Solo lectura',
        'read-write': 'Lectura y escritura',
    },
    'de': {
        'unknown': 'Unbekannte Berechtigung',
        'root': '<b>Gefahr!</b> Höchste Berechtigung! Bitte stellen Sie unbedingt sicher, ob dies erlaubt ist!',
        'apply-permission': 'Bitte bestätigen Sie die Berechtigungsanfrage sorgfältig',
        'native.form': 'Natives Formularsteuerelement',
        'hash': 'Adressleisten "hash" bearbeiten',
        'fs': 'Dateisystem',
        'readonly': 'Schreibgeschützt',
        'read-write': 'Lesen/Schreiben'
    },
    'fr': {
        'unknown': 'Autorisation inconnue',
        'root': '<b>Danger !</b> Autorisation maximale ! Veuillez vous assurer que vous êtes autorisé à le faire !',
        'apply-permission': 'Demande d\'autorisation en cours, veuillez vérifier attentivement',
        'native.form': 'Contrôle de formulaire natif',
        'hash': 'Modifier le "hash" de la barre d\'adresse',
        'fs': 'Système de fichiers',
        'readonly': 'Lecture seule',
        'read-write': 'Lecture/écriture'
    },
    'pt': {
        'unknown': 'Permissão desconhecida',
        'root': '<b>Perigo!</b> Permissão máxima! Certifique-se de ter permissão para fazê-lo!',
        'apply-permission': 'Solicitando permissão, por favor confirme cuidadosamente',
        'native.form': 'Controle de formulário nativo',
        'hash': 'Editar "hash" da barra de endereço',
        'fs': 'Sistema de arquivos',
        'readonly': 'Somente leitura',
        'read-write': 'Leitura/escrita'
    },
    'ru': {
        'unknown': 'Неизвестное разрешение',
        'root': '<b>Опасность!</b> Максимальное разрешение! Пожалуйста, обязательно убедитесь, что это разрешено!',
        'apply-permission': 'Выполняется запрос на разрешение, пожалуйста, внимательно подтвердите',
        'native.form': 'Нативный элемент формы',
        'hash': 'Изменить "hash" адресной строки',
        'fs': 'Файловая система',
        'readonly': 'Только для чтения',
        'read-write': 'Чтение/запись'
    },
    'vi': {
        'unknown': 'Quyền không xác định',
        'root': '<b>Nguy hiểm!</b> Quyền hạn cao nhất! Hãy đảm bảo rằng bạn được phép làm điều này!',
        'apply-permission': 'Đang yêu cầu quyền truy cập, vui lòng xác nhận cẩn thận',
        'native.form': 'Thiết bị kiểm soát biểu mẫu gốc',
        'hash': 'Chỉnh sửa "hash" thanh địa chỉ',
        'fs': 'Hệ thống tập tin',
        'readonly': 'Chỉ đọc',
        'read-write': 'Đọc/ghi'
    }
};

// fs.{path}{r/w}，path 以 / 结尾则是路径权限，不以 / 结尾是文件权限

/**
 * --- 检测应用是否有相应的权限 ---
 * @param vals 要检测的权限
 * @param apply 如果没有权限是否自动弹出申请，默认为否
 * @param applyHandler 向用户申请成功的权限列表回调
 * @param taskId 要检查的任务 ID，App 模式下无效
 */
export async function checkPermission(
    vals: string | string[],
    apply: boolean = false,
    applyHandler?: (list: string[]) => void | Promise<void>,
    taskId?: number
): Promise<boolean[]> {
    if (!taskId) {
        return [false];
    }
    const task = list[taskId];
    if (!task) {
        return [false];
    }
    if (typeof vals === 'string') {
        vals = [vals];
    }
    const rtn: boolean[] = [];
    /** --- 需要申请的权限 --- */
    const applyList: string[] = [];
    for (const val of vals) {
        if (task.runtime.permissions.includes('root')) {
            // --- 有 root 权限，一定成功 ---
            rtn.push(true);
            continue;
        }
        if (val.startsWith('fs.')) {
            // --- fs 判断比较特殊 ---
            let yes = false;
            const path = val.slice(3, -1);
            for (const v of task.runtime.permissions) {
                if (!v.startsWith('fs.')) {
                    continue;
                }
                const pa = v.slice(3, -1);
                if (pa.endsWith('/')) {
                    if (!path.startsWith(pa)) {
                        continue;
                    }
                }
                else if (pa !== path) {
                    continue;
                }
                // --- 找到了 ---
                if (val.endsWith('w')) {
                    // --- 用户要求读写 ---
                    if (v.endsWith('r')) {
                        // --- 但目前只有读的权限 ---
                        continue;
                    }
                }
                // --- 正常，有权限 ---
                yes = true;
                break;
            }
            rtn.push(yes);
            if (!yes && apply) {
                // --- 要申请权限 ---
                applyList.push(val);
            }
            continue;
        }
        // --- 其他权限判断 ---
        const result = task.runtime.permissions.includes(val);
        if (!result && apply) {
            // --- 要申请权限 ---
            applyList.push(val);
        }
        rtn.push(result);
    }
    // --- 申请权限 ---
    if (applyList.length) {
        let html = '<div>"' + tool.escapeHTML(task.app.config.name) + '" ' + ((locale[core.config.locale]?.['apply-permission'] ?? locale['en']['apply-permission']) + ':') + '</div>';
        for (const item of applyList) {
            if (item.startsWith('fs.')) {
                // --- fs 判断比较特殊 ---
                const path = item.slice(3, -1);
                html += '<div style="margin-top: 10px;">' +
                    (locale[core.config.locale]?.fs ?? locale['en'].fs) + ' ' + tool.escapeHTML(path) + ' ' + (item.endsWith('r') ? (locale[core.config.locale]?.readonly ?? locale['en'].readonly) : (locale[core.config.locale]?.['read-write'] ?? locale['en']['read-write'])) +
                    '<div style="color: hsl(0,0%,60%);">' + tool.escapeHTML(item) + '</div>' +
                '</div>';
                continue;
            }
            const lang = (locale as any)[core.config.locale]?.[item] ?? (locale as any)['en'][item];
            html += '<div style="margin-top: 10px;">' +
                (lang ?? locale[core.config.locale]?.unknown ?? locale['en'].unknown) +
                '<div style="color: hsl(0,0%,60%);">' + tool.escapeHTML(item) + '</div>' +
            '</div>';
        }
        if (await form.superConfirm(html)) {
            // --- 所有 false 变成 true ---
            for (let i = 0; i < rtn.length; ++i) {
                if (rtn[i]) {
                    continue;
                }
                rtn[i] = true;
            }
            for (const item of applyList) {
                task.runtime.permissions.push(item);
            }
            try {
                applyHandler?.(applyList) as any;
            }
            catch (e) {
                console.log('task.checkPermission', e);
            }
        }
    }
    return rtn;
}

/**
 * --- 完全结束任务 ---
 * @param taskId 任务 id
 */
export function end(taskId: number | string): boolean {
    if (typeof taskId === 'string') {
        taskId = parseInt(taskId);
    }
    const task = list[taskId];
    if (!task) {
        return true;
    }
    // --- 如果是 native 模式 ---
    if (clickgo.isNative() && (taskId === 1)) {
        native.invoke('cg-close', native.getToken()) as any;
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
        // --- 结束任务挨个关闭窗体 ---
        const f = task.forms[fid];
        core.trigger('formRemoved', taskId, f.id, f.vroot.$refs.form.title, f.vroot.$refs.form.iconDataUrl);
        try {
            f.vapp.unmount();
        }
        catch (err: any) {
            const msg = `Message: ${err.message}\nTask id: ${task.id}\nForm id: ${fid}\nFunction: task.end, unmount.`;
            form.notify({
                'title': 'Form Unmount Error',
                'content': msg,
                'type': 'danger'
            });
            console.log('Form Unmount Error', msg, err);
        }
        f.vapp._container.remove();
        form.elements.popList.querySelector('[data-form-id="' + f.id.toString() + '"]')?.remove();
        dom.clearWatchStyle(fid);
        dom.clearWatchProperty(fid);
        dom.clearWatchPosition(fid);
        delete form.activePanels[fid];
    }
    // --- 移除可能残留的 form wrap ---
    const flist = form.elements.list.querySelectorAll('.cg-form-wrap[data-task-id="' + taskId.toString() + '"]');
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
    dom.clearWatch(taskId);
    native.clear(undefined, taskId);
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
    /** --- 获取的语言文件 --- */
    const fcontent = await fs.getContent(path + '.json', {
        'encoding': 'utf8'
    }, taskId);
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
 * @param delay 延迟/间隔，毫秒
 * @param opt 选项, taskId: App 模式下无效, formId: 可省略，App 模式下省略代表生命周期为当前整个任务，否则只是当前窗体，immediate: 立即执行，默认 false，count: 执行次数，0 为无限次，默认 0
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
export function clearSystem(taskId?: number | string): boolean {
    if (!taskId) {
        return false;
    }
    if (typeof taskId === 'string') {
        taskId = parseInt(taskId);
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
