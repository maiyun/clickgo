"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "label": {
        "default": ""
    }
};
exports.data = {
    "index": 0,
    "selectedIndex": 0
};
exports.watch = {
    "label": {
        handler: function () {
            this.$parent.tabs[ClickGo.getIndex(this.$el)] = {
                "label": this.label,
                "name": this.name
            };
        }
    }
};
exports.mounted = function () {
    this.index = ClickGo.getIndex(this.$el);
    this.$parent.tabs[this.index] = {
        "label": this.label,
        "name": this.name
    };
    if (this.$parent.selectedIndex !== undefined) {
        this.selectedIndex = this.$parent.selectedIndex;
    }
};
exports.beforeDestroy = function () {
    this.$parent.tabs.splice(ClickGo.getIndex(this.$el), 1);
};
