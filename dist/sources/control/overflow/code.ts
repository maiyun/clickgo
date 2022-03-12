export let props = {
    'direction': {
        'default': 'h'
    },

    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    }
};

export let data = {
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'clientWidth': 0,
    'clientHeight': 0,

    'lengthWidth': 0,
    'lengthHeight': 0,

    'touchX': 0,
    'touchY': 0,
    'canTouch': 10 // --- 按下后第 n 次的拖动判断可拖动后，则后面此次都可拖动（交由浏览器可自行处理） ---
};

export let computed = {
    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVControl): number {
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function(this: IVControl): number {
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    }
};

export let watch = {
    'scrollLeft': {
        handler: function(this: IVControl): void {
            let sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$el.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function(this: IVControl): void {
            let st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$el.scrollTop = this.scrollTop;
        }
    }
};

export let methods = {
    scroll: function(this: IVControl): void {
        let sl = Math.round(this.$el.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        let st = Math.round(this.$el.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    },
    wheel: function(this: IVControl, e: WheelEvent): void {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // --- 竖向滚动 ---
            if (e.deltaY < 0) {
                // --- 向上滚 ---
                if (this.$el.scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (this.$el.scrollLeft > 0 && this.$el.scrollHeight === this.$el.clientHeight) {
                    // --- 上面不能滚但左边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft += e.deltaY;
                }
            }
            else {
                // --- 向下滚 ---
                if (this.$el.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (this.$el.scrollLeft < this.maxScrollLeft && this.$el.scrollHeight === this.$el.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft += e.deltaY;
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (e.deltaX < 0) {
                // --- 向左滚 ---
                if (this.$el.scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (this.$el.scrollTop > 0 && this.$el.scrollWidth === this.$el.clientWidth) {
                    // --- 左面不能滚但上边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop += e.deltaX;
                }
            }
            else {
                // --- 向右滚 ---
                if (this.$el.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (this.$el.scrollTop < this.maxScrollTop && this.$el.scrollWidth === this.$el.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop += e.deltaX;
                }
            }
        }
    },
    touchstart: function(this: IVControl, e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouch = 10;
    },
    move: function(this: IVControl, e: TouchEvent): void {
        // --- 必须有这个，要不然被上层的 e.preventDefault(); 给屏蔽不能拖动，可拖时必须 stopPropagation ---
        let deltaX = this.touchX - e.touches[0].clientX;
        let deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouch === 0) {
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // --- 竖向滚动 ---
            if (deltaY < 0) {
                // --- 向上滚 ---
                if (this.$el.scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
            else {
                // --- 向下滚 ---
                if (this.$el.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (deltaX < 0) {
                // --- 向左滚 ---
                if (this.$el.scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
            else {
                // --- 向右滚 ---
                if (this.$el.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    },
    refreshLength: function(this: IVControl): void {
        let lengthWidth = this.$el.scrollWidth;
        let lengthHeight = this.$el.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
            if (this.direction === 'h') {
                this.$emit('change', lengthWidth);
            }
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            if (this.direction === 'v') {
                this.$emit('change', lengthHeight);
            }
        }
    }
};

export let mounted = function(this: IVControl): void {
    // --- 大小改变，会影响 scroll offset、client，不会影响 length ---
    clickgo.dom.watchSize(this.$el, () => {
        if (!this.$el) {
            return;
        }
        let clientWidth = this.$el.clientWidth;
        let clientHeight = this.$el.clientHeight;
        if (this.clientWidth !== clientWidth) {
            this.clientWidth = clientWidth;
            this.$emit(this.direction === 'v' ? 'resizen' : 'resize', Math.round(this.clientWidth));
        }
        if (clientHeight !== this.clientHeight) {
            this.clientHeight = clientHeight;
            this.$emit(this.direction === 'v' ? 'resize' : 'resizen', Math.round(this.clientHeight));
        }
        this.refreshLength();
    }, true);

    // --- 内容改变 ---
    clickgo.dom.watch(this.$el, () => {
        if (!this.$el) {
            return;
        }
        this.refreshLength();
    }, 'default', true);

    // --- 对 scroll 位置进行归位 ---
    this.$el.scrollTop = this.scrollTop;
    this.$el.scrollLeft = this.scrollLeft;
};
