"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        this.lineValue = 10;
        this.lineCount = 2;
        this.sLeft1 = 0;
        this.sTop1 = 0;
        this.l1 = 0;
        this.c1 = 0;
        this.sLeft2 = 0;
        this.sTop2 = 0;
        this.l2 = 0;
        this.c2 = 0;
        this.sLeft3 = 0;
        this.sTop3 = 0;
        this.l3 = 0;
        this.c3 = 0;
        this.sLeft4 = 0;
        this.sTop4 = 0;
        this.l4 = 0;
        this.c4 = 0;
        this.direction = false;
        this.dir5 = 'v';
        this.sLeft5 = 0;
        this.sTop5 = 0;
        this.l5 = 0;
        this.c5 = 0;
        this.line5 = 10;
        this.c6 = 0;
        this.gesture = false;
        this.style = false;
        this.selection = false;
        this.area = {};
    }
    scrollborder(e, dir) {
        if (!this.gesture) {
            return;
        }
        let dirs = [];
        switch (dir) {
            case 'h': {
                dirs = ['left', 'right'];
                break;
            }
            default: {
                dirs = ['top', 'bottom'];
                break;
            }
        }
        clickgo.dom.bindGesture(e, {
            'dirs': dirs,
            'handler': (dir) => {
                switch (dir) {
                    case 'left':
                    case 'top': {
                        this.lineCount -= 10;
                        if (this.lineCount < 0) {
                            this.lineCount = 0;
                        }
                        break;
                    }
                    default: {
                        this.lineCount += this.lineValue;
                    }
                }
            }
        });
    }
}
exports.default = default_1;
