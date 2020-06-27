"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "disabled": {
        "default": false
    },
    "focus": {
        "default": false
    },
    "width": {
        "default": undefined
    },
    "height": {
        "default": 30
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
    "padding": {
        "default": undefined
    },
    "flex": {
        "default": ""
    },
    "value": {
        "default": undefined
    },
    "list": {
        "default": []
    }
};
exports.data = {
    "valueData": "",
    "_direction": undefined
};
exports.watch = {
    "value": {
        handler: function () {
            var _a;
            this.valueData = (_a = this.value) !== null && _a !== void 0 ? _a : "";
        },
        "immediate": true
    }
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
exports.methods = {
    input: function () {
        this.$emit("input", this.valueData);
    }
};
exports.mounted = function () {
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};
