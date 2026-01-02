import * as clickgo from 'clickgo';
import imgFrm from './img';
export default class extends clickgo.form.AbstractForm {
    readonly = false;
    disabled = false;
    size = ['12px'];
    family = false;
    value = [
        {
            'type': 'p',
            'value': 'This is a paragraph. You can say whatever you want to say, I won\'t stop you. Just like a bird can fly in the sky as long as it likes.'
        }
    ];
    async imgselect(cb) {
        const frm = await clickgo.form.create(this, imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        cb(path);
    }
}
