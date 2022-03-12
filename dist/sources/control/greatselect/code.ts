export let props = {
    'disabled': {
        'default': false
    },

    'direction': {
        'default': 'h'
    },

    'area': {
        'default': 'all'
    },
    'pop': {
        'default': 'greatlist'
    },

    'data': {
        'default': []
    },
    'modelValue': {
        'default': -1
    }
};

export let data = {
    'padding': ''
};

export let computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },

    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export let methods = {
    keydown: function(this: IVControl, e: KeyboardEvent): void {
        if (e.key !== 'Enter') {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$el);
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'size': {
                'width': this.$el.offsetWidth
            }
        });
    },
    click: function(this: IVControl, e: MouseEvent, area: 'left' | 'arrow'): void {
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$el);
            return;
        }
        if (this.area === 'arrow' && area === 'left') {
            // --- 当前只能箭头展开，并且点击的还是不能展开的左侧 ---
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'size': {
                'width': this.$el.offsetWidth
            }
        });
    },
    updateModelValue: function(this: IVControl, val: number): void {
        this.$emit('update:modelValue', val);
    },
    itemclick: function(this: IVControl, e: MouseEvent, arrow: boolean): void {
        if (arrow) {
            return;
        }
        clickgo.form.hidePop();
    }
};

export let mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
