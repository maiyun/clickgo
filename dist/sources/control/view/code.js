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
        'default': 'h'
    },
    'padding': {
        'default': undefined
    },
    'adaptation': {
        'dafault': false
    },
    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    },
    'content': {
        'default': 'max'
    }
};
exports.data = {
    'scrollLeftData': 0,
    'scrollTopData': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'clientInit': false,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'lengthInit': false,
    'timer': false
};
exports.watch = {
    'direction': function () {
        let size = clickgo.dom.getSize(this.$refs.wrap);
        if (this.clientWidth !== size.innerWidth) {
            this.clientWidth = size.innerWidth;
        }
        if (this.clientHeight !== size.innerHeight) {
            this.clientHeight = size.innerHeight;
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
    }
};
exports.computed = {
    'adaptationComp': function () {
        if (typeof this.adaptation === 'string') {
            if (this.adaptation === 'false') {
                return false;
            }
            return true;
        }
        return this.adaptation ? true : false;
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
                    this.refreshView();
                }
                else if (this.scrollLeftData > 0 && this.lengthHeight === this.clientHeight) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshView();
                }
            }
            else {
                if (this.scrollTopData < this.maxScrollTop) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaY;
                    this.refreshView();
                }
                else if (this.scrollLeftData < this.maxScrollLeft && this.lengthHeight === this.clientHeight) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshView();
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
                    this.refreshView();
                }
                else if (this.scrollTopData > 0 && this.lengthWidth === this.clientWidth) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshView();
                }
            }
            else {
                if (this.scrollLeftData < this.maxScrollLeft) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaX;
                    this.refreshView();
                }
                else if (this.scrollTopData < this.maxScrollTop && this.lengthWidth === this.clientWidth) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshView();
                }
            }
        }
    },
    down: function (e) {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        this.stopAnimation();
        let bindMove = (e) => {
            let wrapSize = clickgo.dom.getSize(this.$refs.wrap);
            let top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
            let right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
            let bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
            let left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
            let overWidth = this.lengthWidth - this.clientWidth;
            let overHeight = this.lengthHeight - this.clientHeight;
            clickgo.dom.bindMove(e, {
                'object': this.$refs.inner,
                'left': left - overWidth,
                'right': right + overWidth,
                'top': top - overHeight,
                'bottom': bottom + overHeight,
                'move': (ox, oy) => {
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
                },
                'end': (moveTimes) => __awaiter(this, void 0, void 0, function* () {
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
                        else {
                            if (this.scrollLeftData > this.maxScrollLeft) {
                                this.scrollLeftData = this.maxScrollLeft;
                            }
                            if (this.scrollTopData > this.maxScrollTop) {
                                this.scrollTopData = this.maxScrollTop;
                            }
                        }
                    };
                    animation();
                })
            });
        };
        let cancel = (e) => {
            this.$el.removeEventListener(e instanceof MouseEvent ? 'mousemove' : 'touchmove', move);
            this.$el.removeEventListener(e instanceof MouseEvent ? 'mouseup' : 'touchend', cancel);
            if (e instanceof TouchEvent) {
                this.$el.removeEventListener('touchcancel', cancel);
            }
        };
        let x = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        let y = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        let count = 0;
        let move = (e) => {
            ++count;
            if (clickgo.dom.is.move) {
                cancel(e);
                return;
            }
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
                e.stopPropagation();
                bindMove(e);
            }
            cancel(e);
        };
        this.$el.addEventListener(e instanceof MouseEvent ? 'mousemove' : 'touchmove', move);
        this.$el.addEventListener(e instanceof MouseEvent ? 'mouseup' : 'touchend', cancel);
        if (e instanceof TouchEvent) {
            this.$el.addEventListener('touchcancel', cancel);
        }
        this.cgDown(e);
    },
    'refreshView': function () {
        if (!this.lengthInit || !this.clientInit) {
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
    },
    stopAnimation: function () {
        if (this.timer) {
            this.timer = false;
        }
    }
};
exports.mounted = function () {
    clickgo.dom.watchSize(this.$refs.wrap, (size) => {
        let clientWidth = size.innerWidth;
        let clientHeight = size.innerHeight;
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
        this.refreshView();
    }, true);
    clickgo.dom.watchSize(this.$refs.inner, (size) => {
        let lengthWidth = size.width;
        let lengthHeight = size.height;
        if (lengthWidth !== this.lengthWidth) {
            this.lengthWidth = lengthWidth;
            if (this.direction === 'h') {
                this.$emit('change', Math.round(this.lengthWidth));
            }
        }
        if (lengthHeight !== this.lengthHeight) {
            this.lengthHeight = lengthHeight;
            if (this.direction === 'v') {
                this.$emit('change', Math.round(this.lengthHeight));
            }
        }
        if (!this.lengthInit) {
            this.lengthInit = true;
        }
        this.refreshView();
    }, true);
    this.goScroll(this.scrollLeft, 'left');
    this.goScroll(this.scrollTop, 'top');
};
exports.unmounted = function () {
    if (this.timer) {
        this.timer = false;
    }
};
