"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = exports.watch = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
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
    'background': '',
    'padding': '',
    'value': '',
    'label': '',
    'inputValue': ''
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isEditable': function () {
        return clickgo.tool.getBoolean(this.editable);
    },
    'opMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.methods = {
    updateInputValue: function (value) {
        this.inputValue = value;
        this.value = this.inputValue;
        this.$emit('update:modelValue', this.value);
    },
    updateModelValue: function (value) {
        this.value = value;
        if (this.isEditable && (value === '')) {
            return;
        }
        this.inputValue = value;
        this.$emit('update:modelValue', value);
    },
    listItemClick: function () {
        clickgo.form.hidePop();
    }
};
exports.mounted = function () {
    clickgo.dom.watchStyle(this.$el, ['font', 'line-height', 'background', 'color', 'padding'], (n, v) => {
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
};
