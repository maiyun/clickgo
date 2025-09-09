import * as clickgo from 'clickgo';
class Sd extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.dr = '';
    }
    async newDialog() {
        const frm = await clickgo.form.create(this, Sd);
        this.dr = await frm.showDialog();
    }
}
export default Sd;
