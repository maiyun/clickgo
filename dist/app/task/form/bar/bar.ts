import * as clickgo from 'clickgo';

interface IApp {
    'name': string;
    'path': string;
    'icon': string;
    'selected': boolean;
    'opened': boolean;
    'forms': Record<string, {
        'title': string;
        'icon': string;
    }>;
    'formCount': number;
    'pin': boolean;
}

export default class extends clickgo.form.AbstractForm {

    /** --- 当前正在运行的 app 列表 --- */
    public apps: IApp[] = [];

    public get position(): string {
        return clickgo.core.config['task.position'];
    }

    public showLauncher(): void {
        clickgo.form.showLauncher();
    }

    public async itemClick(appIndex: number): Promise<void> {
        if (this.apps[appIndex].formCount === 0) {
            // --- 启动 ---
            try {
                await clickgo.task.run(this, this.apps[appIndex].path);
            }
            catch {
                return;
            }
        }
        else if (this.apps[appIndex].formCount === 1) {
            const formIds = Object.keys(this.apps[appIndex].forms);
            const formId = formIds[0];
            const form = clickgo.form.get(formId);
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
                await clickgo.form.changeFocus(formId);
            }
        }
        else {
            // --- 多个窗体，则让用户选择显示哪个 ---
        }
    }

    public async run(path: string): Promise<void> {
        await clickgo.task.run(this, path);
    }

    /** --- 钉上 --- */
    public pin(index: number): void {
        const app = this.apps[index];
        if (!app) {
            return;
        }
        const paths = Object.keys(clickgo.core.config['task.pin']);
        if (paths.includes(app.path)) {
            // --- 剔除 ---
            delete clickgo.core.config['task.pin'][app.path];
        }
        else {
            // --- 加入 ---
            clickgo.core.config['task.pin'][app.path] = {
                'name': app.name,
                'icon': app.icon
            };
        }
    }

    public cclose(index: number): void {
        const app = this.apps[index];
        if (!app) {
            return;
        }
        for (const formId in app.forms) {
            clickgo.form.close(formId);
        }
    }

    public async changeFocus(formId: string): Promise<void> {
        await clickgo.form.changeFocus(formId);
    }

    public updatePosition(position: 'left' | 'right' | 'top' | 'bottom'): void {
        clickgo.core.config['task.position'] = position;
    }

    // --- 系统事件 ---

    public async onMounted(): Promise<void> {
        this.topMost = true;
        clickgo.task.setSystem(this, this.formId);
        // --- 先读取 pin 列表 ---
        for (const path in clickgo.core.config['task.pin']) {
            this.apps.push({
                'name': clickgo.core.config['task.pin'][path].name,
                'path': path,
                'icon': clickgo.core.config['task.pin'][path].icon,
                'selected': false,
                'opened': false,
                'forms': {},
                'formCount': 0,
                'pin': true,
            });
        }
        // --- 先读取正在运行的 task 列表，并填充 forms 列表 ---
        const tasks = await clickgo.task.getOriginList(this);
        for (const taskId in tasks) {
            if (taskId === this.taskId) {
                // --- 如果获取的 task 是本 task 则跳过 ---
                continue;
            }
            const task = tasks[taskId];
            // --- 看看能不能找到 task ---
            let app: IApp | undefined = undefined;
            const appIndex = this.apps.findIndex(app => app.path === task.path);
            if (appIndex >= 0) {
                this.apps[appIndex].opened = true;
            }
            else {
                app = {
                    'name': task.app.config.name,
                    'path': task.path,
                    'icon': task.app.icon,
                    'selected': false,
                    'opened': true,
                    'forms': {},
                    'formCount': 0,
                    'pin': false,
                };
            }
            // --- 获取窗体 ---
            const forms = clickgo.form.getList(taskId);
            for (const formId in forms) {
                const form = forms[formId];
                if (!form.showInSystemTask) {
                    continue;
                }
                if (!form.show) {
                    continue;
                }
                (app ?? this.apps[appIndex]).forms[formId] = {
                    'title': form.title,
                    'icon': form.icon || (app ?? this.apps[appIndex]).icon
                };
            }
            (app ?? this.apps[appIndex]).formCount = Object.keys((app ?? this.apps[appIndex]).forms).length;
            if (app?.formCount) {
                this.apps.push(app);
            }
        }
    }

    public onFormCreated(taskId: string, formId: string, title: string, icon: string, sist: boolean): void {
        if (taskId === this.taskId) {
            return;
        }
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        if (!sist) {
            return;
        }
        let appIndex = this.apps.findIndex(app => app.path === task.path);
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

    public onFormRemoved(taskId: string, formId: string): void {
        if (taskId === this.taskId) {
            return;
        }
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.apps.findIndex(app => app.path === task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        delete this.apps[appIndex].forms[formId];
        --this.apps[appIndex].formCount;
        // --- 检测 app 是否要关掉 ---
        if (this.apps[appIndex].formCount > 0) {
            return;
        }
        // --- 看看在不在 pin 里 ---
        const pinPaths = Object.keys(clickgo.core.config['task.pin']);
        if (pinPaths.includes(this.apps[appIndex].path)) {
            this.apps[appIndex].opened = false;
        }
        else {
            // --- 直接移除 ---
            this.apps.splice(appIndex, 1);
        }
    }

    public onFormFocused(taskId: string): void {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.apps.findIndex(app => app.path === task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = true;
    }

    public onFormBlurred(taskId: string): void {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.apps.findIndex(app => app.path === task.path);
        if (appIndex < 0) {
            return;
        }
        this.apps[appIndex].selected = false;
    }

    public onFormTitleChanged(taskId: string, formId: string, title: string): void | Promise<void> {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.apps.findIndex(app => app.path === task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        this.apps[appIndex].forms[formId].title = title;
    }

    public onFormIconChanged(taskId: string, formId: string, icon: string): void | Promise<void> {
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        const appIndex = this.apps.findIndex(app => app.path === task.path);
        if (appIndex < 0) {
            return;
        }
        if (!this.apps[appIndex].forms[formId]) {
            return;
        }
        this.apps[appIndex].forms[formId].icon = icon || this.apps[appIndex].icon;
    }

    public onFormShowAndShowInTaskChange(taskId: string, formId: string, show: boolean): void {
        if (taskId === this.taskId) {
            return;
        }
        const task = clickgo.task.get(taskId);
        if (!task) {
            return;
        }
        if (show) {
            // --- 相当于创建 ---
            const form = clickgo.form.get(formId);
            if (!form) {
                return;
            }
            if (!form.showInSystemTask || !form.show) {
                // --- 不应该显示 ---
                return;
            }
            let appIndex = this.apps.findIndex(app => app.path === task.path);
            if (appIndex >= 0) {
                if (this.apps[appIndex].forms[formId]) {
                    // --- 窗体本就显示，那就不管 ---
                    return;
                }
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
                'title': form.title,
                'icon': form.icon || this.apps[appIndex].icon
            };
            ++this.apps[appIndex].formCount;
        }
        else {
            // --- 相当于移除 ---
            const appIndex = this.apps.findIndex(app => app.path === task.path);
            if (appIndex < 0) {
                return;
            }
            if (!this.apps[appIndex].forms[formId]) {
                // --- 窗体本就不显示，那就不管 ---
                return;
            }
            // --- 不用管 show 和 showInSystemTask 状态，因为只要有一个为 false（本次就是 false）就不显示 ---
            delete this.apps[appIndex].forms[formId];
            --this.apps[appIndex].formCount;
            // --- 检测 app 是否要关掉 ---
            if (this.apps[appIndex].formCount > 0) {
                return;
            }
            // --- 看看在不在 pin 里 ---
            const pinPaths = Object.keys(clickgo.core.config['task.pin']);
            if (pinPaths.includes(this.apps[appIndex].path)) {
                this.apps[appIndex].opened = false;
            }
            else {
                // --- 直接移除 ---
                this.apps.splice(appIndex, 1);
            }
        }
    }

    public onFormShowChanged(taskId: string, formId: string, state: boolean): void {
        this.onFormShowAndShowInTaskChange(taskId, formId, state);
    }

    public onFormShowInSystemTaskChange(taskId: string, formId: string, value: boolean): void {
        this.onFormShowAndShowInTaskChange(taskId, formId, value);
    }

    public onConfigChanged<T extends clickgo.core.IConfig, TK extends keyof T>(n: TK, v: T[TK]): void {
        if (n !== 'task.pin') {
            return;
        }
        // --- 系统设置里，已经 pin 的 path 列表 ---
        const val = v as clickgo.core.IConfig['task.pin'];
        for (const path in val) {
            const item = val[path];
            const appIndex = this.apps.findIndex(app => app.path === path);
            if (appIndex < 0) {
                // --- apps 里没有，要添加进去已 pin 的 item ---
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
                // --- apps 里有，但不是 pin，则添加 pin  ---
                if (!this.apps[appIndex].pin) {
                    this.apps[appIndex].pin = true;
                }
            }
        }
        // --- apps 里有，但是已经被取消 pin 的 ---
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
