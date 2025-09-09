import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.btnChecked = false;
        this.btnRadio = '0';
        this.type = ['default'];
        this.area = ['all'];
        this.plain = ['not'];
        this.sizeh = false;
    }
    async dialog(text) {
        await clickgo.form.dialog(this, clickgo.tool.escapeHTML(text));
    }
}
