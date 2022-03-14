"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'value': '',
    'selectionStart': 0,
    'selectionEnd': 0,
    'multi': false,
    'disabled': false,
    'readonly': false,
    'long': false,
    'password': false,
    'wrap': true,
    'menu': false,
    'lineHeight': 1,
    'fontSize': 12,
    'border': 'solid',
    'background': undefined,
    'scrollLeft': 0,
    'scrollTop': 0,
    'length': 0,
    'clientHeight': 0,
    'clientWidth': 0
};
exports.methods = {
    longClick: function () {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong';
        this.long = !this.long;
        this.scrollTop = 0;
    }
};
