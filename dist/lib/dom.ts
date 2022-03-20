/**
 * Copyright 2021 Han Guoshuai <zohegs@gmail.com>
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

/** --- style list 的 div --- */
let topClass: string[] = ['#cg-form-list', '#cg-pop-list', '#cg-system', '#cg-simpletask'];
function classUnfold(after?: string): string {
    let arr: string[] = [];
    for (let name of topClass) {
        arr.push(name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}

/*
#cg-gesture {box-sizing: border-box; position: fixed; z-index: 20020004; border: solid 3px #ff976a; border-radius: 50%; filter: drop-shadow(0 0 3px #ff976a); pointer-events: none; opacity: 0; transform: scale(0); width: 20px; height: 20px;}
#cg-gesture.done {background: #ff976a;}
*/
let styleList: HTMLDivElement = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style id='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; position: fixed; left: 0; top: 0; width: 0; height: 0; cursor: default; box-sizing: border-box;}
#cg-form-list {z-index: 20020000;}
#cg-pop-list {z-index: 20020001;}
#cg-system {z-index: 20020002;}
#cg-simpletask {z-index: 20020003;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection')} {background-color: rgba(0, 120, 215, .3);}

${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold()}, ${classUnfold('input')}, ${classUnfold('textarea')} {font-family: "Lucida Sans Unicode", "Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased;}

#cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border-radius: 3px; box-shadow: 0 0 10px rgba(0, 0, 0, .25); background: rgba(255, 255, 255, .05); pointer-events: none; opacity: 0;}
#cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #ff976a; border-radius: 50%; filter: drop-shadow(0 0 3px #ff976a); pointer-events: none; opacity: 0;}
#cg-gesture {box-sizing: border-box; position: fixed; z-index: 20020004; border-radius: 50%; pointer-events: none; opacity: 0; background: rgba(0, 0, 0, .3); box-shadow: 0 5px 20px rgba(0, 0, 0, .25); transform: scale(0); width: 20px; height: 20px;}
#cg-gesture.done {background: rgba(255, 255, 255, .3); border: solid 3px rgba(0, 0, 0, .3)}

[data-cg-pop] {position: fixed; box-shadow: 0px 5px 20px rgba(0, 0, 0, .25); transition: .1s ease-out; transition-property: transform, opacity; transform: translateY(-10px); opacity: 0;}
[data-cg-pop]:not([data-cg-open]) {pointer-events: none;}
[data-cg-pop][data-cg-open] {transform: translateY(0px); opacity: 1;}

.cg-system-notify {background: rgba(0, 0, 0, .5); position: fixed; padding: 15px; border-radius: 3px; right: 0; top: 0; width: 280px; font-size: 14px; display: flex; transition: .1s ease-out; transition-property: transform, opacity; overflow: hidden; color: #f6f6f6; box-shadow: 0 5px 20px rgba(0, 0, 0, .25); -webkit-backdrop-filter: blur(20px) brightness(1.1); backdrop-filter: blur(20px) brightness(1.1);}
.cg-system-icon {margin-right: 10px; width: 16px; height: 16px; border-radius: 50%;}
.cg-system-icon-primary {background: #07c160;}
.cg-system-icon-info {background: #1989fa;}
.cg-system-icon-warning {background: #ff976a;}
.cg-system-icon-danger {background: #ee0a24;}
.cg-system-icon-progress {background: #ff976a;}
.cg-system-notify-title {font-size: 16px; font-weight: bold; padding-bottom: 10px;}
.cg-system-notify-content {line-height: 1.5;}
.cg-system-notify-progress {position: absolute; bottom: 0; left: 0; border-radius: 1px; background: #ff976a; transition: width 1s ease-out; width: 0%; height: 2px;}

#cg-simpletask {bottom: -46px; width: 100%; height: 46px; top: initial; background: rgb(0, 0, 0, .5); -webkit-backdrop-filter: blur(20px) brightness(1.1); backdrop-filter: blur(20px) brightness(1.1); padding: 5px 0 5px 5px; display: flex; color: #f6f6f6; transition: bottom .1s ease-out; overflow-x: auto;}
#cg-simpletask::-webkit-scrollbar {display: none;}
.cg-simpletask-item {background: rgba(246, 246, 246, .05); border-radius: 3px; padding: 10px; display: flex; align-items: center; margin-right: 5px;}
.cg-simpletask-item:hover {background: rgba(246, 246, 246, .1);}
.cg-simpletask-item:active {background: rgba(246, 246, 246, .2);}
.cg-simpletask-icon {margin-right: 5px; background-size: cover; width: 16px; height: 16px;}
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
    let now = Date.now();
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
    styleList.insertAdjacentHTML('beforeend', `<div id="cg-style-task${taskId}"><style class="cg-style-global"></style><div class="cg-style-theme"></div><div class="cg-style-control"></div><div class="cg-style-form"></div></div>`);
}

/**
 * --- 任务结束时需要移除 task 的所有 style ---
 * @param taskId 任务 id
 */
export function removeFromStyleList(taskId: number): void {
    document.getElementById('cg-style-task' + taskId)?.remove();
}

/**
 * --- 将 style 内容写入 dom ---
 * @param taskId 当前任务 ID
 * @param style 样式内容
 * @param type 插入的类型
 * @param formId 当前窗体 ID（global 下可空，theme 下为主题唯一标识符）
 */
export function pushStyle(taskId: number, style: string, type: 'global' | 'theme' | 'control' | 'form' = 'global', formId: number | string = 0): void {
    let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type}`);
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
    let styleTask = document.getElementById('cg-style-task' + taskId);
    if (!styleTask) {
        return;
    }
    if (type === 'global') {
        let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-global`);
        if (!el) {
            return;
        }
        el.innerHTML = '';
    }
    else if (type === 'theme' || type === 'control') {
        if (formId === 0) {
            let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type}`);
            if (!el) {
                return;
            }
            el.innerHTML = '';
        }
        else {
            let el = document.querySelector(`#cg-style-task${taskId} > .cg-style-${type} > [data-name='${formId}']`);
            if (!el) {
                return;
            }
            el.remove();
        }
    }
    else {
        let elist = styleTask.querySelectorAll('.cg-style-form' + formId);
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
export function getSize(el: HTMLElement): ICGDomSize {
    let rect = el.getBoundingClientRect();
    let cs = getComputedStyle(el);
    let border = {
        'top': parseFloat(cs.borderTopWidth),
        'right': parseFloat(cs.borderRightWidth),
        'bottom': parseFloat(cs.borderBottomWidth),
        'left': parseFloat(cs.borderLeftWidth)
    };
    let padding = {
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

/**
 * --- 添加监视 Element 对象大小
 * @param el 要监视的大小
 * @param cb 回调函数
 */
export function watchSize(el: HTMLElement, cb: (size: ICGDomSize) => Promise<void> | void, immediate: boolean = false): ICGDomSize {
    let fsize = getSize(el);
    if (immediate) {
        cb(fsize) as void;
    }
    const resizeObserver = new (window as any).ResizeObserver(function(): void {
        let size = getSize(el);
        if (Number.isNaN(size.clientWidth)) {
            return;
        }
        cb(size) as void;
    });
    resizeObserver.observe(el);
    return fsize;
}

/**
 * --- 添加 DOM 内容变化监视 ---
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式
 */
export function watch(el: HTMLElement, cb: () => void, mode: 'child' | 'childsub' | 'style' | 'default' = 'default', immediate: boolean = false): void {
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
    let mo = new MutationObserver(cb);
    mo.observe(el, moi);
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

let watchStyleObjects: Array<{
    'el': HTMLElement;
    'sd': CSSStyleDeclaration;
    'names': Record<string, {
        'old': string;
        'cb': Array<(name?: string, value?: string) => void>;
    }>;
}> = [];
export function watchStyle(el: HTMLElement, name: string | string[], cb: (name?: string, value?: string) => void, immediate: boolean = false): void {
    for (let item of watchStyleObjects) {
        if (item.el !== el) {
            continue;
        }
        // --- 已经有监听了 ---
        for (let n of name) {
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
    let sd = getComputedStyle(el);
    if (typeof name === 'string') {
        name = [name];
    }
    watchStyleObjects.push({
        'el': el,
        'sd': sd,
        'names': {}
    });
    let item = watchStyleObjects[watchStyleObjects.length - 1];
    for (let n of name) {
        item.names[n] = {
            'old': (item.sd as any)[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, (item.sd as any)[n]);
        }
    }
}
let watchStyleRAF = function(): void {
    for (let i = 0; i < watchStyleObjects.length; ++i) {
        let item = watchStyleObjects[i];
        if (watchStyleObjects[i].sd.flex === '') {
            watchStyleObjects.splice(i, 1);
            --i;
            continue;
        }
        // --- 执行 cb ---
        for (let name in item.names) {
            if ((item.sd as any)[name] === item.names[name].old) {
                continue;
            }
            item.names[name].old = (item.sd as any)[name];
            for (let cb of item.names[name].cb) {
                cb(name, (item.sd as any)[name]);
            }
        }
    }
    requestAnimationFrame(watchStyleRAF);
};
watchStyleRAF();

/**
 * --- 绑定按下以及弹起事件 ---
 * @param e MouseEvent | TouchEvent
 * @param opt 回调选项
 */
export function bindDown(oe: MouseEvent | TouchEvent, opt: { 'down'?: (e: MouseEvent | TouchEvent) => void; 'start'?: (e: MouseEvent | TouchEvent) => void | boolean; 'move'?: (e: MouseEvent | TouchEvent) => void | boolean; 'up'?: (e: MouseEvent | TouchEvent) => void; 'end'?: (e: MouseEvent | TouchEvent) => void; }): void {
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

    let end: (e: MouseEvent | TouchEvent) => void;
    let move = function(e: MouseEvent | TouchEvent): void {
        // --- 虽然上层已经有 preventDefault 了，但是有可能 e.target 会被注销，这样就响应不到上层的 preventDefault 事件，所以要在这里再加一个 ---
        e.preventDefault();
        let x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        let y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        if (x === ox && y === oy) {
            return;
        }

        if (!isStart) {
            isStart = true;
            if (opt.start && (opt.start(e) === false)) {
                if (e instanceof MouseEvent) {
                    window.removeEventListener('mousemove', move);
                    window.removeEventListener('mouseup', end);
                }
                else {
                    (oe.target as HTMLElement).removeEventListener('touchmove', move);
                    (oe.target as HTMLElement).removeEventListener('touchend', end);
                    (oe.target as HTMLElement).removeEventListener('touchcancel', end);
                }
                return;
            }
        }
        if (opt.move && (opt.move(e) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', end);
            }
            else {
                if (oe.target) {
                    (oe.target as HTMLElement).removeEventListener('touchmove', move);
                    (oe.target as HTMLElement).removeEventListener('touchend', end);
                    (oe.target as HTMLElement).removeEventListener('touchcancel', end);
                }
            }
            return;
        }
    };
    end = function(e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent) {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end);
        }
        else {
            if (oe.target) {
                (oe.target as HTMLElement).removeEventListener('touchmove', move);
                (oe.target as HTMLElement).removeEventListener('touchend', end);
                (oe.target as HTMLElement).removeEventListener('touchcancel', end);
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

let bindGestureData: {
    'el': HTMLElement | null;
    'xx': number;
    'xy': number;
    'tx': number;
    'ty': number;
    'dir': 'top' | 'right' | 'bottom' | 'left' | null;
    'timers': {
        'ani': number;
        'sleep': number;
    }
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

function bindGestureAnimation(opt: { 'dirs'?: ('top' | 'right' | 'bottom' | 'left')[]; handler?: (dir: 'top' | 'right' | 'bottom' | 'left') => void; }) {
    if (!bindGestureData.el) {
        return;
    }
    let speed: number = 6;
    let gestureElement = document.getElementById('cg-gesture') as HTMLElement;
    let rect = bindGestureData.el.getBoundingClientRect();
    let dirs = opt.dirs ?? ['top', 'bottom'];

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
    let xxAbs = Math.abs(bindGestureData.xx);
    let xyAbs = Math.abs(bindGestureData.xy);
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
            if (xxAbs === 120) {
                bindGestureData.dir = 'left';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.top = rect.top + ((rect.height - 20) / 2) + 'px';
            gestureElement.style.left = rect.left - 10 + (xxAbs / 1.5) + 'px';
            gestureElement.style.transform = 'scale(' + (xxAbs / 120) + ')';
        }
        else {
            // --- right ---
            if (!dirs.includes('right')) {
                gestureElement.style.opacity = '0';
                clearGestureData();
                return;
            }
            gestureElement.style.opacity = '1';
            if (xxAbs === 120) {
                bindGestureData.dir = 'right';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.top = rect.top + ((rect.height - 20) / 2) + 'px';
            gestureElement.style.left = rect.left + rect.width - 10 - (xxAbs / 1.5) + 'px';
            gestureElement.style.transform = 'scale(' + (xxAbs / 120) + ')';
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
            if (xyAbs === 120) {
                bindGestureData.dir = 'top';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.left = rect.left + ((rect.width - 20) / 2) + 'px';
            gestureElement.style.top = rect.top - 10 + (xyAbs / 1.5) + 'px';
            gestureElement.style.transform = 'scale(' + (xyAbs / 120) + ')';
        }
        else {
            // --- bottom ---
            if (!dirs.includes('bottom')) {
                gestureElement.style.opacity = '0';
                clearGestureData();
                return;
            }
            gestureElement.style.opacity = '1';
            if (xyAbs === 120) {
                bindGestureData.dir = 'bottom';
                gestureElement.classList.add('done');
            }
            else {
                bindGestureData.dir = null;
                gestureElement.classList.remove('done');
            }
            gestureElement.style.left = rect.left + ((rect.width - 20) / 2) + 'px';
            gestureElement.style.top = rect.top + rect.height - 10 - (xyAbs / 1.5) + 'px';
            gestureElement.style.transform = 'scale(' + (xyAbs / 120) + ')';
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
            opt.handler?.(bindGestureData.dir);
        }, 500);
        return;
    }
    bindGestureData.timers.ani = requestAnimationFrame(() => {
        bindGestureAnimation(opt);
    });
}

export function bindGesture(e: MouseEvent | TouchEvent | WheelEvent | { 'x'?: number; 'y'?: number; 'currentTarget'?: HTMLElement; }, opt: { 'el'?: HTMLElement; 'dirs'?: ('top' | 'right' | 'bottom' | 'left')[]; handler?: (dir: 'top' | 'right' | 'bottom' | 'left') => void; } = {}): void {
    let gestureElement = document.getElementById('cg-gesture') as HTMLElement;
    let el: HTMLElement | undefined = (e.currentTarget as HTMLElement | undefined) ?? opt.el;
    if (!el) {
        return;
    }
    let rect = el.getBoundingClientRect();
    let dirs = opt.dirs ?? ['top', 'bottom'];
    if ((e instanceof MouseEvent || e instanceof TouchEvent) && !(e instanceof WheelEvent)) {
        // --- touch / mouse 触发的 ---
        let x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        let y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        let dir: 'top' | 'right' | 'bottom' | 'left' | null = null;
        /** --- 当前手势方向 --- */
        bindDown(e, {
            move: (e): void => {
                e.preventDefault();
                if (bindGestureData.timers.ani !== 0) {
                    cancelAnimationFrame(bindGestureData.timers.ani);
                    bindGestureData.timers.ani = 0;
                }
                if (bindGestureData.timers.sleep !== 0) {
                    clearTimeout(bindGestureData.timers.sleep);
                    bindGestureData.timers.sleep = 0;
                }

                let nx: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
                let ny: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
                /** --- 相对于按下时 x 的差值 --- */
                let xx = nx - x;
                /** --- 相对于按下时 y 的差值 --- */
                let xy = ny - y;
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
                        if (xxAbs > 120) {
                            xxAbs = 120;
                            dir = 'left';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.top = rect.top + ((rect.height - 20) / 2) + 'px';
                        gestureElement.style.left = rect.left - 10 + (xxAbs / 1.5) + 'px';
                        gestureElement.style.transform = 'scale(' + (xxAbs / 120) + ')';
                    }
                    else {
                        // --- right ---
                        if (!dirs.includes('right')) {
                            gestureElement.style.opacity = '0';
                            return;
                        }
                        gestureElement.style.opacity = '1';
                        if (xxAbs > 120) {
                            xxAbs = 120;
                            dir = 'right';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.top = rect.top + ((rect.height - 20) / 2) + 'px';
                        gestureElement.style.left = rect.left + rect.width - 10 - (xxAbs / 1.5) + 'px';
                        gestureElement.style.transform = 'scale(' + (xxAbs / 120) + ')';
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
                        if (xyAbs > 120) {
                            xyAbs = 120;
                            dir = 'top';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.left = rect.left + ((rect.width - 20) / 2) + 'px';
                        gestureElement.style.top = rect.top - 10 + (xyAbs / 1.5) + 'px';
                        gestureElement.style.transform = 'scale(' + (xyAbs / 120) + ')';
                    }
                    else {
                        // --- bottom ---
                        if (!dirs.includes('bottom')) {
                            gestureElement.style.opacity = '0';
                            return;
                        }
                        gestureElement.style.opacity = '1';
                        if (xyAbs > 120) {
                            xyAbs = 120;
                            dir = 'bottom';
                            gestureElement.classList.add('done');
                        }
                        else {
                            dir = null;
                            gestureElement.classList.remove('done');
                        }
                        gestureElement.style.left = rect.left + ((rect.width - 20) / 2) + 'px';
                        gestureElement.style.top = rect.top + rect.height - 10 - (xyAbs / 1.5) + 'px';
                        gestureElement.style.transform = 'scale(' + (xyAbs / 120) + ')';
                    }
                }
            },
            end: (e): void => {
                gestureElement.style.opacity = '0';
                if (!dir) {
                    return;
                }
                opt.handler?.(dir);
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
        if (tx > 120) {
            tx = 120;
        }
        else if (tx < -120) {
            tx = -120;
        }
        let ty = bindGestureData.ty + y;
        if (ty > 120) {
            ty = 120;
        }
        else if (ty < -120) {
            ty = -120;
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
            'dirs': opt.dirs,
            'handler': opt.handler
        });
    }
}

let lastLongTime: number = 0;

export function allowEvent(e: MouseEvent | TouchEvent | KeyboardEvent): boolean {
    let now = Date.now();
    if (now - lastLongTime < 5) {
        return false;
    }
    let current = e.currentTarget as HTMLElement;
    if (current.dataset.cgDisabled !== undefined) {
        return false;
    }
    if (findParentByData(current, 'cg-disabled')) {
        return false;
    }
    return true;
}

export function bindLong(e: MouseEvent | TouchEvent, long: (e: MouseEvent | TouchEvent) => void | Promise<void>): void {
    if (hasTouchButMouse(e)) {
        return;
    }
    /** --- 上一次的坐标 --- */
    let tx: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let ty: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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
            let x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            let y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            ox = Math.abs(x - tx);
            oy = Math.abs(y - ty);
        },
        up: async () => {
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

/** --- 目前是否已绑定了 bindMove --- */
export let is = Vue.reactive({
    'move': false
});

/**
 * --- 绑定拖动事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 回调选项
 */
export function bindMove(e: MouseEvent | TouchEvent, opt: { 'areaObject'?: HTMLElement | IVue; 'left'?: number; 'top'?: number; 'right'?: number; 'bottom'?: number; 'offsetLeft'?: number; 'offsetTop'?: number; 'offsetRight'?: number; 'offsetBottom'?: number; 'objectLeft'?: number; 'objectTop'?: number; 'objectWidth'?: number; 'objectHeight'?: number; 'object'?: HTMLElement | IVue; 'showRect'?: boolean; 'start'?: (x: number, y: number) => void | boolean; 'move'?: (ox: number, oy: number, x: number, y: number, border: TCGBorder) => void; 'up'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>) => void; 'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>) => void; 'borderIn'?: (x: number, y: number, border: TCGBorder) => void; 'borderOut'?: () => void; }): { 'left': number; 'top': number; 'right': number; 'bottom': number; } {
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
        let areaRect = opt.areaObject.getBoundingClientRect();
        let areaStyle = getComputedStyle(opt.areaObject);
        left = areaRect.left + parseFloat(areaStyle.borderLeftWidth) + parseFloat(areaStyle.paddingLeft);
        top = areaRect.top + parseFloat(areaStyle.borderTopWidth) + parseFloat(areaStyle.paddingTop);
        right = areaRect.left + areaRect.width - (parseFloat(areaStyle.borderRightWidth) + parseFloat(areaStyle.paddingRight));
        bottom = areaRect.top + areaRect.height - (parseFloat(areaStyle.borderRightWidth) + parseFloat(areaStyle.paddingRight));
    }
    else {
        let area = clickgo.form.getAvailArea();
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
    let moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }> = [];

    bindDown(e, {
        start: () => {
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    clickgo.dom.setGlobalCursor();
                    return false;
                }
            }
            // --- 限定拖动对象，限定后整体对象将无法拖动出边界 ---
            if (opt.object) {
                if (!(opt.object instanceof HTMLElement)) {
                    opt.object = opt.object.$el;
                }
                let rect = opt.object.getBoundingClientRect();
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
        move: (e: MouseEvent | TouchEvent) => {
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
            let nowLeft = x - offsetLeft;
            /** --- 当前理论上可拖动 object 应该存在的 x 右侧 --- */
            let nowRight = x + offsetRight;
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
                let r1 = right - 1;
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
            let nowTop = y - offsetTop;
            /** --- 当前理论上可拖动 object 应该存在的 y 底部 --- */
            let nowBottom = y + offsetBottom;
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
                let b1 = bottom - 1;
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
            let border: TCGBorder = '';
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
                    opt.borderIn?.(x, y, border);
                }
            }
            else {
                // --- 不在边界 ---
                if (isBorder) {
                    isBorder = false;
                    opt.borderOut?.();
                }
            }

            let ox = x - tx;
            let oy = y - ty;
            moveTimes.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });

            opt.move?.(ox, oy, x, y, border);
            tx = x;
            ty = y;
        },
        up: () => {
            is.move = false;
            setGlobalCursor();
            opt.up?.(moveTimes);
        },
        end: () => {
            opt.end?.(moveTimes);
        }
    });

    if (opt.showRect) {
        clickgo.form.showRectangle(tx, ty, {
            'left': left,
            'top': top,
            'width': right - left,
            'height': bottom - top
        });
        setTimeout(() => {
            clickgo.form.hideRectangle();
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
export function bindResize(e: MouseEvent | TouchEvent, opt: { 'objectLeft'?: number; 'objectTop'?: number; 'objectWidth'?: number; 'objectHeight'?: number; 'object'?: HTMLElement | IVue; 'minWidth'?: number; 'minHeight'?: number; 'maxWidth'?: number; 'maxHeight'?: number; 'border': TCGBorder; 'start'?: (x: number, y: number) => void | boolean; 'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TCGBorder) => void; 'end'?: () => void; }): void {
    if (hasTouchButMouse(e)) {
        return;
    }
    opt.minWidth = opt.minWidth ?? 0;
    opt.minHeight = opt.minHeight ?? 0;
    /** --- 当前鼠标位置 x --- */
    let x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    /** --- 当前鼠标位置 y --- */
    let y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    // --- 获取偏差补偿 ---
    let offsetLeft!: number, offsetTop!: number, offsetRight!: number, offsetBottom!: number;
    /** --- 上下左右界限 --- */
    let left!: number, top!: number, right!: number, bottom!: number;

    // --- 获取 object 的 x,y 和 w,h 信息 ---
    if (opt.objectLeft === undefined || opt.objectTop === undefined || opt.objectWidth === undefined || opt.objectHeight === undefined) {
        if (!opt.object) {
            return;
        }
        if (!(opt.object instanceof HTMLElement)) {
            opt.object = opt.object.$el;
        }
        let objectRect = opt.object.getBoundingClientRect();
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
 * --- 查找指定 el 的同级所有元素 ---
 * @param el 基准
 * @returns HTMLElement[]
 */
export function siblings(el: HTMLElement): HTMLElement[] {
    if (!el.parentNode) {
        return [];
    }
    let list: HTMLElement[] = [];
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        let e = el.parentNode.children.item(i) as HTMLElement;
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
    let list = siblings(el);
    let olist: HTMLElement[] = [];
    for (let item of list) {
        if (item.getAttribute('data-' + name) === null) {
            continue;
        }
        olist.push(item);
    }
    return olist;
}
