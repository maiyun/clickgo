export const props = {
    'disabled': {
        'default': false
    },

    'border': {
        'default': 'solid'
    },

    'multi': {
        'default': false,
    },
    'readonly': {
        'default': false
    },
    'password': {
        'default': false
    },
    'wrap': {
        'default': true
    },
    'modelValue': {
        'default': ''
    },
    'selectionStart': {
        'default': 0
    },
    'selectionEnd': {
        'default': 0
    },
    'scrollLeft': {
        'default': 0
    },
    'scrollTop': {
        'default': 0
    }
};

export const computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isMulti': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },
    'isReadonly': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.readonly);
    },
    'isPassword': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.password);
    },
    'isWrap': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.wrap);
    },

    // --- 最大可拖动的 scroll 位置 ---
    'maxScrollLeft': function(this: IVControl): number {
        return Math.round(this.lengthWidth - this.clientWidth);
    },
    'maxScrollTop': function(this: IVControl): number {
        return Math.round(this.lengthHeight - this.clientHeight);
    },

    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export const watch = {
    'modelValue': {
        handler: function(this: IVControl): void {
            this.value = this.modelValue;
        },
        'immediate': true
    },
    'value': {
        handler: async function(this: IVControl): Promise<void> {
            this.$emit('update:modelValue', this.value);
            // --- 内容变更，更新 length ---
            await this.$nextTick();
            this.refreshLength();
        }
    },
    'multi': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            // --- 大小改变，会影响 scroll offset、client，也会影响 length ---
            clickgo.dom.watchSize(this.$refs.text, () => {
                this.refreshLength();
                this.refreshClient();
            }, true);
            this.refreshLength();
            this.refreshClient();
            this.refreshScroll();
            this.select();
        }
    },
    'font': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            this.refreshLength();
        }
    },
    'password': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            this.refreshLength();
        }
    },
    'wrap': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            this.refreshLength();
        }
    },
    'scrollLeft': {
        handler: function(this: IVControl): void {
            const sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$refs.text.scrollLeft = this.scrollLeft;
            // --- input 的 scroll 事件有可能没那么快响应，要增加 hack ---
            this.scrollLeftWatch = this.scrollLeft;
            this.scrollLeftWatchTime = Date.now();
        }
    },
    'scrollTop': {
        handler: function(this: IVControl): void {
            const st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$refs.text.scrollTop = this.scrollTop;
            // --- input 的 scroll 事件有可能没那么快响应，要增加 hack ---
            this.scrollTopWatch = this.scrollTop;
            this.scrollTopWatchTime = Date.now();
        }
    },
    'selectionStart': {
        handler: function(this: IVControl): void {
            this.selectionStartEmit = this.selectionStart;
            (this.$refs.text as unknown as HTMLTextAreaElement).selectionStart = this.selectionStartEmit;
        }
    },
    'selectionEnd': {
        handler: function(this: IVControl): void {
            this.selectionEndEmit = this.selectionEnd;
            (this.$refs.text as unknown as HTMLTextAreaElement).selectionEnd = this.selectionEndEmit;
        }
    }
};

export const data = {
    'font': '',
    'background': '',
    'color': '',
    'padding': '',

    'isFocus': false,
    'value': '',
    'selectionStartEmit': 0,
    'selectionEndEmit': 0,

    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'scrollLeftWatch': 0,
    'scrollTopWatch': 0,
    'scrollLeftWatchTime': 0,
    'scrollTopWatchTime': 0,

    'clientWidth': 0,
    'clientHeight': 0,

    'lengthWidth': 0,
    'lengthHeight': 0,

    'touchX': 0,
    'touchY': 0,
    'canTouchScroll': false,      // --- 按下后第一次的拖动判断可拖动后，则后面此次都可拖动（交由浏览器可自行处理） ---
    'alreadySb': false,
    'lastDownTime': 0,      // --- mouse 或 touch 的时间戳 ---

    'localeData': {
        'en': {
            'copy': 'Copy',
            'cut': 'Cut',
            'paste': 'Paste'
        },
        'sc': {
            'copy': '复制',
            'cut': '剪下',
            'paste': '粘上'
        },
        'tc': {
            'copy': '複製',
            'cut': '剪貼',
            'paste': '貼上'
        },
        'ja': {
            'copy': 'コピー',
            'cut': '切り取り',
            'paste': '貼り付け'
        }
    }
};

export const methods = {
    focus: function(this: IVControl): void {
        const now = Date.now();
        if (now - this.lastDownTime >= 500) {
            this.$refs.text.focus();
        }
    },
    keydown: function(this: IVControl): void {
        this.$refs.text.focus();
    },
    tfocus: function(this: IVControl): void {
        this.isFocus = true;
    },
    tblur: function(this: IVControl): void {
        this.isFocus = false;
    },
    input: function(this: IVControl, e: InputEvent): void {
        this.value = (e.target as HTMLInputElement).value;
    },
    down: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$el);
        }
        // --- 如果是点击进入的，则不触发 input、textarea 的 focus，防止光标乱跳 ---
        const tagName = (e.target as HTMLElement).tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
            this.lastDownTime = Date.now();
        }
    },

    scroll: function(this: IVControl): void {
        // --- input 的 scroll 事件有可能没那么快响应，要增加 hack ---
        // --- value(client) -> set scroll(client) -> input scroll(event) ??, so... ---
        const now = Date.now();
        if ((now - this.scrollLeftWatchTime) < 50) {
            this.$refs.text.scrollLeft = this.scrollLeftWatch;
        }
        if ((now - this.scrollTopWatchTime) < 50) {
            this.$refs.text.scrollTop = this.scrollTopWatch;
        }
        this.refreshScroll();
    },
    wheel: function(this: IVControl, e: WheelEvent): void {
        const scrollTop = Math.ceil(this.$refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.$refs.text.scrollLeft);
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
                    this.$refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    // --- 上边左边都不能滚 ---
                    if (!this.isMulti) {
                        (e as any).direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                // --- 向下滚 ---
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    // --- 下边右边都不能滚 ---
                    if (!this.isMulti) {
                        (e as any).direction = 'h';
                    }
                    this.$emit('scrollborder', e);
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
                    this.$refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 左边上边都不能滚 ---
                    (e as any).direction = 'v';
                    this.$emit('scrollborder', e);
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
                    this.$refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 右边下边都不能滚 ---
                    (e as any).direction = 'v';
                    this.$emit('scrollborder', e);
                }
            }
        }
    },
    inputTouch: function(this: IVControl, e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
        e.stopPropagation();
        // --- 长按触发 contextmenu ---
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    move: function(this: IVControl, e: TouchEvent): void {
        const scrollTop = Math.ceil(this.$refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.$refs.text.scrollLeft);
        const deltaX = this.touchX - e.touches[0].clientX;
        const deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouchScroll) {
            // --- 必须有这个，要不然被上层的 e.preventDefault(); 给屏蔽不能拖动，可拖时必须 stopPropagation ---
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
                        this.$emit('scrollborder', e);
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
                        this.$emit('scrollborder', e);
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
                        this.$emit('scrollborder', e);
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
                        this.$emit('scrollborder', e);
                    }
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    },
    end: function(this: IVControl): void {
        this.alreadySb = false;
    },

    contextmenu: function(this: IVControl, e: MouseEvent): void {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, e);
    },
    select: function(this: IVControl): void {
        const selectionStart = (this.$refs.text as unknown as HTMLTextAreaElement).selectionStart;
        const selectionEnd = (this.$refs.text as unknown as HTMLTextAreaElement).selectionEnd;
        if (selectionStart !== this.selectionStartEmit) {
            this.selectionStartEmit = selectionStart;
            this.$emit('update:selectionStart', this.selectionStartEmit);
        }
        if (selectionEnd !== this.selectionEndEmit) {
            this.selectionEndEmit = selectionEnd;
            this.$emit('update:selectionEnd', this.selectionEndEmit);
        }
    },
    reselect: async function(this: IVControl): Promise<void> {
        await clickgo.tool.sleep(150);
        this.select();
    },
    execCmd: async function(this: IVControl, ac: string): Promise<void> {
        this.$refs.text.focus();
        if (ac === 'paste') {
            if (this.isReadonly) {
                return;
            }
            const str = await navigator.clipboard.readText();
            this.value = (this.value as string).slice(0, this.selectionStartEmit)
                + str
                + (this.value as string).slice(this.selectionEndEmit);
            await this.$nextTick();
            const selectionStart = (this.selectionStartEmit as number) + str.length;
            const selectionEnd = selectionStart;
            (this.$refs.text as unknown as HTMLTextAreaElement).selectionStart = selectionStart;
            if (selectionStart !== this.selectionStartEmit) {
                this.selectionStartEmit = selectionStart;
                this.$emit('update:selectionStart', this.selectionStartEmit);
            }
            (this.$refs.text as unknown as HTMLTextAreaElement).selectionEnd = selectionEnd;
            if (selectionEnd !== this.selectionEndEmit) {
                this.selectionEndEmit = selectionEnd;
                this.$emit('update:selectionEnd', this.selectionEndEmit);
            }
        }
        else {
            clickgo.tool.execCommand(ac);
            this.reselect();
        }
    },

    refreshLength: function(this: IVControl): void {
        const lengthWidth = this.$refs.text.scrollWidth;
        const lengthHeight = this.$refs.text.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            this.$emit('change', lengthHeight);
        }
    },
    refreshClient: function(this: IVControl): void {
        const clientWidth = this.$refs.text.clientWidth;
        const clientHeight = this.$refs.text.clientHeight;
        if (this.clientWidth !== clientWidth) {
            this.clientWidth = clientWidth;
            this.$emit('resizen', Math.round(this.clientWidth));
        }
        if (clientHeight !== this.clientHeight) {
            this.clientHeight = clientHeight;
            this.$emit('resize', Math.round(this.clientHeight));
        }
    },
    refreshScroll: function(this: IVControl): void {
        const sl = Math.round(this.$refs.text.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.$refs.text.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    }
};

export const mounted = async function(this: IVControl): Promise<void> {
    clickgo.dom.watchSize(this.$refs.text, (): void => {
        this.refreshClient();
        this.refreshLength();
    }, true);
    clickgo.dom.watchStyle(this.$el, ['font', 'background', 'color', 'padding'], (n, v) => {
        switch (n) {
            case 'font': {
                this.font = v;
                break;
            }
            case 'background': {
                this.background = v;
                break;
            }
            case 'color': {
                this.color = v;
                break;
            }
            case 'padding': {
                this.padding = v;
                break;
            }
        }
    }, true);
    await clickgo.tool.sleep(5);
    // --- 更新 length ---
    this.refreshLength();
    // --- 对 scroll 位置进行归位 ---
    this.$refs.text.scrollTop = this.scrollTop;
    this.$refs.text.scrollLeft = this.scrollLeft;
};
