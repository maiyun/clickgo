"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    "controlName": "menu-item",
    "popOpen": false
};
exports.methods = {
    showPop: function (event) {
        if (this.popShow) {
            return;
        }
        var r = this.$el.getBoundingClientRect();
        ClickGo.showPop(this.$children[0], r.left, r.top + r.height);
        this.tap(event);
    },
    mousein: function (event) {
        if (ClickGo.siblings(this.$el, "cg-pop-open")) {
            ClickGo.hidePop();
            this.showPop(event);
        }
    }
};
exports.mounted = function () {
    ClickGo.appendToPop(this.$children[0].$el);
};
exports.destroyed = function () {
    ClickGo.removeFromPop(this.$children[0].$el);
};
