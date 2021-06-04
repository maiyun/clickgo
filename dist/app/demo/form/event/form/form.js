"use strict";
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
    }
};
exports.mounted = function () {
    this.cgSetSystemEventListener('formCreated', (taskId, formId, title, icon) => {
        this.flist[formId] = {
            'title': title,
            'icon': icon,
            'min': false,
            'max': false,
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
    this.cgSetSystemEventListener('formFlash', (taskId, formId) => {
        if (!this.flist[formId]) {
            return;
        }
        if (this.flist[formId].flash) {
            clearTimeout(this.flist[formId].flash);
        }
        this.flist[formId].flash = setTimeout(() => {
            this.flist[formId].flash = undefined;
        }, 1000);
        this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
    });
};
