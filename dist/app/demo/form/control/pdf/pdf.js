import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.access = {
            'pdf': undefined
        };
        this.src = '';
        this.page = '1';
    }
    onLoaded(pdf) {
        this.access.pdf = pdf;
    }
    async onView(e) {
        await clickgo.form.dialog(this, JSON.stringify(e.detail));
    }
    // --- 加载 pdf ---
    load() {
        this.src = '/package/form/control/pdf/test.pdf';
    }
    select() {
        this.refs.file.select();
    }
    async change(files) {
        if (!files) {
            return;
        }
        await this.refs.pdf.load(files[0]);
    }
}
