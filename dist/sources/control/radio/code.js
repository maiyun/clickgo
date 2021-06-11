"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
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
exports.methods = {
    keydown: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        this.click(e);
    },
    click: function (e) {
        this.cgTap(e);
        this.$emit('update:modelValue', this.value);
    }
};
