"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindResize = exports.bindMove = exports.bindDown = exports.watchElement = exports.watchSize = exports.getSize = exports.getWatchSize = void 0;
var watchSizes = [];
function requestAnimationFrameCb() {
    for (var i = 0; i < watchSizes.length; ++i) {
        var item = watchSizes[i];
        var rect = item.el.getBoundingClientRect();
        var cs = getComputedStyle(item.el);
        if (rect.width === 0 && rect.height === 0) {
            if (cs.display === '') {
                watchSizes.splice(i, 1);
                --i;
            }
            continue;
        }
        var border = {
            'top': parseFloat(cs.borderTopWidth),
            'right': parseFloat(cs.borderRightWidth),
            'bottom': parseFloat(cs.borderBottomWidth),
            'left': parseFloat(cs.borderLeftWidth)
        };
        var padding = {
            'top': parseFloat(cs.paddingTop),
            'right': parseFloat(cs.paddingRight),
            'bottom': parseFloat(cs.paddingBottom),
            'left': parseFloat(cs.paddingLeft)
        };
        var trect = {
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
    requestAnimationFrame(requestAnimationFrameCb);
}
requestAnimationFrame(requestAnimationFrameCb);
function getWatchSize(el) {
    for (var _i = 0, watchSizes_1 = watchSizes; _i < watchSizes_1.length; _i++) {
        var item = watchSizes_1[_i];
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
exports.getWatchSize = getWatchSize;
function getSize(el) {
    var rect = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    var border = {
        'top': parseFloat(cs.borderTopWidth),
        'right': parseFloat(cs.borderRightWidth),
        'bottom': parseFloat(cs.borderBottomWidth),
        'left': parseFloat(cs.borderLeftWidth)
    };
    var padding = {
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
function watchSize(el, cb, scroll) {
    if (scroll === void 0) { scroll = false; }
    var size = getSize(el);
    watchSizes.push({
        'el': el,
        'size': size,
        'scroll': scroll,
        'cb': cb
    });
    return size;
}
exports.watchSize = watchSize;
function watchElement(el, cb, mode) {
    if (mode === void 0) { mode = 'default'; }
    var moi;
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
    var mo = new MutationObserver(cb);
    mo.observe(el, moi);
    return mo;
}
exports.watchElement = watchElement;
function bindDown(oe, opt) {
    var _a;
    if (oe instanceof MouseEvent && clickgo.hasTouch) {
        return;
    }
    var ox, oy;
    if (oe instanceof MouseEvent) {
        ox = oe.clientX;
        oy = oe.clientY;
    }
    else {
        ox = oe.touches[0].clientX;
        oy = oe.touches[0].clientY;
    }
    var isStart = false;
    var end;
    var move = function (e) {
        e.preventDefault();
        var x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        var y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
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
        }
        (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt, e);
        if (isStart) {
            (_b = opt.end) === null || _b === void 0 ? void 0 : _b.call(opt, e);
        }
    };
    if (oe instanceof MouseEvent) {
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
    }
    else {
        oe.target.addEventListener('touchmove', move, { passive: false });
        oe.target.addEventListener('touchend', end);
    }
    (_a = opt.down) === null || _a === void 0 ? void 0 : _a.call(opt, oe);
}
exports.bindDown = bindDown;
function bindMove(e, opt) {
    var _a, _b, _c, _d;
    clickgo.core.setGlobalCursor(getComputedStyle(e.target).cursor);
    var tx, ty;
    if (e instanceof MouseEvent) {
        tx = e.clientX * clickgo.rzoom;
        ty = e.clientY * clickgo.rzoom;
    }
    else {
        tx = e.touches[0].clientX * clickgo.rzoom;
        ty = e.touches[0].clientY * clickgo.rzoom;
    }
    var left, top, right, bottom;
    if (opt.offsetObject) {
        if (!(opt.offsetObject instanceof HTMLElement)) {
            opt.offsetObject = opt.offsetObject.$el;
        }
        var rect = opt.offsetObject.getBoundingClientRect();
        var sd = getComputedStyle(opt.offsetObject);
        left = rect.left + opt.offsetObject.clientLeft + parseFloat(sd.paddingLeft);
        top = rect.top + opt.offsetObject.clientTop + parseFloat(sd.paddingTop);
        right = rect.left + rect.width - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
        bottom = rect.top + rect.height - (parseFloat(sd.borderRightWidth) + parseFloat(sd.paddingRight));
    }
    else {
        var position = clickgo.getPosition();
        left = (_a = opt.left) !== null && _a !== void 0 ? _a : position.left;
        top = (_b = opt.top) !== null && _b !== void 0 ? _b : position.top;
        right = (_c = opt.right) !== null && _c !== void 0 ? _c : position.width;
        bottom = (_d = opt.bottom) !== null && _d !== void 0 ? _d : position.height;
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
    var isBorder = false;
    var objectLeft, objectTop, objectWidth, objectHeight;
    var offsetLeft = 0;
    var offsetTop = 0;
    var offsetRight = 0;
    var offsetBottom = 0;
    var moveTime = [];
    bindDown(e, {
        start: function () {
            var _a, _b, _c, _d;
            if (opt.start) {
                if (opt.start(tx, ty) === false) {
                    clickgo.core.setGlobalCursor();
                    return false;
                }
            }
            if (opt.object) {
                if (!(opt.object instanceof HTMLElement)) {
                    opt.object = opt.object.$el;
                }
                var rect = opt.object.getBoundingClientRect();
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
        move: function (e) {
            var _a, _b, _c;
            var x, y;
            x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * clickgo.rzoom;
            y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * clickgo.rzoom;
            if (x === tx && y === ty) {
                return;
            }
            var inBorderTop = false, inBorderRight = false, inBorderBottom = false, inBorderLeft = false;
            var xol = x - offsetLeft;
            var xor = x + offsetRight;
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
                var rs1 = right - 1;
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
            var yot = y - offsetTop;
            var yob = y + offsetBottom;
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
                var bs1 = bottom - 1;
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
            var border = '';
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
            var ox = x - tx;
            var oy = y - ty;
            moveTime.push({
                'time': Date.now(),
                'ox': ox,
                'oy': oy
            });
            (_c = opt.move) === null || _c === void 0 ? void 0 : _c.call(opt, ox, oy, x, y, border);
            tx = x;
            ty = y;
        },
        up: function () {
            var _a;
            clickgo.core.setGlobalCursor();
            (_a = opt.up) === null || _a === void 0 ? void 0 : _a.call(opt);
        },
        end: function () {
            var _a;
            (_a = opt.end) === null || _a === void 0 ? void 0 : _a.call(opt, moveTime);
        }
    });
    if (opt.showRect) {
        clickgo.form.showRectangle(tx, ty, {
            'left': left,
            'top': top,
            'width': right - left,
            'height': bottom - top
        });
        setTimeout(function () {
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
    opt.minWidth = (_a = opt.minWidth) !== null && _a !== void 0 ? _a : 0;
    opt.minHeight = (_b = opt.minHeight) !== null && _b !== void 0 ? _b : 0;
    var x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) * clickgo.rzoom;
    var y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) * clickgo.rzoom;
    var offsetLeft, offsetTop, offsetRight, offsetBottom;
    var left, top, right, bottom;
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
        'move': function (ox, oy, x, y, border) {
            var _a;
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
            (_a = opt.move) === null || _a === void 0 ? void 0 : _a.call(opt, opt.left, opt.top, opt.width, opt.height, x, y, border);
        },
        'end': opt.end
    });
}
exports.bindResize = bindResize;
