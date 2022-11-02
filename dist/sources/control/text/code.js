"use strict";
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
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
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
        this.font = '';
        this.background = '';
        this.color = '';
        this.padding = '';
        this.isFocus = false;
        this.value = '';
        this.selectionStartEmit = 0;
        this.selectionEndEmit = 0;
        this.scrollLeftEmit = 0;
        this.scrollTopEmit = 0;
        this.scrollLeftWatch = 0;
        this.scrollTopWatch = 0;
        this.scrollLeftWatchTime = 0;
        this.scrollTopWatchTime = 0;
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.lengthWidth = 0;
        this.lengthHeight = 0;
        this.touchX = 0;
        this.touchY = 0;
        this.canTouchScroll = false;
        this.alreadySb = false;
        this.lastDownTime = 0;
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
            }
        };
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get isReadonly() {
        return clickgo.tool.getBoolean(this.props.readonly);
    }
    get isPassword() {
        return clickgo.tool.getBoolean(this.props.password);
    }
    get isWrap() {
        return clickgo.tool.getBoolean(this.props.wrap);
    }
    get maxScrollLeft() {
        return Math.round(this.lengthWidth - this.clientWidth);
    }
    get maxScrollTop() {
        return Math.round(this.lengthHeight - this.clientHeight);
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    focus() {
        const now = Date.now();
        if (now - this.lastDownTime >= 500) {
            this.refs.text.focus();
        }
    }
    keydown() {
        this.refs.text.focus();
    }
    tfocus() {
        this.isFocus = true;
    }
    tblur() {
        this.isFocus = false;
    }
    input(e) {
        this.value = e.target.value;
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
        }
        const tagName = e.target.tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
            this.lastDownTime = Date.now();
        }
    }
    scroll() {
        const now = Date.now();
        if ((now - this.scrollLeftWatchTime) < 50) {
            this.refs.text.scrollLeft = this.scrollLeftWatch;
        }
        if ((now - this.scrollTopWatchTime) < 50) {
            this.refs.text.scrollTop = this.scrollTopWatch;
        }
        this.refreshScroll();
    }
    wheel(e) {
        const scrollTop = Math.ceil(this.refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.refs.text.scrollLeft);
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (scrollLeft > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (!this.isMulti) {
                        e.direction = 'h';
                    }
                    this.emit('scrollborder', e);
                }
            }
            else {
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (!this.isMulti) {
                        e.direction = 'h';
                    }
                    this.emit('scrollborder', e);
                }
            }
        }
        else {
            if (e.deltaX < 0) {
                if (scrollLeft > 0) {
                    e.stopPropagation();
                }
                else if (scrollTop > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    e.direction = 'v';
                    this.emit('scrollborder', e);
                }
            }
            else {
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    e.direction = 'v';
                    this.emit('scrollborder', e);
                }
            }
        }
    }
    inputTouch(e) {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
        e.stopPropagation();
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
    }
    move(e) {
        const scrollTop = Math.ceil(this.refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.refs.text.scrollLeft);
        const deltaX = this.touchX - e.touches[0].clientX;
        const deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouchScroll) {
            e.stopPropagation();
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY < 0) {
                if (scrollTop > 0) {
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
            if (deltaX < 0) {
                if (scrollLeft > 0) {
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
    end() {
        this.alreadySb = false;
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
    select() {
        const selectionStart = this.refs.text.selectionStart;
        const selectionEnd = this.refs.text.selectionEnd;
        if (selectionStart !== this.selectionStartEmit) {
            this.selectionStartEmit = selectionStart;
            this.emit('update:selectionStart', this.selectionStartEmit);
        }
        if (selectionEnd !== this.selectionEndEmit) {
            this.selectionEndEmit = selectionEnd;
            this.emit('update:selectionEnd', this.selectionEndEmit);
        }
    }
    reselect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.tool.sleep(150);
            this.select();
        });
    }
    execCmd(ac) {
        return __awaiter(this, void 0, void 0, function* () {
            this.refs.text.focus();
            if (ac === 'paste') {
                if (this.isReadonly) {
                    return;
                }
                const str = yield navigator.clipboard.readText();
                this.value = this.value.slice(0, this.selectionStartEmit)
                    + str
                    + this.value.slice(this.selectionEndEmit);
                yield this.nextTick();
                const selectionStart = this.selectionStartEmit + str.length;
                const selectionEnd = selectionStart;
                this.refs.text.selectionStart = selectionStart;
                if (selectionStart !== this.selectionStartEmit) {
                    this.selectionStartEmit = selectionStart;
                    this.emit('update:selectionStart', this.selectionStartEmit);
                }
                this.refs.text.selectionEnd = selectionEnd;
                if (selectionEnd !== this.selectionEndEmit) {
                    this.selectionEndEmit = selectionEnd;
                    this.emit('update:selectionEnd', this.selectionEndEmit);
                }
            }
            else {
                clickgo.tool.execCommand(ac);
                yield this.reselect();
            }
        });
    }
    refreshLength() {
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
    refreshClient() {
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
    refreshScroll() {
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
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.watch('modelValue', () => {
                this.value = this.props.modelValue;
            }, {
                'immediate': true
            });
            this.watch('value', () => __awaiter(this, void 0, void 0, function* () {
                this.emit('update:modelValue', this.value);
                yield this.nextTick();
                this.refreshLength();
            }));
            this.watch('multi', () => __awaiter(this, void 0, void 0, function* () {
                yield this.nextTick();
                clickgo.dom.watchSize(this.refs.text, () => {
                    this.refreshLength();
                    this.refreshClient();
                }, true);
                this.refreshLength();
                this.refreshClient();
                this.refreshScroll();
                this.select();
            }));
            this.watch('font', () => __awaiter(this, void 0, void 0, function* () {
                yield this.nextTick();
                this.refreshLength();
            }));
            this.watch('password', () => __awaiter(this, void 0, void 0, function* () {
                yield this.nextTick();
                this.refreshLength();
            }));
            this.watch('wrap', () => __awaiter(this, void 0, void 0, function* () {
                yield this.nextTick();
                this.refreshLength();
            }));
            this.watch('scrollLeft', () => {
                const sl = clickgo.tool.getNumber(this.props.scrollLeft);
                if (sl === this.scrollLeftEmit) {
                    return;
                }
                this.refs.text.scrollLeft = sl;
                this.scrollLeftWatch = sl;
                this.scrollLeftWatchTime = Date.now();
            });
            this.watch('scrollTop', () => {
                const st = clickgo.tool.getNumber(this.props.scrollTop);
                if (st === this.scrollTopEmit) {
                    return;
                }
                this.refs.text.scrollTop = st;
                this.scrollTopWatch = st;
                this.scrollTopWatchTime = Date.now();
            });
            this.watch('selectionStart', () => {
                this.selectionStartEmit = clickgo.tool.getNumber(this.props.selectionStart);
                this.refs.text.selectionStart = this.selectionStartEmit;
            });
            this.watch('selectionEnd', () => {
                this.selectionEndEmit = clickgo.tool.getNumber(this.props.selectionEnd);
                this.refs.text.selectionEnd = this.selectionEndEmit;
            });
            clickgo.dom.watchSize(this.refs.text, () => {
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
            yield clickgo.tool.sleep(5);
            this.refreshLength();
            this.refs.text.scrollTop = clickgo.tool.getNumber(this.props.scrollTop);
            this.refs.text.scrollLeft = clickgo.tool.getNumber(this.props.scrollLeft);
        });
    }
}
exports.default = default_1;
