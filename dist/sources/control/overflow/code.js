"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'scrollLeft': 0,
            'scrollTop': 0
        };
        this.text = '';
        this.scrollLeftEmit = 0;
        this.scrollTopEmit = 0;
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.lengthWidth = 0;
        this.lengthHeight = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.canTouchScroll = false;
        this.alreadySb = false;
    }
    get maxScrollLeft() {
        return Math.round(this.lengthWidth - this.clientWidth);
    }
    get maxScrollTop() {
        return Math.round(this.lengthHeight - this.clientHeight);
    }
    scroll() {
        const sl = Math.round(this.element.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.element.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.emit('update:scrollTop', st);
        }
    }
    wheel(e) {
        const scrollTop = Math.ceil(this.element.scrollTop);
        const scrollLeft = Math.ceil(this.element.scrollLeft);
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (scrollLeft > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (this.props.direction === 'h') {
                        e.direction = 'h';
                    }
                    this.emit('scrollborder', e);
                }
            }
            else {
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (this.props.direction === 'h') {
                        e.direction = 'h';
                    }
                    this.emit('scrollborder', e);
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
                    this.element.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    if (this.props.direction === 'v') {
                        e.direction = 'v';
                    }
                    this.emit('scrollborder', e);
                }
            }
            else {
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    if (this.props.direction === 'v') {
                        e.direction = 'v';
                    }
                    this.emit('scrollborder', e);
                }
            }
        }
    }
    touch(e) {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
    }
    move(e) {
        const scrollTop = Math.ceil(this.element.scrollTop);
        const scrollLeft = Math.ceil(this.element.scrollLeft);
        const deltaX = this.touchX - e.touches[0].clientX;
        const deltaY = this.touchY - e.touches[0].clientY;
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
                        this.emit('scrollborder', e);
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
                        this.emit('scrollborder', e);
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
                        this.emit('scrollborder', e);
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
                        this.emit('scrollborder', e);
                    }
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    }
    end() {
        this.alreadySb = false;
    }
    refreshLength() {
        if (!this.element.offsetParent) {
            return;
        }
        const lengthWidth = this.element.scrollWidth;
        const lengthHeight = this.element.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
            if (this.props.direction === 'h') {
                this.emit('change', lengthWidth);
            }
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            if (this.props.direction === 'v') {
                this.emit('change', lengthHeight);
            }
        }
    }
    onMounted() {
        this.watch('scrollLeft', () => {
            const sl = typeof this.props.scrollLeft === 'number' ? this.props.scrollLeft : parseInt(this.props.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.element.scrollLeft = this.props.scrollLeft;
        });
        this.watch('scrollTop', () => {
            const st = typeof this.props.scrollTop === 'number' ? this.props.scrollTop : parseInt(this.props.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.element.scrollTop = this.props.scrollTop;
        });
        clickgo.dom.watchSize(this.element, () => {
            const clientWidth = this.element.clientWidth;
            const clientHeight = this.element.clientHeight;
            if (this.clientWidth !== clientWidth) {
                this.clientWidth = clientWidth;
                this.emit(this.props.direction === 'v' ? 'resizen' : 'resize', Math.round(this.clientWidth));
            }
            if (clientHeight !== this.clientHeight) {
                this.clientHeight = clientHeight;
                this.emit(this.props.direction === 'v' ? 'resize' : 'resizen', Math.round(this.clientHeight));
            }
            this.refreshLength();
        }, true);
        clickgo.dom.watch(this.element, () => {
            this.refreshLength();
        }, 'childsub', true);
        clickgo.dom.watchStyle(this.element, ['padding', 'font'], () => {
            this.refreshLength();
        });
        this.element.scrollTop = this.props.scrollTop;
        this.element.scrollLeft = this.props.scrollLeft;
    }
}
exports.default = default_1;
