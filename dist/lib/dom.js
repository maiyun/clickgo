"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siblings = exports.findParentByClass = exports.bindResize = exports.bindMove = exports.is = exports.bindLong = exports.bindDown = exports.watch = exports.watchSize = exports.getSize = exports.getStyleCount = exports.removeStyle = exports.pushStyle = exports.removeFromStyleList = exports.createToStyleList = exports.isMouseAlsoTouchEvent = exports.setGlobalCursor = void 0;
let topClass = ['cg-form-list', 'cg-pop-list', 'cg-system', 'cg-simpletask'];
function classUnfold(after) {
    let arr = [];
    for (let name of topClass) {
        arr.push('.' + name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}
let styleList = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style class='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; position: fixed; left: 0; top: 0; width: 0; height: 0; cursor: default; box-sizing: border-box;}
.cg-form-list {z-index: 20020000;}
.cg-pop-list {z-index: 20020001;}
.cg-system {z-index: 20020002;}
.cg-simpletask {z-index: 20020003;}
.cg-form-list img, .cg-pop-list img, .cg-system img {vertical-align: bottom;}
.cg-form-list ::selection, .cg-pop-list ::selection, .cg-system ::selection {background-color: rgba(0, 120, 215, .3);}
.cg-form-list, .cg-pop-list, .cg-system {-webkit-user-select: none; user-select: none;}

${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold()}, ${classUnfold('input')}, ${classUnfold('textarea')} {font-family: "Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif; /* -apple-system,BlinkMacSystemFont,Roboto,"Segoe UI","Helvetica Neue","PingFang SC","Noto Sans","Noto Sans CJK SC","Microsoft YaHei","微软雅黑",sans-serif */; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased;}

.cg-circular {box-sizing: border-box; position: fixed; z-index: 20020003; border: solid 3px #ffa657; border-radius: 50%; filter: drop-shadow(0 0 3px #ffa657); pointer-events: none; opacity: 0;}
.cg-rectangle {box-sizing: border-box; position: fixed; z-index: 20020002; border-radius: 3px; box-shadow: inset 0 1px 1px rgba(255, 255, 255, .1), 0 0 10px rgba(0, 0, 0, .3); background: rgba(255, 255, 255, .05); pointer-events: none; opacity: 0;}

.cg-system-notify {background: #30363d; position: fixed; padding: 15px; border: solid 1px #000; border-radius: 3px; right: 0; top: 0; width: 280px; font-size: 14px; display: flex; transition: .1s ease-out; transition-property: transform, opacity; overflow: hidden; color: #f6f6f6; box-shadow: inset 0 1px 1px rgba(255, 255, 255, .1), 0 0 10px rgba(0, 0, 0, .3);}
.cg-system-icon {margin-right: 10px; width: 16px; height: 16px; border-radius: 50%;}
.cg-system-icon-primary {background: #07c160;}
.cg-system-icon-info {background: #1989fa;}
.cg-system-icon-warning {background: #ff976a;}
.cg-system-icon-danger {background: #ee0a24;}
.cg-system-icon-progress {background: #ffa657;}
.cg-system-notify-title {font-size: 16px; font-weight: bold; padding-bottom: 10px;}
.cg-system-notify-content {line-height: 1.5;}
.cg-system-notify-progress {position: absolute; bottom: 0; left: 0; border-radius: 1px; background: #ffa657; transition: width 1s ease-out; width: 0%; height: 2px;}

.cg-simpletask {bottom: -46px; width: 100%; height: 46px; top: initial; background: rgb(39, 39, 39, .7); backdrop-filter: blur(5px); padding: 5px 0 5px 5px; display: flex; color: #f6f6f6; transition: bottom .1s ease-out; overflow-x: auto;}
.cg-simpletask::-webkit-scrollbar {display: none;}
.cg-simpletask-item {background: rgba(246, 246, 246, .05); border-radius: 3px; padding: 10px; display: flex; align-items: center; margin-right: 5px;}
.cg-simpletask-item:hover {background: rgba(246, 246, 246, .1);}
.cg-simpletask-item:active {background: rgba(246, 246, 246, .2);}
.cg-simpletask-icon {margin-right: 5px; background-size: cover; width: 16px; height: 16px;}
</style>`);
let globalCursorStyle;
function setGlobalCursor(type) {
    if (!globalCursorStyle) {
        globalCursorStyle = document.getElementById('cg-global-cursor');
    }
    if (type) {
        globalCursorStyle.innerHTML = `* {cursor: ${type} !important;}`;
    }
    else {
        globalCursorStyle.innerHTML = '';
    }
}
exports.setGlobalCursor = setGlobalCursor;
let lastTouchTime = 0;
document.addEventListener('touchstart', function () {
    lastTouchTime = Date.now();
    return;
});
function isMouseAlsoTouchEvent(e) {
    if (e instanceof TouchEvent) {
        return false;
    }
    let now = Date.now();
    if (now - lastTouchTime < 500) {
        return true;
    }
    return false;
}
exports.isMouseAlsoTouchEvent = isMouseAlsoTouchEvent;
function createToStyleList(taskId) {
    styleList.insertAdjacentHTML('beforeend', `<div id="cg-style-task${taskId}"><style class="cg-style-global"></style><div class="cg-style-theme"></div><div class="cg-style-control"></div><div class="cg-style-form"></div></div>`);
}
exports.createToStyleList = createToStyleList;
function removeFromStyleList(taskId) {
    var _a;
    (_a = document.getElementById('cg-style-task' + taskId)) === null || _a === void 0 ? void 0 : _a.remove();
}
exports.removeFromStyleList = removeFromStyleList;
function pushStyle(taskId, style, type = 'global', formId = 0) {
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
exports.pushStyle = pushStyle;
function removeStyle(taskId, type = 'global', formId = 0) {
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
exports.removeStyle = removeStyle;
function getStyleCount(taskId, type) {
    return document.querySelectorAll(`#cg-style-task${taskId} > .cg-style-${type} > style`).length;
}
exports.getStyleCount = getStyleCount;
function getSize(el) {
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
exports.getSize = getSize;
function watchSize(el, cb, immediate = false) {
    let fsize = getSize(el);
    if (immediate) {
        cb(fsize);
    }
    const resizeObserver = new window.ResizeObserver(function () {
        let size = getSize(el);
        if (Number.isNaN(size.clientWidth)) {
            return;
        }
        cb(size);
    });
    resizeObserver.observe(el);
    return fsize;
}
exports.watchSize = watchSize;
function watch(el, cb, mode = 'default', immediate = false) {
    if (immediate) {
        cb();
    }
    let moi;
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
}
exports.watch = watch;
function bindDown(oe, opt) {
    var _a;
    if (isMouseAlsoTouchEvent(oe)) {
        return;
    }
    let ox, oy;
    if (oe instanceof MouseEvent) {
        ox = oe.clientX;
        oy = oe.clientY;
    }
    else {
        ox = oe.touches[0].clientX;
        oy = oe.touches[0].clientY;
    }
    let isStart = false;
    let end;
    let move = function (e) {
        let x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        let y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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
                    oe.target.removeEventListener('touchmove', move);
                    oe.target.removeEventListener('touchend', end);
                    oe.target.removeEventListener('touchcancel', end);
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
                oe.target.removeEventListener('touchmove', move);
                oe.target.removeEventListener('touchend', end);
                oe.target.removeEventListener('touchcancel', end);
            }
            return;
        }
    };
    end = function (e) {
        var _a, _b;
        if (e instanceof MouseEvent) {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', end);
        }
        else {
            oe.target.removeEventListener('touchmove', move);
            oe.target.removeEventListener('touchend', end);
            oe.target.removeEventListener('touchcancel', end);
        }
        (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, e);
        if (isStart) {
            (_b = opt.end) === null || _b === void 0 ? void 0 : _b.call(opt, e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move, { 'passive': false });
        window.addEventListener('mouseup', end);
    }
    else {
        oe.target.addEventListener('touchmove', move, { 'passive': false });
        oe.target.addEventListener('touchend', end);
        oe.target.addEventListener('touchcancel', end);
    }
    (_a = opt.down) === null || _a === void 0 ? void 0 : _a.call(opt, oe);
}
exports.bindDown = bindDown;
function bindLong(e, long) {
    if (isMouseAlsoTouchEvent(e)) {
        return;
    }
    let tx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let ty = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let ox = 0;
    let oy = 0;
    let timer = window.setTimeout(() => {
        clearTimeout(timer);
        timer = undefined;
        if (ox <= 1 && oy <= 1) {
            long(e);
        }
    }, 500);
    bindDown(e, {
        move: (e) => {
            let x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            let y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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
exports.bindLong = bindLong;
exports.is = Vue.reactive({
    'move': false
});
function bindMove(e, opt) {
    var _a, _b, _c, _d;
    if (isMouseAlsoTouchEvent(e)) {
        return {
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0
        };
    }
    exports.is.move = true;
    setGlobalCursor(getComputedStyle(e.target).cursor);
    let tx, ty;
    if (e instanceof MouseEvent) {
        tx = e.clientX;
        ty = e.clientY;
    }
    else {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;
    }
    let left, top, right, bottom;
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
        left = (_a = opt.left) !== null && _a !== void 0 ? _a : area.left;
        top = (_b = opt.top) !== null && _b !== void 0 ? _b : area.top;
        right = (_c = opt.right) !== null && _c !== void 0 ? _c : area.width;
        bottom = (_d = opt.bottom) !== null && _d !== void 0 ? _d : area.height;
    }
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
    let isBorder = false;
    let objectLeft, objectTop, objectWidth, objectHeight;
    let offsetLeft = 0;
    let offsetTop = 0;
    let offsetRight = 0;
    let offsetBottom = 0;
    let moveTimes = [];
    bindDown(e, {
        start: () => {
            var _a, _b, _c, _d;
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    clickgo.dom.setGlobalCursor();
                    return false;
                }
            }
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
                objectLeft = (_a = opt.objectLeft) !== null && _a !== void 0 ? _a : 0;
                objectTop = (_b = opt.objectTop) !== null && _b !== void 0 ? _b : 0;
                objectWidth = (_c = opt.objectWidth) !== null && _c !== void 0 ? _c : 0;
                objectHeight = (_d = opt.objectHeight) !== null && _d !== void 0 ? _d : 0;
            }
            if (objectWidth > 0) {
                offsetLeft = tx - objectLeft;
            }
            if (objectHeight > 0) {
                offsetTop = ty - objectTop;
            }
            offsetRight = objectWidth - offsetLeft;
            offsetBottom = objectHeight - offsetTop;
        },
        move: (e) => {
            var _a, _b, _c;
            let x, y;
            x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            if (x === tx && y === ty) {
                return;
            }
            let inBorderTop = false, inBorderRight = false, inBorderBottom = false, inBorderLeft = false;
            let xol = x - offsetLeft;
            let xor = x + offsetRight;
            if (xol <= left) {
                if (xol < left && x < tx) {
                    if (tx - offsetLeft > left) {
                        x = left + offsetLeft;
                    }
                    else {
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
            let border = '';
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
                    (_a = opt.borderIn) === null || _a === void 0 ? void 0 : _a.call(opt, x, y, border);
                }
            }
            else {
                if (isBorder) {
                    isBorder = false;
                    (_b = opt.borderOut) === null || _b === void 0 ? void 0 : _b.call(opt);
                }
            }
            let ox = x - tx;
            let oy = y - ty;
            moveTimes.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });
            (_c = opt.move) === null || _c === void 0 ? void 0 : _c.call(opt, ox, oy, x, y, border);
            tx = x;
            ty = y;
        },
        up: () => {
            var _a;
            exports.is.move = false;
            setGlobalCursor();
            (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes);
        },
        end: () => {
            var _a;
            (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes);
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
exports.bindMove = bindMove;
function bindResize(e, opt) {
    var _a, _b;
    if (isMouseAlsoTouchEvent(e)) {
        return;
    }
    opt.minWidth = (_a = opt.minWidth) !== null && _a !== void 0 ? _a : 0;
    opt.minHeight = (_b = opt.minHeight) !== null && _b !== void 0 ? _b : 0;
    let x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let offsetLeft, offsetTop, offsetRight, offsetBottom;
    let left, top, right, bottom;
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
        left = opt.objectLeft + opt.minWidth;
        offsetLeft = x - (opt.objectLeft + opt.objectWidth);
        offsetRight = offsetLeft;
        if (opt.maxWidth) {
            right = opt.objectLeft + opt.maxWidth;
        }
    }
    else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
        right = opt.objectLeft + opt.objectWidth - opt.minWidth;
        offsetLeft = x - opt.objectLeft;
        offsetRight = offsetLeft;
        if (opt.maxWidth) {
            left = opt.objectLeft + opt.objectWidth - opt.maxWidth;
        }
    }
    if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
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
        'move': function (ox, oy, x, y, border) {
            var _a;
            if (opt.border === 'tr' || opt.border === 'r' || opt.border === 'rb') {
                opt.objectWidth += ox;
            }
            else if (opt.border === 'bl' || opt.border === 'l' || opt.border === 'lt') {
                opt.objectWidth -= ox;
                opt.objectLeft += ox;
            }
            if (opt.border === 'rb' || opt.border === 'b' || opt.border === 'bl') {
                opt.objectHeight += oy;
            }
            else if (opt.border === 'lt' || opt.border === 't' || opt.border === 'tr') {
                opt.objectHeight -= oy;
                opt.objectTop += oy;
            }
            (_a = opt.move) === null || _a === void 0 ? void 0 : _a.call(opt, opt.objectLeft, opt.objectTop, opt.objectWidth, opt.objectHeight, x, y, border);
        },
        'end': opt.end
    });
}
exports.bindResize = bindResize;
function findParentByClass(el, cn) {
    if (!Array.isArray(cn)) {
        cn = [cn];
    }
    let parent = el.parentNode;
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
        parent = parent.parentNode;
    }
    return null;
}
exports.findParentByClass = findParentByClass;
function siblings(el, cn) {
    if (!el.parentNode) {
        return null;
    }
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        let e = el.parentNode.children.item(i);
        if (e === el) {
            continue;
        }
        if (e.classList.contains(cn)) {
            return e;
        }
    }
    return null;
}
exports.siblings = siblings;
