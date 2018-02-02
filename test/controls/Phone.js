"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = {
    list: []
};
exports.methods = {
    action: function (name, list, item, index) {
        switch (name) {
            case "Add line":
                list.splice(index + 1, 0, []);
                break;
            case "Remove line":
                list.splice(index, 1);
                break;
            case "Add Button":
                item.push("1");
                break;
        }
    }
};
