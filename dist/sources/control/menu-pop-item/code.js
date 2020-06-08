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
    },
    "type": {
        "default": undefined
    },
    "label": {
        "default": undefined
    },
    "value": {
        "default": undefined
    }
};
exports.data = {
    "popOpen": false,
    "showArrow": false,
    "thePopHasSubCount": 0,
    "thePopHasTypeCount": 0
};
exports.watch = {
    "type": function () {
        if (this.type) {
            for (var _i = 0, _a = this.$parent.$children; _i < _a.length; _i++) {
                var item = _a[_i];
                ++item.thePopHasTypeCount;
            }
        }
        else {
            for (var _b = 0, _c = this.$parent.$children; _b < _c.length; _b++) {
                var item = _c[_b];
                --item.thePopHasTypeCount;
            }
        }
    }
};
exports.methods = {
    mousein: function (event) {
        if (this.popOpen) {
            return;
        }
        for (var _i = 0, _a = this.$parent.$children; _i < _a.length; _i++) {
            var item = _a[_i];
            if (!item.popOpen) {
                continue;
            }
            ClickGo.hidePop(item.$children[0]);
            break;
        }
        if (this.$children.length === 0) {
            return;
        }
        ClickGo.showPop(this.$children[0], this.$el, 1);
    },
    click: function (event) {
        if (this.disabled) {
            return;
        }
        if (this.type === undefined) {
            this._tap(event);
            if (!this.showArrow) {
                ClickGo.hidePop();
            }
            return;
        }
        if (this.type === "radio") {
            this.$emit("input", this.label);
        }
        else if (this.type === "check") {
            this.$emit("input", this.value ? false : true);
        }
        ClickGo.hidePop();
    }
};
exports.mounted = function () {
    if (this.$children.length > 0) {
        this.showArrow = true;
        for (var _i = 0, _a = this.$parent.$children; _i < _a.length; _i++) {
            var item = _a[_i];
            ++item.thePopHasSubCount;
        }
    }
    if (this.type) {
        for (var _b = 0, _c = this.$parent.$children; _b < _c.length; _b++) {
            var item = _c[_b];
            ++item.thePopHasTypeCount;
        }
    }
};
exports.destroyed = function () {
    if (this.showArrow) {
        for (var _i = 0, _a = this.$parent.$children; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.$data._controlName.split(0, 9) !== "menu-pop-") {
                continue;
            }
            --item.thePopHasSubCount;
        }
    }
    if (this.type) {
        for (var _b = 0, _c = this.$parent.$children; _b < _c.length; _b++) {
            var item = _c[_b];
            if (item.$data._controlName.split(0, 9) !== "menu-pop-") {
                continue;
            }
            --item.thePopHasTypeCount;
        }
    }
};
