define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function pad(str, len) {
        if (len === void 0) { len = 2; }
        if (str.length >= len) {
            return str;
        }
        var l = len - str.length;
        var p = "";
        for (var i = 0; i < l; ++i) {
            p += "0";
        }
        return p + str;
    }
    function date() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = date.getFullYear() + seperator1 + pad(month.toString()) + seperator1 + pad(strDate.toString())
            + " " + pad(date.getHours().toString()) + seperator2 + pad(date.getMinutes().toString())
            + seperator2 + pad(date.getSeconds().toString()) + " " + pad(date.getMilliseconds().toString(), 3);
        return currentdate;
    }
    exports.date = date;
});
