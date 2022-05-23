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
const clickgo = require("clickgo");
exports.data = {
    'tlist': [],
    'list': [],
    'tid': 0
};
exports.methods = {
    'pushConsole': function (name, text) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    },
    'run': function () {
        return __awaiter(this, void 0, void 0, function* () {
            const taskId = yield clickgo.task.run('/clickgo/app/demo/');
            yield clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
        });
    },
    'end': function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield clickgo.form.confirm(`Are you sure to end Task ${this.tid}?`)) {
                clickgo.task.end(parseInt(this.tid));
            }
        });
    },
    'runTask': function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (clickgo.task.systemTaskInfo.taskId > 0) {
                yield clickgo.form.dialog('The Task APP is already running.');
                return;
            }
            const taskId = yield clickgo.task.run('/clickgo/app/task/');
            yield clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
        });
    }
};
const mounted = function () {
    const list = clickgo.task.getList();
    for (const tid in list) {
        this.tlist.push({
            'label': 'Task ' + tid,
            'value': parseInt(tid)
        });
    }
    clickgo.core.setSystemEventListener('taskStarted', (taskId) => {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    });
    clickgo.core.setSystemEventListener('taskEnded', (taskId) => {
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
exports.mounted = mounted;
