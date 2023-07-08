import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'multi': boolean | string;
        'readonly': boolean | string;
        'password': boolean | string;
        'wrap': boolean | string;
        'gesture': string[] | string;

        'modelValue': string;
        'placeholder': string;
        'selectionStart': number | string;
        'selectionEnd': number | string;
        'scrollLeft': number | string;
        'scrollTop': number | string;
    } = {
            'disabled': false,
            'multi': false,
            'readonly': false,
            'password': false,
            'wrap': true,
            'gesture': [],

            'modelValue': '',
            'placeholder': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0
        };

    // --- 样式 ---

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public font = '';

    public background = '';

    public padding = '';

    /** --- 如果 background 颜色比较深，则此值设定为 true --- */
    public darkbg = false;

    // --- 其他 ---

    public isFocus = false;

    public value = '';

    /** --- size，主要是 scroll 用 --- */
    public size = {
        'sw': 0,
        'sh': 0,
        'cw': 0,
        'ch': 0,
        'st': 0,
        'sl': 0
    };

    /** --- 语言包 --- */
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
        },
        'ko': {
            'copy': '복사',
            'cut': '잘라내기',
            'paste': '붙여넣기',
        },
        'th': {
            'copy': 'คัดลอก',
            'cut': 'ตัด',
            'paste': 'วาง',
        },
        'es': {
            'copy': 'Copiar',
            'cut': 'Cortar',
            'paste': 'Pegar',
        },
        'de': {
            'copy': 'Kopieren',
            'cut': 'Ausschneiden',
            'paste': 'Einfügen'
        },
        'fr': {
            'copy': 'Copier',
            'cut': 'Couper',
            'paste': 'Coller'
        },
        'pt': {
            'copy': 'Copiar',
            'cut': 'Recortar',
            'paste': 'Colar'
        },
        'ru': {
            'copy': 'Копировать',
            'cut': 'Вырезать',
            'paste': 'Вставить'
        },
        'vi': {
            'copy': 'Sao chép',
            'cut': 'Cắt',
            'paste': 'Dán'
        }
    };

    // --- 最大可拖动的 scroll 左侧位置 ---
    public maxScrollLeft(): number {
        return this.refs.text.scrollWidth - this.refs.text.clientWidth;
    }

    /**
     * --- 最大可拖动的 scroll 顶部位置 ---
     */
    public maxScrollTop(): number {
        return this.refs.text.scrollHeight - this.refs.text.clientHeight;
    }

    /** --- wrap 的 down --- */
    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        // --- 若正在显示菜单则隐藏 ---
        if (this.element.dataset.cgPopOpen === undefined) {
            return;
        }
        clickgo.form.hidePop();
    }

    /** --- 文本框的 focus 事件 --- */
    public tfocus(): void {
        this.isFocus = true;
        this.emit('focus');
    }

    /** --- 文本框的 blur 事件 --- */
    public tblur(): void {
        this.isFocus = false;
        this.emit('blur');
    }

    /** --- 文本框的 input 事件 --- */
    public input(e: InputEvent): void {
        this.value = (e.target as HTMLInputElement).value;
        this.emit('update:modelValue', this.value);
    }

    /** --- input 的 scroll 事件 --- */
    public scroll(): void {
        // --- scroll left ---
        let sl = Math.round(this.refs.text.scrollLeft);
        const msl = this.maxScrollLeft();
        if (sl > msl) {
            sl = msl;
        }
        this.size.sl = sl;
        if (this.propInt('scrollLeft') !== sl) {
            this.emit('update:scrollLeft', sl);
        }
        // --- scroll top ---
        let st = Math.round(this.refs.text.scrollTop);
        const mst = this.maxScrollTop();
        if (st > mst) {
            st = mst;
        }
        this.size.st = st;
        if (this.propInt('scrollTop') !== st) {
            this.emit('update:scrollTop', st);
        }
    }

    /**
     * --- 电脑的 wheel 事件，横向滚动不能被屏蔽 ---
     */
    public wheel(e: WheelEvent): void {
        clickgo.dom.bindGesture(e, (e, dir) => {
            switch (dir) {
                case 'top': {
                    if (this.refs.text.scrollTop > 0) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('top')) {
                            return 1;
                        }
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.refs.text.scrollTop) < this.maxScrollTop()) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('bottom')) {
                            return 1;
                        }
                    }
                    break;
                }
                case 'left': {
                    if (this.refs.text.scrollLeft > 0) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('left')) {
                            return 1;
                        }
                    }
                    break;
                }
                default: {
                    if (Math.round(this.refs.text.scrollLeft) < this.maxScrollLeft()) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('right')) {
                            return 1;
                        }
                    }
                }
            }
            return 0;
        }, (dir) => {
            this.emit('gesture', dir);
        });
    }

    public inputTouch(e: TouchEvent): void {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            switch (dir) {
                case 'top': {
                    if (this.refs.text.scrollTop > 0) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('top')) {
                            return 1;
                        }
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.refs.text.scrollTop) < this.maxScrollTop()) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('bottom')) {
                            return 1;
                        }
                    }
                    break;
                }
                case 'left': {
                    if (this.refs.text.scrollLeft > 0) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('left')) {
                            return 1;
                        }
                    }
                    break;
                }
                default: {
                    if (Math.round(this.refs.text.scrollLeft) < this.maxScrollLeft()) {
                        return -1;
                    }
                    else {
                        if (this.propArray('gesture').includes('right')) {
                            return 1;
                        }
                    }
                }
            }
            return 0;
        }, (dir) => {
            this.emit('gesture', dir);
        });
        // --- 长按触发 contextmenu ---
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
    }

    /** --- input 的 contextmenu --- */
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

    public select(e: InputEvent): void {
        e.stopPropagation();
    }

    /** --- 执行复制粘贴剪切等操作 --- */
    public async execCmd(ac: string): Promise<void> {
        this.refs.text.focus();
        if (ac === 'paste') {
            // --- 粘贴 ---
            if (this.propBoolean('readonly')) {
                return;
            }
            const str = await navigator.clipboard.readText();
            this.value = this.value.slice(0, this.refs.text.selectionStart)
                + str
                + this.value.slice(this.refs.text.selectionEnd);
            this.emit('update:modelValue', this.value);
            // --- 等待 vue 响应一次 ---
            await this.nextTick();
            this.refs.text.selectionStart = this.refs.text.selectionStart + str.length;
            this.refs.text.selectionEnd = this.refs.text.selectionStart;
        }
        else {
            // --- 复制、剪切 ---
            clickgo.tool.execCommand(ac);
        }
    }

    /** --- ref 的 text 可能经历多次卸载加载，所以需要重新判断是否正常 watch --- */
    public checkWatch(): void {
        if (clickgo.dom.isWatchProperty(this.refs.text)) {
            return;
        }
        clickgo.dom.watchProperty(this.refs.text, [
            'selectionStart',
            'selectionEnd',
            'scrollWidth',
            'scrollHeight'
        ], (n, v) => {
            switch (n) {
                // --- 选择改变 ---
                case 'selectionStart':
                case 'selectionEnd': {
                    this.emit('update:' + n.replace(/([A-Z])/, '-$1').toLowerCase(), v);
                    break;
                }
                // --- 内容改变 ---
                case 'scrollWidth':
                case 'scrollHeight': {
                    this.emit(n.toLowerCase(), v);
                    if (n === 'scrollWidth') {
                        this.size.sw = parseFloat(v);
                    }
                    else {
                        this.size.sh = parseFloat(v);
                    }
                    break;
                }
            }
        }, true);
        // --- 大小改变 ---
        clickgo.dom.watchSize(this.refs.text, () => {
            this.size.cw = this.refs.text.clientWidth;
            this.emit('clientwidth', this.refs.text.clientWidth);
            this.size.ch = this.refs.text.clientHeight;
            this.emit('clientheight', this.refs.text.clientHeight);
        }, true);
    }

    public onMounted(): void {
        // --- prop 修改值 ---
        this.watch('modelValue', async (): Promise<void> => {
            this.value = this.props.modelValue;
            await this.nextTick();
            // --- 有可能设置后控件实际值和设置的值不同，所以要重新判断一下 ---
            if (this.refs.text.value === this.value) {
                return;
            }
            this.value = this.refs.text.value;
            this.emit('update:modelValue', this.value);
        }, {
            'immediate': true
        });
        // --- 监听 text 相关 ---
        this.watch('multi', async (): Promise<void> => {
            await this.nextTick();
            this.checkWatch();
        });
        this.watch('password', async (): Promise<void> => {
            await this.nextTick();
            this.checkWatch();
        });
        this.watch('scrollLeft', (): void => {
            const prop = this.propInt('scrollLeft');
            if (prop === Math.round(this.refs.text.scrollLeft)) {
                return;
            }
            this.refs.text.scrollLeft = prop;
        });
        this.watch('scrollTop', (): void => {
            const prop = this.propInt('scrollTop');
            if (prop === Math.round(this.refs.text.scrollTop)) {
                return;
            }
            this.refs.text.scrollTop = prop;
        });
        this.watch('selectionStart', (): void => {
            const prop = this.propInt('selectionStart');
            if (prop === this.refs.text.selectionStart) {
                return;
            }
            this.refs.text.selectionStart = prop;
        });
        this.watch('selectionEnd', (): void => {
            const prop = this.propInt('selectionEnd');
            if (prop === this.refs.text.selectionEnd) {
                return;
            }
            this.refs.text.selectionEnd = prop;
        });

        clickgo.dom.watchStyle(this.element, ['font', 'background-color', 'padding'], (n, v) => {
            switch (n) {
                case 'font': {
                    this.font = v;
                    break;
                }
                case 'background-color': {
                    this.background = v;
                    const hsl = clickgo.tool.rgb2hsl(v);
                    this.darkbg = hsl[2] < 0.5 ? true : false;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);

        // --- 对 scroll 位置进行归位 ---
        this.refs.text.scrollTop = this.propInt('scrollTop');
        this.refs.text.scrollLeft = this.propInt('scrollLeft');
        this.refs.text.selectionStart = this.propInt('selectionStart');
        this.refs.text.selectionEnd = this.propInt('selectionEnd');

        this.checkWatch();
    }

}
