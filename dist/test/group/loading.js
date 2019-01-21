define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = {
        loading: false
    };
    exports.methods = {
        onOpen: function () {
            var _this = this;
            this.loading = true;
            setTimeout(function () {
                _this.loading = false;
            }, 1000);
        }
    };
});
