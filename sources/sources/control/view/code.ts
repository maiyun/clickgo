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

    "timer": false
};

export let methods = {
    wheel: function(this: IVue, e: WheelEvent): void {
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        // --- 屏蔽 touch 时的惯性动画 ---
        this.timer = false;

        let wrapRect = this.$refs.wrap.getBoundingClientRect();
        let innerRect = this.$refs.inner.getBoundingClientRect();
        let max = this.direction === "v" ? -innerRect.height + wrapRect.height : -innerRect.width + wrapRect.width;

        if (this.direction === "v") {
            this.scrollOffsetData -= e.deltaY === 0 ? e.deltaX : e.deltaY;
        } else {
            this.scrollOffsetData -= e.deltaX === 0 ? e.deltaY : e.deltaX;
        }
        if (this.scrollOffsetData > 0) {
            this.scrollOffsetData = 0;
        } else if (this.scrollOffsetData < max) {
            this.scrollOffsetData = max;
        }
        this.$emit("update:scrollOffset", Math.round(Math.abs(this.scrollOffsetData)));
    },
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        this.timer = false;

        let wrapRect = this.$refs.wrap.getBoundingClientRect();
        let innerRect = this.$refs.inner.getBoundingClientRect();
        /** --- 内容超出像素 --- */
        let over = this.direction === "v" ? innerRect.height - wrapRect.height : innerRect.width - wrapRect.width;
        // --- 最大边缘 ---
        let maxOffset = this.direction === "v" ? -innerRect.height + wrapRect.height : -innerRect.width + wrapRect.width;
        /** --- 最后一次偏移的像素 --- */
        let lastO = 0;
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "left": this.direction === "v" ? wrapRect.left : wrapRect.left - over,
            "right": this.direction === "v" ? wrapRect.right : wrapRect.right + over,
            "top": this.direction === "h" ? wrapRect.top : wrapRect.top - over,
            "bottom": this.direction === "h" ? wrapRect.top : wrapRect.bottom + over,
            "move": (ox, oy) => {
                this.scrollOffsetData += this.direction === "v" ? oy : ox;
                this.$emit("update:scrollOffset", Math.round(Math.abs(this.scrollOffsetData)));
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
                    this.scrollOffsetData += speed;
                    if (this.scrollOffsetData > 0) {
                        this.timer = false;
                        this.scrollOffsetData = 0;
                        this.$emit("update:scrollOffset", Math.round(Math.abs(this.scrollOffsetData)));
                        return;
                    } else if (this.scrollOffsetData < maxOffset) {
                        this.timer = false;
                        this.scrollOffsetData = maxOffset;
                        this.$emit("update:scrollOffset", Math.round(Math.abs(this.scrollOffsetData)));
                        return;
                    }
                    this.$emit("update:scrollOffset", Math.round(Math.abs(this.scrollOffsetData)));

                    this.timer && requestAnimationFrame(animation);
                };
                animation();
            }
        });
    }
};

export let destroyed = function(this: IVue): void {
    this.timer = false;
};

