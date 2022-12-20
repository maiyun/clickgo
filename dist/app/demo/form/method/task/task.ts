import * as clickgo from 'clickgo';

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
        this.frameTimer = clickgo.task.onFrame(() => {
            ++this.frameCount;
        }, opt);
    }

    public frameEnd(): void {
        clickgo.task.offFrame(this.frameTimer);
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
        this.timer = clickgo.task.createTimer(() => {
            ++this.timerCount;
        }, 1, opt);
    }

    public timerEnd(): void {
        clickgo.task.removeTimer(this.timer);
        this.timerCount = 0;
        this.timer = 0;
    }

    public get(): void {
        const r = clickgo.task.get(parseInt(this.tid));
        clickgo.form.dialog(r ? JSON.stringify(r).replace(/(data:image\/).+?"/g, '$1..."') : 'null').catch((e) => { throw e; });
    }

    public getPermissions(): void {
        const r = clickgo.task.getPermissions(parseInt(this.tid));
        clickgo.form.dialog(JSON.stringify(r)).catch((e) => { throw e; });
    }

    public getList(): void {
        let msg = JSON.stringify(clickgo.task.getList());
        msg = msg.replace(/(data:image\/).+?"/g, '$1..."');
        clickgo.form.dialog(msg).catch((e) => { throw e; });
    }

    public async run(): Promise<void> {
        const tid = await clickgo.task.run('/clickgo/app/demo/');
        await clickgo.form.dialog('Task ID: ' + tid.toString());
    }

    public async checkPermission(): Promise<void> {
        const rtn = await clickgo.task.checkPermission('hash', true);
        await clickgo.form.dialog(rtn[0] ? 'Succeed' : 'Failed');
    }

    public async end(): Promise<void> {
        await clickgo.form.dialog('Result: ' + (clickgo.task.end(parseInt(this.tid)) ? 'true' : 'false'));
    }

    public async loadLocale(lang: string, path: string): Promise<void> {
        const r = await clickgo.task.loadLocale(lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    }

    public async setLocale(lang: string, path: string): Promise<void> {
        const r = await clickgo.task.setLocale(lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    }

    public clearLocale(): void {
        clickgo.task.clearLocale();
    }

    public loadLocaleData(lang: string, data: Record<string, any>): void {
        clickgo.task.loadLocaleData(lang, data);
    }

    public setLocaleLang(lang: string): void {
        clickgo.task.setLocaleLang(lang);
    }

    public clearLocaleLang(): void {
        clickgo.task.clearLocaleLang();
    }

    public changeLocaleLang(): void {
        clickgo.core.config.locale = this.select[0];
    }

    public sleep(): void {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        clickgo.task.sleep(() => {
            this.sleeping = false;
        }, 1000);
    }

    public systemTaskInfo(): void {
        clickgo.form.dialog(JSON.stringify(clickgo.task.systemTaskInfo)).catch((e) => { throw e; });
    }

    public onMounted(): void {
        this.tid = this.taskId.toString();
        this.select = [clickgo.core.config.locale];
    }

}
