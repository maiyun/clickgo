import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public width = 300;

    public height = 520;

    public icon = '';

    public title = 'Form';

    public min = true;

    public max = true;

    public cclose = true;

    public stateMax = false;

    public stateMin = false;

    public minWidth = 200;

    public minHeight = 100;

    public resize = true;

    public border = 'normal';

    public async showLoading(): Promise<void> {
        this.loading = true;
        await clickgo.tool.sleep(1000);
        this.loading = false;
    }

    public banClose = false;

    public onClose(e: types.IFormCloseEvent) {
        if (this.banClose) {
            e.preventDefault();
        }
    }

}
