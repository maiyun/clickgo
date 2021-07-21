clickgo.ready(async function() {
    let el = document.getElementById('tip');
    if (!el) {
        return;
    }
    el.innerHTML = 'Starting system app...';
    // --- 监听错误 ---
    clickgo.core.globalEvents.errorHandler = function(taskId, formId, error, info) {
        if (!el) {
            return;
        }
        console.log(info, error);
        let err = document.getElementById('err') as HTMLElement;
        err.style.display = 'block';
        err.innerHTML = 'Error, Task ID: ' + taskId + ', Form ID: ' + formId + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    };
    // --- 监听任务关闭 ---
    clickgo.core.globalEvents.taskEndedHandler = function(taskId: number) {
        el!.innerHTML = 'Task(' + taskId + ') ended.';
    };
    // --- 启动 task app ---
    let sTaskId = await clickgo.task.run('/clickgo/app/task/');
    if (sTaskId <= 0) {
        el.innerHTML = `Start failed(${sTaskId.toString()}).`;
        return;
    }
    // --- sapp 启动成功 ---
    el.innerHTML = 'Starting app...';
    let taskId = await clickgo.task.run('/clickgo/app/demo/');
    if (taskId <= 0) {
        el.innerHTML = `Start failed(${taskId.toString()}).`;
        return;
    }
    el.innerHTML = 'Running...';
    document.getElementsByTagName('body')[0].classList.add('running');
});
