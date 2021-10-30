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
    'isEditable': {
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
    'inputValue': '',
    'doInput': false
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isEditable': function () {
        return clickgo.tool.getBoolean(this.editable);
    }
};
exports.methods = {
    updateModelValue: function (value) {
        this.value = value;
        if (!this.doInput) {
            this.inputValue = value;
            this.$emit('update:modelValue', value);
            return;
        }
        else {
            this.doInput = false;
        }
    },
    input: function () {
        this.doInput = true;
        this.value = this.inputValue;
        this.$emit('update:modelValue', this.value);
    }
};
