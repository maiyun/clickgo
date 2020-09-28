"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'text': {
        'default': ''
    },
    'alt': {
        'default': undefined
    }
};
exports.data = {
    'popOpen': false,
    'subPop': undefined,
    'popOptions': {
        'left': '0px',
        'top': '0px',
        'zIndex': '0'
    }
};
exports.methods = {
    mousein: function () {
        var _a;
        if (this.disabled) {
            return;
        }
        if (!((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.itemPopShowing)) {
            return;
        }
        this.showPop();
    },
    click: function (event) {
        if (this.disabled) {
            return;
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop();
        this.cgTap(event);
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
        this.$parent.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, 'v');
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
exports.unmounted = function () {
    if (this.$parent) {
        if (this === this.$parent.itemPopShowing) {
            clickgo.form.hidePop(this.itemPopShowing);
        }
    }
};
