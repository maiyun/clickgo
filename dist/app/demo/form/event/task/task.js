import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    tlist = [];
    list = [];
    tid = [];
    pushConsole(name, text) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }
    async run() {
        const taskId = await clickgo.task.run(this, '/clickgo/app/demo.cga');
        await clickgo.form.dialog(this, `Successfully run, task id is: ${taskId}.`);
    }
    async end() {
        if (await clickgo.form.confirm(this, `Are you sure to end Task ${this.tid[0]}?`)) {
            clickgo.task.end(this.tid[0]);
        }
    }
    async runTask() {
        if (clickgo.task.systemTaskInfo.taskId) {
            await clickgo.form.dialog(this, 'The Task APP is already running.');
            return;
        }
        // --- 执行 ---
        const taskId = await clickgo.task.run(this, '/clickgo/app/task.cga');
        await clickgo.form.dialog(this, `Successfully run, task id is: ${taskId}.`);
    }
    onTaskStarted(taskId) {
        this.tlist.push({
            'label': 'Task ' + taskId.toString(),
            'value': taskId
        });
        this.pushConsole('taskStarted', `taskId: ${taskId}`);
    }
    onTaskEnded(taskId) {
        for (let i = 0; i < this.tlist.length; ++i) {
            if (this.tlist[i].value !== taskId) {
                continue;
            }
            this.tlist.splice(i, 1);
            break;
        }
        this.pushConsole('taskEnded', `taskId: ${taskId}`);
    }
    onMounted() {
        const list = clickgo.task.getList();
        for (const tid in list) {
            this.tlist.push({
                'label': 'Task ' + tid,
                'value': parseInt(tid)
            });
        }
    }
}
