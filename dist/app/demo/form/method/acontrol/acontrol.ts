import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public async onTouch() {
        await clickgo.form.dialog('OK');
    }

}
