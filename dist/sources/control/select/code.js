"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'modelValue': '',
            'editable': false,
            'data': []
        };
        this.background = '';
        this.padding = '';
        this.value = '';
        this.label = '';
        this.inputValue = '';
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get isEditable() {
        return clickgo.tool.getBoolean(this.props.editable);
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    updateInputValue(value) {
        this.inputValue = value;
        this.value = this.inputValue;
        this.emit('update:modelValue', this.value);
    }
    updateModelValue(value) {
        this.value = value;
        if (this.isEditable && (value === '')) {
            return;
        }
        this.inputValue = value;
        this.emit('update:modelValue', value);
    }
    updateLabel(label) {
        this.label = label;
        this.emit('label', label);
    }
    listItemClick() {
        clickgo.form.hidePop();
    }
    onMounted() {
        this.watch('modelValue', () => {
            this.value = this.props.modelValue;
        }, {
            'immediate': true
        });
        this.watch('isEditable', (editable) => {
            if (editable) {
                this.inputValue = this.value;
            }
        }, {
            'immediate': true
        });
        clickgo.dom.watchStyle(this.element, ['background', 'padding'], (n, v) => {
            switch (n) {
                case 'background': {
                    this.background = v;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);
    }
}
exports.default = default_1;
