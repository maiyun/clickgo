"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = exports.props = void 0;
exports.props = {
    "disabled": {
        "default": false
    },
    "text": {
        "default": ""
    },
    "alt": {
        "default": undefined
    }
};
exports.data = {
    "popOpen": false
};
exports.methods = {
    showPop: function (event) {
        if (this.popOpen) {
            ClickGo.hidePop();
            return;
        }
        ClickGo.showPop(this.$children[0], this.$el);
        this._tap(event);
    },
    mousein: function (event) {
        if (ClickGo.siblings(this.$el, "cg-pop-open")) {
            ClickGo.hidePop();
            this.showPop(event);
        }
    }
};
