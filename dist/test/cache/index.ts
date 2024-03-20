import * as clickgo from '../../index';

const state = document.getElementById('state')!;
const init = document.getElementById('init')!;
const href = document.getElementById('href')!;

let already = false;

class Boot extends clickgo.AbstractBoot {

    public main(): void {
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
            clickgo.task.run('../../app/demo/', {
                'cache': '1'
            }).then((taskId) => {
                state.innerHTML = 'Task ' + taskId.toString() + ' running...';
            }).catch((e) => {
                console.log('e', e);
            });
        });
    }

    public onError(taskId: number, formId: number, error: Error): void {
        state.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    }

    public onTaskEnded(taskId: number): void {
        state.innerHTML = 'Task ' + taskId.toString() + ' ended.';
    }

}

clickgo.launcher(new Boot());
