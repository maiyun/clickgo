import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.value = 'radio1';
        this.disabled = false;
    }
    async onChange(e) {
        if (e.detail.selected !== 'radio2') {
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog(this, 'selected: ' + e.detail.selected + ', value: ' + e.detail.value);
    }
}
