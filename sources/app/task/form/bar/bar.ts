export let data = {
    'left': 0,
    'top': 0,
    'width': undefined,
    'height': undefined,

    'apps': []
};

export let computed = {
    'position': function(this: IVueForm): string {
        return clickgo.core.config['task.position'];
    }
};

export let methods = {
    itemTap: async function(this: IVueForm, appIndex: number): Promise<void> {
        if (this.apps[appIndex].formCount === 0) {
            // --- 启动 ---
            try {
                await clickgo.task.run(this.apps[appIndex].path);
            }
            catch {
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
                // --- 当前是焦点，则最小化 ---
                clickgo.form.min(formId);
            }
            else {
                // --- 没有焦点 ---
                // --- 让其获取焦点，如果是最小化状态，则会自动还原 ---
                clickgo.form.changeFocus(formId);
            }
        }
        else {
            // --- 多个窗体，则让用户选择显示哪个 ---
        }
    },
    run: async function(this: IVueForm, path: string): Promise<void> {
        try {
            await clickgo.task.run(path);
        }
        catch {
            return;
        }
    },
    close: async function(this: IVueForm, index: number): Promise<void> {
        let app = this.apps[index];
        if (!app) {
            return;
        }
        for (let formId in app.forms) {
            clickgo.form.remove(parseInt(formId));
        }
    },
    changeFocus: function(this: IVueForm, formId: string): void {
        clickgo.form.changeFocus(parseInt(formId));
    },
    updatePosition: function(position: 'left' | 'right' | 'top' | 'bottom'): void {
        clickgo.core.config['task.position'] = position;
    },
    getAppIndexByPath: function(this: IVueForm, path: string): number {
        for (let i = 0; i < this.apps.length; ++i) {
            let app = this.apps[i];
            if (app.path !== path) {
                continue;
            }
            // --- 找到惹 ---
            return i;
        }
        return -1;
    }
};

export let mounted = function(this: IVueForm): void {
    this.cgSetTopMost(true);
    clickgo.form.setTask(this.taskId, this.formId);

    // --- 先读取 pin 列表 ---
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

    // --- 先读取正在运行的 task 列表，并填充 forms 列表 ---
    let tasks = clickgo.task.getList();
    for (let taskId in tasks) {
        if (parseInt(taskId) === this.taskId) {
            // --- 如果获取的 task 是本 task 则跳过 ---
            continue;
        }
        let task = tasks[taskId];
        // --- 看看能不能找到 task ---
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
        // --- 获取窗体 ---
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
    this.cgSetSystemEventListener('formCreated', (taskId: number, formId: number, title: string, icon: string): void => {
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
    this.cgSetSystemEventListener('formRemoved', (taskId: number, formId: number): void => {
        let task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        let appIndex = this.getAppIndexByPath(task.path);
        if (appIndex < 0) {
            return;
        }
        delete(this.apps[appIndex].forms[formId]);
        --this.apps[appIndex].formCount;
        // --- 检测 app 是否要关掉 ---
        if (this.apps[appIndex].formCount > 0) {
            return;
        }
        // --- 看看在不在 pin 里 ---
        let pinPaths = Object.keys(clickgo.core.config['task.pin']);
        if (pinPaths.includes(this.apps[appIndex].path)) {
            this.apps[appIndex].opened = false;
        }
        else {
            // --- 直接移除 ---
            this.apps.splice(appIndex, 1);
        }
    });
    this.cgSetSystemEventListener('formFocused', (taskId: number): void => {
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
    this.cgSetSystemEventListener('formBlurred', (taskId: number): void => {
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
    this.cgSetSystemEventListener('formTitleChanged', (taskId: number, formId: number, title: string): void => {
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
    this.cgSetSystemEventListener('formIconChanged', (taskId: number, formId: number, icon: string): void => {
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
