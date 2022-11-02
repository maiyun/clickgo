import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props = {
        'direction': 'h',

        'scrollLeft': 0,
        'scrollTop': 0
    };

    public text = '';

    public scrollLeftEmit = 0;

    public scrollTopEmit = 0;

    public clientWidth = 0;

    public clientHeight = 0;

    public lengthWidth = 0;

    public lengthHeight = 0;

    public touchX = 0;

    public touchY = 0;

    /** --- 当可以同鼠标滚动浏览器原生 overflow 时，则设置为 true，防止被上层的屏蔽掉滚动 scroll 效果 --- */
    public canTouchScroll = false;

    /** --- 本次是否滚动到了边缘 --- */
    public alreadySb = false;

    /**
     * --- 最大可拖动的 scroll 左侧位置 ---
     */
    public get maxScrollLeft(): number {
        return Math.round(this.lengthWidth - this.clientWidth);
    }

    /**
     * --- 最大可拖动的 scroll 顶部位置 ---
     */
    public get maxScrollTop(): number {
        return Math.round(this.lengthHeight - this.clientHeight);
    }

    public scroll(): void {
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

    public wheel(e: WheelEvent): void {
        const scrollTop = Math.ceil(this.element.scrollTop);
        const scrollLeft = Math.ceil(this.element.scrollLeft);
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // --- 竖向滚动 ---
            if (e.deltaY < 0) {
                // --- 向上滚 ---
                if (scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (scrollLeft > 0) {
                    // --- 上面不能滚但左边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollLeft = scrollLeft + e.deltaY; // deltaY 是负数，实际上是向左
                }
                else {
                    // --- 上边左边都不能滚 ---
                    if (this.props.direction === 'h') {
                        (e as any).direction = 'h';
                    }
                    this.emit('scrollborder', e);
                }
            }
            else {
                // --- 向下滚 ---
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    // --- 下面不能滚但右边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    // --- 下边右边都不能滚 ---
                    if (this.props.direction === 'h') {
                        (e as any).direction = 'h';
                    }
                    this.emit('scrollborder', e);
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (e.deltaX < 0) {
                // --- 向左滚 ---
                if (scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (scrollTop > 0) {
                    // --- 左面不能滚但上边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 左边上边都不能滚 ---
                    if (this.props.direction === 'v') {
                        (e as any).direction = 'v';
                    }
                    this.emit('scrollborder', e);
                }
            }
            else {
                // --- 向右滚 ---
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.element.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 右边下边都不能滚 ---
                    if (this.props.direction === 'v') {
                        (e as any).direction = 'v';
                    }
                    this.emit('scrollborder', e);
                }
            }
        }
    }

    public touch(e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
    }

    public move(e: TouchEvent): void {
        const scrollTop = Math.ceil(this.element.scrollTop);
        const scrollLeft = Math.ceil(this.element.scrollLeft);
        const deltaX = this.touchX - e.touches[0].clientX;
        const deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouchScroll) {
            // --- 必须有这个，要不然被上层的 e.preventDefault(); 给屏蔽不能拖动，可拖时必须 stopPropagation(虽然 wheel 已经有了 stioPropagation，但毕竟那是 wheel 的，touch 被 preventDefault 照样不能拖动) ---
            e.stopPropagation();
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // --- 竖向滚动 ---
            if (deltaY < 0) {
                // --- 向上滚 ---
                if (scrollTop > 0) {
                    // --- 可以滚动 ---
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
                // --- 向下滚 ---
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
            // --- 横向滚动 ---
            if (deltaX < 0) {
                // --- 向左滚 ---
                if (scrollLeft > 0) {
                    // --- 可以滚动 ---
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
                // --- 向右滚 ---
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

    public end(): void {
        this.alreadySb = false;
    }

    public refreshLength(): void {
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

    public onMounted(): void {
        this.watch('scrollLeft', (): void => {
            const sl = typeof this.props.scrollLeft === 'number' ? this.props.scrollLeft : parseInt(this.props.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.element.scrollLeft = this.props.scrollLeft;
        });
        this.watch('scrollTop', (): void => {
            const st = typeof this.props.scrollTop === 'number' ? this.props.scrollTop : parseInt(this.props.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.element.scrollTop = this.props.scrollTop;
        });

        // --- 大小改变，会影响 scroll offset、client，不会影响 length ---
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

        // --- 内容改变 ---
        clickgo.dom.watch(this.element, () => {
            this.refreshLength();
        }, 'childsub', true);
        clickgo.dom.watchStyle(this.element, ['padding', 'font'], () => {
            this.refreshLength();
        });

        // --- 对 scroll 位置进行归位 ---
        this.element.scrollTop = this.props.scrollTop;
        this.element.scrollLeft = this.props.scrollLeft;
    }

}
