import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public list: string[] = [];

    public vclose: boolean = false;

    public vdrag: boolean = false;

    public drop(e: clickgo.control.ITagDropEvent): void {
        this.list.splice(e.detail.after, 0, this.list.splice(e.detail.before, 1)[0]);
    }

}
