export let props = {
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

export let watch = {
    'modelValue': {
        'handler': function(this: IVControl): void {
            this.value = this.modelValue;
        },
        'immediate': true
    },
    'isEditable': {
        'handler': function(this: IVControl, editable: boolean): void {
            if (editable) {
                this.inputValue = this.value;
            }
        },
        'immediate': true
    }
};

export let data = {
    'background': '',
    'padding': '',

    'value': '',
    'label': '',
    'inputValue': ''
};

export let computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isEditable': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.editable);
    },
    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export let methods = {
    updateInputValue: function(this: IVControl, value: string): void {
        this.inputValue = value;
        this.value = this.inputValue;
        this.$emit('update:modelValue', this.value);
    },
    updateModelValue: function(this: IVControl, value: string): void {
        this.value = value;
        if (this.isEditable && (value === '')) {
            return;
        }
        this.inputValue = value;
        this.$emit('update:modelValue', value);
        // --- 隐藏 pop ---
        if (this.$refs.list) {
            let pop = clickgo.dom.findParentByData(this.$refs.list.$el, 'cg-pop');
            clickgo.form.hidePop(pop);
        }
    }
};

export let mounted = function(this: IVControl): void {
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
