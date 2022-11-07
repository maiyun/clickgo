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
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.flist = {};
        this.list = [];
    }
    pushConsole(name, text) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }
    changeFocus(fid) {
        clickgo.form.changeFocus(parseInt(fid));
    }
    onMounted() {
        const list = clickgo.task.getList();
        for (const taskId in list) {
            const flist = clickgo.form.getList(parseInt(taskId));
            for (const fid in flist) {
                this.flist[fid] = {
                    'title': flist[fid].title,
                    'icon': flist[fid].icon,
                    'stateMax': flist[fid].stateMax,
                    'stateMin': flist[fid].stateMin,
                    'show': flist[fid].show,
                    'focus': flist[fid].focus,
                    'flash': false
                };
            }
        }
    }
    onFormCreated(taskId, formId, title, icon) {
        this.flist[formId] = {
            'title': title,
            'icon': icon,
            'stateMax': false,
            'stateMin': false,
            'show': false,
            'focus': false,
            'flash': false
        };
        this.pushConsole('formCreated', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormRemoved(taskId, formId, title, icon) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete this.flist[formId];
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormTitleChanged(taskId, formId, title) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    }
    onFormIconChanged(taskId, formId, icon) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormStateMinChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormStateMaxChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormShowChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormFocused(taskId, formId) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    }
    onFormBlurred(taskId, formId) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    }
    onFormFlash(taskId, formId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.flist[formId]) {
                return;
            }
            if (this.flist[formId].flash) {
                clickgo.task.removeTimer(this.flist[formId].flash);
            }
            this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
            this.flist[formId].flash = true;
            yield clickgo.tool.sleep(1000);
            this.flist[formId].flash = false;
        });
    }
}
exports.default = default_1;
