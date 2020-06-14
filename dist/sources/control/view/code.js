"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "width": {
        "default": undefined
    },
    "height": {
        "default": undefined
    },
    "left": {
        "default": 0
    },
    "top": {
        "default": 0
    },
    "zIndex": {
        "default": 0
    },
    "flex": {
        "default": ""
    },
    "direction": {
        "default": "v"
    },
    "scrolOffset": {
        "default": 0
    }
};
exports.data = {
    "length": 0,
    "innerTop": 0,
    "innerLeft": 0
};
exports.methods = {
    wheel: function (e) {
        this.innerTop -= e.deltaY;
        var wrapRect = this.$refs.wrap.getBoundingClientRect();
        var innerRect = this.$refs.inner.getBoundingClientRect();
        var max = -innerRect.height + wrapRect.height;
        if (max > 0) {
            max = 0;
        }
        if (this.innerTop > 0) {
            this.innerTop = 0;
        }
        else if (this.innerTop < max) {
            this.innerTop = max;
        }
    },
    down: function (e) {
        var _this = this;
        if (e instanceof MouseEvent && ClickGo.hasTouch) {
            return;
        }
        var wrapRect = this.$refs.wrap.getBoundingClientRect();
        var innerRect = this.$refs.inner.getBoundingClientRect();
        console.log(wrapRect.left, wrapRect.right, innerRect.bottom - wrapRect.bottom, wrapRect.top - innerRect.top);
        ClickGo.bindMove(e, {
            "object": this.$refs.inner,
            "offsetLeft": wrapRect.left,
            "offsetRight": wrapRect.right,
            "offsetTop": innerRect.bottom - wrapRect.bottom,
            "offsetBottom": wrapRect.top - innerRect.top,
            "move": function (ox, oy) {
                _this.innerTop += ox;
                _this.innerLetf += oy;
            }
        });
    }
};
exports.mounted = function () {
    this._subDownStop();
};
