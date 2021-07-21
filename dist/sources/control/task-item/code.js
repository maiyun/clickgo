"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
exports.props = {
    'selected': {
        'default': false
    },
    'opened': {
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
    'position': function () {
        var _a, _b;
        return (_b = (_a = this.cgParent) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'bottom';
    }
};
exports.methods = {
    tap: function (e) {
        this.cgTap(e);
        if (this.$slots.pop) {
            this.cgShowPop('v');
        }
    }
};
