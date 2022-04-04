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
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const length = clickgo.dom.siblingsData(this.$el, 'cg-pop-open').length;
        if (length === 0) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'null': true
        });
    },
    click: function () {
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$refs.pop);
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'null': true
        });
    }
};
