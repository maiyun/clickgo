export let props = {
    'disabled': {
        'default': false
    },

    'alt': {
        'default': undefined
    },
    'type': {
        'default': undefined
    },
    'label': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
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

export let watch = {
    'type': {
        handler: function(this: IVControl): void {
            let menulist = this.cgParentByName('menulist');
            if (!menulist) {
                return;
            }
            if (this.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        },
        'immediate': true
    }
};

export let methods = {
    enter: function(this: IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'h');
    },
    touchstart: function(this: IVControl): void {
        // --- 只有 touchstart 才显示，因为 PC 的 mouseenter 已经显示过了 ---
        clickgo.form.showPop(this.$el, this.$refs.pop, 'h');
    },
    click: function(this: IVControl): void {
        if (!this.type) {
            if (!this.$slots.pop) {
                // --- 没有下层，则隐藏所有 pop ---
                clickgo.form.hidePop();
            }
            return;
        }
        // --- 有 type ---
        if (this.type === 'radio') {
            this.$emit('update:modelValue', this.label);
        }
        else if (this.type === 'check') {
            this.$emit('update:modelValue', this.modelValue ? false : true);
        }
        clickgo.form.hidePop();
    }
};

export let mounted = function(this: IVControl): void {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);

    let menulist = this.cgParentByName('menulist');
    if (!menulist) {
        return;
    }
    if (this.type) {
        ++menulist.hasTypeItemsCount;
    }
};

export let beforeUnmounted = function(this: IVControl): void {
    if (!this.menulist) {
        return;
    }
    // --- type ---
    if (this.type) {
        --this.menulist.hasTypeItemsCount;
    }
};
