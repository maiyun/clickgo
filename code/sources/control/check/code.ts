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

    'modelValue': {
        'default': undefined
    },
    'indeterminate': {
        'default': undefined
    }
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export let watch = {
    'modelValue': {
        handler: function(this: IVueControl): void {
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
        handler: function(this: IVueControl): void {
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

export let data = {
    'value': false,
    'indeterminateData': false
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
