"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    "alwaysOnTop": false,
    "speed": "N"
};
exports.methods = {
    newTask: function () {
        this.createForm("/form/new", {
            "mask": true
        });
    },
    exit: function () {
        ClickGo.endTask(this.taskId);
    }
};
