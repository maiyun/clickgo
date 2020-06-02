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
    }
};
exports.data = {
    "leftData": 0,
    "topData": 0,
    "qq": 1
};
exports.watch = {
    "left": {
        handler: function () {
            this.leftData = parseInt(this.left);
        },
        "immediate": true
    },
    "top": {
        handler: function () {
            this.topData = parseInt(this.top);
        },
        "immediate": true
    }
};
exports.methods = {
    setPropData: function (name, val, mode) {
        if (mode === void 0) { mode = ""; }
        if (this[name + "Data"] === undefined || this[name] === undefined) {
            return;
        }
        if (mode === "") {
            this[name + "Data"] = val;
        }
        else if (mode === "+") {
            this[name + "Data"] += val;
        }
        else {
            this[name + "Data"] -= val;
        }
        this.$emit("update:" + name, this[name + "Data"]);
    }
};
