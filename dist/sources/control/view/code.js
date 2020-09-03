"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
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
    'scrollOffset': {
        'default': 0
    }
};
exports.data = {
    'scrollOffsetData': 0,
    'scrollOffsetEmit': 0,
    'client': 0,
    'contentLength': 0,
    'tran': 0,
    'timer': undefined
};
exports.watch = {
    'direction': function () {
        let size = clickgo.element.getSize(this.$refs.wrap);
        this.client = this.direction === 'v' ? size.innerHeight : size.innerWidth;
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.length = this.direction === 'v' ? innerRect.height : innerRect.width;
    },
    'scrollOffset': {
        handler: function () {
            this.goScroll(this.scrollOffset);
        },
        'immediate': true
    },
    'length': {
        handler: function () {
            this.$emit('change', this.length);
        }
    }
};
exports.computed = {
    'maxScroll': function () {
        if (this.length < this.client) {
            return 0;
        }
        return Math.round(this.length - this.client);
    },
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.$parent;
            if (parent.$data._controlName === 'greatview') {
                parent = parent.$parent;
            }
            return parent.direction ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.$parent;
            if (parent.$data._controlName === 'greatview') {
                parent = parent.$parent;
            }
            return parent.direction ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },
    'length': function () {
        return this.contentLength < this.client ? this.client : this.contentLength;
    }
};
exports.methods = {
    wheel: function (e) {
        e.preventDefault();
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
        }
        if (this.direction === 'v') {
            this.scrollOffsetData += Math.round(e.deltaY === 0 ? e.deltaX : e.deltaY);
        }
        else {
            this.scrollOffsetData += Math.round(e.deltaX === 0 ? e.deltaY : e.deltaX);
        }
        this.refreshView();
    },
    down: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        if (this.contentLength < this.client) {
            return;
        }
        let wrapSize = clickgo.element.getSize(this.$refs.wrap);
        let top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
        let right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
        let bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
        let left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            if (this.direction === 'v') {
                this.scrollOffsetData = Math.round(top - this.$refs.inner.getBoundingClientRect().top);
            }
            else {
                this.scrollOffsetData = Math.round(left - this.$refs.inner.getBoundingClientRect().left);
            }
            this.tran = 0;
        }
        let over = this.length - this.client;
        clickgo.element.bindMove(e, {
            'object': this.$refs.inner,
            'left': this.direction === 'v' ? left : left - over,
            'right': this.direction === 'v' ? right : right + over,
            'top': this.direction === 'h' ? top : top - over,
            'bottom': this.direction === 'h' ? bottom : bottom + over,
            'move': (ox, oy) => {
                this.scrollOffsetData -= this.direction === 'v' ? oy : ox;
                this.scrollOffsetEmit = this.scrollOffsetData;
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            },
            'end': (moveTimes) => {
                let movePos = 0;
                let topTime = 0;
                let nowDate = Date.now();
                for (let item of moveTimes) {
                    if (nowDate - item.time > 100) {
                        continue;
                    }
                    movePos += this.direction === 'v' ? item.oy : item.ox;
                    if (topTime === 0 || topTime > item.time) {
                        topTime = item.time;
                    }
                }
                if (topTime === 0) {
                    return;
                }
                let speed = Math.abs(movePos / (Date.now() - topTime));
                if (speed <= 0.1) {
                    return;
                }
                this.tran = speed * 2000;
                this.$nextTick(function () {
                    this.timer = setTimeout(() => {
                        this.timer = undefined;
                        this.tran = 0;
                    }, this.tran);
                    if (movePos > 0) {
                        this.scrollOffsetData -= Math.round(speed * 800);
                    }
                    else {
                        this.scrollOffsetData += Math.round(speed * 800);
                    }
                    let animation = () => {
                        if (!this.timer) {
                            return;
                        }
                        let offset = 0;
                        let wrapSize = clickgo.element.getSize(this.$refs.wrap);
                        if (this.direction === 'v') {
                            offset = Math.round(wrapSize.top + wrapSize.border.top + wrapSize.padding.top - this.$refs.inner.getBoundingClientRect().top);
                        }
                        else {
                            offset = Math.round(wrapSize.left + wrapSize.border.left + wrapSize.padding.left - this.$refs.inner.getBoundingClientRect().left);
                        }
                        if (offset > this.maxScroll) {
                            offset = this.maxScroll;
                            clearTimeout(this.timer);
                            this.timer = undefined;
                            this.scrollOffsetData = offset;
                            this.tran = 0;
                        }
                        else if (offset < 0) {
                            offset = 0;
                            clearTimeout(this.timer);
                            this.timer = undefined;
                            this.scrollOffsetData = offset;
                            this.tran = 0;
                        }
                        this.scrollOffsetEmit = offset;
                        this.$emit('update:scrollOffset', offset);
                        requestAnimationFrame(animation);
                    };
                    animation();
                });
            }
        });
        this.cgDown();
    },
    'refreshView': function () {
        if (this.scrollOffsetData > this.maxScroll) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
                this.tran = 0;
            }
            this.scrollOffsetData = this.maxScroll;
        }
        else if (this.scrollOffsetData < 0) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
                this.tran = 0;
            }
            this.scrollOffsetData = 0;
        }
        this.scrollOffsetEmit = this.scrollOffsetData;
        this.$emit('update:scrollOffset', this.scrollOffsetData);
    },
    'goScroll': function (scrollOffset) {
        let so = typeof scrollOffset === 'number' ? scrollOffset : parseInt(scrollOffset);
        if (so === this.scrollOffsetEmit) {
            return;
        }
        this.scrollOffsetData = so;
        this.scrollOffsetEmit = so;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
        }
        this.refreshView();
    }
};
exports.mounted = function () {
    let size = clickgo.element.watchSize(this.$refs.wrap, (size) => {
        let client = Math.round(this.direction === 'v' ? size.clientHeight : size.clientWidth);
        if (client === this.client) {
            this.$emit('resizen');
            return;
        }
        this.client = client;
        this.$emit('resize', this.client);
        this.refreshView();
    });
    this.client = Math.round(this.direction === 'v' ? size.innerHeight : size.innerWidth);
    this.$emit('resize', this.client);
    size = clickgo.element.watchSize(this.$refs.inner, (size) => {
        let contentLengh = Math.round(this.direction === 'v' ? size.height : size.width);
        if (contentLengh !== this.contentLength) {
            this.contentLength = contentLengh;
            this.refreshView();
        }
    });
    this.contentLength = Math.round(this.direction === 'v' ? size.height : size.width);
};
exports.destroyed = function () {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
    }
};
