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
    "scrollOffsetPx": 0,
    "barLengthPx": 0,
    "timer": undefined,
    "tran": false
};
exports.watch = {
    "length": {
        handler: function () {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    },
    "client": {
        handler: function () {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    },
    "scrollOffset": {
        handler: function () {
            var scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.resizePxOfScrollOffsetData(scrollOffsetData);
        }
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
    "barOutSize": function () {
        return this.barLengthPx - this.size;
    },
    "maxScroll": function () {
        return (this.length > this.client) ? this.length - this.client : 0;
    },
    "widthPx": function () {
        if (this.width !== undefined) {
            return this.width + "px";
        }
        if (this.flex !== "") {
            return this.$parent.direction ? (this.$parent.direction === "v" ? undefined : "0") : undefined;
        }
    },
    "heightPx": function () {
        if (this.height !== undefined) {
            return this.height + "px";
        }
        if (this.flex !== "") {
            return this.$parent.direction ? (this.$parent.direction === "v" ? "0" : undefined) : undefined;
        }
    }
};
exports.methods = {
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        ClickGo.bindMove(e, {
            "object": this.$refs.block,
            "offsetObject": this.$refs.bar,
            "move": function (ox, oy) {
                _this.scrollOffsetPx += _this.direction === "v" ? oy : ox;
                var scrollPer = _this.scrollOffsetPx / _this.barOutSize;
                _this.scrollOffsetData = Math.round(scrollPer * _this.maxScroll);
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
        var scrollOffsetPx = eOffset - this.size / 2;
        if (scrollOffsetPx < 0) {
            scrollOffsetPx = 0;
        }
        if (scrollOffsetPx + this.size > this.barLengthPx) {
            scrollOffsetPx = this.barLengthPx - this.size;
        }
        this.scrollOffsetPx = scrollOffsetPx;
        var scrollPer = this.scrollOffsetPx / this.barOutSize;
        this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
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
                var cb = function () {
                    if (type === "start") {
                        if (_this.scrollOffsetData - 10 < 0) {
                            if (_this.scrollOffsetData !== 0) {
                                _this.scrollOffsetData = 0;
                                _this.scrollOffsetPx = 0;
                                _this.$emit("update:scrollOffset", _this.scrollOffsetData);
                            }
                        }
                        else {
                            _this.scrollOffsetData -= 10;
                            _this.scrollOffsetPx = _this.barOutSize * (_this.scrollOffsetData / _this.maxScroll);
                            _this.$emit("update:scrollOffset", _this.scrollOffsetData);
                        }
                    }
                    else {
                        if (_this.scrollOffsetData + 10 > _this.maxScroll) {
                            if (_this.scrollOffsetData !== _this.maxScroll) {
                                _this.scrollOffsetData = _this.maxScroll;
                                _this.scrollOffsetPx = _this.barOutSize;
                                _this.$emit("update:scrollOffset", _this.scrollOffsetData);
                            }
                        }
                        else {
                            _this.scrollOffsetData += 10;
                            _this.scrollOffsetPx = _this.barOutSize * (_this.scrollOffsetData / _this.maxScroll);
                            _this.$emit("update:scrollOffset", _this.scrollOffsetData);
                        }
                    }
                    if (_this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                _this.timer = requestAnimationFrame(cb);
            },
            up: function () {
                _this.tran = false;
                if (_this.timer !== undefined) {
                    _this.timer = undefined;
                }
            }
        });
    },
    resizePxOfScrollOffsetData: function (scrollOffsetData) {
        if (scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
            this.scrollOffsetPx = this.barOutSize;
            this.$emit("update:scrollOffset", this.scrollOffsetData);
        }
        else if (scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
            this.scrollOffsetPx = 0;
            this.$emit("update:scrollOffset", this.scrollOffsetData);
        }
        else {
            this.scrollOffsetData = scrollOffsetData;
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
            this.$emit("update:scrollOffset", this.scrollOffsetData);
        }
    }
};
exports.mounted = function () {
    var _this = this;
    var size = ClickGo.watchSize(this.$refs.bar, function (size) {
        _this.barLengthPx = _this.direction === "v" ? size.height : size.width;
        _this.scrollOffsetPx = _this.barOutSize * (_this.scrollOffsetData / _this.maxScroll);
    });
    this.barLengthPx = this.direction === "v" ? size.height : size.width;
    var scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
    if (this.scrollOffsetData === scrollOffsetData) {
        return;
    }
    this.resizePxOfScrollOffsetData(scrollOffsetData);
};
exports.destroyed = function () {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
