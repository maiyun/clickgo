import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'selection': false | string;

        'scrollLeft': number | string;
        'scrollTop': number | string;
    } = {
            'direction': 'h',
            'selection': false,

            'scrollLeft': 0,
            'scrollTop': 0
        };

    public clientWidth = 0;

    public clientHeight = 0;

    public lengthWidth = 0;

    public lengthHeight = 0;

    public touchX = 0;

    public touchY = 0;

    /** --- 当可以用手指操作滚动时则设置为 true，防止被上层的屏蔽掉滚动 scroll 效果 --- */
    public canTouchScroll = false;

    /** --- 本次是否滚动到了边缘 --- */
    public alreadySb = false;

    public access = {
        /** --- 选框开始时的鼠标坐标原点相对于元素本身 --- */
        'selectionOrigin': { 'x': 0, 'y': 0 },
        /** --- 当前画选框时的指针坐标相对于屏幕 --- */
        'selectionCurrent': { 'x': 0, 'y': 0, 'quick': false },
        /** --- 选框的 timer --- */
        'selectionTimer': 0
    };

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
        if (this.props.scrollLeft !== sl) {
            this.emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.element.scrollTop);
        if (this.props.scrollTop !== st) {
            this.emit('update:scrollTop', st);
        }
        this.refreshSelection(clickgo.dom.is.shift, clickgo.dom.is.ctrl);
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

    public down(e: TouchEvent | MouseEvent): void {
        if (this.propBoolean('selection')) {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            // --- 鼠标手指只会响应一个，进行建立选区 ---
            const x: number = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
            const y: number = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
            clickgo.dom.bindDown(e, {
                start: (): void => {
                    const rect = this.element.getBoundingClientRect();
                    this.access.selectionOrigin.x = x - rect.left + this.element.scrollLeft;
                    this.access.selectionOrigin.y = y - rect.top + this.element.scrollTop;
                    this.refs.selection.style.opacity = '1';
                    this.access.selectionCurrent.x = x;
                    this.access.selectionCurrent.y = y;
                    this.access.selectionTimer = clickgo.task.onFrame(() => {
                        const rect = this.element.getBoundingClientRect();
                        // --- 横向 ---
                        if (this.access.selectionCurrent.x < rect.left) {
                            // --- 向左滚动 ---
                            if (this.element.scrollLeft > 0) {
                                /** --- 差值 --- */
                                const x = rect.left - this.access.selectionCurrent.x;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
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
                            // --- 向右滚动 ---
                            if (this.element.scrollLeft < this.maxScrollLeft) {
                                /** --- 差值 --- */
                                const x = this.access.selectionCurrent.x - rect.right;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
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
                        // --- 纵向 ---
                        if (this.access.selectionCurrent.y < rect.top) {
                            // --- 向左滚动 ---
                            if (this.element.scrollTop > 0) {
                                /** --- 差值 --- */
                                const x = rect.top - this.access.selectionCurrent.y;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
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
                            // --- 向右滚动 ---
                            if (this.element.scrollTop < this.maxScrollTop) {
                                /** --- 差值 --- */
                                const x = this.access.selectionCurrent.y - rect.bottom;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
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
                move: (ne: MouseEvent | TouchEvent): void => {
                    const nx: number = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                    const ny: number = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                    // --- 更新自动滚动需要用到的坐标信息 ---
                    this.access.selectionCurrent.x = nx;
                    this.access.selectionCurrent.y = ny;
                    this.access.selectionCurrent.quick = true;
                    // --- 更新 selection 区域 ---
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

    // --- 当 scroll 触发或者手动 move 后，需要刷新 selection area 区域 ---
    public refreshSelection(shift: boolean = false, ctrl: boolean = false): void {
        if (!this.access.selectionTimer) {
            return;
        }
        const rect = this.element.getBoundingClientRect();
        /** --- 相对实际内容的 x 坐标 --- */
        const x = this.access.selectionCurrent.x - rect.left + this.element.scrollLeft;
        /** --- 相对实际内容的 y 坐标 --- */
        const y = this.access.selectionCurrent.y - rect.top + this.element.scrollTop;
        /** --- 要显示的区域 --- */
        const area = {
            'x': 0,
            'y': 0,
            'width': 0,
            'height': 0,
            'shift': shift,
            'ctrl': ctrl
        };
        if (x >= this.access.selectionOrigin.x) {
            // --- 右 ---
            area.x = Math.round(this.access.selectionOrigin.x);
            area.width = Math.round(x - this.access.selectionOrigin.x);
            const maxWidth = this.maxScrollLeft + this.clientWidth - area.x;
            if (area.width > maxWidth) {
                area.width = maxWidth;
            }
        }
        else {
            // --- 左 ---
            area.x = Math.round(x);
            if (area.x < 0) {
                area.x = 0;
            }
            area.width = Math.round(this.access.selectionOrigin.x - area.x);
        }
        // --- y ---
        if (y >= this.access.selectionOrigin.y) {
            // --- 下 ---
            area.y = Math.round(this.access.selectionOrigin.y);
            area.height = Math.round(y - this.access.selectionOrigin.y);
            const maxHeight = this.maxScrollTop + this.clientHeight - area.y;
            if (area.height > maxHeight) {
                area.height = maxHeight;
            }
        }
        else {
            // --- 上 ---
            area.y = Math.round(y);
            if (area.y < 0) {
                area.y = 0;
            }
            area.height = Math.round(this.access.selectionOrigin.y - area.y);
        }
        // --- 更新选框位置和大小 ---
        this.refs.selection.style.left = area.x.toString() + 'px';
        this.refs.selection.style.top = area.y.toString() + 'px';
        this.refs.selection.style.width = area.width.toString() + 'px';
        this.refs.selection.style.height = area.height.toString() + 'px';
        // --- 响应 select 事件 ---
        this.emit('select', area);
    }

    public move(e: TouchEvent): void {
        if (this.propBoolean('selection')) {
            return;
        }
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
            if (this.propInt('scrollLeft') === this.element.scrollLeft) {
                return;
            }
            this.element.scrollLeft = this.propInt('scrollLeft');
        });
        this.watch('scrollTop', (): void => {
            if (this.propInt('scrollTop') ===  this.element.scrollTop) {
                return;
            }
            this.element.scrollTop = this.propInt('scrollTop');
        });

        // --- 大小改变，会影响 scroll offset、client，也会影响 length ---
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
        this.element.scrollTop = this.propInt('scrollTop');
        this.element.scrollLeft = this.propInt('scrollLeft');
    }

}
