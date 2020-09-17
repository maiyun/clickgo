"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.watch = exports.data = exports.props = void 0;
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
    'value': {
        'default': undefined
    }
};
exports.data = {
    'popOpen': false,
    'showArrow': false
};
exports.watch = {
    'type': function () {
        if (!this.$parent) {
            return;
        }
        if (this.type) {
            ++this.$parent.hasTypeItemsCount;
        }
        else {
            --this.$parent.hasTypeItemsCount;
        }
    }
};
exports.methods = {
    mousein: function () {
        if (this.popOpen) {
            return;
        }
        if (!this.$parent) {
            return;
        }
        for (let item of this.$parent.$children) {
            if (!item.popOpen) {
                continue;
            }
            clickgo.form.hidePop(item.$children[0]);
            break;
        }
        if (this.$children.length === 0) {
            return;
        }
        clickgo.form.showPop(this.$children[0], this.$el, 1);
    },
    click: function (event) {
        if (this.disabled) {
            return;
        }
        if (this.type === undefined) {
            if (!this.showArrow) {
                clickgo.form.hidePop();
            }
            this.cgTap(event);
            return;
        }
        if (this.type === 'radio') {
            this.$emit('input', this.label);
        }
        else if (this.type === 'check') {
            this.$emit('input', this.value ? false : true);
        }
        clickgo.form.hidePop();
        this.cgTap(event);
    }
};
exports.mounted = function () {
    if (!this.$parent) {
        return;
    }
    if (this.$children.length > 0) {
        this.showArrow = true;
        ++this.$parent.hasSubItemsCount;
    }
    if (this.type) {
        ++this.$parent.hasTypeItemsCount;
    }
};
exports.unmounted = function () {
    if (!this.$parent) {
        return;
    }
    if (this.showArrow) {
        --this.$parent.hasSubItemsCount;
    }
    if (this.type) {
        --this.$parent.hasTypeItemsCount;
    }
};
