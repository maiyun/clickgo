"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.watch = exports.computed = exports.props = void 0;
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
    'modelValue': {
        'default': undefined
    },
    'indeterminate': {
        'default': undefined
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.watch = {
    'modelValue': {
        handler: function () {
            if (this.modelValue !== undefined) {
                this.value = this.modelValue;
            }
            if (this.indeterminateData && !this.value) {
                this.indeterminateData = false;
                this.$emit('update:indeterminate', this.indeterminateData);
            }
        },
        'immediate': true
    },
    'indeterminate': {
        handler: function () {
            if (this.indeterminate !== undefined) {
                this.indeterminateData = this.indeterminate;
            }
            if (!this.value && this.indeterminateData) {
                this.value = true;
                this.$emit('update:modelValue', this.value);
            }
        },
        'immediate': true
    }
};
exports.data = {
    'value': false,
    'indeterminateData': false
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
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.$emit('update:indeterminate', this.indeterminateData);
        }
        else {
            this.value = !this.value;
            this.$emit('update:modelValue', this.value);
        }
    }
};
