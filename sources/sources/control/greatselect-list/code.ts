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
    'widthPx': function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let methods = {
    select: function(this: IVue, index: number): void {
        this.$emit('update:modelValue', index);
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
