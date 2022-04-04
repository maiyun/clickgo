export const props = {
    'disabled': {
        'default': false
    },

    'type': {
        'default': 'default'
    },
    'plain': {
        'default': false
    },
    'checked': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
    },

    'area': {
        'default': 'all'
    }
};

export const computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isPlain': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.plain);
    },
    'isChecked': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.checked);
    },
    'isAreaAll': function(this: IVControl): boolean {
        return this.$slots.pop ? this.area === 'all' : true;
    },
    'isChildFocus': function(this: IVControl): boolean {
        return this.innerFocus || this.arrowFocus;
    },

    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export const data = {
    'padding': '',

    'isKeyDown': false,

    'innerFocus': false,
    'arrowFocus': false
};

export const methods = {
    keydown: function(this: IVControl, e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.area === 'all') {
                this.innerClick(e);
                if (!this.$slots.pop) {
                    this.$el.click();
                }
            }
            else {
                if (this.innerFocus) {
                    this.innerClick(e);
                    this.$el.click();
                }
                else {
                    this.arrowClick(e);
                }
            }
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    },
    keyup: function(this: IVControl, e: KeyboardEvent): void {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        if (this.area === 'all') {
            this.innerClick(e);
            if (!this.$slots.pop) {
                this.$el.click();
            }
        }
        else {
            if (this.innerFocus) {
                this.innerClick(e);
                this.$el.click();
            }
            else {
                this.arrowClick(e);
            }
        }
    },

    innerClick: function(this: IVControl, e: MouseEvent): void {
        if (!this.$slots.pop || (this.area === 'arrow')) {
            return;
        }
        e.stopPropagation();
        // --- 检测是否显示 pop ---
        if (this.$el.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
        }
        else {
            clickgo.form.hidePop(this.$el);
        }
    },

    arrowClick: function(this: IVControl, e: MouseEvent): void {
        e.stopPropagation();
        if (this.area === 'all') {
            if (this.$el.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
            }
            else {
                clickgo.form.hidePop(this.$el);
            }
        }
        else {
            if (this.$refs.arrow.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.$refs.arrow, this.$refs.pop, 'v');
            }
            else {
                clickgo.form.hidePop(this.$refs.arrow);
            }
        }
    }
};

export const mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
