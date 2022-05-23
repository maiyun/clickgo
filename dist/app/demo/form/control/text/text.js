"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
const clickgo = require("clickgo");
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
    'gesture': false,
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
    },
    scrollborder: function (e) {
        if (!this.gesture) {
            return;
        }
        clickgo.dom.bindGesture(e, {
            'dirs': this.multi ? ['top', 'bottom'] : ['left', 'right'],
            'handler': (dir) => {
                switch (dir) {
                    case 'left':
                    case 'top': {
                        this.value = this.value.slice(0, -1);
                        break;
                    }
                    default: {
                        this.value += 'A';
                    }
                }
            }
        });
    }
};
