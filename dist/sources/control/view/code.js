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
exports.unmounted = exports.mounted = exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'direction': {
        'default': 'h'
    },
    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    },
    'selection': {
        'default': false
    },
    'content': {
        'default': undefined
    },
    'solo': {
        'default': true
    }
};
exports.data = {
    'padding': '',
    'scrollLeftData': 0,
    'scrollTopData': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'clientInit': false,
    'lengthWidth': -1,
    'lengthHeight': -1,
    'lengthEmit': -1,
    'selectionOrigin': { x: 0, y: 0 },
    'selectionCurrent': { x: 0, y: 0, quick: false },
    'timer': 0,
    'selectionTimer': 0
};
exports.watch = {
    'direction': function () {
        let size = clickgo.dom.getSize(this.$el);
        if (this.clientWidth !== size.clientWidth) {
            this.clientWidth = size.clientWidth;
        }
        if (this.clientHeight !== size.clientHeight) {
            this.clientHeight = size.clientHeight;
        }
        this.$emit('resize', this.direction === 'v' ? Math.round(this.clientHeight) : Math.round(this.clientWidth));
        this.$emit('resizen', this.direction === 'h' ? Math.round(this.clientHeight) : Math.round(this.clientWidth));
    },
    'scrollLeft': {
        handler: function () {
            this.goScroll(this.scrollLeft, 'left');
        }
    },
    'scrollTop': {
        handler: function () {
            this.goScroll(this.scrollTop, 'top');
        }
    },
    'scrollLeftData': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshSelection();
            });
        }
    },
    'scrollTopData': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshSelection();
            });
        }
    }
};
exports.computed = {
    'isSelection': function () {
        return clickgo.tool.getBoolean(this.selection);
    },
    'isSolo': function () {
        return clickgo.tool.getBoolean(this.solo);
    },
    'maxScrollLeft': function () {
        if (this.lengthWidth <= this.clientWidth) {
            return 0;
        }
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function () {
        if (this.lengthHeight <= this.clientHeight) {
            return 0;
        }
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    },
    'opMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.methods = {
    wheel: function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (this.scrollTopData > 0) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaY;
                    this.refreshScroll();
                }
                else if (this.scrollLeftData > 0) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshScroll();
                }
                else {
                    if (this.direction === 'h') {
                        e.direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                if (this.scrollTopData < this.maxScrollTop) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaY;
                    this.refreshScroll();
                }
                else if (this.scrollLeftData < this.maxScrollLeft) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshScroll();
                }
                else {
                    if (this.direction === 'h') {
                        e.direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
        }
        else {
            if (e.deltaX < 0) {
                if (this.scrollLeftData > 0) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaX;
                    this.refreshScroll();
                }
                else if (this.scrollTopData > 0) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshScroll();
                }
                else {
                    if (this.direction === 'v') {
                        e.direction = 'v';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                if (this.scrollLeftData < this.maxScrollLeft) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaX;
                    this.refreshScroll();
                }
                else if (this.scrollTopData < this.maxScrollTop) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshScroll();
                }
                else {
                    if (this.direction === 'v') {
                        e.direction = 'v';
                    }
                    this.$emit('scrollborder', e);
                }
            }
        }
    },
    down: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.stopAnimation();
        let bindMove = (e) => {
            let size = clickgo.dom.getSize(this.$el);
            let alreadySb = false;
            let isFirstMove = false;
            let overWidth = this.lengthWidth - this.clientWidth;
            let overHeight = this.lengthHeight - this.clientHeight;
            clickgo.dom.bindMove(e, {
                'object': this.$refs.inner,
                'left': size.left + size.border.left - (overWidth > 0 ? overWidth : 0),
                'right': overWidth > 0 ? (size.right - size.border.right + overWidth) : (size.left + size.border.left + this.lengthWidth),
                'top': size.top + size.border.top - (overHeight > 0 ? overHeight : 0),
                'bottom': overHeight > 0 ? (size.bottom - size.border.bottom + overHeight) : (size.top + size.border.top + this.lengthHeight),
                move: (ox, oy, x, y, border, dir, ne) => {
                    this.scrollLeftData -= ox;
                    this.scrollTopData -= oy;
                    let sleft = Math.round(this.scrollLeftData);
                    if (sleft > this.maxScrollLeft) {
                        sleft = this.maxScrollLeft;
                    }
                    if (this.scrollLeftEmit !== sleft) {
                        this.scrollLeftEmit = sleft;
                        this.$emit('update:scrollLeft', this.scrollLeftEmit);
                    }
                    let stop = Math.round(this.scrollTopData);
                    if (stop > this.maxScrollTop) {
                        stop = this.maxScrollTop;
                    }
                    if (this.scrollTopEmit !== stop) {
                        this.scrollTopEmit = stop;
                        this.$emit('update:scrollTop', this.scrollTopEmit);
                    }
                    if (!isFirstMove) {
                        isFirstMove = true;
                        switch (dir) {
                            case 'top': {
                                if (this.direction === 'h') {
                                    break;
                                }
                                if (stop === this.maxScrollTop) {
                                    alreadySb = true;
                                }
                                break;
                            }
                            case 'right': {
                                if (this.direction === 'v') {
                                    break;
                                }
                                if (sleft === 0) {
                                    alreadySb = true;
                                }
                                break;
                            }
                            case 'bottom': {
                                if (this.direction === 'h') {
                                    break;
                                }
                                if (stop === 0) {
                                    alreadySb = true;
                                }
                                break;
                            }
                            default: {
                                if (this.direction === 'v') {
                                    break;
                                }
                                if (sleft === this.maxScrollLeft) {
                                    alreadySb = true;
                                }
                            }
                        }
                        if (alreadySb) {
                            ne.rect = this.$el.getBoundingClientRect();
                            this.$emit('scrollborder', ne);
                        }
                    }
                },
                up: (moveTimes) => __awaiter(this, void 0, void 0, function* () {
                    let moveLeftPos = 0;
                    let moveTopPos = 0;
                    let topTime = 0;
                    let nowDate = Date.now();
                    for (let item of moveTimes) {
                        if (nowDate - item.time > 150) {
                            continue;
                        }
                        moveLeftPos += item.ox;
                        moveTopPos += item.oy;
                        if (topTime === 0 || topTime > item.time) {
                            topTime = item.time;
                        }
                    }
                    if (topTime === 0) {
                        this.scrollLeftData = Math.round(this.scrollLeftData);
                        if (this.scrollLeftData > this.maxScrollLeft) {
                            this.scrollLeftData = this.maxScrollLeft;
                        }
                        this.scrollTopData = Math.round(this.scrollTopData);
                        if (this.scrollTopData > this.maxScrollTop) {
                            this.scrollTopData = this.maxScrollTop;
                        }
                        return;
                    }
                    let speedLeft = (moveLeftPos / (Date.now() - topTime)) * 16;
                    let speedTop = (moveTopPos / (Date.now() - topTime)) * 16;
                    let fleft = 0;
                    let ftop = 0;
                    let leftEnd = false;
                    let topEnd = false;
                    this.timer = this.cgOnFrame(() => {
                        if (!leftEnd) {
                            fleft = Math.min(Math.abs(speedLeft) / 32, 0.5);
                            if (speedLeft > 0.2) {
                                speedLeft -= fleft;
                                this.scrollLeftData -= speedLeft;
                            }
                            else if (speedLeft < -0.2) {
                                speedLeft += fleft;
                                this.scrollLeftData -= speedLeft;
                            }
                            else {
                                leftEnd = true;
                            }
                        }
                        if (!topEnd) {
                            ftop = Math.min(Math.abs(speedTop) / 32, 0.5);
                            if (speedTop > 0.2) {
                                speedTop -= ftop;
                                this.scrollTopData -= speedTop;
                            }
                            else if (speedTop < -0.2) {
                                speedTop += ftop;
                                this.scrollTopData -= speedTop;
                            }
                            else {
                                topEnd = true;
                            }
                        }
                        if (leftEnd && topEnd) {
                            this.scrollLeftData = Math.round(this.scrollLeftData);
                            if (this.scrollLeftData > this.maxScrollLeft) {
                                this.scrollLeftData = this.maxScrollLeft;
                            }
                            this.scrollTopData = Math.round(this.scrollTopData);
                            if (this.scrollTopData > this.maxScrollTop) {
                                this.scrollTopData = this.maxScrollTop;
                            }
                            this.cgOffFrame(this.timer);
                            this.timer = 0;
                            return;
                        }
                        if (this.scrollLeftData > this.maxScrollLeft) {
                            leftEnd = true;
                            this.scrollLeftData = this.maxScrollLeft;
                        }
                        else if (this.scrollLeftData < 0) {
                            leftEnd = true;
                            this.scrollLeftData = 0;
                        }
                        else if (this.scrollLeftData === this.maxScrollLeft) {
                            leftEnd = true;
                        }
                        if (this.scrollTopData > this.maxScrollTop) {
                            topEnd = true;
                            this.scrollTopData = this.maxScrollTop;
                        }
                        else if (this.scrollTopData < 0) {
                            topEnd = true;
                            this.scrollTopData = 0;
                        }
                        else if (this.scrollTopData === this.maxScrollTop) {
                            topEnd = true;
                        }
                        this.scrollLeftEmit = Math.round(this.scrollLeftData);
                        this.$emit('update:scrollLeft', this.scrollLeftEmit);
                        this.scrollTopEmit = Math.round(this.scrollTopData);
                        this.$emit('update:scrollTop', this.scrollTopEmit);
                        if (leftEnd && topEnd) {
                            this.cgOffFrame(this.timer);
                            this.timer = 0;
                        }
                    });
                })
            });
        };
        let x = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        let y = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        if (this.isSelection) {
            if (clickgo.dom.findParentByData(e.target, 'cg-selection-cancel')) {
                return;
            }
            clickgo.dom.bindDown(e, {
                start: () => {
                    let innerRect = this.$refs.inner.getBoundingClientRect();
                    this.selectionOrigin.x = x - innerRect.left;
                    this.selectionOrigin.y = y - innerRect.top;
                    this.$refs.selection.style.opacity = '1';
                    this.$refs.selection.style.left = this.selectionOrigin.x + 'px';
                    this.$refs.selection.style.top = this.selectionOrigin.y + 'px';
                    this.selectionCurrent.x = x;
                    this.selectionCurrent.y = y;
                    this.selectionTimer = this.cgOnFrame(() => {
                        let rect = this.$el.getBoundingClientRect();
                        if (this.selectionCurrent.x < rect.left) {
                            if (this.scrollLeftData > 0) {
                                let x = rect.left - this.selectionCurrent.x;
                                let dist = 0;
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollLeftData - dist < 0) {
                                    dist = this.scrollLeftData;
                                }
                                this.scrollLeftData -= dist;
                                this.scrollLeftEmit = Math.round(this.scrollLeftData);
                                this.$emit('update:scrollLeft', this.scrollLeftEmit);
                            }
                        }
                        else if (this.selectionCurrent.x > rect.right) {
                            if (this.scrollLeftData < this.maxScrollLeft) {
                                let x = this.selectionCurrent.x - rect.right;
                                let dist = 0;
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollLeftData + dist > this.maxScrollLeft) {
                                    dist = this.maxScrollLeft - this.scrollLeftData;
                                }
                                this.scrollLeftData += dist;
                                this.scrollLeftEmit = Math.round(this.scrollLeftData);
                                this.$emit('update:scrollLeft', this.scrollLeftEmit);
                            }
                        }
                        if (this.selectionCurrent.y < rect.top) {
                            if (this.scrollTopData > 0) {
                                let x = rect.top - this.selectionCurrent.y;
                                let dist = 0;
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollTopData - dist < 0) {
                                    dist = this.scrollTopData;
                                }
                                this.scrollTopData -= dist;
                                this.scrollTopEmit = Math.round(this.scrollTopData);
                                this.$emit('update:scrollTop', this.scrollTopEmit);
                            }
                        }
                        else if (this.selectionCurrent.y > rect.bottom) {
                            if (this.scrollTopData < this.maxScrollTop) {
                                let x = this.selectionCurrent.y - rect.bottom;
                                let dist = 0;
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollTopData + dist > this.maxScrollTop) {
                                    dist = this.maxScrollTop - this.scrollTopData;
                                }
                                this.scrollTopData += dist;
                                this.scrollTopEmit = Math.round(this.scrollTopData);
                                this.$emit('update:scrollTop', this.scrollTopEmit);
                            }
                        }
                    });
                    this.$emit('beforeselect');
                },
                move: (ne) => {
                    let nx = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                    let ny = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                    this.selectionCurrent.x = nx;
                    this.selectionCurrent.y = ny;
                    this.selectionCurrent.quick = true;
                    this.refreshSelection(ne.shiftKey, ne.ctrlKey);
                },
                end: () => {
                    this.$refs.selection.style.opacity = '0';
                    this.cgOffFrame(this.selectionTimer);
                    this.selectionTimer = 0;
                    this.$emit('afterselect');
                }
            });
        }
        else {
            let count = 0;
            let cancel = false;
            clickgo.dom.bindDown(e, {
                move: (e) => {
                    if (cancel) {
                        return;
                    }
                    if (clickgo.dom.is.move) {
                        cancel = true;
                        return;
                    }
                    if (this.isSolo) {
                        bindMove(e);
                        cancel = true;
                        return;
                    }
                    ++count;
                    if (count < 3) {
                        return;
                    }
                    let deltaX = x - ((e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX);
                    let deltaY = y - ((e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY);
                    if (deltaX === 0 && deltaY === 0) {
                        return;
                    }
                    let isWheel = false;
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        if (deltaY < 0) {
                            if (this.scrollTopData > 0) {
                                isWheel = true;
                            }
                        }
                        else if (deltaY > 0) {
                            if (this.scrollTopData < this.maxScrollTop) {
                                isWheel = true;
                            }
                        }
                    }
                    else {
                        if (deltaX < 0) {
                            if (this.scrollLeftData > 0) {
                                isWheel = true;
                            }
                        }
                        else if (deltaX > 0) {
                            if (this.scrollLeftData < this.maxScrollLeft) {
                                isWheel = true;
                            }
                        }
                    }
                    if (isWheel) {
                        bindMove(e);
                    }
                    cancel = true;
                }
            });
        }
    },
    refreshLength: function () {
        if (this.lengthWidth === -1 || this.lengthHeight === -1) {
            return;
        }
        let length = 0;
        if (this.direction === 'h') {
            length = Math.round(this.lengthWidth < this.clientWidth ? this.clientWidth : this.lengthWidth);
        }
        else {
            length = Math.round(this.lengthHeight < this.clientHeight ? this.clientHeight : this.lengthHeight);
        }
        if (length !== this.lengthEmit) {
            this.lengthEmit = length;
            this.$emit('change', length);
        }
        this.refreshScroll();
    },
    refreshScroll: function () {
        if (this.lengthEmit === -1 || !this.clientInit) {
            return;
        }
        if (this.scrollLeftData > this.maxScrollLeft) {
            this.scrollLeftData = this.maxScrollLeft;
        }
        else if (this.scrollLeftData < 0) {
            this.scrollLeftData = 0;
        }
        if (this.scrollTopData > this.maxScrollTop) {
            this.scrollTopData = this.maxScrollTop;
        }
        else if (this.scrollTopData < 0) {
            this.scrollTopData = 0;
        }
        let sleft = Math.round(this.scrollLeftData);
        if (this.scrollLeftEmit !== sleft) {
            this.scrollLeftEmit = sleft;
            this.$emit('update:scrollLeft', this.scrollLeftEmit);
        }
        let stop = Math.round(this.scrollTopData);
        if (this.scrollTopEmit !== stop) {
            this.scrollTopEmit = stop;
            this.$emit('update:scrollTop', this.scrollTopEmit);
        }
    },
    goScroll: function (scroll, pos) {
        scroll = typeof scroll === 'number' ? scroll : parseInt(scroll);
        if (pos === 'left') {
            if (scroll === this.scrollLeftEmit) {
                return;
            }
            else {
                this.scrollLeftData = scroll;
                this.scrollLeftEmit = scroll;
            }
        }
        else {
            if (scroll === this.scrollTopEmit) {
                return;
            }
            else {
                this.scrollTopData = scroll;
                this.scrollTopEmit = scroll;
            }
        }
        if (this.timer > 0) {
            this.cgOffFrame(this.timer);
            this.timer = 0;
        }
        this.refreshScroll();
    },
    stopAnimation: function () {
        if (this.timer > 0) {
            this.cgOffFrame(this.timer);
            this.timer = 0;
        }
    },
    refreshSelection: function (shift = false, ctrl = false) {
        if (!this.selectionTimer) {
            return;
        }
        let innerRect = this.$refs.inner.getBoundingClientRect();
        let sx = this.selectionCurrent.x - innerRect.left;
        let sy = this.selectionCurrent.y - innerRect.top;
        let area = {
            'x': 0,
            'y': 0,
            'width': 0,
            'height': 0,
            'shift': shift,
            'ctrl': ctrl
        };
        if (sx >= this.selectionOrigin.x) {
            area.x = Math.round(this.selectionOrigin.x);
            area.width = Math.round(sx - this.selectionOrigin.x);
        }
        else {
            area.x = Math.round(sx);
            area.width = Math.round(this.selectionOrigin.x - sx);
        }
        if (sy >= this.selectionOrigin.y) {
            area.y = Math.round(this.selectionOrigin.y);
            area.height = Math.round(sy - this.selectionOrigin.y);
        }
        else {
            area.y = Math.round(sy);
            area.height = Math.round(this.selectionOrigin.y - sy);
        }
        this.$refs.selection.style.left = area.x + 'px';
        this.$refs.selection.style.top = area.y + 'px';
        this.$refs.selection.style.width = area.width + 'px';
        this.$refs.selection.style.height = area.height + 'px';
        this.$emit('select', area);
    }
};
let mounted = function () {
    clickgo.dom.watchSize(this.$el, (size) => {
        let clientWidth = size.clientWidth;
        let clientHeight = size.clientHeight;
        if (this.direction === 'v') {
            if (this.clientWidth !== clientWidth) {
                this.clientWidth = clientWidth;
                this.$emit('resizen', Math.round(this.clientWidth));
            }
            if (clientHeight !== this.clientHeight) {
                this.clientHeight = clientHeight;
                this.$emit('resize', Math.round(this.clientHeight));
            }
        }
        else {
            if (this.clientHeight !== clientHeight) {
                this.clientHeight = clientHeight;
                this.$emit('resizen', Math.round(this.clientHeight));
            }
            if (clientWidth !== this.clientWidth) {
                this.clientWidth = clientWidth;
                this.$emit('resize', Math.round(this.clientWidth));
            }
        }
        if (!this.clientInit) {
            this.clientInit = true;
        }
        this.refreshLength();
    }, true);
    clickgo.dom.watchSize(this.$refs.inner, (size) => {
        if (size.width !== this.lengthWidth) {
            this.lengthWidth = size.width;
        }
        if (size.height !== this.lengthHeight) {
            this.lengthHeight = size.height;
        }
        this.refreshLength();
    }, true);
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
    this.goScroll(this.scrollLeft, 'left');
    this.goScroll(this.scrollTop, 'top');
};
exports.mounted = mounted;
let unmounted = function () {
    if (this.timer > 0) {
        this.cgOffFrame(this.timer);
        this.timer = 0;
    }
};
exports.unmounted = unmounted;
