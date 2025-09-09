import * as clickgo from 'clickgo';
import imgFrm from './img';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.readonly = false;
        this.disabled = false;
        this.size = ['12px'];
        this.family = false;
        this.value = [
            {
                'type': 'p',
                'value': 'This is a paragraph. You can say whatever you want to say, I won\'t stop you. Just like a bird can fly in the sky as long as it likes.'
            }
        ];
    }
    async imgselect(cb) {
        const frm = await clickgo.form.create(this, imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        cb(path);
    }
}
