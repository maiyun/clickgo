"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.props = void 0;
exports.props = {
    "disabled": {
        "default": false
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
        this._tap(event);
    }
};
