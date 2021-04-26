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
clickgo.ready(function () {
    return __awaiter(this, void 0, void 0, function* () {
        clickgo.position.offsetHeight = -40;
        let el = document.getElementById('tip');
        if (!el) {
            return;
        }
        el.innerHTML = 'Starting system app...';
        clickgo.core.globalEvents.errorHandler = function (taskId, formId, error, info) {
            if (!el) {
                return;
            }
            console.log(info, error);
            let err = document.getElementById('err');
            err.style.display = 'block';
            err.innerHTML = 'Error, Task ID: ' + taskId + ', Form ID: ' + formId + '<br>' + error.stack.replace(/\n/g, '<br>');
            clickgo.task.end(taskId);
        };
        clickgo.core.globalEvents.taskEndedHandler = function (taskId) {
            el.innerHTML = 'Task(' + taskId + ') ended.';
        };
        if (!clickgo.isNative) {
            let sTaskId = yield clickgo.task.run('sapp/');
            if (sTaskId <= 0) {
                el.innerHTML = `Start failed(${sTaskId.toString()}).`;
                return;
            }
        }
        el.innerHTML = 'Starting app...';
        let taskId = yield clickgo.task.run('clickgo/app/demo/');
        if (taskId <= 0) {
            el.innerHTML = `Start failed(${taskId.toString()}).`;
            return;
        }
        el.innerHTML = 'Running...';
        document.getElementsByTagName('body')[0].classList.add('running');
    });
});
