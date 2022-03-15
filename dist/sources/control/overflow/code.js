"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
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
exports.data = {
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'touchX': 0,
    'touchY': 0,
    'canTouch': 10
};
exports.computed = {
    'maxScrollLeft': function () {
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function () {
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    }
};
exports.watch = {
    'scrollLeft': {
        handler: function () {
            let sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$el.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function () {
            let st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$el.scrollTop = this.scrollTop;
        }
    }
};
exports.methods = {
    scroll: function () {
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
    wheel: function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (this.$el.scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (this.$el.scrollLeft > 0 && this.$el.scrollHeight === this.$el.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft += e.deltaY;
                }
            }
            else {
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
            if (e.deltaX < 0) {
                if (this.$el.scrollLeft > 0) {
                    e.stopPropagation();
                }
                else if (this.$el.scrollTop > 0 && this.$el.scrollWidth === this.$el.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop += e.deltaX;
                }
            }
            else {
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
    touchstart: function (e) {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouch = 10;
    },
    move: function (e) {
        let deltaX = this.touchX - e.touches[0].clientX;
        let deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouch === 0) {
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY < 0) {
                if (this.$el.scrollTop > 0) {
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
            else {
                if (this.$el.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
        }
        else {
            if (deltaX < 0) {
                if (this.$el.scrollLeft > 0) {
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
            else {
                if (this.$el.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    --this.canTouch;
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    },
    refreshLength: function () {
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
exports.mounted = function () {
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
    clickgo.dom.watch(this.$el, () => {
        if (!this.$el) {
            return;
        }
        this.refreshLength();
    }, 'childsub', true);
    clickgo.dom.watchStyle(this.$el, ['padding', 'font'], () => {
        if (!this.$el) {
            return;
        }
        this.refreshLength();
    });
    this.$el.scrollTop = this.scrollTop;
    this.$el.scrollLeft = this.scrollLeft;
};
