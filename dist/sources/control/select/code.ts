import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
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

export const watch = {
    'modelValue': {
        'handler': function(this: types.IVControl): void {
            this.value = this.modelValue;
        },
        'immediate': true
    },
    'isEditable': {
        'handler': function(this: types.IVControl, editable: boolean): void {
            if (editable) {
                this.inputValue = this.value;
            }
        },
        'immediate': true
    }
};

export const data = {
    'background': '',
    'padding': '',

    'value': '',
    'label': '',
    'inputValue': ''
};

export const computed = {
    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isEditable': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.editable);
    },
    'opMargin': function(this: types.IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export const methods = {
    updateInputValue: function(this: types.IVControl, value: string): void {
        this.inputValue = value;
        this.value = this.inputValue;
        this.$emit('update:modelValue', this.value);
    },
    updateModelValue: function(this: types.IVControl, value: string): void {
        this.value = value;
        if (this.isEditable && (value === '')) {
            return;
        }
        this.inputValue = value;
        this.$emit('update:modelValue', value);
    },
    updateLabel: function(this: types.IVControl, label: string): void {
        this.label = label;
        this.$emit('label', label);
    },
    listItemClick: function(this: types.IVControl): void {
        clickgo.form.hidePop();
    }
};

export const mounted = function(this: types.IVControl): void {
    clickgo.dom.watchStyle(this.$el, ['background', 'padding'], (n, v) => {
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
