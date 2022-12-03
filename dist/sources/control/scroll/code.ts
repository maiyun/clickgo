import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'float': boolean | string;

        'direction': 'h' | 'v';

        'length': number | string;
        'client': number | string;
        'offset': number | string;
    } = {
            'disabled': false,
            'float': false,

            'direction': 'v',

            'length': 1000,
            'client': 100,
            'offset': 0
        };

    /** --- 当前位置（数值） --- */
    public offsetData = 0;

    /** --- 将在多久后隐藏 --- */
    public hideTimer = 0;

    /** --- 是否在以设定数值的形式滚动中的 timer 值（controlDown） --- */
    public tran = 0;

    /** --- 是否在显示 --- */
    public isShow = true;

    /** --- 是否是 enter 状态 --- */
    public isEnter = false;

    /** --- 整体的元素的宽度像素 --- */
    public width = 0;

    /** --- 整体的元素高度像素 --- */
    public height = 0;

    /** --- bar 的 px --- */
    public barPx = 0;

    /** --- block 的 px --- */
    public get blockPx(): number {
        const px = this.propInt('client') / this.propInt('length') * this.barPx;
        if (px < 5) {
            return 5;
        }
        return px;
    }

    /**
     * --- 最大可拖动的 offset 位置 ---
     */
    public get maxOffset(): number {
        return (this.props.length > this.props.client) ? this.propInt('length') - this.propInt('client') : 0;
    }

    /**
     * --- 当前 offset 位置相对于最大位置的比例，最大为 1 ---
     */
    public get offsetRatio(): number {
        return this.maxOffset ? this.offsetData / this.maxOffset : 0;
    }

    /**
     * --- 除去 block 剩余的 bar 部分的像素 ---
     */
    public get outBlockPx(): number {
        return this.barPx - this.blockPx;
    }

    /**
     * --- 当前位置（像素） ---
     */
    public get offsetPx(): number {
        return this.outBlockPx * this.offsetRatio;
    }

    /**
     * ---- wrap 的 touchstart 事件 ---
     */
    public wrapTouch(e: TouchEvent): void {
        // --- 防止在手机模式按下的状态下滚动条被自动隐藏，PC 下有 enter 所以没事 ---
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isEnter = true;
                if (this.propBoolean('float')) {
                    this.isShow = true;
                    if (this.hideTimer) {
                        clickgo.task.removeTimer(this.hideTimer);
                        this.hideTimer = 0;
                    }
                }
            },
            up: () => {
                this.isEnter = false;
                if (this.propBoolean('float')) {
                    this.hideTimer = clickgo.task.sleep(() => {
                        this.isShow = false;
                    }, 800);
                }
            }
        });
    }

    /** --- 上下控制按钮按下事件 --- */
    public controlDown(e: MouseEvent | TouchEvent, type: 'start' | 'end'): void {
        if (this.props.client >= this.props.length) {
            return;
        }
        clickgo.dom.bindDown(e, {
            down: () => {
                this.tran = clickgo.task.onFrame(() => {
                    if (type === 'start') {
                        // --- 向上 ---
                        if (this.offsetData - 10 < 0) {
                            if (this.offsetData !== 0) {
                                this.offsetData = 0;
                                this.emit('update:offset', this.offsetData);
                            }
                        }
                        else {
                            this.offsetData -= 10;
                            this.emit('update:offset', this.offsetData);
                        }
                    }
                    else {
                        // --- 向下 ---
                        if (this.offsetData + 10 > this.maxOffset) {
                            if (this.offsetData !== this.maxOffset) {
                                this.offsetData = this.maxOffset;
                                this.emit('update:offset', this.offsetData);
                            }
                        }
                        else {
                            this.offsetData += 10;
                            this.emit('update:offset', this.offsetData);
                        }
                    }
                });
            },
            up: () => {
                clickgo.task.offFrame(this.tran);
                this.tran = 0;
            }
        });
    }

    /**
     * --- block 的 down 事件 ---
     */
    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.dom.bindMove(e, {
            'areaObject': this.refs.bar,
            'object': this.refs.block,
            'move': (e, o) => {
                if ((this.props.direction === 'v' && o.inBorder.top) || (this.props.direction === 'h' && o.inBorder.left)) {
                    this.offsetData = 0;
                }
                else if ((this.props.direction === 'v' && o.inBorder.bottom) || (this.props.direction === 'h' && o.inBorder.right)) {
                    this.offsetData = this.maxOffset;
                }
                else {
                    const offsetPx = this.offsetPx + (this.props.direction === 'v' ? o.oy : o.ox);
                    /** --- 滚动百分比 --- */
                    const ratio = (this.outBlockPx > 0) ? (offsetPx / this.outBlockPx) : 0;
                    this.offsetData = Math.round(ratio * this.maxOffset);
                }
                this.emit('update:offset', this.offsetData);
            }
        });
    }

    /**
     * --- bar 的空白区域（非 down 区域）按下事件 ---
     */
    public barDown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        /** --- bar inner 的 rect 对象 --- */
        const barRect = this.refs.bar.getBoundingClientRect();
        /** --- bar inner 对应的 left 或 top 位置 --- */
        const barOffsetPx = this.props.direction === 'v' ? barRect.top : barRect.left;
        /** --- 鼠标点击在 bar 中的位置 --- */
        let eOffsetPx = this.props.direction === 'v' ? (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) : (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX);
        eOffsetPx = eOffsetPx - barOffsetPx;
        // --- 计算 offset px 位置 ---
        let offsetPx = eOffsetPx - this.blockPx / 2;
        if (offsetPx < 0) {
            offsetPx = 0;
        }
        if (offsetPx + this.blockPx > this.barPx) {
            offsetPx = this.barPx - this.blockPx;
        }
        /** --- 滚动百分比 --- */
        const ratio = (this.outBlockPx > 0) ? (offsetPx / this.outBlockPx) : 0;
        this.offsetData = Math.round(ratio * this.maxOffset);
        this.emit('update:offset', this.offsetData);
        this.down(e);
    }

    // --- 进入时保持滚动条常亮 ---
    public enter(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = true;
        if (this.propBoolean('float')) {
            this.isShow = true;
            if (this.hideTimer) {
                clickgo.task.removeTimer(this.hideTimer);
                this.hideTimer = 0;
            }
        }
    }

    // --- 移出后十滚动条隐藏 ---
    public leave(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.isEnter = false;
        if (this.propBoolean('float')) {
            this.hideTimer = clickgo.task.sleep(() => {
                this.isShow = false;
            }, 800);
        }
    }

    public onMounted(): void {
        const checkOffset = (): void => {
            if (this.offsetData <= this.maxOffset) {
                return;
            }
            this.offsetData = this.maxOffset;
            this.emit('update:offset', this.offsetData);
        };
        this.watch('length', checkOffset);
        this.watch('client', checkOffset);
        // --- 监听 prop 用户的 offset 设定 ---
        this.watch('offset', (): void => {
            if (this.offsetData === this.propInt('offset')) {
                return;
            }
            this.offsetData = this.propInt('offset');
            // --- 如果是隐藏状态，要显示一下 ---
            if (this.propBoolean('float') && !this.isEnter) {
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                }
                this.isShow = true;
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
        }, {
            'immediate': true
        });
        // --- 监听用户设定的浮动 ---
        this.watch('float', (): void => {
            if (this.propBoolean('float')) {
                // --- 设定为 true，隐藏 ---
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
            else {
                this.isShow = true;
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                    this.hideTimer = 0;
                }
            }
        }, {
            'immediate': true
        });
        // --- 监听 bar 的 size ---
        clickgo.dom.watchSize(this.refs.bar, () => {
            const barRect = this.refs.bar.getBoundingClientRect();
            this.barPx = this.props.direction === 'v' ? barRect.height : barRect.width;
            // --- bar 的 size 改了，整个 el 肯定也改了 ---
            const rect = this.element.getBoundingClientRect();
            this.width = rect.width;
            this.height = rect.height;
        }, true);
    }

    public onUnmounted(): void {
        if (this.hideTimer) {
            clickgo.task.offFrame(this.hideTimer);
        }
    }

}
