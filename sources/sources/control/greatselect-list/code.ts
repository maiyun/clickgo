export let props = {
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

    'same': {
        'default': false
    },

    'data': {
        'default': []
    },
    'modelValue': {
        'default': 0
    }
};

export let data = {
    'itemPopShowing': undefined,
    'direction': 'v'
};

export let computed = {
    'widthPx': function(this: IVueControl): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVueControl): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let watch = {
    'data': {
        handler: function(this: IVueControl): void {
            if (this.data[this.modelValue] !== undefined) {
                return;
            }
            this.select();
        },
        'deep': true
    }
};

export let methods = {
    select: function(this: IVueControl, value?: string | number): void {
        // --- 检查 value 是否合法 ---
        if (value && this.data[value]) {
            this.$emit('update:modelValue', value);
            return;
        }
        // --- 选择第一个 ---
        if (Array.isArray(this.data)) {
            this.$emit('update:modelValue', 0);
        }
        else {
            for (let k in this.data) {
                this.$emit('update:modelValue', k);
                break;
            }
        }
    }
};

export let mounted = function(this: IVueControl): void {
    if (this.$parent?.popOpen !== undefined) {
        this.$parent.subPop = this;
    }
};

export let unmounted = function(this: IVueControl): void {
    if (this.$parent?.subPop === this) {
        this.$parent.subPop = null;
    }
};
