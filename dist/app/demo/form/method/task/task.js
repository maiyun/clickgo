import * as clickgo from 'clickgo';
import tThread from './thread';
export default class extends clickgo.form.AbstractForm {
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
