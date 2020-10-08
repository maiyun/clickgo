"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.computed = exports.data = exports.props = void 0;
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
    'flex': {
        'default': ''
    },
    'same': {
        'default': false
    },
    'data': {
        'default': []
    },
    'modelValue': {
        'default': 0
    }
};
exports.data = {
    'itemPopShowing': undefined,
    'direction': 'v'
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
exports.methods = {
    select: function (index) {
        this.$emit('update:modelValue', index);
    }
};
exports.mounted = function () {
    var _a;
    if (((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.popOpen) !== undefined) {
        this.$parent.subPop = this;
    }
};
exports.unmounted = function () {
    var _a;
    if (((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.subPop) === this) {
        this.$parent.subPop = null;
    }
};
