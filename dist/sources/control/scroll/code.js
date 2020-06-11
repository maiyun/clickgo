"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    "scrollOffsetPx": 0,
    "scrollOffsetData": 0,
    "timer": undefined,
    "tran": false
};
exports.watch = {
    "scrollOffset": {
        handler: function () {
            this.scrollOffsetData = parseInt(this.scrollOffset);
        },
        "immediate": true
    }
};
exports.computed = {
    "size": function () {
        return this.client / this.length * 100 + "%";
    },
    "scrollOffsetPer": function () {
        var maxOffset = this.length - this.client;
        if (this.scrollOffsetData > maxOffset) {
            this.scrollOffsetData = maxOffset;
            this.$emit("update:scrollOffset", this.scrollOffsetData);
        }
        return this.scrollOffsetData / this.length * 100;
    }
};
exports.methods = {
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        var r = this.$refs.block.getBoundingClientRect();
        var rectWidth = 0, rectHeight = 0;
        var rect = ClickGo.bindMove(e, {
            "object": this.$refs.block,
            "offsetObject": this.$refs.bar,
            "move": function (ox, oy, x, y) {
                _this.scrollOffsetPx += _this.direction === "v" ? oy : ox;
                _this.scrollOffsetData = Math.round(_this.length * _this.scrollOffsetPx / (_this.direction === "v" ? rectHeight : rectWidth));
                _this.$emit("update:scrollOffset", _this.scrollOffsetData);
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.scrollOffsetPx = this.direction === "v" ? r.top - rect.top : r.left - rect.left;
    },
    longDown: function (e, type) {
        var _this = this;
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
exports.destroyed = function () {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
