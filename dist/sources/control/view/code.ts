export let props = {
    'direction': {
        'default': 'h'
    },

    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    },
    'selection': {
        'default': false
    },
    'content': {
        'default': undefined
    },
    'solo': {
        'default': true
    }
};

export let data = {
    'padding': '',

    'scrollLeftData': 0,
    'scrollTopData': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'clientWidth': 0,
    'clientHeight': 0,
    'clientInit': false,

    'lengthWidth': -1,
    'lengthHeight': -1,
    'lengthEmit': -1,

    'selectionOrigin': {x: 0, y: 0},
    'selectionCurrent': {x: 0, y: 0, quick: false},

    // --- 惯性 ---
    'timer': 0,
    'selectionTimer': 0
};

export let watch = {
    'direction': function(this: IVControl): void {
        let size = clickgo.dom.getSize(this.$el);
        if (this.clientWidth !== size.clientWidth) {
            this.clientWidth = size.clientWidth;
        }
        if (this.clientHeight !== size.clientHeight) {
            this.clientHeight = size.clientHeight;
        }
        this.$emit('resize', this.direction === 'v' ? Math.round(this.clientHeight) : Math.round(this.clientWidth));
        this.$emit('resizen', this.direction === 'h' ? Math.round(this.clientHeight) : Math.round(this.clientWidth));
    },
    'scrollLeft': {
        handler: function(this: IVControl): void {
            this.goScroll(this.scrollLeft, 'left');
        }
    },
    'scrollTop': {
        handler: function(this: IVControl): void {
            this.goScroll(this.scrollTop, 'top');
        }
    },

    'scrollLeftData': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            // --- 重置框选区域 ---
            this.refreshSelection();
        }
    },
    'scrollTopData': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            // --- 重置框选区域 ---
            this.refreshSelection();
        }
    }
};

export let computed = {
    'isSelection': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.selection);
    },
    'isSolo': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.solo);
    },

    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVControl): number {
        if (this.lengthWidth <= this.clientWidth) {
            return 0;
        }
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function(this: IVControl): number {
        if (this.lengthHeight <= this.clientHeight) {
            return 0;
        }
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    },

    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export let methods = {
    wheel: function(this: IVControl, e: WheelEvent): void {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // --- 竖向滚动 ---
            if (e.deltaY < 0) {
                // --- 向上滚 ---
                if (this.scrollTopData > 0) {
                    // --- 可以滚动 ---
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaY;
                    this.refreshScroll();
                }
                else if (this.scrollLeftData > 0 && this.lengthHeight <= this.clientHeight) {
                    // --- 上面不能滚但左边可以 ---
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshScroll();
                }
            }
            else {
                // --- 向下滚 ---
                if (this.scrollTopData < this.maxScrollTop) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaY;
                    this.refreshScroll();
                }
                else if (this.scrollLeftData < this.maxScrollLeft && this.lengthHeight <= this.clientHeight) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshScroll();
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (e.deltaX < 0) {
                // --- 向左滚 ---
                if (this.scrollLeftData > 0) {
                    // --- 可以滚动 ---
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaX;
                    this.refreshScroll();

                }
                else if (this.scrollTopData > 0 && this.lengthWidth <= this.clientWidth) {
                    // --- 左面不能滚但上边可以 ---
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshScroll();
                }
            }
            else {
                // --- 向右滚 ---
                if (this.scrollLeftData < this.maxScrollLeft) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaX;
                    this.refreshScroll();
                }
                else if (this.scrollTopData < this.maxScrollTop && this.lengthWidth <= this.clientWidth) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshScroll();
                }
            }
        }
    },
    down: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.stopAnimation();
        let bindMove = (e: MouseEvent | TouchEvent): void => {
            let size = clickgo.dom.getSize(this.$el);
            /** --- 内容超出像素 --- */
            let overWidth = this.lengthWidth - this.clientWidth;
            let overHeight = this.lengthHeight - this.clientHeight;
            clickgo.dom.bindMove(e, {
                // 'showRect': true,
                'object': this.$refs.inner,
                'left': size.left + size.border.left - (overWidth > 0 ? overWidth : 0),
                'right': overWidth > 0 ? (size.right - size.border.right + overWidth) : (size.left + size.border.left + this.lengthWidth),
                'top': size.top + size.border.top - (overHeight > 0 ? overHeight : 0),
                'bottom': overHeight > 0 ? (size.bottom - size.border.bottom + overHeight) : (size.top + size.border.top + this.lengthHeight),
                move: (ox: number, oy: number): void => {
                    this.scrollLeftData -= ox;
                    this.scrollTopData -= oy;
                    let sleft = Math.round(this.scrollLeftData);
                    if (sleft > this.maxScrollLeft) {
                        sleft = this.maxScrollLeft;
                    }
                    if (this.scrollLeftEmit !== sleft) {
                        this.scrollLeftEmit = sleft;
                        this.$emit('update:scrollLeft', this.scrollLeftEmit);
                    }
                    let stop = Math.round(this.scrollTopData);
                    if (stop > this.maxScrollTop) {
                        stop = this.maxScrollTop;
                    }
                    if (this.scrollTopEmit !== stop) {
                        this.scrollTopEmit = stop;
                        this.$emit('update:scrollTop', this.scrollTopEmit);
                    }
                },
                up: async (moveTimes) => {
                    // --- 获取 100 毫秒内的偏移 ---
                    let moveLeftPos = 0;
                    let moveTopPos = 0;
                    let topTime = 0;
                    let nowDate = Date.now();
                    for (let item of moveTimes) {
                        if (nowDate - item.time > 150) {
                            continue;
                        }
                        moveLeftPos += item.ox;
                        moveTopPos += item.oy;
                        if (topTime === 0 || topTime > item.time) {
                            topTime = item.time;
                        }
                    }
                    if (topTime === 0) {
                        // --- 无需缓动 ---
                        this.scrollLeftData = Math.round(this.scrollLeftData);
                        if (this.scrollLeftData > this.maxScrollLeft) {
                            this.scrollLeftData = this.maxScrollLeft;
                        }
                        this.scrollTopData = Math.round(this.scrollTopData);
                        if (this.scrollTopData > this.maxScrollTop) {
                            this.scrollTopData = this.maxScrollTop;
                        }
                        return;
                    }

                    let speedLeft = (moveLeftPos / (Date.now() - topTime)) * 16;
                    let speedTop = (moveTopPos / (Date.now() - topTime)) * 16;

                    let fleft = 0;
                    let ftop = 0;

                    let leftEnd = false;
                    let topEnd = false;

                    this.timer = this.cgAddFrameListener(() => {
                        if (!leftEnd) {
                            fleft = Math.min(Math.abs(speedLeft) / 32, 0.5);
                            if (speedLeft > 0.2) {
                                speedLeft -= fleft;
                                this.scrollLeftData -= speedLeft;
                            }
                            else if (speedLeft < -0.2) {
                                speedLeft += fleft;
                                this.scrollLeftData -= speedLeft;
                            }
                            else {
                                leftEnd = true;
                            }
                        }
                        if (!topEnd) {
                            ftop = Math.min(Math.abs(speedTop) / 32, 0.5);
                            if (speedTop > 0.2) {
                                speedTop -= ftop;
                                this.scrollTopData -= speedTop;
                            }
                            else if (speedTop < -0.2) {
                                speedTop += ftop;
                                this.scrollTopData -= speedTop;
                            }
                            else {
                                topEnd = true;
                            }
                        }

                        // --- 检测是否终止滚动，本轮就未发生移动，无需 emit ---
                        if (leftEnd && topEnd) {
                            this.scrollLeftData = Math.round(this.scrollLeftData);
                            if (this.scrollLeftData > this.maxScrollLeft) {
                                this.scrollLeftData = this.maxScrollLeft;
                            }
                            this.scrollTopData = Math.round(this.scrollTopData);
                            if (this.scrollTopData > this.maxScrollTop) {
                                this.scrollTopData = this.maxScrollTop;
                            }
                            this.cgRemoveFrameListener(this.timer);
                            this.timer = 0;
                            return;
                        }

                        if (this.scrollLeftData > this.maxScrollLeft) {
                            leftEnd = true;
                            this.scrollLeftData = this.maxScrollLeft;
                        }
                        else if (this.scrollLeftData < 0) {
                            leftEnd = true;
                            this.scrollLeftData = 0;
                        }
                        else if (this.scrollLeftData === this.maxScrollLeft) {
                            leftEnd = true;
                        }
                        if (this.scrollTopData > this.maxScrollTop) {
                            topEnd = true;
                            this.scrollTopData = this.maxScrollTop;
                        }
                        else if (this.scrollTopData < 0) {
                            topEnd = true;
                            this.scrollTopData = 0;
                        }
                        else if (this.scrollTopData === this.maxScrollTop) {
                            topEnd = true;
                        }

                        this.scrollLeftEmit = Math.round(this.scrollLeftData);
                        this.$emit('update:scrollLeft', this.scrollLeftEmit);
                        this.scrollTopEmit = Math.round(this.scrollTopData);
                        this.$emit('update:scrollTop', this.scrollTopEmit);

                        if (leftEnd && topEnd) {
                            this.cgRemoveFrameListener(this.timer);
                            this.timer = 0;
                        }
                    });
                }
            });
        };

        let x: number = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        let y: number = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        if (this.isSelection) {
            // --- 建立选区 ---
            if (clickgo.dom.findParentByData(e.target as HTMLElement, 'cg-selection-cancel')) {
                return;
            }
            clickgo.dom.bindDown(e, {
                start: (): void => {
                    let innerRect = this.$refs.inner.getBoundingClientRect();
                    this.selectionOrigin.x = x - innerRect.left;
                    this.selectionOrigin.y = y - innerRect.top;
                    this.$refs.selection.style.opacity = '1';
                    this.$refs.selection.style.left = this.selectionOrigin.x + 'px';
                    this.$refs.selection.style.top = this.selectionOrigin.y + 'px';
                    this.selectionCurrent.x = x;
                    this.selectionCurrent.y = y;
                    this.selectionTimer = this.cgAddFrameListener(() => {
                        let rect = this.$el.getBoundingClientRect();
                        // --- 横向 ---
                        if (this.selectionCurrent.x < rect.left) {
                            // --- 向左滚动 ---
                            if (this.scrollLeftData > 0) {
                                /** --- 差值 --- */
                                let x = rect.left - this.selectionCurrent.x;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollLeftData - dist < 0) {
                                    dist = this.scrollLeftData;
                                }
                                this.scrollLeftData -= dist;
                                this.scrollLeftEmit = Math.round(this.scrollLeftData);
                                this.$emit('update:scrollLeft', this.scrollLeftEmit);
                            }
                        }
                        else if (this.selectionCurrent.x > rect.right) {
                            // --- 向右滚动 ---
                            if (this.scrollLeftData < this.maxScrollLeft) {
                                /** --- 差值 --- */
                                let x = this.selectionCurrent.x - rect.right;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollLeftData + dist > this.maxScrollLeft) {
                                    dist = this.maxScrollLeft - this.scrollLeftData;
                                }
                                this.scrollLeftData += dist;
                                this.scrollLeftEmit = Math.round(this.scrollLeftData);
                                this.$emit('update:scrollLeft', this.scrollLeftEmit);
                            }
                        }
                        // --- 纵向 ---
                        if (this.selectionCurrent.y < rect.top) {
                            // --- 向左滚动 ---
                            if (this.scrollTopData > 0) {
                                /** --- 差值 --- */
                                let x = rect.top - this.selectionCurrent.y;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollTopData - dist < 0) {
                                    dist = this.scrollTopData;
                                }
                                this.scrollTopData -= dist;
                                this.scrollTopEmit = Math.round(this.scrollTopData);
                                this.$emit('update:scrollTop', this.scrollTopEmit);
                            }
                        }
                        else if (this.selectionCurrent.y > rect.bottom) {
                            // --- 向右滚动 ---
                            if (this.scrollTopData < this.maxScrollTop) {
                                /** --- 差值 --- */
                                let x = this.selectionCurrent.y - rect.bottom;
                                /** --- 移动的距离 --- */
                                let dist = 0;
                                // --- 判断是否是 quick 模式，将加速滚动 ---
                                if (this.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.scrollTopData + dist > this.maxScrollTop) {
                                    dist = this.maxScrollTop - this.scrollTopData;
                                }
                                this.scrollTopData += dist;
                                this.scrollTopEmit = Math.round(this.scrollTopData);
                                this.$emit('update:scrollTop', this.scrollTopEmit);
                            }
                        }
                    });
                    this.$emit('beforeselect');
                },
                move: (ne: MouseEvent | TouchEvent): void => {
                    let nx: number = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                    let ny: number = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                    // --- 更新自动滚动需要用到的坐标信息 ---
                    this.selectionCurrent.x = nx;
                    this.selectionCurrent.y = ny;
                    this.selectionCurrent.quick = true;
                    // --- 更新 selection 区域 ---
                    this.refreshSelection(ne.shiftKey, ne.ctrlKey);
                },
                end: () => {
                    this.$refs.selection.style.opacity = '0';
                    this.cgRemoveFrameListener(this.selectionTimer);
                    this.selectionTimer = 0;
                    this.$emit('afterselect');
                }
            });
        }
        else {
            // --- 普通拖滚动 ---
            let count: number = 0;
            let cancel: boolean = false;
            clickgo.dom.bindDown(e, {
                move: (e: MouseEvent | TouchEvent): void => {
                    if (cancel) {
                        return;
                    }
                    if (clickgo.dom.is.move) {
                        // --- 大概率子项已经在滚动了，所以本项不能滚动 ---
                        cancel = true;
                        return;
                    }
                    if (this.isSolo) {
                        // --- 无论如何都可以被滚动 ---
                        bindMove(e);
                        cancel = true;
                        return;
                    }
                    ++count;
                    if(count < 3) {
                        return;
                    }
                    let deltaX: number = x - ((e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX);
                    let deltaY: number = y - ((e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY);
                    if (deltaX === 0 && deltaY === 0) {
                        return;
                    }
                    let isWheel: boolean = false;
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        // --- 竖向滚动 ---
                        if (deltaY < 0) {
                            // --- 向上滚 ---
                            if (this.scrollTopData > 0) {
                                // --- 可以滚动 ---
                                isWheel = true;
                            }
                        }
                        else if (deltaY > 0) {
                            // --- 向下滚 ---
                            if (this.scrollTopData < this.maxScrollTop) {
                                isWheel = true;
                            }
                        }
                    }
                    else {
                        // --- 横向滚动 ---
                        if (deltaX < 0) {
                            // --- 向左滚 ---
                            if (this.scrollLeftData > 0) {
                                // --- 可以滚动 ---
                                isWheel = true;
                            }
                        }
                        else if (deltaX > 0) {
                            // --- 向右滚 ---
                            if (this.scrollLeftData < this.maxScrollLeft) {
                                isWheel = true;
                            }
                        }
                    }
                    if (isWheel) {
                        bindMove(e);
                    }
                    cancel = true;
                }
            });
        }
    },
    // --- 重置 length ---
    refreshLength: function(this: IVControl): void {
        if (this.lengthWidth === -1 || this.lengthHeight === -1) {
            return;
        }
        let length = 0;
        if (this.direction === 'h') {
            length = Math.round(this.lengthWidth < this.clientWidth ? this.clientWidth : this.lengthWidth);
        }
        else {
            length = Math.round(this.lengthHeight < this.clientHeight ? this.clientHeight : this.lengthHeight);
        }
        if (length !== this.lengthEmit) {
            this.lengthEmit = length;
            this.$emit('change', length);
        }
        this.refreshScroll();
    },
    // --- 重置视图 scroll ---
    refreshScroll: function(this: IVControl): void {
        if (this.lengthEmit === -1 || !this.clientInit) {
            return;
        }
        if (this.scrollLeftData > this.maxScrollLeft) {
            this.scrollLeftData = this.maxScrollLeft;
        }
        else if (this.scrollLeftData < 0) {
            this.scrollLeftData = 0;
        }
        if (this.scrollTopData > this.maxScrollTop) {
            this.scrollTopData = this.maxScrollTop;
        }
        else if (this.scrollTopData < 0) {
            this.scrollTopData = 0;
        }

        let sleft = Math.round(this.scrollLeftData);
        if (this.scrollLeftEmit !== sleft) {
            this.scrollLeftEmit = sleft;
            this.$emit('update:scrollLeft', this.scrollLeftEmit);
        }
        let stop = Math.round(this.scrollTopData);
        if (this.scrollTopEmit !== stop) {
            this.scrollTopEmit = stop;
            this.$emit('update:scrollTop', this.scrollTopEmit);
        }
    },
    // --- 设定滚动位置，但不执行任何 emit 方法，仅仅应用位置，位置既为上级传来来的合理值 ---
    goScroll: function(this: IVControl, scroll: number | string, pos: 'left' | 'top'): void {
        scroll = typeof scroll === 'number' ? scroll : parseInt(scroll);
        if (pos === 'left') {
            if (scroll === this.scrollLeftEmit) {
                return;
            }
            else {
                this.scrollLeftData = scroll;
                this.scrollLeftEmit = scroll;
            }
        }
        else {
            if (scroll === this.scrollTopEmit) {
                return;
            }
            else {
                this.scrollTopData = scroll;
                this.scrollTopEmit = scroll;
            }
        }
        if (this.timer > 0) {
            this.cgRemoveFrameListener(this.timer);
            this.timer = 0;
        }
        this.refreshScroll();
    },
    // --- 如果当前正在运行动画，则终止他 ---
    stopAnimation: function(this: IVControl): void {
        if (this.timer > 0) {
            this.cgRemoveFrameListener(this.timer);
            this.timer = 0;
        }
    },
    // --- 当 scroll 触发或者手动 move 后，需要刷新 selection area 区域 ---
    refreshSelection: function(this: IVControl, shift: boolean = false, ctrl: boolean = false): void {
        if (!this.selectionTimer) {
            return;
        }
        let innerRect = this.$refs.inner.getBoundingClientRect();
        /** --- 相对实际内容的 x 坐标 --- */
        let sx = this.selectionCurrent.x - innerRect.left;
        /** --- 相对实际内容的 y 坐标 --- */
        let sy = this.selectionCurrent.y - innerRect.top;
        /** --- 要显示的区域 --- */
        let area = {
            'x': 0,
            'y': 0,
            'width': 0,
            'height': 0,
            'shift': shift,
            'ctrl': ctrl
        };
        if (sx >= this.selectionOrigin.x) {
            // --- 右 ---
            area.x = Math.round(this.selectionOrigin.x);
            area.width = Math.round(sx - this.selectionOrigin.x);
        }
        else {
            // --- 左 ---
            area.x = Math.round(sx);
            area.width = Math.round(this.selectionOrigin.x - sx);
        }
        // --- y ---
        if (sy >= this.selectionOrigin.y) {
            // --- 下 ---
            area.y = Math.round(this.selectionOrigin.y);
            area.height = Math.round(sy - this.selectionOrigin.y);
        }
        else {
            // --- 上 ---
            area.y = Math.round(sy);
            area.height = Math.round(this.selectionOrigin.y - sy);
        }
        // --- 更新选框位置和大小 ---
        this.$refs.selection.style.left = area.x + 'px';
        this.$refs.selection.style.top = area.y + 'px';
        this.$refs.selection.style.width = area.width + 'px';
        this.$refs.selection.style.height = area.height + 'px';
        // --- 响应 select 事件 ---
        this.$emit('select', area);
    }
};

export let mounted = function(this: IVControl): void {
    // --- 外部包裹的改变 ---
    clickgo.dom.watchSize(this.$el, (size) => {
        let clientWidth = size.clientWidth;
        let clientHeight = size.clientHeight;
        if (this.direction === 'v') {
            // --- 垂直 ---
            if (this.clientWidth !== clientWidth) {
                this.clientWidth = clientWidth;
                this.$emit('resizen', Math.round(this.clientWidth));
            }
            if (clientHeight !== this.clientHeight) {
                this.clientHeight = clientHeight;
                this.$emit('resize', Math.round(this.clientHeight));
            }
        }
        else {
            // --- 水平 ---
            if (this.clientHeight !== clientHeight) {
                this.clientHeight = clientHeight;
                this.$emit('resizen', Math.round(this.clientHeight));
            }
            if (clientWidth !== this.clientWidth) {
                this.clientWidth = clientWidth;
                this.$emit('resize', Math.round(this.clientWidth));
            }
        }
        if (!this.clientInit) {
            this.clientInit = true;
        }
        this.refreshLength();
    }, true);

    // --- 内部内容的改变 ---
    clickgo.dom.watchSize(this.$refs.inner, (size) => {
        if (size.width !== this.lengthWidth) {
            this.lengthWidth = size.width;
        }
        if (size.height !== this.lengthHeight) {
            this.lengthHeight = size.height;
        }
        this.refreshLength();
    }, true);

    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);

    // --- 对 scroll 位置进行归位 ---
    this.goScroll(this.scrollLeft, 'left');
    this.goScroll(this.scrollTop, 'top');
};

export let unmounted = function(this: IVControl): void {
    if (this.timer > 0) {
        this.cgRemoveFrameListener(this.timer);
        this.timer = 0;
    }
};
