"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'padding': {
        'default': undefined
    },
    'value': {
        'default': ''
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
    click: function (event) {
        var _a, _b, _c;
        if (this.disabled) {
            return;
        }
        clickgo.form.hidePop(this);
        (_c = (_b = (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$parent) === null || _b === void 0 ? void 0 : _b.$parent) === null || _c === void 0 ? void 0 : _c.select(this.value);
        this.cgTap(event);
    },
    controlClick: function (e) {
        if (this.disabled) {
            return;
        }
        this.showPop(e);
    },
    showPop: function (e) {
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
        this.popOptions = clickgo.form.showPop(this, e.pageX, e.pageY);
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
