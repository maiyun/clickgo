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
    "scrollOffsetData": 0,
    "scrollOffsetDataO": 0
};
exports.watch = {
    "scrollOffset": {
        handler: function () {
            this.scrollOffsetData = this.scrollOffset / this.length * 100;
        },
        "immediate": true
    }
};
exports.computed = {
    "size": function () {
        return this.client / this.length * 100 + "%";
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
                _this.scrollOffsetDataO += _this.direction === "v" ? oy : ox;
                var p = _this.scrollOffsetDataO / (_this.direction === "v" ? rectHeight : rectWidth);
                _this.scrollOffsetData = p * 100;
                _this.$emit("update:scrollOffset", _this.length * p);
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.scrollOffsetDataO = this.direction === "v" ? r.top - rect.top : r.left - rect.left;
    }
};
