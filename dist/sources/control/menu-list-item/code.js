"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.updated = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'text': {
        'default': ''
    },
    'alt': {
        'default': undefined
    },
    'type': {
        'default': undefined
    },
    'label': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
    }
};
exports.data = {
    'popOpen': false,
    'subPop': undefined,
    'showArrow': false,
    'popOptions': {
        'left': '0px',
        'top': '0px',
        'zIndex': '0'
    }
};
exports.watch = {
    'type': {
        handler: function () {
            if (!this.$parent) {
                return;
            }
            if (this.type) {
                ++this.$parent.hasTypeItemsCount;
            }
            else {
                --this.$parent.hasTypeItemsCount;
            }
        },
        'immediate': false
    }
};
exports.updated = function () {
    if (this.$parent) {
        if (this.cgSlos().length > 0) {
            if (!this.showArrow) {
                this.showArrow = true;
                ++this.$parent.hasSubItemsCount;
            }
        }
        else {
            if (this.showArrow) {
                this.showArrow = false;
                --this.$parent.hasSubItemsCount;
            }
        }
    }
};
exports.methods = {
    click: function (event) {
        if (this.disabled) {
            return;
        }
        if (!this.type) {
            if (!this.showArrow) {
                clickgo.form.hidePop();
            }
            this.cgTap(event);
            return;
        }
        if (this.type === 'radio') {
            this.$emit('update:modelValue', this.label);
        }
        else if (this.type === 'check') {
            this.$emit('update:modelValue', this.modelValue ? false : true);
        }
        clickgo.form.hidePop();
        this.cgTap(event);
    },
    mousein: function () {
        if (this.disabled) {
            return;
        }
        this.showPop();
    },
    showPop: function () {
        if (this.popOpen) {
            return;
        }
        if (!this.$parent) {
            return;
        }
        if (this.$parent.itemPopShowing) {
            clickgo.form.hidePop(this.$parent.itemPopShowing);
        }
        let list = this.cgSlos();
        if (list.length === 0) {
            return;
        }
        this.$parent.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, 'h');
    },
    hidePop: function () {
        var _a, _b;
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.itemPopShowing) === this) {
            this.$parent.itemPopShowing = undefined;
        }
        if ((_b = this.subPop) === null || _b === void 0 ? void 0 : _b.itemPopShowing) {
            this.subPop.itemPopShowing.hidePop();
        }
    }
};
exports.mounted = function () {
    if (this.$parent) {
        if (this.type) {
            ++this.$parent.hasTypeItemsCount;
        }
    }
};
exports.unmounted = function () {
    if (this.$parent) {
        if (this.showArrow) {
            --this.$parent.hasSubItemsCount;
        }
        if (this.type) {
            --this.$parent.hasTypeItemsCount;
        }
        if (this === this.$parent.itemPopShowing) {
            clickgo.form.hidePop(this.itemPopShowing);
        }
    }
};
