export let props = {
    "disabled": {
        "default": false
    },
    "focus": {
        "default": false
    },

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
    "direction": {
        "default": "h"
    },
    "flex": {
        "default": ""
    },

    "area": {
        "default": "all"
    },
    "value": {
        "default": 0
    }
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

export let data = {
    "popOpen": false
};

export let methods = {
    showPop: function(this: IVue, event: MouseEvent): void {
        if (this.popOpen) {
            ClickGo.hidePop();
            return;
        }
        let pop: IVue | null = null;
        for (let item of this.$children) {
            if (item.$data._controlName !== "greatselect-pop") {
                continue;
            }
            pop = item;
            break;
        }
        if (pop) {
            pop.widthData = this.$el.offsetWidth;
            ClickGo.showPop(pop, this.$el);
        }
        this._tap(event);
    }
};

