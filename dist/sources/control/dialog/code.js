"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'direction': {
        'default': 'h'
    },
    'flex': {
        'default': ''
    },
    'padding': {
        'default': undefined
    },
    'gutter': {
        'default': undefined
    },
    'buttons': {
        'default': ['OK']
    }
};
exports.methods = {
    click: function (item) {
        this.$emit('select', item);
    }
};
