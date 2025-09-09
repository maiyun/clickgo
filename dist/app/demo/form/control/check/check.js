import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.checked1 = false;
        this.checked2 = false;
        this.checked3 = false;
        this.indeterminate1 = false;
        this.indeterminate2 = false;
        this.indeterminate3 = false;
        this.indeterminate4 = false;
        this.disabled = false;
    }
    async onChange(e) {
        e.preventDefault();
        await clickgo.form.dialog(this, 'v: ' + (e.detail.value ? 'true' : 'false') + ', i: ' + (e.detail.indeterminate ? 'true' : 'false'));
    }
}
