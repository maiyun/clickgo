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
        "default": 30
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
    "padding": {
        "default": undefined
    },
    "flex": {
        "default": ""
    },

    "value": {
        "default": undefined
    },
    "list": {
        "default": []
    }
};

export let data = {
    "valueData": "",

    "_direction": undefined
};

export let watch = {
    "value": {
        handler: function(this: IVue): void {
            this.valueData = this.value ?? "";
        },
        "immediate": true
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

export let methods = {
    input: function(this: IVue): void {
        this.$emit("input", this.valueData);
    }
};

