import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const data = {
    'tlist': [],
    'list': [],
    'tid': 0
};

export const methods = {
    'pushConsole': function(this: types.IVForm, name: string, text: string): void {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    },
    'run': async function(this: types.IVForm): Promise<void> {
        const taskId = await clickgo.task.run('/clickgo/app/demo/');
        await clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
    },
    'end': async function(this: types.IVForm): Promise<void> {
        if (await clickgo.form.confirm(`Are you sure to end Task ${this.tid}?`)) {
            clickgo.task.end(parseInt(this.tid));
        }
    },
    'runTask': async function(this: types.IVForm): Promise<void> {
        if (clickgo.task.systemTaskInfo.taskId > 0) {
            await clickgo.form.dialog('The Task APP is already running.');
            return;
        }
        // --- 执行 ---
        const taskId = await clickgo.task.run('/clickgo/app/task/');
        await clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
    }
};

export const mounted = function(this: types.IVForm): void {
    const list = clickgo.task.getList();
    for (const tid in list) {
        this.tlist.push({
            'label': 'Task ' + tid,
            'value': parseInt(tid)
        });
    }
    clickgo.core.setSystemEventListener('taskStarted', (taskId: number) => {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    });
    clickgo.core.setSystemEventListener('taskEnded', (taskId: number) => {
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
