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
        var size = clickgo.element.getWatchSize(this.$refs.wrap);
        this.client = this.direction === 'v' ? size.innerHeight : size.innerWidth;
        var innerRect = this.$refs.inner.getBoundingClientRect();
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
            var parent_1 = this.$parent;
            if (parent_1.$data._controlName === 'greatview') {
                parent_1 = parent_1.$parent;
            }
            return parent_1.direction ? (parent_1.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            var parent_2 = this.$parent;
            if (parent_2.$data._controlName === 'greatview') {
                parent_2 = parent_2.$parent;
            }
            return parent_2.direction ? (parent_2.direction === 'v' ? '0' : undefined) : undefined;
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
        var _this = this;
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        if (this.contentLength < this.client) {
            return;
        }
        var wrapSize = clickgo.element.getWatchSize(this.$refs.wrap);
        var top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
        var right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
        var bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
        var left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
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
        var over = this.length - this.client;
        clickgo.element.bindMove(e, {
            'object': this.$refs.inner,
            'left': this.direction === 'v' ? left : left - over,
            'right': this.direction === 'v' ? right : right + over,
            'top': this.direction === 'h' ? top : top - over,
            'bottom': this.direction === 'h' ? bottom : bottom + over,
            'move': function (ox, oy) {
                _this.scrollOffsetData -= _this.direction === 'v' ? oy : ox;
                _this.scrollOffsetEmit = _this.scrollOffsetData;
                _this.$emit('update:scrollOffset', _this.scrollOffsetData);
            },
            'end': function (moveTimes) {
                var movePos = 0;
                var topTime = 0;
                var nowDate = Date.now();
                for (var _i = 0, moveTimes_1 = moveTimes; _i < moveTimes_1.length; _i++) {
                    var item = moveTimes_1[_i];
                    if (nowDate - item.time > 100) {
                        continue;
                    }
                    movePos += _this.direction === 'v' ? item.oy : item.ox;
                    if (topTime === 0 || topTime > item.time) {
                        topTime = item.time;
                    }
                }
                if (topTime === 0) {
                    return;
                }
                var speed = Math.abs(movePos / (Date.now() - topTime));
                if (speed <= 0.1) {
                    return;
                }
                _this.tran = speed * 2000;
                _this.$nextTick(function () {
                    var _this = this;
                    this.timer = setTimeout(function () {
                        _this.timer = undefined;
                        _this.tran = 0;
                    }, this.tran);
                    if (movePos > 0) {
                        this.scrollOffsetData -= Math.round(speed * 800);
                    }
                    else {
                        this.scrollOffsetData += Math.round(speed * 800);
                    }
                    var animation = function () {
                        if (!_this.timer) {
                            return;
                        }
                        var offset = 0;
                        var wrapSize = clickgo.element.getWatchSize(_this.$refs.wrap);
                        if (_this.direction === 'v') {
                            offset = Math.round(wrapSize.top + wrapSize.border.top + wrapSize.padding.top - _this.$refs.inner.getBoundingClientRect().top);
                        }
                        else {
                            offset = Math.round(wrapSize.left + wrapSize.border.left + wrapSize.padding.left - _this.$refs.inner.getBoundingClientRect().left);
                        }
                        if (offset > _this.maxScroll) {
                            offset = _this.maxScroll;
                            clearTimeout(_this.timer);
                            _this.timer = undefined;
                            _this.scrollOffsetData = offset;
                            _this.tran = 0;
                        }
                        else if (offset < 0) {
                            offset = 0;
                            clearTimeout(_this.timer);
                            _this.timer = undefined;
                            _this.scrollOffsetData = offset;
                            _this.tran = 0;
                        }
                        _this.scrollOffsetEmit = offset;
                        _this.$emit('update:scrollOffset', offset);
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
        var so = typeof scrollOffset === 'number' ? scrollOffset : parseInt(scrollOffset);
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
    var _this = this;
    var size = clickgo.element.watchSize(this.$refs.wrap, function (size) {
        var client = Math.round(_this.direction === 'v' ? size.clientHeight : size.clientWidth);
        if (client === _this.client) {
            _this.$emit('resizen');
            return;
        }
        _this.client = client;
        _this.$emit('resize', _this.client);
        _this.refreshView();
    });
    this.client = Math.round(this.direction === 'v' ? size.innerHeight : size.innerWidth);
    this.$emit('resize', this.client);
    size = clickgo.element.watchSize(this.$refs.inner, function (size) {
        _this.contentLength = Math.round(_this.direction === 'v' ? size.height : size.width);
        _this.refreshView();
    });
    this.contentLength = Math.round(this.direction === 'v' ? size.height : size.width);
};
exports.destroyed = function () {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
    }
};
