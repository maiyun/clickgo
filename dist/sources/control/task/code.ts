export let props = {
    'position': {
        'default': 'bottom'
    }
};

export let methods = {
    down: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, (e) => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    contextmenu: async function(this: IVControl, e: MouseEvent): Promise<void> {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, e);
    }
};
