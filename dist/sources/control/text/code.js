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
exports.mounted = exports.methods = exports.data = exports.watch = exports.computed = exports.props = void 0;
exports.props = {
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
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    },
    'isReadonly': function () {
        return clickgo.tool.getBoolean(this.readonly);
    },
    'isPassword': function () {
        return clickgo.tool.getBoolean(this.password);
    },
    'isWrap': function () {
        return clickgo.tool.getBoolean(this.wrap);
    },
    'maxScrollLeft': function () {
        return Math.round(this.lengthWidth - this.clientWidth);
    },
    'maxScrollTop': function () {
        return Math.round(this.lengthHeight - this.clientHeight);
    },
    'opMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.watch = {
    'modelValue': {
        handler: function () {
            this.value = this.modelValue;
        },
        'immediate': true
    },
    'value': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.$emit('update:modelValue', this.value);
                yield this.$nextTick();
                this.refreshLength();
            });
        }
    },
    'multi': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                clickgo.dom.watchSize(this.$refs.text, () => {
                    this.refreshLength();
                    this.refreshClient();
                }, true);
                this.refreshLength();
                this.refreshClient();
                this.refreshScroll();
                this.select();
            });
        }
    },
    'font': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshLength();
            });
        }
    },
    'password': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshLength();
            });
        }
    },
    'wrap': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshLength();
            });
        }
    },
    'scrollLeft': {
        handler: function () {
            const sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$refs.text.scrollLeft = this.scrollLeft;
            this.scrollLeftWatch = this.scrollLeft;
            this.scrollLeftWatchTime = Date.now();
        }
    },
    'scrollTop': {
        handler: function () {
            const st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$refs.text.scrollTop = this.scrollTop;
            this.scrollTopWatch = this.scrollTop;
            this.scrollTopWatchTime = Date.now();
        }
    },
    'selectionStart': {
        handler: function () {
            this.selectionStartEmit = this.selectionStart;
            this.$refs.text.selectionStart = this.selectionStartEmit;
        }
    },
    'selectionEnd': {
        handler: function () {
            this.selectionEndEmit = this.selectionEnd;
            this.$refs.text.selectionEnd = this.selectionEndEmit;
        }
    }
};
exports.data = {
    'font': '',
    'background': '',
    'color': '',
    'padding': '',
    'isFocus': false,
    'value': '',
    'selectionStartEmit': 0,
    'selectionEndEmit': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'scrollLeftWatch': 0,
    'scrollTopWatch': 0,
    'scrollLeftWatchTime': 0,
    'scrollTopWatchTime': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'touchX': 0,
    'touchY': 0,
    'canTouchScroll': false,
    'alreadySb': false,
    'lastDownTime': 0,
    'localeData': {
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
exports.methods = {
    focus: function () {
        const now = Date.now();
        if (now - this.lastDownTime >= 500) {
            this.$refs.text.focus();
        }
    },
    keydown: function () {
        this.$refs.text.focus();
    },
    tfocus: function () {
        this.isFocus = true;
    },
    tblur: function () {
        this.isFocus = false;
    },
    input: function (e) {
        this.value = e.target.value;
    },
    down: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$el);
        }
        const tagName = e.target.tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
            this.lastDownTime = Date.now();
        }
    },
    scroll: function () {
        const now = Date.now();
        if ((now - this.scrollLeftWatchTime) < 50) {
            this.$refs.text.scrollLeft = this.scrollLeftWatch;
        }
        if ((now - this.scrollTopWatchTime) < 50) {
            this.$refs.text.scrollTop = this.scrollTopWatch;
        }
        this.refreshScroll();
    },
    wheel: function (e) {
        const scrollTop = Math.ceil(this.$refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.$refs.text.scrollLeft);
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (scrollLeft > 0) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (!this.isMulti) {
                        e.direction = 'h';
                    }
                    this.$emit('scrollborder', e);
                }
            }
            else {
                if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft = scrollLeft + e.deltaY;
                }
                else {
                    if (!this.isMulti) {
                        e.direction = 'h';
                    }
                    this.$emit('scrollborder', e);
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
                    this.$refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    e.direction = 'v';
                    this.$emit('scrollborder', e);
                }
            }
            else {
                if (scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollTop = scrollTop + e.deltaX;
                }
                else {
                    e.direction = 'v';
                    this.$emit('scrollborder', e);
                }
            }
        }
    },
    inputTouch: function (e) {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouchScroll = false;
        e.stopPropagation();
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    move: function (e) {
        const scrollTop = Math.ceil(this.$refs.text.scrollTop);
        const scrollLeft = Math.ceil(this.$refs.text.scrollLeft);
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
                        this.$emit('scrollborder', e);
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
                        this.$emit('scrollborder', e);
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
                        this.$emit('scrollborder', e);
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
                        this.$emit('scrollborder', e);
                    }
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    },
    end: function () {
        this.alreadySb = false;
    },
    contextmenu: function (e) {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, e);
    },
    select: function () {
        const selectionStart = this.$refs.text.selectionStart;
        const selectionEnd = this.$refs.text.selectionEnd;
        if (selectionStart !== this.selectionStartEmit) {
            this.selectionStartEmit = selectionStart;
            this.$emit('update:selectionStart', this.selectionStartEmit);
        }
        if (selectionEnd !== this.selectionEndEmit) {
            this.selectionEndEmit = selectionEnd;
            this.$emit('update:selectionEnd', this.selectionEndEmit);
        }
    },
    reselect: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.tool.sleep(150);
            this.select();
        });
    },
    execCmd: function (ac) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$refs.text.focus();
            if (ac === 'paste') {
                if (this.isReadonly) {
                    return;
                }
                const str = yield navigator.clipboard.readText();
                this.value = this.value.slice(0, this.selectionStartEmit)
                    + str
                    + this.value.slice(this.selectionEndEmit);
                yield this.$nextTick();
                const selectionStart = this.selectionStartEmit + str.length;
                const selectionEnd = selectionStart;
                this.$refs.text.selectionStart = selectionStart;
                if (selectionStart !== this.selectionStartEmit) {
                    this.selectionStartEmit = selectionStart;
                    this.$emit('update:selectionStart', this.selectionStartEmit);
                }
                this.$refs.text.selectionEnd = selectionEnd;
                if (selectionEnd !== this.selectionEndEmit) {
                    this.selectionEndEmit = selectionEnd;
                    this.$emit('update:selectionEnd', this.selectionEndEmit);
                }
            }
            else {
                clickgo.tool.execCommand(ac);
                this.reselect();
            }
        });
    },
    refreshLength: function () {
        const lengthWidth = this.$refs.text.scrollWidth;
        const lengthHeight = this.$refs.text.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            this.$emit('change', lengthHeight);
        }
    },
    refreshClient: function () {
        const clientWidth = this.$refs.text.clientWidth;
        const clientHeight = this.$refs.text.clientHeight;
        if (this.clientWidth !== clientWidth) {
            this.clientWidth = clientWidth;
            this.$emit('resizen', Math.round(this.clientWidth));
        }
        if (clientHeight !== this.clientHeight) {
            this.clientHeight = clientHeight;
            this.$emit('resize', Math.round(this.clientHeight));
        }
    },
    refreshScroll: function () {
        const sl = Math.round(this.$refs.text.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        const st = Math.round(this.$refs.text.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    }
};
const mounted = function () {
    return __awaiter(this, void 0, void 0, function* () {
        clickgo.dom.watchSize(this.$refs.text, () => {
            this.refreshClient();
            this.refreshLength();
        }, true);
        clickgo.dom.watchStyle(this.$el, ['font', 'background', 'color', 'padding'], (n, v) => {
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
        this.$refs.text.scrollTop = this.scrollTop;
        this.$refs.text.scrollLeft = this.scrollLeft;
    });
};
exports.mounted = mounted;
