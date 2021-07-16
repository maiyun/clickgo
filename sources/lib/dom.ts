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
let styleList: HTMLDivElement = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style class='cg-global'>
.cg-form-list, .cg-pop-list, .cg-system {-webkit-user-select: none; user-select: none; position: fixed; left: 0; top: 0; width: 0; height: 0; cursor: default;}
.cg-form-list {z-index: 20020000;}
.cg-pop-list {z-index: 20020001;}
.cg-system {z-index: 20020002;}
.cg-form-list img, .cg-pop-list img, .cg-system img {vertical-align: bottom;}
.cg-form-list ::selection, .cg-pop-list ::selection, .cg-system ::selection {background-color: rgba(0, 120, 215, .3);}
.cg-form-list, .cg-pop-list, .cg-system {-webkit-user-select: none; user-select: none;}

.cg-form-list *, .cg-pop-list *, .cg-system *, .cg-form-list *::after, .cg-pop-list *::after, .cg-system *::after, .cg-form-list *::before, .cg-pop-list *::before, .cg-system *::before {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
.cg-form-list, .cg-form-list input, .cg-form-list textarea, .cg-pop-list, .cg-pop-list input, .cg-pop-list textarea, .cg-system, .cg-system input, .cg-system textarea {font-family: "Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif; /* -apple-system,BlinkMacSystemFont,Roboto,"Segoe UI","Helvetica Neue","PingFang SC","Noto Sans","Noto Sans CJK SC","Microsoft YaHei","微软雅黑",sans-serif */; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased;}

.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #76b9ed; border-radius: 50%; filter: drop-shadow(0 0 7px #76b9ed); pointer-events: none; opacity: 0;}
.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border: solid 1px rgba(118, 185, 237, .7); box-shadow: 0 0 10px rgba(0, 0, 0, .3); background: rgba(118, 185, 237, .1); pointer-events: none; opacity: 0;}

.cg-system-notify {box-shadow: 0 0 20px rgba(0, 0, 0, .2); background: linear-gradient(to top, rgba(255, 255, 255, .75), rgba(255, 255, 255, .8)); position: fixed; padding: 15px; border-radius: 8px; right: 0; top: 0; width: 280px; font-size: 14px; backdrop-filter: blur(5px); display: flex; transition: .1s ease-out; transition-property: transform, opacity;}
.cg-system-icon {margin-right: 10px; width: 16px; height: 16px; border-radius: 50%;}
.cg-system-icon-primary {background: #07c160;}
.cg-system-icon-info {background: #1989fa;}
.cg-system-icon-warning {background: #ff976a;}
.cg-system-icon-danger {background: #ee0a24;}
.cg-system-notify-title {font-size: 16px; font-weight: bold; padding-bottom: 10px;}
.cg-system-notify-content {line-height: 1.5;}
</style>`);

/** --- 作用显示区域 --- */
let position: ICGDomPosition = {
    'left': undefined,
    'top': undefined,
    'width': undefined,
    'height': undefined,
    'offsetWidth': undefined,
    'offsetHeight': undefined
};

/**
 * --- 设置作用显示区域 ---
 * @param pos 设置的区域
 */
export function setPosition(pos: ICGDomPosition): void {
    if (pos.left !== undefined) {
        position.left = pos.left;
    }
    if (pos.top !== undefined) {
        position.top = pos.top;
    }
    if (pos.width !== undefined) {
        position.width = pos.width;
    }
    if (pos.height !== undefined) {
        position.height = pos.height;
    }
    if (pos.offsetWidth !== undefined) {
        position.offsetWidth = pos.offsetWidth;
    }
    if (pos.offsetHeight !== undefined) {
        position.offsetHeight = pos.offsetHeight;
    }
}

/**
 * --- 获取作用显示区域 ---
 */
export function getPosition(): ICGDomPositionResult {
    return {
        'left': position.left ?? 0,
        'top': position.top ?? 0,
        'width': window.innerWidth + (position.offsetWidth ?? 0),
        'height': window.innerHeight + (position.offsetHeight ?? 0),
        'offsetWidth': position.offsetWidth ?? 0,
        'offsetHeight': position.offsetHeight ?? 0
    };
}

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
 * --- 判断当前的 mosedown、click 事件是否是 touch 触发的，如果当前就是 touch 则直接返回 false ---
 */
export function isMouseAlsoTouchEvent(e: MouseEvent | TouchEvent): boolean {
    if (e instanceof TouchEvent) {
        return false;
    }
    let now = Date.now();
    if (now - lastTouchTime < 500) {
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

/**
 * --- 绑定按下以及弹起事件 ---
 * @param e MouseEvent | TouchEvent
 * @param opt 回调选项
 */
export function bindDown(oe: MouseEvent | TouchEvent, opt: { 'down'?: (e: MouseEvent | TouchEvent) => void; 'start'?: (e: MouseEvent | TouchEvent) => void | boolean; 'move'?: (e: MouseEvent | TouchEvent) => void | boolean; 'up'?: (e: MouseEvent | TouchEvent) => void; 'end'?: (e: MouseEvent | TouchEvent) => void; }): void {
    if (isMouseAlsoTouchEvent(oe)) {
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
                (oe.target as HTMLElement).removeEventListener('touchmove', move);
                (oe.target as HTMLElement).removeEventListener('touchend', end);
                (oe.target as HTMLElement).removeEventListener('touchcancel', end);
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
            (oe.target as HTMLElement).removeEventListener('touchmove', move);
            (oe.target as HTMLElement).removeEventListener('touchend', end);
            (oe.target as HTMLElement).removeEventListener('touchcancel', end);
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

export function bindLong(e: MouseEvent | TouchEvent, long: (e: MouseEvent | TouchEvent) => void): void {
    if (isMouseAlsoTouchEvent(e)) {
        return;
    }
    /** --- 上一次的坐标 --- */
    let tx: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let ty: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let ox: number = 0;
    let oy: number = 0;
    let timer: number | undefined = window.setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
        if (ox <= 1 && oy <= 1) {
            long(e);
        }
    }, 500);
    bindDown(e, {
        move: (e: MouseEvent | TouchEvent) => {
            let x: number = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            let y: number = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            ox = Math.abs(x - tx);
            oy = Math.abs(y - ty);
        },
        up: (e) => {
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            if (e.type === 'touchcancel') {
                long(e);
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
    if (isMouseAlsoTouchEvent(e)) {
        return {
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0
        };
    }
    is.move = true;
    setGlobalCursor(getComputedStyle(e.target as Element).cursor);
    /** --- 上一次的坐标 --- */
    let tx: number, ty: number;
    if (e instanceof MouseEvent) {
        tx = e.clientX;
        ty = e.clientY;
    }
    else {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;
    }

    // --- 限定拖动区域 ---
    let left: number, top: number, right: number, bottom: number;
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
        let position = getPosition();
        left = opt.left ?? position.left;
        top = opt.top ?? position.top;
        right = opt.right ?? position.width;
        bottom = opt.bottom ?? position.height;
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
    let offsetLeft = 0;
    let offsetTop = 0;
    let offsetRight = 0;
    let offsetBottom = 0;

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
            let x: number, y: number;
            x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            if (x === tx && y === ty) {
                return;
            }

            /** --- 当前是否在边界线上 --- */
            let inBorderTop: boolean = false, inBorderRight: boolean = false, inBorderBottom: boolean = false, inBorderLeft: boolean = false;

            let xol = x - offsetLeft;
            let xor = x + offsetRight;
            if (xol <= left) {
                if (xol < left && x < tx) {
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
                inBorderLeft = true;
            }
            else if (offsetRight > 0) {
                if (xor >= right) {
                    if (xor > right && x > tx) {
                        if (tx + offsetRight < right) {
                            x = right - offsetRight;
                        }
                        else {
                            x = tx;
                        }
                    }
                    inBorderRight = true;
                }
            }
            else if (offsetRight === 0) {
                let rs1 = right - 1;
                if (x >= rs1) {
                    if (x > rs1 && x > tx) {
                        if (tx < rs1) {
                            x = rs1;
                        }
                        else {
                            x = tx;
                        }
                    }
                    inBorderRight = true;
                }
            }
            let yot = y - offsetTop;
            let yob = y + offsetBottom;
            if (yot <= top) {
                if (yot < top && y < ty) {
                    if (ty - offsetTop > top) {
                        y = top + offsetTop;
                    }
                    else {
                        y = ty;
                    }
                }
                inBorderTop = true;
            }
            else if (offsetBottom > 0) {
                if (yob >= bottom) {
                    if (yob > bottom && y > ty) {
                        if (ty + offsetBottom < bottom) {
                            y = bottom - offsetBottom;
                        }
                        else {
                            y = ty;
                        }
                    }
                    inBorderBottom = true;
                }
            }
            else if (offsetBottom === 0) {
                let bs1 = bottom - 1;
                if (y >= bs1) {
                    if (y > bs1 && y > ty) {
                        if (ty < bs1) {
                            y = bs1;
                        }
                        else {
                            y = ty;
                        }
                    }
                    inBorderBottom = true;
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
        }, 1000);
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
    if (isMouseAlsoTouchEvent(e)) {
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
 * --- 通过 class 名查找上层所有标签是否有匹配的 ---
 * @param el 当前标签
 * @param cn 要查找的 class 名/列表
 */
export function findParentByClass(el: HTMLElement, cn: string | RegExp | Array<string | RegExp>): HTMLElement | null {
    if (!Array.isArray(cn)) {
        cn = [cn];
    }
    let parent = el.parentNode as HTMLElement;
    while (parent) {
        if (parent.tagName.toLowerCase() === 'body') {
            break;
        }
        for (let it of cn) {
            if (typeof it === 'string') {
                if (parent.classList.contains(it)) {
                    return parent;
                }
            }
            else {
                for (let cl of parent.classList) {
                    if (it.test(cl)) {
                        return parent;
                    }
                }
            }
        }
        parent = parent.parentNode as HTMLElement;
    }
    return null;
}

/**
 * --- 查找指定 el 的同级 className ---
 * @param el 基准
 * @param cn 同级 classname
 */
export function siblings(el: HTMLElement, cn: string): HTMLElement | null {
    if (!el.parentNode) {
        return null;
    }
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        let e = el.parentNode.children.item(i) as HTMLElement;
        if (e === el) {
            continue;
        }
        if (e.classList.contains(cn)) {
            return e;
        }
    }
    return null;
}
