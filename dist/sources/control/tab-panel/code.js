"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    "label": {
        "default": ""
    }
};
exports.data = {
    "index": -1
};
exports.computed = {
    "showTab": function () {
        return this.$parent.selectedIndex === this.index;
    }
};
exports.watch = {
    "showTab": function () {
        if (this.showTab) {
            this.$emit("show");
        }
        else {
            this.$emit("hide");
        }
    }
};
