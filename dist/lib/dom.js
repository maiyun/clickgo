"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siblingsData = exports.siblings = exports.findParentByData = exports.bindResize = exports.bindMove = exports.is = exports.bindLong = exports.allowEvent = exports.bindGesture = exports.bindDown = exports.watchStyle = exports.watch = exports.watchSize = exports.getSize = exports.getStyleCount = exports.removeStyle = exports.pushStyle = exports.removeFromStyleList = exports.createToStyleList = exports.hasTouchButMouse = exports.setGlobalCursor = void 0;
let topClass = ['#cg-form-list', '#cg-pop-list', '#cg-system', '#cg-simpletask'];
function classUnfold(after) {
    let arr = [];
    for (let name of topClass) {
        arr.push(name + (after ? (' ' + after) : ''));
    }
    return arr.join(', ');
}
let styleList = document.createElement('div');
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
function hasTouchButMouse(e) {
    if (e instanceof TouchEvent) {
        return false;
    }
    if ((e.pointerType === 'touch') && (e.type === 'contextmenu')) {
        return true;
    }
    let now = Date.now();
    if (now - lastTouchTime < 1000 * 60) {
        return true;
    }
    return false;
}
exports.hasTouchButMouse = hasTouchButMouse;
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
let watchStyleObjects = [];
function watchStyle(el, name, cb, immediate = false) {
    for (let item of watchStyleObjects) {
        if (item.el !== el) {
            continue;
        }
        for (let n of name) {
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
            'old': item.sd[n],
            'cb': [cb]
        };
        if (immediate) {
            cb(n, item.sd[n]);
        }
    }
}
exports.watchStyle = watchStyle;
let watchStyleRAF = function () {
    for (let i = 0; i < watchStyleObjects.length; ++i) {
        let item = watchStyleObjects[i];
        if (watchStyleObjects[i].sd.flex === '') {
            watchStyleObjects.splice(i, 1);
            --i;
            continue;
        }
        for (let name in item.names) {
            if (item.sd[name] === item.names[name].old) {
                continue;
            }
            item.names[name].old = item.sd[name];
            for (let cb of item.names[name].cb) {
                cb(name, item.sd[name]);
            }
        }
    }
    requestAnimationFrame(watchStyleRAF);
};
watchStyleRAF();
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
    let end;
    let move = function (e) {
        e.preventDefault();
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
let bindGestureData = {
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
    let speed = 6;
    let gestureElement = document.getElementById('cg-gesture');
    let rect = bindGestureData.el.getBoundingClientRect();
    let dirs = (_a = opt.dirs) !== null && _a !== void 0 ? _a : ['top', 'bottom'];
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
        if (bindGestureData.xx < 0) {
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
        bindGestureData.timers.ani = 0;
        bindGestureData.timers.sleep = window.setTimeout(() => {
            var _a;
            clearGestureData();
            bindGestureData.timers.sleep = 0;
            gestureElement.style.opacity = '0';
            if (!bindGestureData.dir) {
                return;
            }
            (_a = opt.handler) === null || _a === void 0 ? void 0 : _a.call(opt, bindGestureData.dir);
        }, 500);
        return;
    }
    bindGestureData.timers.ani = requestAnimationFrame(() => {
        bindGestureAnimation(opt);
    });
}
function bindGesture(e, opt = {}) {
    var _a, _b, _c, _d;
    let gestureElement = document.getElementById('cg-gesture');
    let el = (_a = e.currentTarget) !== null && _a !== void 0 ? _a : opt.el;
    if (!el) {
        return;
    }
    let rect = el.getBoundingClientRect();
    let dirs = (_b = opt.dirs) !== null && _b !== void 0 ? _b : ['top', 'bottom'];
    if ((e instanceof MouseEvent || e instanceof TouchEvent) && !(e instanceof WheelEvent)) {
        let x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        let y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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
                let nx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
                let ny = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
                let xx = nx - x;
                let xy = ny - y;
                let xxAbs = Math.abs(xx);
                let xyAbs = Math.abs(xy);
                if ((!dirs.includes('top') && !dirs.includes('bottom')) || ((xxAbs > xyAbs) && (dirs.includes('left') || dirs.includes('right')))) {
                    if (xx > 0) {
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
            end: (e) => {
                var _a;
                gestureElement.style.opacity = '0';
                if (!dir) {
                    return;
                }
                (_a = opt.handler) === null || _a === void 0 ? void 0 : _a.call(opt, dir);
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
            x = (_c = e.x) !== null && _c !== void 0 ? _c : 0;
            y = (_d = e.y) !== null && _d !== void 0 ? _d : 0;
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
exports.bindGesture = bindGesture;
let lastLongTime = 0;
function allowEvent(e) {
    let now = Date.now();
    if (now - lastLongTime < 5) {
        return false;
    }
    let current = e.currentTarget;
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
    let tx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    let ty = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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
            let x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
            let y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            ox = Math.abs(x - tx);
            oy = Math.abs(y - ty);
        },
        up: () => __awaiter(this, void 0, void 0, function* () {
            if (timer !== undefined) {
                clearTimeout(timer);
                timer = undefined;
            }
            else if (isLong) {
                lastLongTime = Date.now();
            }
        })
    });
}
exports.bindLong = bindLong;
exports.is = Vue.reactive({
    'move': false
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
    let offsetLeft = 0, offsetTop = 0, offsetRight = 0, offsetBottom = 0;
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
            let nowLeft = x - offsetLeft;
            let nowRight = x + offsetRight;
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
            let nowTop = y - offsetTop;
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
function findParentByData(el, name) {
    let parent = el.parentNode;
    while (parent) {
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
function siblings(el) {
    if (!el.parentNode) {
        return [];
    }
    let list = [];
    for (let i = 0; i < el.parentNode.children.length; ++i) {
        let e = el.parentNode.children.item(i);
        if (e === el) {
            continue;
        }
        list.push(e);
    }
    return list;
}
exports.siblings = siblings;
function siblingsData(el, name) {
    let list = siblings(el);
    let olist = [];
    for (let item of list) {
        if (item.getAttribute('data-' + name) === null) {
            continue;
        }
        olist.push(item);
    }
    return olist;
}
exports.siblingsData = siblingsData;
