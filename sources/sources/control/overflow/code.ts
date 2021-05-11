export let props = {
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
    'canTouch': false // --- 按下后第一次的拖动判断可拖动后，则后面此次都可拖动（交由浏览器可自行处理） ---
};

export let computed = {
    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVueControl): number {
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function(this: IVueControl): number {
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    }
};

export let watch = {
    'scrollLeft': {
        handler: function(this: IVueControl): void {
            let sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$refs.wrap.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function(this: IVueControl): void {
            let st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$refs.wrap.scrollTop = this.scrollTop;
        }
    }
};

export let methods = {
    scroll: function(this: IVueControl): void {
        let sl = Math.round(this.$refs.wrap.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        let st = Math.round(this.$refs.wrap.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    },
    wheel: function(this: IVueControl, e: WheelEvent): void {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // --- 竖向滚动 ---
            if (e.deltaY < 0) {
                // --- 向上滚 ---
                if (this.$refs.wrap.scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (this.$refs.wrap.scrollLeft > 0 && this.$refs.wrap.scrollHeight === this.$refs.wrap.clientHeight) {
                    // --- 上面不能滚但左边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.wrap.scrollLeft += e.deltaY;
                }
            }
            else {
                // --- 向下滚 ---
                if (this.$refs.wrap.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (this.$refs.wrap.scrollLeft < this.maxScrollLeft && this.$refs.wrap.scrollHeight === this.$refs.wrap.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.wrap.scrollLeft += e.deltaY;
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (e.deltaX < 0) {
                // --- 向左滚 ---
                if (this.$refs.wrap.scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (this.$refs.wrap.scrollTop > 0 && this.$refs.wrap.scrollWidth === this.$refs.wrap.clientWidth) {
                    // --- 左面不能滚但上边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.wrap.scrollTop += e.deltaX;
                }
            }
            else {
                // --- 向右滚 ---
                if (this.$refs.wrap.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (this.$refs.wrap.scrollTop < this.maxScrollTop && this.$refs.wrap.scrollWidth === this.$refs.wrap.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.wrap.scrollTop += e.deltaX;
                }
            }
        }
    },
    down: function(this: IVueControl, e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouch = false;
        this.cgDown(e);
    },
    move: function(this: IVueControl, e: TouchEvent): void {
        // --- 必须有这个，要不然被上层的 e.preventDefault(); 给屏蔽不能拖动，可拖时必须 stopPropagation ---
        let deltaX = this.touchX - e.touches[0].clientX;
        let deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouch) {
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // --- 竖向滚动 ---
            if (deltaY < 0) {
                // --- 向上滚 ---
                if (this.$refs.wrap.scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
            else {
                // --- 向下滚 ---
                if (this.$refs.wrap.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (deltaX < 0) {
                // --- 向左滚 ---
                if (this.$refs.wrap.scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
            else {
                // --- 向右滚 ---
                if (this.$refs.wrap.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    }
};

export let mounted = function(this: IVueControl): void {
    // --- 大小改变，会影响 scroll offset、client，不会影响 length ---
    clickgo.dom.watchSize(this.$refs.wrap, () => {
        let clientWidth = this.$refs.wrap.clientWidth;
        let clientHeight = this.$refs.wrap.clientHeight;

        if (this.clientWidth !== clientWidth) {
            this.clientWidth = clientWidth;
            this.$emit(this.direction === 'v' ? 'resizen' : 'resize', Math.round(this.clientWidth));
        }
        if (clientHeight !== this.clientHeight) {
            this.clientHeight = clientHeight;
            this.$emit(this.direction === 'v' ? 'resize' : 'resizen', Math.round(this.clientHeight));
        }
    }, true);

    // --- 内容改变 ---
    clickgo.dom.watchDom(this.$refs.wrap, () => {
        let lengthWidth = this.$refs.wrap.scrollWidth;
        let lengthHeight = this.$refs.wrap.scrollHeight;

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
    }, 'default', true);

    // --- 对 scroll 位置进行归位 ---
    this.$refs.wrap.scrollTop = this.scrollTop;
    this.$refs.wrap.scrollLeft = this.scrollLeft;
};
