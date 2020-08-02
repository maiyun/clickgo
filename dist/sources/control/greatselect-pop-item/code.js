"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.props = void 0;
exports.props = {
    "disabled": {
        "default": false
    },
    "value": {
        "default": ""
    }
};
exports.data = {
    "popOpen": false
};
exports.methods = {
    click: function (event) {
        if (this.disabled) {
            return;
        }
        ClickGo.hidePop();
        this.$parent.$parent.$parent.select(this.value);
        this._tap(event);
    }
};
