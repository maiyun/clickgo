import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public btnChecked = false;

    public btnRadio = 0;

    public type = 'default';

    public area = 'all';

    public plain = 'not';

    public async dialog(text: string): Promise<void> {
        await clickgo.form.dialog(text);
    }

}
