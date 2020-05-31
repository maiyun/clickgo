"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
