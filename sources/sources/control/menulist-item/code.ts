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
    'direction': 'h',
    'menulist': undefined
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
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
        if (this.isDisabled) {
            return;
        }
        if (!this.type) {
            if (!this.cgSelfPop) {
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
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.isDisabled) {
            return;
        }
        this.cgShowPop('h');
    },
    down: function(this: IVueControl, e: TouchEvent): void {
        this.cgDown(e);
        if (this.isDisabled) {
            return;
        }
        this.cgShowPop('h');
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

export let beforeUnmounted = function(this: IVueControl): void {
    if (!this.menulist) {
        return;
    }
    // --- type ---
    if (this.type) {
        --this.menulist.hasTypeItemsCount;
    }
};
