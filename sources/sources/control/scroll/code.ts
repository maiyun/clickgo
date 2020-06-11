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
    "scrollOffsetPx": 0,
    "scrollOffsetData": 0,

    "timer": undefined,
    "tran": false
};

export let watch = {
    "scrollOffset": {
        handler: function(this: IVue): void {
            this.scrollOffsetData = parseInt(this.scrollOffset);
        },
        "immediate": true
    }
};

export let computed = {
    // --- 滑块长度 ---
    "size": function(this: IVue): string {
        return this.client / this.length * 100 + "%";
    },
    // --- 滑块距离起始位置的百分比 ---
    "scrollOffsetPer": function(this: IVue): number {
        let maxOffset = this.length - this.client;
        if (this.scrollOffsetData > maxOffset) {
            this.scrollOffsetData = maxOffset;
            this.$emit("update:scrollOffset", this.scrollOffsetData);
        }
        return this.scrollOffsetData / this.length * 100;
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
                this.scrollOffsetPx += this.direction === "v" ? oy : ox;
                this.scrollOffsetData = Math.round(this.length * this.scrollOffsetPx / (this.direction === "v" ? rectHeight : rectWidth));
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.scrollOffsetPx = this.direction === "v" ? r.top - rect.top : r.left - rect.left;
    },
    longDown: function(this: IVue, e: MouseEvent | TouchEvent, type: "start" | "end"): void {
        ClickGo.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    clearInterval(this.timer);
                }
                this.tran = true;
                this.timer = setInterval(() => {
                    if (type === "start") {
                        if (this.scrollOffsetData - 20 < 0) {
                            this.scrollOffsetData = 0;
                        } else {
                            this.scrollOffsetData -= 20;
                        }
                    } else {
                        let maxOffset = this.length - this.client;
                        if (this.scrollOffsetData + 20 > maxOffset) {
                            this.scrollOffsetData = maxOffset;
                        } else {
                            this.scrollOffsetData += 20;
                        }
                    }
                    this.$emit("update:scrollOffset", this.scrollOffsetData);
                }, 50);
            },
            up: () => {
                this.tran = false;
                if (this.timer !== undefined) {
                    clearInterval(this.timer);
                    this.timer = undefined;
                }
            }
        });
    }
};

export let destroyed = function(this: IVue): void {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};

