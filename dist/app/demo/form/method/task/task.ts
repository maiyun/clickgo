import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
    'tid': '0',
    'frameTimer': 0,
    'frameCount': 0,
    'timer': 0,
    'timerCount': 0,
    'select': '',
    'sleeping': false
};

export const computed = {
    globalLocale: function(): string {
        return clickgo.core.config.locale;
    }
};

export const methods = {
    frameStart: function(this: types.IVForm, v: number): void {
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
                    'scope': 'task'
                };
                break;
            }
        }
        this.frameTimer = clickgo.task.onFrame(() => {
            ++this.frameCount;
        }, opt);
    },
    frameEnd: function(this: types.IVForm): void {
        clickgo.task.offFrame(this.frameTimer);
        this.frameCount = 0;
        this.frameTimer = 0;
    },
    timerStart: function(this: types.IVForm, v: number): void {
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
                    'scope': 'task'
                };
                break;
            }
        }
        this.timer = clickgo.task.createTimer(() => {
            ++this.timerCount;
        }, 1, opt);
    },
    timerEnd: function(this: types.IVForm): void {
        clickgo.task.removeTimer(this.timer);
        this.timerCount = 0;
        this.timer = 0;
    },
    get: function(this: types.IVForm): void {
        const r = clickgo.task.get(this.tid);
        clickgo.form.dialog(r ? JSON.stringify(r) : 'null').catch((e) => { throw e; });
    },
    getList: function(this: types.IVForm): void {
        clickgo.form.dialog(JSON.stringify(clickgo.task.getList())).catch((e) => { throw e; });
    },
    run: async function(this: types.IVForm): Promise<void> {
        const tid = await clickgo.task.run('/clickgo/app/demo/');
        await clickgo.form.dialog('Task ID: ' + tid.toString());
    },
    end: async function(this: types.IVForm): Promise<void> {
        await clickgo.form.dialog('Result: ' + (clickgo.task.end(this.tid) ? 'true' : 'false'));
    },
    loadLocale: async function(lang: string, path: string): Promise<void> {
        const r = await clickgo.task.loadLocale(lang, path);
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    },
    setLocale: async function(lang: string, path: string): Promise<void> {
        const r = await clickgo.task.setLocale(lang, path);
        await clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
    },
    clearLocale: function(): void {
        clickgo.task.clearLocale();
    },
    loadLocaleData: function(lang: string, data: Record<string, any>): void {
        clickgo.task.loadLocaleData(lang, data);
    },
    setLocaleLang: function(lang: string): void {
        clickgo.task.setLocaleLang(lang);
    },
    clearLocaleLang: function(): void {
        clickgo.task.clearLocaleLang();
    },
    changeLocaleLang: function(this: types.IVForm): void {
        clickgo.core.config.locale = this.select;
    },
    sleep: function(this: types.IVForm): void {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        clickgo.task.sleep(() => {
            this.sleeping = false;
        }, 1000);
    },
    systemTaskInfo: function(this: types.IVForm): void {
        clickgo.form.dialog(JSON.stringify(clickgo.task.systemTaskInfo)).catch((e) => { throw e; });
    }
};

export const mounted = function(this: types.IVForm): void {
    this.tid = this.taskId;
    this.select = clickgo.core.config.locale;
};
