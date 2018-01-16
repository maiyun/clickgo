"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var datetime = require("../libs/date");
exports.data = {
    list: []
};
exports.methods = {
    elOpen: function () {
        this.$data.list.push(datetime.date());
    }
};
