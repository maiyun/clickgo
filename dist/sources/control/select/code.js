"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.data = exports.watch = exports.props = void 0;
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
        'default': undefined
    },
    'top': {
        'default': undefined
    },
    'zIndex': {
        'default': undefined
    },
    'flex': {
        'default': undefined
    },
    'padding': {
        'default': undefined
    },
    'modelValue': {
        'default': ''
    },
    'editable': {
        'default': false
    },
    'data': {
        'default': []
    }
};
exports.watch = {
    'modelValue': {
        'handler': function () {
            this.value = this.modelValue;
        },
        'immediate': true
    },
    'editableComp': {
        'handler': function (editable) {
            if (editable) {
                this.inputValue = this.value;
            }
        },
        'immediate': true
    }
};
exports.data = {
    'cgNest': true,
    'value': '',
    'label': '',
    'inputValue': ''
};
exports.computed = {
    'editableComp': function () {
        return clickgo.tool.getBoolean(this.editable);
    }
};
exports.methods = {
    updateModelValue: function (value) {
        this.value = value;
        this.inputValue = value;
        this.$emit('update:modelValue', value);
    }
};
