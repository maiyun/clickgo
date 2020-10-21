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
        'default': 'v'
    },
    'padding': {
        'default': undefined
    },

    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    }
};

export let data = {
    'scrollLeftData': 0,
    'scrollTopData': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'clientWidth': 0,
    'clientHeight': 0,

    'lengthWidth': 0,
    'lengthHeight': 0,

    // --- 惯性 ---
    'timer': false
};

export let watch = {
    'direction': function(this: IVue): void {
        let size = clickgo.element.getSize(this.$refs.wrap);
        this.clientWidth = Math.round(size.innerWidth);
        this.clientHeight = Math.round(size.innerHeight);
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.lengthWidth = Math.round(innerRect.width);
        this.lengthHeight = Math.round(innerRect.height);
    },
    'scrollLeft': {
        handler: function(this: IVue): void {
            this.goScroll(this.scrollLeft, 'left');
        },
        'immediate': true
    },
    'scrollTop': {
        handler: function(this: IVue): void {
            this.goScroll(this.scrollTop, 'top');
        },
        'immediate': true
    }
};

export let computed = {
    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVueControl): number {
        if (this.lengthWidth <= this.clientWidth) {
            return 0;
        }
        return Math.round(this.lengthWidth - this.clientWidth);
    },
    'maxScrollTop': function(this: IVueControl): number {
        if (this.lengthHeight <= this.clientHeight) {
            return 0;
        }
        return Math.round(this.lengthHeight - this.clientHeight);
    },
    'widthPx': function(this: IVue): string | undefined {
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            let parent = this.$parent;
            if (parent?.$data._controlName === 'greatview') {
                parent = parent.$parent;
            }
            return parent?.direction ? (parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function(this: IVue): string | undefined {
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            let parent = this.$parent;
            if (parent?.$data._controlName === 'greatview') {
                parent = parent.$parent;
            }
            return parent?.direction ? (parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};

export let methods = {
    wheel: function(this: IVue, e: WheelEvent): void {
        // --- 用来屏蔽不小心触发前进、后退的浏览器事件 ---
        e.preventDefault();
        // --- 屏蔽惯性动画 ---
        if (this.timer) {
            this.timer = false;
        }

        if (this.direction === 'v') {
            if (this.lengthWidth <= this.clientWidth) {
                this.scrollTopData += Math.round(e.deltaY === 0 ? e.deltaX : e.deltaY);
            }
            else {
                this.scrollTopData += e.deltaY;
                this.scrollLeftData += e.deltaX;
            }
        }
        else {
            if (this.lengthHeight <= this.clientHeight) {
                this.scrollLeftData += Math.round(e.deltaX === 0 ? e.deltaY : e.deltaX);
            }
            else {
                this.scrollTopData += e.deltaY;
                this.scrollLeftData += e.deltaX;
            }
        }
        this.refreshView();
    },
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }

        let wrapSize = clickgo.element.getSize(this.$refs.wrap);
        let top = wrapSize.top + wrapSize.border.top + wrapSize.padding.top;
        let right = wrapSize.right - wrapSize.border.right - wrapSize.padding.right;
        let bottom = wrapSize.bottom - wrapSize.border.bottom - wrapSize.padding.bottom;
        let left = wrapSize.left + wrapSize.border.left + wrapSize.padding.left;
        if (this.timer) {
            this.timer = false;
        }

        /** --- 内容超出像素 --- */
        let overWidth = this.lengthWidth - this.clientWidth;
        let overHeight = this.lengthHeight - this.clientHeight;
        clickgo.element.bindMove(e, {
            // 'showRect': true,
            'object': this.$refs.inner,
            'left': left - (overWidth < 0 ? 0 : overWidth),
            'right': right + overWidth,
            'top': top - (overHeight < 0 ? 0 : overHeight),
            'bottom': bottom + overHeight,
            'move': (ox, oy) => {
                this.scrollLeftData -= ox;
                this.scrollTopData -= oy;
                if (this.scrollLeftEmit !== this.scrollLeftData) {
                    this.scrollLeftEmit = this.scrollLeftData;
                    this.$emit('update:scrollLeft', this.scrollLeftData);
                }
                if (this.scrollTopEmit !== this.scrollTopData) {
                    this.scrollTopEmit = this.scrollTopData;
                    this.$emit('update:scrollTop', this.scrollTopData);
                }
            },
            'end': async (moveTimes) => {
                // --- 获取 200 毫秒内的偏移 ---
                let moveLeftPos = 0;
                let moveTopPos = 0;
                let topTime = 0;
                let nowDate = Date.now();
                for (let item of moveTimes) {
                    if (nowDate - item.time > 100) {
                        continue;
                    }
                    moveLeftPos += item.ox;
                    moveTopPos += item.oy;
                    if (topTime === 0 || topTime > item.time) {
                        topTime = item.time;
                    }
                }
                if (topTime === 0) {
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
        this.cgDown();
    },
    // --- 重置视图 scroll ---
    'refreshView': function(this: IVue): void {
        let leftEnd = false, topEnd = false;
        if (this.scrollLeftData > this.maxScrollLeft) {
            leftEnd = true;
            this.scrollLeftData = this.maxScrollLeft;
        }
        else if (this.scrollLeftData === this.maxScrollLeft) {
            leftEnd = true;
        }
        else if (this.scrollLeftData < 0) {
            leftEnd = true;
            this.scrollLeftData = 0;
        }
        if (this.scrollTopData > this.maxScrollTop) {
            topEnd = true;
            this.scrollTopData = this.maxScrollTop;
        }
        else if (this.scrollTopData === this.maxScrollTop) {
            topEnd = true;
        }
        else if (this.scrollTopData < 0) {
            topEnd = true;
            this.scrollTopData = 0;
        }

        // --- 检测是否终止滚动 ---
        if (leftEnd && topEnd) {
            this.timer = false;
        }

        this.scrollLeftEmit = this.scrollLeftData;
        this.$emit('update:scrollLeft', this.scrollLeftData);
        this.scrollTopEmit = this.scrollTopData;
        this.$emit('update:scrollTop', this.scrollTopData);
    },
    // --- 设定滚动位置 ---
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
    }
};

export let mounted = function(this: IVue): void {
    // --- 外部包裹的改变 ---
    let size = clickgo.element.watchSize(this.$refs.wrap, (size) => {
        let clientWidth = Math.round(size.innerWidth);
        let clientHeight = Math.round(size.innerHeight);
        if (this.direction === 'v') {
            if (clientWidth !== this.clientWidth) {
                this.clientWidth = clientWidth;
                this.$emit('resizen', this.clientWidth);
            }
            if (clientHeight === this.clientHeight) {
                return;
            }
            this.clientHeight = clientHeight;
            this.$emit('resize', this.clientHeight);
        }
        else {
            if (clientHeight !== this.clientHeight) {
                this.clientHeight = clientHeight;
                this.$emit('resizen', this.clientHeight);
            }
            if (clientWidth === this.clientWidth) {
                return;
            }
            this.clientWidth = clientWidth;
            this.$emit('resize', this.clientWidth);
        }
        this.refreshView();
    });
    this.client = Math.round(this.direction === 'v' ? size.innerHeight : size.innerWidth);
    this.$emit('resize', this.client);

    // --- 内部内容的改变 ---
    size = clickgo.element.watchSize(this.$refs.inner, (size) => {
        let lengthWidth = Math.round(size.width);
        let lengthHeight = Math.round(size.height);
        let change = false;
        if (lengthWidth !== this.lengthWidth) {
            this.lengthWidth = lengthWidth;
            change = true;
            if (this.direction === 'h') {
                this.$emit('change', this.lengthWidth);
            }
        }
        if (lengthHeight !== this.lengthHeight) {
            this.lengthHeight = lengthHeight;
            change = true;
            if (this.direction === 'v') {
                this.$emit('change', this.lengthHeight);
            }
        }
        if (change) {
            this.refreshView();
        }
    });
    this.lengthWidth = Math.round(size.width);
    this.lengthHeight = Math.round(size.height);
    if (this.direction === 'h') {
        this.$emit('change', this.lengthWidth);
    }
    else {
        this.$emit('change', this.lengthHeight);
    }
};

export let unmounted = function(this: IVue): void {
    if (this.timer) {
        this.timer = false;
    }
};
