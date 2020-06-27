export let props = {
    "label": {
        "default": ""
    }
};

export let watch = {
    "label": {
        handler: function(this: IVue): void {
            this.$parent.tabs[ClickGo.getIndex(this.$el)] = {
                "label": this.label,
                "name": this.name
            };
        }
    }
};

export let mounted = function(this: IVue): void {
    this.$parent.tabs[ClickGo.getIndex(this.$el)] = {
        "label": this.label,
        "name": this.name
    };
};

export let beforeDestroy = function(this: IVue): void {
    this.$parent.tabs.splice(ClickGo.getIndex(this.$el), 1);
};

