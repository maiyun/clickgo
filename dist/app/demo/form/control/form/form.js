import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    width = 300;
    height = 520;
    icon = '';
    title = 'Form';
    min = true;
    max = true;
    cclose = true;
    stateMax = false;
    stateMin = false;
    minWidth = 200;
    minHeight = 100;
    resize = true;
    border = 'normal';
    async showLoading() {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }
    banClose = false;
    onClose(e) {
        if (this.banClose) {
            e.preventDefault();
        }
    }
}
