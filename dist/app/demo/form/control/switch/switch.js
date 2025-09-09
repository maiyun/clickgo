import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.checked1 = false;
        this.checked2 = false;
        this.checked3 = false;
        this.checked4 = 0;
        this.checked5 = false;
        this.disabled = false;
        this.size = ['m'];
    }
    async onChange(e) {
        e.preventDefault();
        await clickgo.form.dialog(this, 'v: ' + (e.detail.value ? 'true' : 'false'));
    }
}
