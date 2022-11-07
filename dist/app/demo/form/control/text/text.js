"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.value = '';
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.multi = false;
        this.disabled = false;
        this.readonly = false;
        this.long = false;
        this.password = false;
        this.wrap = true;
        this.menu = false;
        this.gesture = false;
        this.lineHeight = 1;
        this.fontSize = 12;
        this.border = 'solid';
        this.background = undefined;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.length = 0;
        this.clientHeight = 0;
        this.clientWidth = 0;
    }
    longClick() {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong';
        this.long = !this.long;
        this.scrollTop = 0;
    }
    scrollborder(e) {
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
}
exports.default = default_1;
