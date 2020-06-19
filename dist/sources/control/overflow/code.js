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
    "_direction": undefined
};
exports.computed = {
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
exports.watch = {
    "scrollOffset": {
        handler: function () {
            if (this.direction === "v") {
                this.$refs.wrap.scrollTop = this.scrollOffset;
            }
            else {
                this.$refs.wrap.scrollLeft = this.scrollOffset;
            }
        }
    }
};
exports.methods = {
    scroll: function () {
        this.$emit("update:scrollOffset", this.direction === "v" ? this.$refs.wrap.scrollTop : this.$refs.wrap.scrollLeft);
    },
    wheel: function (e) {
        if (this.direction === "v") {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        e.preventDefault();
        this.$refs.wrap.scrollLeft += e.deltaY;
    },
};
exports.mounted = function () {
    var _this = this;
    ClickGo.watchSize(this.$refs.wrap, function () {
        _this.$emit("resize", _this.direction === "v" ? _this.$refs.wrap.clientHeight : _this.$refs.wrap.clientWidth);
    });
    this.$emit("resize", this.direction === "v" ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth);
    ClickGo.watchElement(this.$refs.wrap, function () {
        _this.$emit("change", _this.direction === "v" ? _this.$refs.wrap.scrollHeight : _this.$refs.wrap.scrollWidth);
    });
    this.$emit("change", this.direction === "v" ? this.$refs.wrap.scrollHeight : this.$refs.wrap.scrollWidth);
    if (this.direction === "v") {
        this.$refs.wrap.scrollTop = this.scrollOffset;
    }
    else {
        this.$refs.wrap.scrollLeft = this.scrollOffset;
    }
};
