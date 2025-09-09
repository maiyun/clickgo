import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public flist: Record<string, any> = {};

    public list: any[] = [];

    public pushConsole(name: string, text: string): void {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }

    public async changeFocus(fid: string): Promise<void> {
        await clickgo.form.changeFocus(fid);
    }

    public onMounted(): void {
        const list = clickgo.task.getOriginList(this);
        for (const taskId in list) {
            const flist = clickgo.form.getList(taskId);
            for (const fid in flist) {
                this.flist[fid] = {
                    'title': flist[fid].title,
                    'icon': flist[fid].icon,
                    'stateMax': flist[fid].stateMax,
                    'stateMin': flist[fid].stateMin,
                    'show': flist[fid].show,
                    'focus': flist[fid].focus,
                    'flash': false,
                    'showInTask': flist[fid].showInSystemTask
                };
            }
        }
    }

    public onFormCreated(taskId: string, formId: string, title: string, icon: string, showInSystemTask: boolean): void {
        this.flist[formId] = {
            'title': title,
            'icon': icon,
            'stateMax': false,
            'stateMin': false,
            'show': false,
            'focus': false,
            'flash': false,
            'showInTask': true
        };
        this.pushConsole('formCreated', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}, sist: ${showInSystemTask ? 'true' : 'false'}`);
    }

    public onFormRemoved(taskId: string, formId: string, title: string, icon: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete this.flist[formId];
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }

    public onFormTitleChanged(taskId: string, formId: string, title: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    }

    public onFormIconChanged(taskId: string, formId: string, icon: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }

    public onFormStateMinChanged(taskId: string, formId: string, state: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }

    public onFormStateMaxChanged(taskId: string, formId: string, state: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }

    public onFormShowChanged(taskId: string, formId: string, state: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }

    public onFormFocused(taskId: string, formId: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    }

    public onFormBlurred(taskId: string, formId: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    }

    public async onFormFlash(taskId: string, formId: string): Promise<void> {
        if (!this.flist[formId]) {
            return;
        }
        if (this.flist[formId].flash) {
            clickgo.task.removeTimer(this, this.flist[formId].flash);
        }
        this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
        this.flist[formId].flash = true;
        await clickgo.tool.sleep(1000);
        this.flist[formId].flash = false;
    }

    public onFormShowInSystemTaskChange(taskId: string, formId: string, value: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = value;
        this.pushConsole('formShowInSystemTaskChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}`);
    }

    public onFormHashChange(taskId: string, formId: string, value: string, data: Record<string, any>): void {
        if (!this.flist[formId]) {
            return;
        }
        this.pushConsole('formHashChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}, data: ${JSON.stringify(data).slice(0, 20)}...`);
        return;
    }

}
