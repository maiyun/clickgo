"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullscreen = exports.siblingsData = exports.siblings = exports.findParentByClass = exports.findParentByData = exports.bindResize = exports.bindMove = exports.is = exports.bindDrag = exports.bindLong = exports.allowEvent = exports.bindGesture = exports.bindDown = exports.isWatchStyle = exports.watchStyle = exports.clearWatch = exports.unwatch = exports.watch = exports.clearWatchSize = exports.unwatchSize = exports.watchSize = exports.getSize = exports.getStyleCount = exports.removeStyle = exports.pushStyle = exports.removeFromStyleList = exports.createToStyleList = exports.hasTouchButMouse = exports.setGlobalCursor = void 0;
const clickgo = require("../clickgo");
const form = require("./form");
const core = require("./core");
const topClass = ['#cg-form-list', '#cg-pop-list', '#cg-system', '#cg-simpletask'];
function classUnfold(after) {
    const arr = [];
    for (const name of topClass) {
        arr.push(name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}
const styleList = document.createElement('div');
styleList.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(styleList);
styleList.insertAdjacentHTML('beforeend', '<style id=\'cg-global-cursor\'></style>');
styleList.insertAdjacentHTML('beforeend', `<style id='cg-global'>
${classUnfold()} {-webkit-user-select: none; user-select: none; position: fixed; cursor: default; box-sizing: border-box;}
${topClass.slice(0, 3).join(', ')} {left: 0; top: 0; width: 0; height: 0;}
${classUnfold('img')} {vertical-align: bottom;}
${classUnfold('::selection')} {background-color: rgba(0, 0, 0, .1);}
${classUnfold('*')}, ${classUnfold('*::after')}, ${classUnfold('*::before')} {box-sizing: border-box; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); flex-shrink: 0;}
${classUnfold()}, ${classUnfold('input')}, ${classUnfold('textarea')} {font-family: "Lucida Sans Unicode", "Helvetica Neue","Helvetica","PingFang SC","Hiragino Sans GB","Noto Sans CJK SC","Noto Sans CJK","Source Han Sans","WenQuanYi Micro Hei","Microsoft YaHei",sans-serif; font-size: 12px; line-height: 1; -webkit-font-smoothing: antialiased;}
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
}, {
    'passive': true
});
function hasTouchButMouse(e) {
    if (e instanceof TouchEvent) {
        return false;
    }
    if ((e.pointerType === 'touch') && (e.type === 'contextmenu')) {
        return true;
    }
    const now = Date.now();
    if (now - lastTouchTime < 1000 * 60) {
        return true;
    }
    return false;
}
exports.hasTouchButMouse = hasTouchButMouse;
function createToStyleList(taskId) {
    styleList.insertAdjacentHTML('beforeend', `<div id="cg-style-task${taskId}"><style class="cg-style-global"></style><div class="cg-style-control"></div><div class="cg-style-theme"></div><div class="cg-style-form"></div></div>`);
}
exports.createToStyleList = createToStyleList;
function removeFromStyleList(taskId) {
    var _a;
    (_a = document.getElementById('cg-style-task' + taskId.toString())) === null || _a === void 0 ? void 0 : _a.remove();
}
exports.removeFromStyleList = removeFromStyleList;
function pushStyle(taskId, style, type = 'global', formId = 0) {
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
exports.pushStyle = pushStyle;
function removeStyle(taskId, type = 'global', formId = 0) {
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
exports.removeStyle = removeStyle;
function getStyleCount(taskId, type) {
    return document.querySelectorAll(`#cg-style-task${taskId} > .cg-style-${type} > style`).length;
}
exports.getStyleCount = getStyleCount;
function getSize(el) {
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
exports.getSize = getSize;
const watchSizeList = [];
function watchSize(el, cb, immediate = false, taskId) {
    const fsize = getSize(el);
    for (const item of watchSizeList) {
        if (item.el === el) {
            return fsize;
        }
    }
    if (immediate) {
        const r = cb(fsize);
        if (r instanceof Promise) {
            r.catch(function (e) {
                console.log(e);
            });
        }
    }
    const resizeObserver = new window.ResizeObserver(function () {
        const size = getSize(el);
        if (Number.isNaN(size.clientWidth)) {
            return;
        }
        const r = cb(size);
        if (r instanceof Promise) {
            r.catch(function (e) {
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
exports.watchSize = watchSize;
function unwatchSize(el, taskId) {
    for (let i = 0; i < watchSizeList.length; ++i) {
        const item = watchSizeList[i];
        if (item.el !== el) {
            continue;
        }
        if (taskId && taskId !== item.taskId) {
            return;
        }
        if (item.el.offsetParent) {
            item.ro.unobserve(item.el);
        }
        watchSizeList.splice(i, 1);
        --i;
        return;
    }
}
exports.unwatchSize = unwatchSize;
function clearWatchSize(taskId) {
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
exports.clearWatchSize = clearWatchSize;
function cgClearWatchSize() {
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
const watchList = [];
function watch(el, cb, mode = 'default', immediate = false, taskId) {
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
    const mo = new MutationObserver(cb);
    mo.observe(el, moi);
    watchList.push({
        'el': el,
        'mo': mo,
        'taskId': taskId
    });
}
exports.watch = watch;
function unwatch(el, taskId) {
    for (let i = 0; i < watchList.length; ++i) {
        const item = watchList[i];
        if (item.el !== el) {
            continue;
        }
        if (taskId && taskId !== item.taskId) {
            return;
        }
        if (item.el.offsetParent) {
            item.mo.disconnect();
        }
        watchList.splice(i, 1);
        --i;
        return;
    }
}
exports.unwatch = unwatch;
function clearWatch(taskId) {
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
exports.clearWatch = clearWatch;
function cgClearWatch() {
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
const watchStyleObjects = [];
function watchStyle(el, name, cb, immediate = false) {
    if (typeof name === 'string') {
        name = [name];
    }
    for (const item of watchStyleObjects) {
        if (item.el !== el) {
            continue;
        }
        for (const n of name) {
            if (!item.names[n]) {
                item.names[n] = {
                    'old': item.sd[n],
                    'cb': [cb]
                };
            }
            else {
                item.names[n].cb.push(cb);
            }
            if (immediate) {
                cb(n, item.sd[n]);
            }
        }
        return;
    }
    const sd = getComputedStyle(el);
    watchStyleObjects.push({
        'el': el,
        'sd': sd,
        'names': {}
    });
    const item = watchStyleObjects[watchStyleObjects.length - 1];
    for (const n of name) {
        item.names[n] = {
            'old': item.sd[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, item.sd[n]);
        }
    }
}
exports.watchStyle = watchStyle;
const watchStyleRAF = function () {
    for (let i = 0; i < watchStyleObjects.length; ++i) {
        const item = watchStyleObjects[i];
        if (watchStyleObjects[i].sd.flex === '') {
            watchStyleObjects.splice(i, 1);
            --i;
            continue;
        }
        for (const name in item.names) {
            if (item.sd[name] === item.names[name].old) {
                continue;
            }
            item.names[name].old = item.sd[name];
            for (const cb of item.names[name].cb) {
                cb(name, item.sd[name]);
            }
        }
    }
    requestAnimationFrame(watchStyleRAF);
};
watchStyleRAF();
function isWatchStyle(el) {
    for (const item of watchStyleObjects) {
        if (item.el !== el) {
            continue;
        }
        return true;
    }
    return false;
}
exports.isWatchStyle = isWatchStyle;
function bindDown(oe, opt) {
    var _a;
    if (hasTouchButMouse(oe)) {
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
    let end = undefined;
    const move = function (e) {
        if (!e.target || !e.target.offsetParent) {
            e.preventDefault();
        }
        let dir = 'top';
        const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        if (x === ox && y === oy) {
            return;
        }
        const xx = x - ox;
        const xy = y - oy;
        if (Math.abs(xy) > Math.abs(xx)) {
            if (xy < 0) {
                dir = 'top';
            }
            else {
                dir = 'bottom';
            }
        }
        else {
            if (xx < 0) {
                dir = 'left';
            }
            else {
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
        if (opt.move && (opt.move(e, dir) === false)) {
            if (e instanceof MouseEvent) {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', end);
            }
            else {
                if (oe.target) {
                    oe.target.removeEventListener('touchmove', move);
                    oe.target.removeEventListener('touchend', end);
                    oe.target.removeEventListener('touchcancel', end);
                }
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
            if (oe.target) {
                oe.target.removeEventListener('touchmove', move);
                oe.target.removeEventListener('touchend', end);
                oe.target.removeEventListener('touchcancel', end);
            }
        }
        (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, e);
        if (isStart) {
            (_b = opt.end) === null || _b === void 0 ? void 0 : _b.call(opt, e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move, {
            'passive': false
        });
        window.addEventListener('mouseup', end);
    }
    else {
        oe.target.addEventListener('touchmove', move, {
            'passive': false
        });
        oe.target.addEventListener('touchend', end);
        oe.target.addEventListener('touchcancel', end);
    }
    (_a = opt.down) === null || _a === void 0 ? void 0 : _a.call(opt, oe);
}
exports.bindDown = bindDown;
const bindGestureData = {
    'el': null,
    'xx': 0,
    'xy': 0,
    'tx': 0,
    'ty': 0,
    'dir': null,
    'timers': {
        'ani': 0,
        'sleep': 0
    }
};
function clearGestureData() {
    bindGestureData.xx = 0;
    bindGestureData.xy = 0;
    bindGestureData.tx = 0;
    bindGestureData.ty = 0;
}
function bindGestureAnimation(opt) {
    var _a;
    if (!bindGestureData.el) {
        return;
    }
    const speed = 6;
    const gestureElement = document.getElementById('cg-gesture');
    const dirs = (_a = opt.dirs) !== null && _a !== void 0 ? _a : ['top', 'bottom'];
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
        if (bindGestureData.xx < 0) {
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
        bindGestureData.timers.ani = 0;
        bindGestureData.timers.sleep = window.setTimeout(() => {
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
function bindGesture(e, opt) {
    var _a, _b, _c, _d, _e;
    const gestureElement = document.getElementById('cg-gesture');
    const el = (_b = (_a = e.currentTarget) !== null && _a !== void 0 ? _a : e.target) !== null && _b !== void 0 ? _b : opt.el;
    if (!el) {
        return;
    }
    let rect;
    if (e.rect) {
        rect = e.rect;
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
    const dirs = (_c = opt.dirs) !== null && _c !== void 0 ? _c : ['top', 'bottom'];
    if ((e instanceof MouseEvent || e instanceof TouchEvent) && !(e instanceof WheelEvent)) {
        const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        let dir = null;
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
                const nx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
                const ny = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
                const xx = nx - x;
                const xy = ny - y;
                let xxAbs = Math.abs(xx);
                let xyAbs = Math.abs(xy);
                if ((!dirs.includes('top') && !dirs.includes('bottom')) || ((xxAbs > xyAbs) && (dirs.includes('left') || dirs.includes('right')))) {
                    if (xx > 0) {
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
            end: () => {
                gestureElement.style.opacity = '0';
                if (!dir) {
                    return;
                }
                opt.handler(dir);
            }
        });
    }
    else {
        if (bindGestureData.el !== el) {
            bindGestureData.el = el;
            bindGestureData.xx = 0;
            bindGestureData.xy = 0;
        }
        let x = 0, y = 0;
        if (e instanceof WheelEvent) {
            e.preventDefault();
            if (Math.abs(e.deltaX) < 5 && Math.abs(e.deltaY) < 5) {
                return;
            }
            x = Math.round(e.deltaX / 3);
            y = Math.round(e.deltaY / 3);
            if (e.direction === 'h') {
                x = y;
                y = 0;
            }
            else if (e.direction === 'v') {
                y = x;
                x = 0;
            }
        }
        else {
            x = (_d = e.x) !== null && _d !== void 0 ? _d : 0;
            y = (_e = e.y) !== null && _e !== void 0 ? _e : 0;
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
exports.bindGesture = bindGesture;
let lastLongTime = 0;
function allowEvent(e) {
    const now = Date.now();
    if (now - lastLongTime < 5) {
        return false;
    }
    const current = e.currentTarget;
    if (current.dataset.cgDisabled !== undefined) {
        return false;
    }
    if (findParentByData(current, 'cg-disabled')) {
        return false;
    }
    return true;
}
exports.allowEvent = allowEvent;
function bindLong(e, long) {
    if (hasTouchButMouse(e)) {
        return;
    }
    const tx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const ty = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let ox = 0;
    let oy = 0;
    let isLong = false;
    let timer = window.setTimeout(() => {
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
        move: (e) => {
            const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            ox = Math.abs(x - tx);
            oy = Math.abs(y - ty);
        },
        up: () => {
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            else if (isLong) {
                lastLongTime = Date.now();
            }
        }
    });
}
exports.bindLong = bindLong;
function bindDrag(e, opt) {
    let otop = 0;
    let oleft = 0;
    let nel = null;
    bindMove(e, {
        'object': opt.el,
        'start': function () {
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
        'move': function (ox, oy, x, y) {
            const ntop = otop + oy;
            const nleft = oleft + ox;
            form.moveDrag({
                'top': ntop,
                'left': nleft,
                'icon': false
            });
            otop = ntop;
            oleft = nleft;
            const els = document.elementsFromPoint(x, y);
            for (const el of els) {
                if (el.dataset.cgDrop === undefined) {
                    continue;
                }
                if (el === opt.el) {
                    continue;
                }
                if (el === nel) {
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
        'end': function () {
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
exports.bindDrag = bindDrag;
exports.is = clickgo.vue.reactive({
    'move': false,
    'shift': false,
    'ctrl': false
});
window.addEventListener('keydown', function (e) {
    switch (e.key) {
        case 'Shift': {
            exports.is.shift = true;
            break;
        }
        case 'Control': {
            exports.is.ctrl = true;
            break;
        }
    }
});
window.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'Shift': {
            exports.is.shift = false;
            break;
        }
        case 'Control': {
            exports.is.ctrl = false;
            break;
        }
    }
});
function bindMove(e, opt) {
    var _a, _b, _c, _d;
    if (hasTouchButMouse(e)) {
        return {
            'left': 0,
            'top': 0,
            'right': 0,
            'bottom': 0
        };
    }
    exports.is.move = true;
    setGlobalCursor(getComputedStyle(e.target).cursor);
    let tx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let ty = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let left, top, right, bottom;
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
    let offsetLeft = 0, offsetTop = 0, offsetRight = 0, offsetBottom = 0;
    const moveTimes = [];
    bindDown(e, {
        start: () => {
            var _a, _b, _c, _d;
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    setGlobalCursor();
                    return false;
                }
            }
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
        move: (e, dir) => {
            var _a, _b, _c;
            let x, y;
            x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            if (x === tx && y === ty) {
                return;
            }
            let inBorderTop = false, inBorderRight = false, inBorderBottom = false, inBorderLeft = false;
            const nowLeft = x - offsetLeft;
            const nowRight = x + offsetRight;
            if (nowLeft <= left) {
                inBorderLeft = true;
                if (nowLeft < left && x < tx) {
                    if (tx - offsetLeft > left) {
                        x = left + offsetLeft;
                    }
                    else {
                        x = tx;
                    }
                }
            }
            else if (offsetRight !== 0) {
                if (nowRight >= right) {
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
            const nowTop = y - offsetTop;
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
                    (_a = opt.borderIn) === null || _a === void 0 ? void 0 : _a.call(opt, x, y, border, e);
                }
            }
            else {
                if (isBorder) {
                    isBorder = false;
                    (_b = opt.borderOut) === null || _b === void 0 ? void 0 : _b.call(opt);
                }
            }
            const ox = x - tx;
            const oy = y - ty;
            moveTimes.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });
            (_c = opt.move) === null || _c === void 0 ? void 0 : _c.call(opt, ox, oy, x, y, border, dir, e);
            tx = x;
            ty = y;
        },
        up: (e) => {
            var _a;
            exports.is.move = false;
            setGlobalCursor();
            (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes, e);
        },
        end: (e) => {
            var _a;
            (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt, moveTimes, e);
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
exports.bindMove = bindMove;
function bindResize(e, opt) {
    var _a, _b;
    if (hasTouchButMouse(e)) {
        return;
    }
    opt.minWidth = (_a = opt.minWidth) !== null && _a !== void 0 ? _a : 0;
    opt.minHeight = (_b = opt.minHeight) !== null && _b !== void 0 ? _b : 0;
    const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    let offsetLeft, offsetTop, offsetRight, offsetBottom;
    let left, top, right, bottom;
    if (opt.objectLeft === undefined
        || opt.objectTop === undefined
        || opt.objectWidth === undefined
        || opt.objectHeight === undefined) {
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
function findParentByData(el, name) {
    let parent = el.parentNode;
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
        parent = parent.parentNode;
    }
    return null;
}
exports.findParentByData = findParentByData;
function findParentByClass(el, name) {
    let parent = el.parentNode;
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
        parent = parent.parentNode;
    }
    return null;
}
exports.findParentByClass = findParentByClass;
function siblings(el) {
    if (!el.parentNode) {
        return [];
    }
    const list = [];
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        const e = el.parentNode.children.item(i);
        if (e === el) {
            continue;
        }
        list.push(e);
    }
    return list;
}
exports.siblings = siblings;
function siblingsData(el, name) {
    const list = siblings(el);
    const olist = [];
    for (const item of list) {
        if (item.getAttribute('data-' + name) === null) {
            continue;
        }
        olist.push(item);
    }
    return olist;
}
exports.siblingsData = siblingsData;
function fullscreen() {
    const he = document.getElementsByTagName('html')[0];
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
exports.fullscreen = fullscreen;
