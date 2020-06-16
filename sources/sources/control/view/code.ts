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
    "_needDown": true,

    "scrollOffsetData": 0,
    "length": 0,
    "client": 0,

    // --- 惯性 ---
    "timer": false
};

export let watch = {
    "direction": function(this: IVue): void {
        let wrapRect = this.$refs.wrap.getBoundingClientRect();
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.client = this.direction === "v" ? wrapRect.height : wrapRect.width;
        this.length = this.direction === "v" ? innerRect.height : innerRect.width;
    },
    "scrollOffset": {
        handler: function(this: IVue): void {
            let so = parseInt(this.scrollOffset);
            let x = so - this.scrollOffsetData;
            if (x < 0.5 && x > -0.5) {
                return;
            }
            this.scrollOffsetData = so;
            this.refreshView();
        },
        "immediate": true
    }
};

export let computed = {
    // --- 最大可拖动的 scroll 位置 ---
    "maxScroll": function(this: IVue): number {
        return (this.length > this.client) ? Math.round(this.length - this.client) : 0;
    }
};

export let methods = {
    wheel: function(this: IVue, e: WheelEvent): void {
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        // --- 屏蔽 touch 时的惯性动画 ---
        this.timer = false;

        if (this.direction === "v") {
            this.scrollOffsetData += e.deltaY === 0 ? e.deltaX : e.deltaY;
        } else {
            this.scrollOffsetData += e.deltaX === 0 ? e.deltaY : e.deltaX;
        }
        this.refreshView();
    },
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.timer = false;

        let wrapRect = this.$refs.wrap.getBoundingClientRect();
        /** --- 内容超出像素 --- */
        let over = (this.length > this.client) ? (this.length - this.client) : 0;
        /** --- 最后一次偏移的像素 --- */
        let lastO = 0;
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "left": this.direction === "v" ? wrapRect.left : wrapRect.left - over,
            "right": this.direction === "v" ? wrapRect.right : wrapRect.right + over,
            "top": this.direction === "h" ? wrapRect.top : wrapRect.top - over,
            "bottom": this.direction === "h" ? wrapRect.top : wrapRect.bottom + over,
            "move": (ox, oy) => {
                this.scrollOffsetData -= this.direction === "v" ? oy : ox;
                this.$emit("update:scrollOffset", Math.round(this.scrollOffsetData));
                lastO = this.direction === "v" ? oy : ox;
            },
            "end": (time) => {
                if (time === 0) {
                    return;
                }
                let speed = (lastO / (Date.now() - time)) * 16;

                let f = 0;
                this.timer = true;

                let animation = (): void => {
                    f = Math.min(Math.abs(speed) / 32, 0.5);

                    if (speed > 0.2) {
                        speed -= f;
                    } else if(speed < -0.2) {
                        speed += f;
                    } else {
                        this.timer = false;
                        return;
                    }
                    this.scrollOffsetData -= speed;
                    if (this.scrollOffsetData > this.maxScroll) {
                        this.timer = false;
                        this.scrollOffsetData = this.maxScroll;
                        this.$emit("update:scrollOffset", Math.round(this.scrollOffsetData));
                        return;
                    } else if (this.scrollOffsetData < 0) {
                        this.timer = false;
                        this.scrollOffsetData = 0;
                        this.$emit("update:scrollOffset", Math.round(this.scrollOffsetData));
                        return;
                    }
                    this.$emit("update:scrollOffset", Math.round(this.scrollOffsetData));

                    this.timer && requestAnimationFrame(animation);
                };
                animation();
            }
        });
    },
    // --- 重置视图 scrollOffset ---
    "refreshView": function(this: IVue): void {
        if (this.scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
        } else if (this.scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
        }
        this.$emit("update:scrollOffset", Math.round(this.scrollOffsetData));
    }
};

export let mounted = function(this: IVue): void {
    let rect = ClickGo.watchSize(this.$refs.wrap, (rect) => {
        this.client = this.direction === "v" ? rect.height : rect.width;
        this.$emit("resize", Math.round(this.client));
        this.refreshView();
    });
    this.client = this.direction === "v" ? rect.height : rect.width;
    this.$emit("resize", Math.round(this.client));

    ClickGo.watchElement(this.$refs.inner, (e) => {
        this.length = this.direction === "v" ? this.$refs.inner.getBoundingClientRect().height : this.$refs.inner.getBoundingClientRect().width;
        this.$emit("change", Math.round(this.length));
        this.refreshView();
    });
    this.length = this.direction === "v" ? this.$refs.inner.getBoundingClientRect().height : this.$refs.inner.getBoundingClientRect().width;
    this.$emit("change", Math.round(this.length));
};

export let destroyed = function(this: IVue): void {
    this.timer = false;
};

