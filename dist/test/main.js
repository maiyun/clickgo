define(["require", "exports", "deskrt"], function (require, exports, DeskRT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.data = {
        price: "3491.12",
        sms: "99998",
        smsy: "993",
        list: [{
                type: "Type1",
                name: "One, One, One",
                time: "2018-01-16 16:41"
            }, {
                type: "Type1",
                name: "Two, Two, Two",
                time: "2018-01-16 14:00"
            }],
        themeName: "chalk"
    };
    exports.methods = {
        changeTheme: function (name) {
            this.themeName = name;
            if (name === "chalk") {
                DeskRT.setTheme("");
            }
            else {
                DeskRT.setTheme(name);
            }
        },
        setAsideWidth: function (width) {
            DeskRT.setAsideWidth(width);
        }
    };
});