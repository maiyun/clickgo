"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = void 0;
exports.data = {
    'select': ''
};
exports.computed = {
    'globalLocal': function () {
        return clickgo.core.config.local;
    }
};
exports.methods = {
    'change': function () {
        clickgo.core.config.local = this.select;
    }
};
exports.mounted = function () {
    this.select = clickgo.core.config.local;
};
