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
    'tran': false
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

    'widthPx': function(this: IVueControl): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVueControl): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },
    'floatComp': function(this: IVueControl): boolean {
        if (typeof this.float === 'string') {
            if (this.float === 'false') {
                return false;
            }
            return true;
        }
        return this.float ? true : false;
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
                let scrollPer = (this.barOutSize > 0) ? (this.scrollOffsetPx / this.barOutSize) : 0;
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
