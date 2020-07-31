export let props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    },
    "left": {
        "default": 0
    },
    "top": {
        "default": 0
    },
    "zIndex": {
        "default": 0
    },
    "flex": {
        "default": ""
    },
    "tabPosition": {
        "default": "top"
    },

    "value": {
        "default": 0
    },
    "name": {
        "default": undefined
    }
};

export let data = {
    "tabs": [],
    "selectedIndex": 0
};

export let computed = {
    "widthPx": function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + "px";
        }
        if (this.flex !== "") {
            return this.$parent.direction ? (this.$parent.direction === "v" ? undefined : "0") : undefined;
        }
    },
    "heightPx": function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + "px";
        }
        if (this.flex !== "") {
            return this.$parent.direction ? (this.$parent.direction === "v" ? "0" : undefined) : undefined;
        }
    }
};

export let watch = {
    "value": {
        handler: function(this: IVue): void {
            this.selectedIndex = this.value;
        },
        "immediate": true
    }
};

export let updated = function(this: IVue): void {
    let i;
    for (i = 0; i < this.$slots.default.length; ++i) {
        let item: IVue = this.$slots.default[i].componentInstance;
        if (this.tabs[i]) {
            if (this.tabs[i].label !== item.label) {
                this.tabs[i].label = item.label;
            }
            if (this.tabs[i].name !== item.name) {
                this.tabs[i].name = item.name;
            }
            if (item.index !== i) {
                item.index = i;
            }
        } else {
            this.tabs.push({
                "label": item.label,
                "name": item.name
            });
            item.index = i;
        }
    }
    if (i < this.tabs.length) {
        this.tabs.splice(i);
        if (this.selectedIndex >= this.tabs.length) {
            this.selectedIndex = this.tabs.length - 1;
        }
    }
};

