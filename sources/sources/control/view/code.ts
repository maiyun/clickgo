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
    "padding": {
        "default": undefined
    },

    "scrollOffset": {
        "default": 0
    }
};

export let data = {
    "scrollOffsetData": 0,
    "scrollOffsetEmit": 0,
    "length": 0,
    "client": 0,

    // --- 惯性 ---
    "tran": 0,
    "timer": undefined,

    "_direction": undefined
};

export let watch = {
    "direction": function(this: IVue): void {
        let size = ClickGo.getWatchSize(this.$refs.wrap);
        this.client = this.direction === "v" ? size.clientHeight : size.clientWidth;
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.length = this.direction === "v" ? innerRect.height : innerRect.width;
    },
    "scrollOffset": {
        handler: function(this: IVue): void {
            this.goScroll(this.scrollOffset);
        },
        "immediate": true
    }
};

export let computed = {
    // --- 最大可拖动的 scroll 位置 ---
    "maxScroll": function(this: IVue): number {
        if (this.length < this.client) {
            return 0;
        }
        return Math.round(this.length - this.client);
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
    wheel: function(this: IVue, e: WheelEvent): void {
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        // --- 屏蔽惯性动画 ---
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
        }

        if (this.direction === "v") {
            this.scrollOffsetData += Math.round(e.deltaY === 0 ? e.deltaX : e.deltaY);
        } else {
            this.scrollOffsetData += Math.round(e.deltaX === 0 ? e.deltaY : e.deltaX);
        }
        this.refreshView();
    },
    down: function(this: IVue, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }

        let wrapSize = ClickGo.getWatchSize(this.$refs.wrap);
        let top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
        let right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
        let bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
        let left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            if (this.direction === "v") {
                this.scrollOffsetData = Math.round(top - this.$refs.inner.getBoundingClientRect().top);
            } else {
                this.scrollOffsetData = Math.round(left - this.$refs.inner.getBoundingClientRect().left);
            }
            this.tran = 0;
        }

        /** --- 内容超出像素 --- */
        let over = (this.length > this.client) ? (this.length - this.client) : 0;
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "left": this.direction === "v" ? left : left - over,
            "right": this.direction === "v" ? right : right + over,
            "top": this.direction === "h" ? top : top - over,
            "bottom": this.direction === "h" ? bottom : bottom + over,
            "move": (ox, oy) => {
                this.scrollOffsetData -= Math.round(this.direction === "v" ? oy : ox);
                this.scrollOffsetEmit = this.scrollOffsetData;
                this.$emit("update:scrollOffset", this.scrollOffsetData);
            },
            "end": (moveTimes) => {
                // --- 获取 200 毫秒内的偏移 ---
                let movePos = 0;
                let topTime = 0;
                let nowDate = Date.now();
                for (let item of moveTimes) {
                    if (nowDate - item.time > 100) {
                        continue;
                    }
                    movePos += this.direction === "v" ? item.oy : item.ox;
                    if (topTime === 0 || topTime > item.time) {
                        topTime = item.time;
                    }
                }
                if (topTime === 0) {
                    return;
                }

                let speed = Math.abs(movePos / (Date.now() - topTime));
                if (speed <= 0.1) {
                    return;
                }
                this.tran = speed * 2000;
                this.$nextTick(function(this: IVue) {
                    this.timer = setTimeout(() => {
                        this.timer = undefined;
                        this.tran = 0;
                    }, this.tran);
                    if (movePos > 0) {
                        this.scrollOffsetData -= Math.round(speed * 800);
                    } else {
                        this.scrollOffsetData += Math.round(speed * 800);
                    }

                    /** --- 滑动动画向上传递 scrollOffset --- */
                    let animation = (): void => {
                        if (!this.timer) {
                            return;
                        }
                        let offset = 0;
                        let wrapSize = ClickGo.getWatchSize(this.$refs.wrap);
                        if (this.direction === "v") {
                            offset = Math.round(wrapSize.top + wrapSize.border.top + wrapSize.padding.top - this.$refs.inner.getBoundingClientRect().top);
                        } else {
                            offset = Math.round(wrapSize.left + wrapSize.border.left + wrapSize.padding.left - this.$refs.inner.getBoundingClientRect().left);
                        }
                        if (offset > this.maxScroll) {
                            offset = this.maxScroll;
                            clearTimeout(this.timer);
                            this.timer = undefined;
                            this.scrollOffsetData = offset;
                            this.tran = 0;
                        } else if (offset < 0) {
                            offset = 0;
                            clearTimeout(this.timer);
                            this.timer = undefined;
                            this.scrollOffsetData = offset;
                            this.tran = 0;
                        }
                        this.scrollOffsetEmit = offset;
                        this.$emit("update:scrollOffset", offset);
                        requestAnimationFrame(animation);
                    };
                    animation();
                });

                /*

                // --- 以下为手动惯性，目前已经替换为浏览器托管惯性 ---

                let speed = (movePos / (Date.now() - topTime)) * 16;

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

                */
            }
        });
        this._down();
    },
    // --- 重置视图 scrollOffset ---
    "refreshView": function(this: IVue): void {
        if (this.scrollOffsetData > this.maxScroll) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
                this.tran = 0;
            }
            this.scrollOffsetData = this.maxScroll;
        } else if (this.scrollOffsetData < 0) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = undefined;
                this.tran = 0;
            }
            this.scrollOffsetData = 0;
        }
        this.scrollOffsetEmit = this.scrollOffsetData;
        this.$emit("update:scrollOffset", this.scrollOffsetData);
    },
    // --- 设定滚动位置 ---
    "goScroll": function(this: IVue, scrollOffset: number | string): void {
        let so = typeof scrollOffset === "number" ? scrollOffset : parseInt(scrollOffset);
        if (so === this.scrollOffsetEmit) {
            return;
        }
        this.scrollOffsetData = so;
        this.scrollOffsetEmit = so;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
        }
        this.refreshView();
    }
};

export let mounted = function(this: IVue): void {
    let size = ClickGo.watchSize(this.$refs.wrap, (size) => {
        let client = Math.round(this.direction === "v" ? size.clientHeight : size.clientWidth);
        if (client === this.client) {
            this.$emit("resizen");
            return;
        }
        this.client = client;
        this.$emit("resize", this.client);
        this.refreshView();
    });
    this.client = Math.round(this.direction === "v" ? size.clientHeight : size.clientWidth);
    this.$emit("resize", this.client);

    size = ClickGo.watchSize(this.$refs.inner, (size) => {
        let length = Math.round(this.direction === "v" ? size.height : size.width);
        if (length === this.length) {
            return;
        }
        this.length = length;
        this.$emit("change", this.length);
        this.refreshView();
    });
    this.length = Math.round(this.direction === "v" ? size.height : size.width);
    this.$emit("change", this.length);

    if (this.$parent.direction !== undefined) {
        this.$data._direction = this.$parent.direction;
    }
};

export let destroyed = function(this: IVue): void {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
    }
};

