"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
exports.props = {
    'selected': {
        'default': false
    },
    'opened': {
        'default': false
    },
    'multi': {
        'default': false
    }
};
exports.computed = {
    'isSelected': function () {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function () {
        return clickgo.tool.getBoolean(this.opened);
    },
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    },
    'position': function () {
        var _a, _b;
        return (_b = (_a = this.cgParentByName('task')) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'bottom';
    }
};
exports.methods = {
    click: function () {
        if (!this.$slots.pop) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
    },
    contextmenu: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
    },
    down: function (e) {
        var _a;
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            if (e instanceof MouseEvent && e.button === 2) {
                if (this.$el.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
            else {
                if (((_a = this.$refs.contextmenu) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                var _a;
                if (((_a = this.$refs.pop) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                    clickgo.form.hidePop();
                }
                clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
            });
        }
    }
};
