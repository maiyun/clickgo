export let props = {
    'disabled': {
        'default': false
    },

    'alt': {
        'default': undefined
    }
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export let methods = {
    enter: function(this: IVueControl, e: MouseEvent): void {
        this.cgEnter(e);
        if (this.isDisabled) {
            // --- 如果当前是者禁用状态，不管 ---
            return;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.cgParentPopLayer.cgChildPopItemShowing) {
            // --- 别的没有展开，则不管 ---
            return;
        }
        this.cgShowPop('v');
    },
    click: function(this: IVueControl, e: MouseEvent): void {
        if (this.isDisabled) {
            return;
        }
        this.cgTap(e);
        if (this.cgSelfPopOpen) {
            // --- 本来是展开状态，就隐藏起来 ---
            this.cgHidePop();
            return;
        }
        this.cgShowPop('v');
    }
};
