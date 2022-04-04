"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = void 0;
exports.data = {
    'select': ''
};
exports.computed = {
    'globalLocale': function () {
        return clickgo.core.config.locale;
    }
};
exports.methods = {
    'change': function () {
        clickgo.core.config.locale = this.select;
    }
};
const mounted = function () {
    this.select = clickgo.core.config.locale;
};
exports.mounted = mounted;
