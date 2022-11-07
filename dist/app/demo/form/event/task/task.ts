import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public tlist: any[] = [];

    public list: any[] = [];

    public tid = 0;

    public pushConsole(name: string, text: string): void {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }

    public async run(): Promise<void> {
        const taskId = await clickgo.task.run('/clickgo/app/demo/');
        await clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
    }

    public async end(): Promise<void> {
        if (await clickgo.form.confirm(`Are you sure to end Task ${this.tid}?`)) {
            clickgo.task.end(this.tid);
        }
    }

    public async runTask(): Promise<void> {
        if (clickgo.task.systemTaskInfo.taskId > 0) {
            await clickgo.form.dialog('The Task APP is already running.');
            return;
        }
        // --- 执行 ---
        const taskId = await clickgo.task.run('/clickgo/app/task/');
        await clickgo.form.dialog(`Successfully run, task id is: ${taskId}.`);
    }

    public onTaskStarted(taskId: number): void {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    }

    public onTaskEnded(taskId: number): void {
        for (let i = 0; i < this.tlist.length; ++i) {
            if (this.tlist[i].value !== taskId) {
                continue;
            }
            this.tlist.splice(i, 1);
            break;
        }
        this.pushConsole('taskEnded', `taskId: ${taskId}`);
    }

    public onMounted(): void {
        const list = clickgo.task.getList();
        for (const tid in list) {
            this.tlist.push({
                'label': 'Task ' + tid,
                'value': parseInt(tid)
            });
        }
    }

}
