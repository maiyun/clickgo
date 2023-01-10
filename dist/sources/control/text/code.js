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
            'gesture': [],
            'modelValue': '',
            'placeholder': '',
            'selectionStart': 0,
            'selectionEnd': 0,
            'scrollLeft': 0,
            'scrollTop': 0
        };
        this.font = '';
        this.background = '';
        this.color = '';
        this.padding = '';
        this.darkbg = false;
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
            'ru': {
                'copy': 'Копировать',
                'cut': 'Вырезать',
                'paste': 'Вставить'
            },
            'ko': {
                'copy': '복사',
                'cut': '자르다',
                'paste': '반죽'
            }
        };
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
        this.value = e.target.value;
        this.emit('update:modelValue', this.value);
    }
    scroll() {
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
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('top')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.refs.text.scrollTop) < this.maxScrollTop()) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('bottom')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'left': {
                    if (this.refs.text.scrollLeft > 0) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('left')) {
                            return true;
                        }
                    }
                    break;
                }
                default: {
                    if (Math.round(this.refs.text.scrollLeft) < this.maxScrollLeft()) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('right')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }, (dir) => {
            this.emit('gesture', dir);
        });
    }
    inputTouch(e) {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            switch (dir) {
                case 'top': {
                    if (this.refs.text.scrollTop > 0) {
                        ne.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('top')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.refs.text.scrollTop) < this.maxScrollTop()) {
                        ne.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('bottom')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'left': {
                    if (this.refs.text.scrollLeft > 0) {
                        ne.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('left')) {
                            return true;
                        }
                    }
                    break;
                }
                default: {
                    if (Math.round(this.refs.text.scrollLeft) < this.maxScrollLeft()) {
                        ne.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('right')) {
                            return true;
                        }
                    }
                }
            }
            return false;
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
                this.emit('update:modelValue', this.value);
                yield this.nextTick();
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
        }, true);
    }
    onMounted() {
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            this.value = this.props.modelValue;
            yield this.nextTick();
            if (this.refs.text.value === this.value) {
                return;
            }
            this.value = this.refs.text.value;
            this.emit('update:modelValue', this.value);
        }), {
            'immediate': true
        });
        this.watch('multi', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.checkWatch();
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
        clickgo.dom.watchStyle(this.element, ['font', 'background', 'color', 'padding'], (n, v) => {
            switch (n) {
                case 'font': {
                    this.font = v;
                    break;
                }
                case 'background': {
                    this.background = v;
                    const hsl = clickgo.tool.rgb2hsl(v);
                    this.darkbg = hsl[2] < 0.5 ? true : false;
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
        this.refs.text.scrollTop = this.propInt('scrollTop');
        this.refs.text.scrollLeft = this.propInt('scrollLeft');
        this.refs.text.selectionStart = this.propInt('selectionStart');
        this.refs.text.selectionEnd = this.propInt('selectionEnd');
        this.checkWatch();
    }
}
exports.default = default_1;
