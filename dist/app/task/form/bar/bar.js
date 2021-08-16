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
exports.data = {
    'left': 0,
    'top': 0,
    'width': undefined,
    'height': undefined,
    'apps': []
};
exports.computed = {
    'position': function () {
        return clickgo.core.config['task.position'];
    }
};
exports.methods = {
    itemTap: function (appIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apps[appIndex].formCount === 0) {
                try {
                    yield clickgo.task.run(this.apps[appIndex].path);
                }
                catch (_a) {
                    return;
                }
            }
            else if (this.apps[appIndex].formCount === 1) {
                let formIds = Object.keys(this.apps[appIndex].forms);
                let formId = parseInt(formIds[0]);
                let form = clickgo.form.get(formId);
                if (!form) {
                    return;
                }
                if (form.focus) {
                    clickgo.form.min(formId);
                }
                else {
                    clickgo.form.changeFocus(formId);
                }
            }
            else {
            }
        });
    },
    run: function (path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield clickgo.task.run(path);
            }
            catch (_a) {
                return;
            }
        });
    },
    close: function (index) {
        return __awaiter(this, void 0, void 0, function* () {
            let app = this.apps[index];
            if (!app) {
                return;
            }
            for (let formId in app.forms) {
                clickgo.form.remove(parseInt(formId));
            }
        });
    },
    changeFocus: function (formId) {
        clickgo.form.changeFocus(parseInt(formId));
    },
    updatePosition: function (position) {
        clickgo.core.config['task.position'] = position;
    },
    getAppIndexByPath: function (path) {
        for (let i = 0; i < this.apps.length; ++i) {
            let app = this.apps[i];
            if (app.path !== path) {
                continue;
            }
            return i;
        }
        return -1;
    }
};
exports.mounted = function () {
    this.cgSetTopMost(true);
    clickgo.form.setTask(this.taskId, this.formId);
    for (let path in clickgo.core.config['task.pin']) {
        this.apps.push({
            'name': clickgo.core.config['task.pin'][path].name,
            'path': path,
            'icon': clickgo.core.config['task.pin'][path].icon,
            'selected': false,
            'opened': false,
            'forms': {},
            'formCount': 0,
            'pin': true
        });
    }
    let tasks = clickgo.task.getList();
    for (let taskId in tasks) {
        if (parseInt(taskId) === this.taskId) {
            continue;
        }
        let task = tasks[taskId];
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex >= 0) {
            this.apps[appIndex].opened = true;
        }
        else {
            this.apps.push({
                'name': task.name,
                'path': task.path,
                'icon': task.icon,
                'selected': false,
                'opened': true,
                'forms': {},
                'formCount': 0,
                'pin': false
            });
            appIndex = this.apps.length - 1;
        }
        let forms = clickgo.form.getList(parseInt(taskId));
        for (let formId in forms) {
            let form = forms[formId];
            this.apps[appIndex].forms[formId] = {
                'title': form.title,
                'icon': form.icon || this.apps[appIndex].icon
            };
        }
        this.apps[appIndex].formCount = Object.keys(this.apps[appIndex].forms).length;
    }
    this.cgSetSystemEventListener('formCreated', (taskId, formId, title, icon) => {
        if (taskId === this.taskId) {
            return;
        }
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex >= 0) {
            this.apps[appIndex].opened = true;
        }
        else {
            this.apps.push({
                'name': task.name,
                'path': task.path,
                'icon': task.icon,
                'selected': false,
                'opened': true,
                'forms': {},
                'formCount': 0,
                'pin': false
            });
            appIndex = this.apps.length - 1;
        }
        this.apps[appIndex].forms[formId] = {
            'title': title,
            'icon': icon || this.apps[appIndex].icon
        };
        ++this.apps[appIndex].formCount;
    });
    this.cgSetSystemEventListener('formRemoved', (taskId, formId) => {
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        delete (this.apps[appIndex].forms[formId]);
        --this.apps[appIndex].formCount;
        if (this.apps[appIndex].formCount > 0) {
            return;
        }
        let pinPaths = Object.keys(clickgo.core.config['task.pin']);
        if (pinPaths.includes(this.apps[appIndex].path)) {
            this.apps[appIndex].opened = false;
        }
        else {
            this.apps.splice(appIndex, 1);
        }
    });
    this.cgSetSystemEventListener('formFocused', (taskId) => {
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = true;
    });
    this.cgSetSystemEventListener('formBlurred', (taskId) => {
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = false;
    });
    this.cgSetSystemEventListener('formTitleChanged', (taskId, formId, title) => {
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        this.apps[appIndex].forms[formId].title = title;
    });
    this.cgSetSystemEventListener('formIconChanged', (taskId, formId, icon) => {
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        this.apps[appIndex].forms[formId].icon = icon || this.apps[appIndex].icon;
    });
};
