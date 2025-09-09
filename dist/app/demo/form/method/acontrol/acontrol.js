import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    async onTouch() {
        await clickgo.form.dialog(this, 'OK');
    }
}
