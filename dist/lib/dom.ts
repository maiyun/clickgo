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
import * as form from './form';
import * as core from './core';
import * as tool from './tool';

/** --- style list 的 div --- */
const topClass: string[] = ['#cg-form-list', '#cg-pop-list', '#cg-notify', '#cg-simpletask', '#cg-launcher', '#cg-confirm'];
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
${topClass.slice(0, 3).join(', ')} {left: 0; top: 0; width: 0; height: 0; position: absolute;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection', ['#cg-launcher'])} {background-color: rgba(0, 0, 0, .1);}
${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold()}, ${classUnfold('input')}, ${classUnfold('textarea')} {font-family: "Lucida Sans Unicode", "Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased;}
</style>`);

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

/** --- 最后一次 touchstart 的时间戳 */
let lastTouchTime: number = 0;
// --- 添加 touchstart 事件，既优化了点击行为，也记录了 touch 的时间戳信息 ---
document.addEventListener('touchstart', function() {
    lastTouchTime = Date.now();
    return;
}, {
    'passive': true
});

/**
 * --- 判断当前的事件是否是含有 touch 的设备触发的，如果当前就是 touch 则直接返回 false（false 代表 OK，true 代表 touch 设备却触发了 mouse 事件） ---
 */
export function hasTouchButMouse(e: MouseEvent | TouchEvent | PointerEvent): boolean {
    if (e instanceof TouchEvent) {
        return false;
    }
    if (((e as any).pointerType === 'touch') && (e.type === 'contextmenu')) {
        // --- 当前是 mouse 但是却是 touch 触发的 ---
        return true;
    }
    const now = Date.now();
    if (now - lastTouchTime < 1000 * 60) {
        // --- 当前是 mouse 但是 10000ms 内有 touch start ---
        return true;
    }
    return false;
}

/**
 * --- 创建任务时连同一起创建的 style 标签 ---
 * @param taskId 任务 id
 */
export function createToStyleList(taskId: number): void {
    styleList.insertAdjacentHTML('beforeend', `<div id="cg-style-task${taskId}"><style class="cg-style-global"></style><div class="cg-style-control"></div><div class="cg-style-theme"></div><div class="cg-style-form"></div></div>`);
}

/**
 * --- 任务结束时需要移除 task 的所有 style ---
 * @param taskId 任务 id
 */
export function removeFromStyleList(taskId: number): void {
    document.getElementById('cg-style-task' + taskId.toString())?.remove();
}

/**
 * --- 将 style 内容写入 dom ---
 * @param taskId 当前任务 ID
 * @param style 样式内容
 * @param type 插入的类型
 * @param formId 当前窗体 ID（global 下可空，theme 下为主题唯一标识符）
 */
export function pushStyle(taskId: number, style: string, type: 'global' | 'theme' | 'control' | 'form' = 'global', formId: number | string = 0): void {
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
        el.insertAdjacentHTML('beforeend', `<style class="cg-style-form${formId}">${style}</style>`);
    }
}

/**
 * --- 移除 style 样式 dom ---
 * @param taskId 要移除的任务 ID
 * @param type 移除的类型
 * @param formId 要移除的窗体 ID
 */
export function removeStyle(taskId: number, type: 'global' | 'theme' | 'control' | 'form' = 'global', formId: number | string = 0): void {
    const styleTask = document.getElementById('cg-style-task' + taskId.toString());
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
        if (formId === 0) {
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
        const elist = styleTask.querySelectorAll('.cg-style-form' + formId.toString());
        for (let i = 0; i < elist.length; ++i) {
            elist.item(i).remove();
        }
    }
}

/**
 * --- 获取当前任务中子类有几个子元素 ---
 * @param taskId 任务 ID
 * @param type 类型
 */
export function getStyleCount(taskId: number, type: 'theme' | 'control' | 'form'): number {
    return document.querySelectorAll(`#cg-style-task${taskId} > .cg-style-${type} > style`).length;
}

// -----------------
// --- watchSize ---
// -----------------

/** --- 被监视中的元素 --- */
const watchSizeList: Record<string, types.IWatchSizeItem> = {};

/** --- 监视元素的 data-cg-roindex --- */
let watchSizeIndex: number = 0;

// --- 创建 ro 对象 ---
const resizeObserver = new ResizeObserver(function(entries): void {
    for (const entrie of entries) {
        const el = entrie.target as HTMLElement;
        if (!el.offsetParent) {
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
                r.catch(function(e) {
                    console.log('ResizeObserver', e);
                });
            }
        }
        catch (e) {
            console.log('ResizeObserver', e);
        }
    }
});

/**
 * --- 添加监视 Element 对象大小，元素移除后自动停止监视（浏览器原生效果），已经监视中的不会再次监视 ---
 * @param el 要监视的大小
 * @param cb 回调函数
 * @param immediate 立刻先执行一次回调
 * @param taskId 归属到一个任务里可留空，App 模式下无效
 */
export function watchSize(
    el: HTMLElement,
    cb: () => void | Promise<void>,
    immediate: boolean = false,
    taskId?: number
): boolean {
    if (isWatchSize(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb();
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log('dom.watchSize', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watchSize', e);
        }
    }
    resizeObserver.observe(el);
    watchSizeList[watchSizeIndex] = {
        'el': el,
        'handler': cb,
        'taskId': taskId
    };
    el.dataset.cgRoindex = watchSizeIndex.toString();
    ++watchSizeIndex;
    return true;
}

/**
 * --- 移除监视 Element 对象大小 ---
 * @param el 要移除监视
 * @param taskId 校验任务 id，App 模式下无效
 */
export function unwatchSize(el: HTMLElement, taskId?: number): void {
    const index = el.dataset.cgRoindex;
    if (index === undefined) {
        return;
    }
    const item = watchSizeList[index];
    if (taskId && item.taskId !== taskId) {
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
 * --- 清除某个任务的所有 watch size 监视，App 模式下无效 ---
 * @param taskId 任务 id
 */
export function clearWatchSize(taskId: number): void {
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
const watchList: Record<string, types.IWatchItem> = {};

/** --- 监视元素的 data-cg-moindex --- */
let watchIndex: number = 0;

/**
 * --- 添加 DOM 内容变化监视 ---
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式
 * @param taskId 归属到一个任务里可留空，App 模式下无效
 */
export function watch(el: HTMLElement, cb: (mutations: MutationRecord[]) => void | Promise<void>, mode: 'child' | 'childsub' | 'style' | 'default' = 'default', immediate: boolean = false, taskId?: number): boolean {
    if (isWatch(el)) {
        return false;
    }
    if (immediate) {
        try {
            const r = cb([]);
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log('dom.watch', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watch', e);
        }
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
        case 'default': {
            moi = {
                'attributeFilter': ['style', 'class'],
                'attributeOldValue': true,
                'attributes': true,
                'characterData': true,
                'childList': true,
                'subtree': true
            };
            break;
        }
        default: {
            moi = mode;
        }
    }
    const mo = new MutationObserver((mutations) => {
        if (!el.offsetParent) {
            mo.disconnect();
            if (watchList[index]) {
                delete watchList[index];
            }
            return;
        }
        try {
            const r = cb(mutations);
            if (r instanceof Promise) {
                r.catch(function(e) {
                    console.log('dom.watch', e);
                });
            }
        }
        catch (e) {
            console.log('dom.watch', e);
        }
    });
    mo.observe(el, moi);
    watchList[index] = {
        'el': el,
        'mo': mo,
        'taskId': taskId
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
 * @param el 要移除监视
 * @param taskId 校验任务 id 可留空，App 模式下无效
 */
export function unwatch(el: HTMLElement, taskId?: number): void {
    const index = el.dataset.cgMoindex;
    if (index === undefined) {
        return;
    }
    const item = watchList[index];
    if (taskId && item.taskId !== taskId) {
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
 * --- 清除某个任务下面的所有 watch 监视，App 模式下无效 ---
 * @param taskId 任务 id，App 模式下无效
 */
export function clearWatch(taskId: number): void {
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

// ------------------
// --- watchStyle ---
// ------------------

const watchStyleList: Record<string, Record<string, {
    'el': HTMLElement;
    'sd': CSSStyleDeclaration;
    'names': Record<string, {
        'val': string;
        'cb': Array<(name: string, value: string, old: string) => void>;
    }>;
}>> = {};

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
    cb: (name: string, value: string, old: string) => void,
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
    if (!watchStyleList[formId]) {
        watchStyleList[formId] = {};
    }
    const index = el.dataset.cgStyleindex;
    if (index) {
        const item = watchStyleList[formId][index];
        // --- 已经有监听了 ---
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
                cb(n, (item.sd as any)[n], '');
            }
        }
        return;
    }
    // --- 创建监听 ---
    const sd = getComputedStyle(el);
    watchStyleList[formId][watchStyleIndex] = {
        'el': el,
        'sd': sd,
        'names': {}
    };
    const item = watchStyleList[formId][watchStyleIndex];
    for (const n of name) {
        item.names[n] = {
            'val': (item.sd as any)[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, (item.sd as any)[n], '');
        }
    }
    el.dataset.cgStyleindex = watchStyleIndex.toString();
    ++watchStyleIndex;
}

/** --- watch style 的 timer --- */
let watchStyleTimer = 0;
const watchStyleHandler = function(): void {
    // --- 为什么要判断 form.getFocus 存在否，因为 form 类可能还没加载出来，这个函数就已经开始执行了 ---
    if (form.getFocus) {
        // --- 只判断和执行活跃中的窗体的监听事件 ---
        const formId: number | null = form.getFocus();
        if (formId && watchStyleList[formId]) {
            for (const index in watchStyleList[formId]) {
                const item = watchStyleList[formId][index];
                if (!item.el.offsetParent) {
                    delete watchStyleList[formId][index];
                    if (!Object.keys(watchStyleList[formId]).length) {
                        delete watchStyleList[formId];
                    }
                    continue;
                }
                // --- 执行 cb ---
                for (const name in item.names) {
                    if ((item.sd as any)[name] === item.names[name].val) {
                        continue;
                    }
                    const old = item.names[name].val;
                    item.names[name].val = (item.sd as any)[name];
                    for (const cb of item.names[name].cb) {
                        cb(name, (item.sd as any)[name], old);
                    }
                }
            }
        }
    }
    watchStyleTimer = requestAnimationFrame(watchStyleHandler);
};
watchStyleHandler();

/**
 * --- 检测一个标签是否正在被 watchStyle ---
 * @param el 要检测的标签
 */
export function isWatchStyle(el: HTMLElement): boolean {
    return el.dataset.cgStyleindex ? true : false;
}

/**
 * --- 清除某个窗体的所有 watch style 监视，App 模式下无效 ---
 * @param formId 窗体 id
 */
export function clearWatchStyle(formId: number | string): void {
    if (!watchStyleList[formId]) {
        return;
    }
    for (const index in watchStyleList[formId]) {
        const item = watchStyleList[formId][index];
        item.el.removeAttribute('data-cg-styleindex');
    }
    delete watchStyleList[formId];
}

// ---------------------
// --- watchProperty ---
// ---------------------

/**
 * --- 监听中的标签对象，对应 formId -> 数组列表 ---
 */
const watchPropertyObjects: Record<string, Record<string, {
    'el': HTMLElement;
    'names': Record<string, {
        'val': string;
        'cb': Array<(name: string, value: string) => void>;
    }>;
}>> = {};

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
    cb: (name: string, value: string) => void,
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
    if (!watchPropertyObjects[formId]) {
        watchPropertyObjects[formId] = {};
    }
    const index = el.dataset.cgPropertyindex;
    if (index) {
        const item = watchPropertyObjects[formId][index];
        // --- 已经有监听了 ---
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
                cb(n, (item.el as any)[n]);
            }
        }
        return;
    }
    // --- 创建监听 ---
    watchPropertyObjects[formId][watchPropertyIndex] = {
        'el': el,
        'names': {}
    };
    const item = watchPropertyObjects[formId][watchPropertyIndex];
    for (const n of name) {
        item.names[n] = {
            'val': (item.el as any)[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, (item.el as any)[n]);
        }
    }
    el.dataset.cgPropertyindex = watchPropertyIndex.toString();
    ++watchPropertyIndex;
}

/** --- watch property 的 timer --- */
let watchPropertyTimer = 0;
const watchPropertyHandler = function(): void {
    // --- 为什么要判断 form.getFocus 存在否，因为 form 类可能还没加载出来，这个函数就已经开始执行了 ---
    if (form.getFocus) {
        // --- 只判断和执行活跃中的窗体的监听事件 ---
        const formId: number | null = form.getFocus();
        if (formId && watchPropertyObjects[formId]) {
            for (const index in watchPropertyObjects[formId]) {
                const item = watchPropertyObjects[formId][index];
                if (!item.el.offsetParent) {
                    delete watchPropertyObjects[formId][index];
                    if (!Object.keys(watchPropertyObjects[formId]).length) {
                        delete watchPropertyObjects[formId];
                    }
                    continue;
                }
                // --- 执行 cb ---
                for (const name in item.names) {
                    if ((item.el as any)[name] === item.names[name].val) {
                        continue;
                    }
                    item.names[name].val = (item.el as any)[name];
                    for (const cb of item.names[name].cb) {
                        cb(name, (item.el as any)[name]);
                    }
                }
            }
        }
    }
    watchPropertyTimer = requestAnimationFrame(watchPropertyHandler);
};
watchPropertyHandler();

/**
 * --- 检测一个标签是否正在被 watchProperty ---
 * @param el 要检测的标签
 */
export function isWatchProperty(el: HTMLElement): boolean {
    return el.dataset.cgPropertyindex ? true : false;
}

/**
 * --- 清除某个窗体的所有 watch property 监视，虽然窗体结束后相关监视永远不会再被执行，但是会形成冗余，App 模式下无效 ---
 * @param formId 窗体 id
 */
export function clearWatchProperty(formId: number | string): void {
    if (!watchPropertyObjects[formId]) {
        return;
    }
    for (const index in watchPropertyObjects[formId]) {
        const item = watchPropertyObjects[formId][index];
        item.el.removeAttribute('data-cg-propertyindex');
    }
    delete watchPropertyObjects[formId];
}

/**
 * --- 鼠标/手指没移动时，click 才生效 ---
 * @param e 事件对象
 * @param handler 回调
 */
export function bindClick(e: MouseEvent | TouchEvent, handler: () => void): void {
    const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    bindDown(e, {
        up: (ne) => {
            const nx = ne instanceof MouseEvent ? ne.clientX : ne.touches[0].clientX;
            const ny = ne instanceof MouseEvent ? ne.clientY : ne.touches[0].clientY;
            if (nx === x && ny === y) {
                handler();
            }
        }
    });
}

/**
 * --- 绑定按下以及弹起事件，touch 和 mouse 只会绑定一个 ---
 * @param oe MouseEvent | TouchEvent
 * @param opt 回调选项
 */
export function bindDown(oe: MouseEvent | TouchEvent, opt: types.IBindDownOptions): void {
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

    let end: ((e: MouseEvent | TouchEvent) => void) | undefined = undefined;
    const move = function(e: MouseEvent | TouchEvent): void {
        // --- 虽然上层已经有 preventDefault 了，但是有可能 e.target 会被注销，这样就响应不到上层的 preventDefault 事件，所以要在这里再加一个 ---
        if ((!e.target || !(e.target as HTMLElement).offsetParent) && e.cancelable) {
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
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', end!);
                }
                else {
                    (oe.target as HTMLElement).removeEventListener('touchmove', move);
                    (oe.target as HTMLElement).removeEventListener('touchend', end!);
                    (oe.target as HTMLElement).removeEventListener('touchcancel', end!);
                }
                return;
            }
        }
        if (opt.move && (opt.move(e, dir) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', end!);
            }
            else {
                if (oe.target) {
                    (oe.target as HTMLElement).removeEventListener('touchmove', move);
                    (oe.target as HTMLElement).removeEventListener('touchend', end!);
                    (oe.target as HTMLElement).removeEventListener('touchcancel', end!);
                }
            }
            return;
        }
    };
    end = function(e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent) {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end!);
        }
        else {
            if (oe.target) {
                (oe.target as HTMLElement).removeEventListener('touchmove', move);
                (oe.target as HTMLElement).removeEventListener('touchend', end!);
                (oe.target as HTMLElement).removeEventListener('touchcancel', end!);
            }
        }
        opt.up?.(e);
        if (isStart) {
            opt.end?.(e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move, {
            'passive': false
        });
        window.addEventListener('mouseup', end);
    }
    else {
        (oe.target as HTMLElement).addEventListener('touchmove', move, {
            'passive': false
        });
        (oe.target as HTMLElement).addEventListener('touchend', end);
        (oe.target as HTMLElement).addEventListener('touchcancel', end);
    }
    opt.down?.(oe);
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
 * @param before before 事件，返回 true 则显示 gesture
 * @param handler 执行完毕的话才会回调
 */
export function bindGesture(oe: MouseEvent | TouchEvent | WheelEvent, before: (e: MouseEvent | TouchEvent | WheelEvent, dir: 'top' | 'right' | 'bottom' | 'left') => boolean, handler?: (dir: 'top' | 'right' | 'bottom' | 'left') => void | Promise<void>): void {
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
                        before(e, dir);
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
                    if (!before(e, dir)) {
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
                    form.elements.gesture.style.opacity = '1';
                    form.elements.gesture.classList.add('done');
                }
                else {
                    form.elements.gesture.classList.remove('done');
                    if (offset < 0) {
                        offset = 0;
                        form.elements.gesture.style.opacity = '0';
                    }
                    else {
                        form.elements.gesture.style.opacity = '1';
                    }
                }
                form.elements.gesture.style.transform = 'scale(' + (offset / 90).toString() + ')';

                // --- 处理标签位置 ---
                switch (dir) {
                    case 'top':
                    case 'bottom': {
                        form.elements.gesture.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        if (dir === 'top') {
                            form.elements.gesture.style.top = (rect.top + (offset / 1.5)).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.top = (rect.bottom - 20 - (offset / 1.5)).toString() + 'px';
                        }
                        break;
                    }
                    default: {
                        form.elements.gesture.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        if (dir === 'left') {
                            form.elements.gesture.style.left = (rect.left + (offset / 1.5)).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.left = (rect.right - 20 - (offset / 1.5)).toString() + 'px';
                        }
                    }
                }
            },
            end: (): void => {
                form.elements.gesture.style.opacity = '0';
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
                // --- 判断是否要显示滚动条 ---
                if (!before(oe, gestureWheel.dir as any)) {
                    // --- 不显示 ---
                    gestureWheel.done = true;
                    return;
                }
                // --- 重置位置 ---
                form.elements.gesture.style.transform = 'scale(0)';
                switch (gestureWheel.dir) {
                    case 'top':
                    case 'bottom': {
                        form.elements.gesture.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        if (gestureWheel.dir === 'top') {
                            form.elements.gesture.style.top = (rect.top + 10).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.top = (rect.bottom - 10).toString() + 'px';
                        }
                        break;
                    }
                    default: {
                        form.elements.gesture.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        if (gestureWheel.dir === 'left') {
                            form.elements.gesture.style.left = (rect.left + 10).toString() + 'px';
                        }
                        else {
                            form.elements.gesture.style.left = (rect.right - 10).toString() + 'px';
                        }
                    }
                }
                gestureWheel.firstTimer = true;
                await tool.sleep(30);
                gestureWheel.firstTimer = false;
                form.elements.gesture.classList.add('ani');
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
                form.elements.gesture.style.opacity = '0';
                return;
            }
            // --- 显示 gesture 对象 ---
            form.elements.gesture.style.opacity = '1';
            let offset = gestureWheel.offset / 1.38;
            if (offset > 90) {
                offset = 90;
                form.elements.gesture.classList.add('done');
            }
            else {
                form.elements.gesture.classList.remove('done');
            }
            // --- 处理标签位置（20 像素是 gesture 的宽高） ---
            form.elements.gesture.style.transform = 'scale(' + (offset / 90).toString() + ')';
            switch (gestureWheel.dir) {
                case 'top': {
                    form.elements.gesture.style.top = (rect.top + (offset / 1.5)).toString() + 'px';
                    break;
                }
                case 'bottom': {
                    form.elements.gesture.style.top = (rect.bottom - 20 - (offset / 1.5)).toString() + 'px';
                    break;
                }
                case 'left': {
                    form.elements.gesture.style.left = (rect.left + (offset / 1.5)).toString() + 'px';
                    break;
                }
                default: {
                    form.elements.gesture.style.left = (rect.right - 20 - (offset / 1.5)).toString() + 'px';
                }
            }
            // --- 看是否要响应 ---
            clearTimeout(gestureWheel.timer);
            if (offset < 90) {
                gestureWheel.timer = window.setTimeout(() => {
                    form.elements.gesture.style.opacity = '0';
                    form.elements.gesture.classList.remove('ani');
                }, 250);
                return;
            }
            gestureWheel.done = true;
            handler?.(gestureWheel.dir as any) as any;
            await tool.sleep(500);
            form.elements.gesture.style.opacity = '0';
            form.elements.gesture.classList.remove('ani');
        })().catch((e) => {
            console.log('error', 'dom.bindGesture', e);
        });
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
    const tx: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const ty: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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

/**
 * --- 绑定拖动 ---
 * @param e 鼠标事件
 * @param opt 参数
 */
export function bindDrag(e: MouseEvent | TouchEvent, opt: { 'el': HTMLElement; 'data'?: any; }): void {
    let otop = 0;
    let oleft = 0;
    let nel: HTMLElement | null = null;
    bindMove(e, {
        'object': opt.el,
        'start': function() {
            const rect = opt.el.getBoundingClientRect();
            form.showDrag();
            form.moveDrag({
                'top': rect.top,
                'left': rect.left,
                'width': rect.width,
                'height': rect.height,
                'icon': true
            });
            otop = rect.top;
            oleft = rect.left;
        },
        'move': function(e, o) {
            const ntop = otop + o.oy;
            const nleft = oleft + o.ox;
            form.moveDrag({
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
                            'value': opt.data
                        }
                    }));
                }
                el.dataset.cgHover = '';
                nel = el;
                nel.dispatchEvent(new CustomEvent('dragenter', {
                    'detail': {
                        'value': opt.data
                    }
                }));
                return;
            }
            // --- not found ---
            form.moveDrag({
                'icon': true
            });
            if (nel === null) {
                return;
            }
            nel.removeAttribute('data-cg-hover');
            nel.dispatchEvent(new CustomEvent('dragleave', {
                'detail': {
                    'value': opt.data
                }
            }));
            nel = null;
        },
        'end': function() {
            form.hideDrag();
            if (nel === null) {
                return;
            }
            nel.removeAttribute('data-cg-hover');
            nel.dispatchEvent(new CustomEvent('drop', {
                'detail': {
                    'value': opt.data
                }
            }));
        }
    });
}

/** --- 目前是否已绑定了 bindMove --- */
export const is = clickgo.vue.reactive({
    'move': false,
    'shift': false,
    'ctrl': false,
    'meta': false
});

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
});
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
});

/**
 * --- 绑定拖动事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 回调选项
 */
export function bindMove(e: MouseEvent | TouchEvent, opt: types.IBindMoveOptions): types.IBindMoveResult {
    if (hasTouchButMouse(e)) {
        return {
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0
        };
    }
    is.move = true;
    setGlobalCursor(opt.cursor ? opt.cursor : getComputedStyle(e.target as Element).cursor);
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
        const area = core.getAvailArea();
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
            let border: types.TDomBorder = '';
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
        form.showRectangle(tx, ty, {
            'left': left,
            'top': top,
            'width': right - left,
            'height': bottom - top
        });
        setTimeout(() => {
            form.hideRectangle();
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
export function bindResize(e: MouseEvent | TouchEvent, opt: types.IBindResizeOptions): void {
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
 */
export function findParentByData(el: HTMLElement, name: string): HTMLElement | null {
    let parent = el.parentNode as HTMLElement;
    while (parent) {
        if (!parent.tagName) {
            continue;
        }
        if (parent.tagName.toLowerCase() === 'body') {
            break;
        }
        if (parent.getAttribute('data-' + name) !== null) {
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

// --- 全屏 ---
export function fullscreen(): boolean {
    const he = document.getElementsByTagName('html')[0] as any;
    if (he.webkitRequestFullscreen) {
        he.webkitRequestFullscreen();
        return true;
    }
    else if (he.requestFullscreen) {
        he.requestFullscreen();
        return true;
    }
    else {
        return false;
    }
}

// --- 处理 timer 类，窗体消失时不进行监听 ---
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // --- 隐藏 ---
        cancelAnimationFrame(watchStyleTimer);
        cancelAnimationFrame(watchPropertyTimer);
    }
    else {
        // --- 显示 ---
        watchStyleTimer = requestAnimationFrame(watchStyleHandler);
        watchPropertyTimer = requestAnimationFrame(watchPropertyHandler);
    }
});
