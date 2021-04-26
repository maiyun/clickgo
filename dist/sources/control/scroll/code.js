"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': undefined
    },
    'top': {
        'default': undefined
    },
    'zIndex': {
        'default': undefined
    },
    'flex': {
        'default': ''
    },
    'direction': {
        'default': 'v'
    },
    'length': {
        'default': 1000
    },
    'client': {
        'default': 100
    },
    'scrollOffset': {
        'default': 0
    },
    'plain': {
        'default': false
    }
};
exports.data = {
    'scrollOffsetData': 0,
    'scrollOffsetPx': 0,
    'barLengthPx': 0,
    'timer': undefined,
    'tran': false
};
exports.watch = {
    'length': {
        handler: function () {
            this.resizePx();
        }
    },
    'client': {
        handler: function () {
            this.resizePx();
        }
    },
    'scrollOffset': {
        handler: function () {
            let scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.scrollOffsetData = scrollOffsetData;
            this.resizePx();
        }
    }
};
exports.computed = {
    'realSize': function () {
        if (this.client >= this.length) {
            return this.barLengthPx;
        }
        return this.client / this.length * this.barLengthPx;
    },
    'size': function () {
        if (this.realSize < 5) {
            if (5 > this.barLengthPx) {
                return this.barLengthPx;
            }
            return 5;
        }
        return this.realSize;
    },
    'sizeOut': function () {
        return this.size - this.realSize;
    },
    'barOutSize': function () {
        return this.barLengthPx - this.size;
    },
    'maxScroll': function () {
        return (this.length > this.client) ? this.length - this.client : 0;
    },
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isPlain': function () {
        return clickgo.tool.getBoolean(this.plain);
    }
};
exports.methods = {
    down: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.$refs.bar,
            'object': this.$refs.block,
            'move': (ox, oy) => {
                this.scrollOffsetPx += this.direction === 'v' ? oy : ox;
                let scrollPer = (this.barOutSize > 0) ? (this.scrollOffsetPx / this.barOutSize) : 0;
                this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            }
        });
    },
    bardown: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        let barRect = this.$refs.bar.getBoundingClientRect();
        let barOffset = this.direction === 'v' ? barRect.top : barRect.left;
        let eOffset = this.direction === 'v' ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX);
        eOffset = eOffset - barOffset;
        let scrollOffsetPx = eOffset - this.size / 2;
        if (scrollOffsetPx < 0) {
            scrollOffsetPx = 0;
        }
        if (scrollOffsetPx + this.size > this.barLengthPx) {
            scrollOffsetPx = this.barLengthPx - this.size;
        }
        this.scrollOffsetPx = scrollOffsetPx;
        let scrollPer = this.scrollOffsetPx / this.barOutSize;
        this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
        this.$emit('update:scrollOffset', this.scrollOffsetData);
        this.down(e);
    },
    longDown: function (e, type) {
        if (this.isDisabled) {
            return;
        }
        if (this.client >= this.length) {
            return;
        }
        clickgo.dom.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    clearInterval(this.timer);
                }
                this.tran = true;
                let cb = () => {
                    if (type === 'start') {
                        if (this.scrollOffsetData - 10 < 0) {
                            if (this.scrollOffsetData !== 0) {
                                this.scrollOffsetData = 0;
                                this.scrollOffsetPx = 0;
                                this.$emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData -= 10;
                            this.scrollOffsetPx = (this.maxScroll > 0) ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.$emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                    else {
                        if (this.scrollOffsetData + 10 > this.maxScroll) {
                            if (this.scrollOffsetData !== this.maxScroll) {
                                this.scrollOffsetData = this.maxScroll;
                                this.scrollOffsetPx = this.barOutSize;
                                this.$emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData += 10;
                            this.scrollOffsetPx = (this.maxScroll > 0) ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.$emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                    if (this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                this.timer = requestAnimationFrame(cb);
            },
            up: () => {
                this.tran = false;
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
            }
        });
    },
    resizePx: function () {
        if (this.scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
            this.scrollOffsetPx = this.barOutSize;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else if (this.scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
            this.scrollOffsetPx = 0;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else {
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    }
};
exports.mounted = function () {
    clickgo.dom.watchSize(this.$refs.bar, (size) => {
        this.barLengthPx = this.direction === 'v' ? size.height : size.width;
        this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
    });
    let scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
    if (this.scrollOffsetData === scrollOffsetData) {
        return;
    }
    this.scrollOffsetData = scrollOffsetData;
    this.resizePx();
};
exports.unmounted = function () {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
