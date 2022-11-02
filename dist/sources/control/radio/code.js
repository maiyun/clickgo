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
        this.isKeyDown = false;
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
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
            this.isKeyDown = true;
        }
    }
    keyup() {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click();
    }
}
exports.default = default_1;
