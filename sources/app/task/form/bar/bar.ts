export let data = {
    'left': undefined,
    'top': undefined,
    'width': undefined,
    'height': undefined,
    'position': 'bottom',

    'tasks': {}
};

export let methods = {
    itemTap: function(this: IVueForm, taskId: string): void {
        let formIds = Object.keys(this.tasks[taskId].forms);
        if (formIds.length === 1) {
            clickgo.form.changeFocus(parseInt(formIds[0]));
        }
        else {
            // --- 多个窗体，则让用户选择显示哪个 ---
        }
    },
    changeFocus: function(this: IVueForm, formId: string): void {
        clickgo.form.changeFocus(parseInt(formId));
    }
};

export let watch = {
    'position': function(this: IVueForm): void {
        clickgo.form.refreshTaskPosition();
    }
};

export let mounted = function(this: IVueForm): void {
    this.cgSetTopMost(true);
    clickgo.form.setTask(this.taskId, this.formId);

    // --- 先读取 task 列表 ---
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
    this.cgSetSystemEventListener('taskStarted', (taskId: number): void => {
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
    this.cgSetSystemEventListener('taskEnded', (taskId: number): void => {
        if (!this.tasks[taskId]) {
            return;
        }
        delete(this.tasks[taskId]);
    });
    this.cgSetSystemEventListener('formCreated', (taskId: number, formId: number, title: string, icon: string): void => {
        if (!this.tasks[taskId]) {
            return;
        }
        this.tasks[taskId].forms[formId] = {
            'title': title,
            'icon': icon || this.tasks[taskId].icon
        };
        ++this.tasks[taskId].formCount;
    });
    this.cgSetSystemEventListener('formRemoved', (taskId: number, formId: number): void => {
        if (!this.tasks[taskId]) {
            return;
        }
        delete(this.tasks[taskId].forms[formId]);
        --this.tasks[taskId].formCount;
    });
    this.cgSetSystemEventListener('formFocused', (taskId: number): void => {
        if (!this.tasks[taskId]) {
            return;
        }
        this.tasks[taskId].selected = true;
    });
    this.cgSetSystemEventListener('formBlurred', (taskId: number): void => {
        if (!this.tasks[taskId]) {
            return;
        }
        this.tasks[taskId].selected = false;
    });
};
