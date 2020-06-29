export let props = {
    "label": {
        "default": ""
    }
};

export let data = {
    "index": 0,
    "selectedIndex": 0
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
    this.index = ClickGo.getIndex(this.$el);
    this.$parent.tabs[this.index] = {
        "label": this.label,
        "name": this.name
    };
    if (this.$parent.selectedIndex !== undefined) {
        this.selectedIndex = this.$parent.selectedIndex;
    }
};

export let beforeDestroy = function(this: IVue): void {
    this.$parent.tabs.splice(ClickGo.getIndex(this.$el), 1);
};

