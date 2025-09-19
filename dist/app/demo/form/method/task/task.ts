import * as clickgo from 'clickgo';
import tThread from './thread';

export default class extends clickgo.form.AbstractForm {

    public tid = '0';

    public frameTimer = 0;

    public frameCount = 0;

    public timer = 0;

    public timerCount = 0;

    public select: string[] = [];

    public sleeping = false;

    public get globalLocale(): string {
        return clickgo.core.config.locale;
    }

    public langSelect = [
        {
            'label': 'l:File size',
        },
        {
            'label': 'l:File name',
        },
        {
            'label': 'File size',
        },
        {
            'label': 'l:File size',
            'value': 'k2',
        }
    ];

    public frameStart(v: number): void {
        let opt = {};
        switch (v) {
            case 0: {
                opt = {
                    'count': 1
                };
                break;
            }
            case 1: {
                opt = {
                    'count': 100
                };
                break;
            }
            case 2: {
                opt = {
                    'formId': this.formId
                };
                break;
            }
        }
        this.frameTimer = clickgo.task.onFrame(this, () => {
            ++this.frameCount;
        }, opt);
    }

    public frameEnd(): void {
        clickgo.task.offFrame(this, this.frameTimer);
        this.frameCount = 0;
        this.frameTimer = 0;
    }

    public timerStart(v: number): void {
        let opt = {};
        switch (v) {
            case 0: {
                opt = {
                    'count': 1
                };
                break;
            }
            case 1: {
                opt = {
                    'count': 100
                };
                break;
            }
            case 3: {
                opt = {
                    'formId': this.formId
                };
                break;
            }
        }
        this.timer = clickgo.task.createTimer(this, () => {
            ++this.timerCount;
        }, 1, opt);
    }

    public timerEnd(): void {
        clickgo.task.removeTimer(this, this.timer);
        this.timerCount = 0;
        this.timer = 0;
    }

    public get(): void {
        const r = clickgo.task.get(this);
        clickgo.form.dialog(this, r ? JSON.stringify(r).replace(/(data:image\/).+?"/g, '$1..."') : 'null').catch(() => {});
    }

    public getPermissions(): void {
        const r = clickgo.task.getPermissions(this);
        clickgo.form.dialog(this, JSON.stringify(r)).catch(() => {});
    }

    public getList(): void {
        let msg = JSON.stringify(clickgo.task.getList());
        msg = msg.replace(/(data:image\/).+?"/g, '$1..."');
        clickgo.form.dialog(this, msg).catch(() => {});
    }

    public async run(): Promise<void> {
        const tid = await clickgo.task.run(this, '/clickgo/app/demo/');
        await clickgo.form.dialog(this, 'Task ID: ' + tid.toString());
    }

    public async checkPermission(val: string): Promise<void> {
        const rtn = await clickgo.task.checkPermission(this, val, true);
        await clickgo.form.dialog(this, rtn[0] ? 'Succeed' : 'Failed');
    }

    public async end(): Promise<void> {
        await clickgo.form.dialog(this, 'Result: ' + (await clickgo.task.end(this) ? 'true' : 'false'));
    }

    public async loadLocale(lang: string, path: string): Promise<void> {
        const r = await clickgo.task.loadLocale(this, lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
        await clickgo.form.dialog(this, 'Result: ' + (r ? 'true' : 'false'));
    }

    public async setLocale(lang: string, path: string): Promise<void> {
        const r = await clickgo.task.setLocale(this, lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
        await clickgo.form.dialog(this, 'Result: ' + (r ? 'true' : 'false'));
    }

    public clearLocale(): void {
        clickgo.task.clearLocale(this);
    }

    public loadLocaleData(lang: string, data: Record<string, any>): void {
        clickgo.task.loadLocaleData(this, lang, data);
    }

    public setLocaleLang(lang: string): void {
        clickgo.task.setLocaleLang(this, lang);
    }

    public clearLocaleLang(): void {
        clickgo.task.clearLocaleLang(this);
    }

    public changeLocaleLang(): void {
        clickgo.core.config.locale = this.select[0];
    }

    public sleep(): void {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        clickgo.task.sleep(this, () => {
            this.sleeping = false;
        }, 1_000);
    }

    public systemTaskInfo(): void {
        clickgo.form.dialog(this, JSON.stringify(clickgo.task.systemTaskInfo)).catch((e) => { throw e; });
    }

    public threadRunning = false;

    public threadList: Array<{
        'time': string;
        'name': string;
        'text': string;
    }> = [];

    public pushThreadConsole(name: string, text: string): void {
        const date = new Date();
        this.threadList.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }

    public runThread(): void {
        this.threadRunning = true;
        const thread = clickgo.task.runThread(this, tThread, {
            'sdata': '123',
        });
        thread.on('message', (e) => {
            this.pushThreadConsole('thread', JSON.stringify(e.data));
        });
        const msg = {
            'mcustom': 'test',
        };
        this.pushThreadConsole('main', JSON.stringify(msg));
        thread.send(msg);
        clickgo.tool.sleep(3_000).then(async () => {
            await thread.end();
            this.threadRunning = false;
        }).catch(() => {});
    }

    public onMounted(): void {
        this.tid = this.taskId.toString();
        this.select = [clickgo.core.config.locale];
    }

}
