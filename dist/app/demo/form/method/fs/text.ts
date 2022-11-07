import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public title = 'Text viewer';

    public content = '';

    public onReceive(obj: Record<string, any>): void {
        if (obj.taskId !== this.taskId) {
            return;
        }
        this.title = (obj.title as string) + ' - Text viewer';
        this.content = obj.content;
    }

}
