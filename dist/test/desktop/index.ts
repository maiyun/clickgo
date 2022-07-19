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
    if (!window.location.href.includes('?single')) {
        // --- 启动 task app ---
        const sTaskId = await clickgo.task.run('/clickgo/app/task/', {
            'notify': false,
            'main': true
        });
        if (sTaskId <= 0) {
            el.innerHTML = `Start failed(${sTaskId.toString()}).`;
            return;
        }
        // --- sapp 启动成功 ---
        el.innerHTML = 'Starting app...';
        // --- 最大化窗体 ---
        if (clickgo.getNative()) {
            clickgo.native.send('cg-set-state', JSON.stringify({
                'token': clickgo.native.getToken(),
                'state': 'max'
            }));
        }
    }
    const taskId = await clickgo.task.run('/clickgo/app/demo/', {
        'notify': window.location.href.includes('?single') ? false : undefined,
        'main': window.location.href.includes('?single') ? true : undefined,
        'sync': window.location.href.includes('?single') ? true : undefined
    });
    if (taskId <= 0) {
        el.innerHTML = `Start failed(${taskId.toString()}).`;
        return;
    }
    el.innerHTML = 'Running...';
    if (window.location.href.includes('?single')) {
        clickgo.native.send('cg-set-size', JSON.stringify({
            'token': clickgo.native.getToken(),
            'width': 400,
            'height': 550
        }));
    }
    if (clickgo.getPlatform() === 'win32' || window.location.href.includes('?single')) {
        body.style.background = 'transparent';
        document.getElementById('spic')!.style.display = 'none';
    }
    else {
        body.style.background = '#0063b1';
        document.getElementById('spic')!.style.background = '#0063b1';
    }
})().catch((e) => {
    console.log(e);
});
