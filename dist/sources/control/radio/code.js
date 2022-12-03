"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'value': '',
            'modelValue': ''
        };
        this.isSpaceDown = false;
    }
    click() {
        this.emit('update:modelValue', this.props.value);
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup() {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.click();
    }
}
exports.default = default_1;
