"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'direction': {
        'default': 'h'
    },
    'gutter': {
        'default': undefined
    },
    'buttons': {
        'default': ['OK']
    }
};
exports.data = {
    'padding': ''
};
exports.computed = {
    'paddingMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.methods = {
    click: function (item) {
        this.$emit('select', item);
    }
};
exports.mounted = function () {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
