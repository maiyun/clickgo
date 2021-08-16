"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'selected': {
        'default': false
    },
    'opened': {
        'default': false
    }
};
exports.data = {
    'menu': 'left'
};
exports.computed = {
    'isSelected': function () {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function () {
        return clickgo.tool.getBoolean(this.opened);
    },
    'position': function () {
        var _a, _b;
        return (_b = (_a = this.cgParent) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'bottom';
    }
};
exports.methods = {
    tap: function (e) {
        this.cgTap(e);
        this.menu = 'left';
        if (!this.$slots.pop) {
            return;
        }
        this.cgCreateTimer(() => {
            this.cgShowPop('v');
        }, 100);
    },
    contextmenu: function (e) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        this.menu = 'right';
        this.cgCreateTimer(() => {
            this.cgShowPop(e);
        }, 100);
    },
    down: function (e) {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.$slots.contextmenu) {
            return;
        }
        clickgo.dom.bindLong(e, () => {
            this.menu = 'right';
            this.cgCreateTimer(() => {
                this.cgShowPop(e);
            }, 100);
        });
    }
};
