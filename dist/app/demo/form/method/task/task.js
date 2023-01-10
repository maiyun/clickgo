"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.tid = '0';
        this.frameTimer = 0;
        this.frameCount = 0;
        this.timer = 0;
        this.timerCount = 0;
        this.select = [];
        this.sleeping = false;
    }
    get globalLocale() {
        return clickgo.core.config.locale;
    }
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
        this.frameTimer = clickgo.task.onFrame(() => {
            ++this.frameCount;
        }, opt);
    }
    frameEnd() {
        clickgo.task.offFrame(this.frameTimer);
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
        this.timer = clickgo.task.createTimer(() => {
            ++this.timerCount;
        }, 1, opt);
    }
    timerEnd() {
        clickgo.task.removeTimer(this.timer);
        this.timerCount = 0;
        this.timer = 0;
    }
    get() {
        const r = clickgo.task.get(parseInt(this.tid));
        clickgo.form.dialog(r ? JSON.stringify(r).replace(/(data:image\/).+?"/g, '$1..."') : 'null').catch((e) => { throw e; });
    }
    getPermissions() {
        const r = clickgo.task.getPermissions(parseInt(this.tid));
        clickgo.form.dialog(JSON.stringify(r)).catch((e) => { throw e; });
    }
    getList() {
        let msg = JSON.stringify(clickgo.task.getList());
        msg = msg.replace(/(data:image\/).+?"/g, '$1..."');
        clickgo.form.dialog(msg).catch((e) => { throw e; });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const tid = yield clickgo.task.run('/clickgo/app/demo/');
            yield clickgo.form.dialog('Task ID: ' + tid.toString());
        });
    }
    checkPermission(val) {
        return __awaiter(this, void 0, void 0, function* () {
            const rtn = yield clickgo.task.checkPermission(val, true);
            yield clickgo.form.dialog(rtn[0] ? 'Succeed' : 'Failed');
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Result: ' + (clickgo.task.end(parseInt(this.tid)) ? 'true' : 'false'));
        });
    }
    loadLocale(lang, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield clickgo.task.loadLocale(lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
            yield clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
        });
    }
    setLocale(lang, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield clickgo.task.setLocale(lang, '/package' + clickgo.tool.urlResolve(this.filename, path));
            yield clickgo.form.dialog('Result: ' + (r ? 'true' : 'false'));
        });
    }
    clearLocale() {
        clickgo.task.clearLocale();
    }
    loadLocaleData(lang, data) {
        clickgo.task.loadLocaleData(lang, data);
    }
    setLocaleLang(lang) {
        clickgo.task.setLocaleLang(lang);
    }
    clearLocaleLang() {
        clickgo.task.clearLocaleLang();
    }
    changeLocaleLang() {
        clickgo.core.config.locale = this.select[0];
    }
    sleep() {
        if (this.sleeping) {
            return;
        }
        this.sleeping = true;
        clickgo.task.sleep(() => {
            this.sleeping = false;
        }, 1000);
    }
    systemTaskInfo() {
        clickgo.form.dialog(JSON.stringify(clickgo.task.systemTaskInfo)).catch((e) => { throw e; });
    }
    onMounted() {
        this.tid = this.taskId.toString();
        this.select = [clickgo.core.config.locale];
    }
}
exports.default = default_1;
