"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'padding': {
        'default': undefined
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
    'selfPop': undefined,
    'direction': 'h',
    'menulist': undefined,
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
exports.watch = {
    'type': {
        handler: function () {
            var _a;
            let menulist = (_a = this.menulist) !== null && _a !== void 0 ? _a : this.cgFindParent('menulist');
            if (!menulist) {
                return;
            }
            if (this.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        },
        'immediate': true
    }
};
exports.methods = {
    click: function (e) {
        if (this.isDisabled) {
            return;
        }
        if (!this.type) {
            if (!this.selfPop) {
                clickgo.form.hidePop();
            }
            this.cgTap(e);
            return;
        }
        if (this.type === 'radio') {
            this.$emit('update:modelValue', this.label);
        }
        else if (this.type === 'check') {
            this.$emit('update:modelValue', this.modelValue ? false : true);
        }
        clickgo.form.hidePop();
        this.cgTap(e);
    },
    enter: function (e) {
        this.cgEnter(e);
        if (this.cgHasTouch) {
            return;
        }
        if (this.isDisabled) {
            return;
        }
        this.showPop();
    },
    down: function (e) {
        this.cgDown(e);
        if (this.isDisabled) {
            return;
        }
        this.showPop();
    },
    showPop: function () {
        if (this.popOpen) {
            return;
        }
        if (!this.menulist) {
            return;
        }
        if (this.menulist.itemPopShowing) {
            clickgo.form.hidePop(this.menulist.itemPopShowing);
        }
        if (this.selfPop) {
            this.menulist.itemPopShowing = this;
            this.popOpen = true;
            this.popOptions = clickgo.form.showPop(this, 'h');
        }
    },
    hidePop: function () {
        var _a;
        if (!this.popOpen) {
            return;
        }
        this.popOpen = false;
        if (!this.menulist) {
            return;
        }
        if (this.menulist.itemPopShowing === this) {
            this.menulist.itemPopShowing = undefined;
        }
        if ((_a = this.selfPop) === null || _a === void 0 ? void 0 : _a.itemPopShowing) {
            this.selfPop.itemPopShowing.hidePop();
        }
    }
};
exports.mounted = function () {
    let menulist = this.cgFindParent('menulist');
    if (!menulist) {
        return;
    }
    this.menulist = menulist;
    if (this.type) {
        ++menulist.hasTypeItemsCount;
    }
};
exports.unmounted = function () {
    if (!this.menulist) {
        return;
    }
    if (this.type) {
        --this.menulist.hasTypeItemsCount;
    }
    if (this === this.menulist.itemPopShowing) {
        clickgo.form.hidePop(this);
    }
};
