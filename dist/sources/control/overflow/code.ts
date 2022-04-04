export const props = {
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

export const data = {
    'text': '',
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'clientWidth': 0,
    'clientHeight': 0,

    'lengthWidth': 0,
    'lengthHeight': 0,

    'touchX': 0,
    'touchY': 0,
    'canTouchScroll': false, // --- 当可以同鼠标滚动浏览器原生 overflow 时，则设置为 true，防止被上层的屏蔽掉滚动 scroll 效果 ---
    'alreadySb': false
};

export const computed = {
    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVControl): number {
        return Math.round(this.lengthWidth - this.clientWidth);
    },
    'maxScrollTop': function(this: IVControl): number {
        return Math.round(this.lengthHeight - this.clientHeight);
    }
};

export const watch = {
    'scrollLeft': {
        handler: function(this: IVControl): void {
            const sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$el.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function(this: IVControl): void {
            const st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$el.scrollTop = this.scrollTop;
        }
    }
};

export const methods = {
    scroll: function(this: IVControl): void {
        const sl = Math.round(this.$el.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.$el.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    },
    wheel: function(this: IVControl, e: WheelEvent): void {
        const scrollTop = Math.ceil(this.$el.scrollTop);
        const scrollLeft = Math.ceil(this.$el.scrollLeft);
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // --- 竖向滚动 ---
            if (e.deltaY < 0) {
                // --- 向上滚 ---
                if (scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (scrollLeft > 0) {
                    // --- 上面不能滚但左边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft = scrollLeft + e.deltaY; // deltaY 是负数，实际上是向左
                }
                else {
                    // --- 上边左边都不能滚 ---
                    if (this.direction === 'h') {
                        (e as any).direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                // --- 向下滚 ---
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    // --- 下面不能滚但右边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    // --- 下边右边都不能滚 ---
                    if (this.direction === 'h') {
                        (e as any).direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (e.deltaX < 0) {
                // --- 向左滚 ---
                if (scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (scrollTop > 0) {
                    // --- 左面不能滚但上边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 左边上边都不能滚 ---
                    if (this.direction === 'v') {
                        (e as any).direction = 'v';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                // --- 向右滚 ---
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 右边下边都不能滚 ---
                    if (this.direction === 'v') {
                        (e as any).direction = 'v';
                    }
                    this.$emit('scrollborder', e);
                }
            }
        }
    },
    touch: function(this: IVControl, e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
    },
    move: function(this: IVControl, e: TouchEvent): void {
        const scrollTop = Math.ceil(this.$el.scrollTop);
        const scrollLeft = Math.ceil(this.$el.scrollLeft);
        const deltaX = this.touchX - e.touches[0].clientX;
        const deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouchScroll) {
            // --- 必须有这个，要不然被上层的 e.preventDefault(); 给屏蔽不能拖动，可拖时必须 stopPropagation(虽然 wheel 已经有了 stioPropagation，但毕竟那是 wheel 的，touch 被 preventDefault 照样不能拖动) ---
            e.stopPropagation();
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // --- 竖向滚动 ---
            if (deltaY < 0) {
                // --- 向上滚 ---
                if (scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    this.canTouchScroll = true;
                }
                else {
                    if (!this.alreadySb) {
                        this.alreadySb = true;
                        this.$emit('scrollborder', e);
                    }
                }
            }
            else {
                // --- 向下滚 ---
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    this.canTouchScroll = true;
                }
                else {
                    if (!this.alreadySb) {
                        this.alreadySb = true;
                        this.$emit('scrollborder', e);
                    }
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (deltaX < 0) {
                // --- 向左滚 ---
                if (scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    this.canTouchScroll = true;
                }
                else {
                    if (!this.alreadySb) {
                        this.alreadySb = true;
                        this.$emit('scrollborder', e);
                    }
                }
            }
            else {
                // --- 向右滚 ---
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    this.canTouchScroll = true;
                }
                else {
                    if (!this.alreadySb) {
                        this.alreadySb = true;
                        this.$emit('scrollborder', e);
                    }
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    },
    end: function(this: IVControl): void {
        this.alreadySb = false;
    },
    refreshLength: function(this: IVControl): void {
        if (!this.$el.offsetParent) {
            return;
        }
        const lengthWidth = this.$el.scrollWidth;
        const lengthHeight = this.$el.scrollHeight;
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

export const mounted = function(this: IVControl): void {
    // --- 大小改变，会影响 scroll offset、client，不会影响 length ---
    clickgo.dom.watchSize(this.$el, () => {
        const clientWidth = this.$el.clientWidth;
        const clientHeight = this.$el.clientHeight;
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
        this.refreshLength();
    }, 'childsub', true);
    clickgo.dom.watchStyle(this.$el, ['padding', 'font'], () => {
        this.refreshLength();
    });

    // --- 对 scroll 位置进行归位 ---
    this.$el.scrollTop = this.scrollTop;
    this.$el.scrollLeft = this.scrollLeft;
};
