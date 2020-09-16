"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    }
};
exports.data = {
    'leftData': -20070831,
    'topData': -20070831,
    'zIndexData': 0,
    'open': false,
    'hasSubItemsCount': 0,
    'hasTypeItemsCount': 0
};
exports.methods = {
    onHide: function () {
        for (let item of this.$children) {
            if (!item.popOpen) {
                continue;
            }
            clickgo.form.hidePop(item.$children[0]);
        }
    }
};
exports.mounted = function () {
    clickgo.form.appendToPop(this.$el);
};
exports.unmounted = function () {
    clickgo.form.removeFromPop(this.$el);
};
