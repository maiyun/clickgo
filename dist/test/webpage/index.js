"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("../../index");
const state = document.getElementById('state');
const init = document.getElementById('init');
const href = document.getElementById('href');
let already = false;
class Boot extends clickgo.AbstractBoot {
    main() {
        state.innerHTML = 'Initialized.';
        init.style.pointerEvents = '';
        init.style.userSelect = '';
        init.style.color = '';
        href.style.color = '';
        href.addEventListener('click', () => {
            if (already) {
                return;
            }
            already = true;
            state.innerHTML = 'Task starting...';
            href.removeAttribute('href');
            clickgo.task.run('../../app/demo/').then((taskId) => {
                state.innerHTML = 'Task ' + taskId.toString() + ' running...';
            }).catch((e) => {
                console.log('e', e);
            });
        });
    }
    onError(taskId, formId, error) {
        state.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    }
    onTaskEnded(taskId) {
        state.innerHTML = 'Task ' + taskId.toString() + ' ended.';
    }
}
clickgo.launcher(new Boot());
