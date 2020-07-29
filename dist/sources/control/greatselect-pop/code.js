"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.methods = exports.data = exports.props = void 0;
exports.props = {
    "height": {
        "default": undefined
    },
    "same": {
        "default": false
    },
    "data": {
        "default": []
    }
};
exports.data = {
    "widthData": undefined,
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
