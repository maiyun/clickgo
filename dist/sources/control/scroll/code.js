"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    "disabled": {
        "default": false
    },
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
    "length": {
        "default": 1000
    },
    "client": {
        "default": 100
    },
    "scrollOffset": {
        "default": 0
    }
};
exports.data = {
    "scrollOffsetData": 0,
    "barLengthPx": 0,
    "timer": undefined,
    "tran": false,
    "_direction": undefined
};
exports.watch = {
    "length": {
        handler: function () {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        }
    },
    "client": {
        handler: function () {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        }
    },
    "scrollOffset": {
        handler: function () {
            this.scrollOffsetData = Math.round(this.scrollOffset);
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
            else if (this.scrollOffsetData < 0) {
                this.scrollOffsetData = 0;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        },
        "immediate": true
    }
};
exports.computed = {
    "realSize": function () {
        if (this.client >= this.length) {
            return this.barLengthPx;
        }
        return this.client / this.length * this.barLengthPx;
    },
    "size": function () {
        if (this.realSize < 5) {
            return 5;
        }
        return this.realSize;
    },
    "sizeOut": function () {
        return this.size - this.realSize;
    },
    "scrollOffsetPx": function () {
        return this.scrollOffsetData / this.length * (this.barLengthPx - this.sizeOut);
    },
    "maxScroll": function () {
        return (this.length > this.client) ? this.length - this.client : 0;
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
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        var px = this.scrollOffsetPx;
        ClickGo.bindMove(e, {
            "object": this.$refs.block,
            "offsetObject": this.$refs.bar,
            "move": function (ox, oy, x, y) {
                px += _this.direction === "v" ? oy : ox;
                var opx = px + (px / (_this.barLengthPx - _this.size) * _this.sizeOut);
                _this.scrollOffsetData = Math.round(opx / _this.barLengthPx * _this.length);
                _this.$emit("update:scrollOffset", _this.scrollOffsetData);
            }
        });
    },
    bardown: function (e) {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        var barRect = this.$refs.bar.getBoundingClientRect();
        var barOffset = this.direction === "v" ? barRect.top : barRect.left;
        var eOffset = (this.direction === "v" ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX)) * ClickGo.rzoom;
        eOffset = eOffset - barOffset;
        var px = eOffset - this.size / 2;
        if (px < 0) {
            px = 0;
        }
        if (px + this.size > this.barLengthPx) {
            px = this.barLengthPx - this.size;
        }
        this.scrollOffsetData = Math.round(px / (this.barLengthPx - this.sizeOut) * this.length);
        this.$emit("update:scrollOffset", this.scrollOffsetData);
        this.down(e);
    },
    longDown: function (e, type) {
        var _this = this;
        if (this.client >= this.length) {
            return;
        }
        ClickGo.bindDown(e, {
            down: function () {
                if (_this.timer !== undefined) {
                    clearInterval(_this.timer);
                }
                _this.tran = true;
                _this.timer = setInterval(function () {
                    if (type === "start") {
                        if (_this.scrollOffsetData - 20 < 0) {
                            _this.scrollOffsetData = 0;
                        }
                        else {
                            _this.scrollOffsetData -= 20;
                        }
                    }
                    else {
                        var maxOffset = _this.length - _this.client;
                        if (_this.scrollOffsetData + 20 > maxOffset) {
                            _this.scrollOffsetData = maxOffset;
                        }
                        else {
                            _this.scrollOffsetData += 20;
                        }
                    }
                    _this.$emit("update:scrollOffset", _this.scrollOffsetData);
                }, 50);
            },
            up: function () {
                _this.tran = false;
                if (_this.timer !== undefined) {
                    clearInterval(_this.timer);
                    _this.timer = undefined;
                }
            }
        });
    }
};
exports.mounted = function () {
    var _this = this;
    ClickGo.watchSize(this.$refs.bar, function (size) {
        _this.barLengthPx = _this.direction === "v" ? size.height : size.width;
    });
    this.barLengthPx = this.direction === "v" ? this.$refs.bar.offsetHeight : this.$refs.bar.offsetWidth;
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};
exports.destroyed = function () {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
