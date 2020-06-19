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
        "default": "v"
    },

    "scrollOffset": {
        "default": 0
    }
};

export let data = {
    "scrollOffsetEmit": 0,

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
    "scrollOffset": {
        handler: function(this: IVue): void {
            let so = parseInt(this.scrollOffset);
            if (so === this.scrollOffsetEmit) {
                return;
            }
            if (this.direction === "v") {
                this.$refs.wrap.scrollTop = this.scrollOffset;
            } else {
                this.$refs.wrap.scrollLeft = this.scrollOffset;
            }
        }
    }
};

export let methods = {
    scroll: function(this: IVue): void {
        let scroll = this.direction === "v" ? this.$refs.wrap.scrollTop : this.$refs.wrap.scrollLeft;
        if (scroll < 0) {
            return;
        }
        if (scroll > (this.direction === "v" ? (this.$refs.wrap.scrollHeight - this.$refs.wrap.clientHeight) : (this.$refs.wrap.scrollWidth - this.$refs.wrap.clientWidth))) {
            return;
        }
        this.scrollOffsetEmit = scroll;
        this.$emit("update:scrollOffset", this.scrollOffsetEmit);
    },
    wheel: function(this: IVue, e: WheelEvent): void {
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        if (this.direction === "v") {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        e.preventDefault();
        this.$refs.wrap.scrollLeft += e.deltaY;
    },
};

export let mounted = function(this: IVue): void {
    ClickGo.watchSize(this.$refs.wrap, () => {
        this.$emit("resize", this.direction === "v" ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth);
    });
    this.$emit("resize", this.direction === "v" ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth);

    ClickGo.watchElement(this.$refs.wrap, () => {
        this.$emit("change", this.direction === "v" ? this.$refs.wrap.scrollHeight : this.$refs.wrap.scrollWidth);
    });
    this.$emit("change", this.direction === "v" ? this.$refs.wrap.scrollHeight : this.$refs.wrap.scrollWidth);

    if (this.direction === "v") {
        this.$refs.wrap.scrollTop = this.scrollOffset;
    } else {
        this.$refs.wrap.scrollLeft = this.scrollOffset;
    }
};

