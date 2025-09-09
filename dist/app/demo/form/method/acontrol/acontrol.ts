import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public async onTouch(): Promise<void> {
        await clickgo.form.dialog(this, 'OK');
    }

}
