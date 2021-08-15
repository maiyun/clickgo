export let data = {
    'tlist': [],
    'list': [],
    'tid': 0
};

export let methods = {
    'pushConsole': function(this: IVueForm, name: string, text: string): void {
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'name': name,
            'text': text
        });
    },
    'run': async function(this: IVueForm): Promise<void> {
        let taskId = await clickgo.task.run('/clickgo/app/demo/');
        await this.cgDialog(`Successfully run, task id is: ${taskId}.`);
    },
    'end': async function(this: IVueForm): Promise<void> {
        if (await this.cgConfirm(`Are you sure to end Task ${this.tid}?`)) {
            clickgo.task.end(parseInt(this.tid));
        }
    },
    'runTask': async function(this: IVueForm): Promise<void> {
        if (clickgo.form.getTask().taskId > 0) {
            await this.cgDialog('The Task APP is already running.');
            return;
        }
        // --- 执行 ---
        let taskId = await clickgo.task.run('/clickgo/app/task/');
        await this.cgDialog(`Successfully run, task id is: ${taskId}.`);
    }
};

export let mounted = function(this: IVueForm): void {
    let list = clickgo.task.getList();
    for (let tid in list) {
        this.tlist.push({
            'label': 'Task ' + tid,
            'value': parseInt(tid)
        });
    }
    this.cgSetSystemEventListener('taskStarted', (taskId: number) => {
        this.tlist.push({
            'label': 'Task ' + taskId,
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
