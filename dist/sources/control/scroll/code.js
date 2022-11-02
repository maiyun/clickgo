"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'direction': 'v',
            'length': 1000,
            'client': 100,
            'scrollOffset': 0,
            'float': false
        };
        this.scrollOffsetData = 0;
        this.scrollOffsetPx = 0;
        this.barLengthPx = 0;
        this.timer = 0;
        this.tran = false;
        this.opacity = '1';
        this.opacityTimer = 0;
        this.isEnter = false;
        this.width = 0;
        this.height = 0;
    }
    get realSize() {
        if (this.props.client >= this.props.length) {
            return this.barLengthPx;
        }
        return this.props.client / this.props.length * this.barLengthPx;
    }
    get size() {
        if (this.realSize < 5) {
            if (5 > this.barLengthPx) {
                return this.barLengthPx;
            }
            return 5;
        }
        return this.realSize;
    }
    get sizeOut() {
        return this.size - this.realSize;
    }
    get barOutSize() {
        return this.barLengthPx - this.size;
    }
    get maxScroll() {
        return (this.props.length > this.props.client) ? this.props.length - this.props.client : 0;
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get isFloat() {
        return clickgo.tool.getBoolean(this.props.float);
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.refs.bar,
            'object': this.refs.block,
            'move': (ox, oy) => {
                this.scrollOffsetPx += this.props.direction === 'v' ? oy : ox;
                const scrollPer = (this.barOutSize > 0) ? (this.scrollOffsetPx / this.barOutSize) : 0;
                this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
                this.emit('update:scrollOffset', this.scrollOffsetData);
            }
        });
    }
    bardown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        const barRect = this.refs.bar.getBoundingClientRect();
        const barOffset = this.props.direction === 'v' ? barRect.top : barRect.left;
        let eOffset = this.props.direction === 'v' ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX);
        eOffset = eOffset - barOffset;
        let scrollOffsetPx = eOffset - this.size / 2;
        if (scrollOffsetPx < 0) {
            scrollOffsetPx = 0;
        }
        if (scrollOffsetPx + this.size > this.barLengthPx) {
            scrollOffsetPx = this.barLengthPx - this.size;
        }
        this.scrollOffsetPx = scrollOffsetPx;
        const scrollPer = this.scrollOffsetPx / this.barOutSize;
        this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
        this.emit('update:scrollOffset', this.scrollOffsetData);
        this.down(e);
    }
    longDown(e, type) {
        if (this.props.client >= this.props.length) {
            return;
        }
        clickgo.dom.bindDown(e, {
            down: () => {
                this.tran = true;
                this.timer = clickgo.task.onFrame(() => {
                    if (type === 'start') {
                        if (this.scrollOffsetData - 10 < 0) {
                            if (this.scrollOffsetData !== 0) {
                                this.scrollOffsetData = 0;
                                this.scrollOffsetPx = 0;
                                this.emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData -= 10;
                            this.scrollOffsetPx = (this.maxScroll > 0)
                                ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                    else {
                        if (this.scrollOffsetData + 10 > this.maxScroll) {
                            if (this.scrollOffsetData !== this.maxScroll) {
                                this.scrollOffsetData = this.maxScroll;
                                this.scrollOffsetPx = this.barOutSize;
                                this.emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData += 10;
                            this.scrollOffsetPx = (this.maxScroll > 0)
                                ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                });
            },
            up: () => {
                this.tran = false;
                clickgo.task.offFrame(this.timer);
                this.timer = 0;
            }
        });
    }
    enter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = true;
        if (this.isFloat) {
            this.opacity = '1';
            if (this.opacityTimer > 0) {
                clickgo.task.removeTimer(this.opacityTimer);
                this.opacityTimer = 0;
            }
        }
    }
    leave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = false;
        if (this.isFloat) {
            this.opacityTimer = clickgo.task.sleep(() => {
                this.opacity = '0';
            }, 800);
        }
    }
    wrapDown(e) {
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isEnter = true;
                if (this.isFloat) {
                    this.opacity = '1';
                    if (this.opacityTimer > 0) {
                        clickgo.task.removeTimer(this.opacityTimer);
                        this.opacityTimer = 0;
                    }
                }
            },
            up: () => {
                this.isEnter = false;
                if (this.isFloat) {
                    this.opacityTimer = clickgo.task.sleep(() => {
                        this.opacity = '0';
                    }, 800);
                }
            }
        });
    }
    resizePx() {
        if (this.scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
            this.scrollOffsetPx = this.barOutSize;
            this.emit('update:scrollOffset', this.scrollOffsetData);
        }
        else if (this.scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
            this.scrollOffsetPx = 0;
            this.emit('update:scrollOffset', this.scrollOffsetData);
        }
        else {
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    }
    onMounted() {
        this.watch('length', () => {
            this.resizePx();
        });
        this.watch('client', () => {
            this.resizePx();
        });
        this.watch('scrollOffset', () => {
            const scrollOffsetData = Math.round(this.props.scrollOffset);
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.scrollOffsetData = scrollOffsetData;
            this.resizePx();
        });
        this.watch('scrollOffsetData', () => {
            if (!this.isFloat) {
                return;
            }
            if (this.isEnter) {
                return;
            }
            if (this.opacityTimer > 0) {
                clickgo.task.removeTimer(this.opacityTimer);
                this.opacityTimer = 0;
            }
            this.opacityTimer = clickgo.task.sleep(() => {
                this.opacity = '0';
            }, 800);
            this.opacity = '1';
        });
        this.watch('float', () => {
            if (this.isFloat) {
                this.opacityTimer = clickgo.task.sleep(() => {
                    this.opacity = '0';
                }, 800);
            }
            else {
                if (this.opacityTimer > 0) {
                    clickgo.task.removeTimer(this.opacityTimer);
                    this.opacityTimer = 0;
                }
                this.opacity = '1';
            }
        });
        if (this.isFloat) {
            this.opacityTimer = clickgo.task.sleep(() => {
                this.opacity = '0';
            }, 800);
        }
        clickgo.dom.watchSize(this.refs.bar, (size) => {
            this.barLengthPx = this.props.direction === 'v' ? size.height : size.width;
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
            const els = clickgo.dom.getSize(this.element);
            this.width = els.width;
            this.height = els.height;
        }, true);
        const scrollOffsetData = Math.round(this.props.scrollOffset);
        if (this.scrollOffsetData === scrollOffsetData) {
            return;
        }
        this.scrollOffsetData = scrollOffsetData;
        this.resizePx();
    }
    onUnmounted() {
        if (this.timer > 0) {
            clickgo.task.offFrame(this.timer);
        }
    }
}
exports.default = default_1;
