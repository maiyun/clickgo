export let props = {
    'disabled': {
        'default': false
    },
    'direction': {
        'default': 'h'
    },

    'padding': {
        'default': undefined
    },

    'value': {
        'default': ''
    }
};

export let data = {
    'popOpen': false,
    'selfPop': undefined,
    'greatlist': undefined,

    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};

export let methods = {
    click: function(this: IVueControl, e: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop();
        if (!this.cgHasTouch) {
            // --- 电脑不响应本事件 ---
            return;
        }
        // --- 手机 ---
        this.greatlist.itemClick = true;
        if (this.greatlist.multi) {
            this.greatlist.select(this.value, e.shiftKey, true);
        }
        else {
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        this.greatlist.showPop(e);
    },
    down: function(this: IVueControl, e: TouchEvent | MouseEvent): void {
        if (e instanceof MouseEvent && this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        this.greatlist.itemDown = true;
        if (this.popOpen) {
            clickgo.form.hidePop(this);
        }
        else if (this.greatlist.itemPopShowing) {
            // --- 判断别的 item 是否有展开 ---
            clickgo.form.hidePop(this.greatlist.itemPopShowing);
        }
        if (e instanceof MouseEvent) {
            // --- 选择 ---
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
        else {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
                this.greatlist.showPop(e);
            });
        }
    },

    controlClick: function(this: IVueControl, e: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        this.greatlist.itemClick = true;
        if (this.cgHasTouch) {
            // --- 手机的话选择（电脑已经在 down 事件中选择过了） ---
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
        if (this.popOpen) {
            // --- 本来是展开状态，就隐藏起来 ---
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop(e);
    },
    controlContextmenu: function(this: IVueControl, e: MouseEvent): void {
        // --- 用于屏蔽 greatlist 的 pop ---
        e.stopPropagation();
        e.preventDefault();
    },
    controlDown: function(this: IVueControl, e: TouchEvent | MouseEvent): void {
        if (e instanceof MouseEvent && this.cgHasTouch) {
            return;
        }
        if (this.disabled) {
            return;
        }
        this.greatlist.itemDown = true;
        if (e instanceof MouseEvent) {
            this.greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },

    showPop: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (this.popOpen) {
            // --- 本来就是展开状态，不做处理 ---
            return;
        }
        // --- 判断别的 item 是否有展开 ---
        if (this.greatlist.itemPopShowing) {
            clickgo.form.hidePop(this.greatlist.itemPopShowing);
        }
        // --- 所以直接显示本 pop  ---
        this.greatlist.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, e instanceof MouseEvent ? e.clientX : e.touches[0].clientX, e instanceof MouseEvent ? e.clientY : e.touches[0].clientY);
    },
    hidePop: function(this: IVueControl): void {
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (this.greatlist.itemPopShowing === this) {
            this.greatlist.itemPopShowing = undefined;
        }
        if (this.selfPop?.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};

export let mounted = function(this: IVueControl): void {
    let greatlist = this.cgFindParent('greatlist');
    if (!greatlist) {
        return;
    }
    this.greatlist = greatlist;
};

export let unmounted = function(this: IVueControl): void {
    // --- 如果自己还在上层显示，则取消 ---
    if (this === this.greatlist.itemPopShowing) {
        clickgo.form.hidePop(this);
    }
};
