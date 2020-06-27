"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.props = {
    "label": {
        "default": ""
    }
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
    this.$parent.tabs[ClickGo.getIndex(this.$el)] = {
        "label": this.label,
        "name": this.name
    };
};
exports.beforeDestroy = function () {
    this.$parent.tabs.splice(ClickGo.getIndex(this.$el), 1);
};
