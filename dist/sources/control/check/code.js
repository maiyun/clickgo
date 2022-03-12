"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.watch = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
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
    'indeterminateData': false,
    'isKeyDown': false
};
exports.methods = {
    click: function () {
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.$emit('update:indeterminate', this.indeterminateData);
        }
        else {
            this.value = !this.value;
            this.$emit('update:modelValue', this.value);
        }
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
