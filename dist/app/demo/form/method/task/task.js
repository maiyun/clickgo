"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'tid': '0',
    'frameTimer': 0,
    'frameCount': 0,
    'timer': 0,
    'timerCount': 0,
    'select': '',
    'sleeping': false
};
exports.computed = {
    globalLocale: function () {
        return clickgo.core.config.locale;
    }
};
exports.methods = {
    frameStart: function (v) {
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
    frameEnd: function () {
        clickgo.task.offFrame(this.frameTimer);
        this.frameCount = 0;
        this.frameTimer = 0;
    },
    timerStart: function (v) {
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
    timerEnd: function () {
        clickgo.task.removeTimer(this.timer);
        this.timerCount = 0;
        this.timer = 0;
    },
    get: function () {
        const r = clickgo.task.get(this.tid);
        clickgo.form.dialog(r ? JSON.stringify(r) : 'null').catch((e) => { throw e; });
    },
    getList: function () {
        clickgo.form.dialog(JSON.stringify(clickgo.task.getList())).catch((e) => { throw e; });
    },
    run: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const tid = yield clickgo.task.run('/clickgo/app/demo/');
            yield clickgo.form.dialog('Task ID: ' + tid.toString());
        });
    },
    end: function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Result: ' + (clickgo.task.end(this.tid) ? 'true' : 'false'));
        });
    },
    loadLocale: function (lang, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield clickgo.task.loadLocale(lang, path);
            yield clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
        });
    },
    setLocale: function (lang, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield clickgo.task.setLocale(lang, path);
            yield clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
        });
    },
    clearLocale: function () {
        clickgo.task.clearLocale();
    },
    loadLocaleData: function (lang, data) {
        clickgo.task.loadLocaleData(lang, data);
    },
    setLocaleLang: function (lang) {
        clickgo.task.setLocaleLang(lang);
    },
    clearLocaleLang: function () {
        clickgo.task.clearLocaleLang();
    },
    changeLocaleLang: function () {
        clickgo.core.config.locale = this.select;
    },
    sleep: function () {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        clickgo.task.sleep(() => {
            this.sleeping = false;
        }, 1000);
    },
    systemTaskInfo: function () {
        clickgo.form.dialog(JSON.stringify(clickgo.task.systemTaskInfo)).catch((e) => { throw e; });
    }
};
const mounted = function () {
    this.tid = this.taskId;
    this.select = clickgo.core.config.locale;
};
exports.mounted = mounted;
