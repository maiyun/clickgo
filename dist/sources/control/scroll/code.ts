import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'disabled': false,

        'direction': 'v',

        'length': 1000,
        'client': 100,
        'scrollOffset': 0,
        'float': false
    };

    public scrollOffsetData = 0;

    public scrollOffsetPx = 0;

    public barLengthPx = 0;

    public timer = 0;

    public tran = false;

    public opacity = '1';

    public opacityTimer = 0;

    public isEnter = false;

    public width = 0;

    public height = 0;

    /**
     * --- 滑块真实应该长度 px ---
     */
    public get realSize(): number {
        if (this.props.client >= this.props.length) {
            return this.barLengthPx;
        }
        return this.props.client / this.props.length * this.barLengthPx;
    }

    /**
     * --- 滑块目前显示长度 ---
     */
    public get size(): number {
        if (this.realSize < 5) {
            if (5 > this.barLengthPx) {
                return this.barLengthPx;
            }
            return 5;
        }
        return this.realSize;
    }

    /**
     * --- 目前显示长度大于真实长度的长度 ---
     */
    public get sizeOut(): number {
        return this.size - this.realSize;
    }

    /**
     * --- 除去滑块外的 bar 长度 ---
     */
    public get barOutSize(): number {
        return this.barLengthPx - this.size;
    }

    /**
     * --- 最大可拖动的 scroll 位置 ---
     */
    public get maxScroll(): number {
        return (this.props.length > this.props.client) ? this.props.length - this.props.client : 0;
    }

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public get isFloat(): boolean {
        return clickgo.tool.getBoolean(this.props.float);
    }

    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.refs.bar,
            'object': this.refs.block,
            'move': (ox, oy) => {
                this.scrollOffsetPx += this.props.direction === 'v' ? oy : ox;
                /** --- 滚动百分比 --- */
                const scrollPer = (this.barOutSize > 0) ? (this.scrollOffsetPx / this.barOutSize) : 0;
                this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
                this.emit('update:scrollOffset', this.scrollOffsetData);
            }
        });
    }

    public bardown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        /** --- bar inner 的 rect 对象 --- */
        const barRect = this.refs.bar.getBoundingClientRect();
        /** --- bar inner 对应的 left 或 top 位置 --- */
        const barOffset = this.props.direction === 'v' ? barRect.top : barRect.left;
        /** --- 鼠标点击在 bar 中的位置 --- */
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
        /** --- 滚动百分比 --- */
        const scrollPer = this.scrollOffsetPx / this.barOutSize;
        this.scrollOffsetData = Math.round(scrollPer * this.maxScroll);
        this.emit('update:scrollOffset', this.scrollOffsetData);
        this.down(e);
    }

    public longDown(e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
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

    // --- 进入时保持滚动条常亮 ---
    public enter(e: MouseEvent): void {
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

    public leave(e: MouseEvent): void {
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

    public wrapDown(e: TouchEvent): void {
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
    }

    // --- 根据 this.scrollOffsetData 值，来设定 px 位置的值 ---
    public resizePx(): void {
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

    public onMounted(): void {
        this.watch('length', (): void => {
            this.resizePx();
        });
        this.watch('client', (): void => {
            this.resizePx();
        });
        this.watch('scrollOffset', (): void => {
            const scrollOffsetData = Math.round(this.props.scrollOffset);
            if (this.scrollOffsetData === scrollOffsetData) {
                return;
            }
            this.scrollOffsetData = scrollOffsetData;
            this.resizePx();
        });
        this.watch('scrollOffsetData', (): void => {
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
        this.watch('float', (): void => {
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

        // --- 是否自动隐藏 scroll ---
        if (this.isFloat) {
            this.opacityTimer = clickgo.task.sleep(() => {
                this.opacity = '0';
            }, 800);
        }
        // --- 监听 bar 的 size ---
        clickgo.dom.watchSize(this.refs.bar, (size) => {
            this.barLengthPx = this.props.direction === 'v' ? size.height : size.width;
            this.scrollOffsetPx =  this.barOutSize * (this.scrollOffsetData / this.maxScroll);
            // --- bar 的 size 改了，整个 el 肯定也改了 ---
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

    public onUnmounted(): void {
        if (this.timer > 0) {
            clickgo.task.offFrame(this.timer);
        }
    }

}
