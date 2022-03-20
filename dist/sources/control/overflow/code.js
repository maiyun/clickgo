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
    'text': '',
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'touchX': 0,
    'touchY': 0,
    'canTouchScroll': false,
    'alreadySb': false
};
exports.computed = {
    'maxScrollLeft': function () {
        return Math.round(this.lengthWidth - this.clientWidth);
    },
    'maxScrollTop': function () {
        return Math.round(this.lengthHeight - this.clientHeight);
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
        let scrollTop = Math.ceil(this.$el.scrollTop);
        let scrollLeft = Math.ceil(this.$el.scrollLeft);
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (scrollLeft > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (this.direction === 'h') {
                        e.direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (this.direction === 'h') {
                        e.direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
        }
        else {
            if (e.deltaX < 0) {
                if (scrollLeft > 0) {
                    e.stopPropagation();
                }
                else if (scrollTop > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    if (this.direction === 'v') {
                        e.direction = 'v';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$el.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    if (this.direction === 'v') {
                        e.direction = 'v';
                    }
                    this.$emit('scrollborder', e);
                }
            }
        }
    },
    touch: function (e) {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
    },
    move: function (e) {
        let scrollTop = Math.ceil(this.$el.scrollTop);
        let scrollLeft = Math.ceil(this.$el.scrollLeft);
        let deltaX = this.touchX - e.touches[0].clientX;
        let deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouchScroll) {
            e.stopPropagation();
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY < 0) {
                if (scrollTop > 0) {
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
            if (deltaX < 0) {
                if (scrollLeft > 0) {
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
    end: function () {
        this.alreadySb = false;
    },
    refreshLength: function () {
        if (!this.$el.offsetParent) {
            return;
        }
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
let mounted = function () {
    clickgo.dom.watchSize(this.$el, () => {
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
        this.refreshLength();
    }, 'childsub', true);
    clickgo.dom.watchStyle(this.$el, ['padding', 'font'], () => {
        this.refreshLength();
    });
    this.$el.scrollTop = this.scrollTop;
    this.$el.scrollLeft = this.scrollLeft;
};
exports.mounted = mounted;
