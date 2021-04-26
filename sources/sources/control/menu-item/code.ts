export let props = {
    'disabled': {
        'default': false
    },

    'alt': {
        'default': undefined
    }
};

export let data = {
    'popOpen': false,
    'selfPop': undefined,

    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};

export let methods = {
    enter: function(this: IVueControl, e: MouseEvent): void {
        this.cgEnter(e);
        if (this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            // --- 如果当前是者禁用状态，不管 ---
            return;
        }
        if (!this.$parent?.itemPopShowing) {
            // --- 别的没有展开，则不管 ---
            return;
        }
        this.showPop();
    },
    click: function(this: IVueControl, event: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        if (this.popOpen) {
            // --- 本来是展开状态，就隐藏起来 ---
            clickgo.form.hidePop(this);
            this.cgTap(event);
            return;
        }
        this.showPop();
        this.cgTap(event);
    },

    showPop: function(this: IVueControl): void {
        if (this.popOpen) {
            // --- 本来就是展开状态，不做处理 ---
            return;
        }
        if (!this.$parent) {
            return;
        }
        // --- 判断别的 item 是否有展开（parent 是 menu） ---
        // --- click 状态当然不可能别的有展开，但 enter 状态就有可能了 ---
        if (this.$parent.itemPopShowing) {
            clickgo.form.hidePop(this.$parent.itemPopShowing);
        }
        // --- 显示本 pop  ---
        this.$parent.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, 'v');
    },
    hidePop: function(this: IVueControl): void {
        // --- hidePop 方法不能直接调用，是由 clickgo.form.hidePop 的回调调用的 ---
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (this.$parent?.itemPopShowing === this) {
            this.$parent.itemPopShowing = undefined;
        }
        if (this.selfPop?.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};

export let unmounted = function(this: IVueControl): void {
    // --- 如果自己还在上层显示，则取消 ---
    if (this.$parent && (this === this.$parent.itemPopShowing)) {
        clickgo.form.hidePop(this);
    }
};
