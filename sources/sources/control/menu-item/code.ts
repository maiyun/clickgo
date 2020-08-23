export let props = {
    'disabled': {
        'default': false
    },

    'text': {
        'default': ''
    },
    'alt': {
        'default': undefined
    }
};

export let data = {
    'popOpen': false
};

export let methods = {
    showPop: function(this: IVueControl, event: MouseEvent): void {
        if (this.popOpen) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.$children[0], this.$el);
        this.cgTap(event);
    },
    mousein: function(this: IVue, event: MouseEvent): void {
        if (clickgo.tool.siblings(this.$el, 'cg-pop-open')) {
            clickgo.form.hidePop();
            this.showPop(event);
        }
    }
};
