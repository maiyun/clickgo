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
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent && this.$slots.contextmenu) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
            });
        }
    }
};
