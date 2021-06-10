"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.data = void 0;
exports.data = {
    'tlist': [],
    'list': [],
    'tid': 0
};
exports.methods = {
    'pushConsole': function (name, text) {
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'name': name,
            'text': text
        });
    }
};
exports.mounted = function () {
    let list = clickgo.task.getList();
    for (let tid in list) {
        this.tlist.push({
            'label': 'Task ' + tid,
            'value': tid
        });
    }
    this.cgSetSystemEventListener('taskStarted', (taskId) => {
        this.tlist.push({
            'label': 'Task ' + taskId,
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    });
    this.cgSetSystemEventListener('taskEnded', (taskId) => {
        for (let i = 0; i < this.tlist.length; ++i) {
            if (this.tlist[i].value !== taskId) {
                continue;
            }
            this.tlist.splice(i, 1);
            break;
        }
        this.pushConsole('taskEnded', `taskId: ${taskId}`);
    });
};
