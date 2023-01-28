import * as clickgo from '../../index';

const state = document.getElementById('state')!;
const iconwrap = document.getElementById('iconwrap')!;
const body = document.getElementsByTagName('body')[0];

let app: any = null;

class Boot extends clickgo.AbstractBoot {

    public main(): void {
        state.insertAdjacentHTML('afterbegin', '<div>Initialized.</div>');
        // --- 下载按钮 ---
        document.getElementById('download')?.addEventListener('click', () => {
            (async () => {
                document.getElementById('download')?.remove();
                state.insertAdjacentHTML('afterbegin', '<div>Starting download ...</div>');
                app = await clickgo.core.fetchApp('./app.cga', {
                    'progress': (l, t) => {
                        state.insertAdjacentHTML('afterbegin', '<div>Progress ' + l.toString() + ' / ' + t.toString() + ' (' + Math.round(l / t * 100).toString() + '%)</div>');
                    }
                });
                if (!app) {
                    state.insertAdjacentHTML('afterbegin', '<div>Network error.</div>');
                    return;
                }
                iconwrap.style.display = 'flex';
                document.getElementById('fl')!.style.display = 'block';
                document.getElementById('icon')!.style.backgroundImage = 'url(' + app.icon + ')';
                // eslint-disable-next-line deprecation/deprecation
                document.getElementById('mask')!.style.webkitMaskImage = 'url(' + app.icon + ')';
                document.getElementById('mask')!.style.maskImage = 'url(' + app.icon + ')';
            })() as any;
        });
        // --- 点击选中 ---
        iconwrap.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            iconwrap.classList.add('selected');
        });
        iconwrap.addEventListener('dblclick', () => {
            (async function() {
                body.style.cursor = 'progress';
                iconwrap.classList.remove('selected');
                await clickgo.task.run(app, {
                    initProgress: (s) => {
                        state.insertAdjacentHTML('afterbegin', '<div> ' + s + '</div>');
                    }
                });
                body.style.cursor = 'default';
            })() as any;
        });
        // --- 取消选中 ---
        document.addEventListener('mousedown', () => {
            iconwrap.classList.remove('selected');
        });
    }

    public onError(taskId: number, formId: number, error: Error): void {
        state.insertAdjacentHTML('afterbegin', '<div>Error, Task ID: ' + taskId.toString() + ', Form ID: ' + formId.toString() + '<br>' + (error.stack ? error.stack.replace(/\n/g, '<br>') : '') + '</div>');
        clickgo.task.end(taskId);
    }

    public onTaskEnded(taskId: number): void {
        state.insertAdjacentHTML('afterbegin', '<div>Task ' + taskId.toString() + ' ended.</div>');
    }

}

clickgo.launcher(new Boot());
