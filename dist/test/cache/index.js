import * as clickgo from 'clickgo';
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
            clickgo.task.run(this._sysId, '../../app/demo.cga?' + clickgo.tool.rand(100000, 999999).toString()).then((taskId) => {
                state.innerHTML = 'Task ' + taskId.toString() + ' running...';
            }).catch(() => { });
        });
    }
    onError(taskId, formId, error) {
        state.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId).catch(() => { });
    }
    onTaskEnded(taskId) {
        state.innerHTML = 'Task ' + taskId.toString() + ' ended.';
    }
}
await clickgo.launcher(new Boot());
