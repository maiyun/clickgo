import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
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

export const computed = {
    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export const data = {
    'isKeyDown': false
};

export const methods = {
    click: function(this: types.IVControl): void {
        this.$emit('update:modelValue', this.value);
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
