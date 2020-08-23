"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.props = void 0;
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
    'popOpen': false
};
exports.methods = {
    showPop: function (event) {
        if (this.popOpen) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.$children[0], this.$el);
        this.cgTap(event);
    },
    mousein: function (event) {
        if (clickgo.tool.siblings(this.$el, 'cg-pop-open')) {
            clickgo.form.hidePop();
            this.showPop(event);
        }
    }
};
