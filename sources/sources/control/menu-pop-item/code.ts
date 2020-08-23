export let props = {
    'disabled': {
        'default': false
    },

    'text': {
        'default': ''
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
    'value': {
        'default': undefined
    }
};

export let data = {
    'popOpen': false,
    'showArrow': false
};

export let watch = {
    'type': function(this: IVue): void {
        if (this.type) {
            ++this.$parent.hasTypeItemsCount;
        }
        else {
            --this.$parent.hasTypeItemsCount;
        }
    }
};

export let methods = {
    mousein: function(this: IVue): void {
        if (this.popOpen) {
            return;
        }
        // --- 判断别的是否有展开 ---
        for (let item of this.$parent.$children) {
            if (!item.popOpen) {
                continue;
            }
            clickgo.form.hidePop(item.$children[0]);
            break;
        }
        // --- 如果本 item 没有子 pop，则不展开 ---
        if (this.$children.length === 0) {
            return;
        }
        clickgo.form.showPop(this.$children[0], this.$el, 1);
    },
    click: function(this: IVueControl, event: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        if (this.type === undefined) {
            if (!this.showArrow) {
                clickgo.form.hidePop();
            }
            this.cgTap(event);
            return;
        }
        // --- 有 type ---
        if (this.type === 'radio') {
            this.$emit('input', this.label);
        }
        else if (this.type === 'check') {
            this.$emit('input', this.value ? false : true);
        }
        clickgo.form.hidePop();
        this.cgTap(event);
    }
};

export let mounted = function(this: IVue): void {
    // --- 子 pop ---
    if (this.$children.length > 0) {
        this.showArrow = true;
        ++this.$parent.hasSubItemsCount;
    }
    // --- type ---
    if (this.type) {
        ++this.$parent.hasTypeItemsCount;
    }
};

export let destroyed = function(this: IVue): void {
    // --- 子 pop ---
    if (this.showArrow) {
        --this.$parent.hasSubItemsCount;
    }
    // --- type ---
    if (this.type) {
        --this.$parent.hasTypeItemsCount;
    }
};
