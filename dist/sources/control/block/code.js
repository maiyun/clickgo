"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computed = exports.props = void 0;
exports.props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    },
    "flex": {
        "default": ""
    }
};
exports.computed = {
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
