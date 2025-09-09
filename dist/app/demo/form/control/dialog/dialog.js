import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.message = 'message';
        this.buttons = ['OK'];
        this.btn = 'none';
        this.width = false;
        this.fwidth = false;
        this.padding = true;
        this.fill = false;
    }
}
