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
    showLauncher: function () {
        clickgo.form.showLauncher();
    },
    itemClick: function (appIndex) {
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
                const formIds = Object.keys(this.apps[appIndex].forms);
                const formId = parseInt(formIds[0]);
                const form = clickgo.form.get(formId);
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
    pin: function (index) {
        const app = this.apps[index];
        if (!app) {
            return;
        }
        const paths = Object.keys(clickgo.core.config['task.pin']);
        if (paths.includes(app.path)) {
            delete clickgo.core.config['task.pin'][app.path];
        }
        else {
            clickgo.core.config['task.pin'][app.path] = {
                'name': app.name,
                'icon': app.icon
            };
        }
    },
    close: function (index) {
        const app = this.apps[index];
        if (!app) {
            return;
        }
        for (const formId in app.forms) {
            clickgo.form.remove(parseInt(formId));
        }
    },
    changeFocus: function (formId) {
        clickgo.form.changeFocus(parseInt(formId));
    },
    updatePosition: function (position) {
        clickgo.core.config['task.position'] = position;
    },
    getAppIndexByPath: function (path) {
        for (let i = 0; i < this.apps.length; ++i) {
            const app = this.apps[i];
            if (app.path !== path) {
                continue;
            }
            return i;
        }
        return -1;
    }
};
const mounted = function () {
    clickgo.form.setTopMost(true);
    clickgo.task.setSystem();
    for (const path in clickgo.core.config['task.pin']) {
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
    const tasks = clickgo.task.getList();
    for (const taskId in tasks) {
        if (parseInt(taskId) === this.taskId) {
            continue;
        }
        const task = tasks[taskId];
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
        const forms = clickgo.form.getList(parseInt(taskId));
        for (const formId in forms) {
            const form = forms[formId];
            this.apps[appIndex].forms[formId] = {
                'title': form.title,
                'icon': form.icon || this.apps[appIndex].icon
            };
        }
        this.apps[appIndex].formCount = Object.keys(this.apps[appIndex].forms).length;
    }
    clickgo.core.setSystemEventListener('formCreated', (taskId, formId, title, icon) => {
        if (taskId === this.taskId) {
            return;
        }
        const task = clickgo.task.get(taskId);
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
    clickgo.core.setSystemEventListener('formRemoved', (taskId, formId) => {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        delete this.apps[appIndex].forms[formId];
        --this.apps[appIndex].formCount;
        if (this.apps[appIndex].formCount > 0) {
            return;
        }
        const pinPaths = Object.keys(clickgo.core.config['task.pin']);
        if (pinPaths.includes(this.apps[appIndex].path)) {
            this.apps[appIndex].opened = false;
        }
        else {
            this.apps.splice(appIndex, 1);
        }
    });
    clickgo.core.setSystemEventListener('formFocused', (taskId) => {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = true;
    });
    clickgo.core.setSystemEventListener('formBlurred', (taskId) => {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = false;
    });
    clickgo.core.setSystemEventListener('formTitleChanged', (taskId, formId, title) => {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        this.apps[appIndex].forms[formId].title = title;
    });
    clickgo.core.setSystemEventListener('formIconChanged', (taskId, formId, icon) => {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        this.apps[appIndex].forms[formId].icon = icon || this.apps[appIndex].icon;
    });
    clickgo.core.setSystemEventListener('configChanged', (n, v) => {
        if (n !== 'task.pin') {
            return;
        }
        for (const path in v) {
            const appIndex = this.getAppIndexByPath(path);
            if (appIndex < 0) {
                this.apps.unshift({
                    'name': v[path].name,
                    'path': path,
                    'icon': v[path].icon,
                    'selected': false,
                    'opened': false,
                    'forms': {},
                    'formCount': 0,
                    'pin': true
                });
            }
            else {
                if (!this.apps[appIndex].pin) {
                    this.apps[appIndex].pin = true;
                }
            }
        }
        for (let appIndex = 0; appIndex < this.apps.length; ++appIndex) {
            const app = this.apps[appIndex];
            if (!app.pin) {
                continue;
            }
            if (v[app.path]) {
                continue;
            }
            if (app.formCount === 0) {
                this.apps.splice(appIndex, 1);
            }
            else {
                app.pin = false;
            }
        }
    });
};
exports.mounted = mounted;
