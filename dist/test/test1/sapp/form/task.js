"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = {
    "left": 0,
    "top": 0,
    "width": 100,
    "list": []
};
exports.methods = {
    resizeTaskBar: function () {
        this.top = ClickGo.getHeight();
        this.width = ClickGo.getWidth();
    }
};
exports.mounted = function () {
    var _this = this;
    this.resizeTaskBar();
    this.setSystemEventListener("screenResize", function () {
        _this.resizeTaskBar();
    });
    this.setSystemEventListener("formCreated", function (taskId, formId, title) {
        if (taskId === 1) {
            return;
        }
        _this.list.push({ "taskId": taskId, "formId": formId, "title": title });
    });
    this.setSystemEventListener("formRemoved", function (taskId, formId, title) {
        for (var i = 0; i < _this.list.length; ++i) {
            if (_this.list[i].formId === formId) {
                _this.list.splice(i, 1);
                break;
            }
        }
    });
};
