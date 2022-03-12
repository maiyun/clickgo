export let props = {
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

export let computed = {
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
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function(this: IVControl): number {
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
    },

    'opMargin': function(this: IVControl): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};

export let watch = {
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
    'lineHeight': {
        handler: async function(this: IVControl): Promise<void> {
            await this.$nextTick();
            this.refreshLength();
        }
    },
    'fontSize': {
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
            let sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$refs.text.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function(this: IVControl): void {
            let st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$refs.text.scrollTop = this.scrollTop;
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

export let data = {
    'font': '',
    'fontWeight': '',
    'lineHeight': '',
    'background': '',
    'color': '',
    'padding': '',

    'isFocus': false,
    'value': '',
    'selectionStartEmit': 0,
    'selectionEndEmit': 0,

    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,

    'clientWidth': 0,
    'clientHeight': 0,

    'lengthWidth': 0,
    'lengthHeight': 0,

    'touchX': 0,
    'touchY': 0,
    'canTouch': false,      // --- 按下后第一次的拖动判断可拖动后，则后面此次都可拖动（交由浏览器可自行处理） ---
    'lastDownTime': 0,      // --- mouse 或 touch 的时间戳 ---

    'localData': {
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

export let methods = {
    focus: function(this: IVControl): void {
        let now = Date.now();
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
        let tagName = (e.target as HTMLElement).tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
            this.lastDownTime = Date.now();
        }
    },

    scroll: function(this: IVControl): void {
        this.refreshScroll();
    },
    wheel: function(this: IVControl, e: WheelEvent): void {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // --- 竖向滚动 ---
            if (e.deltaY < 0) {
                // --- 向上滚 ---
                if (this.$refs.text.scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollLeft > 0 && this.$refs.text.scrollHeight === this.$refs.text.clientHeight) {
                    // --- 上面不能滚但左边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft += e.deltaY;
                }
            }
            else {
                // --- 向下滚 ---
                if (this.$refs.text.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollLeft < this.maxScrollLeft && this.$refs.text.scrollHeight === this.$refs.text.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft += e.deltaY;
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (e.deltaX < 0) {
                // --- 向左滚 ---
                if (this.$refs.text.scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollTop > 0 && this.$refs.text.scrollWidth === this.$refs.text.clientWidth) {
                    // --- 左面不能滚但上边可以 ---
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollTop += e.deltaX;
                }
            }
            else {
                // --- 向右滚 ---
                if (this.$refs.text.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollTop < this.maxScrollTop && this.$refs.text.scrollWidth === this.$refs.text.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollTop += e.deltaX;
                }
            }
        }
    },
    inputTouch: function(this: IVControl, e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        // --- 按下后第一次的拖动判断可拖动后，则后面此次都可拖动（交由浏览器可自行处理） ---
        this.canTouch = false;
        // --- 长按触发 contextmenu ---
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    move: function(this: IVControl, e: TouchEvent): void {
        // --- 必须有这个，要不然被上层的 e.preventDefault(); 给屏蔽不能拖动，可拖时必须 stopPropagation ---
        let deltaX = this.touchX - e.touches[0].clientX;
        let deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouch) {
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            // --- 竖向滚动 ---
            if (deltaY < 0) {
                // --- 向上滚 ---
                if (this.$refs.text.scrollTop > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
            else {
                // --- 向下滚 ---
                if (this.$refs.text.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
        }
        else {
            // --- 横向滚动 ---
            if (deltaX < 0) {
                // --- 向左滚 ---
                if (this.$refs.text.scrollLeft > 0) {
                    // --- 可以滚动 ---
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
            else {
                // --- 向右滚 ---
                if (this.$refs.text.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
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
        let selectionStart = (this.$refs.text as unknown as HTMLTextAreaElement).selectionStart;
        let selectionEnd = (this.$refs.text as unknown as HTMLTextAreaElement).selectionEnd;
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
            let str = await navigator.clipboard.readText();
            this.value = this.value.slice(0, this.selectionStartEmit) + str + this.value.slice(this.selectionEndEmit);
            await this.$nextTick();
            let selectionStart = this.selectionStartEmit + str.length;
            let selectionEnd = selectionStart;
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
        let lengthWidth = this.$refs.text.scrollWidth;
        let lengthHeight = this.$refs.text.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            this.$emit('change', lengthHeight);
        }
    },
    refreshClient: function(this: IVControl): void {
        let clientWidth = this.$refs.text.clientWidth;
        let clientHeight = this.$refs.text.clientHeight;
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
        let sl = Math.round(this.$refs.text.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        let st = Math.round(this.$refs.text.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    }
};

export let mounted = async function(this: IVControl): Promise<void> {
    clickgo.dom.watchSize(this.$refs.text, async (): Promise<void> => {
        this.refreshClient();
        this.refreshLength();
    }, true);
    clickgo.dom.watchStyle(this.$el, ['font', 'font-weight', 'line-height', 'background', 'color', 'padding'], (n, v) => {
        switch (n) {
            case 'font': {
                this.font = v;
                break;
            }
            case 'font-weight': {
                this.fontWeight = v;
                break;
            }
            case 'line-height': {
                this.lineHeight = v;
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
