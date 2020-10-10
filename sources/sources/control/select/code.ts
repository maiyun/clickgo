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
        },
        'deep': true
    },
    'modelValue': {
        handler: function(this: IVue): void {
            if (this.valueData === this.modelValue) {
                return;
            }
            this.valueData = this.modelValue;
            for (let i = 0; i < this.dataComp.length; ++i) {
                if (this.dataComp[i].value !== this.modelValue) {
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

function listToData(o: any, child: boolean = false): any[] {
    let data: any[] = [];
    if (Array.isArray(o)) {
        for (let item of o) {
            if (typeof item === 'string') {
                data.push({
                    'label': item,
                    'value': item,
                    'child': child
                });
            }
            else {
                data.push({
                    'label': item.label ?? item.value ?? '',
                    'value': item.value ?? item.label ?? '',
                    'disabled': item.disabled,
                    'title': item.children ? true : false,
                    'child': child
                });
                if (item.children) {
                    data = data.concat(listToData(item.children, true));
                }
            }
        }
    }
    else {
        for (let k in o) {
            let item = o[k];
            data.push({
                'label': item.label ?? item.value ?? k,
                'value': item.value ?? k,
                'disabled': item.disabled,
                'title': item.children ? true : false,
                'child': child
            });
            if (item.children) {
                data = data.concat(listToData(item.children, true));
            }
        }
    }
    return data;
}
export let computed = {
    'editableComp': function(this: IVue): boolean {
        if (typeof this.editable === 'boolean') {
            return this.editable;
        }
        return this.editable === 'true' ? true : false;
    },
    'dataComp': function(this: IVue): any {
        console.log('xx', listToData(this.data));
        return listToData(this.data);
    }
};

export let methods = {
    updateValue: function(this: IVue, index: number): void {
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
