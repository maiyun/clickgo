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
    "flex": {
        "default": ""
    },
    "padding": {
        "default": undefined
    }
};
exports.methods = {
    keydown: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        this.$emit("tap");
    },
    down: function (e) {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.stopPropagation(e);
        this._down();
    }
};
