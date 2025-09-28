/**
 * Copyright 2007-2025 MAIYUN.NET
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
import * as clickgo from '../clickgo';
import * as lForm from './form';
import * as lCore from './core';
import * as lTool from './tool';
import * as lTask from './task';

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

/** --- style list 的 div --- */
const topClass: string[] = ['#cg-form-list', '#cg-pop-list', '#cg-notify', '#cg-alert', '#cg-keyboard', '#cg-simpletask', '#cg-launcher', '#cg-confirm'];
function classUnfold(after?: string, out: string[] = []): string {
    const arr: string[] = [];
    for (const name of topClass) {
        if (out.includes(name)) {
            continue;
        }
        arr.push(name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}

const styleList: HTMLDivElement = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style id='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; cursor: default; box-sizing: border-box;}
${topClass.slice(0, 4).join(', ')} {left: 0; top: 0; width: 0; height: 0; position: absolute;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection', ['#cg-launcher'])} {background-color: rgba(0, 0, 0, .1);}
${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold(' > div')} {font-family: var(--g-family); font-size: var(--g-size); line-height: 1; -webkit-font-smoothing: antialiased; text-shadow: 0 0 1px color-mix(in srgb, currentColor 40%, transparent); fill: currentColor; stroke: currentColor;}
</style>`);

/**
 * --- 判断一个元素是否还存在于页面当中 ---
 * @param el 要判断的元素
 */
export function inPage(el: HTMLElement): boolean {
    return document.body.contains(el);
}

// --- 计算 dpi ---
const dpiDiv = document.createElement('div');
dpiDiv.style.visibility = 'hidden';
dpiDiv.style.width = '1in';
document.getElementsByTagName('body')[0].appendChild(dpiDiv);
export const dpi: number = dpiDiv.getBoundingClientRect().width;
dpiDiv.remove();

/** --- 全局 cursor 设置的 style 标签 --- */
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

/** --- 最后一次 touchstart 的时间戳 --- */
let lastTouchTime: number = 0;
// --- 添加 touchstart 事件，既优化了点击行为，也记录了 touch 的时间戳信息 ---
document.addEventListener('touchstart', function() {
    lastTouchTime = Date.now();
}, {
    'passive': true,
});

/**
 * --- 判断当前的事件是否是含有 touch 的设备触发的，如果当前就是 touch 则直接返回 false（false 代表 OK，true 代表 touch 设备却触发了 mouse 事件） ---
 */
export function hasTouchButMouse(e: MouseEvent | TouchEvent | PointerEvent): boolean {
    if (e instanceof TouchEvent || e.type === 'touchstart') {
        return false;
    }
    if (((e as any).pointerType === 'touch') && (e.type === 'contextmenu')) {
        // --- 当前是 mouse 但是却是 touch 触发的 ---
        return true;
    }
    const now = Date.now();
    if (now - lastTouchTime < 60_000) {
        // --- 当前是 mouse 但是 60_000ms 内有 touch start ---
        return true;
    }
    return false;
}

/**
 * --- 创建任务时连同一起创建的 style 标签 ---
 * @param taskId 任务 id
 */
export function createToStyleList(taskId: string): void {
    styleList.insertAdjacentHTML('beforeend', `<div id="cg-style-task${taskId}"><div class="cg-style-control"></div><div class="cg-style-theme"></div><style class="cg-style-global"></style><div class="cg-style-form"></div></div>`);
}

/**
 * --- 任务结束时需要移除 task 的所有 style ---
 * @param taskId 任务 id
 */
export function removeFromStyleList(taskId: string): void {
    document.getElementById('cg-style-task' + taskId)?.remove();
}

/**
 * --- 将 style 内容写入 dom ---
 * @param taskId 当前任务 ID
 * @param style 样式内容
 * @param type 插入的类型
 * @param formId 当前窗体 ID（global 下可空，theme 下为主题唯一标识符，control 下为控件名）
 * @param panelId 若是 panel 中创建的则需要指定 panelId，仅 type 为 form 有效
 */
export function pushStyle(taskId: string, style: string, type: 'global' | 'theme' | 'control' | 'form' = 'global', formId: string = '', panelId?: string): void {
    const el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type}`);
    if (!el) {
        return;
    }
    if (type === 'global') {
        el.innerHTML = style;
    }
    else if (type === 'theme' || type === 'control') {
        el.insertAdjacentHTML('beforeend', `<style data-name="${formId}">${style}</style>`);
    }
    else {
        // --- form ---
        el.insertAdjacentHTML('beforeend', `<style class="cg-style-form${formId}" data-panel="${panelId ? panelId.toString() : ''}">${style}</style>`);
    }
}

/**
 * --- 移除 style 样式 dom ---
 * @param taskId 要移除的任务 ID
 * @param type 移除的类型
 * @param formId 要移除的窗体 ID
 * @param panelId type 为 form 模式下若不指定则当前 form 包含 panel 的样式都会被移除
 */
export function removeStyle(taskId: string, type: 'global' | 'theme' | 'control' | 'form' = 'global', formId: string = '', panelId?: string): void {
    const styleTask = document.getElementById('cg-style-task' + taskId);
    if (!styleTask) {
        return;
    }
    if (type === 'global') {
        const el = styleTask.querySelector(`.cg-style-global`);
        if (!el) {
            return;
        }
        el.innerHTML = '';
    }
    else if (type === 'theme' || type === 'control') {
        if (!formId) {
            const el = styleTask.querySelector(`.cg-style-${type}`);
            if (!el) {
                return;
            }
            el.innerHTML = '';
        }
        else {
            const elist = styleTask.querySelectorAll(`.cg-style-${type} > [data-name='${formId}']`);
            for (let i = 0; i < elist.length; ++i) {
                elist.item(i).remove();
            }
        }
    }
    else {
        // --- form ---
        const elist = styleTask.querySelectorAll('.cg-style-form' + formId.toString() + (panelId ? '[data-panel="' + panelId.toString() + '"]' : ''));
        for (let i = 0; i < elist.length; ++i) {
            elist.item(i).remove();
        }
    }
}

/**
 * --- 获取任务中子类有几个子元素 ---
 * @param taskId 任务 ID
 * @param type 类型
 */
export function getStyleCount(taskId: clickgo.core.TCurrent, type: 'theme' | 'control' | 'form'): number {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    return document.querySelectorAll(`#cg-style-task${taskId} > .cg-style-${type} > style`).length;
}

// ---------------------
// --- watchPosition ---
// ---------------------

/**
 * --- 监听中的标签对象，对应 formId -> 数组列表 ---
 */
const watchPositionObjects: Record<
    /** --- formId --- */
    string,
    Record<
        /** --- panelId 或 default --- */
        string,
        Record<
            /** --- index 值 --- */
            string,
            IWatchPositionItem
        >
    >
> = {};

/** --- 监视元素的 data-cg-poindex --- */
let watchPositionIndex: number = 0;

/**
 * --- 添加监视 Element 对象位置，元素移除后自动停止监视，已经监视中的不会再次监视，请短时间使用（虽然本方法也可以监听 element 的大小改变，但这是监听位置改变的副产品，如果仅仅监听大小改变请使用效率更高的 watch size） ---
 * @param el 要监视的大小
 * @param cb 回调函数
 * @param immediate 立刻先执行一次回调
 */
export function watchPosition(
    el: HTMLElement,
    cb: (state: {
        'position': boolean;
        'size': boolean;
    }) => void | Promise<void>,
    immediate: boolean = false
): boolean {
    if (isWatchPosition(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb({
                'position': false,
                'size': false
            });
            if (r instanceof Promise) {
                r.catch(() => {});
            }
        }
        catch {}
    }
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return false;
    }
    const formId = formWrap.dataset.formId!;
    // --- 获取监视标签的所属 panel ---
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId! : 'default';
    // --- 创建 object ---
    if (!watchPositionObjects[formId]) {
        watchPositionObjects[formId] = {};
    }
    if (!watchPositionObjects[formId][panelId]) {
        watchPositionObjects[formId][panelId] = {};
    }
    watchPositionObjects[formId][panelId][watchPositionIndex] = {
        'el': el,
        'rect': el.getBoundingClientRect(),
        'handler': cb
    };
    el.dataset.cgPoindex = watchPositionIndex.toString();
    ++watchPositionIndex;
    return true;
}

/**
 * --- 移除监视 Element 对象位置 ---
 * @param el 要移除监视
 */
export function unwatchPosition(el: HTMLElement): void {
    const index = el.dataset.cgPoindex;
    if (index === undefined) {
        return;
    }
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId!;
    // --- 获取监视标签的所属 panel ---
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId! : 'default';
    el.removeAttribute('data-cg-poindex');
    delete watchPositionObjects[formId][panelId][index];
    if (Object.keys(watchPositionObjects[formId][panelId]).length) {
        return;
    }
    delete watchPositionObjects[formId][panelId];
    if (Object.keys(watchPositionObjects[formId]).length) {
        return;
    }
    delete watchPositionObjects[formId];
}

/**
 * --- 检测一个标签是否正在被 watchSize ---
 * @param el 要检测的标签
 */
export function isWatchPosition(el: HTMLElement): boolean {
    return el.dataset.cgPoindex ? true : false;
}

/**
 * --- 清除某个窗体的所有 watch position 监视，虽然窗体结束后相关监视永远不会再被执行，但是会形成冗余 ---
 * @param formId 窗体 id
 * @param panelId 若指定则只清除当前窗体的某个 panel 的 watch
 */
export function clearWatchPosition(formId: string, panelId?: string): void {
    if (!watchPositionObjects[formId]) {
        return;
    }
    for (const panel in watchPositionObjects[formId]) {
        if (panelId) {
            if (panel !== panelId) {
                continue;
            }
        }
        for (const index in watchPositionObjects[formId][panel]) {
            const item = watchPositionObjects[formId][panel][index];
            item.el.removeAttribute('data-cg-poindex');
        }
        delete watchPositionObjects[formId][panel];
    }
    if (Object.keys(watchPositionObjects[formId]).length) {
        return;
    }
    delete watchPositionObjects[formId];
}

// -----------------
// --- watchSize ---
// -----------------

/** --- 被监视中的元素 --- */
const watchSizeList: Record<string, IWatchSizeItem> = {};

/**
 * --- 获取当前 watch size 中的元素总数 ---
 * @param taskId 留空则获取全部总数 ---
 */
export function getWatchSizeCount(taskId?: lCore.TCurrent): number {
    if (!taskId) {
        return Object.keys(watchSizeList).length;
    }
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    let count = 0;
    for (const id in watchSizeList) {
        if (watchSizeList[id].taskId !== taskId) {
            continue;
        }
        ++count;
    }
    return count;
}

/** --- 监视元素的 data-cg-roindex --- */
let watchSizeIndex: number = 0;

// --- 创建 ro 对象 ---
const resizeObserver = new ResizeObserver(function(entries): void {
    for (const entrie of entries) {
        const el = entrie.target as HTMLElement;
        if (!document.body.contains(el)) {
            resizeObserver.unobserve(el);
            if (watchSizeList[el.dataset.cgRoindex!]) {
                delete watchSizeList[el.dataset.cgRoindex!];
            }
            continue;
        }
        const item = watchSizeList[el.dataset.cgRoindex!];
        try {
            const r = item.handler();
            if (r instanceof Promise) {
                r.catch(() => {});
            }
        }
        catch {}
    }
});

/**
 * --- 添加监视 Element 对象大小，元素移除后自动停止监视（浏览器原生效果），已经监视中的不会再次监视 ---
 * @param current 当前执行的任务
 * @param el 要监视的大小
 * @param cb 回调函数
 * @param immediate 立刻先执行一次回调
 */
export function watchSize(
    current: lCore.TCurrent,
    el: HTMLElement,
    cb: () => void | Promise<void>,
    immediate: boolean = false,
): boolean {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if ((current !== sysId) && !lTask.getOrigin(current)) {
        return false;
    }
    if (isWatchSize(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb();
            if (r instanceof Promise) {
                r.catch(() => {});
            }
        }
        catch {}
    }
    resizeObserver.observe(el);
    watchSizeList[watchSizeIndex] = {
        'el': el,
        'handler': cb,
        'taskId': current,
    };
    el.dataset.cgRoindex = watchSizeIndex.toString();
    ++watchSizeIndex;
    return true;
}

/**
 * --- 移除监视 Element 对象大小 ---
 * @param el 要移除监视
 */
export function unwatchSize(el: HTMLElement): void {
    const index = el.dataset.cgRoindex;
    if (index === undefined) {
        return;
    }
    resizeObserver.unobserve(el);
    el.removeAttribute('data-cg-roindex');
    delete watchSizeList[index];
}

/**
 * --- 检测一个标签是否正在被 watchSize ---
 * @param el 要检测的标签
 */
export function isWatchSize(el: HTMLElement): boolean {
    return el.dataset.cgRoindex ? true : false;
}

/**
 * --- 清除某个任务的所有 watch size 监视 ---
 * @param taskId 任务 id
 */
export function clearWatchSize(taskId: lCore.TCurrent): void {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    for (const index in watchSizeList) {
        const item = watchSizeList[index];
        if (taskId !== item.taskId) {
            continue;
        }
        resizeObserver.unobserve(item.el);
        item.el.removeAttribute('data-cg-roindex');
        delete watchSizeList[index];
    }
}

// -------------
// --- watch ---
// -------------

/** --- 监视 dom 变动中的元素 */
const watchList: Record<string, IWatchItem> = {};

/**
 * --- 获取当前 watch 中的元素总数 ---
 * @param taskId 留空则获取全部总数 ---
 */
export function getWatchCount(taskId?: string): number {
    if (!taskId) {
        return Object.keys(watchList).length;
    }
    let count = 0;
    for (const id in watchList) {
        if (watchList[id].taskId !== taskId) {
            continue;
        }
        ++count;
    }
    return count;
}

/** --- 监视元素的 data-cg-moindex --- */
let watchIndex: number = 0;

/**
 * --- 添加 DOM 内容变化监视 ---
 * @param current 当前任务 id
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式
 */
export function watch(current: lCore.TCurrent, el: HTMLElement, cb: (mutations: MutationRecord[]) => void | Promise<void>, mode: 'child' | 'childsub' | 'style' | 'text' | 'default' = 'default', immediate: boolean = false): boolean {
    if (typeof current !== 'string') {
        current = current.taskId;
    }
    if ((current !== sysId) && !lTask.getOrigin(current)) {
        return false;
    }
    if (isWatch(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb([]);
            if (r instanceof Promise) {
                r.catch(() => {});
            }
        }
        catch {}
    }
    const index = watchIndex;
    let moi: MutationObserverInit;
    switch (mode) {
        case 'child': {
            moi = {
                'childList': true
            };
            break;
        }
        case 'childsub': {
            moi = {
                'childList': true,
                'subtree': true
            };
            break;
        }
        case 'style': {
            moi = {
                'attributeFilter': ['style', 'class'],
                'attributeOldValue': true,
                'attributes': true
            };
            break;
        }
        case 'text': {
            moi = {
                'characterData': true,
                'childList': true,
                'subtree': true
            };
            break;
        }
        default: {
            moi = {
                'attributeFilter': ['style', 'class'],
                'attributeOldValue': true,
                'attributes': true,
                'characterData': true,
                'childList': true,
                'subtree': true
            };
        }
    }
    const mo = new MutationObserver((mutations) => {
        if (!document.body.contains(el)) {
            mo.disconnect();
            if (watchList[index]) {
                delete watchList[index];
            }
            return;
        }
        try {
            const r = cb(mutations);
            if (r instanceof Promise) {
                r.catch(() => {});
            }
        }
        catch {}
    });
    mo.observe(el, moi);
    watchList[index] = {
        'el': el,
        'mo': mo,
        'taskId': current,
    };
    el.dataset.cgMoindex = index.toString();
    ++watchIndex;
    return true;
    /*
    {
        'attributeFilter': ['style', 'class'],
        'attributes': true,
        'characterData': true,
        'childList': true,
        'subtree': true
    }
    */
}

/**
 * --- 移除监视 Element 对象变动 ---
 * @param taskId 任务 id
 * @param el 要移除监视
 */
export function unwatch(taskId: lCore.TCurrent, el: HTMLElement): void {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    const index = el.dataset.cgMoindex;
    if (index === undefined) {
        return;
    }
    const item = watchList[index];
    if (item.taskId !== taskId) {
        return;
    }
    el.removeAttribute('data-cg-moindex');
    watchList[index].mo.disconnect();
    delete watchList[index];
}

/**
 * --- 检测一个标签是否正在被 watchSize ---
 * @param el 要检测的标签
 */
export function isWatch(el: HTMLElement): boolean {
    return el.dataset.cgMoindex ? true : false;
}

/**
 * --- 清除某个任务下面的所有 watch 监视 ---
 * @param taskId 任务 id
 */
export function clearWatch(taskId: lCore.TCurrent): void {
    if (typeof taskId !== 'string') {
        taskId = taskId.taskId;
    }
    for (const index in watchList) {
        const item = watchList[index];
        if (taskId !== item.taskId) {
            continue;
        }
        item.el.removeAttribute('data-cg-moindex');
        item.mo.disconnect();
        delete watchList[index];
    }
}

// ----------------------
// --- watch cg timer ---
// ----------------------

// --- watch 和 watchSize 依靠 cg 去清除元素已经消失但还占用 map 的情况 ---
// --- style 和 property 因为是我们自己实现的，随时就能知道元素是否已经被移除了 ---

const watchCgTimerHandler = function(): void {
    for (const index in watchSizeList) {
        const item = watchSizeList[index];
        if (document.body.contains(item.el)) {
            continue;
        }
        delete watchSizeList[index];
    }
    for (const index in watchList) {
        const item = watchList[index];
        if (document.body.contains(item.el)) {
            continue;
        }
        delete watchList[index];
    }
    window.setTimeout(watchCgTimerHandler, 1000 * 60 * 7);
};
watchCgTimerHandler();

// ------------------
// --- watchStyle ---
// ------------------

interface IWatchStyleItem {
    'el': HTMLElement;
    'sd': CSSStyleDeclaration;
    'names': Record<string, {
        'val': string;
        'cb': Array<(name: string, value: string, old: string) => void | Promise<void>>;
    }>;
}

const watchStyleList: Record<
    /** --- formId --- */
    string,
    Record<
        /** --- panelId 或 default --- */
        string,
        Record<
            /** --- index 值 --- */
            string,
            IWatchStyleItem
        >
    >
> = {};

/** --- 监视元素的 data-cg-styleindex --- */
let watchStyleIndex: number = 0;

/**
 * --- 监听一个标签的计算后样式的变化 ---
 * @param el 对象
 * @param name 样式名
 * @param cb 变更回调
 * @param immediate 是否立刻执行一次
 */
export function watchStyle(
    el: HTMLElement,
    name: string | string[],
    cb: (name: string, value: string, old: string) => void | Promise<void>,
    immediate: boolean = false
): void {
    if (typeof name === 'string') {
        name = [name];
    }
    // --- 获取监视标签的所属 wrap ---
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId!;
    // --- 获取监视标签的所属 panel ---
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId! : 'default';
    /** --- 监视 index 值 --- */
    const index = el.dataset.cgStyleindex;
    if (index) {
        // --- 已经有监听了 ---
        const item = watchStyleList[formId][panelId][index];
        for (const n of name) {
            if (!item.names[n]) {
                item.names[n] = {
                    'val': (item.sd as any)[n],
                    'cb': [cb]
                };
            }
            else {
                item.names[n].cb.push(cb);
            }
            if (immediate) {
                cb(n, (item.sd as any)[n], '') as any;
            }
        }
        return;
    }
    // --- 创建 object ---
    if (!watchStyleList[formId]) {
        watchStyleList[formId] = {};
    }
    if (!watchStyleList[formId][panelId]) {
        watchStyleList[formId][panelId] = {};
    }
    // --- 创建监听 ---
    const sd = getComputedStyle(el);
    watchStyleList[formId][panelId][watchStyleIndex] = {
        'el': el,
        'sd': sd,
        'names': {}
    };
    const item = watchStyleList[formId][panelId][watchStyleIndex];
    for (const n of name) {
        item.names[n] = {
            'val': (item.sd as any)[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, (item.sd as any)[n], '') as any;
        }
    }
    el.dataset.cgStyleindex = watchStyleIndex.toString();
    ++watchStyleIndex;
}

/**
 * --- 检测一个标签是否正在被 watchStyle ---
 * @param el 要检测的标签
 */
export function isWatchStyle(el: HTMLElement): boolean {
    return el.dataset.cgStyleindex ? true : false;
}

/**
 * --- 清除某个窗体的所有 watch style 监视 ---
 * @param formId 窗体 id
 * @param panelId 若指定则只清除当前窗体的某个 panel 的 watch
 */
export function clearWatchStyle(formId: string, panelId?: string): void {
    if (!watchStyleList[formId]) {
        return;
    }
    for (const panel in watchStyleList[formId]) {
        if (panelId) {
            if (panel !== panelId) {
                continue;
            }
        }
        for (const index in watchStyleList[formId][panel]) {
            const item = watchStyleList[formId][panel][index];
            item.el.removeAttribute('data-cg-styleindex');
        }
        delete watchStyleList[formId][panel];
    }
    if (Object.keys(watchStyleList[formId]).length) {
        return;
    }
    delete watchStyleList[formId];
}

// ---------------------
// --- watchProperty ---
// ---------------------

interface IWatchPropertyItem {
    'el': HTMLElement;
    'names': Record<string, {
        'val': string;
        'cb': Array<(name: string, value: string) => void | Promise<void>>;
    }>;
}

/**
 * --- 监听中的标签对象，对应 formId -> 数组列表 ---
 */
const watchPropertyObjects: Record<
    /** --- formId --- */
    string,
    Record<
        /** --- panelId 或 default --- */
        string,
        Record<
            /** --- index 值 --- */
            string,
            IWatchPropertyItem
        >
    >
> = {};

/** --- 监视元素的 data-cg-propertyindex --- */
let watchPropertyIndex: number = 0;

/**
 * --- 监听一个对象的属性变化 ---
 * @param el 对象
 * @param name 属性名
 * @param cb 回调函数
 * @param immediate 是否立即执行一次
 */
export function watchProperty(
    el: HTMLElement,
    name: string | string[],
    cb: (name: string, value: any) => void | Promise<void>,
    immediate: boolean = false
): void {
    if (typeof name === 'string') {
        name = [name];
    }
    // --- 获取监视标签的所属 wrap ---
    const formWrap = findParentByData(el, 'form-id');
    if (!formWrap) {
        return;
    }
    const formId = formWrap.dataset.formId!;
    // --- 获取监视标签的所属 panel ---
    const panelWrap = findParentByData(el, 'panel-id');
    const panelId = panelWrap ? panelWrap.dataset.panelId! : 'default';
    /** --- 监视 index 值 --- */
    const index = el.dataset.cgPropertyindex;
    if (index) {
        // --- 已经有监听了 ---
        const item = watchPropertyObjects[formId][panelId][index];
        for (const n of name) {
            if (!item.names[n]) {
                item.names[n] = {
                    'val': (item.el as any)[n],
                    'cb': [cb]
                };
            }
            else {
                item.names[n].cb.push(cb);
            }
            if (immediate) {
                cb(n, (item.el as any)[n]) as any;
            }
        }
        return;
    }
    // --- 创建 object ---
    if (!watchPropertyObjects[formId]) {
        watchPropertyObjects[formId] = {};
    }
    if (!watchPropertyObjects[formId][panelId]) {
        watchPropertyObjects[formId][panelId] = {};
    }
    // --- 创建监听 ---
    watchPropertyObjects[formId][panelId][watchPropertyIndex] = {
        'el': el,
        'names': {}
    };
    const item = watchPropertyObjects[formId][panelId][watchPropertyIndex];
    for (const n of name) {
        item.names[n] = {
            'val': (item.el as any)[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, (item.el as any)[n]) as any;
        }
    }
    el.dataset.cgPropertyindex = watchPropertyIndex.toString();
    ++watchPropertyIndex;
}

/**
 * --- 检测一个标签是否正在被 watchProperty ---
 * @param el 要检测的标签
 */
export function isWatchProperty(el: HTMLElement): boolean {
    return el.dataset.cgPropertyindex ? true : false;
}

/**
 * --- 清除某个窗体的所有 watch property 监视，虽然窗体结束后相关监视永远不会再被执行，但是会形成冗余 ---
 * @param formId 窗体 id
 * @param panelId 若指定则只清除当前窗体的某个 panel 的 watch
 */
export function clearWatchProperty(formId: string, panelId?: string): void {
    if (!watchPropertyObjects[formId]) {
        return;
    }
    for (const panel in watchPropertyObjects[formId]) {
        if (panelId) {
            if (panel !== panelId) {
                continue;
            }
        }
        for (const index in watchPropertyObjects[formId][panel]) {
            const item = watchPropertyObjects[formId][panel][index];
            item.el.removeAttribute('data-cg-propertyindex');
        }
        delete watchPropertyObjects[formId][panel];
    }
    if (Object.keys(watchPropertyObjects[formId]).length) {
        return;
    }
    delete watchPropertyObjects[formId];
}

// -------------------
// --- watch timer ---
// -------------------

export function getWatchInfo(): IGetWatchInfoResult {
    const rtn: IGetWatchInfoResult = {
        'formId': '',
        'default': {},
        'panels': {}
    };
    const formId = lForm.getFocus();
    if (!formId) {
        return rtn;
    }
    rtn.formId = formId;
    const panelIds = lForm.getActivePanel(formId);
    const handler = (item: {
        'el': HTMLElement;
        'names'?: Record<string, any>;
    }, type: 'style' | 'property' | 'position', panelId?: string): void => {
        if (panelId) {
            if (!rtn.panels[panelId]) {
                rtn.panels[panelId] = {};
            }
        }
        const ritem = panelId ? rtn.panels[panelId] : rtn.default;
        /** --- 控件名 --- */
        const cname = item.el.dataset.cgControl ?? findParentByData(item.el, 'cg-control')?.dataset.cgControl ?? 'unknown';
        if (!ritem[cname]) {
            ritem[cname] = {
                'style': {
                    'count': 0,
                    'list': []
                },
                'property': {
                    'count': 0,
                    'list': []
                },
                'position': {
                    'count': 0
                }
            };
        }
        ++ritem[cname][type].count;
        if (item.names && type !== 'position') {
            for (const name in item.names) {
                if (ritem[cname][type].list.includes(name)) {
                    continue;
                }
                ritem[cname][type].list.push(name);
            }
        }
    };
    // --- 先执行窗体默认的 ---
    if (watchStyleList[formId]) {
        if (watchStyleList[formId].default) {
            for (const index in watchStyleList[formId].default) {
                handler(watchStyleList[formId].default[index], 'style');
            }
        }
        // --- 再执行活跃的 panel 的 ---
        for (const id of panelIds) {
            if (watchStyleList[formId][id]) {
                for (const index in watchStyleList[formId][id]) {
                    handler(watchStyleList[formId][id][index], 'style', id.toString());
                }
            }
        }
    }
    // --- 先执行窗体默认的 ---
    if (watchPropertyObjects[formId]) {
        if (watchPropertyObjects[formId].default) {
            for (const index in watchPropertyObjects[formId].default) {
                handler(watchPropertyObjects[formId].default[index], 'property');
            }
        }
        // --- 再执行活跃的 panel 的 ---
        for (const id of panelIds) {
            if (watchPropertyObjects[formId]?.[id]) {
                for (const index in watchPropertyObjects[formId][id]) {
                    handler(watchPropertyObjects[formId][id][index], 'property', id.toString());
                }
            }
        }
    }
    // --- 先执行窗体默认的 ---
    if (watchPositionObjects[formId]) {
        if (watchPositionObjects[formId].default) {
            for (const index in watchPositionObjects[formId].default) {
                handler(watchPositionObjects[formId].default[index], 'position');
            }
        }
        // --- 再执行活跃的 panel 的 ---
        for (const id of panelIds) {
            if (watchPositionObjects[formId]?.[id]) {
                for (const index in watchPositionObjects[formId][id]) {
                    handler(watchPositionObjects[formId][id][index], 'position', id.toString());
                }
            }
        }
    }
    return rtn;
}

/** --- watch style 的 timer --- */
let watchTimer = 0;
const watchTimerHandler = function(): void {
    if (lForm.getFocus) {
        /** --- 获得当前获得焦点的窗体 --- */
        const formId = lForm.getFocus();
        if (formId) {
            /** --- 活跃的 panel --- */
            const panelIds = lForm.getActivePanel(formId);
            if (watchStyleList[formId]) {
                // --- style ---
                const handler = (item: IWatchStyleItem, panelId: string, index: string): void => {
                    if (!document.body.contains(item.el)) {
                        delete watchStyleList[formId][panelId][index];
                        if (!Object.keys(watchStyleList[formId][panelId]).length) {
                            delete watchStyleList[formId][panelId];
                        }
                        if (!Object.keys(watchStyleList[formId]).length) {
                            delete watchStyleList[formId];
                        }
                        return;
                    }
                    // --- 执行 cb ---
                    for (const name in item.names) {
                        if ((item.sd as any)[name] === item.names[name].val) {
                            continue;
                        }
                        const old = item.names[name].val;
                        item.names[name].val = (item.sd as any)[name];
                        for (const cb of item.names[name].cb) {
                            cb(name, (item.sd as any)[name], old) as any;
                        }
                    }
                };
                // --- 先执行窗体默认的 ---
                if (watchStyleList[formId].default) {
                    for (const index in watchStyleList[formId].default) {
                        handler(watchStyleList[formId].default[index], 'default', index);
                    }
                }
                // --- 再执行活跃的 panel 的 ---
                for (const id of panelIds) {
                    if (watchStyleList[formId][id]) {
                        for (const index in watchStyleList[formId][id]) {
                            handler(watchStyleList[formId][id][index], id.toString(), index);
                        }
                    }
                }
            }
            // --- property ---
            if (watchPropertyObjects[formId]) {
                // --- property ---
                const handler = (item: IWatchPropertyItem, panelId: string, index: string): void => {
                    if (!document.body.contains(item.el)) {
                        delete watchPropertyObjects[formId][panelId][index];
                        if (!Object.keys(watchPropertyObjects[formId][panelId]).length) {
                            delete watchPropertyObjects[formId][panelId];
                        }
                        if (!Object.keys(watchPropertyObjects[formId]).length) {
                            delete watchPropertyObjects[formId];
                        }
                        return;
                    }
                    // --- 执行 cb ---
                    for (const name in item.names) {
                        if ((item.el as any)[name] === item.names[name].val) {
                            continue;
                        }
                        item.names[name].val = (item.el as any)[name];
                        for (const cb of item.names[name].cb) {
                            cb(name, (item.el as any)[name]) as any;
                        }
                    }
                };
                // --- 先执行窗体默认的 ---
                if (watchPropertyObjects[formId].default) {
                    for (const index in watchPropertyObjects[formId].default) {
                        handler(watchPropertyObjects[formId].default[index], 'default', index);
                    }
                }
                // --- 再执行活跃的 panel 的 ---
                for (const id of panelIds) {
                    if (watchPropertyObjects[formId][id]) {
                        for (const index in watchPropertyObjects[formId][id]) {
                            handler(watchPropertyObjects[formId][id][index], id.toString(), index);
                        }
                    }
                }
            }
            // --- position ---
            if (watchPositionObjects[formId]) {
                // --- position ---
                const handler = (item: IWatchPositionItem, panelId: string, index: string): void => {
                    if (!document.body.contains(item.el)) {
                        delete watchPositionObjects[formId][panelId][index];
                        if (!Object.keys(watchPositionObjects[formId][panelId]).length) {
                            delete watchPositionObjects[formId][panelId];
                        }
                        if (!Object.keys(watchPositionObjects[formId]).length) {
                            delete watchPositionObjects[formId];
                        }
                        return;
                    }
                    // --- 执行 cb ---
                    const rect = item.el.getBoundingClientRect();
                    let position = false;
                    let size = false;
                    if (item.rect.left !== rect.left || item.rect.top !== rect.top) {
                        position = true;
                    }
                    if (item.rect.width !== rect.width || item.rect.height !== rect.height) {
                        size = true;
                    }
                    if (position || size) {
                        item.handler({
                            'position': position,
                            'size': size
                        }) as any;
                    }
                    watchPositionObjects[formId][panelId][index].rect = rect;
                };
                // --- 先执行窗体默认的 ---
                if (watchPositionObjects[formId].default) {
                    for (const index in watchPositionObjects[formId].default) {
                        handler(watchPositionObjects[formId].default[index], 'default', index);
                    }
                }
                // --- 再执行活跃的 panel 的 ---
                for (const id of panelIds) {
                    if (watchPositionObjects[formId][id]) {
                        for (const index in watchPositionObjects[formId][id]) {
                            handler(watchPositionObjects[formId][id][index], id.toString(), index);
                        }
                    }
                }
            }
        }
    }
    watchTimer = requestAnimationFrame(watchTimerHandler);
};

/**
 * --- 鼠标/手指没移动时，click 才生效 ---
 * @param e 事件对象
 * @param handler 回调
 */
export function bindClick(
    e: MouseEvent | TouchEvent,
    handler: (e: MouseEvent | TouchEvent, x: number, y: number) => void | Promise<void>
): void {
    if ((e instanceof MouseEvent) && (e.button > 0)) {
        return;
    }
    const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const time = Date.now();
    bindDown(e, {
        up: (ne) => {
            if (Date.now() - time >= 250) {
                return;
            }
            const nx = ne instanceof MouseEvent ? ne.clientX : ne.changedTouches[0].clientX;
            const ny = ne instanceof MouseEvent ? ne.clientY : ne.changedTouches[0].clientY;
            if (nx === x && ny === y) {
                handler(ne, nx, ny) as any;
            }
        }
    });
}

/** --- 双击事件中，最后一次单击的数据 --- */
const lastDblClickData = {
    'time': 0,
    'x': 0,
    'y': 0
};

/**
 * --- 相当于鼠标/手指两次 click 的效果，并且两次位置差别不太大，dblclick 才生效 ---
 * @param e 事件对象
 * @param handler 回调
 */
export function bindDblClick(
    e: MouseEvent | TouchEvent,
    handler: (e: MouseEvent | TouchEvent, x: number, y: number) => void | Promise<void>
): void {
    bindClick(e, (ne, x, y) => {
        // --- 判断当前第几次点击 ---
        const now = Date.now();
        if (now - lastDblClickData.time <= 300) {
            const xx = Math.abs(x - lastDblClickData.x);
            const xy = Math.abs(y - lastDblClickData.y);
            if (xx < 10 && xy < 10) {
                // --- 响应双击 ---
                handler(ne, x, y) as any;
                lastDblClickData.time = 0;
                lastDblClickData.x = 0;
                lastDblClickData.y = 0;
                return;
            }
        }
        lastDblClickData.time = now;
        lastDblClickData.x = x;
        lastDblClickData.y = y;
    });
}

/**
 * --- 绑定按下以及弹起事件，touch 和 mouse 只会绑定一个 ---
 * @param oe MouseEvent | TouchEvent
 * @param opt 回调选项
 */
export function bindDown<T extends MouseEvent | TouchEvent>(oe: T, opt: IBindDownOptions<T>): void {
    if (hasTouchButMouse(oe)) {
        return;
    }
    /** --- 上一次的坐标 --- */
    let ox: number, oy: number;
    if (oe instanceof MouseEvent) {
        ox = oe.clientX;
        oy = oe.clientY;
    }
    else {
        ox = oe.touches[0].clientX;
        oy = oe.touches[0].clientY;
    }

    /** --- 是否是第一次执行 move --- */
    let isStart: boolean = false;

    let end: (<TU extends T>(e: TU) => void) | undefined = undefined;
    const move = function<TU extends T>(e: TU): void {
        // --- 虽然上层已经有 preventDefault 了，但是有可能 e.target 会被注销，这样就响应不到上层的 preventDefault 事件，所以要在这里再加一个 ---
        if (!e.target || !document.body.contains(e.target as HTMLElement) && e.cancelable) {
            e.preventDefault();
        }
        /** --- 本次的移动方向 --- */
        let dir: 'top' | 'right' | 'bottom' | 'left' = 'top';
        const x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        if (x === ox && y === oy) {
            return;
        }
        const xx = x - ox;
        const xy = y - oy;
        if (Math.abs(xy) > Math.abs(xx)) {
            // --- 竖向滚动 ---
            if (xy < 0) {
                // -- 向上移 ---
                dir = 'top';
            }
            else {
                // -- 向下移 ---
                dir = 'bottom';
            }
        }
        else {
            // --- 横向滚动 ---
            if (xx < 0) {
                // -- 向左移 ---
                dir = 'left';
            }
            else {
                // -- 向右移 ---
                dir = 'right';
            }
        }
        ox = x;
        oy = y;

        if (!isStart) {
            isStart = true;
            if (opt.start && (opt.start(e) === false)) {
                if (e instanceof MouseEvent) {
                    window.removeEventListener('mousemove', move as EventListener);
                    window.removeEventListener('mouseup', end as EventListener);
                }
                else {
                    (oe.target as HTMLElement).removeEventListener('touchmove', move as EventListener);
                    (oe.target as HTMLElement).removeEventListener('touchend', end as EventListener);
                    (oe.target as HTMLElement).removeEventListener('touchcancel', end as EventListener);
                }
                return;
            }
        }
        if (opt.move && (opt.move(e, dir) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener('mousemove', move as EventListener);
                window.removeEventListener('mouseup', end as EventListener);
            }
            else {
                if (oe.target) {
                    (oe.target as HTMLElement).removeEventListener('touchmove', move as EventListener);
                    (oe.target as HTMLElement).removeEventListener('touchend', end as EventListener);
                    (oe.target as HTMLElement).removeEventListener('touchcancel', end as EventListener);
                }
            }
            return;
        }
    };
    end = function<TU extends T>(e: TU): void {
        if (e instanceof MouseEvent) {
            window.removeEventListener('mousemove', move as EventListener);
            window.removeEventListener('mouseup', end as EventListener);
        }
        else {
            if (oe.target) {
                (oe.target as HTMLElement).removeEventListener('touchmove', move as EventListener);
                (oe.target as HTMLElement).removeEventListener('touchend', end as EventListener);
                (oe.target as HTMLElement).removeEventListener('touchcancel', end as EventListener);
            }
        }
        opt.up?.(e) as any;
        if (isStart) {
            opt.end?.(e) as any;
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move as (e: MouseEvent) => void, {
            'passive': false
        });
        window.addEventListener('mouseup', end as (e: MouseEvent) => void);
    }
    else {
        (oe.target as HTMLElement).addEventListener('touchmove', move as (e: TouchEvent) => void, {
            'passive': false
        });
        (oe.target as HTMLElement).addEventListener('touchend', end as (e: TouchEvent) => void);
        (oe.target as HTMLElement).addEventListener('touchcancel', end as (e: TouchEvent) => void);
    }
    opt.down?.(oe);
}

/**
 * --- 绑定缩放，要绑定到 mousedown、touchstart、touchmove、touchend、wheel 上 ---
 * @param oe 触发的时间
 * @param handler 回调函数
 */
export function bindScale(oe: MouseEvent | TouchEvent | WheelEvent, handler: (e: MouseEvent | TouchEvent | WheelEvent, scale: number, cpos: { 'x': number; 'y': number; }) => void | Promise<void>): void {
    const el = oe.currentTarget as HTMLElement;
    if (!el) {
        return;
    }
    if (oe instanceof TouchEvent) {
        // --- 指头 ---
        if (oe.type === 'touchend') {
            if (oe.touches.length) {
                return;
            }
            el.removeAttribute('data-cg-scale');
            return;
        }
        /** --- 本次 x 坐标点 --- */
        const ex = [oe.touches[0].clientX, oe.touches[1]?.clientX ?? -1000];
        /** --- 本次 y 坐标点 --- */
        const ey = [oe.touches[0].clientY, oe.touches[1]?.clientY ?? -1000];
        /** --- 当前两指间的距离 --- */
        let ndis = 0;
        /** --- 当前中心点 --- */
        const epos = {
            'x': ex[0],
            'y': ey[0]
        };
        if (ex[1] !== -1000) {
            // --- 计算两指间距离 ---
            const nx = ex[0] - ex[1];
            const ny = ey[0] - ey[1];
            ndis = Math.hypot(nx, ny);
            // --- 计算中心点 ---
            const cnx = (ex[0] + ex[1]) / 2;
            const cny = (ey[0] + ey[1]) / 2;
            epos['x'] = cnx;
            epos['y'] = cny;
        }
        if (el.dataset.cgScale === undefined) {
            // --- 首次 ---
            el.dataset.cgScale = JSON.stringify({
                /** --- 上次两指间距离 --- */
                'dis': ndis,
                /** --- 上次 x 坐标点 --- */
                'x': ex,
                /** --- 上次 y 坐标点 --- */
                'y': ey,
                /** --- 上次的中心点 --- */
                'pos': epos
            });
            return;
        }
        const d = JSON.parse(el.dataset.cgScale);
        // --- 看看是否计算偏移 ---
        let notchange = false;
        if (ex[1] !== -1000) {
            if (d.x[1] === -1000) {
                notchange = true;
            }
        }
        else {
            if (d.x[1] !== -1000) {
                notchange = true;
            }
        }
        // --- 计算缩放偏移 ---
        const scale = ndis > 0 && d.dis > 0 ? ndis / d.dis : 1;
        handler(oe, scale, {
            'x': notchange ? 0 : epos['x'] - d.pos['x'],
            'y': notchange ? 0 : epos['y'] - d.pos['y']
        }) as any;
        // --- 覆盖 ---
        el.dataset.cgScale = JSON.stringify({
            'dis': ndis,
            'x': ex,
            'y': ey,
            'pos': epos
        });
        return;
    }
    if (oe instanceof WheelEvent) {
        // --- 滚轮 ---
        if (!oe.deltaY) {
            return;
        }
        /** --- 本次数值 --- */
        const delta = Math.abs(oe.deltaY);
        /** --- 缩放因子 --- */
        const zoomFactor = delta * (delta > 50 ? 0.0015 : 0.003);
        handler(oe, oe.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor, {
            'x': 0,
            'y': 0
        }) as any;
        return;
    }
    // --- 纯鼠标拖动 ---
    bindMove(oe, {
        'move': (e, opt) => {
            handler(oe, 1, {
                'x': opt.ox,
                'y': opt.oy
            }) as any;
        }
    });
}

/** --- 绑定拖拉响应操作的 wheel 数据对象 --- */
const gestureWheel = {
    /** --- 最后一次响应事件时间 --- */
    'last': 0,
    /** --- 本轮 offset 滚动距离 --- */
    'offset': 0,
    /** --- 本轮是否已经完成了滚动 --- */
    'done': false,
    /** --- 未执行等待隐藏的 timer --- */
    'timer': 0,
    /** --- 是否等待首次执行中 --- */
    'firstTimer': false,
    /** --- 本轮滚动的方向 --- */
    'dir': ''
};

/**
 * --- 绑定上拉、下拉、左拉、右拉 ---
 * @param oe 响应事件
 * @param before before 事件，返回 1 则显示 gesture，0 则不处理（可能会向上传递事件），-1 则 stopPropagation（本层可拖动，若实际不可拖动则可能导致浏览器页面滚动）
 * @param handler 执行完毕的话才会回调
 */
export function bindGesture(oe: MouseEvent | TouchEvent | WheelEvent, before: (e: MouseEvent | TouchEvent | WheelEvent, dir: 'top' | 'right' | 'bottom' | 'left') => number, handler?: (dir: 'top' | 'right' | 'bottom' | 'left') => void | Promise<void>): void {
    const el = oe.currentTarget as HTMLElement | null;
    if (!el) {
        return;
    }
    const rect = el.getBoundingClientRect();
    if ((oe instanceof MouseEvent || oe instanceof TouchEvent) && !(oe instanceof WheelEvent)) {
        // --- touch / mouse 触发的，dir 会和鼠标的 dir 相反，向下拖动是上方加载 ---
        let offset: number = 0;
        let origin: number = 0;
        /** --- 是否第一次执行 move 事件,1-是,0-不是且继续,-1-终止 --- */
        let first = 1;
        /** --- 哪个方向要加载 --- */
        let dir: 'top' | 'right' | 'bottom' | 'left' = 'top';
        /** --- 当前手势方向 --- */
        bindDown(oe, {
            move: (e, d) => {
                if (first < 0) {
                    if (first > -30) {
                        const rtn = before(e, dir);
                        if (rtn === 1) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        else if (rtn === -1) {
                            e.stopPropagation();
                        }
                        --first;
                    }
                    return;
                }
                if (first === 1) {
                    // --- 第一次执行，响应 before 判断是否继续执行 ---
                    first = 0;
                    switch (d) {
                        case 'top': {
                            dir = 'bottom';
                            break;
                        }
                        case 'bottom': {
                            dir = 'top';
                            break;
                        }
                        case 'left': {
                            dir = 'right';
                            break;
                        }
                        default: {
                            dir = 'left';
                        }
                    }
                    const rtn = before(e, dir);
                    if (rtn === 1) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    else {
                        if (rtn === -1) {
                            e.stopPropagation();
                        }
                        first = -1;
                        return;
                    }
                    // --- 初始化原点 ---
                    switch (dir) {
                        case 'top':
                        case 'bottom': {
                            origin = oe instanceof MouseEvent ? oe.clientY : oe.touches[0].clientY;
                            break;
                        }
                        default: {
                            origin = oe instanceof MouseEvent ? oe.clientX : oe.touches[0].clientX;
                        }
                    }
                }
                /** --- 当前坐标 --- */
                let pos: number = 0;
                switch (dir) {
                    case 'top':
                    case 'bottom': {
                        pos = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
                        if (dir === 'top') {
                            offset = pos - origin;
                        }
                        else {
                            offset = origin - pos;
                        }
                        break;
                    }
                    default: {
                        pos = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
                        if (dir === 'left') {
                            offset = pos - origin;
                        }
                        else {
                            offset = origin - pos;
                        }
                    }
                }

                // --- 处理差值 ---
                if (offset >= 90) {
                    offset = 90;
                    lForm.elements.gesture.style.opacity = '1';
                    lForm.elements.gesture.classList.add('done');
                }
                else {
                    lForm.elements.gesture.classList.remove('done');
                    if (offset < 0) {
                        offset = 0;
                        lForm.elements.gesture.style.opacity = '0';
                    }
                    else {
                        lForm.elements.gesture.style.opacity = '1';
                    }
                }
                lForm.elements.gesture.style.transform = 'scale(' + (offset / 90).toString() + ')';

                // --- 处理标签位置 ---
                switch (dir) {
                    case 'top':
                    case 'bottom': {
                        lForm.elements.gesture.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        if (dir === 'top') {
                            lForm.elements.gesture.style.top = (rect.top + (offset / 1.5)).toString() + 'px';
                        }
                        else {
                            lForm.elements.gesture.style.top = (rect.bottom - 20 - (offset / 1.5)).toString() + 'px';
                        }
                        break;
                    }
                    default: {
                        lForm.elements.gesture.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        if (dir === 'left') {
                            lForm.elements.gesture.style.left = (rect.left + (offset / 1.5)).toString() + 'px';
                        }
                        else {
                            lForm.elements.gesture.style.left = (rect.right - 20 - (offset / 1.5)).toString() + 'px';
                        }
                    }
                }
            },
            end: (): void => {
                lForm.elements.gesture.style.opacity = '0';
                if (offset < 90) {
                    return;
                }
                handler?.(dir) as any;
            }
        });
    }
    else {
        // --- wheel 触发 ---
        (async () => {
            const now = Date.now();
            if (now - gestureWheel.last > 250) {
                // --- 超过 250 毫秒，已经进入下一轮 ---
                gestureWheel.offset = 0;
                gestureWheel.done = false;
                gestureWheel.timer = 0;
                gestureWheel.firstTimer = false;
                gestureWheel.dir = '';
            }
            // --- 赋值最后执行时间 ---
            gestureWheel.last = now;
            if (gestureWheel.firstTimer) {
                return;
            }
            // --- 判断本轮是否已经处理结束 ---
            if (gestureWheel.done) {
                return;
            }
            // --- 获取滚动 delta 坐标 ---
            let deltaY = oe.deltaY;
            let deltaX = oe.deltaX;
            if (clickgo.dom.is.shift) {
                deltaY = oe.deltaX;
                deltaX = oe.deltaY;
            }
            // --- 判断是不是本轮首次滚动 ---
            if (gestureWheel.dir === '') {
                // --- 判断滚动方向 ---
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    // --- 竖向滚动 ---
                    if (deltaY < 0) {
                        // --- 向上滚 ---
                        gestureWheel.dir = 'top';
                    }
                    else {
                        // --- 向下滚 ---
                        gestureWheel.dir = 'bottom';
                    }
                }
                else {
                    // --- 横向滚动 ---
                    if (deltaX < 0) {
                        // --- 向左滚 ---
                        gestureWheel.dir = 'left';
                    }
                    else {
                        // --- 向下滚 ---
                        gestureWheel.dir = 'right';
                    }
                }
                // --- 判断是否要显示 gesture ---
                const rtn = before(oe, gestureWheel.dir as any);
                if (rtn === 1) {
                    oe.stopPropagation();
                    oe.preventDefault();
                }
                else {
                    // --- 不显示 ---
                    // --- 还得判断是不是 stopPropagation 了，如果 stopPropagation 了，才 true ---
                    if (rtn === -1) {
                        oe.stopPropagation();
                        gestureWheel.done = true;
                    }
                    else {
                        gestureWheel.dir = '';
                    }
                    return;
                }
                // --- 重置位置 ---
                lForm.elements.gesture.style.transform = 'scale(0)';
                switch (gestureWheel.dir) {
                    case 'top':
                    case 'bottom': {
                        lForm.elements.gesture.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        if (gestureWheel.dir === 'top') {
                            lForm.elements.gesture.style.top = (rect.top + 10).toString() + 'px';
                        }
                        else {
                            lForm.elements.gesture.style.top = (rect.bottom - 10).toString() + 'px';
                        }
                        break;
                    }
                    default: {
                        lForm.elements.gesture.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        if (gestureWheel.dir === 'left') {
                            lForm.elements.gesture.style.left = (rect.left + 10).toString() + 'px';
                        }
                        else {
                            lForm.elements.gesture.style.left = (rect.right - 10).toString() + 'px';
                        }
                    }
                }
                gestureWheel.firstTimer = true;
                await lTool.sleep(30);
                gestureWheel.firstTimer = false;
                lForm.elements.gesture.classList.add('ani');
            }
            // --- 滚动 ---
            switch (gestureWheel.dir) {
                case 'top':
                case 'bottom': {
                    gestureWheel.offset += (gestureWheel.dir === 'top') ? -deltaY : deltaY;
                    break;
                }
                default: {
                    gestureWheel.offset += (gestureWheel.dir === 'left') ? -deltaX : deltaX;
                }
            }
            if (gestureWheel.offset < 0) {
                // --- 隐藏了，直接 return ---
                gestureWheel.offset = 0;
                lForm.elements.gesture.style.opacity = '0';
                return;
            }
            // --- 显示 gesture 对象 ---
            lForm.elements.gesture.style.opacity = '1';
            let offset = gestureWheel.offset / 1.38;
            if (offset > 90) {
                offset = 90;
                lForm.elements.gesture.classList.add('done');
            }
            else {
                lForm.elements.gesture.classList.remove('done');
            }
            // --- 处理标签位置（20 像素是 gesture 的宽高） ---
            lForm.elements.gesture.style.transform = 'scale(' + (offset / 90).toString() + ')';
            switch (gestureWheel.dir) {
                case 'top': {
                    lForm.elements.gesture.style.top = (rect.top + (offset / 1.5)).toString() + 'px';
                    break;
                }
                case 'bottom': {
                    lForm.elements.gesture.style.top = (rect.bottom - 20 - (offset / 1.5)).toString() + 'px';
                    break;
                }
                case 'left': {
                    lForm.elements.gesture.style.left = (rect.left + (offset / 1.5)).toString() + 'px';
                    break;
                }
                default: {
                    lForm.elements.gesture.style.left = (rect.right - 20 - (offset / 1.5)).toString() + 'px';
                }
            }
            // --- 看是否要响应 ---
            clearTimeout(gestureWheel.timer);
            if (offset < 90) {
                gestureWheel.timer = window.setTimeout(() => {
                    lForm.elements.gesture.style.opacity = '0';
                    lForm.elements.gesture.classList.remove('ani');
                }, 250);
                return;
            }
            gestureWheel.done = true;
            handler?.(gestureWheel.dir as any) as any;
            await lTool.sleep(500);
            lForm.elements.gesture.style.opacity = '0';
            lForm.elements.gesture.classList.remove('ani');
        })().catch(() => {});
    }
}

let lastLongTime: number = 0;

export function allowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
    const now = Date.now();
    if (now - lastLongTime < 5) {
        return false;
    }
    const current = e.currentTarget as HTMLElement;
    if (current.dataset.cgDisabled !== undefined) {
        return false;
    }
    if (findParentByData(current, 'cg-disabled')) {
        return false;
    }
    return true;
}

/**
 * --- 绑定长按事件 ---
 * @param e 事件原型
 * @param long 回调
 */
export function bindLong(e: MouseEvent | TouchEvent, long: (e: MouseEvent | TouchEvent) => void | Promise<void>): void {
    if (hasTouchButMouse(e)) {
        return;
    }
    /** --- 上一次的坐标 --- */
    const tx: number = (e instanceof MouseEvent || e.type === 'mousedown') ? (e as MouseEvent).clientX : e.touches[0].clientX;
    const ty: number = (e instanceof MouseEvent || e.type === 'mousedown') ? (e as MouseEvent).clientY : e.touches[0].clientY;
    let ox:  number = 0;
    let oy: number = 0;
    /** --- 是否执行了 long --- */
    let isLong: boolean = false;
    let timer: number | undefined = window.setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
        if (ox <= 1 && oy <= 1) {
            isLong = true;
            const rtn = long(e);
            if (rtn instanceof Promise) {
                rtn.catch((e) => {
                    throw e;
                });
            }
        }
    }, 300);
    bindDown(e, {
        move: (e: MouseEvent | TouchEvent) => {
            const x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            ox = Math.abs(x - tx);
            oy = Math.abs(y - ty);
        },
        up: () => {
            if (timer !== undefined) {
                // --- 肯定没执行 long ---
                clearTimeout(timer);
                timer = undefined;
            }
            else if (isLong) {
                lastLongTime = Date.now();
            }
        }
    });
}

/** --- 要传输的 drag data 数据 --- */
let bindDragData: any = undefined;

/**
 * --- 重新绑定 drag 数据 ---
 * @param data 要绑定的数据
 */
export function setDragData(data?: string | number | boolean | Record<string, any>): void {
    bindDragData = data;
}

/**
 * --- 绑定拖动 ---
 * @param e 鼠标事件
 * @param opt 参数
 */
export function bindDrag(e: MouseEvent | TouchEvent, opt: {
    'el': HTMLElement;
    'data'?: any;

    'start'?: (x: number, y: number) => any;
    'move'?: (e: MouseEvent | TouchEvent, opt: IBindMoveMoveOptions) => void;
    'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
}): void {
    bindDragData = opt.data;
    let otop = 0;
    let oleft = 0;
    let nel: HTMLElement | null = null;
    bindMove(e, {
        'object': opt.el,
        'start': function(x, y) {
            const rect = opt.el.getBoundingClientRect();
            lForm.showDrag({
                'element': opt.el,
            });
            lForm.moveDrag({
                'top': rect.top,
                'left': rect.left,
                'width': rect.width,
                'height': rect.height,
                'icon': true
            });
            otop = rect.top;
            oleft = rect.left;
            opt.start?.(x, y);
        },
        'move': function(e, o) {
            const ntop = otop + o.oy;
            const nleft = oleft + o.ox;
            lForm.moveDrag({
                'top': ntop,
                'left': nleft,
                'icon': false
            });
            otop = ntop;
            oleft = nleft;
            // --- 获取当前 element ---
            const els = document.elementsFromPoint(o.x, o.y) as HTMLElement[];
            for (const el of els) {
                if (el.dataset.cgDrop === undefined) {
                    continue;
                }
                if (el === opt.el) {
                    continue;
                }
                if (el === nel) {
                    // --- 还是当前的 ---
                    return;
                }
                if (nel !== null) {
                    nel.removeAttribute('data-cg-hover');
                    nel.dispatchEvent(new CustomEvent('dragleave', {
                        'detail': {
                            'value': bindDragData
                        }
                    }));
                }
                el.dataset.cgHover = '';
                nel = el;
                nel.dispatchEvent(new CustomEvent('dragenter', {
                    'detail': {
                        'value': bindDragData
                    }
                }));
                return;
            }
            // --- not found ---
            lForm.moveDrag({
                'icon': true
            });
            if (nel === null) {
                return;
            }
            nel.removeAttribute('data-cg-hover');
            nel.dispatchEvent(new CustomEvent('dragleave', {
                'detail': {
                    'value': bindDragData
                }
            }));
            nel = null;
            opt.move?.(e, o);
        },
        'end': function(moveTimes, e) {
            lForm.hideDrag();
            if (nel === null) {
                return;
            }
            nel.removeAttribute('data-cg-hover');
            nel.dispatchEvent(new CustomEvent('drop', {
                'detail': {
                    'value': bindDragData
                }
            }));
            opt.end?.(moveTimes, e);
            bindDragData = undefined;
        }
    });
}

/** --- 目前是否已绑定了 bindMove --- */
export let is: {
    'move': boolean;
    'shift': boolean;
    'ctrl': boolean;
    'meta': boolean;
    'full': boolean;
    'dark': boolean;
    'keyboard': boolean;
};

/**
 * --- 绑定拖动事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 回调选项
 */
export function bindMove(e: MouseEvent | TouchEvent, opt: IBindMoveOptions): IBindMoveResult {
    if (hasTouchButMouse(e)) {
        return {
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0
        };
    }
    is.move = true;
    setGlobalCursor(opt.cursor ?? getComputedStyle(e.target as Element).cursor);
    /** --- 上一次的 x 坐标 --- */
    let tx: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    /** --- 上一次的 y 坐标 --- */
    let ty: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

    /** --- 拖动限定区域左侧 --- */
    let left: number,
        /** --- 拖动限定区域顶部 --- */
        top: number,
        /** --- 拖动限定区域右侧 --- */
        right: number,
        /** --- 拖动限定区域底部 --- */
        bottom: number;
    if (opt.areaObject) {
        if (!(opt.areaObject instanceof Element)) {
            opt.areaObject = opt.areaObject.$el;
        }
        const areaRect = opt.areaObject.getBoundingClientRect();
        const areaStyle = getComputedStyle(opt.areaObject);
        left = areaRect.left + parseFloat(areaStyle.borderLeftWidth) + parseFloat(areaStyle.paddingLeft);
        top = areaRect.top + parseFloat(areaStyle.borderTopWidth) + parseFloat(areaStyle.paddingTop);
        right = areaRect.left + areaRect.width - (parseFloat(areaStyle.borderRightWidth)
            + parseFloat(areaStyle.paddingRight));
        bottom = areaRect.top + areaRect.height - (parseFloat(areaStyle.borderRightWidth)
            + parseFloat(areaStyle.paddingRight));
    }
    else {
        const area = lCore.getAvailArea();
        left = opt.left ?? area.left;
        top = opt.top ?? area.top;
        right = opt.right ?? area.width;
        bottom = opt.bottom ?? area.height;
    }
    // --- 限定拖动区域额外补偿（拖动对象和实际对象有一定偏差时使用） ---
    if (opt.offsetLeft) {
        left += opt.offsetLeft;
    }
    if (opt.offsetTop) {
        top += opt.offsetTop;
    }
    if (opt.offsetRight) {
        right += opt.offsetRight;
    }
    if (opt.offsetBottom) {
        bottom += opt.offsetBottom;
    }

    /** --- 判断是否已经到达了边界 --- */
    let isBorder: boolean = false;

    // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
    let objectLeft: number, objectTop: number, objectWidth: number, objectHeight: number;
    /** --- 初始坐标距离 object 左侧的距离 --- */
    let offsetLeft: number = 0,
        /** --- 初始坐标距离 object 顶部的距离 --- */
        offsetTop: number = 0,
        /** --- 初始坐标距离 object 右侧的距离 --- */
        offsetRight: number = 0,
        /** --- 初始坐标距离 object 底部的距离 --- */
        offsetBottom = 0;

    /** --- 每次拖动时的时间以及偏移 --- */
    const moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }> = [];

    bindDown(e, {
        start: () => {
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    setGlobalCursor();
                    return false;
                }
            }
            // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
            if (opt.object) {
                if (!(opt.object instanceof Element)) {
                    opt.object = opt.object.$el;
                }
                const rect = opt.object.getBoundingClientRect();
                objectLeft = rect.left;
                objectTop = rect.top;
                objectWidth = rect.width;
                objectHeight = rect.height;
            }
            else {
                objectLeft = opt.objectLeft ?? 0;
                objectTop = opt.objectTop ?? 0;
                objectWidth = opt.objectWidth ?? 0;
                objectHeight = opt.objectHeight ?? 0;
            }

            // --- 限定边界的偏移，如果限定了拖动对象，则需要根据偏移来判断边界，毕竟拖动点不可能每次都刚好是边界 ---
            if (objectWidth > 0) {
                offsetLeft = tx - objectLeft;
            }
            if (objectHeight > 0) {
                offsetTop = ty - objectTop;
            }
            offsetRight = objectWidth - offsetLeft;
            offsetBottom = objectHeight - offsetTop;
        },
        move: (e: MouseEvent | TouchEvent, dir) => {
            /** --- 本次 x 坐标 --- */
            let x: number,
                /** --- 本次 y 坐标 --- */
                y: number;
            x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            if (x === tx && y === ty) {
                // --- 没有移动，直接返回 ---
                return;
            }

            /** --- 当前是否在顶部边界线上 --- */
            let inBorderTop: boolean = false,
                /** --- 当前是否在右侧边界上 --- */
                inBorderRight: boolean = false,
                /** --- 当前是否在底部边界上 --- */
                inBorderBottom: boolean = false,
                /** --- 当前是否在左侧边界上 --- */
                inBorderLeft: boolean = false;

            /** --- 当前理论上可拖动 object 应该存在的 x 左侧 --- */
            const nowLeft = x - offsetLeft;
            /** --- 当前理论上可拖动 object 应该存在的 x 右侧 --- */
            const nowRight = x + offsetRight;
            if (nowLeft <= left) {
                // --- 必定是到左侧边界了 ---
                inBorderLeft = true;
                if (nowLeft < left && x < tx) {
                    // --- 当前 x 超越了 left 界限，还在向左移动 ---
                    if (tx - offsetLeft > left) {
                        // --- 如果刚刚还没超过，则设定为界限值 ---
                        x = left + offsetLeft;
                    }
                    else {
                        // --- 如果刚刚就已经超过了，则恢复成刚刚 ---
                        x = tx;
                    }
                }
            }
            else if (offsetRight !== 0) {
                if (nowRight >= right) {
                    // --- 必定到右侧边界 ---
                    inBorderRight = true;
                    if (nowRight > right && x > tx) {
                        if (tx + offsetRight < right) {
                            x = right - offsetRight;
                        }
                        else {
                            x = tx;
                        }
                    }
                }
            }
            else if (offsetRight === 0) {
                const r1 = right - 1;
                if (x >= r1) {
                    inBorderRight = true;
                    if (x > r1 && x > tx) {
                        if (tx < r1) {
                            x = r1;
                        }
                        else {
                            x = tx;
                        }
                    }
                }
            }

            /** --- 当前理论上可拖动 object 应该存在的 y 顶部 --- */
            const nowTop = y - offsetTop;
            /** --- 当前理论上可拖动 object 应该存在的 y 底部 --- */
            const nowBottom = y + offsetBottom;
            if (nowTop <= top) {
                inBorderTop = true;
                if (nowTop < top && y < ty) {
                    if (ty - offsetTop > top) {
                        y = top + offsetTop;
                    }
                    else {
                        y = ty;
                    }
                }
            }
            else if (offsetBottom !== 0) {
                if (nowBottom >= bottom) {
                    inBorderBottom = true;
                    if (nowBottom > bottom && y > ty) {
                        if (ty + offsetBottom < bottom) {
                            y = bottom - offsetBottom;
                        }
                        else {
                            y = ty;
                        }
                    }
                }
            }
            else if (offsetBottom === 0) {
                const b1 = bottom - 1;
                if (y >= b1) {
                    inBorderBottom = true;
                    if (y > b1 && y > ty) {
                        if (ty < b1) {
                            y = b1;
                        }
                        else {
                            y = ty;
                        }
                    }
                }
            }

            // --- 检测是否执行 borderIn 事件（是否正在边界上） ---
            let border: TDomBorder = '';
            if (inBorderTop || inBorderRight || inBorderBottom || inBorderLeft) {
                if (inBorderTop) {
                    if (x - left <= 20) {
                        border = 'lt';
                    }
                    else if (right - x <= 20) {
                        border = 'tr';
                    }
                    else {
                        border = 't';
                    }
                }
                else if (inBorderRight) {
                    if (y - top <= 20) {
                        border = 'tr';
                    }
                    else if (bottom - y <= 20) {
                        border = 'rb';
                    }
                    else {
                        border = 'r';
                    }
                }
                else if (inBorderBottom) {
                    if (right - x <= 20) {
                        border = 'rb';
                    }
                    else if (x - left <= 20) {
                        border = 'bl';
                    }
                    else {
                        border = 'b';
                    }
                }
                else if (inBorderLeft) {
                    if (y - top <= 20) {
                        border = 'lt';
                    }
                    else if (bottom - y <= 20) {
                        border = 'bl';
                    }
                    else {
                        border = 'l';
                    }
                }

                if (!isBorder) {
                    isBorder = true;
                    opt.borderIn?.(x, y, border, e);
                }
            }
            else {
                // --- 不在边界 ---
                if (isBorder) {
                    isBorder = false;
                    opt.borderOut?.();
                }
            }

            const ox = x - tx;
            const oy = y - ty;
            moveTimes.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });
            opt.move?.(e, {
                'ox': ox,
                'oy': oy,
                'x': x,
                'y': y,
                'border': border,
                'inBorder': {
                    'top': inBorderTop,
                    'right': inBorderRight,
                    'bottom': inBorderBottom,
                    'left': inBorderLeft
                },
                'dir': dir
            });
            tx = x;
            ty = y;
        },
        up: (e) => {
            is.move = false;
            setGlobalCursor();
            opt.up?.(moveTimes, e);
        },
        end: (e) => {
            opt.end?.(moveTimes, e);
        }
    });

    if (opt.showRect) {
        lForm.showRectangle(tx, ty, {
            'left': left,
            'top': top,
            'width': right - left,
            'height': bottom - top
        });
        setTimeout(() => {
            lForm.hideRectangle();
        }, 3000);
    }

    return {
        'left': left,
        'top': top,
        'right': right,
        'bottom': bottom
    };
}

/**
 * --- 绑定拖动改变大小事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 选项，width, height 当前对象宽高
 */
export function bindResize(e: MouseEvent | TouchEvent, opt: IBindResizeOptions): void {
    if (hasTouchButMouse(e)) {
        return;
    }
    opt.minWidth = opt.minWidth ?? 0;
    opt.minHeight = opt.minHeight ?? 0;
    /** --- 当前鼠标位置 x --- */
    const x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    /** --- 当前鼠标位置 y --- */
    const y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    // --- 获取偏差补偿 ---
    let offsetLeft!: number, offsetTop!: number, offsetRight!: number, offsetBottom!: number;
    /** --- 上下左右界限 --- */
    let left!: number, top!: number, right!: number, bottom!: number;

    // --- 获取 object 的 x,y 和 w,h 信息 ---
    if (opt.objectLeft === undefined
        || opt.objectTop === undefined
        || opt.objectWidth === undefined
        || opt.objectHeight === undefined
    ) {
        if (!opt.object) {
            return;
        }
        if (!(opt.object instanceof Element)) {
            opt.object = opt.object.$el;
        }
        const objectRect = opt.object.getBoundingClientRect();
        opt.objectLeft = objectRect.left;
        opt.objectTop = objectRect.top;
        opt.objectWidth = objectRect.width;
        opt.objectHeight = objectRect.height;
    }

    if (opt.border === 'tr' || opt.border === 'r' || opt.border === 'rb') {
        // --- ↗、→、↘ ---
        left = opt.objectLeft + opt.minWidth;
        offsetLeft = x - (opt.objectLeft + opt.objectWidth);
        offsetRight = offsetLeft;
        if (opt.maxWidth) {
            right = opt.objectLeft + opt.maxWidth;
        }
    }
    else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
        // --- ↙、←、↖ ---
        right = opt.objectLeft + opt.objectWidth - opt.minWidth;
        offsetLeft = x - opt.objectLeft;
        offsetRight = offsetLeft;
        if (opt.maxWidth) {
            left = opt.objectLeft + opt.objectWidth - opt.maxWidth;
        }
    }
    if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
        // --- ↘、↓、↙ ---
        top = opt.objectTop + opt.minHeight;
        offsetTop = y - (opt.objectTop + opt.objectHeight);
        offsetBottom = offsetTop;
        if (opt.maxHeight) {
            bottom = opt.objectTop + opt.maxHeight;
        }
    }
    else if (opt.border === 'lt' || opt.border === 't' || opt.border === 'tr') {
        bottom = opt.objectTop + opt.objectHeight - opt.minHeight;
        offsetTop = y - opt.objectTop;
        offsetBottom = offsetTop;
        if (opt.maxHeight) {
            top = opt.objectTop + opt.objectHeight - opt.maxHeight;
        }
    }
    bindMove(e, {
        'left': left,
        'top': top,
        'right': right,
        'bottom': bottom,
        'offsetLeft': offsetLeft,
        'offsetTop': offsetTop,
        'offsetRight': offsetRight,
        'offsetBottom': offsetBottom,
        'start': opt.start,
        'move': function(e, o) {
            if (opt.border === 'tr' || opt.border === 'r' || opt.border === 'rb') {
                opt.objectWidth! += o.ox;
            }
            else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
                opt.objectWidth! -= o.ox;
                opt.objectLeft! += o.ox;
            }
            if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
                opt.objectHeight! += o.oy;
            }
            else if (opt.border === 'lt' || opt.border === 't' || opt.border === 'tr') {
                opt.objectHeight! -= o.oy;
                opt.objectTop! += o.oy;
            }
            opt.move?.(opt.objectLeft!, opt.objectTop!, opt.objectWidth!, opt.objectHeight!, x, y, o.border);
        },
        'end': opt.end
    });
}

/**
 * --- 通过 data 名查找上层所有标签是否存在 ---
 * @param el 当前标签
 * @param name 要查找的 data 名
 * @param value data 对应的值，留空则代表只要匹配了名就可以
 */
export function findParentByData(el: HTMLElement, name: string, value?: string): HTMLElement | null {
    let parent = el.parentNode as HTMLElement;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        if (parent.tagName.toLowerCase() === 'body') {
            break;
        }
        const v = parent.getAttribute('data-' + name);
        if (v !== null) {
            if (value) {
                if (value === v) {
                    return parent;
                }
                // --- value 不匹配 ---
                continue;
            }
            return parent;
        }
        parent = parent.parentNode as HTMLElement;
    }
    return null;
}

/**
 * --- 通过 class 名查找上层所有标签是否存在 ---
 * @param el 当前标签
 * @param name 要查找的 class 名
 */
export function findParentByClass(el: HTMLElement, name: string): HTMLElement | null {
    let parent = el.parentNode as HTMLElement;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        if (parent.tagName.toLowerCase() === 'body') {
            break;
        }
        if (parent.classList.contains(name)) {
            return parent;
        }
        parent = parent.parentNode as HTMLElement;
    }
    return null;
}

/**
 * --- 通过 tagname 查找上层所有标签是否存在 ---
 * @param el 当前标签
 * @param name 要查找的 tagname 名，小写，如 table
 */
export function findParentByTag(el: HTMLElement, name: string): HTMLElement | null {
    let parent = el.parentNode as HTMLElement;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        const tag = parent.tagName.toLowerCase();
        if (tag === 'body') {
            break;
        }
        if (tag === name) {
            return parent;
        }
        parent = parent.parentNode as HTMLElement;
    }
    return null;
}

/**
 * --- 判断一个元素是当前同级的第几位 ---
 * @param el 要判断的元素
 */
export function index(el: HTMLElement): number {
    let index = 0;
    let p = el.previousElementSibling;
    while (true) {
        if (!p) {
            break;
        }
        ++index;
        p = p.previousElementSibling;
    }
    return index;
}

/**
 * --- 查找指定 el 的同级所有元素 ---
 * @param el 基准
 * @returns HTMLElement[]
 */
export function siblings(el: HTMLElement): HTMLElement[] {
    if (!el.parentNode) {
        return [];
    }
    const list: HTMLElement[] = [];
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        const e = el.parentNode.children.item(i) as HTMLElement;
        if (e === el) {
            continue;
        }
        list.push(e);
    }
    return list;
}

/**
 * --- 查找指定 el 的同级的存在 data 的元素 ---
 * @param el 基准
 * @param name data 名，不含 data-
 * @returns HTMLElement[]
 */
export function siblingsData(el: HTMLElement, name: string): HTMLElement[] {
    const list = siblings(el);
    const olist: HTMLElement[] = [];
    for (const item of list) {
        if (item.getAttribute('data-' + name) === null) {
            continue;
        }
        olist.push(item);
    }
    return olist;
}

/**
 * --- 全屏 ---
 */
export async function fullscreen(): Promise<boolean> {
    const he = document.getElementsByTagName('html')[0] as any;
    if (he.webkitRequestFullscreen) {
        await he.webkitRequestFullscreen();
        return true;
    }
    else if (he.requestFullscreen) {
        await he.requestFullscreen();
        return true;
    }
    else {
        return false;
    }
}

/**
 * --- 退出全屏 ---
 */
export async function exitFullscreen(): Promise<boolean> {
    const d = document as any;
    if (d.webkitExitFullscreen) {
        await d.webkitExitFullscreen();
        return true;
    }
    else if (d.exitFullscreen) {
        await d.exitFullscreen();
        return true;
    }
    else {
        return false;
    }
}

/**
 * --- 创建 element ---
 * @param tagName 标签名
 */
export function createElement<T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap[T] {
    return document.createElement(tagName);
}

// --- 需要初始化 ---

let inited = false;
export function init(): void {
    if (inited) {
        return;
    }
    inited = true;
    is = clickgo.modules.vue.reactive({
        'move': false,
        'shift': false,
        'ctrl': false,
        'meta': false,
        'full': false,
        'dark': window.matchMedia('(prefers-color-scheme: dark)').matches,
        'keyboard': false,
    });
    // --- 处理 timer 类，窗体消失时不进行监听 ---
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // --- 隐藏 ---
            cancelAnimationFrame(watchTimer);
        }
        else {
            // --- 显示 ---
            watchTimer = requestAnimationFrame(watchTimerHandler);
        }
    });
    // --- 监听 fullscreen 情况的变动 ---
    document.addEventListener('fullscreenchange', function() {
        if ((document as any).webkitFullscreenElement) {
            is.full = true;
            return;
        }
        if (document.fullscreenElement) {
            is.full = true;
            return;
        }
        is.full = false;
    });
    // --- 键盘按下 ---
    window.addEventListener('keydown', function(e: KeyboardEvent) {
        switch (e.key) {
            case 'Shift': {
                is.shift = true;
                break;
            }
            case 'Control': {
                is.ctrl = true;
                break;
            }
            case 'Meta': {
                is.meta = true;
                break;
            }
        }
        lCore.trigger('keydown', e).catch(() => {});
    });
    // --- 键盘弹起 ---
    window.addEventListener('keyup', function(e: KeyboardEvent) {
        switch (e.key) {
            case 'Shift': {
                is.shift = false;
                break;
            }
            case 'Control': {
                is.ctrl = false;
                break;
            }
            case 'Meta': {
                is.meta = false;
                break;
            }
        }
        lCore.trigger('keyup', e).catch(() => {});
    });
    // --- 监测暗/亮模式 ---
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        is.dark = e.matches;
    });
    // --- 启动 timer ---
    watchTimerHandler();
}

// --- 类型 ---

/** --- 方向类型，从左上开始 --- */
export type TDomBorder = 'lt' | 't' | 'tr' | 'r' | 'rb' | 'b' | 'bl' | 'l' | '';

export type TDomBorderCustom = TDomBorder | { 'left': number; 'top'?: number; 'width': number; 'height'?: number; };

/** --- Element 的大小 --- */
export interface IDomSize {
    'top': number;
    'right': number;
    'bottom': number;
    'left': number;
    'width': number;
    'height': number;
    'padding': {
        'top': number;
        'right': number;
        'bottom': number;
        'left': number;
    };
    'border': {
        'top': number;
        'right': number;
        'bottom': number;
        'left': number;
    };
    'clientHeight': number;
    'clientWidth': number;
    'innerWidth': number;
    'innerHeight': number;
    'scrollWidth': number;
    'scrollHeight': number;
}

/** --- 绑定鼠标事件选项 --- */
export interface IBindDownOptions<T extends MouseEvent | TouchEvent> {
    'down'?: (e: T) => void;
    'start'?: (e: T) => any;
    'move'?: (
        e: T,
        dir: 'top' | 'right' | 'bottom' | 'left'
    ) => any;
    'up'?: (e: T) => void | Promise<void>;
    'end'?: (e: T) => void | Promise<void>;
}

/** --- 绑定拖动选项 move 回调的回调参数 --- */
export interface IBindMoveMoveOptions {
    'ox': number;
    'oy': number;
    'x': number;
    'y': number;
    'border': TDomBorder;
    'inBorder': {
        'top': boolean;
        'right': boolean;
        'bottom': boolean;
        'left': boolean;
    };
    'dir': 'top' | 'right' | 'bottom' | 'left';
}

/** --- 绑定拖动选项 --- */
export interface IBindMoveOptions {
    'areaObject'?: HTMLElement | lCore.IVue;
    'left'?: number;
    'top'?: number;
    'right'?: number;
    'bottom'?: number;
    'offsetLeft'?: number;
    'offsetTop'?: number;
    'offsetRight'?: number;
    'offsetBottom'?: number;
    'objectLeft'?: number;
    'objectTop'?: number;
    'objectWidth'?: number;
    'objectHeight'?: number;
    'object'?: HTMLElement | lCore.IVue;
    'showRect'?: boolean;
    'cursor'?: string;
    'start'?: (x: number, y: number) => any;
    'move'?: (e: MouseEvent | TouchEvent, opt: IBindMoveMoveOptions) => void;
    'up'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
    'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>, e: MouseEvent | TouchEvent) => void;
    'borderIn'?: (x: number, y: number, border: TDomBorder, e: MouseEvent | TouchEvent) => void;
    'borderOut'?: () => void;
}

/** --- 绑定拖动返回值 --- */
export interface IBindMoveResult {
    'left': number;
    'top': number;
    'right': number;
    'bottom': number;
}

/** --- 绑定改变大小选项 --- */
export interface IBindResizeOptions {
    'objectLeft'?: number;
    'objectTop'?: number;
    'objectWidth'?: number;
    'objectHeight'?: number;
    'object'?: HTMLElement | lCore.IVue;
    'minWidth'?: number;
    'minHeight'?: number;
    'maxWidth'?: number;
    'maxHeight'?: number;
    'border': TDomBorder;
    'start'?: (x: number, y: number) => any;
    'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TDomBorder) => void;
    'end'?: () => void;
}

/** --- 监视位置中的元素 --- */
export interface IWatchPositionItem {
    'el': HTMLElement;
    'rect': DOMRect;
    'handler': (state: {
        'position': boolean;
        'size': boolean;
    }) => void | Promise<void>;
}

/** --- 监视大小中的元素 --- */
export interface IWatchSizeItem {
    'el': HTMLElement;
    'handler': () => void | Promise<void>;
    'taskId': string | null;
}

/** --- 监视变化中的元素 --- */
export interface IWatchItem {
    'el': HTMLElement;
    'mo': MutationObserver;
    'taskId'?: string;
}

/** --- 获取当前正在监视中的 property、style 和 position 的元素信息 --- */
export interface IGetWatchInfoResult {
    'formId': string;
    'default': Record<string, {
        'style': {
            'list': string[];
            'count': number;
        };
        'property': {
            'list': string[];
            'count': number;
        };
        'position': {
            'count': number;
        };
    }>;
    'panels': Record<string,
        Record<string, {
            'style': {
                'list': string[];
                'count': number;
            };
            'property': {
                'list': string[];
                'count': number;
            };
            'position': {
                'count': number;
            };
        }>
    >;
}
