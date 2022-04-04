clickgo.ready(async function() {
    // --- 注册系统默认的库 ---
    // clickgo.core.regModule('monaco', );

    let body = document.getElementsByTagName('body')[0];
    // --- 设置背景 ---
    if (!clickgo.native) {
        body.style.background = '#222';
    }

    // --- 其他 ---
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
    let sTaskId = await clickgo.task.run('/clickgo/app/task/', {
        'progress': false
    });
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
    if (clickgo.native) {
        document.getElementById('spic')!.style.display = 'none';
    }
    else {
        body.style.background = '#0063b1';
        document.getElementById('spic')!.style.background = '#0063b1';
    }
});
