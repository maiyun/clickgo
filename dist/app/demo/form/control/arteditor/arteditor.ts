import * as clickgo from 'clickgo';
import imgFrm from './img';

export default class extends clickgo.form.AbstractForm {

    public readonly = false;

    public disabled = false;

    public size = ['12px'];

    public family = false;

    public value = [
        {
            'type': 'p',
            'value': 'This is a paragraph. You can say whatever you want to say, I won\'t stop you. Just like a bird can fly in the sky as long as it likes.'
        }
    ];

    public async imgselect(cb: (url: string) => void): Promise<void> {
        const frm = await clickgo.form.create(imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        cb(path);
    }
}
