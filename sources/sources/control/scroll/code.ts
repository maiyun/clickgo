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
    "barLengthPx": 0,
    "barLengthSizePx": 0,

    "timer": undefined,
    "tran": false,

    "_direction": undefined
};

export let watch = {
    "length": {
        handler: function(this: IVue): void {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        }
    },
    "client": {
        handler: function(this: IVue): void {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        }
    },
    "scrollOffset": {
        handler: function(this: IVue): void {
            this.scrollOffsetData = Math.round(this.scrollOffset);
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            } else if (this.scrollOffsetData < 0) {
                this.scrollOffsetData = 0;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        },
        "immediate": true
    }
};

export let computed = {
    // --- 滑块长度 ---
    "size": function(this: IVue): number {
        if (this.client >= this.length) {
            return this.barLengthPx;
        }
        let size = this.client / this.length * (this.barLengthPx - this.barLengthSizePx);
        if (size < 5) {
            this.barLengthSizePx = 5 - size;
            size = 5;
        } else {
            this.barLengthSizePx = 0;
        }
        return size;
    },
    // --- 滑块已经滚动的位置 ---
    "scrollOffsetPx": function(this: IVue): number {
        return this.scrollOffsetData / this.length * (this.barLengthPx - this.barLengthSizePx);
    },
    // --- 最大可拖动的 scroll 位置 ---
    "maxScroll": function(this: IVue): number {
        return (this.length > this.client) ? Math.round(this.length - this.client) : 0;
    },

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
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        let px = this.scrollOffsetPx;
        ClickGo.bindMove(e, {
            "object": this.$refs.block,
            "offsetObject": this.$refs.bar,
            "move": (ox, oy, x, y) => {
                px += this.direction === "v" ? oy : ox;
                this.scrollOffsetData = Math.round(px / (this.barLengthPx - this.barLengthSizePx) * this.length);
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        });
    },
    bardown: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        let barRect = this.$refs.bar.getBoundingClientRect();
        let barOffset = this.direction === "v" ? barRect.top : barRect.left;
        /** --- 鼠标点击在 bar 中的位置 --- */
        let eOffset = (this.direction === "v" ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX)) * ClickGo.rzoom;
        eOffset = eOffset - barOffset;

        let px = eOffset - this.size / 2;
        if (px < 0) {
            px = 0;
        }
        if (px + this.size > (this.barLengthPx - this.barLengthSizePx)) {
            px = this.barLengthPx - this.barLengthSizePx - this.size;
        }
        this.scrollOffsetData = Math.round(px / (this.barLengthPx - this.barLengthSizePx) * this.length);
        this.$emit("update:scrollOffset", this.scrollOffsetData);
        this.down(e);
    },
    longDown: function(this: IVue, e: MouseEvent | TouchEvent, type: "start" | "end"): void {
        if (this.client >= this.length) {
            return;
        }
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

export let mounted = function(this: IVue): void {
    ClickGo.watchSize(this.$refs.bar, (size) => {
        this.barLengthPx = this.direction === "v" ? this.$refs.bar.offsetHeight : this.$refs.bar.offsetWidth;
    });
    this.barLengthPx = this.direction === "v" ? this.$refs.bar.offsetHeight : this.$refs.bar.offsetWidth;

    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};

export let destroyed = function(this: IVue): void {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};

