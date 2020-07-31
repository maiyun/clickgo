"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.updated = exports.methods = exports.data = exports.props = void 0;
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
    "leftData": -20070831,
    "topData": -20070831,
    "zIndexData": 0,
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
exports.updated = function () {
    var i;
    for (i = 1; i < this.$children[0].$children[0].$slots.default.length; ++i) {
        var item = this.$children[0].$children[0].$slots.default[i].children[0].componentInstance;
        if (item.index !== i - 1) {
            item.index = i - 1;
        }
    }
};
exports.mounted = function () {
    ClickGo.appendToPop(this.$el);
};
exports.destroyed = function () {
    ClickGo.removeFromPop(this.$el);
};
