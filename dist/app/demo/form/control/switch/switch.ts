import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public checked1 = false;

    public checked2 = false;

    public checked3 = false;

    public checked4 = 0;

    public checked5 = false;

    public disabled = false;

    public size = ['m'];

    public async onChange(e: clickgo.control.ISwitchChangeEvent): Promise<void> {
        e.preventDefault();
        await clickgo.form.dialog(this, 'v: ' + (e.detail.value ? 'true' : 'false'));
    }

}
