export let props = {
    'disabled': {
        'default': false
    },

    'width': {
        'default': undefined
    },
    'height': {
        'default': 30
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

export let data = {
    'valueData': 0,
    'valueIndex': 0
};

export let watch = {
    'data': {
        handler: function(this: IVue): void {
            if (this.dataComp[this.valueIndex]) {
                return;
            }
            // --- 没找到 ---
            this.valueIndex = this.dataComp.length - 1;
            if (!this.editable) {
                this.valueData = this.valueIndex >= 0 ? this.dataComp[this.valueIndex].value : '';
                this.$emit('update:modelValue', this.valueData);
            }
        }
    },
    'modelValue': {
        handler: function(this: IVue): void {
            if (this.valueData === this.value) {
                return;
            }
            this.valueData = this.value;
            for (let i = 0; i < this.dataComp.length; ++i) {
                if (this.dataComp[i].value !== this.value) {
                    continue;
                }
                this.valueIndex = i;
                return;
            }
            // --- 没找到 ---
            this.valueIndex = 0;
            if (!this.editable) {
                this.valueData = this.dataComp[0] ? this.dataComp[0].value : '';
                this.$emit('update:modelValue', this.valueData);
            }
        },
        'immediate': true
    }
};

export let computed = {
    'editableComp': function(this: IVue): boolean {
        if (typeof this.editable === 'boolean') {
            return this.editable;
        }
        return this.editable === 'true' ? true : false;
    },
    'dataComp': function(this: IVue): any {
        let data = [];
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].value) {
                data[i] = this.data[i];
                continue;
            }
            data[i] = {
                'value': this.data[i]
            };
        }
        return data;
    }
};

export let methods = {
    input: function(this: IVue, index: number): void {
        this.valueIndex = index;
        this.valueData = this.dataComp[index] ? this.dataComp[index].value : '';
        this.$emit('update:modelValue', this.valueData);
    },
    tinput: function(this: IVue): void {
        this.valueData = this.$refs.input.value;
        this.$emit('update:modelValue', this.valueData);
        for (let i = 0; i < this.dataComp.length; ++i) {
            if (this.dataComp[i].value !== this.valueData) {
                continue;
            }
            this.valueIndex = i;
            return;
        }
        // --- 没找到 ---
        this.valueIndex = 0;
    }
};
