import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public tlist: any[] = [];

    public list: any[] = [];

    public tid: string[] = [];

    public pushConsole(name: string, text: string): void {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }

    public async run(): Promise<void> {
        const taskId = await clickgo.task.run(this, '/clickgo/app/demo.cga');
        await clickgo.form.dialog(this, `Successfully run, task id is: ${taskId}.`);
    }

    public async end(): Promise<void> {
        if (await clickgo.form.confirm(this, `Are you sure to end Task ${this.tid[0]}?`)) {
            clickgo.task.end(this.tid[0]);
        }
    }

    public async runTask(): Promise<void> {
        if (clickgo.task.systemTaskInfo.taskId) {
            await clickgo.form.dialog(this, 'The Task APP is already running.');
            return;
        }
        // --- 执行 ---
        const taskId = await clickgo.task.run(this, '/clickgo/app/task.cga');
        await clickgo.form.dialog(this, `Successfully run, task id is: ${taskId}.`);
    }

    public onTaskStarted(taskId: string): void {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    }

    public onTaskEnded(taskId: string): void {
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
