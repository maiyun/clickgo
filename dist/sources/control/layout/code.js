"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.computed = exports.watch = exports.data = exports.props = void 0;
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
    "direction": {
        "default": "h"
    },
    "flex": {
        "default": ""
    },
    "gutter": {
        "default": undefined
    },
    "align-h": {
        "default": undefined
    },
    "align-v": {
        "default": undefined
    }
};
exports.data = {
    "_direction": undefined
};
exports.watch = {
    "direction": function () {
        for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
            var item = _a[_i];
            item.$data._direction = this.direction;
        }
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
exports.mounted = function () {
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};
