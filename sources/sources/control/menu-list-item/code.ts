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
    'modelValue': {
        'default': undefined
    }
};

export let data = {
    'popOpen': false,
    'subPop': undefined,
    'showArrow': false,

    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};

export let watch = {
    'type': {
        handler: function(this: IVue): void {
            if (!this.$parent) {
                return;
            }
            if (this.type) {
                ++this.$parent.hasTypeItemsCount;
            }
            else {
                --this.$parent.hasTypeItemsCount;
            }
        },
        'immediate': false
    }
};

export let updated = function(this: IVueControl): void {
    if (this.$parent) {
        // --- 检测是否显示箭头（是否有子 pop） ---
        if (this.cgSlos().length > 0) {
            if (!this.showArrow) {
                this.showArrow = true;
                ++this.$parent.hasSubItemsCount;
            }
        }
        else {
            if (this.showArrow) {
                this.showArrow = false;
                --this.$parent.hasSubItemsCount;
            }
        }
    }
};

export let methods = {
    click: function(this: IVueControl, event: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        if (!this.type) {
            if (!this.showArrow) {
                clickgo.form.hidePop();
            }
            this.cgTap(event);
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
        this.cgTap(event);
    },
    mousein: function(this: IVueControl): void {
        if (this.disabled) {
            // --- 如果当前是者禁用状态，不管 ---
            return;
        }
        this.showPop();
    },

    showPop: function(this: IVueControl): void {
        if (this.popOpen) {
            // --- 本来就是展开状态，不做处理 ---
            return;
        }
        if (!this.$parent) {
            return;
        }
        // --- 判断别的 item 是否有展开（parent 是 menu list） ---
        if (this.$parent.itemPopShowing) {
            clickgo.form.hidePop(this.$parent.itemPopShowing);
        }
        // --- 如果本 item 没有子 pop，则不展开 ---
        let list = this.cgSlos();
        if (list.length === 0) {
            return;
        }
        this.$parent.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, 'h');
    },
    hidePop: function(this: IVueControl): void {
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (this.$parent?.itemPopShowing === this) {
            this.$parent.itemPopShowing = undefined;
        }
        if (this.subPop?.itemPopShowing) {
            this.subPop.itemPopShowing.hidePop();
        }
    }
};

export let mounted = function(this: IVue): void {
    if (this.$parent) {
        if (this.type) {
            ++this.$parent.hasTypeItemsCount;
        }
    }
};

export let unmounted = function(this: IVue): void {
    if (this.$parent) {
        // --- 子 pop ---
        if (this.showArrow) {
            --this.$parent.hasSubItemsCount;
        }
        // --- type ---
        if (this.type) {
            --this.$parent.hasTypeItemsCount;
        }
        // --- 如果自己还在上层显示，则取消 ---
        if (this === this.$parent.itemPopShowing) {
            clickgo.form.hidePop(this);
        }
    }
};
