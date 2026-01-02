import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    checked1 = false;
    checked2 = false;
    checked3 = false;
    checked4 = 0;
    checked5 = false;
    disabled = false;
    size = ['m'];
    async onChange(e) {
        e.preventDefault();
        await clickgo.form.dialog(this, 'v: ' + (e.detail.value ? 'true' : 'false'));
    }
}
