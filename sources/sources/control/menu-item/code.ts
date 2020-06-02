export let props = {
    "disabled": {
        "default": false
    },
    "focus": {
        "default": false
    },

    "text": {
        "default": ""
    },
    "alt": {
        "default": undefined
    }
};

export let methods = {
    showPop: function(this: IVue): void {
        this.$parent.focus = true;
        if (!this.$children[0] || !this.$children[0].setPropData) {
            return;
        }
        let r = this.$el.getBoundingClientRect();
        this.$children[0].setPropData("left", r.left);
        this.$children[0].setPropData("top", r.top + r.height);
        this.$children[0].$el.style.display = "block";
    },
    hidePop: function(this: IVue): void {
        /*
        this.$parent.focus = false;
        if (!this.$children[0] || !this.$children[0].setPropData) {
            return;
        }
        this.$children[0].$el.style.display = "";
        */
    },
    mousein: function(this: IVue): void {
        if (this.$parent.focus) {
            this.$el.focus();
        }
    }
};

export let mounted = function(this: IVue): void {
    ClickGo.appendToPop(this.$children[0].$el);
};

export let destroyed = function(this: IVue): void {
    ClickGo.removeFromPop(this.$children[0].$el);
};

