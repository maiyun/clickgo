"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updated = exports.watch = exports.computed = exports.data = exports.props = void 0;
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
    "tabPosition": {
        "default": "top"
    },
    "value": {
        "default": 0
    },
    "name": {
        "default": undefined
    }
};
exports.data = {
    "tabs": [],
    "selectedIndex": 0
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
exports.watch = {
    "value": {
        handler: function () {
            this.selectedIndex = this.value;
        },
        "immediate": true
    }
};
exports.updated = function () {
    var i;
    for (i = 0; i < this.$slots.default.length; ++i) {
        var item = this.$slots.default[i].componentInstance;
        if (this.tabs[i]) {
            if (this.tabs[i].label !== item.label) {
                this.tabs[i].label = item.label;
            }
            if (this.tabs[i].name !== item.name) {
                this.tabs[i].name = item.name;
            }
            if (item.index !== i) {
                item.index = i;
            }
        }
        else {
            this.tabs.push({
                "label": item.label,
                "name": item.name
            });
            item.index = i;
        }
    }
    if (i < this.tabs.length) {
        this.tabs.splice(i);
        if (this.selectedIndex >= this.tabs.length) {
            this.selectedIndex = this.tabs.length - 1;
        }
    }
};
