export let props = {
    "disabled": {
        "default": false
    },

    "text": {
        "default": ""
    },
    "alt": {
        "default": undefined
    }
};

export let data = {
    "popOpen": false
};

export let methods = {
    showPop: function(this: IVue, event: MouseEvent): void {
        if (this.popOpen) {
            ClickGo.hidePop();
            return;
        }
        ClickGo.showPop(this.$children[0], this.$el);
        this._tap(event);
    },
    mousein: function(this: IVue, event: MouseEvent): void {
        if (ClickGo.siblings(this.$el, "cg-pop-open")) {
            ClickGo.hidePop();
            this.showPop(event);
        }
    }
};

