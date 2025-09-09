import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.radio = 'radio1';
        this.check1 = true;
        this.check2 = false;
        this.check3 = true;
    }
    onCheck(event) {
        event.preventDefault();
    }
    async onRadio(event, o, n) {
        if (o !== 'radio2') {
            return;
        }
        event.preventDefault();
        await clickgo.form.dialog(this, 'When the value is set to "radio2," this option cannot be selected. Now is: ' + n);
    }
}
