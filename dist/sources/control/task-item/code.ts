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

export let computed = {
    'isSelected': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.opened);
    },
    'isMulti': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },
    'position': function(this: IVControl): string {
        return this.cgParentByName('task')?.position ?? 'bottom';
    }
};

export let methods = {
    click: function(this: IVControl): void {
        if (!this.$slots.pop) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
    },
    contextmenu: async function(this: IVControl, e: MouseEvent): Promise<void> {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
    },
    down: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            // --- 是否要隐藏 ---
            if (e instanceof MouseEvent && e.button === 2) {
                // --- 点击鼠标右键 ---
                if (this.$el.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
            else {
                if (this.$refs.contextmenu?.dataset.cgOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                if (this.$refs.pop?.dataset.cgOpen !== undefined) {
                    clickgo.form.hidePop();
                }
                clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
            });
        }
    }
};
