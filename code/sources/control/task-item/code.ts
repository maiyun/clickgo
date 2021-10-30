export let props = {
    'selected': {
        'default': false
    },
    'opened': {
        'default': false
    },
    'multi': {
        'default': false
    }
};

export let data = {
    'menu': 'left'
};

export let computed = {
    'isSelected': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.opened);
    },
    'isMulti': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },
    'position': function(this: IVueControl): string {
        return this.cgParent?.position ?? 'bottom';
    }
};

export let methods = {
    tap: function(this: IVueControl, e: MouseEvent): void {
        this.cgTap(e);
        this.menu = 'left';
        if (!this.$slots.pop) {
            return;
        }
        this.cgCreateTimer(() => {
            this.cgShowPop('v');
        }, 100);
    },
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        this.menu = 'right';
        this.cgCreateTimer(() => {
            this.cgShowPop(e);
        }, 100);
    },
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        clickgo.dom.bindLong(e, () => {
            this.menu = 'right';
            this.cgCreateTimer(() => {
                this.cgShowPop(e);
            }, 100);
        });
    }
};
