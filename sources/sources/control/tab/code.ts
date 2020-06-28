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
    "direction": {
        "default": "h"
    },

    "value": {
        "default": 0
    }
};

export let data = {
    "tabs": [],
    "selectedIndex": 0,

    "_direction": undefined
};

export let computed = {
    "widthPx": function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + "px";
        }
        if (this.flex !== "") {
            return this.$data._direction ? (this.$data._direction === "v" ? undefined : "0") : undefined;
        }
    },
    "heightPx": function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + "px";
        }
        if (this.flex !== "") {
            return this.$data._direction ? (this.$data._direction === "v" ? "0" : undefined) : undefined;
        }
    }
};

export let watch = {
    "tabs": function(this: IVue): void {
        this.tabs.splice(this.$refs.panels.children.length);
    },
    "value": {
        handler: function(this: IVue): void {
            this.selectedIndex = this.value;
        },
        "immediate": true
    },
    "selectedIndex": {
        handler: function(this: IVue): void {
            for (let item of this.$children) {
                item.selectedIndex = this.selectedIndex;
            }
        },
        "immediate": true
    }
};

export let mounted = function(this: IVue): void {
    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};

