export const props = {
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

export const data = {
    'padding': '',
    'isKeyDown': false
};

export const computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },

    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export const methods = {
    keydown: function(this: IVControl, e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click('arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    },
    keyup: function(this: IVControl): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click('arrow');
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

export const mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
