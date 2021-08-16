export let props = {
    'position': {
        'default': 'bottom'
    }
};

export let methods = {
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        // --- 不使别的窗体丢掉焦点 ---
        e.stopPropagation();
        e.preventDefault();
        clickgo.form.hidePop();
        // --- 长按弹出 menu ---
        if (e instanceof MouseEvent) {
            return;
        }
        if ((e.target === this.$refs.wrap) || (e.target === this.$refs.task) || (e.target === this.$refs.tray)) {
            clickgo.dom.bindLong(e, () => {
                this.cgShowPop(e);
            });
        }
    },
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if ((e.target === this.$refs.wrap) || (e.target === this.$refs.task) || (e.target === this.$refs.tray)) {
            this.cgShowPop(e);
        }
    }
};
