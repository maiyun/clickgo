import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    list = [];
    vclose = false;
    vdrag = false;
    drop(e) {
        this.list.splice(e.detail.after, 0, this.list.splice(e.detail.before, 1)[0]);
    }
}
