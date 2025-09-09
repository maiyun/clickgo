import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.list = [];
        this.vclose = false;
        this.vdrag = false;
    }
    drop(e) {
        this.list.splice(e.detail.after, 0, this.list.splice(e.detail.before, 1)[0]);
    }
}
