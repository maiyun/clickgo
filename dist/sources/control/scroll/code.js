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
            this.scrollOffsetData = parseInt(this.scrollOffset);
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
    "size": function () {
        if (this.client >= this.length) {
            return "100%";
        }
        return this.client / this.length * 100 + "%";
    },
    "scrollOffsetPer": function () {
        return this.scrollOffsetData / this.length * 100;
    },
    "maxScroll": function () {
        return (this.length > this.client) ? (this.length - this.client) : 0;
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
        var r = this.$refs.block.getBoundingClientRect();
        var rectWidth = 0, rectHeight = 0;
        var rect = ClickGo.bindMove(e, {
            "object": this.$refs.block,
            "offsetObject": this.$refs.bar,
            "move": function (ox, oy, x, y) {
                _this.scrollOffsetPx += _this.direction === "v" ? oy : ox;
                _this.scrollOffsetData = Math.round(_this.length * (_this.scrollOffsetPx / (_this.direction === "v" ? rectHeight : rectWidth)));
                _this.$emit("update:scrollOffset", _this.scrollOffsetData);
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.scrollOffsetPx = this.direction === "v" ? r.top - rect.top : r.left - rect.left;
    },
    bardown: function (e) {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        var offset = (this.direction === "v" ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX)) * ClickGo.rzoom;
        var barR = this.$refs.bar.getBoundingClientRect();
        var blockR = this.$refs.block.getBoundingClientRect();
        if (this.direction === "v") {
            var offsetTop = offset - blockR.height / 2;
            if (offsetTop < barR.top) {
                offsetTop = barR.top;
            }
            if (offsetTop + blockR.height > barR.top + barR.height) {
                offsetTop = barR.top + barR.height - blockR.height;
            }
            var marginTop = offsetTop - barR.top;
            this.$refs.block.style.marginTop = marginTop + "px";
            this.scrollOffsetData = Math.round(this.length * ((offsetTop - barR.top) / barR.height));
        }
        else {
            var offsetLeft = offset - blockR.width / 2;
            if (offsetLeft < barR.left) {
                offsetLeft = barR.left;
            }
            if (offsetLeft + blockR.width > barR.left + barR.width) {
                offsetLeft = barR.left + barR.width - blockR.width;
            }
            var marginLeft = offsetLeft - barR.left;
            this.$refs.block.style.marginLeft = marginLeft + "px";
            this.scrollOffsetData = Math.round(this.length * ((offsetLeft - barR.left) / barR.width));
        }
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
exports.destroyed = function () {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
