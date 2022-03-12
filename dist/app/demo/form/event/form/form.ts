export let data = {
    'flist': {},
    'list': []
};

export let methods = {
    'pushConsole': function(this: IVForm, name: string, text: string): void {
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'name': name,
            'text': text
        });
    },
    'changeFocus': function(this: IVForm, fid: string): void {
        clickgo.form.changeFocus(parseInt(fid));
    }
};

export let mounted = function(this: IVForm): void {
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
    this.cgSetSystemEventListener('formCreated', (taskId: number, formId: number, title: string, icon: string): void => {
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
    this.cgSetSystemEventListener('formRemoved', (taskId: number, formId: number, title: string, icon: string): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete(this.flist[formId]);
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    });
    this.cgSetSystemEventListener('formTitleChanged', (taskId: number, formId: number, title: string): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    });
    this.cgSetSystemEventListener('formIconChanged', (taskId: number, formId: number, icon: string): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    });
    this.cgSetSystemEventListener('formStateMinChanged', (taskId: number, formId: number, state: boolean): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    });
    this.cgSetSystemEventListener('formStateMaxChanged', (taskId: number, formId: number, state: boolean): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    });
    this.cgSetSystemEventListener('formShowChanged', (taskId: number, formId: number, state: boolean): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    });
    this.cgSetSystemEventListener('formFocused', (taskId: number, formId: number): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    });
    this.cgSetSystemEventListener('formBlurred', (taskId: number, formId: number): void => {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    });
    this.cgSetSystemEventListener('formFlash', async (taskId: number, formId: number): Promise<void> => {
        if (!this.flist[formId]) {
            return;
        }
        if (this.flist[formId].flash) {
            this.cgRemoveTimer(this.flist[formId].flash);
        }
        this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
        this.flist[formId].flash = true;
        await clickgo.tool.sleep(1000);
        this.flist[formId].flash = false;

    });
};
