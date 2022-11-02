import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean;

        'border': 'solid' | 'underline' | 'none';

        'multi': boolean;
        'readonly': boolean;
        'password': boolean;
        'wrap': boolean;
        'modelValue': string;
        'selectionStart': number | string;
        'selectionEnd': number | string;
        'scrollLeft': number | string;
        'scrollTop': number | string;
    } = {
            'disabled': false,

            'border': 'solid',

            'multi': false,
            'readonly': false,
            'password': false,
            'wrap': true,
            'modelValue': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0
        };

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public get isMulti(): boolean {
        return clickgo.tool.getBoolean(this.props.multi);
    }

    public get isReadonly(): boolean {
        return clickgo.tool.getBoolean(this.props.readonly);
    }

    public get isPassword(): boolean {
        return clickgo.tool.getBoolean(this.props.password);
    }

    public get isWrap(): boolean {
        return clickgo.tool.getBoolean(this.props.wrap);
    }

    // --- 最大可拖动的 scroll 位置 ---
    public get maxScrollLeft(): number {
        return Math.round(this.lengthWidth - this.clientWidth);
    }

    public get maxScrollTop(): number {
        return Math.round(this.lengthHeight - this.clientHeight);
    }

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public font = '';

    public background = '';

    public color = '';

    public padding = '';

    public isFocus = false;

    public value = '';

    public selectionStartEmit = 0;

    public selectionEndEmit = 0;

    public scrollLeftEmit = 0;

    public scrollTopEmit = 0;

    public scrollLeftWatch = 0;

    public scrollTopWatch = 0;

    public scrollLeftWatchTime = 0;

    public scrollTopWatchTime = 0;

    public clientWidth = 0;

    public clientHeight = 0;

    public lengthWidth = 0;

    public lengthHeight = 0;

    public touchX = 0;

    public touchY = 0;

    /** --- 按下后第一次的拖动判断可拖动后，则后面此次都可拖动（交由浏览器可自行处理） --- */
    public canTouchScroll = false;

    public alreadySb = false;

    /** --- mouse 或 touch 的时间戳 --- */
    public lastDownTime = 0;

    public localeData = {
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
    };

    public focus(): void {
        const now = Date.now();
        if (now - this.lastDownTime >= 500) {
            this.refs.text.focus();
        }
    }

    public keydown(): void {
        this.refs.text.focus();
    }

    public tfocus(): void {
        this.isFocus = true;
    }

    public tblur(): void {
        this.isFocus = false;
    }

    public input(e: InputEvent): void {
        this.value = (e.target as HTMLInputElement).value;
    }

    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
        }
        // --- 如果是点击进入的，则不触发 input、textarea 的 focus，防止光标乱跳 ---
        const tagName = (e.target as HTMLElement).tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
            this.lastDownTime = Date.now();
        }
    }

    public scroll(): void {
        // --- input 的 scroll 事件有可能没那么快响应，要增加 hack ---
        // --- value(client) -> set scroll(client) -> input scroll(event) ??, so... ---
        const now = Date.now();
        if ((now - this.scrollLeftWatchTime) < 50) {
            this.refs.text.scrollLeft = this.scrollLeftWatch;
        }
        if ((now - this.scrollTopWatchTime) < 50) {
            this.refs.text.scrollTop = this.scrollTopWatch;
        }
        this.refreshScroll();
    }

    public wheel(e: WheelEvent): void {
        const scrollTop = Math.ceil(this.refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.refs.text.scrollLeft);
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
                    this.refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    // --- 上边左边都不能滚 ---
                    if (!this.isMulti) {
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
                    e.stopPropagation();
                    e.preventDefault();
                    this.refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    // --- 下边右边都不能滚 ---
                    if (!this.isMulti) {
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
                    this.refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 左边上边都不能滚 ---
                    (e as any).direction = 'v';
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
                    this.refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    // --- 右边下边都不能滚 ---
                    (e as any).direction = 'v';
                    this.emit('scrollborder', e);
                }
            }
        }
    }

    public inputTouch(e: TouchEvent): void {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
        e.stopPropagation();
        // --- 长按触发 contextmenu ---
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
    }

    public move(e: TouchEvent): void {
        const scrollTop = Math.ceil(this.refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.refs.text.scrollLeft);
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

    public contextmenu(e: MouseEvent): void {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, e);
    }

    public select(): void {
        const selectionStart = (this.refs.text as unknown as HTMLTextAreaElement).selectionStart;
        const selectionEnd = (this.refs.text as unknown as HTMLTextAreaElement).selectionEnd;
        if (selectionStart !== this.selectionStartEmit) {
            this.selectionStartEmit = selectionStart;
            this.emit('update:selectionStart', this.selectionStartEmit);
        }
        if (selectionEnd !== this.selectionEndEmit) {
            this.selectionEndEmit = selectionEnd;
            this.emit('update:selectionEnd', this.selectionEndEmit);
        }
    }

    public async reselect(): Promise<void> {
        await clickgo.tool.sleep(150);
        this.select();
    }

    public async execCmd(ac: string): Promise<void> {
        this.refs.text.focus();
        if (ac === 'paste') {
            if (this.isReadonly) {
                return;
            }
            const str = await navigator.clipboard.readText();
            this.value = this.value.slice(0, this.selectionStartEmit)
                + str
                + this.value.slice(this.selectionEndEmit);
            await this.nextTick();
            const selectionStart = this.selectionStartEmit + str.length;
            const selectionEnd = selectionStart;
            (this.refs.text as unknown as HTMLTextAreaElement).selectionStart = selectionStart;
            if (selectionStart !== this.selectionStartEmit) {
                this.selectionStartEmit = selectionStart;
                this.emit('update:selectionStart', this.selectionStartEmit);
            }
            (this.refs.text as unknown as HTMLTextAreaElement).selectionEnd = selectionEnd;
            if (selectionEnd !== this.selectionEndEmit) {
                this.selectionEndEmit = selectionEnd;
                this.emit('update:selectionEnd', this.selectionEndEmit);
            }
        }
        else {
            clickgo.tool.execCommand(ac);
            await this.reselect();
        }
    }

    public refreshLength(): void {
        const lengthWidth = this.refs.text.scrollWidth;
        const lengthHeight = this.refs.text.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            this.emit('change', lengthHeight);
        }
    }

    public refreshClient(): void {
        const clientWidth = this.refs.text.clientWidth;
        const clientHeight = this.refs.text.clientHeight;
        if (this.clientWidth !== clientWidth) {
            this.clientWidth = clientWidth;
            this.emit('resizen', Math.round(this.clientWidth));
        }
        if (clientHeight !== this.clientHeight) {
            this.clientHeight = clientHeight;
            this.emit('resize', Math.round(this.clientHeight));
        }
    }

    public refreshScroll(): void {
        const sl = Math.round(this.refs.text.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.refs.text.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.emit('update:scrollTop', st);
        }
    }

    public async onMounted(): Promise<void> {
        this.watch('modelValue', (): void => {
            this.value = this.props.modelValue;
        }, {
            'immediate': true
        });
        this.watch('value', async (): Promise<void> => {
            this.emit('update:modelValue', this.value);
            // --- 内容变更，更新 length ---
            await this.nextTick();
            this.refreshLength();
        });
        this.watch('multi', async (): Promise<void> => {
            await this.nextTick();
            // --- 大小改变，会影响 scroll offset、client，也会影响 length ---
            clickgo.dom.watchSize(this.refs.text, () => {
                this.refreshLength();
                this.refreshClient();
            }, true);
            this.refreshLength();
            this.refreshClient();
            this.refreshScroll();
            this.select();
        });
        this.watch('font', async (): Promise<void> => {
            await this.nextTick();
            this.refreshLength();
        });
        this.watch('password', async (): Promise<void> => {
            await this.nextTick();
            this.refreshLength();
        });
        this.watch('wrap', async (): Promise<void> => {
            await this.nextTick();
            this.refreshLength();
        });
        this.watch('scrollLeft', (): void => {
            const sl = clickgo.tool.getNumber(this.props.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.refs.text.scrollLeft = sl;
            // --- input 的 scroll 事件有可能没那么快响应，要增加 hack ---
            this.scrollLeftWatch = sl;
            this.scrollLeftWatchTime = Date.now();
        });
        this.watch('scrollTop', (): void => {
            const st = clickgo.tool.getNumber(this.props.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.refs.text.scrollTop = st;
            // --- input 的 scroll 事件有可能没那么快响应，要增加 hack ---
            this.scrollTopWatch = st;
            this.scrollTopWatchTime = Date.now();
        });
        this.watch('selectionStart', (): void => {
            this.selectionStartEmit = clickgo.tool.getNumber(this.props.selectionStart);
            (this.refs.text as unknown as HTMLTextAreaElement).selectionStart = this.selectionStartEmit;
        });
        this.watch('selectionEnd', (): void => {
            this.selectionEndEmit = clickgo.tool.getNumber(this.props.selectionEnd);
            (this.refs.text as unknown as HTMLTextAreaElement).selectionEnd = this.selectionEndEmit;
        });

        clickgo.dom.watchSize(this.refs.text, (): void => {
            this.refreshClient();
            this.refreshLength();
        }, true);
        clickgo.dom.watchStyle(this.element, ['font', 'background', 'color', 'padding'], (n, v) => {
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
        this.refs.text.scrollTop = clickgo.tool.getNumber(this.props.scrollTop);
        this.refs.text.scrollLeft = clickgo.tool.getNumber(this.props.scrollLeft);
    }

}
