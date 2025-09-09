import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.fill = false;
    }
    async check() {
        const res = this.refs.content.check();
        await clickgo.form.dialog(this, res ? 'true' : 'false');
    }
}
