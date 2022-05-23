"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.computed = exports.props = void 0;
const clickgo = require("clickgo");
exports.props = {
    'disabled': {
        'default': false
    },
    'value': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.data = {
    'isKeyDown': false
};
exports.methods = {
    click: function () {
        this.$emit('update:modelValue', this.value);
    },
    keydown: function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    },
    keyup: function () {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click();
    }
};
