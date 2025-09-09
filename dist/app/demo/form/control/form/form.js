import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.width = 300;
        this.height = 520;
        this.icon = '';
        this.title = 'Form';
        this.min = true;
        this.max = true;
        this.cclose = true;
        this.stateMax = false;
        this.stateMin = false;
        this.minWidth = 200;
        this.minHeight = 100;
        this.resize = true;
        this.border = 'normal';
        this.banClose = false;
    }
    async showLoading() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
    onClose(e) {
        if (this.banClose) {
            e.preventDefault();
        }
    }
}
