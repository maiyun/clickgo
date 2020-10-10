"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'direction': {
        'default': 'h'
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
        'left': '-5000px',
        'top': '0px',
        'zIndex': '0'
    }
};
exports.methods = {
    click: function (event) {
        var _a, _b, _c, _d, _e, _f;
        if (this.disabled) {
            if ((_c = (_b = (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$parent) === null || _b === void 0 ? void 0 : _b.$parent) === null || _c === void 0 ? void 0 : _c.itemPopShowing) {
                clickgo.form.hidePop(this.$parent.$parent.$parent.itemPopShowing);
            }
            return;
        }
        (_f = (_e = (_d = this.$parent) === null || _d === void 0 ? void 0 : _d.$parent) === null || _e === void 0 ? void 0 : _e.$parent) === null || _f === void 0 ? void 0 : _f.select(this.value);
        clickgo.form.hidePop();
        this.cgTap(event);
    },
    controlClick: function (e) {
        if (this.disabled) {
            return;
        }
        if (this.popOpen) {
            clickgo.form.hidePop(this);
            return;
        }
        this.showPop(e);
    },
    showPop: function (e) {
        var _a, _b;
        if (this.popOpen) {
            return;
        }
        if (!((_b = (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$parent) === null || _b === void 0 ? void 0 : _b.$parent) || this.$parent.$parent.$parent.$data._controlName !== 'greatselect-list') {
            return;
        }
        if (this.$parent.$parent.$parent.itemPopShowing) {
            clickgo.form.hidePop(this.$parent.$parent.$parent.itemPopShowing);
        }
        this.$parent.$parent.$parent.itemPopShowing = this;
        this.popOpen = true;
        this.popOptions = clickgo.form.showPop(this, e.pageX, e.pageY);
    },
    hidePop: function () {
        var _a, _b, _c, _d;
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (((_c = (_b = (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$parent) === null || _b === void 0 ? void 0 : _b.$parent) === null || _c === void 0 ? void 0 : _c.itemPopShowing) === this) {
            this.$parent.$parent.$parent.itemPopShowing = undefined;
        }
        if ((_d = this.subPop) === null || _d === void 0 ? void 0 : _d.itemPopShowing) {
            this.subPop.itemPopShowing.hidePop();
        }
    }
};
exports.unmounted = function () {
    var _a, _b;
    if ((_b = (_a = this.$parent) === null || _a === void 0 ? void 0 : _a.$parent) === null || _b === void 0 ? void 0 : _b.$parent) {
        if (this === this.$parent.$parent.$parent.itemPopShowing) {
            clickgo.form.hidePop(this);
        }
    }
};
