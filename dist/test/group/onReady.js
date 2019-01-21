define(["require", "exports", "../libs/date"], function (require, exports, datetime) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = {
        list: []
    };
    exports.methods = {
        onReady: function () {
            this.$data.list.push(datetime.date());
        }
    };
});
