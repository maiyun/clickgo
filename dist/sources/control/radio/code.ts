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

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
export let methods = {
    keydown: function(this: IVueControl, e: KeyboardEvent): void {
        if (e.keyCode !== 13) {
            return;
        }
        this.click(e);
    },
    click: function(this: IVueControl, e: MouseEvent): void {
        this.cgTap(e);
        this.$emit('update:modelValue', this.value);
    }
};
