export const data = {
    'tlist': [],
    'list': [],
    'tid': 0
};

export const methods = {
    'pushConsole': function(this: IVForm, name: string, text: string): void {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    },
    'run': async function(this: IVForm): Promise<void> {
        const taskId = await clickgo.task.run('/clickgo/app/demo/');
        await this.cgDialog(`Successfully run, task id is: ${taskId}.`);
    },
    'end': async function(this: IVForm): Promise<void> {
        if (await this.cgConfirm(`Are you sure to end Task ${this.tid}?`)) {
            clickgo.task.end(parseInt(this.tid));
        }
    },
    'runTask': async function(this: IVForm): Promise<void> {
        if (clickgo.form.taskInfo.taskId > 0) {
            await this.cgDialog('The Task APP is already running.');
            return;
        }
        // --- 执行 ---
        const taskId = await clickgo.task.run('/clickgo/app/task/');
        await this.cgDialog(`Successfully run, task id is: ${taskId}.`);
    }
};

export const mounted = function(this: IVForm): void {
    const list = clickgo.task.getList();
    for (const tid in list) {
        this.tlist.push({
            'label': 'Task ' + tid,
            'value': parseInt(tid)
        });
    }
    this.cgSetSystemEventListener('taskStarted', (taskId: number) => {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    });
    this.cgSetSystemEventListener('taskEnded', (taskId: number) => {
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
