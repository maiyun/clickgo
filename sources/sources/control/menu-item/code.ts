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
    "controlName": "menu-item",
    "popOpen": false
};

export let methods = {
    showPop: function(this: IVue, event: MouseEvent): void {
        if (this.popShow) {
            return;
        }
        let r = this.$el.getBoundingClientRect();
        ClickGo.showPop(this.$children[0], r.left, r.top + r.height);
        this.tap(event);
    },
    mousein: function(this: IVue, event: MouseEvent): void {
        if (ClickGo.siblings(this.$el, "cg-pop-open")) {
            ClickGo.hidePop();
            this.showPop(event);
        }
    }
};

export let mounted = function(this: IVue): void {
    ClickGo.appendToPop(this.$children[0].$el);
};

export let destroyed = function(this: IVue): void {
    ClickGo.removeFromPop(this.$children[0].$el);
};

