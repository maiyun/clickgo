"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receive = exports.data = void 0;
exports.data = {
    'title': 'Text viewer',
    'content': ''
};
const receive = function (obj) {
    if (obj.taskId !== this.taskId) {
        return;
    }
    this.title = obj.title + ' - Text viewer';
    this.content = obj.content;
};
exports.receive = receive;
