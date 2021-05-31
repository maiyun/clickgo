export let props = {
    'disabled': {
        'default': false
    },

    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': undefined
    },
    'top': {
        'default': undefined
    },
    'zIndex': {
        'default': undefined
    },
    'flex': {
        'default': ''
    },
    'direction': {
        'default': 'v'
    },

    'length': {
        'default': 1000
    },
    'client': {
        'default': 100
    },
    'scrollOffset': {
        'default': 0
    },
    'float': {
        'default': false
    }
};

export let data = {
    'scrollOffsetData': 0,
    'scrollOffsetPx': 0,
    'barLengthPx': 0,

    'timer': undefined,
    'tran': false,

    'opacity': '1',
    'opacityTimer': undefined,
    'isEnter': false
};

export let watch = {
    'length': {
        handler: function(this: IVueControl): void {
            this.resizePx();
        }
    },
    'client': {
        handler: function(this: IVueControl): void {
            this.resizePx();
        }
    },
    'scrollOffset': {
        handler: function(this: IVueControl): void {
            let scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.scrollOffsetData = scrollOffsetData;
            this.resizePx();
        }
    },
    'scrollOffsetData': {
        handler: function(this: IVueControl): void {
            if (!this.isFloat) {
                return;
            }
            if (this.isEnter) {
                return;
            }
            if (this.opacityTimer) {
                clearTimeout(this.opacityTimer);
                this.opacityTimer = undefined;
            }
            this.opacityTimer = setTimeout(() => {
                this.opacity = '0';
            }, 800);
            this.opacity = '1';
        }
    },
    'float': function(this: IVueControl): void {
        if (this.isFloat) {
            this.opacityTimer = setTimeout(() => {
                this.opacity = '0';
            }, 800);
        }
        else {
            if (this.opacityTimer) {
                clearTimeout(this.opacityTimer);
                this.opacityTimer = undefined;
            }
            this.opacity = '1';
        }
    }
};

export let computed = {
    // --- 滑块真实应该长度 px ---
    'realSize': function(this: IVueControl): number {
        if (this.client >= this.length) {
            return this.barLengthPx;
        }
        return this.client / this.length * this.barLengthPx;
    },
    // --- 滑块目前显示长度 ---
    'size': function(this: IVueControl): number {
        if (this.realSize < 5) {
            if (5 > this.barLengthPx) {
                return this.barLengthPx;
            }
            return 5;
        }
        return this.realSize;
    },
    // --- 目前显示长度大于真实长度的长度 ---
    'sizeOut': function(this: IVueControl): number {
        return this.size - this.realSize;
    },
    // --- 除去滑块外的 bar 长度 --- */
    'barOutSize': function(this: IVueControl): number {
        return this.barLengthPx - this.size;
    },
    // --- 最大可拖动的 scroll 位置 ---
    'maxScroll': function(this: IVueControl): number {
        return (this.length > this.client) ? this.length - this.client : 0;
    },

    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isFloat': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.float);
    }
};

export let methods = {
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.$refs.bar,
            'object': this.$refs.block,
            'move': (ox, oy) => {
                this.scrollOffsetPx += this.direction === 'v' ? oy : ox;
                /** --- 滚动百分比 --- */
                let scrollPer = (this.barOutSize > 0) ? (this.scrollOffsetPx / this.barOutSize) : 0;
                this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            }
        });
    },
    bardown: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        /** --- bar inner 的 rect 对象 --- */
        let barRect = this.$refs.bar.getBoundingClientRect();
        /** --- bar inner 对应的 left 或 top 位置 --- */
        let barOffset = this.direction === 'v' ? barRect.top : barRect.left;
        /** --- 鼠标点击在 bar 中的位置 --- */
        let eOffset = this.direction === 'v' ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX);
        eOffset = eOffset - barOffset;

        let scrollOffsetPx = eOffset - this.size / 2;
        if (scrollOffsetPx < 0) {
            scrollOffsetPx = 0;
        }
        if (scrollOffsetPx + this.size > this.barLengthPx) {
            scrollOffsetPx = this.barLengthPx - this.size;
        }
        this.scrollOffsetPx = scrollOffsetPx;
        /** --- 滚动百分比 --- */
        let scrollPer = this.scrollOffsetPx / this.barOutSize;
        this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
        this.$emit('update:scrollOffset', this.scrollOffsetData);
        this.down(e);
    },
    longDown: function(this: IVueControl, e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (this.isDisabled) {
            return;
        }
        if (this.client >= this.length) {
            return;
        }
        clickgo.dom.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    clearInterval(this.timer);
                }
                this.tran = true;
                let cb = (): void => {
                    if (type === 'start') {
                        if (this.scrollOffsetData - 10 < 0) {
                            if (this.scrollOffsetData !== 0) {
                                this.scrollOffsetData = 0;
                                this.scrollOffsetPx = 0;
                                this.$emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData -= 10;
                            this.scrollOffsetPx = (this.maxScroll > 0) ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.$emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                    else {
                        if (this.scrollOffsetData + 10 > this.maxScroll) {
                            if (this.scrollOffsetData !== this.maxScroll) {
                                this.scrollOffsetData = this.maxScroll;
                                this.scrollOffsetPx = this.barOutSize;
                                this.$emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData += 10;
                            this.scrollOffsetPx = (this.maxScroll > 0) ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.$emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                    if (this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                this.timer = requestAnimationFrame(cb);
            },
            up: () => {
                this.tran = false;
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
            }
        });
    },
    // --- 进入时保持滚动条常亮 ---
    enter: function(this: IVueControl, e: MouseEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgEnter(e);
        this.isEnter = true;
        if (this.isFloat) {
            this.opacity = '1';
            if (this.opacityTimer) {
                clearTimeout(this.opacityTimer);
                this.opacityTimer = undefined;
            }
        }
    },
    leave: function(this: IVueControl, e: MouseEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgLeave(e);
        this.isEnter = false;
        if (this.isFloat) {
            this.opacityTimer = setTimeout(() => {
                this.opacity = '0';
            }, 800);
        }
    },
    wrapDown: function(this: IVueControl, e: TouchEvent): void {
        this.cgDown(e);
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isEnter = true;
                if (this.isFloat) {
                    this.opacity = '1';
                    if (this.opacityTimer) {
                        clearTimeout(this.opacityTimer);
                        this.opacityTimer = undefined;
                    }
                }
            },
            up: () => {
                this.isEnter = false;
                if (this.isFloat) {
                    this.opacityTimer = setTimeout(() => {
                        this.opacity = '0';
                    }, 800);
                }
            }
        });
    },
    // --- 根据 this.scrollOffsetData 值，来设定 px 位置的值 ---
    resizePx: function(this: IVueControl): void {
        if (this.scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
            this.scrollOffsetPx = this.barOutSize;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else if (this.scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
            this.scrollOffsetPx = 0;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else {
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    }
};

export let mounted = function(this: IVueControl): void {
    // --- 是否自动隐藏 scroll ---
    if (this.isFloat) {
        this.opacityTimer = setTimeout(() => {
            this.opacity = '0';
        }, 800);
    }
    // --- 监听 bar 的 size ---
    clickgo.dom.watchSize(this.$refs.bar, (size) => {
        this.barLengthPx = this.direction === 'v' ? size.height : size.width;
        this.scrollOffsetPx =  this.barOutSize * (this.scrollOffsetData / this.maxScroll);
    });
    let scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
    if (this.scrollOffsetData === scrollOffsetData) {
        return;
    }
    this.scrollOffsetData = scrollOffsetData;
    this.resizePx();
};

export let unmounted = function(this: IVueControl): void {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
