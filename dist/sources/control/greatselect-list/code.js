"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
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
    'adaptation': {
        'dafault': true
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
exports.watch = {
    'data': {
        handler: function () {
            if (this.data[this.modelValue] !== undefined) {
                return;
            }
            this.select();
        },
        'deep': true
    }
};
exports.methods = {
    select: function (value) {
        if (value && this.data[value]) {
            this.$emit('update:modelValue', value);
            return;
        }
        if (Array.isArray(this.data)) {
            this.$emit('update:modelValue', 0);
        }
        else {
            for (let k in this.data) {
                this.$emit('update:modelValue', k);
                break;
            }
        }
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
