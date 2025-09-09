import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    async alert() {
        await clickgo.form.dialog(this, 'Alert');
    }
}
