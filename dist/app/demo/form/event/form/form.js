import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    flist = {};
    list = [];
    pushConsole(name, text) {
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'name': name,
            'text': text
        });
    }
    async changeFocus(fid) {
        await clickgo.form.changeFocus(fid);
    }
    onMounted() {
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
    onFormCreated(taskId, formId, title, icon, showInSystemTask) {
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
    onFormRemoved(taskId, formId, title, icon) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId] = undefined;
        delete this.flist[formId];
        this.pushConsole('formRemoved', `taskId: ${taskId}, formId: ${formId}, title: ${title}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormTitleChanged(taskId, formId, title) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = title;
        this.pushConsole('formTitleChanged', `taskId: ${taskId}, formId: ${formId}, title: ${title}`);
    }
    onFormIconChanged(taskId, formId, icon) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].icon = icon;
        this.pushConsole('formIconChanged', `taskId: ${taskId}, formId: ${formId}, icon: ${icon ? icon.slice(0, 10) + '...' : 'null'}`);
    }
    onFormStateMinChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].min = state;
        this.pushConsole('formStateMinChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormStateMaxChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].max = state;
        this.pushConsole('formStateMaxChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormShowChanged(taskId, formId, state) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].show = state;
        this.pushConsole('formShowChanged', `taskId: ${taskId}, formId: ${formId}, state: ${state ? 'true' : 'false'}`);
    }
    onFormFocused(taskId, formId) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = true;
        this.pushConsole('formFocused', `taskId: ${taskId}, formId: ${formId}`);
    }
    onFormBlurred(taskId, formId) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].focus = false;
        this.pushConsole('formBlurred', `taskId: ${taskId}, formId: ${formId}`);
    }
    async onFormFlash(taskId, formId) {
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
    onFormShowInSystemTaskChange(taskId, formId, value) {
        if (!this.flist[formId]) {
            return;
        }
        this.flist[formId].title = value;
        this.pushConsole('formShowInSystemTaskChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}`);
    }
    onFormHashChange(taskId, formId, value, data) {
        if (!this.flist[formId]) {
            return;
        }
        this.pushConsole('formHashChange', `taskId: ${taskId}, formId: ${formId}, value: ${value}, data: ${JSON.stringify(data).slice(0, 20)}...`);
        return;
    }
}
