import * as clickgo from 'clickgo';
const el = document.getElementById('tip');
el.innerHTML = 'Starting system app...';
class Boot extends clickgo.AbstractBoot {
    async main() {
        if (!window.location.href.includes('?single')) {
            // --- 启动 task app ---
            const sTaskId = await clickgo.task.run(this._sysId, '/clickgo/app/task.cga', {
                'permissions': ['root'],
            });
            if (typeof sTaskId !== 'string') {
                el.innerHTML = `Star system app failed(${sTaskId}).`;
                return;
            }
            // --- sapp 启动成功 ---
            el.innerHTML = 'Starting main app...';
        }
        const taskId = await clickgo.task.run(this._sysId, '/clickgo/app/demo.cga', {
            'notify': window.location.href.includes('?single') ? false : undefined,
            'permissions': ['native.form'],
            'data': {
                'param': 'abc',
            },
            initProgress: (loaded, total, type, msg) => {
                console.log('initProgress', loaded, total, type, msg);
            },
            perProgress: (per) => {
                console.log('perProgress', per);
            },
        });
        if (typeof taskId === 'number') {
            el.innerHTML = `Start main app failed(${taskId.toString()}).`;
            return;
        }
        const taskList = await clickgo.task.getOriginList(this._sysId);
        const icon = await clickgo.fs.getContent(this._sysId, '/clickgo/icon.png');
        if (icon instanceof Blob) {
            const du = await clickgo.tool.blob2DataUrl(icon);
            clickgo.core.config['launcher.list'] = [
                {
                    'name': taskList[taskId].app.config.name + '01',
                    'icon': du,
                    'path': taskList[taskId].path
                },
                {
                    'name': taskList[taskId].app.config.name + '02',
                    'icon': du,
                    'path': taskList[taskId].path
                },
                {
                    'id': '1',
                    'name': 'folder1',
                    'list': [
                        {
                            'name': taskList[taskId].app.config.name + '11',
                            'icon': du,
                            'path': taskList[taskId].path
                        },
                        {
                            'name': taskList[taskId].app.config.name + '12',
                            'icon': du,
                            'path': taskList[taskId].path
                        }
                    ]
                },
                {
                    'id': '2',
                    'name': 'folder2',
                    'list': [
                        {
                            'name': taskList[taskId].app.config.name + '21',
                            'icon': du,
                            'path': taskList[taskId].path
                        }
                    ]
                },
            ];
        }
        //*/
        el.innerHTML = 'Running...';
        const body = document.getElementsByTagName('body')[0];
        if (clickgo.isNative() && !clickgo.hasFrame()) {
            // --- 是否将网页背景设置为透明（仅在 native 且没 frame 时才设置） ---
            body.style.background = 'transparent';
            document.getElementById('spic').style.display = 'none';
        }
        else {
            body.classList.add('loaded');
            document.getElementById('spic').style.background = 'transparent';
        }
    }
    onError(taskId, formId, error, info) {
        console.log('boot.onError', info, error);
        const err = document.getElementById('err');
        err.style.display = 'block';
        err.innerHTML = 'Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '');
        // clickgo.task.end(taskId);
    }
    onTaskEnded(taskId) {
        el.innerHTML = 'Task(' + taskId.toString() + ') ended.';
    }
}
await clickgo.launcher(new Boot({
    'debug': true,
}));
