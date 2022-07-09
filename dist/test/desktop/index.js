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
const clickgo = require("../../index");
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const body = document.getElementsByTagName('body')[0];
        const el = document.getElementById('tip');
        if (!el) {
            return;
        }
        el.innerHTML = 'Starting system app...';
        yield clickgo.init();
        clickgo.core.globalEvents.errorHandler = function (taskId, formId, error, info) {
            if (!el) {
                return;
            }
            console.log(info, error);
            const err = document.getElementById('err');
            err.style.display = 'block';
            err.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
            clickgo.task.end(taskId);
        };
        clickgo.core.globalEvents.taskEndedHandler = function (taskId) {
            el.innerHTML = 'Task(' + taskId.toString() + ') ended.';
        };
        const sTaskId = yield clickgo.task.run('/clickgo/app/task/', {
            'progress': false
        });
        if (sTaskId <= 0) {
            el.innerHTML = `Start failed(${sTaskId.toString()}).`;
            return;
        }
        el.innerHTML = 'Starting app...';
        const taskId = yield clickgo.task.run('/clickgo/app/demo/');
        if (taskId <= 0) {
            el.innerHTML = `Start failed(${taskId.toString()}).`;
            return;
        }
        el.innerHTML = 'Running...';
        if (clickgo.getNative()) {
            document.getElementById('spic').style.display = 'none';
        }
        else {
            body.style.background = '#0063b1';
            document.getElementById('spic').style.background = '#0063b1';
        }
    });
})().catch((e) => {
    console.log(e);
});
