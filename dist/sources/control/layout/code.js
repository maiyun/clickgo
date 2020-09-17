"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computed = exports.props = void 0;
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
    'gutter': {
        'default': undefined
    },
    'align-h': {
        'default': undefined
    },
    'align-v': {
        'default': undefined
    }
};
exports.computed = {
    'widthPx': function () {
        var _a;
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.direction) ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        var _a;
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.direction) ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    }
};
