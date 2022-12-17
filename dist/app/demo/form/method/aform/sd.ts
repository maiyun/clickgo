import * as clickgo from 'clickgo';

class Sd extends clickgo.form.AbstractForm {

    public dr = '';

    public async newDialog(): Promise<void> {
        const frm = await Sd.create();
        if (typeof frm === 'number') {
            return;
        }
        this.dr = await frm.showDialog();
    }

}

export default Sd;
