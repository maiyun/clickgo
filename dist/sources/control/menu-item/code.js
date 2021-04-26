"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'alt': {
        'default': undefined
    }
};
exports.data = {
    'popOpen': false,
    'selfPop': undefined,
    'popOptions': {
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.methods = {
    enter: function (e) {
        var _a;
        this.cgEnter(e);
        if (this.cgHasTouch) {
            return;
        }
        if (this.isDisabled) {
            return;
        }
        if (!((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.itemPopShowing)) {
            return;
        }
        this.showPop();
    },
    click: function (event) {
        if (this.isDisabled) {
            return;
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            this.cgTap(event);
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
        if ((_b = this.selfPop) === null || _b === void 0 ? void 0 : _b.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};
exports.unmounted = function () {
    if (this.$parent && (this === this.$parent.itemPopShowing)) {
        clickgo.form.hidePop(this);
    }
};
