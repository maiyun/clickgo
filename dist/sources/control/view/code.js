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
    "length": 0,
    "client": 0,
    "timer": false
};
exports.watch = {
    "direction": function () {
        var wrapRect = this.$refs.wrap.getBoundingClientRect();
        var innerRect = this.$refs.inner.getBoundingClientRect();
        this.client = this.direction === "v" ? wrapRect.height : wrapRect.width;
        this.length = this.direction === "v" ? innerRect.height : innerRect.width;
    },
    "scrollOffset": {
        handler: function () {
            var so = parseInt(this.scrollOffset);
            var x = so - this.scrollOffsetData;
            if (x < 0.5 && x > -0.5) {
                return;
            }
            this.scrollOffsetData = so;
            this.refreshView();
        },
        "immediate": true
    }
};
exports.computed = {
    "maxScroll": function () {
        return (this.length > this.client) ? Math.round(this.length - this.client) : 0;
    }
};
exports.methods = {
    wheel: function (e) {
        e.preventDefault();
        this.timer = false;
        if (this.direction === "v") {
            this.scrollOffsetData += e.deltaY === 0 ? e.deltaX : e.deltaY;
        }
        else {
            this.scrollOffsetData += e.deltaX === 0 ? e.deltaY : e.deltaX;
        }
        this.refreshView();
    },
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.timer = false;
        var wrapRect = this.$refs.wrap.getBoundingClientRect();
        var over = (this.length > this.client) ? (this.length - this.client) : 0;
        var lastO = 0;
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "left": this.direction === "v" ? wrapRect.left : wrapRect.left - over,
            "right": this.direction === "v" ? wrapRect.right : wrapRect.right + over,
            "top": this.direction === "h" ? wrapRect.top : wrapRect.top - over,
            "bottom": this.direction === "h" ? wrapRect.top : wrapRect.bottom + over,
            "move": function (ox, oy) {
                _this.scrollOffsetData -= _this.direction === "v" ? oy : ox;
                _this.$emit("update:scrollOffset", Math.round(_this.scrollOffsetData));
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
                    _this.scrollOffsetData -= speed;
                    if (_this.scrollOffsetData > _this.maxScroll) {
                        _this.timer = false;
                        _this.scrollOffsetData = _this.maxScroll;
                        _this.$emit("update:scrollOffset", Math.round(_this.scrollOffsetData));
                        return;
                    }
                    else if (_this.scrollOffsetData < 0) {
                        _this.timer = false;
                        _this.scrollOffsetData = 0;
                        _this.$emit("update:scrollOffset", Math.round(_this.scrollOffsetData));
                        return;
                    }
                    _this.$emit("update:scrollOffset", Math.round(_this.scrollOffsetData));
                    _this.timer && requestAnimationFrame(animation);
                };
                animation();
            }
        });
    },
    "refreshView": function () {
        if (this.scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
        }
        else if (this.scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
        }
        this.$emit("update:scrollOffset", Math.round(this.scrollOffsetData));
    }
};
exports.mounted = function () {
    var _this = this;
    var rect = ClickGo.watchSize(this.$refs.wrap, function (rect) {
        _this.client = _this.direction === "v" ? rect.height : rect.width;
        _this.$emit("resize", Math.round(_this.client));
        _this.refreshView();
    });
    this.client = this.direction === "v" ? rect.height : rect.width;
    this.$emit("resize", Math.round(this.client));
    ClickGo.watchElement(this.$refs.inner, function (e) {
        _this.length = _this.direction === "v" ? _this.$refs.inner.getBoundingClientRect().height : _this.$refs.inner.getBoundingClientRect().width;
        _this.$emit("change", Math.round(_this.length));
        _this.refreshView();
    });
    this.length = this.direction === "v" ? this.$refs.inner.getBoundingClientRect().height : this.$refs.inner.getBoundingClientRect().width;
    this.$emit("change", Math.round(this.length));
};
exports.destroyed = function () {
    this.timer = false;
};
