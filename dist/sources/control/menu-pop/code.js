"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    }
};
exports.data = {
    "open": false
};
exports.methods = {
    onHide: function () {
        for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item.popOpen) {
                continue;
            }
            ClickGo.hidePop(item.$children[0]);
        }
    }
};
exports.mounted = function () {
    ClickGo.appendToPop(this.$el);
};
exports.destroyed = function () {
    ClickGo.removeFromPop(this.$el);
};