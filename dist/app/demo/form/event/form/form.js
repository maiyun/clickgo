"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.data = void 0;
exports.data = {
    'flist': [],
    'list': []
};
exports.mounted = function () {
    this.cgSetSystemEventListener('formCreated', (taskId, formId, title, icon) => {
        this.flist.push({
            'taskId': taskId,
            'formId': formId,
            'title': title,
            'icon': icon
        });
    });
};
