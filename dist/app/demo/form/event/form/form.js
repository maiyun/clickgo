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
            'formId': formId,
            'title': title,
            'icon': icon
        });
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'name': 'formCreated',
            'text': `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 5) + '...' : 'null'}`
        });
    });
};
