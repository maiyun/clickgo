export let props = {
    'disabled': {
        'default': false
    },
    'padding': {
        'default': undefined
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
    'selfPop': undefined,
    'direction': 'h',
    'menulist': undefined,

    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};

export let watch = {
    'type': {
        handler: function(this: IVueControl): void {
            let menulist = this.menulist ?? this.cgFindParent('menulist');
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
    click: function(this: IVueControl, e: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        if (!this.type) {
            if (!this.selfPop) {
                // --- 没有下层，则隐藏所有 pop ---
                clickgo.form.hidePop();
            }
            this.cgTap(e);
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
        this.cgTap(e);
    },
    enter: function(this: IVueControl, e: MouseEvent): void {
        this.cgEnter(e);
        if (this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        this.showPop();
    },
    down: function(this: IVueControl, e: TouchEvent): void {
        this.cgDown(e);
        if (this.disabled) {
            return;
        }
        this.showPop();
    },

    showPop: function(this: IVueControl): void {
        if (this.popOpen) {
            // --- 本来就是展开状态，不做处理 ---
            return;
        }
        if (!this.menulist) {
            return;
        }
        // --- 判断别的 item 是否有展开 ---
        if (this.menulist.itemPopShowing) {
            clickgo.form.hidePop(this.menulist.itemPopShowing);
        }
        // --- 显示本 pop ---
        if (this.selfPop) {
            this.menulist.itemPopShowing = this;
            this.popOpen = true;
            this.popOptions = clickgo.form.showPop(this, 'h');
        }
    },
    hidePop: function(this: IVueControl): void {
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (!this.menulist) {
            return;
        }
        if (this.menulist.itemPopShowing === this) {
            this.menulist.itemPopShowing = undefined;
        }
        if (this.selfPop?.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};

export let mounted = function(this: IVueControl): void {
    let menulist = this.cgFindParent('menulist');
    if (!menulist) {
        return;
    }
    this.menulist = menulist;
    if (this.type) {
        ++menulist.hasTypeItemsCount;
    }
};

export let unmounted = function(this: IVueControl): void {
    if (!this.menulist) {
        return;
    }
    // --- type ---
    if (this.type) {
        --this.menulist.hasTypeItemsCount;
    }
    // --- 如果自己还在上层显示，则取消 ---
    if (this === this.menulist.itemPopShowing) {
        clickgo.form.hidePop(this);
    }
};
