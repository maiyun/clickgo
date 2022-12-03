import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public title = 'Text viewer';

    public content = '';

    public onMounted(obj: Record<string, any>): void {
        this.title = (obj.title as string) + ' - Text viewer';
        this.content = obj.content;
    }

}
