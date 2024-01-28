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
        this.props = {
            'disabled': false,
            'multi': false,
            'readonly': false,
            'password': false,
            'wrap': true,
            'scroll': true,
            'adaption': false,
            'gesture': [],
            'modelValue': '',
            'placeholder': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0
        };
        this.font = '';
        this.textAlign = '';
        this.background = '';
        this.padding = '';
        this.darkbg = false;
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
        this.adaptionHeight = 0;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
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
    }
    tblur() {
        this.isFocus = false;
        this.emit('blur');
    }
    input(e) {
        return __awaiter(this, void 0, void 0, function* () {
            this.value = e.target.value;
            yield this.nextTick();
            this.checkAdaption();
            this.emit('update:modelValue', this.value);
        });
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
    execCmd(ac) {
        return __awaiter(this, void 0, void 0, function* () {
            this.refs.text.focus();
            if (ac === 'paste') {
                if (this.propBoolean('readonly')) {
                    return;
                }
                const str = yield navigator.clipboard.readText();
                this.value = this.value.slice(0, this.refs.text.selectionStart)
                    + str
                    + this.value.slice(this.refs.text.selectionEnd);
                yield this.nextTick();
                this.checkAdaption();
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
            switch (n) {
                case 'selectionStart':
                case 'selectionEnd': {
                    this.emit('update:' + n.replace(/([A-Z])/, '-$1').toLowerCase(), v);
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
            this.checkAdaption();
        }, true);
    }
    checkAdaption() {
        this.adaptionHeight = 0;
        if (!this.refs.pre) {
            return;
        }
        if (!this.propBoolean('adaption')) {
            return;
        }
        if (!this.propBoolean('multi')) {
            return;
        }
        if (!this.propBoolean('wrap')) {
            return;
        }
        if (this.propBoolean('scroll')) {
            return;
        }
        this.refs.pre.style.width = this.refs.text.clientWidth.toString() + 'px';
        this.adaptionHeight = this.refs.pre.offsetHeight;
    }
    onMounted() {
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            if (this.value === this.props.modelValue) {
                return;
            }
            this.value = this.props.modelValue;
            yield this.nextTick();
            if (this.refs.text.value === this.value) {
                this.checkAdaption();
                return;
            }
            this.value = this.refs.text.value;
            yield this.nextTick();
            this.checkAdaption();
            this.emit('update:modelValue', this.value);
        }), {
            'immediate': true
        });
        this.watch('multi', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.checkWatch();
            this.checkAdaption();
        }));
        this.watch('scroll', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.checkAdaption();
        }));
        this.watch('adaption', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.checkAdaption();
        }));
        this.watch('wrap', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.checkAdaption();
        }));
        this.watch('password', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.checkWatch();
        }));
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
            this.refs.text.selectionStart = prop;
        });
        this.watch('selectionEnd', () => {
            const prop = this.propInt('selectionEnd');
            if (prop === this.refs.text.selectionEnd) {
                return;
            }
            this.refs.text.selectionEnd = prop;
        });
        clickgo.dom.watchStyle(this.element, ['font', 'text-align', 'background-color', 'padding'], (n, v) => __awaiter(this, void 0, void 0, function* () {
            switch (n) {
                case 'font': {
                    this.font = v;
                    yield this.nextTick();
                    this.checkAdaption();
                    break;
                }
                case 'text-align': {
                    this.textAlign = v;
                    break;
                }
                case 'background-color': {
                    this.background = v;
                    let color = v;
                    let el = this.element;
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
        }), true);
        this.refs.text.scrollTop = this.propInt('scrollTop');
        this.refs.text.scrollLeft = this.propInt('scrollLeft');
        this.refs.text.selectionStart = this.propInt('selectionStart');
        this.refs.text.selectionEnd = this.propInt('selectionEnd');
        this.checkWatch();
    }
}
exports.default = default_1;
