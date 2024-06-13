import * as clickgo from 'clickgo';
import imgFrm from '../arteditor/img';

export default class extends clickgo.form.AbstractForm {

    public theme = ['light'];

    public themes = ['light', 'dark'];

    public disabled = false;

    public readonly = false;

    public size = ['12px'];

    public family = false;

    public visual = false;

    public text = '';

    public html = '<p align="center">123</p>';

    public async videoselect() {
        await clickgo.form.dialog('Sorry, video can not be upload.');
    }

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
