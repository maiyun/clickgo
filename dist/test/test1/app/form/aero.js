"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
var count = 0;
exports.data = {
    "resize": true,
    "max": false,
    "resizeButtonClickCount": 0
};
exports.methods = {
    resizeMethod: function () {
        this.resize = !this.resize;
        ++count;
        this.resizeButtonClickCount = count;
    },
    maxMethod: function () {
        this.max = !this.max;
    }
};
