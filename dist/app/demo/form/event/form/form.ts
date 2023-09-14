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

    public changeFocus(fid: string): void {
        clickgo.form.changeFocus(parseInt(fid));
    }

    public onMounted(): void {
        const list = clickgo.task.getList();
        for (const taskId in list) {
            const flist = clickgo.form.getList(parseInt(taskId));
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

    public onFormCreated(taskId: number, formId: number, title: string, icon: string, showInSystemTask: boolean): void {
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

    public onFormRemoved(taskId: number, formId: number, title: string, icon: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete this.flist[formId];
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }

    public onFormTitleChanged(taskId: number, formId: number, title: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    }

    public onFormIconChanged(taskId: number, formId: number, icon: string): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }

    public onFormStateMinChanged(taskId: number, formId: number, state: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }

    public onFormStateMaxChanged(taskId: number, formId: number, state: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }

    public onFormShowChanged(taskId: number, formId: number, state: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }

    public onFormFocused(taskId: number, formId: number): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    }

    public onFormBlurred(taskId: number, formId: number): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    }

    public async onFormFlash(taskId: number, formId: number): Promise<void> {
        if (!this.flist[formId]) {
            return;
        }
        if (this.flist[formId].flash) {
            clickgo.task.removeTimer(this.flist[formId].flash);
        }
        this.pushConsole('formFlash', `taskId: ${taskId}, formId: ${formId}`);
        this.flist[formId].flash = true;
        await clickgo.tool.sleep(1000);
        this.flist[formId].flash = false;
    }

    public onFormShowInSystemTaskChange(taskId: number, formId: number, value: boolean): void {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = value;
        this.pushConsole('formShowInSystemTaskChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}`);
    }

}
