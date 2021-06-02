export let props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },
    'direction': {
        'default': 'h'
    },
    'padding': {
        'default': undefined
    },

    'adaptation': {
        'dafault': false
    },
    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    },
    'content': {
        'default': 'max'
    }
};

export let data = {
    'scrollLeftData': 0,
    'scrollTopData': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'clientWidth': 0,
    'clientHeight': 0,
    'clientInit': false,

    'lengthWidth': 0,
    'lengthHeight': 0,
    'lengthInit': false,

    // --- 惯性 ---
    'timer': false
};

export let watch = {
    'direction': function(this: IVueControl): void {
        let size = clickgo.dom.getSize(this.$refs.wrap);
        if (this.clientWidth !== size.innerWidth) {
            this.clientWidth = size.innerWidth;
        }
        if (this.clientHeight !== size.innerHeight) {
            this.clientHeight = size.innerHeight;
        }
        this.$emit('resize', this.direction === 'v' ? Math.round(this.clientHeight) : Math.round(this.clientWidth));
        this.$emit('resizen', this.direction === 'h' ? Math.round(this.clientHeight) : Math.round(this.clientWidth));

        /*
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.lengthWidth = innerRect.width;
        this.lengthHeight = innerRect.height;
        */
    },
    'scrollLeft': {
        handler: function(this: IVueControl): void {
            this.goScroll(this.scrollLeft, 'left');
        }
    },
    'scrollTop': {
        handler: function(this: IVueControl): void {
            this.goScroll(this.scrollTop, 'top');
        }
    }
};

export let computed = {
    'adaptationComp': function(this: IVueControl): boolean {
        if (typeof this.adaptation === 'string') {
            if (this.adaptation === 'false') {
                return false;
            }
            return true;
        }
        return this.adaptation ? true : false;
    },
    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVueControl): number {
        if (this.lengthWidth <= this.clientWidth) {
            return 0;
        }
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function(this: IVueControl): number {
        if (this.lengthHeight <= this.clientHeight) {
            return 0;
        }
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    }
};

export let methods = {
    wheel: function(this: IVueControl, e: WheelEvent): void {
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
                    this.refreshView();
                }
                else if (this.scrollLeftData > 0 && this.lengthHeight === this.clientHeight) {
                    // --- 上面不能滚但左边可以 ---
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshView();
                }
            }
            else {
                // --- 向下滚 ---
                if (this.scrollTopData < this.maxScrollTop) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaY;
                    this.refreshView();
                }
                else if (this.scrollLeftData < this.maxScrollLeft && this.lengthHeight === this.clientHeight) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaY;
                    this.refreshView();
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
                    this.refreshView();

                }
                else if (this.scrollTopData > 0 && this.lengthWidth === this.clientWidth) {
                    // --- 左面不能滚但上边可以 ---
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshView();
                }
            }
            else {
                // --- 向右滚 ---
                if (this.scrollLeftData < this.maxScrollLeft) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollLeftData += e.deltaX;
                    this.refreshView();
                }
                else if (this.scrollTopData < this.maxScrollTop && this.lengthWidth === this.clientWidth) {
                    this.stopAnimation();
                    e.stopPropagation();
                    e.preventDefault();
                    this.scrollTopData += e.deltaX;
                    this.refreshView();
                }
            }
        }
    },
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (this.cgIsMouseAlsoTouchEvent(e)) {
            return;
        }
        /*
        clickgo.form.changeFocus(this.formId);
        e.stopPropagation();
        */
        this.stopAnimation();
        let bindMove = (e: MouseEvent | TouchEvent): void => {
            let wrapSize = clickgo.dom.getSize(this.$refs.wrap);
            let top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
            let right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
            let bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
            let left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;

            /** --- 内容超出像素 --- */
            let overWidth = this.lengthWidth - this.clientWidth;
            let overHeight = this.lengthHeight - this.clientHeight;
            clickgo.dom.bindMove(e, {
                // 'showRect': true,
                'object': this.$refs.inner,
                'left': left - overWidth,
                'right': right + overWidth,
                'top': top - overHeight,
                'bottom': bottom + overHeight,
                'move': (ox: number, oy: number): void => {
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
                'up': async (moveTimes) => {
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
                    this.timer = true;

                    let leftEnd = false;
                    let topEnd = false;
                    let animation = (): void => {
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
                            this.timer = false;
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
                            this.timer = false;
                            return;
                        }

                        if (this.timer) {
                            requestAnimationFrame(animation);
                        }
                        else {
                            if (this.scrollLeftData > this.maxScrollLeft) {
                                this.scrollLeftData = this.maxScrollLeft;
                            }
                            if (this.scrollTopData > this.maxScrollTop) {
                                this.scrollTopData = this.maxScrollTop;
                            }
                        }
                    };
                    animation();

                    /*

                    // --- 以下为浏览器惯性，目前自己写，因为浏览器惯性无法有效的随时终止 ---

                    let speedLeft = Math.abs(moveLeftPos / (Date.now() - topTime));
                    let speedTop = Math.abs(moveTopPos / (Date.now() - topTime));
                    if (speedLeft <= 0.1 && speedTop <= 0.1) {
                        return;
                    }
                    this.tran = (speedLeft > speedTop ? speedLeft : speedTop) * 2000;
                    await this.$nextTick();
                    this.timer = setTimeout(() => {
                        this.timer = undefined;
                        this.tran = 0;
                    }, this.tran);
                    if (moveLeftPos > 0) {
                        this.scrollLeftData -= Math.round(speedLeft * 800);
                    }
                    else {
                        this.scrollLeftData += Math.round(speedLeft * 800);
                    }
                    if (moveTopPos > 0) {
                        this.scrollTopData -= Math.round(speedTop * 800);
                    }
                    else {
                        this.scrollTopData += Math.round(speedTop * 800);
                    }
                    let animation = (): void => {
                        if (!this.timer) {
                            return;
                        }
                        let wrapSize = clickgo.element.getSize(this.$refs.wrap);
                        let offsetLeft = Math.round(wrapSize.left + wrapSize.border.left + wrapSize.padding.left - this.$refs.inner.getBoundingClientRect().left);
                        let offsetTop = Math.round(wrapSize.top + wrapSize.border.top + wrapSize.padding.top - this.$refs.inner.getBoundingClientRect().top);

                        let leftEnd = false, topEnd = false;
                        if (offsetLeft > this.maxScrollLeft) {
                            leftEnd = true;
                            offsetLeft = this.maxScrollLeft;
                            this.scrollLeftData = offsetLeft;
                        }
                        else if (offsetLeft === this.maxScrollLeft) {
                            leftEnd = true;
                            if (this.scrollLeftData !== offsetLeft) {
                                this.scrollLeftData = offsetLeft;
                            }
                        }
                        else if (offsetLeft < 0) {
                            leftEnd = true;
                            offsetLeft = 0;
                            this.scrollLeftData = 0;
                        }
                        if (offsetTop > this.maxScrollTop) {
                            topEnd = true;
                            offsetTop = this.maxScrollTop;
                            this.scrollTopData = offsetTop;
                        }
                        else if (offsetTop === this.maxScrollTop) {
                            topEnd = true;
                            if (this.scrollTopData !== offsetTop) {
                                this.scrollTopData = offsetTop;
                            }
                        }
                        else if (offsetTop < 0) {
                            topEnd = true;
                            offsetTop = 0;
                            this.scrollTopData = 0;
                        }

                        // --- 检测是否终止滚动 ---
                        if (leftEnd && topEnd) {
                            clearTimeout(this.timer);
                            this.timer = undefined;
                            this.tran = 0;
                        }

                        this.scrollLeftEmit = offsetLeft;
                        this.$emit('update:scrollLeft', offsetLeft);
                        this.scrollTopEmit = offsetTop;
                        this.$emit('update:scrollTop', offsetTop);

                        requestAnimationFrame(animation);
                    };
                    animation();

                    */
                }
            });
        };
        let cancel = (e: MouseEvent | TouchEvent): void => {
            // --- 还没有进入 move 判断前就 mouseup 或者 touchend 则直接结束 ---
            if (e instanceof MouseEvent) {
                window.removeEventListener('mousemove', move);
                window.removeEventListener('mouseup', cancel);
            }
            else {
                (e.target as HTMLElement).removeEventListener('touchmove', move);
                (e.target as HTMLElement).removeEventListener('touchend', cancel);
                (e.target as HTMLElement).removeEventListener('touchcancel', cancel);
            }
        };
        let x: number = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
        let y: number = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
        let count: number = 0;
        let move = (e: MouseEvent | TouchEvent): void => {
            ++count;
            if (clickgo.dom.is.move) {
                cancel(e);
                return;
            }
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
                e.stopPropagation();
                bindMove(e);
            }
            cancel(e);
        };
        if (e instanceof MouseEvent) {
            window.addEventListener('mousemove', move, { 'passive': false });
            window.addEventListener('mouseup', cancel);
        }
        else {
            (e.target as HTMLElement).addEventListener('touchmove', move, { 'passive': false });
            (e.target as HTMLElement).addEventListener('touchend', cancel);
            (e.target as HTMLElement).addEventListener('touchcancel', cancel);
        }
        this.cgDown(e);
    },
    // --- 重置视图 scroll ---
    'refreshView': function(this: IVueControl): void {
        if (!this.lengthInit || !this.clientInit) {
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
    'goScroll': function(this: IVueControl, scroll: number | string, pos: 'left' | 'top'): void {
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
        if (this.timer) {
            this.timer = false;
        }
        this.refreshView();
    },
    // --- 如果当前正在运行动画，则终止他 ---
    stopAnimation: function(this: IVueControl): void {
        if (this.timer) {
            this.timer = false;
        }
    }
};

export let mounted = function(this: IVueControl): void {
    // --- 外部包裹的改变 ---
    clickgo.dom.watchSize(this.$refs.wrap, (size) => {
        let clientWidth = size.innerWidth;
        let clientHeight = size.innerHeight;
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
        this.refreshView();
    }, true);

    // --- 内部内容的改变 ---
    clickgo.dom.watchSize(this.$refs.inner, (size) => {
        let lengthWidth = size.width;
        let lengthHeight = size.height;
        if (lengthWidth !== this.lengthWidth) {
            this.lengthWidth = lengthWidth;
            if (this.direction === 'h') {
                this.$emit('change', Math.round(this.lengthWidth));
            }
        }
        if (lengthHeight !== this.lengthHeight) {
            this.lengthHeight = lengthHeight;
            if (this.direction === 'v') {
                this.$emit('change', Math.round(this.lengthHeight));
            }
        }
        if (!this.lengthInit) {
            this.lengthInit = true;
        }
        this.refreshView();
    }, true);

    // --- 对 scroll 位置进行归位 ---
    this.goScroll(this.scrollLeft, 'left');
    this.goScroll(this.scrollTop, 'top');
};

export let unmounted = function(this: IVueControl): void {
    if (this.timer) {
        this.timer = false;
    }
};
