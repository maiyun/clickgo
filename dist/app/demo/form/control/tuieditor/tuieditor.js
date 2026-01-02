import * as clickgo from 'clickgo';
import imgFrm from '../arteditor/img';
export default class extends clickgo.form.AbstractForm {
    theme = ['light'];
    themes = ['light', 'dark'];
    disabled = false;
    size = ['12px'];
    family = false;
    visual = false;
    text = 'a**b**c';
    html = '';
    async imgselect(cb) {
        const frm = await clickgo.form.create(this, imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        cb('https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/' + path);
    }
}
