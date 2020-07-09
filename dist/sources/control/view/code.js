"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    },
    "left": {
        "default": 0
    },
    "top": {
        "default": 0
    },
    "zIndex": {
        "default": 0
    },
    "flex": {
        "default": ""
    },
    "direction": {
        "default": "v"
    },
    "padding": {
        "default": undefined
    },
    "scrollOffset": {
        "default": 0
    }
};
exports.data = {
    "scrollOffsetData": 0,
    "scrollOffsetEmit": 0,
    "length": 0,
    "client": 0,
    "tran": 0,
    "timer": undefined,
    "_direction": undefined
};
exports.watch = {
    "direction": function () {
        var size = ClickGo.getWatchSize(this.$refs.wrap);
        this.client = this.direction === "v" ? size.clientHeight : size.clientWidth;
        var innerRect = this.$refs.inner.getBoundingClientRect();
        this.length = this.direction === "v" ? innerRect.height : innerRect.width;
    },
    "scrollOffset": {
        handler: function () {
            this.goScroll(this.scrollOffset);
        },
        "immediate": true
    }
};
exports.computed = {
    "maxScroll": function () {
        if (this.length < this.client) {
            return 0;
        }
        return Math.round(this.length - this.client);
    },
    "widthPx": function () {
        if (this.width !== undefined) {
            return this.width + "px";
        }
        if (this.flex !== "") {
            return this.$data._direction ? (this.$data._direction === "v" ? undefined : "0") : undefined;
        }
    },
    "heightPx": function () {
        if (this.height !== undefined) {
            return this.height + "px";
        }
        if (this.flex !== "") {
            return this.$data._direction ? (this.$data._direction === "v" ? "0" : undefined) : undefined;
        }
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
        if (this.direction === "v") {
            this.scrollOffsetData += Math.round(e.deltaY === 0 ? e.deltaX : e.deltaY);
        }
        else {
            this.scrollOffsetData += Math.round(e.deltaX === 0 ? e.deltaY : e.deltaX);
        }
        this.refreshView();
    },
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        var wrapSize = ClickGo.getWatchSize(this.$refs.wrap);
        var top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
        var right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
        var bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
        var left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            if (this.direction === "v") {
                this.scrollOffsetData = Math.round(top - this.$refs.inner.getBoundingClientRect().top);
            }
            else {
                this.scrollOffsetData = Math.round(left - this.$refs.inner.getBoundingClientRect().left);
            }
            this.tran = 0;
        }
        var over = (this.length > this.client) ? (this.length - this.client) : 0;
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "left": this.direction === "v" ? left : left - over,
            "right": this.direction === "v" ? right : right + over,
            "top": this.direction === "h" ? top : top - over,
            "bottom": this.direction === "h" ? bottom : bottom + over,
            "move": function (ox, oy) {
                _this.scrollOffsetData -= Math.round(_this.direction === "v" ? oy : ox);
                _this.scrollOffsetEmit = _this.scrollOffsetData;
                _this.$emit("update:scrollOffset", _this.scrollOffsetData);
            },
            "end": function (moveTimes) {
                var movePos = 0;
                var topTime = 0;
                var nowDate = Date.now();
                for (var _i = 0, moveTimes_1 = moveTimes; _i < moveTimes_1.length; _i++) {
                    var item = moveTimes_1[_i];
                    if (nowDate - item.time > 100) {
                        continue;
                    }
                    movePos += _this.direction === "v" ? item.oy : item.ox;
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
                        var wrapSize = ClickGo.getWatchSize(_this.$refs.wrap);
                        if (_this.direction === "v") {
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
                        _this.$emit("update:scrollOffset", offset);
                        requestAnimationFrame(animation);
                    };
                    animation();
                });
            }
        });
        this._down();
    },
    "refreshView": function () {
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
        this.$emit("update:scrollOffset", this.scrollOffsetData);
    },
    "goScroll": function (scrollOffset) {
        var so = typeof scrollOffset === "number" ? scrollOffset : parseInt(scrollOffset);
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
    var size = ClickGo.watchSize(this.$refs.wrap, function (size) {
        var client = Math.round(_this.direction === "v" ? size.clientHeight : size.clientWidth);
        if (client === _this.client) {
            _this.$emit("resizen");
            return;
        }
        _this.client = client;
        _this.$emit("resize", _this.client);
        _this.refreshView();
    });
    this.client = Math.round(this.direction === "v" ? size.clientHeight : size.clientWidth);
    this.$emit("resize", this.client);
    size = ClickGo.watchSize(this.$refs.inner, function (size) {
        var length = Math.round(_this.direction === "v" ? size.height : size.width);
        if (length === _this.length) {
            return;
        }
        _this.length = length;
        _this.$emit("change", _this.length);
        _this.refreshView();
    });
    this.length = Math.round(this.direction === "v" ? size.height : size.width);
    this.$emit("change", this.length);
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};
exports.destroyed = function () {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
    }
};
