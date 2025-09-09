import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public async alert(): Promise<void> {
        await clickgo.form.dialog(this, 'Alert');
    }

}
