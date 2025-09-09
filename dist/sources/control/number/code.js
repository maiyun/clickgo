import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'focus': null,
            'blur': null,
            'enter': null,
            'beforechange': null,
            'minmaxchange': null,
            'changed': null,
            'update:modelValue': null,
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'plain': false,
            'require': false,
            'modelValue': '',
            'placeholder': '',
            'max': undefined,
            'min': undefined
        };
        // --- 其他 ---
        this.isFocus = false;
        this.value = '';
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
        // --- 要判断数字是否符合 min max，不能在 input 判断，因为会导致用户无法正常输入数字，比如最小值是 10，他在输入 1 的时候就自动重置成 10 了 ---
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
            return;
        }
        if (event.detail.change !== undefined) {
            target.value = event.detail.change;
        }
        this.value = target.value;
        this.emit('update:modelValue', this.value);
        // --- changed ---
        this.emit('changed');
    }
    /** --- 检测 value 值是否符合 max 和 min --- */
    checkNumber(target) {
        target ??= this.refs.text;
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
    inputTouch(e) {
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
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'value': str,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (!event.go) {
                return;
            }
            this.value = event.detail.change ?? str;
            this.emit('update:modelValue', this.value);
            // --- changed ---
            this.emit('changed');
        }
        else {
            // --- 复制、剪切 ---
            clickgo.tool.execCommand(ac);
        }
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
        return true;
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
    }
}
