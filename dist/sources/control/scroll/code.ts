import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'disabled': {
        'default': false
    },

    'direction': {
        'default': 'v'
    },

    'length': {
        'default': 1000
    },
    'client': {
        'default': 100
    },
    'scrollOffset': {
        'default': 0
    },
    'float': {
        'default': false
    }
};

export const data = {
    'scrollOffsetData': 0,
    'scrollOffsetPx': 0,
    'barLengthPx': 0,

    'timer': 0,
    'tran': false,

    'opacity': '1',
    'opacityTimer': 0,
    'isEnter': false,

    'width': 0,
    'height': 0
};

export const watch = {
    'length': {
        handler: function(this: types.IVControl): void {
            this.resizePx();
        }
    },
    'client': {
        handler: function(this: types.IVControl): void {
            this.resizePx();
        }
    },
    'scrollOffset': {
        handler: function(this: types.IVControl): void {
            const scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.scrollOffsetData = scrollOffsetData;
            this.resizePx();
        }
    },
    'scrollOffsetData': {
        handler: function(this: types.IVControl): void {
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
        }
    },
    'float': function(this: types.IVControl): void {
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
    }
};

export const computed = {
    // --- 滑块真实应该长度 px ---
    'realSize': function(this: types.IVControl): number {
        if (this.client >= this.length) {
            return this.barLengthPx;
        }
        return this.client / this.length * this.barLengthPx;
    },
    // --- 滑块目前显示长度 ---
    'size': function(this: types.IVControl): number {
        if (this.realSize < 5) {
            if (5 > this.barLengthPx) {
                return this.barLengthPx;
            }
            return 5;
        }
        return this.realSize;
    },
    // --- 目前显示长度大于真实长度的长度 ---
    'sizeOut': function(this: types.IVControl): number {
        return this.size - this.realSize;
    },
    // --- 除去滑块外的 bar 长度 --- */
    'barOutSize': function(this: types.IVControl): number {
        return this.barLengthPx - this.size;
    },
    // --- 最大可拖动的 scroll 位置 ---
    'maxScroll': function(this: types.IVControl): number {
        return (this.length > this.client) ? this.length - this.client : 0;
    },

    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isFloat': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.float);
    }
};

export const methods = {
    down: function(this: types.IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.$refs.bar,
            'object': this.$refs.block,
            'move': (ox, oy) => {
                (this.scrollOffsetPx as number) += this.direction === 'v' ? oy : ox;
                /** --- 滚动百分比 --- */
                const scrollPer = (this.barOutSize > 0) ? (this.scrollOffsetPx / this.barOutSize) : 0;
                this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
                this.$emit('update:scrollOffset', this.scrollOffsetData);
            }
        });
    },
    bardown: function(this: types.IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        /** --- bar inner 的 rect 对象 --- */
        const barRect = this.$refs.bar.getBoundingClientRect();
        /** --- bar inner 对应的 left 或 top 位置 --- */
        const barOffset = this.direction === 'v' ? barRect.top : barRect.left;
        /** --- 鼠标点击在 bar 中的位置 --- */
        let eOffset = this.direction === 'v' ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX);
        eOffset = eOffset - barOffset;

        let scrollOffsetPx = eOffset - this.size / 2;
        if (scrollOffsetPx < 0) {
            scrollOffsetPx = 0;
        }
        if (scrollOffsetPx + (this.size as number) > this.barLengthPx) {
            scrollOffsetPx = this.barLengthPx - this.size;
        }
        this.scrollOffsetPx = scrollOffsetPx;
        /** --- 滚动百分比 --- */
        const scrollPer = this.scrollOffsetPx / this.barOutSize;
        this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
        this.$emit('update:scrollOffset', this.scrollOffsetData);
        this.down(e);
    },
    longDown: function(this: types.IVControl, e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (this.client >= this.length) {
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
                                this.$emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            this.scrollOffsetData -= 10;
                            this.scrollOffsetPx = (this.maxScroll > 0)
                                ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.$emit('update:scrollOffset', this.scrollOffsetData);
                        }
                    }
                    else {
                        if ((this.scrollOffsetData as number) + 10 > this.maxScroll) {
                            if (this.scrollOffsetData !== this.maxScroll) {
                                this.scrollOffsetData = this.maxScroll;
                                this.scrollOffsetPx = this.barOutSize;
                                this.$emit('update:scrollOffset', this.scrollOffsetData);
                            }
                        }
                        else {
                            (this.scrollOffsetData as number) += 10;
                            this.scrollOffsetPx = (this.maxScroll > 0)
                                ? (this.barOutSize * (this.scrollOffsetData / this.maxScroll)) : 0;
                            this.$emit('update:scrollOffset', this.scrollOffsetData);
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
    },
    // --- 进入时保持滚动条常亮 ---
    enter: function(this: types.IVControl, e: MouseEvent): void {
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
    },
    leave: function(this: types.IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = false;
        if (this.isFloat) {
            this.opacityTimer = clickgo.task.sleep(() => {
                this.opacity = '0';
            }, 800);
        }
    },
    wrapDown: function(this: types.IVControl, e: TouchEvent): void {
        // --- 防止在手机模式按下的状态下滚动条被自动隐藏，PC 下有 enter 所以没事 ---
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
    },
    // --- 根据 this.scrollOffsetData 值，来设定 px 位置的值 ---
    resizePx: function(this: types.IVControl): void {
        if (this.scrollOffsetData > this.maxScroll) {
            this.scrollOffsetData = this.maxScroll;
            this.scrollOffsetPx = this.barOutSize;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else if (this.scrollOffsetData < 0) {
            this.scrollOffsetData = 0;
            this.scrollOffsetPx = 0;
            this.$emit('update:scrollOffset', this.scrollOffsetData);
        }
        else {
            this.scrollOffsetPx = this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        }
    }
};

export const mounted = function(this: types.IVControl): void {
    // --- 是否自动隐藏 scroll ---
    if (this.isFloat) {
        this.opacityTimer = clickgo.task.sleep(() => {
            this.opacity = '0';
        }, 800);
    }
    // --- 监听 bar 的 size ---
    clickgo.dom.watchSize(this.$refs.bar, (size) => {
        this.barLengthPx = this.direction === 'v' ? size.height : size.width;
        this.scrollOffsetPx =  this.barOutSize * (this.scrollOffsetData / this.maxScroll);
        // --- bar 的 size 改了，整个 el 肯定也改了 ---
        const els = clickgo.dom.getSize(this.$el);
        this.width = els.width;
        this.height = els.height;
    }, true);
    const scrollOffsetData = Math.round(parseFloat(this.scrollOffset));
    if (this.scrollOffsetData === scrollOffsetData) {
        return;
    }
    this.scrollOffsetData = scrollOffsetData;
    this.resizePx();
};

export const unmounted = function(this: types.IVControl): void {
    if (this.timer > 0) {
        clickgo.task.offFrame(this.timer);
    }
};
