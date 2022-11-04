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
        this.apps = [];
    }
    get position() {
        return clickgo.core.config['task.position'];
    }
    showLauncher() {
        clickgo.form.showLauncher();
    }
    itemClick(appIndex) {
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
    }
    run(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield clickgo.task.run(path);
            }
            catch (_a) {
                return;
            }
        });
    }
    pin(index) {
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
    }
    close(index) {
        const app = this.apps[index];
        if (!app) {
            return;
        }
        for (const formId in app.forms) {
            clickgo.form.close(parseInt(formId));
        }
    }
    changeFocus(formId) {
        clickgo.form.changeFocus(parseInt(formId));
    }
    updatePosition(position) {
        clickgo.core.config['task.position'] = position;
    }
    getAppIndexByPath(path) {
        for (let i = 0; i < this.apps.length; ++i) {
            const app = this.apps[i];
            if (app.path !== path) {
                continue;
            }
            return i;
        }
        return -1;
    }
    onMounted() {
        this.topMost = true;
        clickgo.task.setSystem(this.formId);
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
    }
    onFormCreated(taskId, formId, title, icon) {
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
    }
    onFormRemoved(taskId, formId) {
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
    }
    onFormFocused(taskId) {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = true;
    }
    onFormBlurred(taskId) {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = false;
    }
    onFormTitleChanged(taskId, formId, title) {
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
    }
    onFormIconChanged(taskId, formId, icon) {
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
    }
    onConfigChanged(n, v) {
        if (n !== 'task.pin') {
            return;
        }
        const val = v;
        for (const path in val) {
            const item = val[path];
            const appIndex = this.getAppIndexByPath(path);
            if (appIndex < 0) {
                this.apps.unshift({
                    'name': item.name,
                    'path': path,
                    'icon': item.icon,
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
            if (val[app.path]) {
                continue;
            }
            if (app.formCount === 0) {
                this.apps.splice(appIndex, 1);
            }
            else {
                app.pin = false;
            }
        }
    }
}
exports.default = default_1;
