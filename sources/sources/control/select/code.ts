export let props = {
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

export let watch = {
    'modelValue': {
        'handler': function(this: IVueControl): void {
            this.value = this.modelValue;
        },
        'immediate': true
    },
    'editableComp': {
        'handler': function(this: IVueControl, editable: boolean): void {
            if (editable) {
                this.inputValue = this.value;
            }
        },
        'immediate': true
    }
};

export let data = {
    'cgNest': true,

    'value': '',
    'label': '',
    'inputValue': ''
};

export let computed = {
    'editableComp': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.editable);
    }
};

export let methods = {
    updateModelValue: function(this: IVueControl, value: string): void {
        this.value = value;
        this.inputValue = value;
        this.$emit('update:modelValue', value);
    }
};
