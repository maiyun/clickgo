"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.data = void 0;
exports.data = {
    'left': 0,
    'top': 0,
    'width': 100,
    'list': []
};
exports.methods = {
    resizeTaskBar: function () {
        var pos = clickgo.getPosition();
        this.top = pos.height;
        this.width = pos.width;
    }
};
exports.mounted = function () {
    var _this = this;
    this.resizeTaskBar();
    this.setSystemEventListener('screenResize', function () {
        _this.resizeTaskBar();
    });
    this.setSystemEventListener('formCreated', function (taskId, formId, title) {
        if (taskId === 1) {
            return;
        }
        _this.list.push({ 'taskId': taskId, 'formId': formId, 'title': title });
    });
    this.setSystemEventListener('formRemoved', function (taskId, formId, title) {
        for (var i = 0; i < _this.list.length; ++i) {
            if (_this.list[i].formId === formId) {
                _this.list.splice(i, 1);
                break;
            }
        }
    });
    this.setTopMost(true);
};
