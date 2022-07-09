import * as clickgo from '../../index';

(async function() {
    const body = document.getElementsByTagName('body')[0];
    // --- 其他 ---
    const el = document.getElementById('tip');
    if (!el) {
        return;
    }
    el.innerHTML = 'Starting system app...';
    await clickgo.init();
    // --- 监听错误 ---
    clickgo.core.globalEvents.errorHandler = function(taskId, formId, error, info) {
        if (!el) {
            return;
        }
        console.log(info, error);
        const err = document.getElementById('err')!;
        err.style.display = 'block';
        err.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    };
    // --- 监听任务关闭 ---
    clickgo.core.globalEvents.taskEndedHandler = function(taskId: number) {
        el.innerHTML = 'Task(' + taskId.toString() + ') ended.';
    };
    // --- 启动 task app ---
    const sTaskId = await clickgo.task.run('/clickgo/app/task/', {
        'progress': false
    });
    if (sTaskId <= 0) {
        el.innerHTML = `Start failed(${sTaskId.toString()}).`;
        return;
    }
    // --- sapp 启动成功 ---
    el.innerHTML = 'Starting app...';
    const taskId = await clickgo.task.run('/clickgo/app/demo/');
    if (taskId <= 0) {
        el.innerHTML = `Start failed(${taskId.toString()}).`;
        return;
    }
    el.innerHTML = 'Running...';
    if (clickgo.getNative()) {
        document.getElementById('spic')!.style.display = 'none';
    }
    else {
        body.style.background = '#0063b1';
        document.getElementById('spic')!.style.background = '#0063b1';
    }
})().catch((e) => {
    console.log(e);
});
