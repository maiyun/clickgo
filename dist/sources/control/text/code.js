import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'focus': null,
            'blur': null,
            'enter': null,
            'gesture': null,
            'input': null,
            'clientwidth': null,
            'clientheight': null,
            'scrollwidth': null,
            'scrollheight': null,
            'beforechange': null,
            'changed': null,
            'minmaxchange': null,
            'update:modelValue': null,
            'update:scrollLeft': null,
            'update:scrollTop': null,
            'update:selectionStart': null,
            'update:selectionEnd': null,
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'wrap': true,
            'maxlength': 0,
            'scroll': true,
            'gesture': [],
            'type': 'text',
            'plain': false,
            'require': false,
            'rule': '',
            'padding': 'm',
            'keyboard': false,
            'modelValue': '',
            'placeholder': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0,
            'max': undefined,
            'min': undefined
        };
        /** --- 当前是否正在显示密码的状态 --- */
        this.showPassword = false;
        // --- 其他 ---
        this.isFocus = false;
        this.value = '';
        /** --- size，主要是 scroll 用 --- */
        this.size = {
            'sw': 0,
            'sh': 0,
            'cw': 0,
            'ch': 0,
            'st': 0,
            'sl': 0
        };
        /** --- 语言包 --- */
        this.localeData = {
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
        /** --- 为 true 的话会显示红色边框 --- */
        this.dangerBorder = false;
    }
    /** --- 供外部调用的使框获取焦点的事件 --- */
    focus() {
        this.refs.text.focus();
    }
    // --- 最大可拖动的 scroll 左侧位置 ---
    maxScrollLeft() {
        return this.refs.text.scrollWidth - this.refs.text.clientWidth;
    }
    /**
     * --- 最大可拖动的 scroll 顶部位置 ---
     */
    maxScrollTop() {
        return this.refs.text.scrollHeight - this.refs.text.clientHeight;
    }
    /** --- wrap 的 down --- */
    down(e) {
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
    tfocus() {
        this.isFocus = true;
        this.emit('focus');
        if (this.dangerBorder) {
            this.dangerBorder = false;
        }
    }
    /** --- 文本框的 blur 事件 --- */
    tblur(e) {
        // --- 如果是 number 则要判断数字是否符合 min max，不能在 input 判断，因为会导致用户无法正常输入数字，比如最小值是 10，他在输入 1 的时候就自动重置成 10 了 ---
        const target = e.target;
        if (this.checkNumber(target)) {
            const mxEvent = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'before': this.value,
                    'value': target.value,
                }
            };
            this.emit('minmaxchange', mxEvent);
            if (mxEvent.go) {
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                    this.emit('update:modelValue', this.value);
                    // --- changed ---
                    this.emit('changed');
                }
                else {
                    // --- 禁止 ---
                    target.value = this.value;
                }
            }
            else {
                // --- 禁止 ---
                target.value = this.value;
            }
        }
        this.isFocus = false;
        this.emit('blur');
        // --- 判断是否显示红色边框 ---
        this.check();
    }
    /** --- 文本框的 input 事件 --- */
    input(e) {
        const target = e.target;
        const event = {
            'go': true,
            preventDefault: function () {
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
            this.emit('input');
            return;
        }
        if (event.detail.change !== undefined) {
            target.value = event.detail.change;
        }
        this.value = target.value;
        this.emit('update:modelValue', this.value);
        // --- changed ---
        this.emit('changed');
        this.emit('input');
    }
    /** --- 检测 value 值是否符合 max 和 min --- */
    checkNumber(target) {
        target ??= this.refs.text;
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
    scrollEvent() {
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
    wheel(e) {
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
    inputTouch(e) {
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
    contextmenu(e) {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, e);
    }
    select(e) {
        e.stopPropagation();
    }
    /** --- up/down 按钮点击时，阻止默认事件 --- */
    udDown(e) {
        e.preventDefault();
        if (this.isFocus) {
            return;
        }
        this.refs.text.focus();
    }
    /**
     * --- number 模式下，点击右侧的控制按钮 ---
     * @param num 增加或者是减少
     */
    numberClick(num) {
        if (!this.value) {
            this.value = '0';
        }
        const n = (parseFloat(this.value) + num).toString();
        const event = {
            'go': true,
            preventDefault: function () {
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
        this.value = event.detail.change ?? n;
        this.emit('update:modelValue', this.value);
        // --- changed ---
        this.emit('changed');
    }
    /** --- 执行复制粘贴剪切等操作 --- */
    async execCmd(ac) {
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
            const event = {
                'go': true,
                preventDefault: function () {
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
            this.value = event.detail.change ?? this.value.slice(0, this.refs.text.selectionStart)
                + str
                + this.value.slice(this.refs.text.selectionEnd);
            this.emit('update:modelValue', this.value);
            // --- changed ---
            this.emit('changed');
            this.refs.text.selectionStart = this.refs.text.selectionStart + str.length;
            this.refs.text.selectionEnd = this.refs.text.selectionStart;
        }
        else {
            // --- 复制、剪切 ---
            clickgo.tool.execCommand(ac);
        }
    }
    /** --- ref 的 text 可能经历多次卸载加载，所以需要重新判断是否正常 watch --- */
    checkWatch() {
        if (clickgo.dom.isWatchProperty(this.refs.text)) {
            return;
        }
        clickgo.dom.watchProperty(this.refs.text, [
            'selectionStart',
            'selectionEnd',
            'scrollWidth',
            'scrollHeight'
        ], (n, v) => {
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
        clickgo.dom.watchSize(this, this.refs.text, () => {
            this.size.cw = this.refs.text.clientWidth;
            this.emit('clientwidth', this.refs.text.clientWidth);
            this.size.ch = this.refs.text.clientHeight;
            this.emit('clientheight', this.refs.text.clientHeight);
        }, true);
    }
    /** --- 文本框的键盘事件 --- */
    keydown(e) {
        if (e.key === 'Enter') {
            this.emit('enter');
        }
    }
    /** --- 检测 require 和 rule --- */
    check() {
        // --- 先检测必填 ---
        if (this.propBoolean('require')) {
            if (!this.value) {
                this.dangerBorder = true;
                return false;
            }
        }
        if (!this.value) {
            return true;
        }
        // --- 再检测是否符合格式 ---
        if (!this.props.rule) {
            return true;
        }
        const reg = this.props.rule instanceof RegExp ? this.props.rule : new RegExp(this.props.rule.slice(1, -1));
        const r = reg.test(this.value);
        if (r) {
            return true;
        }
        this.dangerBorder = true;
        return false;
    }
    /** --- 文本框的键盘图标点下事件 --- */
    kbdown(e) {
        e.preventDefault();
    }
    showKeyboard() {
        if (clickgo.dom.is.keyboard) {
            clickgo.form.hideKeyboard();
            return;
        }
        clickgo.form.showKeyboard();
    }
    onMounted() {
        // --- prop 修改值 ---
        this.watch('modelValue', async () => {
            if (this.value === this.props.modelValue) {
                return;
            }
            if (this.dangerBorder) {
                this.dangerBorder = false;
            }
            this.value = this.props.modelValue;
            await this.nextTick();
            this.checkNumber();
            if (this.propNumber('maxlength') && this.refs.text.value.length > this.propNumber('maxlength')) {
                this.refs.text.value = this.refs.text.value.slice(0, this.propNumber('maxlength'));
            }
            // --- 有可能设置后控件实际值和设置的值不同，所以要重新判断一下 ---
            if (this.refs.text.value === this.value) {
                this.check();
                return;
            }
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'value': this.refs.text.value,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (!event.go) {
                this.check();
                this.refs.text.value = this.value;
                return;
            }
            this.value = event.detail.change ?? this.refs.text.value;
            this.emit('update:modelValue', this.value);
            // --- changed ---
            this.emit('changed');
            this.check();
        }, {
            'immediate': true
        });
        // --- 监听 text 相关 ---
        this.watch('type', async () => {
            await this.nextTick();
            if (this.checkNumber()) {
                const mxEvent = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'before': this.value,
                        'value': this.refs.text.value
                    }
                };
                this.emit('minmaxchange', mxEvent);
                if (mxEvent.go) {
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'value': this.value,
                            'change': undefined
                        }
                    };
                    this.emit('beforechange', event);
                    if (event.go) {
                        // --- 允许 ---
                        this.value = event.detail.change ?? this.refs.text.value;
                        this.emit('update:modelValue', this.value);
                        // --- changed ---
                        this.emit('changed');
                    }
                    else {
                        // --- 禁止 ---
                        this.refs.text.value = this.value;
                    }
                }
            }
            await this.nextTick();
            this.checkWatch();
        });
        this.watch('max', async () => {
            await this.nextTick();
            if (this.checkNumber()) {
                const mxEvent = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'before': this.value,
                        'value': this.refs.text.value
                    }
                };
                this.emit('minmaxchange', mxEvent);
                if (!mxEvent.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                this.value = event.detail.change ?? this.refs.text.value;
                this.emit('update:modelValue', this.value);
                // --- changed ---
                this.emit('changed');
            }
        });
        this.watch('min', async () => {
            await this.nextTick();
            if (this.checkNumber()) {
                const mxEvent = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'before': this.value,
                        'value': this.refs.text.value
                    }
                };
                this.emit('minmaxchange', mxEvent);
                if (!mxEvent.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                this.value = event.detail.change ?? this.refs.text.value;
                this.emit('update:modelValue', this.value);
                // --- changed ---
                this.emit('changed');
            }
        });
        this.watch('maxlength', () => {
            if (!this.propNumber('maxlength')) {
                return;
            }
            if (this.value.length <= this.propNumber('maxlength')) {
                return;
            }
            const value = this.value.slice(0, this.propNumber('maxlength'));
            const event = {
                'go': true,
                preventDefault: function () {
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
            this.value = event.detail.change ?? value;
            this.emit('update:modelValue', this.value);
            // --- changed ---
            this.emit('changed');
        });
        this.watch('scrollLeft', () => {
            const prop = this.propInt('scrollLeft');
            if (prop === Math.round(this.refs.text.scrollLeft)) {
                return;
            }
            this.refs.text.scrollLeft = prop;
        });
        this.watch('scrollTop', () => {
            const prop = this.propInt('scrollTop');
            if (prop === Math.round(this.refs.text.scrollTop)) {
                return;
            }
            this.refs.text.scrollTop = prop;
        });
        this.watch('selectionStart', () => {
            const prop = this.propInt('selectionStart');
            if (prop === this.refs.text.selectionStart) {
                return;
            }
            if (this.props.type === 'number') {
                return;
            }
            this.refs.text.selectionStart = prop;
        });
        this.watch('selectionEnd', () => {
            const prop = this.propInt('selectionEnd');
            if (prop === this.refs.text.selectionEnd) {
                return;
            }
            if (this.props.type === 'number') {
                return;
            }
            this.refs.text.selectionEnd = prop;
        });
        const content = this.parentByName('content');
        if (content) {
            this.watch('require', () => {
                if (this.propBoolean('require')) {
                    content.controls.push(this);
                }
                else {
                    content.remove(this);
                }
            }, {
                'immediate': true
            });
        }
        // --- 对 scroll 位置进行归位 ---
        this.refs.text.scrollTop = this.propInt('scrollTop');
        this.refs.text.scrollLeft = this.propInt('scrollLeft');
        if (this.props.type !== 'number') {
            this.refs.text.selectionStart = this.propInt('selectionStart');
            this.refs.text.selectionEnd = this.propInt('selectionEnd');
        }
        this.checkWatch();
    }
    onUnmounted() {
        if (this.propBoolean('require')) {
            const content = this.parentByName('content');
            if (content) {
                content.remove(this);
            }
        }
    }
}
