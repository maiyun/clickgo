"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
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
exports.data = {
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'touchPos': {
        'x': 0,
        'y': 0
    },
    'canTouch': 0
};
exports.computed = {
    'maxScrollLeft': function () {
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function () {
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    },
    'widthPx': function () {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.cgParent();
            return parent ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};
exports.watch = {
    'scrollLeft': {
        handler: function () {
            let sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$refs.wrap.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function () {
            let st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$refs.wrap.scrollTop = this.scrollTop;
        }
    }
};
exports.methods = {
    scroll: function () {
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
    wheel: function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (this.$refs.wrap.scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (this.$refs.wrap.scrollLeft > 0 && this.$refs.wrap.scrollHeight === this.$refs.wrap.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.wrap.scrollLeft += e.deltaY;
                }
            }
            else {
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
            if (e.deltaX < 0) {
                if (this.$refs.wrap.scrollLeft > 0) {
                    e.stopPropagation();
                }
                else if (this.$refs.wrap.scrollTop > 0 && this.$refs.wrap.scrollWidth === this.$refs.wrap.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.wrap.scrollTop += e.deltaX;
                }
            }
            else {
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
    down: function (e) {
        this.touchPos.x = e.touches[0].clientX;
        this.touchPos.y = e.touches[0].clientY;
        this.firstTouch = true;
        this.cgDown(e);
    },
    move: function (e) {
        let deltaX = this.touchPos.x - e.touches[0].clientX;
        let deltaY = this.touchPos.y - e.touches[0].clientY;
        if (this.canTouch !== 0) {
            if (this.firstTouch === 1) {
                e.stopPropagation();
            }
            return;
        }
        this.firstTouch = -1;
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY < 0) {
                if (this.$refs.wrap.scrollTop > 0) {
                    e.stopPropagation();
                    this.firstTouch = 1;
                }
            }
            else {
                if (this.$refs.wrap.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    this.firstTouch = 1;
                }
            }
        }
        else {
            if (deltaX < 0) {
                if (this.$refs.wrap.scrollLeft > 0) {
                    e.stopPropagation();
                    this.firstTouch = 1;
                }
            }
            else {
                if (this.$refs.wrap.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    this.firstTouch = 1;
                }
            }
        }
        this.touchPos.x = e.touches[0].clientX;
        this.touchPos.y = e.touches[0].clientY;
    }
};
exports.mounted = function () {
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
    this.$refs.wrap.scrollTop = this.scrollTop;
    this.$refs.wrap.scrollLeft = this.scrollLeft;
};
