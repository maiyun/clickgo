"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.computed = exports.props = void 0;
exports.props = {
    'direction': {
        'default': 'h'
    },
    'label': {
        'default': ''
    },
    'value': {
        'default': undefined
    }
};
exports.computed = {
    'show': function () {
        var _a;
        return this.$parent ? this.$parent.selected === ((_a = this.value) !== null && _a !== void 0 ? _a : this.label) : false;
    }
};
exports.watch = {
    'show': function () {
        if (this.showTab) {
            this.$emit('show');
        }
        else {
            this.$emit('hide');
        }
    }
};
