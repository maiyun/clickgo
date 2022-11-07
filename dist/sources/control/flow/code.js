"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'direction': 'h',
            'selection': false,
            'scrollLeft': 0,
            'scrollTop': 0
        };
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.lengthWidth = 0;
        this.lengthHeight = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.canTouchScroll = false;
        this.alreadySb = false;
        this.access = {
            'selectionOrigin': { 'x': 0, 'y': 0 },
            'selectionCurrent': { 'x': 0, 'y': 0, 'quick': false },
            'selectionTimer': 0
        };
    }
    get maxScrollLeft() {
        return Math.round(this.lengthWidth - this.clientWidth);
    }
    get maxScrollTop() {
        return Math.round(this.lengthHeight - this.clientHeight);
    }
    scroll() {
        const sl = Math.round(this.element.scrollLeft);
        if (this.props.scrollLeft !== sl) {
            this.emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.element.scrollTop);
        if (this.props.scrollTop !== st) {
            this.emit('update:scrollTop', st);
        }
        this.refreshSelection(clickgo.dom.is.shift, clickgo.dom.is.ctrl);
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
    down(e) {
        if (this.propBoolean('selection')) {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            const x = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
            const y = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
            clickgo.dom.bindDown(e, {
                start: () => {
                    const rect = this.element.getBoundingClientRect();
                    this.access.selectionOrigin.x = x - rect.left + this.element.scrollLeft;
                    this.access.selectionOrigin.y = y - rect.top + this.element.scrollTop;
                    this.refs.selection.style.opacity = '1';
                    this.access.selectionCurrent.x = x;
                    this.access.selectionCurrent.y = y;
                    this.access.selectionTimer = clickgo.task.onFrame(() => {
                        const rect = this.element.getBoundingClientRect();
                        if (this.access.selectionCurrent.x < rect.left) {
                            if (this.element.scrollLeft > 0) {
                                const x = rect.left - this.access.selectionCurrent.x;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollLeft - dist < 0) {
                                    dist = this.element.scrollLeft;
                                }
                                this.element.scrollLeft -= dist;
                                this.emit('update:scrollLeft', Math.round(this.element.scrollLeft));
                            }
                        }
                        else if (this.access.selectionCurrent.x > rect.right) {
                            if (this.element.scrollLeft < this.maxScrollLeft) {
                                const x = this.access.selectionCurrent.x - rect.right;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollLeft + dist > this.maxScrollLeft) {
                                    dist = this.maxScrollLeft - this.element.scrollLeft;
                                }
                                this.element.scrollLeft += dist;
                                this.emit('update:scrollLeft', Math.round(this.element.scrollLeft));
                            }
                        }
                        if (this.access.selectionCurrent.y < rect.top) {
                            if (this.element.scrollTop > 0) {
                                const x = rect.top - this.access.selectionCurrent.y;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollTop - dist < 0) {
                                    dist = this.element.scrollTop;
                                }
                                this.element.scrollTop -= dist;
                                this.emit('update:scrollTop', Math.round(this.element.scrollTop));
                            }
                        }
                        else if (this.access.selectionCurrent.y > rect.bottom) {
                            if (this.element.scrollTop < this.maxScrollTop) {
                                const x = this.access.selectionCurrent.y - rect.bottom;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollTop + dist > this.maxScrollTop) {
                                    dist = this.maxScrollTop - this.element.scrollTop;
                                }
                                this.element.scrollTop += dist;
                                this.emit('update:scrollTop', Math.round(this.element.scrollTop));
                            }
                        }
                    }, {
                        'formId': this.formId
                    });
                    this.emit('beforeselect');
                },
                move: (ne) => {
                    const nx = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                    const ny = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                    this.access.selectionCurrent.x = nx;
                    this.access.selectionCurrent.y = ny;
                    this.access.selectionCurrent.quick = true;
                    this.refreshSelection(ne.shiftKey, ne.ctrlKey);
                },
                end: () => {
                    this.refs.selection.style.opacity = '0';
                    this.refs.selection.style.left = '0px';
                    this.refs.selection.style.top = '0px';
                    this.refs.selection.style.width = '1px';
                    this.refs.selection.style.height = '1px';
                    clickgo.task.offFrame(this.access.selectionTimer);
                    this.access.selectionTimer = 0;
                    this.emit('afterselect');
                }
            });
        }
        else {
            if (e instanceof TouchEvent) {
                this.touchX = e.touches[0].clientX;
                this.touchY = e.touches[0].clientY;
                this.canTouchScroll = false;
            }
        }
    }
    refreshSelection(shift = false, ctrl = false) {
        if (!this.access.selectionTimer) {
            return;
        }
        const rect = this.element.getBoundingClientRect();
        const x = this.access.selectionCurrent.x - rect.left + this.element.scrollLeft;
        const y = this.access.selectionCurrent.y - rect.top + this.element.scrollTop;
        const area = {
            'x': 0,
            'y': 0,
            'width': 0,
            'height': 0,
            'shift': shift,
            'ctrl': ctrl
        };
        if (x >= this.access.selectionOrigin.x) {
            area.x = Math.round(this.access.selectionOrigin.x);
            area.width = Math.round(x - this.access.selectionOrigin.x);
            const maxWidth = this.maxScrollLeft + this.clientWidth - area.x;
            if (area.width > maxWidth) {
                area.width = maxWidth;
            }
        }
        else {
            area.x = Math.round(x);
            if (area.x < 0) {
                area.x = 0;
            }
            area.width = Math.round(this.access.selectionOrigin.x - area.x);
        }
        if (y >= this.access.selectionOrigin.y) {
            area.y = Math.round(this.access.selectionOrigin.y);
            area.height = Math.round(y - this.access.selectionOrigin.y);
            const maxHeight = this.maxScrollTop + this.clientHeight - area.y;
            if (area.height > maxHeight) {
                area.height = maxHeight;
            }
        }
        else {
            area.y = Math.round(y);
            if (area.y < 0) {
                area.y = 0;
            }
            area.height = Math.round(this.access.selectionOrigin.y - area.y);
        }
        this.refs.selection.style.left = area.x.toString() + 'px';
        this.refs.selection.style.top = area.y.toString() + 'px';
        this.refs.selection.style.width = area.width.toString() + 'px';
        this.refs.selection.style.height = area.height.toString() + 'px';
        this.emit('select', area);
    }
    move(e) {
        if (this.propBoolean('selection')) {
            return;
        }
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
            if (this.propInt('scrollLeft') === this.element.scrollLeft) {
                return;
            }
            this.element.scrollLeft = this.propInt('scrollLeft');
        });
        this.watch('scrollTop', () => {
            if (this.propInt('scrollTop') === this.element.scrollTop) {
                return;
            }
            this.element.scrollTop = this.propInt('scrollTop');
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
        this.element.scrollTop = this.propInt('scrollTop');
        this.element.scrollLeft = this.propInt('scrollLeft');
    }
}
exports.default = default_1;
