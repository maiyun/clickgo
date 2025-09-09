import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public value = 'radio1';

    public disabled = false;

    public async onChange(e: clickgo.control.IRadioChangeEvent): Promise<void> {
        if (e.detail.selected !== 'radio2') {
            return;
        }
        e.preventDefault();
        await clickgo.form.dialog(this, 'selected: ' + e.detail.selected + ', value: ' + e.detail.value);
    }

}
