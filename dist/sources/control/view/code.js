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
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },
    'direction': {
        'default': 'v'
    },
    'padding': {
        'default': undefined
    },
    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    }
};
exports.data = {
    'scrollLeftData': 0,
    'scrollTopData': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'timer': false
};
exports.watch = {
    'direction': function () {
        let size = clickgo.element.getSize(this.$refs.wrap);
        this.clientWidth = Math.round(size.innerWidth);
        this.clientHeight = Math.round(size.innerHeight);
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.lengthWidth = Math.round(innerRect.width);
        this.lengthHeight = Math.round(innerRect.height);
    },
    'scrollLeft': {
        handler: function () {
            this.goScroll(this.scrollLeft, 'left');
        },
        'immediate': true
    },
    'scrollTop': {
        handler: function () {
            this.goScroll(this.scrollTop, 'top');
        },
        'immediate': true
    }
};
exports.computed = {
    'maxScrollLeft': function () {
        if (this.lengthWidth <= this.clientWidth) {
            return 0;
        }
        return Math.round(this.lengthWidth - this.clientWidth);
    },
    'maxScrollTop': function () {
        if (this.lengthHeight <= this.clientHeight) {
            return 0;
        }
        return Math.round(this.lengthHeight - this.clientHeight);
    },
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.$parent;
            if ((parent === null || parent === void 0 ? void 0 : parent.$data._controlName) === 'greatview') {
                parent = parent.$parent;
            }
            return (parent === null || parent === void 0 ? void 0 : parent.direction) ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.$parent;
            if ((parent === null || parent === void 0 ? void 0 : parent.$data._controlName) === 'greatview') {
                parent = parent.$parent;
            }
            return (parent === null || parent === void 0 ? void 0 : parent.direction) ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};
exports.methods = {
    wheel: function (e) {
        e.preventDefault();
        if (this.timer) {
            this.timer = false;
        }
        if (this.direction === 'v') {
            if (this.lengthWidth <= this.clientWidth) {
                this.scrollTopData += Math.round(e.deltaY === 0 ? e.deltaX : e.deltaY);
            }
            else {
                this.scrollTopData += e.deltaY;
                this.scrollLeftData += e.deltaX;
            }
        }
        else {
            if (this.lengthHeight <= this.clientHeight) {
                this.scrollLeftData += Math.round(e.deltaX === 0 ? e.deltaY : e.deltaX);
            }
            else {
                this.scrollTopData += e.deltaY;
                this.scrollLeftData += e.deltaX;
            }
        }
        this.refreshView();
    },
    down: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        let wrapSize = clickgo.element.getSize(this.$refs.wrap);
        let top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
        let right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
        let bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
        let left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
        if (this.timer) {
            this.timer = false;
        }
        let overWidth = this.lengthWidth - this.clientWidth;
        let overHeight = this.lengthHeight - this.clientHeight;
        clickgo.element.bindMove(e, {
            'object': this.$refs.inner,
            'left': left - (overWidth < 0 ? 0 : overWidth),
            'right': right + overWidth,
            'top': top - (overHeight < 0 ? 0 : overHeight),
            'bottom': bottom + overHeight,
            'move': (ox, oy) => {
                this.scrollLeftData -= ox;
                this.scrollTopData -= oy;
                if (this.scrollLeftEmit !== this.scrollLeftData) {
                    this.scrollLeftEmit = this.scrollLeftData;
                    this.$emit('update:scrollLeft', this.scrollLeftData);
                }
                if (this.scrollTopEmit !== this.scrollTopData) {
                    this.scrollTopEmit = this.scrollTopData;
                    this.$emit('update:scrollTop', this.scrollTopData);
                }
            },
            'end': (moveTimes) => __awaiter(this, void 0, void 0, function* () {
                let moveLeftPos = 0;
                let moveTopPos = 0;
                let topTime = 0;
                let nowDate = Date.now();
                for (let item of moveTimes) {
                    if (nowDate - item.time > 100) {
                        continue;
                    }
                    moveLeftPos += item.ox;
                    moveTopPos += item.oy;
                    if (topTime === 0 || topTime > item.time) {
                        topTime = item.time;
                    }
                }
                if (topTime === 0) {
                    return;
                }
                let speedLeft = (moveLeftPos / (Date.now() - topTime)) * 16;
                let speedTop = (moveTopPos / (Date.now() - topTime)) * 16;
                let fleft = 0;
                let ftop = 0;
                this.timer = true;
                let leftEnd = false;
                let topEnd = false;
                let animation = () => {
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
                        this.timer = false;
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
                        this.timer = false;
                        return;
                    }
                    if (this.timer) {
                        requestAnimationFrame(animation);
                    }
                };
                animation();
            })
        });
        this.cgDown();
    },
    'refreshView': function () {
        let leftEnd = false, topEnd = false;
        if (this.scrollLeftData > this.maxScrollLeft) {
            leftEnd = true;
            this.scrollLeftData = this.maxScrollLeft;
        }
        else if (this.scrollLeftData === this.maxScrollLeft) {
            leftEnd = true;
        }
        else if (this.scrollLeftData < 0) {
            leftEnd = true;
            this.scrollLeftData = 0;
        }
        if (this.scrollTopData > this.maxScrollTop) {
            topEnd = true;
            this.scrollTopData = this.maxScrollTop;
        }
        else if (this.scrollTopData === this.maxScrollTop) {
            topEnd = true;
        }
        else if (this.scrollTopData < 0) {
            topEnd = true;
            this.scrollTopData = 0;
        }
        if (leftEnd && topEnd) {
            this.timer = false;
        }
        this.scrollLeftEmit = this.scrollLeftData;
        this.$emit('update:scrollLeft', this.scrollLeftData);
        this.scrollTopEmit = this.scrollTopData;
        this.$emit('update:scrollTop', this.scrollTopData);
    },
    'goScroll': function (scroll, pos) {
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
        if (this.timer) {
            this.timer = false;
        }
        this.refreshView();
    }
};
exports.mounted = function () {
    let size = clickgo.element.watchSize(this.$refs.wrap, (size) => {
        let clientWidth = Math.round(size.innerWidth);
        let clientHeight = Math.round(size.innerHeight);
        if (this.direction === 'v') {
            if (clientWidth !== this.clientWidth) {
                this.clientWidth = clientWidth;
                this.$emit('resizen', this.clientWidth);
            }
            if (clientHeight === this.clientHeight) {
                return;
            }
            this.clientHeight = clientHeight;
            this.$emit('resize', this.clientHeight);
        }
        else {
            if (clientHeight !== this.clientHeight) {
                this.clientHeight = clientHeight;
                this.$emit('resizen', this.clientHeight);
            }
            if (clientWidth === this.clientWidth) {
                return;
            }
            this.clientWidth = clientWidth;
            this.$emit('resize', this.clientWidth);
        }
        this.refreshView();
    });
    this.client = Math.round(this.direction === 'v' ? size.innerHeight : size.innerWidth);
    this.$emit('resize', this.client);
    size = clickgo.element.watchSize(this.$refs.inner, (size) => {
        let lengthWidth = Math.round(size.width);
        let lengthHeight = Math.round(size.height);
        let change = false;
        if (lengthWidth !== this.lengthWidth) {
            this.lengthWidth = lengthWidth;
            change = true;
            if (this.direction === 'h') {
                this.$emit('change', this.lengthWidth);
            }
        }
        if (lengthHeight !== this.lengthHeight) {
            this.lengthHeight = lengthHeight;
            change = true;
            if (this.direction === 'v') {
                this.$emit('change', this.lengthHeight);
            }
        }
        if (change) {
            this.refreshView();
        }
    });
    this.lengthWidth = Math.round(size.width);
    this.lengthHeight = Math.round(size.height);
    if (this.direction === 'h') {
        this.$emit('change', this.lengthWidth);
    }
    else {
        this.$emit('change', this.lengthHeight);
    }
};
exports.unmounted = function () {
    if (this.timer) {
        this.timer = false;
    }
};
