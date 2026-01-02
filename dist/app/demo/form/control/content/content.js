import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    fill = false;
    async check() {
        const res = this.refs.content.check();
        await clickgo.form.dialog(this, res ? 'true' : 'false');
    }
}
