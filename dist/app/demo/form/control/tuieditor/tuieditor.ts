import * as clickgo from 'clickgo';
import imgFrm from '../arteditor/img';

export default class extends clickgo.form.AbstractForm {

    public theme = ['light'];

    public themes = ['light', 'dark'];

    public disabled = false;

    public size = ['12px'];

    public family = false;

    public visual = false;

    public text = 'a**b**c';

    public async imgselect(cb: (url: string, opt?: {
        'alt'?: string;
        'width'?: number;
        'height'?: number;
        'align'?: string;
    }) => void): Promise<void> {
        const frm = await clickgo.form.create(imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        cb('https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/' + path);
    }

}
