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
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },
    'padding': {
        'default': undefined
    },
    'lineHeight': {
        'default': undefined
    },
    'fontSize': {
        'default': undefined
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
        'default': false
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
        return Math.round(this.lengthWidth) - Math.round(this.clientWidth);
    },
    'maxScrollTop': function () {
        return Math.round(this.lengthHeight) - Math.round(this.clientHeight);
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
                clickgo.dom.watchSize(this.$refs.text, () => __awaiter(this, void 0, void 0, function* () {
                    this.refreshLength();
                    this.refreshClient();
                }), true);
                this.refreshLength();
                this.refreshClient();
                this.refreshScroll();
                this.select();
            });
        }
    },
    'lineHeight': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshLength();
            });
        }
    },
    'fontSize': {
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
            let sl = typeof this.scrollLeft === 'number' ? this.scrollLeft : parseInt(this.scrollLeft);
            if (sl === this.scrollLeftEmit) {
                return;
            }
            this.$refs.text.scrollLeft = this.scrollLeft;
        }
    },
    'scrollTop': {
        handler: function () {
            let st = typeof this.scrollTop === 'number' ? this.scrollTop : parseInt(this.scrollTop);
            if (st === this.scrollTopEmit) {
                return;
            }
            this.$refs.text.scrollTop = this.scrollTop;
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
    'isFocus': false,
    'value': '',
    'selectionStartEmit': 0,
    'selectionEndEmit': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'touchX': 0,
    'touchY': 0,
    'canTouch': false,
    'lastDownTime': 0,
    'localData': {
        'en-us': {
            'copy': 'Copy',
            'cut': 'Cut',
            'paste': 'Paste'
        },
        'zh-cn': {
            'copy': '复制',
            'cut': '剪下',
            'paste': '粘上'
        },
        'zh-tw': {
            'copy': '複製',
            'cut': '剪貼',
            'paste': '貼上'
        },
        'ja-jp': {
            'copy': 'コピー',
            'cut': '切り取り',
            'paste': '貼り付け'
        }
    }
};
exports.methods = {
    focus: function () {
        let now = Date.now();
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
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
        let tagName = e.target.tagName.toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
            this.lastDownTime = Date.now();
        }
    },
    scroll: function () {
        this.refreshScroll();
    },
    wheel: function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            if (e.deltaY < 0) {
                if (this.$refs.text.scrollTop > 0) {
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollLeft > 0 && this.$refs.text.scrollHeight === this.$refs.text.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft += e.deltaY;
                }
            }
            else {
                if (this.$refs.text.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollLeft < this.maxScrollLeft && this.$refs.text.scrollHeight === this.$refs.text.clientHeight) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollLeft += e.deltaY;
                }
            }
        }
        else {
            if (e.deltaX < 0) {
                if (this.$refs.text.scrollLeft > 0) {
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollTop > 0 && this.$refs.text.scrollWidth === this.$refs.text.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollTop += e.deltaX;
                }
            }
            else {
                if (this.$refs.text.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                }
                else if (this.$refs.text.scrollTop < this.maxScrollTop && this.$refs.text.scrollWidth === this.$refs.text.clientWidth) {
                    e.stopPropagation();
                    e.preventDefault();
                    this.$refs.text.scrollTop += e.deltaX;
                }
            }
        }
    },
    inputDown: function (e) {
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
        this.canTouch = false;
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                this.showPop(e);
            });
        }
    },
    move: function (e) {
        let deltaX = this.touchX - e.touches[0].clientX;
        let deltaY = this.touchY - e.touches[0].clientY;
        if (this.canTouch) {
            return;
        }
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (deltaY < 0) {
                if (this.$refs.text.scrollTop > 0) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
            else {
                if (this.$refs.text.scrollTop < this.maxScrollTop) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
        }
        else {
            if (deltaX < 0) {
                if (this.$refs.text.scrollLeft > 0) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
            else {
                if (this.$refs.text.scrollLeft < this.maxScrollLeft) {
                    e.stopPropagation();
                    this.canTouch = true;
                }
            }
        }
        this.touchX = e.touches[0].clientX;
        this.touchY = e.touches[0].clientY;
    },
    contextmenu: function (e) {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    },
    select: function () {
        let selectionStart = this.$refs.text.selectionStart;
        let selectionEnd = this.$refs.text.selectionEnd;
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
                let str = yield navigator.clipboard.readText();
                this.value = this.value.slice(0, this.selectionStartEmit) + str + this.value.slice(this.selectionEndEmit);
                yield this.$nextTick();
                let selectionStart = this.selectionStartEmit + str.length;
                let selectionEnd = selectionStart;
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
        let lengthWidth = this.$refs.text.scrollWidth;
        let lengthHeight = this.$refs.text.scrollHeight;
        if (this.lengthWidth !== lengthWidth) {
            this.lengthWidth = lengthWidth;
        }
        if (this.lengthHeight !== lengthHeight) {
            this.lengthHeight = lengthHeight;
            this.$emit('change', lengthHeight);
        }
    },
    refreshClient: function () {
        let clientWidth = this.$refs.text.clientWidth;
        let clientHeight = this.$refs.text.clientHeight;
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
        let sl = Math.round(this.$refs.text.scrollLeft);
        if (this.scrollLeftEmit !== sl) {
            this.scrollLeftEmit = sl;
            this.$emit('update:scrollLeft', sl);
        }
        let st = Math.round(this.$refs.text.scrollTop);
        if (this.scrollTopEmit !== st) {
            this.scrollTopEmit = st;
            this.$emit('update:scrollTop', st);
        }
    }
};
exports.mounted = function () {
    clickgo.dom.watchSize(this.$refs.text, () => __awaiter(this, void 0, void 0, function* () {
        this.refreshClient();
    }), true);
    this.refreshLength();
    this.$refs.text.scrollTop = this.scrollTop;
    this.$refs.text.scrollLeft = this.scrollLeft;
};
