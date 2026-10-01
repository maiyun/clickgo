import * as clickgo from 'clickgo';
import tThread from './thread';

export default class extends clickgo.form.AbstractForm {

    /** --- 示例托盘 ID，回调按 ID 过滤，避免多个 Form 混淆 --- */
    public trayId = '';

    public trayLog = '';

    public trayPending = false;

    public access = { 'trayClosed': false };

    /**
     * --- 注册托盘，图标在 Demo 包外但由注册任务解析 ---
     * @returns 无返回值
     */
    public async createTray(): Promise<void> {
        if (this.trayPending || this.trayId) {
            return;
        }
        this.trayPending = true;
        try {
            const id = await clickgo.task.createTray(this, {
                'icon': '/clickgo/icon.png',
                'tip': 'ClickGo tray demo',
                'menu': [
                    { 'id': 'show', 'label': 'Show demo' },
                    { 'id': 'disabled', 'label': 'Disabled command', 'disabled': true },
                    { 'id': 'split', 'label': '', 'separator': true },
                    { 'id': 'remove', 'label': 'Remove tray' }
                ]
            });
            if (!id) {
                return;
            }
            if (this.access.trayClosed) {
                clickgo.task.removeTray(this, id);
                return;
            }
            this.trayId = id;
            this.trayLog = 'Created ' + id;
        }
        finally {
            this.trayPending = false;
        }
    }

    /**
     * --- 最小化示例窗口，点击托盘可恢复 ---
     * @returns 无返回值
     */
    public minimizeTrayDemo(): void {
        clickgo.form.min(this.formId);
    }

    /**
     * --- 更新提示和菜单，任务栏通过公共事件同步 ---
     * @returns 无返回值
     */
    public async updateTray(): Promise<void> {
        await clickgo.task.updateTray(this, this.trayId, { 'tip': 'Updated tray demo' });
        this.trayLog = 'Updated ' + this.trayId;
    }

    /**
     * --- 移除示例托盘 ---
     * @returns 无返回值
     */
    public removeTray(): void {
        clickgo.task.removeTray(this, this.trayId);
        this.trayId = '';
        this.trayLog = 'Removed';
    }

    /**
     * --- 点击任务栏图标后恢复这个 Form ---
     * @param id 托盘 ID
     * @returns 无返回值
     */
    public async onTrayClick(id: string): Promise<void> {
        if (id !== this.trayId) {
            return;
        }
        this.trayLog = 'Click ' + id;
        await clickgo.form.changeFocus(this.formId);
    }

    /**
     * --- 菜单命令来自框架，应用不依赖具体 task app ---
     * @param id 托盘 ID
     * @param menuId 菜单命令
     * @returns 无返回值
     */
    public async onTrayMenuClick(id: string, menuId: string): Promise<void> {
        if (id !== this.trayId) {
            return;
        }
        if (menuId === 'remove') {
            this.removeTray();
            return;
        }
        this.trayLog = 'Menu ' + menuId;
        await clickgo.form.changeFocus(this.formId);
    }

    /**
     * --- Form 关闭时释放本示例的托盘，包括尚未完成的注册 ---
     * @returns 无返回值
     */
    public onBeforeUnmount(): void {
        this.access.trayClosed = true;
        this.removeTray();
    }

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
