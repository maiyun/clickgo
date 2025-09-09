import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public fill: boolean = false;

    public async check(): Promise<void> {
        const res = this.refs.content.check();
        await clickgo.form.dialog(this, res ? 'true' : 'false');
    }

}
