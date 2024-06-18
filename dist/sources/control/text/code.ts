import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'focus': null,
        'blur': null,
        'gesture': null,
        'clientwidth': null,
        'clientheight': null,
        'scrollwidth': null,
        'scrollheight': null,
        'beforechange': null,

        'update:modelValue': null,
        'update:scrollLeft': null,
        'update:scrollTop': null,
        'update:selectionStart': null,
        'update:selectionEnd': null,
    };

    public props: {
        'disabled': boolean | string;
        'readonly': boolean | string;
        'wrap': boolean | string;
        'maxlength': number | string;
        'scroll': boolean | string;
        'adaption': boolean | string;
        'gesture': string[] | string;
        'type': 'text' | 'multi' | 'password' | 'number';

        'modelValue': string;
        'placeholder': string;
        'selectionStart': number | string;
        'selectionEnd': number | string;
        'scrollLeft': number | string;
        'scrollTop': number | string;

        'max': number | string | undefined;
        'min': number | string | undefined;
    } = {
            'disabled': false,
            'readonly': false,
            'wrap': true,
            'maxlength': 0,
            'scroll': true,
            'adaption': false,
            'gesture': [],
            'type': 'text',

            'modelValue': '',
            'placeholder': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0,

            'max': undefined,
            'min': undefined
        };

    // --- 样式 ---

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    public font = '';

    public textAlign = '';

    public padding = '';

    /** --- 如果 background 颜色比较深，则此值设定为 true --- */
    public darkbg = false;

    /** --- 当前是否正在显示密码的状态 --- */
    public showPassword = false;

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
            'paste': '붙여넣기'
        },
        'th': {
            'copy': 'คัดลอก',
            'cut': 'ตัด',
            'paste': 'วาง'
        },
        'es': {
            'copy': 'Copiar',
            'cut': 'Cortar',
            'paste': 'Pegar'
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
    public async tblur(e: FocusEvent): Promise<void> {
        // --- 如果是 number 则要判断数字是否符合 min max，不能在 input 判断，因为会导致用户无法正常输入数字，比如最小值是 10，他在输入 1 的时候就自动重置成 10 了 ---
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (this.checkNumber(target)) {
            const event: types.ITextBeforechangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': target.value,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (event.go) {
                // --- 允许 ---
                if (event.detail.change !== undefined) {
                    target.value = event.detail.change;
                }
                this.value = target.value;
                await this.nextTick();
                this.checkAdaption();
                this.emit('update:modelValue', this.value);
            }
            else {
                // --- 禁止 ---
                target.value = this.value;
            }
        }
        this.isFocus = false;
        this.emit('blur');
    }

    /** --- 文本框的 input 事件 --- */
    public async input(e: InputEvent): Promise<void> {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (this.propNumber('maxlength') && (target.value.length > this.propNumber('maxlength'))) {
            target.value = target.value.slice(0, this.propNumber('maxlength'));
            return;
        }
        const event: types.ITextBeforechangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': target.value,
                'change': undefined
            }
        };
        this.emit('beforechange', event);
        if (!event.go) {
            target.value = this.value;
            return;
        }
        if (event.detail.change !== undefined) {
            target.value = event.detail.change;
        }
        this.value = target.value;
        await this.nextTick();
        this.checkAdaption();
        this.emit('update:modelValue', this.value);
    }

    /** --- 检测 value 值是否符合 max 和 min --- */
    public checkNumber(target?: HTMLInputElement | HTMLTextAreaElement) {
        if (!target) {
            target = this.refs.text as unknown as HTMLInputElement | HTMLTextAreaElement;
        }
        if (this.props.type !== 'number') {
            return false;
        }
        let change = false;
        if (!target.value && this.value) {
            change = true;
        }
        if (target.value) {
            const val = parseFloat(target.value);
            if (this.props.max !== undefined && this.props.max !== 'undefined' && val > this.propNumber('max')) {
                target.value = this.propNumber('max').toString();
                change = true;
            }
            if (this.props.min !== undefined && this.props.min !== 'undefined' && val < this.propNumber('min')) {
                target.value = this.propNumber('min').toString();
                change = true;
            }
        }
        return change;
    }

    /** --- input 的 scroll 事件 --- */
    public scrollEvent(): void {
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

    /**
     * --- number 模式下，点击右侧的控制按钮 ---
     * @param num 增加或者是减少
     */
    public numberClick(num: number): void {
        if (!this.value) {
            this.value = '0';
        }
        const n = (parseFloat(this.value) + num).toString();
        const event: types.ITextBeforechangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': n,
                'change': undefined
            }
        };
        this.emit('beforechange', event);
        if (!event.go) {
            return;
        }
        this.value = event.detail.change !== undefined ? event.detail.change : n;
        this.emit('update:modelValue', this.value);
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
            const value = this.value.slice(0, this.refs.text.selectionStart)
            + str
            + this.value.slice(this.refs.text.selectionEnd);
            const event: types.ITextBeforechangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': value,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (!event.go) {
                return;
            }
            this.value = event.detail.change !== undefined ? event.detail.change : this.value.slice(0, this.refs.text.selectionStart)
                + str
                + this.value.slice(this.refs.text.selectionEnd);
            // --- 等待 vue 响应一次 ---
            await this.nextTick();
            this.checkAdaption();
            this.emit('update:modelValue', this.value);
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
        ], (n, v): void => {
            if (v === null) {
                v = 0;
            }
            switch (n) {
                // --- 选择改变 ---
                case 'selectionStart':
                case 'selectionEnd': {
                    this.emit('update:' + n, v);
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
            this.checkAdaption();
        }, true);
    }

    /** --- 设置的 textarea 的高度 --- */
    public adaptionHeight: number = 0;

    /** --- 若是自适应的情况下，需要进行一次判断，看看当前高度是否正确 --- */
    public checkAdaption(): void {
        this.adaptionHeight = 0;
        if (!this.refs.pre) {
            return;
        }
        if (!this.propBoolean('adaption')) {
            // --- 不是自适应 ---
            return;
        }
        if (this.props.type !== 'multi') {
            // --- 不是多行 ---
            return;
        }
        if (!this.propBoolean('wrap')) {
            // --- 不是可换行 ---
            return;
        }
        if (this.propBoolean('scroll')) {
            // --- 不是隐藏滚动条 ---
            return;
        }
        // --- 多行下，并且开启自适应 ---
        this.refs.pre.style.width = this.refs.text.clientWidth.toString() + 'px';
        this.adaptionHeight = this.refs.pre.offsetHeight;
    }

    public onMounted(): void {
        // --- prop 修改值 ---
        this.watch('modelValue', async (): Promise<void> => {
            if (this.value === this.props.modelValue) {
                return;
            }
            this.value = this.props.modelValue;
            await this.nextTick();
            this.checkNumber();
            if (this.propNumber('maxlength') && this.refs.text.value.length > this.propNumber('maxlength')) {
                this.refs.text.value = this.refs.text.value.slice(0, this.propNumber('maxlength'));
            }
            // --- 有可能设置后控件实际值和设置的值不同，所以要重新判断一下 ---
            if (this.refs.text.value === this.value) {
                this.checkAdaption();
                return;
            }
            const event: types.ITextBeforechangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': this.refs.text.value,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (!event.go) {
                this.refs.text.value = this.value;
                return;
            }
            this.value = event.detail.change !== undefined ? event.detail.change : this.refs.text.value;
            await this.nextTick();
            this.checkAdaption();
            this.emit('update:modelValue', this.value);
        }, {
            'immediate': true
        });
        // --- 监听 text 相关 ---
        this.watch('type', async (): Promise<void> => {
            await this.nextTick();
            if (this.checkNumber()) {
                const event: types.ITextBeforechangeEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.value,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (!event.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                this.value = event.detail.change !== undefined ? event.detail.change : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
            await this.nextTick();
            this.checkWatch();
            this.checkAdaption();
        });
        this.watch('max', async () => {
            await this.nextTick();
            if (this.checkNumber()) {
                const event: types.ITextBeforechangeEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.value,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (!event.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                this.value = event.detail.change !== undefined ? event.detail.change : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
        });
        this.watch('min', async () => {
            await this.nextTick();
            if (this.checkNumber()) {
                const event: types.ITextBeforechangeEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.value,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (!event.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                this.value = event.detail.change !== undefined ? event.detail.change : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
        });
        this.watch('scroll', async (): Promise<void> => {
            await this.nextTick();
            this.checkAdaption();
        });
        this.watch('adaption', async (): Promise<void> => {
            await this.nextTick();
            this.checkAdaption();
        });
        this.watch('wrap', async (): Promise<void> => {
            await this.nextTick();
            this.checkAdaption();
        });
        this.watch('maxlength', async () => {
            if (!this.propNumber('maxlength')) {
                return;
            }
            if (this.value.length <= this.propNumber('maxlength')) {
                return;
            }
            const value = this.value.slice(0, this.propNumber('maxlength'));
            const event: types.ITextBeforechangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': value,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (!event.go) {
                return;
            }
            this.value = event.detail.change !== undefined ? event.detail.change : value;
            await this.nextTick();
            this.checkAdaption();
            this.emit('update:modelValue', this.value);
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
            if (this.props.type === 'number') {
                return;
            }
            this.refs.text.selectionStart = prop;
        });
        this.watch('selectionEnd', (): void => {
            const prop = this.propInt('selectionEnd');
            if (prop === this.refs.text.selectionEnd) {
                return;
            }
            if (this.props.type === 'number') {
                return;
            }
            this.refs.text.selectionEnd = prop;
        });

        clickgo.dom.watchStyle(this.element, ['font', 'text-align', 'background-color', 'padding'], async (n, v): Promise<void> => {
            switch (n) {
                case 'font': {
                    this.font = v;
                    await this.nextTick();
                    this.checkAdaption();
                    break;
                }
                case 'text-align': {
                    this.textAlign = v;
                    break;
                }
                case 'background-color': {
                    let color = v;
                    let el: HTMLElement | null = this.element;
                    let match = /rgba\([0-9 ]+,[0-9 ]+,[0-9 ]+,([0-9 ]+)\)/.exec(color);
                    while (match && parseFloat(match[1]) <= 0.1) {
                        el = el.parentElement;
                        if (!el) {
                            break;
                        }
                        color = getComputedStyle(el).backgroundColor;
                        match = /rgba\([0-9 ]+,[0-9 ]+,[0-9 ]+,([0-9 ]+)\)/.exec(color);
                    }
                    const hsl = clickgo.tool.rgb2hsl(color);
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
        if (this.props.type !== 'number') {
            this.refs.text.selectionStart = this.propInt('selectionStart');
            this.refs.text.selectionEnd = this.propInt('selectionEnd');
        }

        this.checkWatch();
    }

}
