"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'focus': null,
            'blur': null,
            'gesture': null,
            'clientwidth': null,
            'clientheight': null,
            'scrollwidth': null,
            'scrollheight': null,
            'beforechange': null,
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
            'modelValue': '',
            'placeholder': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0,
            'max': undefined,
            'min': undefined
        };
        this.showPassword = false;
        this.isFocus = false;
        this.value = '';
        this.size = {
            'sw': 0,
            'sh': 0,
            'cw': 0,
            'ch': 0,
            'st': 0,
            'sl': 0
        };
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
        this.mustInput = false;
    }
    maxScrollLeft() {
        return this.refs.text.scrollWidth - this.refs.text.clientWidth;
    }
    maxScrollTop() {
        return this.refs.text.scrollHeight - this.refs.text.clientHeight;
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen === undefined) {
            return;
        }
        clickgo.form.hidePop();
    }
    tfocus() {
        this.isFocus = true;
        this.emit('focus');
        if (this.mustInput) {
            this.mustInput = false;
        }
    }
    tblur(e) {
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
                    if (event.detail.change !== undefined) {
                        target.value = event.detail.change;
                    }
                    this.value = target.value;
                    this.emit('update:modelValue', this.value);
                }
                else {
                    target.value = this.value;
                }
            }
            else {
                target.value = this.value;
            }
        }
        this.isFocus = false;
        this.emit('blur');
        if (this.propBoolean('require') && !this.value) {
            this.mustInput = true;
        }
    }
    input(e) {
        const target = e.target;
        if (this.propNumber('maxlength') && (target.value.length > this.propNumber('maxlength'))) {
            target.value = target.value.slice(0, this.propNumber('maxlength'));
            return;
        }
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
    }
    checkNumber(target) {
        if (!target) {
            target = this.refs.text;
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
    scrollEvent() {
        let sl = Math.round(this.refs.text.scrollLeft);
        const msl = this.maxScrollLeft();
        if (sl > msl) {
            sl = msl;
        }
        this.size.sl = sl;
        if (this.propInt('scrollLeft') !== sl) {
            this.emit('update:scrollLeft', sl);
        }
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
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
    }
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
    numberClick(num) {
        var _a;
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
        this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : n;
        this.emit('update:modelValue', this.value);
    }
    execCmd(ac) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.refs.text.focus();
            if (ac === 'paste') {
                if (this.propBoolean('readonly')) {
                    return;
                }
                const str = yield navigator.clipboard.readText();
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
                this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.value.slice(0, this.refs.text.selectionStart)
                    + str
                    + this.value.slice(this.refs.text.selectionEnd);
                this.emit('update:modelValue', this.value);
                this.refs.text.selectionStart = this.refs.text.selectionStart + str.length;
                this.refs.text.selectionEnd = this.refs.text.selectionStart;
            }
            else {
                clickgo.tool.execCommand(ac);
            }
        });
    }
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
                case 'selectionStart':
                case 'selectionEnd': {
                    this.emit('update:' + n, v);
                    break;
                }
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
        clickgo.dom.watchSize(this.refs.text, () => {
            this.size.cw = this.refs.text.clientWidth;
            this.emit('clientwidth', this.refs.text.clientWidth);
            this.size.ch = this.refs.text.clientHeight;
            this.emit('clientheight', this.refs.text.clientHeight);
        }, true);
    }
    onMounted() {
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.value === this.props.modelValue) {
                return;
            }
            this.value = this.props.modelValue;
            yield this.nextTick();
            this.checkNumber();
            if (this.propNumber('maxlength') && this.refs.text.value.length > this.propNumber('maxlength')) {
                this.refs.text.value = this.refs.text.value.slice(0, this.propNumber('maxlength'));
            }
            if (this.refs.text.value === this.value) {
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
                this.refs.text.value = this.value;
                return;
            }
            this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
            this.emit('update:modelValue', this.value);
        }), {
            'immediate': true
        });
        this.watch('type', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.nextTick();
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
                        this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
                        this.emit('update:modelValue', this.value);
                    }
                    else {
                        this.refs.text.value = this.value;
                    }
                }
            }
            yield this.nextTick();
            this.checkWatch();
        }));
        this.watch('max', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.nextTick();
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
                this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
        }));
        this.watch('min', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.nextTick();
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
                this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
        }));
        this.watch('maxlength', () => {
            var _a;
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
            this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : value;
            this.emit('update:modelValue', this.value);
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
        this.refs.text.scrollTop = this.propInt('scrollTop');
        this.refs.text.scrollLeft = this.propInt('scrollLeft');
        if (this.props.type !== 'number') {
            this.refs.text.selectionStart = this.propInt('selectionStart');
            this.refs.text.selectionEnd = this.propInt('selectionEnd');
        }
        this.checkWatch();
    }
}
exports.default = default_1;
