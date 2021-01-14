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
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
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
    }
};

export let data = {
    'scrollOffsetData': 0,
    'scrollOffsetPx': 0,
    'barLengthPx': 0,

    'timer': undefined,
    'tran': false
};

export let watch = {
    'length': {
        handler: function(this: IVueControl): void {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            }
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    },
    'client': {
        handler: function(this: IVueControl): void {
            if (this.scrollOffsetData > this.maxScroll) {
                this.scrollOffsetData = this.maxScroll;
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            }
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    },
    'scrollOffset': {
        handler: function(this: IVueControl): void {
            let scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.resizePxOfScrollOffsetData(scrollOffsetData);
        }
    }
};

export let computed = {
    // --- 滑块真实应该长度 ---
    'realSize': function(this: IVueControl): number {
        if (this.client >= this.length) {
            return this.barLengthPx;
        }
        return this.client / this.length * this.barLengthPx;
    },
    // --- 滑块目前显示长度 ---
    'size': function(this: IVueControl): number {
        if (this.realSize < 5) {
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

    'widthPx': function(this: IVueControl): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVueControl): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent?.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let methods = {
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.$refs.bar,
            'object': this.$refs.block,
            'move': (ox, oy) => {
                this.scrollOffsetPx += this.direction === 'v' ? oy : ox;
                /** --- 滚动百分比 --- */
                let scrollPer = this.scrollOffsetPx / this.barOutSize;
                this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            }
        });
    },
    bardown: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
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
                            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
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
                            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
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
    resizePxOfScrollOffsetData: function(this: IVueControl, scrollOffsetData: number): void {
        if (scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
            this.scrollOffsetPx = this.barOutSize;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else if (scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
            this.scrollOffsetPx = 0;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else {
            this.scrollOffsetData = scrollOffsetData;
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
    }
};

export let mounted = function(this: IVueControl): void {
    let dwd = clickgo.dom.watchSize(this.$refs.bar, (size) => {
        this.barLengthPx = this.direction === 'v' ? size.height : size.width;
        this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
    });
    this.barLengthPx = this.direction === 'v' ? dwd.size.height : dwd.size.width;
    let scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
    if (this.scrollOffsetData === scrollOffsetData) {
        return;
    }
    this.resizePxOfScrollOffsetData(scrollOffsetData);
};

export let unmounted = function(this: IVueControl): void {
    if (this.timer !== undefined) {
        clearInterval(this.timer);
    }
};
