import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public get config(): string {
        return JSON.stringify(clickgo.core.config, null, 4).replace(/"icon": "([\s\S]+?)"/g, '"icon": "data:image/..."');
    }

    public async getCdn(): Promise<void> {
        await clickgo.form.dialog(clickgo.core.getCdn());
    }

    public async getAvailArea(): Promise<void> {
        await clickgo.form.dialog(JSON.stringify(clickgo.core.getAvailArea()));
    }

}
