import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    checked1 = false;
    checked2 = false;
    checked3 = false;
    indeterminate1 = false;
    indeterminate2 = false;
    indeterminate3 = false;
    indeterminate4 = false;
    disabled = false;
    async onChange(e) {
        e.preventDefault();
        await clickgo.form.dialog(this, 'v: ' + (e.detail.value ? 'true' : 'false') + ', i: ' + (e.detail.indeterminate ? 'true' : 'false'));
    }
}
