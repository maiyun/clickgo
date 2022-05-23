import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
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

export const computed = {
    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export const watch = {
    'modelValue': {
        handler: function(this: types.IVControl): void {
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
        handler: function(this: types.IVControl): void {
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

export const data = {
    'value': false,
    'indeterminateData': false,

    'isKeyDown': false
};

export const methods = {
    click: function(this: types.IVControl): void {
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.$emit('update:indeterminate', this.indeterminateData);
        }
        else {
            this.value = !this.value;
            this.$emit('update:modelValue', this.value);
        }
    },
    keydown: function(this: types.IVControl, e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    },
    keyup: function(this: types.IVControl): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click();
    }
};
