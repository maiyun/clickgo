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
    }
};

export let data = {
    "leftData": 0,
    "topData": 0,
    "qq": 1
};

export let watch = {
    "left": {
        handler: function(this: IVue): void {
            this.leftData = parseInt(this.left);
        },
        "immediate": true
    },
    "top": {
        handler: function(this: IVue): void {
            this.topData = parseInt(this.top);
        },
        "immediate": true
    }
};

export let methods = {
    setPropData: function(this: IVue, name: string, val: number, mode: string = ""): void {
        if (this[name + "Data"] === undefined || this[name] === undefined) {
            return;
        }
        if (mode === "") {
            this[name + "Data"] = val;
        } else if (mode === "+") {
            this[name + "Data"] += val;
        } else {
            this[name + "Data"] -= val;
        }
        this.$emit("update:" + name, this[name + "Data"]);
    }
};

