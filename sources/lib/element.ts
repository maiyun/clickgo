/**
 * Copyright 2020 Han Guoshuai <zohegs@gmail.com>
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

/** --- 监视的大小 --- */
let watchSizes: Array<{ 'el': HTMLElement; 'size': IElementSize; 'scroll': boolean; 'cb': (size: IElementSize) => void; }> = [];

/**
 * --- 根据刷新频率检测 dom 大小是否改变 ---
 */
function requestAnimationFrameCb(): void {
    // --- 被添加的监听的 el 对象触发其 resize 回调 ---
    for (let i = 0; i < watchSizes.length; ++i) {
        let item = watchSizes[i];
        let rect = item.el.getBoundingClientRect();
        let cs = getComputedStyle(item.el);
        if (rect.width === 0 && rect.height === 0) {
            if (cs.display === '') {
                // --- 元素已被移除 ---
                watchSizes.splice(i, 1);
                --i;
            }
            continue;
        }
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
        let trect: IElementSize = {
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
            'scrollWidth': item.el.scrollWidth,
            'scrollHeight': item.el.scrollHeight
        };
        if (trect.width !== item.size.width || trect.height !== item.size.height || trect.clientWidth !== item.size.clientWidth || trect.clientHeight !== item.size.clientHeight || trect.innerWidth !== item.size.innerWidth || trect.innerHeight !== item.size.innerHeight) {
            item.cb(trect);
        }
        else if (item.scroll && (item.el.scrollWidth !== item.size.scrollWidth || item.el.scrollHeight !== item.size.scrollHeight)) {
            item.cb(trect);
        }
        item.size = trect;
    }
    // --- 等待下一个 ---
    requestAnimationFrame(requestAnimationFrameCb);
}
requestAnimationFrame(requestAnimationFrameCb);

/**
 * --- 根据 el 获取 watch 中的 el 的 size ---
 * @param el 要获取的 el
 */
export function getWatchSize(el: HTMLElement): IElementSize {
    for (let item of watchSizes) {
        if (item.el !== el) {
            continue;
        }
        return item.size;
    }
    return {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0,
        'width': 0,
        'height': 0,
        'padding': {
            'top': 0,
            'right': 0,
            'bottom': 0,
            'left': 0,
        },
        'border': {
            'top': 0,
            'right': 0,
            'bottom': 0,
            'left': 0,
        },
        'clientWidth': 0,
        'clientHeight': 0,
        'innerWidth': 0,
        'innerHeight': 0,
        'scrollWidth': 0,
        'scrollHeight': 0
    };
}

/**
 * --- 获取实时的 DOM SIZE ---
 * @param el 要获取的 dom
 */
export function getSize(el: HTMLElement): IElementSize {
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
export function watchSize(el: HTMLElement, cb: (size: IElementSize) => void, scroll: boolean = false): IElementSize {
    let size = getSize(el);
    watchSizes.push({
        'el': el,
        'size': size,
        'scroll': scroll,
        'cb': cb
    });
    return size;
}

/**
 * --- 添加 DOM 内容变化监视 ---
 * @param el dom 对象
 * @param cb 回调
 * @param mode 监听模式
 */
export function watchElement(el: HTMLElement, cb: MutationCallback, mode: 'child' | 'childsub' | 'style' | 'default' | MutationObserverInit = 'default'): MutationObserver {
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
                'attributes': true
            };
            break;
        }
        case 'default': {
            moi = {
                'attributeFilter': ['style', 'class'],
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
    return mo;
}

/**
 * --- 绑定按下以及弹起事件 ---
 * @param e MouseEvent | TouchEvent
 * @param opt 回调选项
 */
export function bindDown(oe: MouseEvent | TouchEvent, opt: { 'down'?: (e: MouseEvent | TouchEvent) => void; 'start'?: (e: MouseEvent | TouchEvent) => void | boolean; 'move'?: (e: MouseEvent | TouchEvent) => void | boolean; 'up'?: (e: MouseEvent | TouchEvent) => void; 'end'?: (e: MouseEvent | TouchEvent) => void; }): void {
    if (oe instanceof MouseEvent && clickgo.hasTouch) {
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
        // --- 防止拖动时整个网页跟着动 ---
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
        }
        opt.up?.(e);
        if (isStart) {
            opt.end?.(e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
    }
    else {
        (oe.target as HTMLElement).addEventListener('touchmove', move, {passive: false});
        (oe.target as HTMLElement).addEventListener('touchend', end);
    }
    opt.down?.(oe);
}

/**
 * --- 绑定拖动事件 ---
 * @param e mousedown 或 touchstart 的 event
 * @param opt 回调选项
 */
export function bindMove(e: MouseEvent | TouchEvent, opt: { 'left'?: number; 'top'?: number; 'right'?: number; 'bottom'?: number; 'offsetLeft'?: number; 'offsetTop'?: number; 'offsetRight'?: number; 'offsetBottom'?: number; 'objectLeft'?: number; 'objectTop'?: number; 'objectWidth'?: number; 'objectHeight'?: number; 'object'?: HTMLElement | IVue; 'offsetObject'?: HTMLElement | IVue; 'showRect'?: boolean; 'start'?: (x: number, y: number) => void | boolean; 'move'?: (ox: number, oy: number, x: number, y: number, border: TBorderDir) => void; 'up'?: () => void; 'end'?: (moveTimes: Array<{ 'time': number; 'ox': number; 'oy': number; }>) => void; 'borderIn'?: (x: number, y: number, border: TBorderDir) => void; 'borderOut'?: () => void; }): { 'left': number; 'top': number; 'right': number; 'bottom': number; } {
    clickgo.core.setGlobalCursor(getComputedStyle(e.target as Element).cursor);
    /** --- 上一次的坐标 --- */
    let tx: number, ty: number;
    if (e instanceof MouseEvent) {
        tx = e.clientX * clickgo.rzoom;
        ty = e.clientY * clickgo.rzoom;
    }
    else {
        tx = e.touches[0].clientX * clickgo.rzoom;
        ty = e.touches[0].clientY * clickgo.rzoom;
    }

    // --- 限定拖动区域 ---
    let left: number, top: number, right: number, bottom: number;
    if (opt.offsetObject) {
        if (!(opt.offsetObject instanceof HTMLElement)) {
            opt.offsetObject = opt.offsetObject.$el;
        }
        let rect = opt.offsetObject.getBoundingClientRect();
        let sd = getComputedStyle(opt.offsetObject);
        left = rect.left + opt.offsetObject.clientLeft + parseFloat(sd.paddingLeft);
        top = rect.top + opt.offsetObject.clientTop + parseFloat(sd.paddingTop);
        right = rect.left + rect.width - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
        bottom = rect.top + rect.height - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
    }
    else {
        let position = clickgo.getPosition();
        left = opt.left ?? position.left;
        top = opt.top ?? position.top;
        right = opt.right ?? position.width;
        bottom = opt.bottom ?? position.height;
    }
    // --- 限定拖动区域额外补偿（拖动对象和实际对象有一定偏差，超出时使用） ---
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
    let moveTime: Array<{ 'time': number; 'ox': number; 'oy': number; }> = [];

    bindDown(e, {
        start: () => {
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    clickgo.core.setGlobalCursor();
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
            x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * clickgo.rzoom;
            y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * clickgo.rzoom;
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
            let border: TBorderDir = '';
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
            moveTime.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });

            opt.move?.(ox, oy, x, y, border);
            tx = x;
            ty = y;
        },
        up: () => {
            clickgo.core.setGlobalCursor();
            opt.up?.();
        },
        end: () => {
            opt.end?.(moveTime);
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
 * @param opt 选项
 * @param moveCb 拖动时的回调
 * @param endCb 结束时的回调
 */
export function bindResize(e: MouseEvent | TouchEvent, opt: { 'left': number; 'top': number; 'width': number; 'height': number; 'minWidth'?: number; 'minHeight'?: number; 'offsetObject'?: HTMLElement; 'dir': TBorderDir; 'start'?: (x: number, y: number) => void | boolean; 'move'?: (left: number, top: number, width: number, height: number, x: number, y: number, border: TBorderDir) => void; 'end'?: () => void; }): void {
    opt.minWidth = opt.minWidth ?? 0;
    opt.minHeight = opt.minHeight ?? 0;
    /** --- 当前鼠标位置 x --- */
    let x: number = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * clickgo.rzoom;
    /** --- 当前鼠标位置 y --- */
    let y: number = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * clickgo.rzoom;
    // --- 获取偏差补偿 ---
    let offsetLeft!: number, offsetTop!: number, offsetRight!: number, offsetBottom!: number;
    /** --- 上下左右界限 --- */
    let left!: number, top!: number, right!: number, bottom!: number;
    if (opt.dir === 'tr' || opt.dir === 'r' || opt.dir === 'rb') {
        left = opt.left + opt.minWidth;
        offsetLeft = x - (opt.left + opt.width);
        offsetRight = offsetLeft;
    }
    else if (opt.dir === 'bl' || opt.dir === 'l' || opt.dir === 'lt') {
        right = opt.left + opt.width - opt.minWidth;
        offsetLeft = x - opt.left;
        offsetRight = offsetLeft;
    }
    if (opt.dir === 'rb' || opt.dir === 'b' || opt.dir === 'bl') {
        top = opt.top + opt.minHeight;
        offsetTop = y - (opt.top + opt.height);
        offsetBottom = offsetTop;
    }
    else if (opt.dir === 'lt' || opt.dir === 't' || opt.dir === 'tr') {
        bottom = opt.top + opt.height - opt.minHeight;
        offsetTop = y - opt.top;
        offsetBottom = offsetTop;
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
            if (opt.dir === 'tr' || opt.dir === 'r' || opt.dir === 'rb') {
                opt.width += ox;
            }
            else if (opt.dir === 'bl' || opt.dir === 'l' || opt.dir === 'lt') {
                opt.width -= ox;
                opt.left += ox;
            }
            if (opt.dir === 'rb' || opt.dir === 'b' || opt.dir === 'bl') {
                opt.height += oy;
            }
            else if (opt.dir === 'lt' || opt.dir === 't' || opt.dir === 'tr') {
                opt.height -= oy;
                opt.top += oy;
            }
            opt.move?.(opt.left, opt.top, opt.width, opt.height, x, y, border);
        },
        'end': opt.end
    });
}
