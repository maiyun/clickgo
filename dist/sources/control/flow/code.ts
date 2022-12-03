import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'direction': 'h' | 'v';
        'selection': boolean | string;
        'gesture': string[] | string;

        'scrollLeft': number | string;
        'scrollTop': number | string;
    } = {
            'direction': 'h',
            'selection': false,
            'gesture': [],

            'scrollLeft': 0,
            'scrollTop': 0
        };

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
    public maxScrollLeft(): number {
        return this.element.scrollWidth - this.element.clientWidth;
    }

    /**
     * --- 最大可拖动的 scroll 顶部位置 ---
     */
    public maxScrollTop(): number {
        return this.element.scrollHeight - this.element.clientHeight;
    }

    /**
     * --- wrap 的 scroll 事件 ---
     */
    public scroll(): void {
        // --- scroll left ---
        let sl = Math.round(this.element.scrollLeft);
        const msl = this.maxScrollLeft();
        if (sl > msl) {
            sl = msl;
        }
        if (this.propInt('scrollLeft') !== sl) {
            this.emit('update:scrollLeft', sl);
        }
        // --- scroll top ---
        let st = Math.round(this.element.scrollTop);
        const mst = this.maxScrollTop();
        if (st > mst) {
            st = mst;
        }
        if (this.propInt('scrollTop') !== st) {
            this.emit('update:scrollTop', st);
        }
        if (!this.access.selectionTimer) {
            return;
        }
        this.refreshSelection(clickgo.dom.is.shift, clickgo.dom.is.ctrl);
    }

    /**
     * --- 电脑的 wheel 事件，横向滚动不能被屏蔽 ---
     */
    public wheel(e: WheelEvent): void {
        clickgo.dom.bindGesture(e, (e, dir) => {
            switch (dir) {
                case 'top': {
                    if (this.element.scrollTop > 0) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('top')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.element.scrollTop) < this.maxScrollTop()) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('bottom')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'left': {
                    if (this.element.scrollLeft > 0) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('left')) {
                            return true;
                        }
                    }
                    break;
                }
                default: {
                    if (Math.round(this.element.scrollLeft) < this.maxScrollLeft()) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('right')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }, (dir) => {
            this.emit('gesture', dir);
        });
    }

    public down(e: TouchEvent | MouseEvent): void {
        if (this.propBoolean('selection')) {
            const x: number = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
            const y: number = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
            // --- 鼠标手指只会响应一个，进行建立选区 ---
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
                            const maxLeft = this.maxScrollLeft();
                            // --- 向右滚动 ---
                            if (this.element.scrollLeft < maxLeft) {
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
                                if (this.element.scrollLeft + dist > maxLeft) {
                                    dist = maxLeft - this.element.scrollLeft;
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
                            const maxTop = this.maxScrollTop();
                            // --- 向右滚动 ---
                            if (this.element.scrollTop < maxTop) {
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
                                if (this.element.scrollTop + dist > maxTop) {
                                    dist = maxTop - this.element.scrollTop;
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
            if (e instanceof MouseEvent) {
                return;
            }
            // --- 仅 touch ---
            clickgo.dom.bindGesture(e, (ne, dir) => {
                switch (dir) {
                    case 'top': {
                        if (this.element.scrollTop > 0) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('top')) {
                                return true;
                            }
                        }
                        break;
                    }
                    case 'bottom': {
                        if (Math.round(this.element.scrollTop) < this.maxScrollTop()) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('bottom')) {
                                return true;
                            }
                        }
                        break;
                    }
                    case 'left': {
                        if (this.element.scrollLeft > 0) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('left')) {
                                return true;
                            }
                        }
                        break;
                    }
                    default: {
                        if (Math.round(this.element.scrollLeft) < this.maxScrollLeft()) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('right')) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }, (dir) => {
                this.emit('gesture', dir);
            });
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
            const maxWidth = this.maxScrollLeft() + this.element.clientWidth - area.x;
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
            const maxHeight = this.maxScrollTop() + this.element.clientHeight - area.y;
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

    public onMounted(): void {
        this.watch('scrollLeft', (): void => {
            const prop = this.propInt('scrollLeft');
            if (prop === Math.round(this.element.scrollLeft)) {
                return;
            }
            this.element.scrollLeft = prop;
        });
        this.watch('scrollTop', (): void => {
            const prop = this.propInt('scrollTop');
            if (prop === Math.round(this.element.scrollTop)) {
                return;
            }
            this.element.scrollTop = prop;
        });

        // --- 大小改变，会影响 scroll offset、client，也会影响 length ---
        clickgo.dom.watchSize(this.element, () => {
            this.emit('clientwidth', this.element.clientWidth);
            this.emit('clientheight', this.element.clientHeight);
        }, true);

        // --- 内容改变 ---
        clickgo.dom.watchProperty(this.element, ['scrollWidth', 'scrollHeight'], (name, val) => {
            this.emit(name.toLowerCase(), val);
        }, true);

        // --- 对 scroll 位置进行归位 ---
        this.element.scrollTop = this.propInt('scrollTop');
        this.element.scrollLeft = this.propInt('scrollLeft');
    }

}
