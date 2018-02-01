"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = {
    list: []
};
exports.methods = {
    action: function (name, item, index) {
        switch (name) {
            case "Add line":
                this.list.push([]);
                break;
            case "Remove line":
                this.list.splice(index, 1);
                break;
            case "Add Button":
                item.push("1");
                break;
        }
    }
};
