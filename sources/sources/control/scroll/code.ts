export let props = {
    "disabled": {
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
    "flex": {
        "default": ""
    },
    "direction": {
        "default": "v"
    },

    "length": {
        "default": 1000
    },
    "client": {
        "default": 100
    },
    "scrollOffset": {
        "default": 0
    }
};

export let data = {
    "scrollOffsetData": 0,
    "scrollOffsetDataO": 0
};

export let watch = {
    "scrollOffset": {
        handler: function(this: IVue): void {
            this.scrollOffsetData = this.scrollOffset / this.length * 100;
        },
        "immediate": true
    }
};

export let computed = {
    "size": function(this: IVue): string {
        return this.client / this.length * 100 + "%";
    }
};

export let methods = {
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        let r = this.$refs.block.getBoundingClientRect();
        let rectWidth = 0, rectHeight = 0;
        let rect = ClickGo.bindMove(e, {
            "object": this.$refs.block,
            "offsetObject": this.$refs.bar,
            "move": (ox, oy, x, y) => {
                this.scrollOffsetDataO += this.direction === "v" ? oy : ox;
                let p = this.scrollOffsetDataO / (this.direction === "v" ? rectHeight : rectWidth);
                this.scrollOffsetData = p * 100;
                this.$emit("update:scrollOffset", this.length * p);
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.scrollOffsetDataO = this.direction === "v" ? r.top - rect.top : r.left - rect.left;
    }
};

