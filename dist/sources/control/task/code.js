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
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        e.stopPropagation();
        e.preventDefault();
        clickgo.form.hidePop();
        if (e instanceof MouseEvent) {
            return;
        }
        if ((e.target === this.$refs.wrap) || (e.target === this.$refs.task) || (e.target === this.$refs.tray)) {
            clickgo.dom.bindLong(e, () => {
                this.cgShowPop(e);
            });
        }
    },
    contextmenu: function (e) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if ((e.target === this.$refs.wrap) || (e.target === this.$refs.task) || (e.target === this.$refs.tray)) {
            this.cgShowPop(e);
        }
    }
};
