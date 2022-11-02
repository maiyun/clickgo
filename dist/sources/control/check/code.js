"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.value = false;
        this.indeterminateData = false;
        this.isKeyDown = false;
        this.props = {
            'disabled': false,
            'modelValue': undefined,
            'indeterminate': undefined
        };
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    click() {
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.emit('update:indeterminate', this.indeterminateData);
        }
        else {
            this.value = !this.value;
            this.emit('update:modelValue', this.value);
        }
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
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.props.modelValue;
            }
            if (this.indeterminateData && !this.value) {
                this.indeterminateData = false;
                this.emit('update:indeterminate', this.indeterminateData);
            }
        }, {
            'immediate': true
        });
        this.watch('indeterminate', () => {
            if (this.props.indeterminate !== undefined) {
                this.indeterminateData = this.props.indeterminate;
            }
            if (!this.value && this.indeterminateData) {
                this.value = true;
                this.emit('update:modelValue', this.value);
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;
