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

// --- hue 色盘 ---
const hueCount = 360 / 32;
let hueCssVar = '';
/** --- hue 色盘 --- */
export const hues: string[] = [];
for (let i = 0; i < 32; ++i) {
    const hue = (i * hueCount).toFixed(2);
    hueCssVar += `--hue-${i}:${hue}; `;
    hues.push(hue);
}
const styleList: HTMLDivElement = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-transition\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style id='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; cursor: default; box-sizing: border-box;}
${topClass.slice(0, 4).join(', ')} {left: 0; top: 0; width: 0; height: 0; position: absolute;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection', ['#cg-launcher'])} {background-color: rgba(0, 0, 0, .1);}
${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold(' > div')} {font-family: var(--g-family); font-size: var(--g-size); line-height: 1; -webkit-font-smoothing: antialiased; text-shadow: 0 0 1px color-mix(in srgb, currentColor 40%, transparent); fill: currentColor; stroke: currentColor;}
#cg-wrap { ${hueCssVar}}
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
        globalCursorStyle.innerHTML = `*, *::after, *::before {cursor: ${type} !important;}`;
    }
    else {
        globalCursorStyle.innerHTML = '';
    }
}

/** --- 全局 transition 设置的 style 标签 --- */
let globalTransitionStyle: HTMLStyleElement;

/**
 * ---启用/禁用全局 transition ---
 * @param enable 是否启用
 */
export function setGlobalTransition(enable: boolean): void {
    if (!globalTransitionStyle) {
        globalTransitionStyle = document.getElementById('cg-global-transition') as HTMLStyleElement;
    }
    if (enable) {
        globalTransitionStyle.innerHTML = '';
    }
    else {
        globalTransitionStyle.innerHTML = '*, *::after, *::before {transition: none !important;}';
    }
    clickgo.dom.is.transition = enable;
}

// --- 添加 touchstart 事件，优化点击行为 ---
document.addEventListener('touchstart', function() {
    // --- 空操作，仅为了激活某些浏览器的点击行为 ---
}, {
    'passive': true,
});

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
    resizeObserver.observe(el, {
        'box': 'border-box',
    });
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
 * @param current 当前任务
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式，默认 default
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

/** --- 相关状态 --- */
export let is: {
    'move': boolean;
    'shift': boolean;
    'ctrl': boolean;
    'meta': boolean;
    /** --- 当前是否是全屏 --- */
    'full': boolean;
    /** --- 是否是黑暗模式 --- */
    'dark': boolean;
    /** --- 虚拟键盘是否正在显示 --- */
    'keyboard': boolean;
    /** --- 动画开启状态 --- */
    'transition': boolean;
};

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

/** --- 获取元素的相对位置信息 --- */
export function getElementRPosition(el: HTMLElement, wrap: HTMLElement): {
    'left': number;
    'top': number;
    'width': number;
    'height': number;
} {
    const rect = el.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();

    return {
        'left': rect.left - wrapRect.left,
        'top': rect.top - wrapRect.top,
        'width': rect.width,
        'height': rect.height
    };
}

/** --- 根据角位置获取八角坐标 --- */
export function getRectPoint(el: HTMLElement, wrap: HTMLElement, pos: 'lt' | 't' | 'tr' | 'r' | 'rb' | 'b' | 'bl' | 'l'): {
    'x': number;
    'y': number;
} {
    const p = getElementRPosition(el, wrap);
    const centerX = p.left + p.width / 2;
    const centerY = p.top + p.height / 2;

    switch (pos) {
        case 't': {
            return { 'x': centerX, 'y': p.top };
        }
        case 'tr': {
            return { 'x': p.left + p.width, 'y': p.top };
        }
        case 'r': {
            return { 'x': p.left + p.width, 'y': centerY };
        }
        case 'rb': {
            return { 'x': p.left + p.width, 'y': p.top + p.height };
        }
        case 'b': {
            return { 'x': centerX, 'y': p.top + p.height };
        }
        case 'bl': {
            return { 'x': p.left, 'y': p.top + p.height };
        }
        case 'l': {
            return { 'x': p.left, 'y': centerY };
        }
        case 'lt': {
            return { 'x': p.left, 'y': p.top };
        }
        default: {
            return { 'x': centerX, 'y': centerY };
        }
    }
}

/** --- 麦克风状态,0-未对讲,1-准备中,2-对讲中 --- */
let micState = 0;

/** --- 麦克风通过 WebSocket 对讲的 WebSocket 实例 --- */
let micWs: WebSocket | null = null;

const blob = new Blob([`
const minRms = .2;

class MicrophoneProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.voice = false;     // --- 当前是否是说话状态 ---
        this.voiceStart = 0;    // --- 从静音到说话时的开始时间 ---
        this.voiceLast = 0;     // --- 最后一次说话的时间 ---
        this.lastPost = 0;      // --- 最后一次发送 buffer 的时间 ---
    }
    // --- 计算音频帧的平均音量（均方根） ---
    // --- 大于等于 minRms 代表可能在说话 ---
    calculateVolume(channel) {
        let sum = 0;
        for (let i = 0; i < channel.length; i++) {
            // --- 平方和 ---
            sum += channel[i] * channel[i];
        }
        // --- 均方根 ---
        const rms = Math.sqrt(sum / channel.length);
        return rms;
    }

    process(inputs, outputs) {
        // --- 获取输入音频数据（单声道） ---
        const input = inputs[0];
        const channel = input[0];
        const now = Date.now();
        
        // --- 计算当前帧的音量 ---
        const volume = this.calculateVolume(channel);
        this.port.postMessage({
            'type': 'process',
            'rms': volume,
        });
        if (volume > minRms) {
            this.voiceLast = now;
        }

        // --- 判断是否要发送 buffer ---
        if (this.voice) {
            // --- 说话中 ---
            if (volume >= minRms) {
                // --- 继续说话 ---
            }
            else {
                // --- 判断是否说话结束 ---
                if (now - this.voiceLast >= 1_000) {
                    // --- 说话结束 ---
                    this.voice = false;
                    this.voiceStart = 0;
                    this.port.postMessage({
                        'type': 'voice-end'
                    });
                }
                // --- 不结束，等待到 1 秒观察 ---
            }
        }
        else {
            // --- 静音中 ---
            if (volume >= minRms) {
                // --- 判断是否要说话开始 ---
                if (this.voiceStart === 0) {
                    this.voiceStart = now;
                }
                if (now - this.voiceStart >= 300) {
                    // --- 说话开始 ---
                    this.voice = true;
                    this.port.postMessage({
                        'type': 'voice-start'
                    });
                }
                // --- 不开始，等待到 300ms 观察 ---
            }
            else {
                // --- 当前没声音，判断是否是真的安静了 ---
                if (now - this.voiceLast > 300) {
                    // --- 又安静了 ---
                    this.voiceStart = 0;
                }
            }
        }

        if (
            (now - this.voiceLast >= 3_000) &&
            (now - this.lastPost < 15_000)
        ) {
            // --- 超过 3 秒没声音直接 buffer 都不发送 ---
            return true;
        }

        // --- 转换为 Int16 ---
        const output = new Int16Array(channel.length);
        for (let i = 0; i < channel.length; i++) {
            // --- 限制范围并转换 ---
            const sample = Math.max(-1, Math.min(1, channel[i]));
            output[i] = sample < 0 ? sample * 32768 : sample * 32767;
        }

        // --- 通过消息将处理后的数据发送到主线程 ---
        this.lastPost = now;
        this.port.postMessage(output.buffer, [output.buffer]);
        
        // --- 保持处理器运行 ---
        return true;
    }
}

// --- 注册处理器 ---
registerProcessor('microphone-processor', MicrophoneProcessor);
`], { 'type': 'application/javascript' });
/** --- 音频处理器 --- */
const micProcessor = URL.createObjectURL(blob);

/** --- 麦克风通过 WebSocket 对讲 --- */
export const mic = {
    /**
     * --- 开始对讲 ---
     * @param ws ws:// wss://
     * @param opts 选项
     */
    start: async function(ws: string, opts: {
        /** --- 需要初次 message 认证返回 { "result": 1 } 后才开始对讲，默认为 true --- */
        'rtn'?: boolean;
        /** --- 开始事件回调，此时说话才会被发送 --- */
        onStart?: () => void | Promise<void>;
        /** --- 有人声开始 --- */
        onVoiceStart?: () => void | Promise<void>;
        /** --- 有人声结束 --- */
        onVoiceEnd?: () => void | Promise<void>;
        /** --- rms 音量回调 --- */
        onProcess?: (data: {
            'rms': number;
        }) => void | Promise<void>;
        /** --- 结束事件回调，主动结束也会回调 --- */
        onStop?: () => void | Promise<void>;
    } = {}): Promise<boolean> {
        if (micState > 0) {
            return true;
        }
        // --- 进入准备状态 ---
        micState = 1;
        const rtn = opts.rtn ??= true;
        try {
            /** --- 获取设备 --- */
            const stream = await navigator.mediaDevices.getUserMedia({
                'audio': true,
            });
            micWs = new WebSocket(ws);
            if (rtn) {
                micWs.onmessage = async ev => {
                    try {
                        const json = JSON.parse(ev.data);
                        if (json.result <= 0) {
                            mic.stop();
                            return;
                        }
                        micState = 2;   // --- 进入对讲状态 ---
                        await opts.onStart?.();
                    }
                    catch {
                        mic.stop();
                    }
                };
            }
            micWs.onopen = async () => {
                if (rtn) {
                    return;
                }
                micState = 2;   // --- 进入对讲状态 ---
                await opts.onStart?.();
            };
            micWs.onclose = () => {
                // --- 可能还没成功就失败了，在这里设置 ---
                micWs = null;
                micState = 0;
            };
            /** --- 目标采样率 --- */
            const targetSampleRate = 8000;
            const audioCtx = new AudioContext({
                'sampleRate': targetSampleRate,
            });
            /** --- 创建音频源节点 --- */
            const source = audioCtx.createMediaStreamSource(stream);
            await audioCtx.audioWorklet.addModule(micProcessor);
            /** --- 创建AudioWorklet节点 --- */
            const workletNode = new AudioWorkletNode(audioCtx, 'microphone-processor');
            // --- 连接节点 ---
            source.connect(workletNode);
            workletNode.connect(audioCtx.destination);
            // --- 监听事件 ---
            workletNode.port.onmessage = async ev => {
                if (!micWs) {
                    // --- micWs 没了，触发清理 ---
                    const tracks = stream.getTracks();
                    for (const track of tracks) {
                        track.stop();
                    }
                    await audioCtx.close();
                    workletNode.port.close();
                    workletNode.disconnect();
                    source.disconnect();
                    await opts.onStop?.();
                    return;
                }
                if (micState !== 2) {
                    return;
                }
                if (micWs.readyState === WebSocket.CLOSING || micWs.readyState === WebSocket.CLOSED) {
                    mic.stop();
                    return;
                }
                if (ev.data.type === 'voice-start') {
                    await opts.onVoiceStart?.();
                    return;
                }
                if (ev.data.type === 'voice-end') {
                    await opts.onVoiceEnd?.();
                    return;
                }
                if (ev.data.type === 'process') {
                    await opts.onProcess?.({
                        'rms': ev.data.rms,
                    });
                    return;
                }
                micWs.send(ev.data);
            };
            return true;
        }
        catch (err) {
            console.error('[LIB][DOM]', err);
            micState = 0;
            return false;
        }
    },
    /** --- 结束对讲 --- */
    stop: function() {
        micState = 0;
        if (!micWs) {
            return;
        }
        micWs.close();
    }
};

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
        'transition': true,
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
