"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'label': {
        'default': ''
    }
};
exports.data = {
    'index': -1
};
exports.computed = {
    'showTab': function () {
        var _a;
        return ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.selectedIndex) === this.index;
    }
};
exports.watch = {
    'showTab': function () {
        if (this.showTab) {
            this.$emit('show');
        }
        else {
            this.$emit('hide');
        }
    }
};
