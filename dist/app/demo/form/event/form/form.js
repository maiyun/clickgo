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
exports.mounted = exports.methods = exports.data = void 0;
exports.data = {
    'flist': {},
    'list': []
};
exports.methods = {
    'pushConsole': function (name, text) {
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'name': name,
            'text': text
        });
    },
    'changeFocus': function (fid) {
        clickgo.form.changeFocus(parseInt(fid));
    }
};
exports.mounted = function () {
    let list = clickgo.task.getList();
    for (let taskId in list) {
        let flist = clickgo.form.getList(parseInt(taskId));
        for (let fid in flist) {
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
    this.cgSetSystemEventListener('formCreated', (taskId, formId, title, icon) => {
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
    });
    this.cgSetSystemEventListener('formRemoved', (taskId, formId, title, icon) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete (this.flist[formId]);
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    });
    this.cgSetSystemEventListener('formTitleChanged', (taskId, formId, title) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    });
    this.cgSetSystemEventListener('formIconChanged', (taskId, formId, icon) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    });
    this.cgSetSystemEventListener('formStateMinChanged', (taskId, formId, state) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    });
    this.cgSetSystemEventListener('formStateMaxChanged', (taskId, formId, state) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    });
    this.cgSetSystemEventListener('formShowChanged', (taskId, formId, state) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    });
    this.cgSetSystemEventListener('formFocused', (taskId, formId) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    });
    this.cgSetSystemEventListener('formBlurred', (taskId, formId) => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    });
    this.cgSetSystemEventListener('formFlash', (taskId, formId) => __awaiter(this, void 0, void 0, function* () {
        if (!this.flist[formId]) {
            return;
        }
        if (this.flist[formId].flash) {
            this.cgRemoveTimer(this.flist[formId].flash);
        }
        this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
        this.flist[formId].flash = true;
        yield clickgo.tool.sleep(1000);
        this.flist[formId].flash = false;
    }));
};
