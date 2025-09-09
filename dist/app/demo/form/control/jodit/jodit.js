import * as clickgo from 'clickgo';
import imgFrm from '../arteditor/img';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.theme = ['light'];
        this.themes = ['light', 'dark'];
        this.disabled = false;
        this.readonly = false;
        this.size = ['12px'];
        this.family = false;
        this.visual = false;
        this.text = '';
        this.html = '<p align="center">123</p>';
        this.htmlc = '';
    }
    async imgselect(cb) {
        const frm = await clickgo.form.create(this, imgFrm);
        const path = await frm.showDialog();
        if (!path) {
            return;
        }
        cb('https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/' + path);
    }
}
