"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = {
    "width": 300,
    "height": 500
};
exports.methods = {
    openOnlyClose: function () {
        this.createForm("/form/onlyClose");
    },
    openThin: function () {
        this.createForm("/form/thin");
    },
    openError: function () {
        this.createForm("/form/error");
    },
    openBorderNone: function () {
        this.createForm("/form/borderNone");
    },
    openAero: function () {
        this.createForm("/form/aero");
    },
    openMax: function () {
        this.createForm("/form/max");
    }
};
