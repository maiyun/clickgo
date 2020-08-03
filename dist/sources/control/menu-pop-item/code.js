"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyed = exports.mounted = exports.methods = exports.watch = exports.data = exports.props = void 0;
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
    "showArrow": false
};
exports.watch = {
    "type": function () {
        if (this.type) {
            ++this.$parent.hasTypeItemsCount;
        }
        else {
            --this.$parent.hasTypeItemsCount;
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
            if (!this.showArrow) {
                ClickGo.hidePop();
            }
            this._tap(event);
            return;
        }
        if (this.type === "radio") {
            this.$emit("input", this.label);
        }
        else if (this.type === "check") {
            this.$emit("input", this.value ? false : true);
        }
        ClickGo.hidePop();
        this._tap(event);
    }
};
exports.mounted = function () {
    if (this.$children.length > 0) {
        this.showArrow = true;
        ++this.$parent.hasSubItemsCount;
    }
    if (this.type) {
        ++this.$parent.hasTypeItemsCount;
    }
};
exports.destroyed = function () {
    if (this.showArrow) {
        --this.$parent.hasSubItemsCount;
    }
    if (this.type) {
        --this.$parent.hasTypeItemsCount;
    }
};
