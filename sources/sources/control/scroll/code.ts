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
            this.scrollOffsetData = parseInt(this.scrollOffset);
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        },
        "immediate": true
    }
};

export let computed = {
    // --- 滑块长度 ---
    "size": function(this: IVue): string {
        if (this.client >= this.length) {
            return "100%";
        }
        return this.client / this.length * 100 + "%";
    },
    // --- 滑块距离起始位置的百分比 ---
    "scrollOffsetPer": function(this: IVue): number {
        return this.scrollOffsetData / this.length * 100;
    },
    // --- 最大可拖动的 scroll 位置 ---
    "maxScroll": function(this: IVue): number {
        let maxScroll = 0;
        if (this.length > this.client) {
            maxScroll = this.length - this.client;
        }
        return maxScroll;
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
                this.scrollOffsetData = Math.round(this.length * (this.scrollOffsetPx / (this.direction === "v" ? rectHeight : rectWidth)));
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            }
        });
        rectWidth = rect.right - rect.left;
        rectHeight = rect.bottom - rect.top;
        this.scrollOffsetPx = this.direction === "v" ? r.top - rect.top : r.left - rect.left;
    },
    bardown: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        let offset = (this.direction === "v" ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX)) * ClickGo.rzoom;
        let barR = this.$refs.bar.getBoundingClientRect();
        let blockR = this.$refs.block.getBoundingClientRect();
        if (this.direction === "v") {
            let offsetTop = offset - blockR.height / 2;
            if (offsetTop < barR.top) {
                offsetTop = barR.top;
            }
            if (offsetTop + blockR.height > barR.top + barR.height) {
                offsetTop = barR.top + barR.height - blockR.height;
            }
            let marginTop = offsetTop - barR.top;
            this.$refs.block.style.marginTop = marginTop + "px";
            this.scrollOffsetData = Math.round(this.length * ((offsetTop - barR.top) / barR.height));
        } else {
            let offsetLeft = offset - blockR.width / 2;
            if (offsetLeft < barR.left) {
                offsetLeft = barR.left;
            }
            if (offsetLeft + blockR.width > barR.left + barR.width) {
                offsetLeft = barR.left + barR.width - blockR.width;
            }
            let marginLeft = offsetLeft - barR.left;
            this.$refs.block.style.marginLeft = marginLeft + "px";
            this.scrollOffsetData = Math.round(this.length * ((offsetLeft - barR.left) / barR.width));
        }
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

export let destroyed = function(this: IVue): void {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};

