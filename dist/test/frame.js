define(["require", "exports", "deskrt"], function (require, exports, DeskRT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = {
        username: "DeskUI"
    };
    exports.methods = {
        setLocale: function (l) {
            DeskRT.setLocale(l);
        }
    };
});
