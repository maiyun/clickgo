define(["require", "exports"], function (require, exports) {
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
    var linkEle = document.getElementById("themeLink");
    exports.methods = {
        changeTheme: function (name) {
            this.themeName = name;
            if (name === "chalk") {
                linkEle.setAttribute("href", "");
            }
            else {
                linkEle.setAttribute("href", "../theme/" + name + "/index.css");
            }
        }
    };
});
