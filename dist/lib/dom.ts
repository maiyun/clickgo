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
import * as form from './form';
import * as core from './core';

/** --- style list 的 div --- */
const topClass: string[] = ['#cg-form-list', '#cg-pop-list', '#cg-system', '#cg-simpletask'];
function classUnfold(after?: string): string {
    const arr: string[] = [];
    for (const name of topClass) {
        arr.push(name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}

/*
#cg-gesture {box-sizing: border-box; position: fixed; z-index: 20020004; border: solid 3px #ff976a; border-radius: 50%; filter: drop-shadow(0 0 3px #ff976a); pointer-events: none; opacity: 0; transform: scale(0); width: 20px; height: 20px;}
#cg-gesture.done {background: #ff976a;}
*/
const styleList: HTMLDivElement = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style id='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; position: fixed; left: 0; top: 0; width: 0; height: 0; cursor: default; box-sizing: border-box;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection')} {background-color: rgba(0, 0, 0, .1);}
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

/**
 * --- 获取实时的 DOM SIZE ---
 * @param el 要获取的 dom
 */
export function getSize(el: HTMLElement): types.IDomSize {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const border = {
        'top': parseFloat(cs.borderTopWidth),
        'right': parseFloat(cs.borderRightWidth),
        'bottom': parseFloat(cs.borderBottomWidth),
        'left': parseFloat(cs.borderLeftWidth)
    };
    const padding = {
        'top': parseFloat(cs.paddingTop),
        'right': parseFloat(cs.paddingRight),
        'bottom': parseFloat(cs.paddingBottom),
        'left': parseFloat(cs.paddingLeft)
    };
    return {
        'top': rect.top,
        'right': rect.right,
        'bottom': rect.bottom,
        'left': rect.left,
        'width': rect.width,
        'height': rect.height,
        'padding': padding,
        'border': border,
        'clientWidth': rect.width - border.left - border.right,
        'clientHeight': rect.height - border.top - border.bottom,
        'innerWidth': rect.width - border.left - border.right - padding.left - padding.right,
        'innerHeight': rect.height - border.top - border.bottom - padding.top - padding.bottom,
        'scrollWidth': el.scrollWidth,
        'scrollHeight': el.scrollHeight
    };
}

/** --- 被监视中的元素 --- */
const watchSizeList: types.IWatchSizeItem[] = [];

/**
 * --- 添加监视 Element 对象大小，元素移除后自动停止监视（浏览器原生效果） ---
 * @param el 要监视的大小
 * @param cb 回调函数
 * @param immediate 立刻先执行一次回调
 * @param taskId 归属到一个任务里可留空，App 模式下无效
 */
export function watchSize(
    el: HTMLElement,
    cb: (size: types.IDomSize) => Promise<void> | void,
    immediate: boolean = false,
    taskId?: number
): types.IDomSize {
    const fsize = getSize(el);
    for (const item of watchSizeList) {
        if (item.el === el) {
            return fsize;
        }
    }
    if (immediate) {
        const r = cb(fsize);
        if (r instanceof Promise) {
            r.catch(function(e) {
                console.log(e);
            });
        }
    }
    const resizeObserver = new (window as any).ResizeObserver(function(): void {
        const size = getSize(el);
        if (Number.isNaN(size.clientWidth)) {
            return;
        }
        const r = cb(size);
        if (r instanceof Promise) {
            r.catch(function(e) {
                console.log(e);
            });
        }
    });
    resizeObserver.observe(el);
    watchSizeList.push({
        'el': el,
        'ro': resizeObserver,
        'taskId': taskId
    });
    return fsize;
}

/**
 * --- 移除监视 Element 对象大小
 * @param el 要移除监视
 * @param taskId 校验任务 id，App 模式下无效
 */
export function unwatchSize(el: HTMLElement, taskId?: number): void {
    for (let i = 0; i < watchSizeList.length; ++i) {
        const item = watchSizeList[i];
        if (item.el !== el) {
            continue;
        }
        if (taskId && taskId !== item.taskId) {
            // --- taskId 校验失败 ---
            return;
        }
        // --- 要移除 ---
        if (item.el.offsetParent) {
            item.ro.unobserve(item.el);
        }
        watchSizeList.splice(i, 1);
        --i;
        return;
    }
}

/**
 * --- 清除某个任务下面的所有监视 ---
 * @param taskId 任务 id，App 模式下无效
 */
export function clearWatchSize(taskId?: number): void {
    if (!taskId) {
        return;
    }
    for (let i = 0; i < watchSizeList.length; ++i) {
        const item = watchSizeList[i];
        if (taskId !== item.taskId) {
            continue;
        }
        if (item.el.offsetParent) {
            item.ro.unobserve(item.el);
        }
        watchSizeList.splice(i, 1);
        --i;
    }
}

/**
 * --- 每隔一段时间清除一次无效的 el ---
 */
function cgClearWatchSize(): void {
    for (let i = 0; i < watchSizeList.length; ++i) {
        const item = watchSizeList[i];
        if (item.el.offsetParent) {
            continue;
        }
        watchSizeList.splice(i, 1);
        --i;
    }
}
setInterval(cgClearWatchSize, 1000 * 60 * 5);

/** --- 监视 dom 变动中的元素 */
const watchList: types.IWatchItem[] = [];

/**
 * --- 添加 DOM 内容变化监视 ---
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式
 * @param taskId 归属到一个任务里可留空，App 模式下无效
 */
export function watch(el: HTMLElement, cb: () => void, mode: 'child' | 'childsub' | 'style' | 'default' = 'default', immediate: boolean = false, taskId?: number): void {
    if (immediate) {
        cb();
    }
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
    const mo = new MutationObserver(cb);
    mo.observe(el, moi);
    watchList.push({
        'el': el,
        'mo': mo,
        'taskId': taskId
    });
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
 * --- 移除监视 Element 对象大小
 * @param el 要移除监视
 * @param taskId 校验任务 id 可留空，App 模式下无效
 */
export function unwatch(el: HTMLElement, taskId?: number): void {
    for (let i = 0; i < watchList.length; ++i) {
        const item = watchList[i];
        if (item.el !== el) {
            continue;
        }
        if (taskId && taskId !== item.taskId) {
            // --- taskId 校验失败 ---
            return;
        }
        // --- 要移除 ---
        if (item.el.offsetParent) {
            item.mo.disconnect();
        }
        watchList.splice(i, 1);
        --i;
        return;
    }
}

/**
 * --- 清除某个任务下面的所有 watch 监视 ---
 * @param taskId 任务 id，App 模式下无效
 */
export function clearWatch(taskId?: number): void {
    if (!taskId) {
        return;
    }
    for (let i = 0; i < watchList.length; ++i) {
        const item = watchList[i];
        if (taskId !== item.taskId) {
            continue;
        }
        if (item.el.offsetParent) {
            item.mo.disconnect();
        }
        watchList.splice(i, 1);
        --i;
    }
}

/**
 * --- 每隔一段时间清除一次无效的 watch el ---
 */
function cgClearWatch(): void {
    for (let i = 0; i < watchList.length; ++i) {
        const item = watchList[i];
        if (item.el.offsetParent) {
            continue;
        }
        watchList.splice(i, 1);
        --i;
    }
}
setInterval(cgClearWatch, 1000 * 60 * 5);

const watchStyleObjects: Array<{
    'el': HTMLElement;
    'sd': CSSStyleDeclaration;
    'names': Record<string, {
        'old': string;
        'cb': Array<(name: string, value: string) => void>;
    }>;
}> = [];
export function watchStyle(
    el: HTMLElement,
    name: string | string[],
    cb: (name: string, value: string) => void,
    immediate: boolean = false
): void {
    if (typeof name === 'string') {
        name = [name];
    }
    for (const item of watchStyleObjects) {
        if (item.el !== el) {
            continue;
        }
        // --- 已经有监听了 ---
        for (const n of name) {
            if (!item.names[n]) {
                item.names[n] = {
                    'old': (item.sd as any)[n],
                    'cb': [cb]
                };
            }
            else {
                item.names[n].cb.push(cb);
            }
            if (immediate) {
                cb(n, (item.sd as any)[n]);
            }
        }
        return;
    }
    // --- 创建监听 ---
    const sd = getComputedStyle(el);
    watchStyleObjects.push({
        'el': el,
        'sd': sd,
        'names': {}
    });
    const item = watchStyleObjects[watchStyleObjects.length - 1];
    for (const n of name) {
        item.names[n] = {
            'old': (item.sd as any)[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, (item.sd as any)[n]);
        }
    }
}
const watchStyleRAF = function(): void {
    for (let i = 0; i < watchStyleObjects.length; ++i) {
        const item = watchStyleObjects[i];
        if (watchStyleObjects[i].sd.flex === '') {
            watchStyleObjects.splice(i, 1);
            --i;
            continue;
        }
        // --- 执行 cb ---
        for (const name in item.names) {
            if ((item.sd as any)[name] === item.names[name].old) {
                continue;
            }
            item.names[name].old = (item.sd as any)[name];
            for (const cb of item.names[name].cb) {
                cb(name, (item.sd as any)[name]);
            }
        }
    }
    requestAnimationFrame(watchStyleRAF);
};
watchStyleRAF();

/**
 * --- 检测一个标签是否正在被 watchStyle ---
 * @param el 要检测的标签
 */
export function isWatchStyle(el: HTMLElement): boolean {
    for (const item of watchStyleObjects) {
        if (item.el !== el) {
            continue;
        }
        return true;
    }
    return false;
}

/**
 * --- 绑定按下以及弹起事件 ---
 * @param e MouseEvent | TouchEvent
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
        if (!e.target || !(e.target as HTMLElement).offsetParent) {
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
        window.addEventListener('mousemove', move, { 'passive': false });
        window.addEventListener('mouseup', end);
    }
    else {
        (oe.target as HTMLElement).addEventListener('touchmove', move, { 'passive': false });
        (oe.target as HTMLElement).addEventListener('touchend', end);
        (oe.target as HTMLElement).addEventListener('touchcancel', end);
    }
    opt.down?.(oe);
}

const bindGestureData: {
    'el': HTMLElement | null;
    'xx': number;
    'xy': number;
    'tx': number;
    'ty': number;
    'dir': 'top' | 'right' | 'bottom' | 'left' | null;
    'timers': {
        'ani': number;
        'sleep': number;
    };
} = {
    'el': null,
    'xx': 0,    // 当前 x
    'xy': 0,
    'tx': 0,    // 最终 x
    'ty': 0,
    'dir': null,
    'timers': {
        'ani': 0,
        'sleep': 0
    }
};

function clearGestureData(): void {
    bindGestureData.xx = 0;
    bindGestureData.xy = 0;
    bindGestureData.tx = 0;
    bindGestureData.ty = 0;
}

function bindGestureAnimation(opt: { 'rect': DOMRect; 'dirs'?: Array<('top' | 'right' | 'bottom' | 'left')>; handler: (dir: 'top' | 'right' | 'bottom' | 'left') => void; }): void {
    if (!bindGestureData.el) {
        return;
    }
    const speed: number = 6;
    const gestureElement = document.getElementById('cg-gesture')!;
    const dirs = opt.dirs ?? ['top', 'bottom'];

    if (bindGestureData.tx > bindGestureData.xx) {
        bindGestureData.xx += speed;
        if (bindGestureData.xx > bindGestureData.tx) {
            bindGestureData.xx = bindGestureData.tx;
        }
    }
    else {
        bindGestureData.xx -= speed;
        if (bindGestureData.xx < bindGestureData.tx) {
            bindGestureData.xx = bindGestureData.tx;
        }
    }
    if (bindGestureData.ty > bindGestureData.xy) {
        bindGestureData.xy += speed;
        if (bindGestureData.xy > bindGestureData.ty) {
            bindGestureData.xy = bindGestureData.ty;
        }
    }
    else {
        bindGestureData.xy -= speed;
        if (bindGestureData.xy < bindGestureData.ty) {
            bindGestureData.xy = bindGestureData.ty;
        }
    }
    const xxAbs = Math.abs(bindGestureData.xx);
    const xyAbs = Math.abs(bindGestureData.xy);
    if ((!dirs.includes('top') && !dirs.includes('bottom')) || ((xxAbs > xyAbs) && (dirs.includes('left') || dirs.includes('right')))) {
        // --- 水平 ---
        if (bindGestureData.xx < 0) {
            // --- left ---
            if (!dirs.includes('left')) {
                gestureElement.style.opacity = '0';
                clearGestureData();
                return;
            }
            gestureElement.style.opacity = '1';
            if (xxAbs === 90) {
                bindGestureData.dir = 'left';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.top = (opt.rect.top + ((opt.rect.height - 20) / 2)).toString() + 'px';
            gestureElement.style.left = (opt.rect.left - 10 + (xxAbs / 1.5)).toString() + 'px';
            gestureElement.style.transform = 'scale(' + (xxAbs / 90).toString() + ')';
        }
        else {
            // --- right ---
            if (!dirs.includes('right')) {
                gestureElement.style.opacity = '0';
                clearGestureData();
                return;
            }
            gestureElement.style.opacity = '1';
            if (xxAbs === 90) {
                bindGestureData.dir = 'right';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.top = (opt.rect.top + ((opt.rect.height - 20) / 2)).toString() + 'px';
            gestureElement.style.left = (opt.rect.left + opt.rect.width - 10 - (xxAbs / 1.5)).toString() + 'px';
            gestureElement.style.transform = 'scale(' + (xxAbs / 90).toString() + ')';
        }
    }
    else {
        if (bindGestureData.xy < 0) {
            // --- top ---
            if (!dirs.includes('top')) {
                gestureElement.style.opacity = '0';
                clearGestureData();
                return;
            }
            gestureElement.style.opacity = '1';
            if (xyAbs === 90) {
                bindGestureData.dir = 'top';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.left = (opt.rect.left + ((opt.rect.width - 20) / 2)).toString() + 'px';
            gestureElement.style.top = (opt.rect.top - 10 + (xyAbs / 1.5)).toString() + 'px';
            gestureElement.style.transform = 'scale(' + (xyAbs / 90).toString() + ')';
        }
        else {
            // --- bottom ---
            if (!dirs.includes('bottom')) {
                gestureElement.style.opacity = '0';
                clearGestureData();
                return;
            }
            gestureElement.style.opacity = '1';
            if (xyAbs === 90) {
                bindGestureData.dir = 'bottom';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.left = (opt.rect.left + ((opt.rect.width - 20) / 2)).toString() + 'px';
            gestureElement.style.top = (opt.rect.top + opt.rect.height - 10 - (xyAbs / 1.5)).toString() + 'px';
            gestureElement.style.transform = 'scale(' + (xyAbs / 90).toString() + ')';
        }
    }

    if (bindGestureData.xx === bindGestureData.tx && bindGestureData.xy === bindGestureData.ty) {
        // --- 中途终止 ---
        bindGestureData.timers.ani = 0;
        bindGestureData.timers.sleep = window.setTimeout(() => {
            // --- 触摸板 wheel 可能会多次执行，导致圆圈一直在，有缓动 ---
            clearGestureData();
            bindGestureData.timers.sleep = 0;
            gestureElement.style.opacity = '0';
            if (!bindGestureData.dir) {
                return;
            }
            opt.handler(bindGestureData.dir);
        }, 500);
        return;
    }
    bindGestureData.timers.ani = requestAnimationFrame(() => {
        bindGestureAnimation(opt);
    });
}

/**
 * --- 绑定上拉、下拉、左拉、右拉 ---
 * @param e 响应事件
 * @param opt 选项
 */
export function bindGesture(e: MouseEvent | TouchEvent | WheelEvent | { 'x'?: number; 'y'?: number; }, opt: types.IBindGestureOptions): void {
    const gestureElement = document.getElementById('cg-gesture')!;
    const el: HTMLElement | undefined = ((e as any).currentTarget as HTMLElement | undefined)
        ?? ((e as any).target as HTMLElement | undefined) ?? opt.el;
    if (!el) {
        return;
    }
    let rect: DOMRect;
    if ((e as any).rect) {
        rect = (e as any).rect as DOMRect;
    }
    else if (opt.rect) {
        rect = opt.rect;
    }
    else {
        if (!(el.getBoundingClientRect)) {
            return;
        }
        rect = el.getBoundingClientRect();
    }
    const dirs = opt.dirs ?? ['top', 'bottom'];
    if ((e instanceof MouseEvent || e instanceof TouchEvent) && !(e instanceof WheelEvent)) {
        // --- touch / mouse 触发的 ---
        const x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        let dir: 'top' | 'right' | 'bottom' | 'left' | null = null;
        /** --- 当前手势方向 --- */
        bindDown(e, {
            move: (e) => {
                e.preventDefault();
                if (bindGestureData.timers.ani !== 0) {
                    cancelAnimationFrame(bindGestureData.timers.ani);
                    bindGestureData.timers.ani = 0;
                }
                if (bindGestureData.timers.sleep !== 0) {
                    clearTimeout(bindGestureData.timers.sleep);
                    bindGestureData.timers.sleep = 0;
                }

                const nx: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
                const ny: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
                /** --- 相对于按下时 x 的差值 --- */
                const xx = nx - x;
                /** --- 相对于按下时 y 的差值 --- */
                const xy = ny - y;
                let xxAbs = Math.abs(xx);
                let xyAbs = Math.abs(xy);
                if ((!dirs.includes('top') && !dirs.includes('bottom')) || ((xxAbs > xyAbs) && (dirs.includes('left') || dirs.includes('right')))) {
                    // --- 水平 ---
                    if (xx > 0) {
                        // --- left ---
                        if (!dirs.includes('left')) {
                            gestureElement.style.opacity = '0';
                            return;
                        }
                        gestureElement.style.opacity = '1';
                        if (xxAbs > 90) {
                            xxAbs = 90;
                            dir = 'left';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        gestureElement.style.left = (rect.left - 10 + (xxAbs / 1.5)).toString() + 'px';
                        gestureElement.style.transform = 'scale(' + (xxAbs / 90).toString() + ')';
                    }
                    else {
                        // --- right ---
                        if (!dirs.includes('right')) {
                            gestureElement.style.opacity = '0';
                            return;
                        }
                        gestureElement.style.opacity = '1';
                        if (xxAbs > 90) {
                            xxAbs = 90;
                            dir = 'right';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.top = (rect.top + ((rect.height - 20) / 2)).toString() + 'px';
                        gestureElement.style.left = (rect.left + rect.width - 10 - (xxAbs / 1.5)).toString() + 'px';
                        gestureElement.style.transform = 'scale(' + (xxAbs / 90).toString() + ')';
                    }
                }
                else {
                    if (xy > 0) {
                        // --- top ---
                        if (!dirs.includes('top')) {
                            gestureElement.style.opacity = '0';
                            return;
                        }
                        gestureElement.style.opacity = '1';
                        if (xyAbs > 90) {
                            xyAbs = 90;
                            dir = 'top';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        gestureElement.style.top = (rect.top - 10 + (xyAbs / 1.5)).toString() + 'px';
                        gestureElement.style.transform = 'scale(' + (xyAbs / 90).toString() + ')';
                    }
                    else {
                        // --- bottom ---
                        if (!dirs.includes('bottom')) {
                            gestureElement.style.opacity = '0';
                            return;
                        }
                        gestureElement.style.opacity = '1';
                        if (xyAbs > 90) {
                            xyAbs = 90;
                            dir = 'bottom';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.left = (rect.left + ((rect.width - 20) / 2)).toString() + 'px';
                        gestureElement.style.top = (rect.top + rect.height - 10 - (xyAbs / 1.5)).toString() + 'px';
                        gestureElement.style.transform = 'scale(' + (xyAbs / 90).toString() + ')';
                    }
                }
            },
            end: (): void => {
                gestureElement.style.opacity = '0';
                if (!dir) {
                    return;
                }
                opt.handler(dir);
            }
        });
    }
    else {
        // --- wheel 触发、自定义触发 ---
        if (bindGestureData.el !== el) {
            bindGestureData.el = el;
            bindGestureData.xx = 0;
            bindGestureData.xy = 0;
        }
        let x: number = 0, y: number = 0;
        if (e instanceof WheelEvent) {
            e.preventDefault();
            if (Math.abs(e.deltaX) < 5 && Math.abs(e.deltaY) < 5) {
                return;
            }
            x = Math.round(e.deltaX / 3);
            y = Math.round(e.deltaY / 3);
            if ((e as any).direction === 'h') {
                x = y;
                y = 0;
            }
            else if ((e as any).direction === 'v') {
                y = x;
                x = 0;
            }
        }
        else {
            x = e.x ?? 0;
            y = e.y ?? 0;
        }
        let tx = bindGestureData.tx + x;
        if (tx > 90) {
            tx = 90;
        }
        else if (tx < -90) {
            tx = -90;
        }
        let ty = bindGestureData.ty + y;
        if (ty > 90) {
            ty = 90;
        }
        else if (ty < -90) {
            ty = -90;
        }
        bindGestureData.tx = tx;
        bindGestureData.ty = ty;
        if (bindGestureData.timers.ani !== 0) {
            cancelAnimationFrame(bindGestureData.timers.ani);
            bindGestureData.timers.ani = 0;
        }
        if (bindGestureData.timers.sleep !== 0) {
            clearTimeout(bindGestureData.timers.sleep);
            bindGestureData.timers.sleep = 0;
        }
        bindGestureAnimation({
            'rect': rect,
            'dirs': opt.dirs,
            'handler': opt.handler
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
        'move': function(ox, oy, x, y) {
            const ntop = otop + oy;
            const nleft = oleft + ox;
            form.moveDrag({
                'top': ntop,
                'left': nleft,
                'icon': false
            });
            otop = ntop;
            oleft = nleft;
            // --- 获取当前 element ---
            const els = document.elementsFromPoint(x, y) as HTMLElement[];
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
export const is = Vue.reactive({
    'move': false,
    'shift': false,
    'ctrl': false
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
    setGlobalCursor(getComputedStyle(e.target as Element).cursor);
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
        if (!(opt.areaObject instanceof HTMLElement)) {
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
                if (!(opt.object instanceof HTMLElement)) {
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
            let border: types.TBorder = '';
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

            opt.move?.(ox, oy, x, y, border, dir, e);
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
 * @param moveCb 拖动时的回调
 * @param endCb 结束时的回调
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
        if (!(opt.object instanceof HTMLElement)) {
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
        'move': function(ox, oy, x, y, border) {
            if (opt.border === 'tr' || opt.border === 'r' || opt.border === 'rb') {
                opt.objectWidth! += ox;
            }
            else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
                opt.objectWidth! -= ox;
                opt.objectLeft! += ox;
            }
            if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
                opt.objectHeight! += oy;
            }
            else if (opt.border === 'lt' || opt.border === 't' || opt.border === 'tr') {
                opt.objectHeight! -= oy;
                opt.objectTop! += oy;
            }
            opt.move?.(opt.objectLeft!, opt.objectTop!, opt.objectWidth!, opt.objectHeight!, x, y, border);
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
