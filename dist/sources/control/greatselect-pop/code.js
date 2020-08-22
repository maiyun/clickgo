"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    'height': {
        'default': undefined
    },
    'same': {
        'default': false
    },
    'data': {
        'default': []
    },
    'value': {
        'default': 0
    }
};
exports.data = {
    'widthData': undefined,
    'leftData': -20070831,
    'topData': -20070831,
    'zIndexData': 0,
    'open': false
};
exports.methods = {
    onHide: function () {
        for (var _i = 0, _a = this.$children[0].$children[0].$children; _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item.popOpen) {
                continue;
            }
            for (var _b = 0, _c = item.$children; _b < _c.length; _b++) {
                var maybeMenu = _c[_b];
                if (maybeMenu.$data._controlName !== 'menu-pop') {
                    continue;
                }
                clickgo.form.hidePop(maybeMenu);
                break;
            }
        }
    },
    select: function (index) {
        this.$emit('input', index);
    }
};
exports.mounted = function () {
    clickgo.form.appendToPop(this.$el);
};
exports.destroyed = function () {
    clickgo.form.removeFromPop(this.$el);
};
