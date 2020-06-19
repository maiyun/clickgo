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
    "direction": {
        "default": "h"
    },
    "flex": {
        "default": "1"
    },
    "gutter": {
        "default": undefined
    },
    "align-h": {
        "default": undefined
    },
    "align-v": {
        "default": undefined
    }
};

export let data = {
    "_direction": undefined
};

export let watch = {
    "direction": function(this: IVue): void {
        for (let item of this.$children) {
            item.$data._direction = this.direction;
        }
    }
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

export let mounted = function(this: IVue): void {
    for (let item of this.$children) {
        item.$data._direction = this.direction;
    }
};

