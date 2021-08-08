"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = void 0;
exports.data = {
    'left': 0,
    'top': 0,
    'width': undefined,
    'height': undefined,
    'tasks': {}
};
exports.computed = {
    'position': function () {
        return clickgo.core.config['task.position'];
    }
};
exports.methods = {
    itemTap: function (taskId) {
        let formIds = Object.keys(this.tasks[taskId].forms);
        if (formIds.length === 1) {
            let formId = parseInt(formIds[0]);
            let form = clickgo.form.get(formId);
            if (!form) {
                return;
            }
            if (form.focus) {
                clickgo.form.min(formId);
            }
            else {
                if (form.stateMin) {
                    clickgo.form.min(formId);
                    clickgo.form.changeFocus(formId);
                }
                else {
                    clickgo.form.changeFocus(formId);
                }
            }
        }
        else {
        }
    },
    changeFocus: function (formId) {
        clickgo.form.changeFocus(parseInt(formId));
    },
    updatePosition: function (position) {
        clickgo.core.config['task.position'] = position;
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
