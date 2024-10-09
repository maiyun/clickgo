import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public list = [0, 1, 2];

    public async check(): Promise<void> {
        const res = this.refs.content.check();
        await clickgo.form.dialog(res ? 'true' : 'false');
    }

}
