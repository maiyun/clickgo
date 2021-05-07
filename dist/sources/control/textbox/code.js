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
    'line-height': {
        'default': 1
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
    'multi': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.refreshLength();
                this.refreshClient();
                this.refreshScroll();
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
    }
};
exports.data = {
    'isFocus': false,
    'value': '',
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'lengthWidth': 0,
    'lengthHeight': 0
};
exports.methods = {
    focus: function () {
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
        this.$emit('modelvalue', this.value);
        this.refreshLength();
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
    clickgo.dom.watchSize(this.$el, () => {
        this.refreshClient();
    }, true);
    this.refreshLength();
    this.$refs.text.scrollTop = this.scrollTop;
    this.$refs.text.scrollLeft = this.scrollLeft;
};
