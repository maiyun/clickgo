"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'alt': {
        'default': undefined
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.methods = {
    enter: function (e) {
        this.cgEnter(e);
        if (this.isDisabled) {
            return;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.cgParentPopLayer.cgChildPopItemShowing) {
            return;
        }
        this.cgShowPop('v', { 'null': true });
    },
    click: function (e) {
        if (this.isDisabled) {
            return;
        }
        this.cgTap(e);
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
            return;
        }
        this.cgShowPop('v', { 'null': true });
    }
};
