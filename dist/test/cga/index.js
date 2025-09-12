import * as clickgo from 'clickgo';
const state = document.getElementById('state');
const iconwrap = document.getElementById('iconwrap');
const body = document.getElementsByTagName('body')[0];
let app = null;
class Boot extends clickgo.AbstractBoot {
    main() {
        state.insertAdjacentHTML('afterbegin', '<div>Initialized.</div>');
        // --- 下载按钮 ---
        document.getElementById('download')?.addEventListener('click', () => {
            (async () => {
                document.getElementById('download')?.remove();
                state.insertAdjacentHTML('afterbegin', '<div>Starting download ...</div>');
                app = await clickgo.core.fetchApp(this._sysId, './app.cga', {
                    'progress': (l, t) => {
                        state.insertAdjacentHTML('afterbegin', '<div>Progress ' + l.toString() + ' / ' + t.toString() + ' (' + Math.round(l / t * 100).toString() + '%)</div>');
                    },
                });
                if (!app) {
                    state.insertAdjacentHTML('afterbegin', '<div>Network error.</div>');
                    return;
                }
                iconwrap.style.display = 'flex';
                document.getElementById('fl').style.display = 'block';
                document.getElementById('icon').style.backgroundImage = 'url(' + app.icon + ')';
                // eslint-disable-next-line @typescript-eslint/no-deprecated
                document.getElementById('mask').style.webkitMaskImage = 'url(' + app.icon + ')';
                document.getElementById('mask').style.maskImage = 'url(' + app.icon + ')';
            })();
        });
        // --- 点击选中 ---
        iconwrap.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            iconwrap.classList.add('selected');
        });
        iconwrap.addEventListener('dblclick', () => {
            (async () => {
                body.style.cursor = 'progress';
                iconwrap.classList.remove('selected');
                await clickgo.task.run(this._sysId, app, {
                    initProgress: (loaded, total, type, msg) => {
                        state.insertAdjacentHTML('afterbegin', '<div> [' + type + '] ' + msg + '</div>');
                    }
                });
                body.style.cursor = 'default';
            })();
        });
        // --- 取消选中 ---
        document.addEventListener('mousedown', () => {
            iconwrap.classList.remove('selected');
        });
    }
    onError(taskId, formId, error) {
        state.insertAdjacentHTML('afterbegin', '<div>Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '') + '</div>');
        clickgo.task.end(taskId).catch(() => { });
    }
    onTaskEnded(taskId) {
        state.insertAdjacentHTML('afterbegin', '<div>Task ' + taskId.toString() + ' ended.</div>');
    }
}
await clickgo.launcher(new Boot());
