"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = {
    "alwaysOnTop": false,
    "speed": "N"
};
exports.methods = {
    newTask: function () {
        this.createForm("/form/new");
    },
    exit: function () {
        ClickGo.endTask(this.taskId);
    }
};
