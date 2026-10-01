import * as clickgo from 'clickgo';
import tThread from './thread';
export default class extends clickgo.form.AbstractForm {
    /** --- 示例托盘 ID，回调按 ID 过滤，避免多个 Form 混淆 --- */
    trayId = '';
    trayLog = '';
    trayPending = false;
    access = { 'trayClosed': false };
    /**
     * --- 注册托盘，图标在 Demo 包外但由注册任务解析 ---
     * @returns 无返回值
     */
    async createTray() {
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
    minimizeTrayDemo() {
        clickgo.form.min(this.formId);
    }
    /**
     * --- 更新提示和菜单，任务栏通过公共事件同步 ---
     * @returns 无返回值
     */
    async updateTray() {
        await clickgo.task.updateTray(this, this.trayId, { 'tip': 'Updated tray demo' });
        this.trayLog = 'Updated ' + this.trayId;
    }
    /**
     * --- 移除示例托盘 ---
     * @returns 无返回值
     */
    removeTray() {
        clickgo.task.removeTray(this, this.trayId);
        this.trayId = '';
        this.trayLog = 'Removed';
    }
    /**
     * --- 点击任务栏图标后恢复这个 Form ---
     * @param id 托盘 ID
     * @returns 无返回值
     */
    async onTrayClick(id) {
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
    async onTrayMenuClick(id, menuId) {
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
    onBeforeUnmount() {
        this.access.trayClosed = true;
        this.removeTray();
    }
    tid = '0';
    frameTimer = 0;
    frameCount = 0;
    timer = 0;
    timerCount = 0;
    select = [];
    sleeping = false;
    get globalLocale() {
        return clickgo.core.config.locale;
    }
    langSelect = [
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
    frameStart(v) {
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
    frameEnd() {
        clickgo.task.offFrame(this, this.frameTimer);
        this.frameCount = 0;
        this.frameTimer = 0;
    }
    timerStart(v) {
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
    timerEnd() {
        clickgo.task.removeTimer(this, this.timer);
        this.timerCount = 0;
        this.timer = 0;
    }
    get() {
        const r = clickgo.task.get(this);
        clickgo.form.dialog(this, r ? JSON.stringify(r).replace(/(data:image\/).+?"/g, '$1..."') : 'null').catch(() => { });
    }
    getPermissions() {
        const r = clickgo.task.getPermissions(this);
        clickgo.form.dialog(this, JSON.stringify(r)).catch(() => { });
    }
    getList() {
        let msg = JSON.stringify(clickgo.task.getList());
        msg = msg.replace(/(data:image\/).+?"/g, '$1..."');
        clickgo.form.dialog(this, msg).catch(() => { });
    }
    async run() {
        const tid = await clickgo.task.run(this, '/clickgo/app/demo/');
        await clickgo.form.dialog(this, 'Task ID: ' + tid.toString());
    }
    async checkPermission(val) {
        const rtn = await clickgo.task.checkPermission(this, val, true);
        await clickgo.form.dialog(this, rtn[0] ? 'Succeed' : 'Failed');
    }
    async end() {
        await clickgo.form.dialog(this, 'Result: ' + (await clickgo.task.end(this) ? 'true' : 'false'));
    }
    async loadLocale(lang, path) {
        const r = await clickgo.task.loadLocale(this, lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
        await clickgo.form.dialog(this, 'Result: ' + (r ? 'true' : 'false'));
    }
    async setLocale(lang, path) {
        const r = await clickgo.task.setLocale(this, lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
        await clickgo.form.dialog(this, 'Result: ' + (r ? 'true' : 'false'));
    }
    clearLocale() {
        clickgo.task.clearLocale(this);
    }
    loadLocaleData(lang, data) {
        clickgo.task.loadLocaleData(this, lang, data);
    }
    setLocaleLang(lang) {
        clickgo.task.setLocaleLang(this, lang);
    }
    clearLocaleLang() {
        clickgo.task.clearLocaleLang(this);
    }
    changeLocaleLang() {
        clickgo.core.config.locale = this.select[0];
    }
    sleep() {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        clickgo.task.sleep(this, () => {
            this.sleeping = false;
        }, 1_000);
    }
    systemTaskInfo() {
        clickgo.form.dialog(this, JSON.stringify(clickgo.task.systemTaskInfo)).catch((e) => { throw e; });
    }
    threadRunning = false;
    threadList = [];
    pushThreadConsole(name, text) {
        const date = new Date();
        this.threadList.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }
    runThread() {
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
        }).catch(() => { });
    }
    onMounted() {
        this.tid = this.taskId.toString();
        this.select = [clickgo.core.config.locale];
    }
}
