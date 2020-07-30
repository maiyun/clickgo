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
    "editable": {
        "default": true
    },
    "data": {
        "default": []
    }
};

export let data = {
    "valueData": "",
    "wrapFocus": false,
    "inputFocus": false
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
    },

    "editableComp": function(this: IVue): boolean {
        if (typeof this.editable === "boolean") {
            return this.editable;
        }
        return this.editable === "true" ? true : false;
    }
};

export let methods = {
    input: function(this: IVue): void {
        this.$emit("input", this.valueData);
    },
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.stopPropagation(e);
        this._down();
    }
};

export let mounted = function(this: IVue): void {
    ClickGo.appendToPop(this.$refs.pop);
};

export let destroyed = function(this: IVue): void {
    ClickGo.removeFromPop(this.$refs.pop);
};

