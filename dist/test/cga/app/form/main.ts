import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public data = 'NONE';

    public onMounted(): void {
        this.data = 'OK';
    }

    public async click(): Promise<void> {
        await clickgo.form.dialog('OK');
    }

}
