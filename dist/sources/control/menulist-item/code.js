"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeUnmounted = exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
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
    'padding': ''
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'opMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.watch = {
    'type': {
        handler: function () {
            let menulist = this.cgParentByName('menulist');
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
    enter: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'h');
    },
    touchstart: function () {
        clickgo.form.showPop(this.$el, this.$refs.pop, 'h');
    },
    click: function () {
        if (!this.type) {
            if (!this.$slots.pop) {
                clickgo.form.hidePop();
            }
            return;
        }
        if (this.type === 'radio') {
            this.$emit('update:modelValue', this.label);
        }
        else if (this.type === 'check') {
            this.$emit('update:modelValue', this.modelValue ? false : true);
        }
        clickgo.form.hidePop();
    }
};
let mounted = function () {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
    let menulist = this.cgParentByName('menulist');
    if (!menulist) {
        return;
    }
    if (this.type) {
        ++menulist.hasTypeItemsCount;
    }
};
exports.mounted = mounted;
let beforeUnmounted = function () {
    if (!this.menulist) {
        return;
    }
    if (this.type) {
        --this.menulist.hasTypeItemsCount;
    }
};
exports.beforeUnmounted = beforeUnmounted;
