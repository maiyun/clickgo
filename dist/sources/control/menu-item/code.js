"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "disabled": {
        "default": false
    },
    "focus": {
        "default": false
    },
    "text": {
        "default": ""
    },
    "alt": {
        "default": undefined
    }
};
exports.methods = {
    showPop: function () {
        this.$parent.focus = true;
        if (!this.$children[0] || !this.$children[0].setPropData) {
            return;
        }
        var r = this.$el.getBoundingClientRect();
        this.$children[0].setPropData("left", r.left);
        this.$children[0].setPropData("top", r.top + r.height);
        this.$children[0].$el.style.display = "block";
    },
    hidePop: function () {
    },
    mousein: function () {
        if (this.$parent.focus) {
            this.$el.focus();
        }
    }
};
exports.mounted = function () {
    ClickGo.appendToPop(this.$children[0].$el);
};
exports.destroyed = function () {
    ClickGo.removeFromPop(this.$children[0].$el);
};
