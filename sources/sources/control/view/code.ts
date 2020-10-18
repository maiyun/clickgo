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
    'tran': 0,
    'timer': undefined
};

export let watch = {
    'direction': function(this: IVue): void {
        let size = clickgo.element.getSize(this.$refs.wrap);
        this.clientWidth = size.innerWidth;
        this.clientHeight = size.innerHeight;
        let innerRect = this.$refs.inner.getBoundingClientRect();
        this.lengthWidth = innerRect.width;
        this.lengthHeight = innerRect.height;
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
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
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
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
            this.scrollTopData = Math.round(top - this.$refs.inner.getBoundingClientRect().top);
            this.scrollLeftData = Math.round(left - this.$refs.inner.getBoundingClientRect().left);
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

                let speed = Math.abs((moveLeftPos > moveTopPos ? moveLeftPos : moveTopPos) / (Date.now() - topTime));
                if (speed <= 0.1) {
                    return;
                }
                this.tran = speed * 2000;
                await this.$nextTick();
                this.timer = setTimeout(() => {
                    this.timer = undefined;
                    this.tran = 0;
                }, this.tran);
                if (moveLeftPos > 0) {
                    this.offsetLeftData -= Math.round(speed * 800);
                }
                else {
                    this.offsetLeftData += Math.round(speed * 800);
                }
                if (moveTopPos > 0) {
                    this.scrollToptData -= Math.round(speed * 800);
                }
                else {
                    this.scrollTopData += Math.round(speed * 800);
                }

                /** --- 滑动动画向上传递 scroll --- */
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

                /*

                // --- 以下为手动惯性，目前已经替换为浏览器托管惯性 ---

                let speed = (movePos / (Date.now() - topTime)) * 16;

                let f = 0;
                this.timer = true;

                let animation = (): void => {
                    f = Math.min(Math.abs(speed) / 32, 0.5);

                    if (speed > 0.2) {
                        speed -= f;
                    } else if(speed < -0.2) {
                        speed += f;
                    } else {
                        this.timer = false;
                        return;
                    }
                    this.scrollOffsetData -= speed;
                    if (this.scrollOffsetData > this.maxScroll) {
                        this.timer = false;
                        this.scrollOffsetData = this.maxScroll;
                        this.$emit('update:scrollOffset', Math.round(this.scrollOffsetData));
                        return;
                    } else if (this.scrollOffsetData < 0) {
                        this.timer = false;
                        this.scrollOffsetData = 0;
                        this.$emit('update:scrollOffset', Math.round(this.scrollOffsetData));
                        return;
                    }
                    this.$emit('update:scrollOffset', Math.round(this.scrollOffsetData));

                    this.timer && requestAnimationFrame(animation);
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
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
        }

        this.scrollLeftEmit = this.scrollLeftData;
        this.$emit('update:scrollLeft', this.scrollLeftData);
        this.scrollTopEmit = this.scrollTopData;
        this.$emit('update:scrollTop', this.scrollTopData);
    },
    // --- 设定滚动位置 ---
    'goScroll': function(this: IVueControl, scroll: number | string, pos: 'left' | 'top'): void {
        let so = typeof scroll === 'number' ? scroll : parseInt(scroll);
        if (so === this.scrollOffsetEmit) {
            return;
        }
        this.scrollOffsetData = so;
        this.scrollOffsetEmit = so;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
            this.tran = 0;
        }
        this.refreshView();
    }
};

export let mounted = function(this: IVue): void {
    let size = clickgo.element.watchSize(this.$refs.wrap, (size) => {
        let client = Math.round(this.direction === 'v' ? size.clientHeight : size.clientWidth);
        if (client === this.client) {
            this.$emit('resizen');
            return;
        }
        this.client = client;
        this.$emit('resize', this.client);
        this.refreshView();
    });
    this.client = Math.round(this.direction === 'v' ? size.innerHeight : size.innerWidth);
    this.$emit('resize', this.client);

    size = clickgo.element.watchSize(this.$refs.inner, (size) => {
        let contentLengh = Math.round(this.direction === 'v' ? size.height : size.width);
        if (contentLengh !== this.contentLength) {
            this.contentLength = contentLengh;
            this.refreshView();
        }
    });
    this.contentLength = Math.round(this.direction === 'v' ? size.height : size.width);
};

export let unmounted = function(this: IVue): void {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = undefined;
    }
};
