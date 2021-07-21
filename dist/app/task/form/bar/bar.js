"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.watch = exports.methods = exports.data = void 0;
exports.data = {
    'left': undefined,
    'top': undefined,
    'width': undefined,
    'height': undefined,
    'position': 'bottom',
    'tasks': {}
};
exports.methods = {
    itemTap: function (taskId) {
        let formIds = Object.keys(this.tasks[taskId].forms);
        if (formIds.length === 1) {
            clickgo.form.changeFocus(parseInt(formIds[0]));
        }
        else {
        }
    },
    changeFocus: function (formId) {
        clickgo.form.changeFocus(parseInt(formId));
    }
};
exports.watch = {
    'position': function () {
        clickgo.form.refreshTaskPosition();
    }
};
exports.mounted = function () {
    this.cgSetTopMost(true);
    clickgo.form.setTask(this.taskId, this.formId);
    let tasks = clickgo.task.getList();
    for (let taskId in tasks) {
        if (parseInt(taskId) === this.taskId) {
            continue;
        }
        let task = tasks[taskId];
        this.tasks[taskId] = {
            'icon': task.icon,
            'selected': false,
            'opened': true,
            'forms': {},
            'formCount': 0
        };
    }
    this.cgSetSystemEventListener('taskStarted', (taskId) => {
        if (this.tasks[taskId]) {
            return;
        }
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        this.tasks[taskId] = {
            'icon': task.icon,
            'selected': false,
            'opened': true,
            'forms': {},
            'formCount': 0
        };
    });
    this.cgSetSystemEventListener('taskEnded', (taskId) => {
        if (!this.tasks[taskId]) {
            return;
        }
        delete (this.tasks[taskId]);
    });
    this.cgSetSystemEventListener('formCreated', (taskId, formId, title, icon) => {
        if (!this.tasks[taskId]) {
            return;
        }
        if (this.tasks[taskId].forms[formId]) {
            console.log('???', taskId, formId, icon);
        }
        this.tasks[taskId].forms[formId] = {
            'title': title,
            'icon': icon || this.tasks[taskId].icon
        };
        ++this.tasks[taskId].formCount;
    });
    this.cgSetSystemEventListener('formRemoved', (taskId, formId) => {
        if (!this.tasks[taskId]) {
            return;
        }
        delete (this.tasks[taskId].forms[formId]);
        --this.tasks[taskId].formCount;
    });
    this.cgSetSystemEventListener('formFocused', (taskId) => {
        if (!this.tasks[taskId]) {
            return;
        }
        this.tasks[taskId].selected = true;
    });
    this.cgSetSystemEventListener('formBlurred', (taskId) => {
        if (!this.tasks[taskId]) {
            return;
        }
        this.tasks[taskId].selected = false;
    });
};
