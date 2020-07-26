"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
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
    "editable": {
        "default": true
    },
    "data": {
        "default": []
    }
};
exports.data = {
    "valueData": "",
    "wrapFocus": false,
    "inputFocus": false,
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
    },
    "editableComp": function () {
        if (typeof this.editable === "boolean") {
            return this.editable;
        }
        return this.editable === "true" ? true : false;
    }
};
exports.methods = {
    input: function () {
        this.$emit("input", this.valueData);
    },
    down: function (e) {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.stopPropagation(e);
        this._down();
    }
};
exports.mounted = function () {
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
    ClickGo.appendToPop(this.$refs.pop);
};
exports.destroyed = function () {
    ClickGo.removeFromPop(this.$refs.pop);
};
