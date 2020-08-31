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
        'default': 'v'
    },

    'scrollOffset': {
        'default': 0
    }
};

export let data = {
    'scrollOffsetEmit': 0,
    'resizeEmit': 0,
    'changeEmit': 0
};

export let computed = {
    'widthPx': function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return this.$parent.direction ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return this.$parent.direction ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let watch = {
    'scrollOffset': {
        handler: function(this: IVue): void {
            let so = parseInt(this.scrollOffset);
            if (so === this.scrollOffsetEmit) {
                return;
            }
            if (this.direction === 'v') {
                this.$refs.wrap.scrollTop = this.scrollOffset;
            }
            else {
                this.$refs.wrap.scrollLeft = this.scrollOffset;
            }
        }
    }
};

export let methods = {
    scroll: function(this: IVue): void {
        if (!this.$refs.wrap) {
            return;
        }
        let scroll = this.direction === 'v' ? this.$refs.wrap.scrollTop : this.$refs.wrap.scrollLeft;
        if (scroll < 0) {
            scroll = 0;
        }
        let maxScroll = (this.direction === 'v' ? (this.$refs.wrap.scrollHeight - this.$refs.wrap.clientHeight) : (this.$refs.wrap.scrollWidth - this.$refs.wrap.clientWidth));
        if (scroll > maxScroll) {
            scroll = maxScroll;
        }
        this.scrollOffsetEmit = scroll;
        this.$emit('update:scrollOffset', this.scrollOffsetEmit);
    },
    wheel: function(this: IVue, e: WheelEvent): void {
        if (this.direction === 'v') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        this.$refs.wrap.scrollLeft += e.deltaY;
    },
    touchmove: function(this: IVue, e: TouchEvent): void {
        e.stopPropagation();
    }
};

export let mounted = function(this: IVue): void {
    clickgo.element.watchSize(this.$refs.wrap, () => {
        let resize = this.direction === 'v' ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth;
        if (this.resizeEmit !== resize) {
            this.resizeEmit = resize;
            this.$emit('resize', resize);
        }
        this.$emit('resize', this.direction === 'v' ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth);
    });
    let resize = this.direction === 'v' ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth;
    this.resizeEmit = resize;
    this.$emit('resize', this.direction === 'v' ? this.$refs.wrap.clientHeight : this.$refs.wrap.clientWidth);

    if (this.direction === 'v') {
        this.$refs.wrap.scrollTop = this.scrollOffset;
    }
    else {
        this.$refs.wrap.scrollLeft = this.scrollOffset;
    }
};

export let updated = function(this: IVue): void {
    let change = this.direction === 'v' ? this.$refs.wrap.scrollHeight : this.$refs.wrap.scrollWidth;
    if (this.changeEmit !== change) {
        this.changeEmit = change;
        this.$emit('change', change);
    }
};
