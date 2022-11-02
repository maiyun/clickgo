import * as clickgo from '../../index';

const el = document.getElementById('tip')!;
el.innerHTML = 'Starting system app...';

class Boot extends clickgo.AbstractBoot {

    public async main(): Promise<void> {
        if (!window.location.href.includes('?single')) {
            // --- 启动 task app ---
            const sTaskId = await clickgo.task.run('/clickgo/app/task/', {
                // 'notify': false,
                'main': true
            });
            if (sTaskId <= 0) {
                el.innerHTML = `Star system app failed(${sTaskId.toString()}).`;
                return;
            }
            // --- sapp 启动成功 ---
            el.innerHTML = 'Starting main app...';
            // --- 最大化窗体 ---
            if (clickgo.getNative()) {
                clickgo.native.max();
            }
        }
        const taskId = await clickgo.task.run('/clickgo/app/demo/', {
            'notify': window.location.href.includes('?single') ? false : undefined,
            'main': window.location.href.includes('?single') ? true : undefined,
            'sync': window.location.href.includes('?single') ? true : undefined
        });
        if (taskId <= 0) {
            el.innerHTML = `Start main app failed(${taskId.toString()}).`;
            return;
        }
        const icon = clickgo.task.list[taskId].app.icon;
        if (icon) {
            clickgo.core.config['launcher.list'] = [
                {
                    'name': clickgo.task.list[taskId].config.name + '01',
                    'icon': icon,
                    'path': clickgo.task.list[taskId].path
                },
                {
                    'name': clickgo.task.list[taskId].config.name + '02',
                    'icon': icon,
                    'path': clickgo.task.list[taskId].path
                },
                {
                    'name': 'folder1',
                    'list': [
                        {
                            'name': clickgo.task.list[taskId].config.name + '11',
                            'icon': icon,
                            'path': clickgo.task.list[taskId].path
                        },
                        {
                            'name': clickgo.task.list[taskId].config.name + '12',
                            'icon': icon,
                            'path': clickgo.task.list[taskId].path
                        }
                    ]
                },
                {
                    'name': 'folder2',
                    'list': [
                        {
                            'name': clickgo.task.list[taskId].config.name + '21',
                            'icon': icon,
                            'path': clickgo.task.list[taskId].path
                        }
                    ]
                }
            ];
        }
        el.innerHTML = 'Running...';
        const body = document.getElementsByTagName('body')[0];
        if (clickgo.getPlatform() === 'win32' || window.location.href.includes('?single')) {
            body.style.background = 'transparent';
            document.getElementById('spic')!.style.display = 'none';
        }
        else {
            body.style.background = '#0063b1';
            document.getElementById('spic')!.style.background = '#0063b1';
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
clickgo.launcher(new Boot());
