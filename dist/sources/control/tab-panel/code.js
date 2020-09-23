"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watch = exports.computed = exports.props = void 0;
exports.props = {
    'label': {
        'default': ''
    },
    'name': {
        'default': undefined
    }
};
exports.computed = {
    'showTab': function () {
        return this.$parent ? this.$parent.selected === (this.name || this.label) : false;
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
