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
    "scrollOffset": {
        "default": 0
    }
};
exports.data = {
    "_needDown": true,
    "scrollOffsetData": 0,
    "timer": false
};
exports.methods = {
    wheel: function (e) {
        e.preventDefault();
        this.timer = false;
        var wrapRect = this.$refs.wrap.getBoundingClientRect();
        var innerRect = this.$refs.inner.getBoundingClientRect();
        var max = this.direction === "v" ? -innerRect.height + wrapRect.height : -innerRect.width + wrapRect.width;
        if (this.direction === "v") {
            this.scrollOffsetData -= e.deltaY === 0 ? e.deltaX : e.deltaY;
        }
        else {
            this.scrollOffsetData -= e.deltaX === 0 ? e.deltaY : e.deltaX;
        }
        if (this.scrollOffsetData > 0) {
            this.scrollOffsetData = 0;
        }
        else if (this.scrollOffsetData < max) {
            this.scrollOffsetData = max;
        }
        this.$emit("update:scrollOffset", Math.round(Math.abs(this.scrollOffsetData)));
    },
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.timer = false;
        var wrapRect = this.$refs.wrap.getBoundingClientRect();
        var innerRect = this.$refs.inner.getBoundingClientRect();
        var over = this.direction === "v" ? innerRect.height - wrapRect.height : innerRect.width - wrapRect.width;
        var maxOffset = this.direction === "v" ? -innerRect.height + wrapRect.height : -innerRect.width + wrapRect.width;
        var lastO = 0;
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "left": this.direction === "v" ? wrapRect.left : wrapRect.left - over,
            "right": this.direction === "v" ? wrapRect.right : wrapRect.right + over,
            "top": this.direction === "h" ? wrapRect.top : wrapRect.top - over,
            "bottom": this.direction === "h" ? wrapRect.top : wrapRect.bottom + over,
            "move": function (ox, oy) {
                _this.scrollOffsetData += _this.direction === "v" ? oy : ox;
                _this.$emit("update:scrollOffset", Math.round(Math.abs(_this.scrollOffsetData)));
                lastO = _this.direction === "v" ? oy : ox;
            },
            "end": function (time) {
                if (time === 0) {
                    return;
                }
                var speed = (lastO / (Date.now() - time)) * 16;
                var f = 0;
                _this.timer = true;
                var animation = function () {
                    f = Math.min(Math.abs(speed) / 32, 0.5);
                    if (speed > 0.2) {
                        speed -= f;
                    }
                    else if (speed < -0.2) {
                        speed += f;
                    }
                    else {
                        _this.timer = false;
                        return;
                    }
                    _this.scrollOffsetData += speed;
                    if (_this.scrollOffsetData > 0) {
                        _this.timer = false;
                        _this.scrollOffsetData = 0;
                        _this.$emit("update:scrollOffset", Math.round(Math.abs(_this.scrollOffsetData)));
                        return;
                    }
                    else if (_this.scrollOffsetData < maxOffset) {
                        _this.timer = false;
                        _this.scrollOffsetData = maxOffset;
                        _this.$emit("update:scrollOffset", Math.round(Math.abs(_this.scrollOffsetData)));
                        return;
                    }
                    _this.$emit("update:scrollOffset", Math.round(Math.abs(_this.scrollOffsetData)));
                    _this.timer && requestAnimationFrame(animation);
                };
                animation();
            }
        });
    }
};
exports.destroyed = function () {
    this.timer = false;
};
