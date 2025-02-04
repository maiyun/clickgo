import * as clickgo from '../../index';

const el = document.getElementById('tip')!;
el.innerHTML = 'Starting system app...';

class Boot extends clickgo.AbstractBoot {

    public async main(): Promise<void> {
        if (!window.location.href.includes('?single')) {
            // --- 启动 task app ---
            const sTaskId = await clickgo.task.run('/clickgo/app/task/');
            if (sTaskId <= 0) {
                el.innerHTML = `Star system app failed(${sTaskId.toString()}).`;
                return;
            }
            // --- sapp 启动成功 ---
            el.innerHTML = 'Starting main app...';
        }
        const taskId = await clickgo.task.run('/clickgo/app/demo/', {
            'notify': window.location.href.includes('?single') ? false : undefined,
            'permissions': ['native.form'],
            'data': {
                'param': 'abc'
            }
        });
        if (taskId <= 0) {
            el.innerHTML = `Start main app failed(${taskId.toString()}).`;
            return;
        }
        const icon = await clickgo.fs.getContent('/clickgo/icon.png');
        if (icon instanceof Blob) {
            const du = await clickgo.tool.blob2DataUrl(icon);
            clickgo.core.config['launcher.list'] = [
                {
                    'name': clickgo.task.list[taskId].app.config.name + '01',
                    'icon': du,
                    'path': clickgo.task.list[taskId].path
                },
                {
                    'name': clickgo.task.list[taskId].app.config.name + '02',
                    'icon': du,
                    'path': clickgo.task.list[taskId].path
                },
                {
                    'id': '1',
                    'name': 'folder1',
                    'list': [
                        {
                            'name': clickgo.task.list[taskId].app.config.name + '11',
                            'icon': du,
                            'path': clickgo.task.list[taskId].path
                        },
                        {
                            'name': clickgo.task.list[taskId].app.config.name + '12',
                            'icon': du,
                            'path': clickgo.task.list[taskId].path
                        }
                    ]
                },
                {
                    'id': '2',
                    'name': 'folder2',
                    'list': [
                        {
                            'name': clickgo.task.list[taskId].app.config.name + '21',
                            'icon': du,
                            'path': clickgo.task.list[taskId].path
                        }
                    ]
                }
            ];
        }
        el.innerHTML = 'Running...';
        const body = document.getElementsByTagName('body')[0];
        if (clickgo.isNative() && clickgo.isImmersion()) {
            // --- 是否将网页背景设置为透明（仅在 native 且沉浸模式才设置） ---
            body.style.background = 'transparent';
            document.getElementById('spic')!.style.display = 'none';
        }
        else {
            body.classList.add('loaded');
            document.getElementById('spic')!.style.background = 'transparent';
        }
    }

    public onError(taskId: number, formId: number, error: Error, info: string): void {
        console.log('boot.onError', info, error);
        const err = document.getElementById('err')!;
        err.style.display = 'block';
        err.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        clickgo.task.end(taskId);
    }

    public onTaskEnded(taskId: number): void {
        el.innerHTML = 'Task(' + taskId.toString() + ') ended.';
    }

}
clickgo.launcher(new Boot({
    'debug': true
}));
