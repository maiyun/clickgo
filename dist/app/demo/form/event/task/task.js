"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    },
    'run': function () {
        return __awaiter(this, void 0, void 0, function* () {
            let taskId = yield clickgo.task.run('/clickgo/app/demo/');
            yield this.cgDialog(`Successfully run, task id is: ${taskId}.`);
        });
    },
    'end': function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.cgConfirm(`Are you sure to end Task ${this.tid}?`)) {
                clickgo.task.end(this.tid);
            }
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
