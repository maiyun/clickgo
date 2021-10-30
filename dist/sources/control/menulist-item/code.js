"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeUnmounted = exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
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
    'direction': 'h'
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
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
    click: function (e) {
        if (this.isDisabled) {
            return;
        }
        if (!this.type) {
            if (!this.cgSelfPop) {
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
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.isDisabled) {
            return;
        }
        this.cgShowPop('h');
    },
    down: function (e) {
        this.cgDown(e);
        if (this.isDisabled) {
            return;
        }
        this.cgShowPop('h');
    }
};
exports.mounted = function () {
    let menulist = this.cgParentByName('menulist');
    if (!menulist) {
        return;
    }
    if (this.type) {
        ++menulist.hasTypeItemsCount;
    }
};
exports.beforeUnmounted = function () {
    if (!this.menulist) {
        return;
    }
    if (this.type) {
        --this.menulist.hasTypeItemsCount;
    }
};
