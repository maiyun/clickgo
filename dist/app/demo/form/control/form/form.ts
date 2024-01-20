import * as clickgo from 'clickgo';

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

    public floading = false;

    public border = 'normal';

    public async showLoading(): Promise<void> {
        this.floading = true;
        await clickgo.tool.sleep(1000);
        this.floading = false;
    }

}
