"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.props = void 0;
exports.props = {
    'position': {
        'default': 'bottom'
    }
};
exports.methods = {
    down: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, (e) => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    contextmenu: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, e);
    }
};
