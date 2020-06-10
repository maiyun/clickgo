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
    "valueData": ""
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
exports.methods = {
    input: function () {
        this.$emit("input", this.valueData);
    }
};
