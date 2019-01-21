define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = {
        q: "input",
        w: "none"
    };
    exports.watch = {
        q: function () {
            var a = [];
            for (var i = 0; i < this.q.length; ++i) {
                a.push("{" + this.q.charCodeAt(i) + "}");
            }
            this.w = a.join("");
        }
    };
});
