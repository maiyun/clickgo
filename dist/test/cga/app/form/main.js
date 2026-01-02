import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    data = 'NONE';
    onMounted() {
        this.data = 'OK';
    }
    async click() {
        await clickgo.form.dialog(this, 'OK');
    }
}
