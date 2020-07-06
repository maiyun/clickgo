"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.watch = exports.computed = exports.data = exports.props = void 0;
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
        "default": "h"
    },
    "value": {
        "default": 0
    }
};
exports.data = {
    "tabs": [],
    "selectedIndex": 0,
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
    "tabs": function () {
        this.tabs.splice(this.$refs.panels.children.length);
    },
    "value": {
        handler: function () {
            this.selectedIndex = this.value;
        },
        "immediate": true
    },
    "selectedIndex": {
        handler: function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var item = _a[_i];
                item.selectedIndex = this.selectedIndex;
            }
        },
        "immediate": true
    }
};
exports.mounted = function () {
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};
