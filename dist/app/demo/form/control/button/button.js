import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    btnChecked = false;
    btnRadio = '0';
    bgroupRadio = '0';
    type = ['default'];
    area = ['all'];
    plain = ['not'];
    sizeh = false;
    async dialog(text) {
        await clickgo.form.dialog(this, clickgo.tool.escapeHTML(text));
    }
}
