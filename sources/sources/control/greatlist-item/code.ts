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

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export let methods = {
    click: function(this: IVueControl, e: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop(); // --- 此条主要用于 greatlist 的 pop 里，选定了就要隐藏 pop ---
        if (!clickgo.dom.isMouseAlsoTouchEvent(e)) {
            // --- 本身 touch、或没发生 touch ---
            // --- 也就是纯鼠标事件不响应（电脑模式不响应） ---
            return;
        }
        let greatlist = this.cgParentByName('greatlist');
        if (!greatlist) {
            return;
        }
        greatlist.itemClick = true;
        // --- 手机 ---
        if (greatlist.multi) {
            greatlist.select(this.value, e.shiftKey, true);
        }
        else {
            greatlist.select(this.value, e.shiftKey, e.ctrlKey);
        }
    },
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        this.cgParentByName('greatlist')?.cgShowPop(e);
    },
    down: function(this: IVueControl, e: TouchEvent | MouseEvent): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        if (this.cgParentByName('greatlist')) {
            this.cgParentByName('greatlist').itemDown = true;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
        else if (this.cgParentPopLayer.cgChildPopItemShowing) {
            // --- 判断别的 item 是否有展开 ---
            this.cgParentPopLayer.cgChildPopItemShowing.cgHidePop();
        }
        if (e instanceof MouseEvent) {
            // --- 选择 ---
            this.cgParentByName('greatlist')?.select(this.value, e.shiftKey, e.ctrlKey);
        }
        else {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                this.cgParentByName('greatlist')?.select(this.value, e.shiftKey, e.ctrlKey);
                this.cgParentByName('greatlist')?.showPop(e);
            });
        }
    },

    controlClick: function(this: IVueControl, e: MouseEvent): void {
        if (this.disabled) {
            return;
        }
        if (this.cgParentByName('greatlist')) {
            this.cgParentByName('greatlist').itemClick = true;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            // --- 手机的话选择（电脑已经在 down 事件中选择过了） ---
            this.cgParentByName('greatlist')?.select(this.value, e.shiftKey, e.ctrlKey);
        }
        if (this.cgSelfPopOpen) {
            // --- 本来是展开状态，就隐藏起来 ---
            this.cgHidePop();
            return;
        }
        this.cgShowPop(e);
    },
    controlContextmenu: function(this: IVueControl, e: MouseEvent): void {
        // --- 用于屏蔽 greatlist 的 pop ---
        e.stopPropagation();
        e.preventDefault();
    },
    controlDown: function(this: IVueControl, e: TouchEvent | MouseEvent): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.disabled) {
            return;
        }
        if (this.cgParentByName('greatlist')) {
            this.cgParentByName('greatlist').itemDown = true;
        }
        if (e instanceof MouseEvent) {
            this.cgParentByName('greatlist')?.select(this.value, e.shiftKey, e.ctrlKey);
        }
    }
};
