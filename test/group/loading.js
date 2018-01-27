"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = {
    loading: false
};
exports.methods = {
    elOpen: function () {
        var _this = this;
        this.loading = true;
        setTimeout(function () {
            _this.loading = false;
        }, 1000);
    }
};
